import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Row, Col, Form, TimePicker, Button, notification, Modal, InputNumber } from 'antd';
import { useSelector, useDispatch, useParams } from 'umi';
import classNames from 'classnames/bind';
import moment from 'moment';
import { isEmpty, size, difference } from 'lodash';
import { Stage, Layer, Circle, Arrow, Group, Line } from 'react-konva';
import PropTypes from 'prop-types';
import { Helper, variables } from '@/utils';
import styles from './SleeplessConfig.module.scss';
import LayerComponent from '../LayerComponent';
import FlvPlayer from '../../../stream_flv/FlvPlayer';

const cx = classNames.bind(styles);

export default function SleeplessConfig() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const params = useParams();
    const [
        loading,
        { coordinates, from_time, to_time, status_process, process_name, frame_url, duration_time },
    ] = useSelector(({ loading: { effects }, sleeplessConfig }) => [effects, sleeplessConfig]);
    // coord đặt tên biến khác với coordinates lấy từ store redux
    // const [coord, setCoord] = useState(
    //     !isEmpty(coordinates)
    //         ? coordinates
    //         : [
    //               [0.16, 0.34],
    //               [0.16, 0.91],
    //               [0.71, 0.16],
    //               [0.71, 0.91],
    //           ],
    // );

    const [coordItems, setCoordItems] = useState(
        !isEmpty(coordinates)
            ? coordinates
            : [
                  {
                      name_regions: 'Vùng 1',
                      coord: [
                          [0.16, 0.34],
                          [0.16, 0.91],
                          [0.71, 0.16],
                          [0.71, 0.91],
                      ],
                  },
              ],
    );

    const [processName, setProcessName] = useState(process_name);
    const [statusProcess, setStatusProcess] = useState(status_process);
    const [durationTime, setDurationTime] = useState(duration_time);

    // Load cấu hình(tọa độ, thời gian) điểm danh từ store nếu có thay đổi(onChangeDate)
    // Mỗi khi onLoad lấy cấu hình config GET_CURRENT_CONFIG sẽ gọi và useEffect này.
    useEffect(() => {
        if (!isEmpty(coordinates) && difference(coordinates, coordItems)) {
            // setCoord(coordinates);
            setCoordItems(coordinates);
        }
        // Trường hợp chưa có coordinates từ redux store (mảng rỗng)
        if (isEmpty(coordinates)) {
            // setCoord([
            //     [0.16, 0.34],
            //     [0.16, 0.91],
            //     [0.71, 0.16],
            //     [0.71, 0.91],
            // ]);
            setCoordItems([
                {
                    name_regions: 'Vùng 1',
                    coord: [
                        [0.7, 0.34],
                        [0.7, 0.41],
                        [0.8, 0.34],
                        [0.8, 0.41],
                    ],
                },
            ]);
        }
        setStatusProcess(status_process);
        setProcessName(process_name);
        setDurationTime(duration_time);
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
    }, [from_time, to_time, status_process, process_name, coordinates, duration_time]);

    // Update thời gian bắt đầu và kết vào store
    const onChangeDate = (value, key) => {
        // Khi dữ liệu ở thay đổi sẽ update vào store from_time và to_time thì sẽ chạy useEffect ở trên và set lại FieldsValue
        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_TIME',
            payload: {
                [key]: value,
            },
        });
    };
    // Update thời gian vào vùng an toàn vào store
    const onChangeDuration = (value, key) => {
        setDurationTime(value);
        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_TIME',
            payload: {
                [key]: value,
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
    //  Ở đây dùng cách 1 , chỉ update thời gian config khi bấm vào button Lưu Cấu Hình
    const handleSaveConfig = () => {
        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_TO_DB',
            payload: {
                ...params,
                jobs_cam: {
                    sleepless: {
                        from_time,
                        to_time,
                        duration_time,
                    },
                },
            },
            callback: () => {},
        });
    };

    const startRollCall = () => {
        dispatch({
            type: 'sleeplessConfig/START',
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
                            description: `Có lỗi từ server!${response.message}`,
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
            type: 'sleeplessConfig/STOP',
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

    const onLoad = () => {
        dispatch({
            type: 'sleeplessConfig/GET_CURRENT_CONFIG',
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
            return 'Chức năng phát hiện trằn trọc chưa chạy trên camera. Bạn có thể bấm start để chạy';
        }
        return 'Chức năng phát hiện trằn trọc đang chạy trên camera. Bạn có thể bấm stop rồi start để chạy lại';
    }

    // Vẽ vùng trên image
    const ref = useRef();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [isDraw, setIsDraw] = useState(false);
    const onDraw = () => {
        setIsDraw((prev) => !prev);
    };
    // const onChangeLayer = (coord) => {
    //     setCoord(coord);
    // };
    const onChangeLayer = (coord, indexLayer) => {
        // onChangeLayer update lại tọa độ mỗi khi vẽcoord chính là tọa độ của vùng hiện tại
        // Sẽ lặp qua tất cả các vùng , nếu đang vẽ vùng nào thì update lại tọa độ vùng đó,
        // Không thì lấy lại vùng đó giữ nguyên tọa độ không thay đổi
        setCoordItems((prev) => prev?.map((item, index) => (index === indexLayer ? { ...item, coord } : item)));
    };

    const handleAddRegion = () => {
        // Mỗi khi bấm thêm vùng thì add thêm một vùng
        setCoordItems((prev) => [
            ...prev,
            {
                name_regions: `Vùng ${size(prev) + 1}`,
                coord: [
                    [0.7, 0.34],
                    [0.7, 0.41],
                    [0.8, 0.34],
                    [0.8, 0.41],
                ],
            },
        ]);
    };
    // End Vẽ vùng trên image

    // Config modal draw region
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
    // Button Hoàn tất vẽ trên modal sẽ lưu giữ liệu vùng vào DB.
    const handleOk = () => {
        setIsModalVisible(false);
        setIsDraw((prev) => !prev);
        // Gọi api update lại vùng trong db camera AI và store redux
        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_TO_DB',
            payload: {
                ...params,
                jobs_cam: {
                    sleepless: {
                        coordinates: coordItems,
                    },
                },
            },
            callback: () => {},
        });
        // update lại store
        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_COORDINARITE',
            payload: {
                coordinates: coordItems,
            },
        });
    };
    const handleDelete = () => {
        const coordItemsReset = [
            {
                name_regions: 'Vùng 1',
                coord: [
                    [0.7, 0.34],
                    [0.7, 0.41],
                    [0.8, 0.34],
                    [0.8, 0.41],
                ],
            },
        ];

        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_TO_DB',
            payload: {
                ...params,
                jobs_cam: {
                    sleepless: {
                        coordinates: coordItemsReset,
                    },
                },
            },
            callback: () => {},
        });
        // update lại store
        dispatch({
            type: 'sleeplessConfig/UPDATE_CONFIG_COORDINARITE',
            payload: {
                coordinates: coordItemsReset,
            },
        });

        setCoordItems(coordItemsReset);
    };
    // End Config modal draw region

    // Show video have region Modal
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const [urlStreamRegion, setUrlStreamRegion] = useState(null);
    const showVideo = () => {
        dispatch({
            type: 'stream/GET_DATA_SHOW_STREAM',
            payload: {
                id: params.id,
                show_region: 'sleepless',
            },
            callback: (response) => {
                if (response) {
                    console.log('response GET_DATA_SHOW_STREAM: ', response);
                    setUrlStreamRegion(response.url_stream_flv);
                } else {
                    notification.error({
                        message: 'THÔNG BÁO',
                        description: 'Không nhận response từ api',
                    });
                }
            },
        });

        setIsVideoVisible(true);
    };
    const handleCancelVideo = () => {
        setIsVideoVisible(false);
    };
    const handleOkVideo = () => {
        setIsModalVisible(false);
    };

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
                    <Button key="add" onClick={handleAddRegion} type="primary" ghost>
                        Thêm vùng
                    </Button>,

                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        loading={loading['sleeplessConfig/UPDATE_CONFIG_TO_DB']}
                    >
                        Hoàn tất vẽ
                    </Button>,

                    <Button key="cancel" type="primary" onClick={handleDelete} danger>
                        Xóa
                    </Button>,
                    <Button key="back" onClick={handleCancel} danger>
                        Đóng
                    </Button>,
                ]}
            >
                <div className={cx('modal__wrapper')} ref={ref}>
                    {<img src={frame_url} alt="Ảnh từ frame_url null" className={cx('modal__image')} />}
                    {
                        // width && height &&
                        <Stage className={cx('modal__stage')} width={width} height={height}>
                            {coordItems?.map((item, index) => (
                                <LayerComponent
                                    width={width}
                                    height={height}
                                    coordinates={item.coord}
                                    key={index}
                                    // onChangeLayer={onChangeLayer}
                                    // coord chính là tọa độ của vùng hiện tại
                                    onChangeLayer={(coord) => onChangeLayer(coord, index)}
                                    isDraw={isDraw}
                                />
                            ))}
                        </Stage>
                    }
                </div>
            </Modal>

            <Modal
                className={cx('modal')}
                title="Video Stream"
                visible={isVideoVisible}
                onOk={handleOkVideo}
                onCancel={handleCancelVideo}
                // Bỏ animation mặc định của Modal antd.
                transitionName=""
                maskTransitionName=""
                footer={[
                    <Button key="back" onClick={handleCancelVideo} danger>
                        Đóng
                    </Button>,
                ]}
            >
                <div className={cx('modal__wrapper')} ref={ref}>
                    {/* {<img src={frame_url} alt="Ảnh từ frame_url null" className={cx('modal__image')} />} */}

                    {urlStreamRegion && <FlvPlayer url_stream_flv={urlStreamRegion} />}
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
                        loading={loading['sleeplessConfig/START']}
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
                        loading={loading['sleeplessConfig/STOP']}
                    >
                        Stop
                    </Button>
                </Col>
            </Row>

            <Form form={form} layout="vertical" className={cx('wraper__form')}>
                <h5 className={cx('wraper__form__header')}> Thông tin cấu hình: </h5>
                <Row>
                    <Col>
                        <div className={cx('wraper__form__draw_btn')}>
                            <p> Vẽ vùng bé nằm ngủ</p>
                            <Button
                                // color="dash-success"
                                type="primary"
                                className="ml50"
                                onClick={showModal}
                            >
                                Vẽ vùng
                            </Button>
                            <Button
                                // color="dash-success"
                                type="primary"
                                className="ml50"
                                onClick={showVideo}
                            >
                                Video
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className={cx('wraper__form__config_time')}>
                            <p> Thời gian bé trằn trọc (phút)</p>
                            <InputNumber
                                className="ml50"
                                placeholder="Nhập"
                                min={0}
                                value={durationTime}
                                onChange={(value) => onChangeDuration(value, 'duration_time')}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="Thời gian bắt đầu" name="from_time">
                            <TimePicker
                                value={from_time}
                                format={variables.DATE_FORMAT.HOUR}
                                minuteStep={5}
                                onChange={(value) => onChangeDate(value, 'from_time')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Thời gian kết thúc" name="end_time">
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
                            loading={loading['sleeplessConfig/UPDATE_CONFIG_TO_DB']}
                        >
                            Lưu Cấu hình
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
