import { memo, useState, useRef, useEffect } from 'react';
import { Switch } from 'antd';
import Pane from '@/components/CommonComponent/Pane';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';
import StreamVideo from '@/components/CommonComponent/StreamVideo';
import Button from '@/components/CommonComponent/Button';
import { Stage, Layer, Circle, Arrow, Group, Line } from 'react-konva';
import PropTypes from 'prop-types';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import { isEmpty, difference } from 'lodash';
import moment from 'moment';
import styles from './styles.module.scss';

const DEFAULTS = {
  fill: '#4DA3A9',
  width: 10,
  height: 10,
};

const DEFAULTS_ARROW = {
  stroke: '#4DA3A9',
  fill: '#4DA3A9',
  strokeWidth: 1,
  pointerWidth: 0,
};

const Edge = ({ node1, node2, node3, node4 }) => {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  const angle = Math.atan2(-dy, dx);

  const dx2 = node2.x - node2.x;
  const dy2 = node2.y - node3.y;
  const angle2 = Math.atan2(-dy2, dx2);

  const dx3 = node3.x - node4.x;
  const dy3 = node3.y - node4.y;
  const angle3 = Math.atan2(-dy3, dx3);

  const dx4 = node4.x - node1.x;
  const dy4 = node4.y - node1.y;
  const angle4 = Math.atan2(-dy4, dx4);

  const radius = 0;

  const arrowStart = {
    x: node2.x + -radius * Math.cos(angle + Math.PI),
    y: node2.y + radius * Math.sin(angle + Math.PI),
  };
  const arrowEnd = {
    x: node1.x + -radius * Math.cos(angle),
    y: node1.y + radius * Math.sin(angle),
  };

  const arrowStart2 = {
    x: node3.x + -radius * Math.cos(angle2 + Math.PI),
    y: node3.y + radius * Math.sin(angle2 + Math.PI),
  };
  const arrowEnd2 = {
    x: node2.x + -radius * Math.cos(angle2),
    y: node2.y + radius * Math.sin(angle2),
  };

  const arrowStart3 = {
    x: node4.x + -radius * Math.cos(angle3 + Math.PI),
    y: node4.y + radius * Math.sin(angle3 + Math.PI),
  };
  const arrowEnd3 = {
    x: node3.x + -radius * Math.cos(angle3),
    y: node3.y + radius * Math.sin(angle3),
  };

  const arrowStart4 = {
    x: node1.x + -radius * Math.cos(angle4 + Math.PI),
    y: node1.y + radius * Math.sin(angle4 + Math.PI),
  };
  const arrowEnd4 = {
    x: node4.x + -radius * Math.cos(angle4),
    y: node4.y + radius * Math.sin(angle4),
  };

  return (
    <Group>
      <Arrow points={[arrowStart.x, arrowStart.y, arrowEnd.x, arrowEnd.y]} {...DEFAULTS_ARROW} />
      <Arrow
        points={[arrowStart2.x, arrowStart2.y, arrowEnd2.x, arrowEnd2.y]}
        {...DEFAULTS_ARROW}
      />
      <Arrow
        points={[arrowStart3.x, arrowStart3.y, arrowEnd3.x, arrowEnd3.y]}
        {...DEFAULTS_ARROW}
      />
      <Arrow
        points={[arrowStart4.x, arrowStart4.y, arrowEnd4.x, arrowEnd4.y]}
        {...DEFAULTS_ARROW}
      />
    </Group>
  );
};

Edge.propTypes = {
  node3: PropTypes.objectOf(PropTypes.any),
  node2: PropTypes.objectOf(PropTypes.any),
  node1: PropTypes.objectOf(PropTypes.any),
  node4: PropTypes.objectOf(PropTypes.any),
};

Edge.defaultProps = {
  node3: {},
  node2: {},
  node1: {},
  node4: {},
};

