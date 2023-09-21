import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useFirestore from '@/hooks/useFirestore';
import { useSelector, useDispatch, useParams } from 'umi';
import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './SafeRegionResult.module.scss';
import InfoResultSafeRegion from './InfoResultSafeRegion';

const cx = classNames.bind(styles);

function SafeRegionResult() {
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
    const persons = useFirestore(FIREBASE_DB_SAFE_REGION);
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
                    Chi tiết
                </Col>
            </Row>
            <div className={cx('content__list')}>
                {persons.map((person) => (
                    <InfoResultSafeRegion
                        key={person.id}
                        image_person_url={person.image_person_url}
                        image_url={person.image_url}
                        class_name={person.class_name}
                        branch_name={person.branch_name}
                        createdAt={person.created_at}
                    />
                ))}
            </div>
        </div>
    );
}

export default SafeRegionResult;
