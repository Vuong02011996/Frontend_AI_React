import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button } from 'antd';
import { useSelector, useDispatch, useParams } from 'umi';

import FlvPlayer from './stream_flv/FlvPlayer';
import InfoCam from './components/InfoCam';
import { variables_stream } from './utils/variables_stream';

import AttendanceConfig from './components/ConfigFuntional/AttendanceConfig';
import SafeRegionConfig from './components/ConfigFuntional/SafeRegionConfig';
import SleeplessConfig from './components/ConfigFuntional/SleeplessConfig';
import FallDetectionConfig from './components/ConfigFuntional/FallDetectionConfig';

import AttendanceResult from './components/ResultFunctional/AttendanceResult';
import SafeRegionResult from './components/ResultFunctional/SafeRegionResult';
import SleeplessResult from './components/ResultFunctional/SleeplessResult';
import FallDetectionResult from './components/ResultFunctional/FallDetectionResult';

export default function Index() {
    const dispatch = useDispatch();
    const params = useParams();
    const [loading, { url_stream_flv }] = useSelector(({ loading: { effects }, stream }) => [effects, stream]);

    // ---------------------------End config vẽ vùng----------------------------------------------

    // Local state
    const [job, setJob] = useState(variables_stream.JOBS.NOJOB);

    const onLoad = () => {
        dispatch({
            type: 'stream/GET_DATA',
            payload: {
                id: params.id,
            },
        });
    };

    useEffect(() => {
        console.log('onload params.id: ', params.id);
        onLoad();
    }, [params.id]);

    return (
        <Row>
            <Col span={12}>
                <InfoCam job={job} setJob={setJob} />
                <FlvPlayer url_stream_flv={url_stream_flv} />

                {job === variables_stream.JOBS.DIEMDANH && <AttendanceConfig />}
                {job === variables_stream.JOBS.VUNGNGUYHIEM && <SafeRegionConfig />}
                {job === variables_stream.JOBS.TRANTROC && <SleeplessConfig />}
                {job === variables_stream.JOBS.TENGA && <FallDetectionConfig />}
            </Col>
            <Col span={12}>
                {job === variables_stream.JOBS.DIEMDANH && <AttendanceResult />}
                {job === variables_stream.JOBS.VUNGNGUYHIEM && <SafeRegionResult />}
                {job === variables_stream.JOBS.TRANTROC && <SleeplessResult />}
                {job === variables_stream.JOBS.TENGA && <FallDetectionResult />}
            </Col>
        </Row>
    );
}
