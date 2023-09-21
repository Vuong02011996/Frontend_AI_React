import { memo, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Modal } from 'antd';
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

const Index = memo(() => {
    const dispatch = useDispatch();
    const [
        loading,
        { pagination, error, data, branches, classes, students },
    ] = useSelector(({ loading: { effects }, attendance }) => [effects, attendance]);

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
            type: 'attendance/GET_DATA',
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
            date: record?.time_go_in_class &&
                record?.time_go_out_class && [moment(record?.time_go_in_class), moment(record?.time_go_out_class)],
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
                type: 'attendance/UPDATE',
                payload: {
                    user_id: values.user_id,
                    type: 'Hoc Sinh',
                    data: detail.url_face,
                    name: students?.find((item) => item.id === values.user_id)?.fullName,
                },
                callback: (response) => {
                    if (response) {
                        onLoad();
                        handleCancel();
                    }
                },
            });
        });
    };

    const columns = useMemo(
        () => [
            {
                title: 'Họ và tên',
                key: 'name',
                width: 150,
                className: 'min-width-150',
                render: (record) => <Text size="normal">{record?.name_object}</Text>,
            },
            {
                title: 'Cơ sở',
                width: 150,
                key: 'branch_cam',
                className: 'min-width-150',
                render: (record) => (record?.branch_cam && record.branch_cam === null) || 'Chưa có cơ sở',
            },
            {
                title: 'Lớp',
                width: 150,
                key: 'class_cam',
                className: 'min-width-150',
                render: (record) => (record?.class_cam && record.class_cam === null) || 'Chưa có lớp',
            },
            {
                title: 'Tên camera',
                width: 150,
                key: 'name_cam',
                className: 'min-width-150',
                render: (record) => record?.name_cam,
            },
            {
                title: 'Vào lớp',
                width: 180,
                className: 'min-width-180',
                render: (record) => (
                    <Text size="normal">
                        {Helper.getDate(record.time_go_in_class, variables.DATE_FORMAT.FULL_DATE_TIME_2)}
                    </Text>
                ),
            },
            {
                title: 'Ra về',
                width: 180,
                className: 'min-width-180',
                render: (record) => (
                    <Text size="normal">
                        {Helper.getDate(record?.time_go_out_class, variables.DATE_FORMAT.FULL_DATE_TIME_2)}
                    </Text>
                ),
            },
            {
                title: 'Hình nhận diện',
                width: 150,
                className: 'min-width-150',
                render: (record) => (
                    <ListImage
                        items={[
                            ...(record?.url_face?.map((item) => ({ src: item })) || []),
                            ...(record?.url_face_match ? [{ src: record?.url_face_match }] : []),
                        ]}
                    />
                ),
            },
            {
                title: 'Thao tác',
                className: 'min-width-100',
                width: 100,
                fixed: 'right',
                align: 'center',
                render: (record) => (
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
                ),
            },
        ],
        [],
    );

    const loadClasses = (idBranch) => {
        dispatch({
            type: 'attendance/GET_CLASSES',
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
            type: 'attendance/GET_BRANCHES',
            payload: {},
        });
    }, []);

    useEffect(() => {
        onLoad();
    }, [search]);

    useEffect(() => {
        dispatch({
            type: 'attendance/GET_STUDENTS',
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
            <Helmet title="Quản lý điểm danh" />
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
                            loading={loading['attendance/UPDATE']}
                        >
                            Hủy
                        </Button>
                        <Button key="choose" color="success" onClick={handleOk} loading={loading['attendance/UPDATE']}>
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
                            <ListImage
                                items={[
                                    ...(detail?.url_face?.map((item) => ({ src: item })) || []),
                                    ...(detail?.url_face_match ? [{ src: detail?.url_face_match }] : []),
                                ]}
                                isLarge
                            />
                        </div>

                        <div className="col-lg-6">
                            <FormItem label="Cơ sở" name="branch_cam" type={variables.INPUT} disabled />
                        </div>
                        <div className="col-lg-6">
                            <FormItem label="Lớp" name="class_cam" type={variables.INPUT} disabled />
                        </div>
                        <div className="col-lg-12">
                            <FormItem label="Thời gian" name="date" type={variables.RANGE_PICKER_TIME} disabled />
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
                    <h3 className={styles['heading--title']}>Báo cáo điểm danh</h3>
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
                                <Pane className="col-lg-12">
                                    <FormItem
                                        data={[
                                            { id: null, name: 'Tất cả học sinh' },
                                            ...students?.map((item) => ({ id: item?.id, name: item.fullName })),
                                        ]}
                                        name="user_id"
                                        type={variables.SELECT_MUTILPLE}
                                        allowClear={false}
                                        onChange={(value) => setSearch((prev) => ({ ...prev, user_id: value }))}
                                        getValueFromEvent={Helper.handleSelectMultiple}
                                    />
                                </Pane>
                            </Pane>
                        </Form>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={loading['attendance/GET_DATA']}
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