const LayerComponent = ({ width, height, coordinates, onChangeLayer, isDraw }) => {
  const [blue1Node, updateBlue1Node] = useState({
    x: 10,
    y: 10,
    ...DEFAULTS,
  });
  const [blue2Node, updateBlue2Node] = useState({
    x: 10,
    y: 200,
    ...DEFAULTS,
  });
  const [blue3Node, updateBlue3Node] = useState({
    x: 300,
    y: 10,
    ...DEFAULTS,
  });
  const [blue4Node, updateBlue4Node] = useState({
    x: 300,
    y: 200,
    ...DEFAULTS,
  });

  const firstTimeRender = useRef(true);

  useEffect(() => {
    if (width && height) {
      updateBlue1Node({
        ...blue1Node,
        x: coordinates[0][0] * width,
        y: coordinates[0][1] * height,
      });
      updateBlue2Node({
        ...blue1Node,
        x: coordinates[1][0] * width,
        y: coordinates[1][1] * height,
      });
      updateBlue3Node({
        ...blue1Node,
        x: coordinates[2][0] * width,
        y: coordinates[2][1] * height,
      });
      updateBlue4Node({
        ...blue1Node,
        x: coordinates[3][0] * width,
        y: coordinates[3][1] * height,
      });
    }
  }, [width, height]);

  const formatPercenToFixed = (number) => Number(parseFloat(number / 100).toFixed(2));

  useEffect(() => {
    if (blue1Node && blue2Node && blue3Node && blue4Node && !firstTimeRender.current) {
      onChangeLayer([
        [
          formatPercenToFixed(Helper.percentage(blue1Node.x, width)),
          formatPercenToFixed(Helper.percentage(blue1Node.y, height)),
        ],
        [
          formatPercenToFixed(Helper.percentage(blue2Node.x, width)),
          formatPercenToFixed(Helper.percentage(blue2Node.y, height)),
        ],
        [
          formatPercenToFixed(Helper.percentage(blue3Node.x, width)),
          formatPercenToFixed(Helper.percentage(blue3Node.y, height)),
        ],
        [
          formatPercenToFixed(Helper.percentage(blue4Node.x, width)),
          formatPercenToFixed(Helper.percentage(blue4Node.y, height)),
        ],
      ]);
    }
  }, [blue1Node, blue2Node, blue3Node, blue4Node]);

  useEffect(() => {
    firstTimeRender.current = false;
  }, []);

  return (
    <Layer>
      <Line
        x={0}
        y={0}
        points={[
          blue1Node.x,
          blue1Node.y,
          blue2Node.x,
          blue2Node.y,
          blue4Node.x,
          blue4Node.y,
          blue3Node.x,
          blue3Node.y,
        ]}
        fillLinearGradientStartPoint={{ x: -50, y: -50 }}
        fillLinearGradientEndPoint={{ x: 50, y: 50 }}
        closed
        fill="rgba(77, 163, 169, 0.6)"
      />
      <Circle
        {...blue1Node}
        onDragMove={(e) => {
          const { x, y } = e.target.position();
          if (x >= 10 && x <= width && y >= 10 && y <= height) {
            updateBlue1Node({ ...blue1Node, ...e.target.position() });
          }
        }}
        draggable={isDraw}
      />
      <Circle
        {...blue2Node}
        onDragMove={(e) => {
          const { x, y } = e.target.position();
          if (x >= 10 && x <= width && y >= 10 && y <= height) {
            updateBlue2Node({ ...blue1Node, ...e.target.position() });
          }
        }}
        draggable={isDraw}
      />
      <Circle
        {...blue3Node}
        onDragMove={(e) => {
          const { x, y } = e.target.position();
          if (x >= 10 && x <= width && y >= 10 && y <= height) {
            updateBlue3Node({ ...blue1Node, ...e.target.position() });
          }
        }}
        draggable={isDraw}
      />
      <Circle
        {...blue4Node}
        onDragMove={(e) => {
          const { x, y } = e.target.position();
          if (x >= 10 && x <= width && y >= 10 && y <= height) {
            updateBlue4Node({ ...blue1Node, ...e.target.position() });
          }
        }}
        draggable={isDraw}
      />
    </Layer>
  );
};

LayerComponent.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  coordinates: PropTypes.arrayOf(PropTypes.any),
  onChangeLayer: PropTypes.func,
  isDraw: PropTypes.bool,
};

LayerComponent.defaultProps = {
  width: 0,
  height: 0,
  coordinates: [],
  onChangeLayer: () => {},
  isDraw: false,
};

