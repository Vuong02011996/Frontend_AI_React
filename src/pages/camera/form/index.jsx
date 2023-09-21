import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams, useLocation } from 'umi';
import classnames from 'classnames';
import { head, isEmpty, pick } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { Helper, variables } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Genarel from './components/genarel';
import Ptz from './components/ptz';
import Charge from './components/charge';

const { TabPane } = Tabs;
const Index = memo(() => {
    const [
        loading,
        { error, branches, classes, rollCall, details, safeAreaRegions, sleepless },
    ] = useSelector(({ loading: { effects }, cameraAdd }) => [effects, cameraAdd]);
    const dispatch = useDispatch();
    const params = useParams();
    const { query, pathname } = useLocation();

    const history = useHistory();
    const [form] = Form.useForm();
    const mounted = useRef(false);

    const onFinish = (values) => {
        dispatch({
            type: params.id ? 'cameraAdd/UPDATE' : 'cameraAdd/ADD',
            payload: {
                ...details,
                ...values,
                ...params,
                status_cam: params.id ? variables.STATUS.CONNECT : variables.STATUS.DISCONNECT,
                branch_cam: branches.find((item) => item.id === values.branch_id)?.name,
                class_cam: classes.find((item) => item.id === values.class_id)?.name,
                jobs_cam: params.id
                    ? {
                          roll_call: !isEmpty(rollCall?.coordinates) ? rollCall : undefined,
                          safe_area_regions: !isEmpty(safeAreaRegions) ? safeAreaRegions : undefined,
                          behavior: {
                              sleepless: !isEmpty(sleepless) ? sleepless : undefined,
                          },
                      }
                    : undefined,
            },
            callback: (response, error) => {
                if (response) {
                    if (!params.id) {
                        history.goBack();
                    }
                }
                if (error) {
                    if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
                        error?.validationErrors.forEach((item) => {
                            form.setFields([
                                {
                                    name: head(item.members),
                                    errors: [item.message],
                                },
                            ]);
                        });
                    }
                }
            },
        });
    };

    const remove = () => {
        Helper.confirmAction({
            callback: () => {
                dispatch({
                    type: 'cameraAdd/REMOVE',
                    payload: {
                        ...params,
                    },
                    callback: (response) => {
                        if (response) {
                            history.goBack();
                        }
                    },
                });
            },
        });
    };

    useEffect(() => {
        if (params.id) {
            dispatch({
                type: 'cameraAdd/GET_DATA',
                payload: {
                    ...params,
                },
                callback: (response) => {
                    if (response) {
                        if (response.branch_id) {
                            dispatch({
                                type: 'cameraAdd/GET_CLASSES',
                                payload: {
                                    branch: response.branch_id,
                                },
                            });
                        }
                        form.setFieldsValue({
                            ...response,
                        });
                    }
                },
            });
        }
    }, [params.id]);

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    const onConnect = () => {
        form.validateFields().then((values) => {
            dispatch({
                type: 'cameraAdd/CONNECT',
                payload: {
                    ...pick(values, ['ip_cam', 'port_cam', 'username_cam', 'password_cam']),
                    id: params.id,
                },
                callback: (response) => {
                    if (response) {
                        dispatch({
                            type: 'cameraAdd/GET_DATA',
                            payload: {
                                ...params,
                            },
                            callback: () => {},
                        });
                    }
                },
            });
        });
    };

    return (
        <Pane>
            <Helmet title="Quản lý camera" />
            <Pane className="pl20 pr20 mt10">
                <Breadcrumbs last={params?.id ? 'Chỉnh sửa' : 'Tạo mới'} />
                <Form layout="horizontal" colon={false} form={form} onFinish={onFinish} initialValues={{}}>
                    <Pane className="row mt20 mb20">
                        <Pane className={classnames('offset-lg-2 col-lg-8', styles.form)}>
                            <h3 className={styles['form--title']}>
                                {params?.id ? 'Chỉnh sửa camera' : 'Thêm mới camera'}
                            </h3>
                            <Pane className="card mt20">
                                <Pane className="pt20 pr20 pl20">
                                    <Tabs
                                        activeKey={query.type || 'GENAREL'}
                                        onChange={(e) => {
                                            history.push({
                                                pathname,
                                                query: {
                                                    type: e,
                                                },
                                            });
                                        }}
                                    >
                                        <TabPane tab="Thông tin chung" key="GENAREL" />
                                        {params.id && details?.status_cam === variables.STATUS.CONNECT && (
                                            <TabPane tab="Nhiệm vụ" key="CHARGE" />
                                        )}
                                    </Tabs>
                                </Pane>
                                <Loading
                                    loading={loading['cameraAdd/GET_DATA']}
                                    isError={error.isError}
                                    params={{
                                        error,
                                        type: 'container',
                                        goBack: '/camera',
                                    }}
                                >
                                    {((query.type !== 'GENAREL' && query.type !== 'PTZ' && query.type !== 'CHARGE') ||
                                        details?.status_cam !== variables.STATUS.CONNECT) && <Genarel form={form} />}
                                    {query.type === 'GENAREL' && <Genarel form={form} />}
                                    {query.type === 'PTZ' && <Ptz form={form} />}
                                    {query.type === 'CHARGE' && details?.status_cam === variables.STATUS.CONNECT && (
                                        <Charge form={form} streamUrl={details?.stream_url} />
                                    )}
                                </Loading>
                            </Pane>
                            <Pane className="d-flex justify-content-between align-items-center">
                                {!params.id && (
                                    <p
                                        className={styles['btn-cancel']}
                                        role="presentation"
                                        onClick={() => history.goBack()}
                                    >
                                        Hủy
                                    </p>
                                )}
                                {params.id && (
                                    <p className={styles['btn-cancel']} role="presentation" onClick={remove}>
                                        Xóa
                                    </p>
                                )}
                                <Pane className="d-flex">
                                    {params?.id && (
                                        <div className={classnames(styles.connect)}>
                                            {details?.status_cam === variables.STATUS.CONNECT && (
                                                <CheckCircleOutlined className={styles.connect__icon} />
                                            )}
                                            {details?.status_cam !== variables.STATUS.CONNECT && (
                                                <InfoCircleOutlined
                                                    className={classnames(
                                                        styles.connect__icon,
                                                        styles['connect__icon--warning'],
                                                    )}
                                                />
                                            )}
                                            <p
                                                className={classnames(styles.connect__norm, {
                                                    [styles['connect__norm--warning']]:
                                                        details?.status_cam !== variables.STATUS.CONNECT,
                                                })}
                                            >
                                                {details?.status_cam === variables.STATUS.CONNECT
                                                    ? 'Camera kết nối được'
                                                    : 'Camera kết nối không được'}
                                            </p>
                                        </div>
                                    )}
                                    {params.id && details?.status_cam !== variables.STATUS.CONNECT && (
                                        <Button
                                            className="mr10"
                                            color="primary"
                                            htmlType="button"
                                            size="large"
                                            loading={
                                                loading['cameraAdd/ADD'] ||
                                                loading['cameraAdd/UPDATE'] ||
                                                loading['cameraAdd/CONNECT']
                                            }
                                            onClick={onConnect}
                                            disabled={details?.url_cam}
                                        >
                                            Kiểm tra
                                        </Button>
                                    )}
                                    {(!query.type || query.type === 'GENAREL') && (
                                        <Button
                                            className="ml-auto"
                                            color="success"
                                            htmlType="submit"
                                            size="large"
                                            loading={loading['cameraAdd/ADD'] || loading['cameraAdd/UPDATE']}
                                        >
                                            Lưu
                                        </Button>
                                    )}
                                </Pane>
                            </Pane>
                        </Pane>
                    </Pane>
                </Form>
            </Pane>
        </Pane>
    );
});

export default Index;
