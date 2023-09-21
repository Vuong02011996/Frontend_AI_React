import { memo, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Modal, notification } from 'antd';
import { useLocation, useHistory, useSelector, useDispatch } from 'umi';
import classnames from 'classnames';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import ListImage from '@/components/CommonComponent/ListImage';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import moment from 'moment';
import Button from '@/components/CommonComponent/Button';
import VideoCustom from '@/components/CommonComponent/VideoCustom';
import ZoomableAvatar from '@/pages/camera/stream/components/ResultFunctional/ZoomableAvatar';

const Index = memo(() => {
    const dispatch = useDispatch();
    const [
        loading,
        { pagination, error, data, branches, classes, students },
    ] = useSelector(({ loading: { effects }, sleeplessIdentificationReport }) => [
        effects,
        sleeplessIdentificationReport,
    ]);

    const history = useHistory();
    const { query, pathname } = useLocation();
    const [form] = Form.useForm();

    const [formModal] = Form.useForm();

    const [visible, setVisible] = useState(false);

    const [detail, setDetail] = useState({});

    const [search, setSearch] = useState({
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        branch_id: query?.branch_id,
        class_id: query?.class_id,
        fromDate: query?.fromDate ? moment(query?.fromDate) : moment().startOf('months'),
        toDate: query?.toDate ? moment(query?.toDate) : moment().endOf('months'),
        user_id: query?.user_id ? query?.user_id?.split(',') : null,
    });

    const onLoad = () => {
        dispatch({
            type: 'sleeplessIdentificationReport/GET_DATA',
            payload: {
                ...search,
            },
        });
        history.push(
            `${pathname}?${Helper.convertParamSearchConvert(
                {
                    ...search,
                    fromDate: Helper.getDate(search.fromDate, variables.DATE_FORMAT.DATE_AFTER),
                    toDate: Helper.getDate(search.toDate, variables.DATE_FORMAT.DATE_AFTER),
                },
                variables.QUERY_STRING,
            )}`,
        );
    };

    const paginationProps = useMemo(
        () => ({
            size: 'default',
            total: pagination?.total || 0,
            pageSize: variables.PAGINATION.PAGE_SIZE,
            defaultCurrent: Number(search.page),
            current: Number(search.page),
            hideOnSinglePage: (pagination?.total || 0) <= 10,
            showSizeChanger: false,
            pageSizeOptions: false,
            onChange: (page, limit) => {
                setSearch((prev) => ({
                    ...prev,
                    page,
                    limit,
                }));
            },
        }),
        [pagination],
    );

    const onEdit = (record) => {
        formModal.setFieldsValue({
            ...record,
        });
        setDetail(record);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = () => {
        formModal.validateFields().then((values) => {
            dispatch({
                type: 'sleeplessIdentificationReport/UPDATE',
                payload: {
                    user_id: values.user_id,
                    name: students?.find((item) => item.id === values.user_id)?.fullName,
                    id: detail?.id,
                },
                callback: (response) => {
                    console.log('response UPDATE: ', response);
                    if (response.status) {
                        if (response.status_code === 400) {
                            notification.warning({
                                message: 'THÔNG BÁO',
                                description: response.message,
                            });
                        } else {
                            notification.success({
                                message: 'THÔNG BÁO',
                                description: response.message,
                            });
                            onLoad();
                            handleCancel();
                        }
                    } else {
                        notification.error({
                            message: 'THÔNG BÁO',
                            description: `Có lỗi từ server! ${response.message}`,
                        });
                    }
                },
            });
        });
    };

    const columns = useMemo(
        () => [
            {
                title: 'Thời gian',
                key: 'date',
                width: 150,
                className: 'min-width-250',
                render: (record) => (
                    <div>
                        {record?.time_sleepless?.map((item) => (
                            <p key={item}>{Helper.getDate(item, variables.DATE_FORMAT.TIME_DATE_VI)}</p>
                        ))}
                    </div>
                ),
            },
            {
                title: 'Cơ sở',
                width: 150,
                key: 'branch_name',
                className: 'min-width-150',
                render: (record) =>
                    (record?.branch_name && record.branch_name !== null && record.branch_name) ||
                    'Không xác định được cơ sở',
            },
            {
                title: 'Lớp',
                width: 150,
                key: 'class_cam',
                className: 'min-width-150',
                render: (record) =>
                    (record?.class_name && record.class_name !== null && record.class_name) ||
                    'Không xác định được lớp',
            },
            {
                title: 'Vùng',
                width: 150,
                key: 'region_name',
                className: 'min-width-150',
                render: (record) =>
                    (record?.region_name && record.region_name !== null && record.region_name) ||
                    'Không xác định được vùng',
            },
            {
                title: 'Hình ảnh',
                width: '150',
                className: 'min-width-150',
                render: (record) => (
                    <ZoomableAvatar size="large" src={record?.image_url}>
                        {/* {image_url ? '' : 'image_url'} */}
                    </ZoomableAvatar>
                ),
            },
            {
                title: 'Video trằn trọc',
                width: '150',
                className: 'min-width-150',
                render: (record) => (
                    <div className="w-100 d-flex align-items-center">
                        {record?.clip_url?.map((item) => (
                            <div key={item} className="mr5">
                                <VideoCustom clip_url={item} size="50px" />
                            </div>
                        ))}
                    </div>
                ),
            },
            {
                title: 'Họ và tên',
                key: 'name',
                width: 150,
                className: 'min-width-150',
                render: (record) => (
                    <Text size="normal">
                        {(record?.identity_name && record.identity_name !== null && record.identity_name) || 'Unknown'}
                    </Text>
                ),
            },
            {
                title: 'Thao tác',
                className: 'min-width-100',
                width: 100,
                fixed: 'right',
                align: 'center',
                render: (record) => {
                    if (record?.user_id) {
                        return (
                            <div>
                                <div className="d-flex flex-column text-center justify-content-center align-items-center mb10">
                                    <p>{record?.name_st}</p>
                                    <ListImage items={[{ src: record?.avatar_url }]} />
                                </div>
                                <div className={styles.action}>
                                    <Button
                                        className="ml-auto"
                                        color="success"
                                        onClick={() => {
                                            onEdit(record);
                                        }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className={styles.action}>
                            <Button
                                className="ml-auto"
                                color="success"
                                onClick={() => {
                                    onEdit(record);
                                }}
                            >
                                Định danh
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const loadClasses = (idBranch) => {
        dispatch({
            type: 'sleeplessIdentificationReport/GET_CLASSES',
            payload: {
                branch: idBranch,
            },
        });
        setSearch((prevState) => ({
            ...prevState,
            branch_id: idBranch,
            class_id: null,
        }));
        form.setFieldsValue({
            class_id: null,
        });
    };

    useEffect(() => {
        dispatch({
            type: 'sleeplessIdentificationReport/GET_BRANCHES',
            payload: {},
        });
    }, []);

    useEffect(() => {
        onLoad();
    }, [search]);

    useEffect(() => {
        dispatch({
            type: 'sleeplessIdentificationReport/GET_STUDENTS',
            payload: {
                class: search.class_id,
                branchId: search.branch_id,
            },
        });
    }, [search.branch_id, search.class_id]);

    const debouncedSearchDateRank = debounce((fromDate, toDate) => {
        setSearch((prevState) => ({
            ...prevState,
            fromDate,
            toDate,
        }));
    }, 200);

    const onChangeDateRank = (e) => {
        if (e) {
            debouncedSearchDateRank(
                moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
                moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
            );
        }
    };

    const onChangeBranch = (branch) => {
        loadClasses(branch, 'change');
    };

    return (
        <>
            <Helmet title="Quản lý trằn trọc không ngủ" />
            <Modal
                visible={visible}
                title={<strong>Định danh</strong>}
                centered
                width={850}
                onCancel={handleCancel}
                footer={
                    <div className="d-flex justify-content-between align-items-center">
                        <Button
                            isLink
                            color="gray"
                            onClick={handleCancel}
                            className="mr-3"
                            loading={loading['sleeplessIdentificationReport/UPDATE']}
                        >
                            Hủy
                        </Button>
                        <Button
                            key="choose"
                            color="success"
                            onClick={handleOk}
                            loading={loading['sleeplessIdentificationReport/UPDATE']}
                        >
                            Lưu
                        </Button>
                    </div>
                }
            >
                <Form
                    layout="vertical"
                    form={formModal}
                    initialValues={{
                        ...detail,
                        date: detail?.time_go_in_class &&
                            detail?.time_go_out_class && [
                                moment(detail?.time_go_in_class),
                                moment(detail?.time_go_out_class),
                            ],
                    }}
                >
                    <div className="row">
                        <div className="col-lg-12 mb10">
                            <div className="w-100 d-flex align-items-center">
                                {detail?.clip_url?.map((item) => (
                                    <div key={item} className="mr5">
                                        <VideoCustom clip_url={item} size="50px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <FormItem
                                label="Đối tượng"
                                name="user_id"
                                rules={[variables.RULES.EMPTY]}
                                type={variables.SELECT}
                                placeholder="Nhập"
                                data={students?.map((item) => ({ id: item?.id, name: item.fullName }))}
                            />
                        </div>
                    </div>
                </Form>
            </Modal>
            <Pane className="p20">
                <Pane className={classnames(styles.heading)}>
                    <h3 className={styles['heading--title']}>Quản lý trằn trọc không ngủ</h3>
                </Pane>

                <Pane className="card mt20">
                    <Pane className="p20">
                        <Form
                            layout="vertical"
                            form={form}
                            initialValues={{
                                ...search,
                                branch_id: search.branch_id || null,
                                class_id: search.class_id || null,
                                date: search.fromDate &&
                                    search.toDate && [moment(search.fromDate), moment(search.toDate)],
                                name: query?.name,
                                user_id: search?.user_id || null,
                            }}
                        >
                            <Pane className="row">
                                <Pane className="col-lg-4">
                                    <FormItem
                                        name="date"
                                        onChange={(event) => onChangeDateRank(event, 'date')}
                                        type={variables.RANGE_PICKER}
                                    />
                                </Pane>
                                <Pane className="col-lg-4">
                                    <FormItem
                                        data={[{ id: null, name: 'Tất cả cơ sở' }, ...branches]}
                                        name="branch_id"
                                        type={variables.SELECT}
                                        onChange={onChangeBranch}
                                        allowClear={false}
                                    />
                                </Pane>
                                <Pane className="col-lg-4">
                                    <FormItem
                                        data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                                        name="class_id"
                                        type={variables.SELECT}
                                        allowClear={false}
                                        onChange={(value) => setSearch((prev) => ({ ...prev, class_id: value }))}
                                    />
                                </Pane>
                            </Pane>
                        </Form>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={loading['sleeplessIdentificationReport/GET_DATA']}
                            isError={error.isError}
                            pagination={paginationProps}
                            rowKey={(record) => (record?.id ? record?.id : `${Math.random() * 1000000}`)}
                            className="table-normal"
                            scroll={{ x: '100%' }}
                        />
                    </Pane>
                </Pane>
            </Pane>
        </>
    );
});

export default Index;
