import { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';
import Attendance from './components/Attendance';
import SafeAreaRegions from './components/SafeAreaRegions';
import Sleepless from './components/Sleepless';

const Index = memo(({ form, streamUrl }) => {
  const [{ statusJobs }] = useSelector(({ cameraAdd }) => [cameraAdd]);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'cameraAdd/GET_STATUS_JOBS',
        payload: {
          ...params,
        },
      });
    }
  }, [params.id]);

  return (
    <>
      <Attendance
        form={form}
        streamUrl={streamUrl}
        statusJob={statusJobs.find((item) => item.name_job === 'roll_call')}
      />
      <div className="mt15">
        <SafeAreaRegions
          form={form}
          streamUrl={streamUrl}
          statusJob={statusJobs.find((item) => item.name_job === 'safe_region')}
        />
      </div>
      <div className="mt15">
        <Sleepless
          form={form}
          streamUrl={streamUrl}
          statusJob={statusJobs.find((item) => item.name_job === 'sleepless')}
        />
      </div>
    </>
  );
});

Index.propTypes = {
  form: PropTypes.any,
  streamUrl: PropTypes.string,
};

Index.defaultProps = {
  form: null,
  streamUrl: '',
};

export default Index;
