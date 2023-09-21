import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Row, Col, Form, TimePicker, Button, notification, Modal } from 'antd';
import { useSelector, useDispatch, useParams } from 'umi';
import classNames from 'classnames/bind';
import moment from 'moment';
import { isEmpty, size, difference } from 'lodash';
import { Stage, Layer, Circle, Arrow, Group, Line } from 'react-konva';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import styles from './AttendanceConfig.module.scss';
import LayerComponent from '../LayerComponent';

const cx = classNames.bind(styles);

export default function AttendanceConfig() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const params = useParams();
    const [
        loading,
        { coordinates, from_time, to_time, status_process, process_name, frame_url },
    ] = useSelector(({ loading: { effects }, attendanceConfig }) => [effects, attendanceConfig]);
    // coord đặt tên biến khác với coordinates lấy từ store redux
    const [coord, setCoord] = useState(
        !isEmpty(coordinates)
            ? coordinates
            : [
                  [0.16, 0.34],
                  [0.16, 0.91],
                  [0.71, 0.16],
                  [0.71, 0.91],
              ],
    );
    const [processName, setProcessName] = useState(process_name);
    const [statusProcess, setStatusProcess] = useState(status_process);

    // Load cấu hình(tọa độ, thời gian) điểm danh từ store nếu có thay đổi(onChangeDate)
    // Mỗi khi onLoad lấy cấu hình config GET_CURRENT_CONFIG sẽ gọi và useEffect này.
    useEffect(() => {
        if (!isEmpty(coordinates) && size(coordinates) === 4 && difference(coordinates, coord)) {
            setCoord(coordinates);
        }
        if (isEmpty(coordinates) || size(coordinates) !== 4) {
            setCoord([
                [0.16, 0.34],
                [0.16, 0.91],
                [0.71, 0.16],
                [0.71, 0.91],
            ]);
        }
        setStatusProcess(status_process);
        setProcessName(process_name);
        // kiểm tra dữ liệu lấy từ DB AI lưu vào store là null hay không(null là chưa có dữ liệu thời gian trên DB)
        if (from_time !== null) {
            form.setFieldsValue({
                from_time: moment(from_time),
            });
        }
        if (to_time !== null) {
            form.setFieldsValue({
                end_time: moment(to_time),
            });
        }
    }, [from_time, to_time, status_process, process_name, coordinates]);

    const onChangeDate = (value, key) => {
        // Khi dữ liệu ở thay đổi sẽ update vào store from_time và to_time thì sẽ chạy useEffect ở trên và set lại FieldsValue
        dispatch({
            type: 'attendanceConfig/UPDATE_CONFIG_TIME',
            payload: {
                [key]: value,
            },
        });
    };

    const startRollCall = () => {
        dispatch({
            type: 'attendanceConfig/START',
            payload: {
                id: params.id,
            },
            callback: (response) => {
                if (response) {
                    if (response.status === true) {
                        setProcessName(response.process_name);
                        setStatusProcess(response.status_process);
                        notification.success({
                            message: 'THÔNG BÁO',
                            description: response.message,
                        });
                    } else {
                        notification.error({
                            message: 'THÔNG BÁO',
                            description: `Có lỗi từ server! ${response.message}`,
                        });
                    }
                } else {
                    notification.error({
                        message: 'THÔNG BÁO',
                        description: 'Không nhận response từ api',
                    });
                }
            },
        });
    };

    const stopRollCall = () => {
        dispatch({
            type: 'attendanceConfig/STOP',
            payload: {
                process_name: processName,
            },
            callback: (response) => {
                if (response) {
                    if (response.status === true) {
                        notification.success({
                            message: 'THÔNG BÁO',
                            description: response.message,
                        });
                    } else {
                        notification.error({
                            message: 'THÔNG BÁO',
                            description: `Có lỗi từ server! ${response.message}`,
                        });
                    }
                } else {
                    notification.error({
                        message: 'THÔNG BÁO',
                        description: 'Không nhận response từ api',
                    });
                }
            },
        });
    };

    // Trường hợp này khi bấm Lưu cấu hình sẽ vừa gọi api vừa update dữ liệu trên store
    // Có 3 cách xử lí: Phú sử dụng cách 1
    /**
     * Cách 1. dispatch action mỗi khi onChangeDate để update lại state khi thời gian thay đổi.
     * Trong service sau khi gọi api update dữ liệu lên DB không làm ở store cả.
     * Cách 2. dispatch action mỗi khi handleSaveConfig vừa gọi api xong sẽ dùng callback dispatch tiếp một action
     * để update dữ liệu lên store.
     * Cách 3: Dùng saga.put SET lại data sau khi saga.call
     */
    const handleSaveConfig = () => {
        dispatch({
            type: 'attendanceConfig/UPDATE_CONFIG_TO_DB',
            payload: {
                ...params,
                jobs_cam: {
                    roll_call: {
                        from_time,
                        to_time,
                    },
                },
            },
            callback: () => {},
        });
    };

    const onLoad = () => {
        dispatch({
            type: 'attendanceConfig/GET_CURRENT_CONFIG',
            payload: {
                ...params,
            },
        });
    };

    useEffect(() => {
        onLoad();
    }, [params.id]);

    function showStatus() {
        if (!statusProcess || statusProcess === 'NOT_RUN') {
            return 'Chức năng điểm danh chưa chạy trên camera. Bạn có thể bấm start để chạy';
        }
        return 'Chức năng điểm danh đang chạy trên camera. Bạn có thể bấm stop rồi start để chạy lại';
    }

    // Vẽ vùng trên image
    const ref = useRef();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [isDraw, setIsDraw] = useState(false);
    const onChangeLayer = (coord) => {
        setCoord(coord);
    };
    const onDraw = () => {
        setIsDraw((prev) => !prev);
    };
    // End Vẽ vùng trên image

    // Config modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
        onDraw();
        setTimeout(() => {
            setWidth(ref.current.clientWidth);
            setHeight(ref.current.clientHeight);
        }, 500);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setIsDraw((prev) => !prev);
    };
    // Button Hoàn tất vẽ trên modal
    const handleOk = () => {
        setIsModalVisible(false);
        setIsDraw((prev) => !prev);
        // Gọi api update lại vùng trong db camera AI và store redux
        dispatch({
            type: 'attendanceConfig/UPDATE_CONFIG_TO_DB',
            payload: {
                ...params,
                jobs_cam: {
                    roll_call: {
                        coordinates: coord,
                    },
                },
            },
            callback: () => {},
        });
    };
    // End Config modal

    return (
        <div className={cx('wraper')}>
            <Modal
                className={cx('modal')}
                title="Vẽ vùng"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                // Bỏ animation mặc định của Modal antd.
                transitionName=""
                maskTransitionName=""
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        loading={loading['attendanceConfig/UPDATE_CONFIG_TO_DB']}
                    >
                        Hoàn tất vẽ
                    </Button>,
                ]}
            >
                <div className={cx('modal__wrapper')} ref={ref}>
                    <img src={frame_url} alt="Ảnh từ frame_url" className={cx('modal__image')} />
                    <Stage className={cx('modal__stage')} width={width} height={height}>
                        <LayerComponent
                            width={width}
                            height={height}
                            coordinates={coord}
                            onChangeLayer={onChangeLayer}
                            isDraw={isDraw}
                        />
                    </Stage>
                </div>
            </Modal>

            <Row className={cx('wraper__status')}>
                <Col span={16}>
                    <p className={cx('wraper__status__test')}>{showStatus()} </p>
                </Col>
                <Col span={4}>
                    <Button
                        color="success"
                        className={cx('color_red')}
                        onClick={startRollCall}
                        disabled={statusProcess === 'RUNNING'}
                        loading={loading['attendanceConfig/START']}
                    >
                        Start
                    </Button>
                </Col>
                <Col span={4}>
                    <Button
                        // color="dash-success"
                        className="ml0"
                        disabled={statusProcess === 'NOT_RUN'}
                        onClick={stopRollCall}
                        loading={loading['attendanceConfig/STOP']}
                    >
                        Stop
                    </Button>
                </Col>
            </Row>

            <Form form={form} layout="vertical" className={cx('wraper__form')}>
                <h5 className={cx('wraper__form__header')}> Thông tin cấu hình: </h5>
                {/* Điểm danh hiện tại chưa cần nút vẽ vùng */}
                {/* <Row>
                    <Col>
                        <Button
                            // color="dash-success"
                            className="ml50"
                            onClick={showModal}
                        >
                            Vẽ vùng
                        </Button>
                    </Col>
                </Row> */}
                <Row>
                    <Col span={8}>
                        <Form.Item label="Bắt đầu điểm danh" name="from_time">
                            <TimePicker
                                value={from_time}
                                format={variables.DATE_FORMAT.HOUR}
                                minuteStep={5}
                                onChange={(value) => onChangeDate(value, 'from_time')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Kết thúc điểm danh" name="end_time">
                            <TimePicker
                                value={to_time}
                                format={variables.DATE_FORMAT.HOUR}
                                minuteStep={5}
                                onChange={(value) => onChangeDate(value, 'to_time')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} className={cx('wraper__form__button')}>
                        <Button
                            color="success"
                            className="ml50"
                            onClick={handleSaveConfig}
                            loading={loading['attendanceConfig/UPDATE_CONFIG_TO_DB']}
                        >
                            Lưu Cấu hình
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
