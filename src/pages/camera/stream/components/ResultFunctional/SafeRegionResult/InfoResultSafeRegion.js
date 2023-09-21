import classNames from 'classnames/bind';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Typography, Row, Col, Modal, Button } from 'antd';
import moment from 'moment';
import styles from './SafeRegionResult.module.scss';
import ZoomableAvatar from '../ZoomableAvatar';

const cx = classNames.bind(styles);

function InfoResultSafeRegion(props) {
    const { image_person_url, image_url, class_name, branch_name, createdAt } = props;

    const secondToStringTimezone = (seconds) => {
        let formattedTime = moment.unix(seconds).format('dddd, DD MMMM , YYYY HH:mm:ss A');
        // formattedTime = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
        return formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // Button Hoàn tất vẽ trên modal sẽ lưu giữ liệu vùng vào DB.
    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Modal
                className={cx('modal')}
                title="Đối tượng vào vùng nguy hiểm"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                // Bỏ animation mặc định của Modal antd.
                transitionName=""
                maskTransitionName=""
                footer={[
                    <Button key="back" onClick={handleCancel} danger>
                        Đóng
                    </Button>,
                ]}
            >
                <div className={cx('modal__wrapper')}>
                    <img src={image_url} alt="Ảnh từ frame_url null" className={cx('modal__image')} />
                </div>
            </Modal>

            <Row className={cx('info')}>
                <Col span={8} className={cx('info__student')}>
                    {/* <div className={cx('info__student__avatar')}> */}
                    {/* <Avatar size="large" src={image_person_url} className={cx('info__student__avatar')}>
                        {image_person_url ? '' : 'image_person_url'}
                    </Avatar> */}
                    <ZoomableAvatar size="large" src={image_person_url} className={cx('info__student__avatar')}>
                        {image_person_url ? '' : 'image_person_url'}
                    </ZoomableAvatar>
                    {/* </div> */}
                    <div className={cx('info__text')}>
                        <Typography.Text className={cx('info__text__des')}>
                            Lớp : {class_name || 'Chưa có'}
                        </Typography.Text>
                        <Typography.Text className={cx('info__text__des')}>
                            Cơ sở: {branch_name || 'Chưa có'}
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

InfoResultSafeRegion.propTypes = {
    image_person_url: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    class_name: PropTypes.string.isRequired,
    branch_name: PropTypes.string.isRequired,
    createdAt: PropTypes.object.isRequired,
};

export default InfoResultSafeRegion;
