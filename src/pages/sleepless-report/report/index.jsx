import { memo, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useLocation, useHistory, useSelector, useDispatch } from 'umi';
import classnames from 'classnames';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import VideoCustom from '@/components/CommonComponent/VideoCustom';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import moment from 'moment';
import ZoomableAvatar from '@/pages/camera/stream/components/ResultFunctional/ZoomableAvatar';

const Index = memo(() => {
    const dispatch = useDispatch();
    const [
        loading,
        { pagination, error, data, branches, classes, students },
    ] = useSelector(({ loading: { effects }, sleeplessReportNew }) => [effects, sleeplessReportNew]);

    const history = useHistory();
    const { query, pathname } = useLocation();
    const [form] = Form.useForm();

    const [search, setSearch] = useState({
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        branch_id: query?.branch_id,
        class_id: query?.class_id,
        date: query?.date ? moment(query?.date) : moment(),
        user_id: query?.user_id ? query?.user_id?.split(',') : null,
    });

    const onLoad = () => {
        dispatch({
            type: 'sleeplessReportNew/GET_DATA',
            payload: {
                ...search,
            },
        });
        history.push(
            `${pathname}?${Helper.convertParamSearchConvert(
                {
                    ...search,
                    date: Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
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

    const columns = useMemo(
        () => [
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
                key: 'class_name',
                className: 'min-width-150',
                render: (record) =>
                    (record?.class_name && record.class_name !== null && record.class_name) ||
                    'Không xác định được lớp',
            },
            {
                title: 'Ngày trằn tọc',
                width: 170,
                className: 'min-width-170',
                render: (record) => (
                    <div>
                        {record?.time_sleepless?.map((item) => (
                            <p key={item}>{Helper.getDate(item, variables.DATE_FORMAT.TIME_DATE_VI)}</p>
                        ))}
                    </div>
                ),
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
        ],
        [],
    );

    const loadClasses = (idBranch) => {
        dispatch({
            type: 'sleeplessReportNew/GET_CLASSES',
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
            type: 'sleeplessReportNew/GET_BRANCHES',
            payload: {},
        });
    }, []);

    useEffect(() => {
        onLoad();
    }, [search]);

    useEffect(() => {
        dispatch({
            type: 'sleeplessReportNew/GET_STUDENTS',
            payload: {
                class: search.class_id,
                branchId: search.branch_id,
            },
        });
    }, [search.branch_id, search.class_id]);

    const debouncedSearchDateRank = debounce((date) => {
        setSearch((prevState) => ({
            ...prevState,
            date,
        }));
    }, 200);

    const onChangeDate = (e) => {
        if (e) {
            debouncedSearchDateRank(moment(e).format(variables.DATE_FORMAT.DATE_AFTER));
        }
    };

    const onChangeBranch = (branch) => {
        loadClasses(branch, 'change');
    };

    return (
        <>
            <Helmet title="Báo cáo trằn trọc không ngủ" />
            <Pane className="p20">
                <Pane className={classnames(styles.heading)}>
                    <h3 className={styles['heading--title']}>Báo cáo trằn trọc không ngủ</h3>
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
                                date: search.date && moment(search.date),
                                name: query?.name,
                                user_id: search?.user_id || null,
                            }}
                        >
                            <Pane className="row">
                                <Pane className="col-lg-4">
                                    <FormItem name="date" onChange={onChangeDate} type={variables.DATE_PICKER} />
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
                            loading={loading['sleeplessReportNew/GET_DATA']}
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
