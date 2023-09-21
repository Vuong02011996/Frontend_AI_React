import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useFirestore from '@/hooks/useFirestore';
import { useSelector, useDispatch, useParams } from 'umi';
import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './SleeplessResult.module.scss';
import InfoResultSleepless from './InfoSleeplessRegion';

const cx = classNames.bind(styles);

function SleeplessResult() {
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
    const persons = useFirestore(FIREBASE_DB_SLEEPLESS);
    console.log('persons: ', persons);
    console.log('FIREBASE_DB_SLEEPLESS: ', FIREBASE_DB_SLEEPLESS);
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
                    <InfoResultSleepless
                        key={person.id}
                        roi_image_url={person.roi_image_url}
                        image_url={person.image_url}
                        class_name={person.class_name}
                        region_name={person.region_name}
                        branch_name={person.branch_name}
                        createdAt={person.created_at}
                    />
                ))}
            </div>
        </div>
    );
}

export default SleeplessResult;
