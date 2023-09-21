import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useFirestore from '@/hooks/useFirestore';
import { useSelector, useDispatch, useParams } from 'umi';
import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './FallDetection.module.scss';
import InfoResultFallDetection from './InfoFallDetection';

const cx = classNames.bind(styles);

function FallDetectionResult() {
    const [loading, { process_name }] = useSelector(({ loading: { effects }, attendanceConfig }) => [
        effects,
        attendanceConfig,
    ]);

    const personCondition = useMemo(
        () => ({
            fieldName: 'process_name',
            operator: '==',
            compareValue: process_name,
        }),
        [process_name],
    );

    // const persons = useFirestore('objects_attendance', personCondition);
    const persons = useFirestore(FIREBASE_DB_FALL_DETECTION);
    console.log('persons: ', persons);

    return (
        <div className={cx('content')}>
            <h5 className={cx('content__header')}> Kết quả nhận diện</h5>
            <Row className={cx('content__subheader')}>
                <Col span={8} className={cx('content__subheader__text')}>
                    Đối tượng
                </Col>
                <Col span={8} className={cx('content__subheader__text')}>
                    Thời gian
                </Col>
                <Col span={8} className={cx('content__subheader__text')}>
                    Vùng nhận diện
                </Col>
            </Row>
            <div className={cx('content__list')}>
                {persons.map((person) => (
                    <InfoResultFallDetection
                        key={person.id}
                        image_url={person.image_url}
                        class_name={person.class_name}
                        branch_name={person.branch_name}
                        track_id={person.track_id}
                        createdAt={person.created_at}
                    />
                ))}
            </div>
        </div>
    );
}

export default FallDetectionResult;