const Index = memo(({ form, streamUrl, statusJob }) => {
  const ref = useRef();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [isDraw, setIsDraw] = useState(false);

  const dispatch = useDispatch();

  const params = useParams();

  const [loading, { sleepless }] = useSelector(({ loading: { effects }, cameraAdd }) => [
    effects,
    cameraAdd,
  ]);

  const [isShow, setIsShow] = useState(!isEmpty(sleepless));

  const [isSleepless, setIsSleepless] = useState(!isEmpty(sleepless));

  const [data, setData] = useState({
    coordinates: [
      [0.16, 0.34],
      [0.16, 0.91],
      [0.71, 0.16],
      [0.71, 0.91],
    ],
    duration_time: null,
    from_time: null,
    to_time: null,
  });

  useEffect(() => {
    if (!isEmpty(sleepless) && difference(sleepless, data)) {
      form.setFieldsValue({
        from_time: sleepless.from_time && moment(sleepless.from_time),
        to_time: sleepless.to_time && moment(sleepless.to_time),
        duration_time: sleepless.duration_time,
      });
      setData(sleepless);
    }
  }, [sleepless]);

  const getListSize = () => {
    if (ref.current) {
      const newWidth = ref.current.clientWidth;
      setWidth(newWidth);
      const newHeight = ref.current.clientHeight;
      setHeight(newHeight);
    }
  };

  useEffect(() => {
    if (isShow && isSleepless) {
      getListSize();
    }
  }, [isShow, isSleepless]);

  useEffect(() => {
    if (isShow) {
      window.addEventListener('resize', getListSize);
    }
  }, [isShow]);

  const onDraw = () => {
    setIsDraw((prev) => !prev);
  };

  const onFinsh = () => {
    dispatch({
      type: 'cameraAdd/SET_UPDATE_SEEPLESS',
      payload: data,
    });
    setIsDraw((prev) => !prev);
  };

  const onChangeToggle = () => setIsShow((prev) => !prev);

  const onChangeLayer = (coordinates) => {
    setData((prev) => ({ ...prev, coordinates }));
    dispatch({
      type: 'cameraAdd/SET_UPDATE_SEEPLESS',
      payload: {
        ...data,
        coordinates,
      },
    });
  };

  const onChangeDate = (value, key) => {
    setData((prev) => ({ ...prev, [key]: value }));
    dispatch({
      type: 'cameraAdd/SET_UPDATE_SEEPLESS',
      payload: {
        ...data,
        [key]: value,
      },
    });
  };

  const start = () => {
    dispatch({
      type: 'cameraAdd/START_BEHAVIORS',
      payload: {
        id: params.id,
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'cameraAdd/GET_STATUS_JOBS',
            payload: {
              ...params,
            },
          });
        }
      },
    });
  };

  const stop = () => {
    dispatch({
      type: 'cameraAdd/STOP_BEHAVIORS',
      payload: {
        id: params.id,
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'cameraAdd/GET_STATUS_JOBS',
            payload: {
              ...params,
            },
          });
        }
      },
    });
  };

  const onFinish = () => {
    dispatch({
      type: 'cameraAdd/UPDATE_BEHAVIORS',
      payload: {
        ...params,
        jobs_cam: {
          behavior: {
            sleepless: !isEmpty(sleepless) ? sleepless : undefined,
          },
        },
      },
      callback: () => {},
    });
  };

  return (
    <Pane className="border-bottom pb20 pr20 pl20">
      <div className="d-flex">
        <Switch className="mr10" checked={isShow} onChange={onChangeToggle} /> <p>Hành vi trẻ</p>
      </div>
      {isShow && (
        <div className="p20">
          <div className="d-flex">
            <Switch
              className="mr10"
              checked={isSleepless}
              onChange={() => setIsSleepless((prev) => !prev)}
            />
            <p>Trằn trọc không ngủ được</p>
          </div>
          {isSleepless && (
            <div className="mt15">
              <div className={styles['video-wrapper']} ref={ref}>
                <StreamVideo url={streamUrl} />
                {width && height && (
                  <Stage className={styles['stage-wrapper']} width={width} height={height}>
                    <LayerComponent
                      width={width}
                      height={height}
                      coordinates={data.coordinates}
                      onChangeLayer={onChangeLayer}
                      isDraw={isDraw}
                    />
                  </Stage>
                )}
              </div>
              <div className={styles.wrapper}>
                <div className={styles.content}>
                  <div className="d-flex">
                    {!isDraw && (
                      <Button color="dash-success" onClick={onDraw}>
                        Vẽ vùng
                      </Button>
                    )}
                    {isDraw && (
                      <Button color="primary" onClick={onFinsh}>
                        Hoàn tất vẽ
                      </Button>
                    )}
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem
                        label="Bắt đầu"
                        name="from_time"
                        type={variables.TIME_PICKER}
                        onChange={(value) => onChangeDate(value, 'from_time')}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Kết thúc"
                        name="to_time"
                        type={variables.TIME_PICKER}
                        onChange={(value) => onChangeDate(value, 'to_time')}
                      />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Thời gian chờ (giây)"
                        name="duration_time"
                        type={variables.INPUT_COUNT}
                        value={data.duration_time}
                        onChange={(value) => onChangeDate(value, 'duration_time')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr />
          <div className="d-flex mt10">
            <Switch className="mr10" />
            <p>Chơi 1 mình 1 góc </p>
          </div>
          <hr />
          <div className="d-flex mt10">
            <Switch className="mr10" />
            <p>Đánh nhau </p>
          </div>
          <hr />
          <div className="d-flex mt10">
            <Switch className="mr10" />
            <p>Xô đẩy, té ngã </p>
          </div>
          <hr />
          <div className="d-flex justify-content-end">
            {statusJob.status_job !== 'running' && (
              <Button
                color="dash-success"
                className="ml10"
                onClick={start}
                loading={
                  loading['cameraAdd/START_BEHAVIORS'] || loading['cameraAdd/GET_STATUS_JOBS']
                }
              >
                Start
              </Button>
            )}
            {statusJob.status_job === 'running' && (
              <Button
                color="dash-success"
                className="ml10"
                onClick={stop}
                loading={
                  loading['cameraAdd/STOP_BEHAVIORS'] || loading['cameraAdd/GET_STATUS_JOBS']
                }
              >
                Stop
              </Button>
            )}
            <Button
              color="success"
              className="ml10"
              onClick={onFinish}
              loading={loading['cameraAdd/UPDATE_BEHAVIORS']}
            >
              Lưu
            </Button>
          </div>
        </div>
      )}
    </Pane>
  );
});

Index.propTypes = {
  form: PropTypes.any,
  streamUrl: PropTypes.string,
  statusJob: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  form: null,
  streamUrl: '',
  statusJob: {},
};

export default Index;
