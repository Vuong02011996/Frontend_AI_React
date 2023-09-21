import classNames from 'classnames/bind';
import { Avatar, Typography, Row, Col } from 'antd';
import moment from 'moment';
import ZoomableAvatar from '../ZoomableAvatar';
import styles from './AttendanceResult.module.scss';

const cx = classNames.bind(styles);

export default function InfoResultAttendance(props) {
    const {
        displayName,
        createdAt,
        photoUrl,
        similarity_distance,
        avatars,
        class_name,
        branch_name,
        avatars_match,
    } = props;

    const secondToStringTimezone = (seconds) => {
        let formattedTime = moment.unix(seconds).format('dddd, DD MMMM , YYYY HH:mm:ss A');
        // formattedTime = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
        return formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
    };
    return (
        <Row className={cx('info')}>
            <Col span={8} className={cx('info__student')}>
                {/* <div className={cx('info__student__avatar')}> */}
                {/* <Avatar size="large" src={photoUrl} className={cx('info__student__avatar')}>
                    {photoUrl ? '' : displayName.charAt(0)?.toUpperCase()}
                </Avatar> */}
                <ZoomableAvatar size="large" src={photoUrl} className={cx('info__student__avatar')}>
                    {photoUrl ? '' : displayName.charAt(0)?.toUpperCase()}
                </ZoomableAvatar>
                {/* </div> */}
                <div className={cx('info__text')}>
                    <Typography.Text className={cx('info__text__des')}> Tên : {displayName}</Typography.Text>
                    <Typography.Text className={cx('info__text__des')}>
                        Độ tương đồng : {similarity_distance.toFixed(2)}
                    </Typography.Text>
                    <Typography.Text className={cx('info__text__des')}>Lớp : {class_name || 'Chưa có'}</Typography.Text>
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
                <Avatar size="large" src={avatars_match} className={cx('info__match__avatar')}>
                    {avatars_match ? '' : displayName.charAt(0)?.toUpperCase()}
                </Avatar>
            </Col>
        </Row>
    );
}
