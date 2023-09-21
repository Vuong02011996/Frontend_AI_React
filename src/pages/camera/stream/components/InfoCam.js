import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Select, Tag, Typography } from 'antd';
import { useSelector, useDispatch, useParams } from 'umi';
import classNames from 'classnames/bind';
import styles from './InfoCam.module.scss';

import { variables_stream } from '../utils/variables_stream';

const cx = classNames.bind(styles);

export default function InfoCam({ job, setJob }) {
    const dispatch = useDispatch();
    const params = useParams();

    const [
        loading,
        { name_cam, position_cam, class_cam, branch_cam },
    ] = useSelector(({ loading: { effects }, stream }) => [effects, stream]);

    const handleChangeJob = (value) => {
        setJob(value);
        // dispatch({
        //     type: 'stream/GET_DATA',
        //     payload: {
        //         id: params.id,
        //     },
        // });
        // dispatch({
        //     type: 'attendanceConfig/GET_CURRENT_CONFIG',
        //     payload: {
        //         ...params,
        //     },
        // });
    };
    return (
        <Row className={cx('wraper')}>
            <Col span={16}>
                <h5 className={cx('info_header')}>Thông tin camera</h5>
                <div className={cx('info_content')}>
                    <Row className={cx('row_info')}>
                        <Col span={12}>
                            <p className={cx('info_content_heading')}>Tên Camera </p>
                            <Typography.Text className={cx('info_content_text')}> {name_cam}</Typography.Text>
                        </Col>
                        <Col span={12}>
                            <p className={cx('info_content_heading')}>Vị trí </p>
                            <Typography.Text className={cx('info_content_text')}> {position_cam}</Typography.Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <p className={cx('info_content_heading')}>Cơ sở </p>
                            <Typography.Text className={cx('info_content_text')}> {branch_cam}</Typography.Text>
                        </Col>
                        <Col span={12}>
                            <p className={cx('info_content_heading')}>Lớp</p>
                            <Typography.Text className={cx('info_content_text')}> {class_cam}</Typography.Text>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col span={8}>
                <h5 className={cx('info_header')}> Nhiệm vụ </h5>
                <Select className={cx('select')} defaultValue={job} value={job} onChange={handleChangeJob}>
                    <Select.Option
                        className={cx('select_option')}
                        value={variables_stream.JOBS.DIEMDANH}
                        label={variables_stream.JOBS.DIEMDANH}
                    >
                        <Tag color="red">{variables_stream.JOBS.DIEMDANH}</Tag>
                    </Select.Option>
                    <Select.Option
                        className={cx('select_option')}
                        value={variables_stream.JOBS.TRANTROC}
                        label={variables_stream.JOBS.TRANTROC}
                    >
                        <Tag color="orange">{variables_stream.JOBS.TRANTROC}</Tag>
                    </Select.Option>
                    <Select.Option
                        className={cx('select_option')}
                        value={variables_stream.JOBS.VUNGNGUYHIEM}
                        label={variables_stream.JOBS.VUNGNGUYHIEM}
                    >
                        <Tag color="blue">{variables_stream.JOBS.VUNGNGUYHIEM}</Tag>
                    </Select.Option>
                    <Select.Option
                        className={cx('select_option')}
                        value={variables_stream.JOBS.TENGA}
                        label={variables_stream.JOBS.TENGA}
                    >
                        <Tag color="green">{variables_stream.JOBS.TENGA}</Tag>
                    </Select.Option>
                </Select>
            </Col>
        </Row>
    );
}

InfoCam.propTypes = {
    job: PropTypes.string.isRequired,
    setJob: PropTypes.func.isRequired,
};
