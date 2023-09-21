import React, { useMemo } from 'react';
import useFirestore from '@/hooks/useFirestore';
import { useSelector, useDispatch, useParams } from 'umi';
import { Col, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './AttendanceResult.module.scss';
import InfoResultAttendance from './InfoResultAttendance';

const cx = classNames.bind(styles);

export default function AttendanceResult() {
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
    const persons = useFirestore(FIREBASE_DB_ATTENDANCE);
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
                    Tương đồng với
                </Col>
            </Row>
            <div className={cx('content__list')}>
                {persons.map((person) => (
                    <InfoResultAttendance
                        key={person.id}
                        displayName={person.identity_name}
                        createdAt={person.created_at}
                        photoUrl={person.avatars_ori}
                        similarity_distance={person.similarity_distance}
                        avatars={person.avatars}
                        class_name={person.class_name}
                        branch_name={person.branch_name}
                        avatars_match={person.avatars_match}
                    />
                ))}
            </div>
        </div>
    );
}
