import classNames from 'classnames/bind';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Typography, Row, Col, Modal, Button } from 'antd';
import moment from 'moment';
import styles from './SleeplessResult.module.scss';
import ZoomableAvatar from '../ZoomableAvatar';

const cx = classNames.bind(styles);

function InfoResultSleepless(props) {
    const { roi_image_url, image_url, region_name, class_name, branch_name, createdAt } = props;

    const secondToStringTimezone = (seconds) => {
        let formattedTime = moment.unix(seconds).format('dddd, DD MMMM , YYYY HH:mm:ss A');
        // formattedTime = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
        return formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
    };

    return (
        <>
            <Row className={cx('info')}>
                <Col span={8} className={cx('info__student')}>
                    {/* <div className={cx('info__student__avatar')}> */}
                    <ZoomableAvatar size="large" src={roi_image_url} className={cx('info__match__avatar')}>
                        {/* {image_url ? '' : 'image_url'} */}
                    </ZoomableAvatar>
                    {/* </div> */}
                    <div className={cx('info__text')}>
                        <Typography.Text className={cx('info__text__des')}>
                            Lớp : {class_name || 'Chưa có'}
                        </Typography.Text>
                        <Typography.Text className={cx('info__text__des')}>
                            Cơ sở: {branch_name || 'Chưa có'}
                        </Typography.Text>
                        <Typography.Text className={cx('info__text__des')}>
                            Vùng : {region_name || 'Chưa có'}
                        </Typography.Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div className={cx('info__text')}>
                        <Typography.Text className={cx('info__text__des')}>
                            {secondToStringTimezone(createdAt?.seconds)}
                        </Typography.Text>
                    </div>
                </Col>

                <Col span={8} className={cx('info__match')}>
                    <ZoomableAvatar size="large" src={image_url} className={cx('info__match__avatar')}>
                        {/* {image_url ? '' : 'image_url'} */}
                    </ZoomableAvatar>
                </Col>
            </Row>
        </>
    );
}

InfoResultSleepless.propTypes = {
    roi_image_url: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    class_name: PropTypes.string.isRequired,
    branch_name: PropTypes.string.isRequired,
    region_name: PropTypes.string.isRequired,
    createdAt: PropTypes.object.isRequired,
};

export default InfoResultSleepless;
