import { memo, useState, useEffect, useMemo } from 'react';
import { useLocation, useHistory, useSelector, useDispatch } from 'umi';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import styles from '@/assets/styles/Common/common.scss';
import { variables, Helper } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import { Form } from 'antd';
import Pane from '@/components/CommonComponent/Pane';
import { debounce, head } from 'lodash';
import Button from '@/components/CommonComponent/Button';
import classNames from 'classnames';
import VideoCustom from '@/components/CommonComponent/VideoCustom';
import ZoomableAvatar from '../camera/stream/components/ResultFunctional/ZoomableAvatar';

const Index = memo(() => {
    const [{ effects }, { data, classes, branches, error, pagination }] = useSelector(({ loading, fallDetection }) => [
        loading,
        fallDetection,
    ]);
    const dispatch = useDispatch();
    const { query, pathname } = useLocation();
    const history = useHistory();
    const [form] = Form.useForm();

    const [search, setSearch] = useState({
        branch_id: query?.branch_id || null,
        class_id: query?.class_id || null,
        startDate: query.startDate ? moment(query.startDate) : moment().startOf('month'),
        endDate: query.endDate ? moment(query.endDate) : moment().endOf('month'),
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    });

    const loadClasses = (branchId) => {
        dispatch({
            type: 'fallDetection/GET_CLASSES',
            payload: {
                branch: branchId,
            },
        });
    };

    const loadBranches = () => {
        dispatch({
            type: 'fallDetection/GET_BRANCHES',
            payload: {},
            callback: (response) => {
                if (response) {
                    loadClasses(query.branch_id || head(response)?.id);
                }
            },
        });
    };

    const onChangeBranch = (value) => {
        setSearch((prev) => ({ ...prev, branch_id: value, class_id: null }));
        form.setFieldsValue({ class_id: null });
        loadClasses(value);
    };

    const debouncedSearchDateRank = debounce((startDate, endDate) => {
        setSearch((prevState) => ({
            ...prevState,
            startDate,
            endDate,
        }));
    }, 200);

    const onChangeDateRank = (event) => {
        debouncedSearchDateRank(
            moment(event[0]).format(variables.DATE_FORMAT.DATE_AFTER),
            moment(event[1]).format(variables.DATE_FORMAT.DATE_AFTER),
        );
    };

    useEffect(() => {
        loadBranches();
    }, []);

    useEffect(() => {
        const class_cam = classes.find((item) => item.id === query.class_id);
        dispatch({
            type: 'fallDetection/GET_DATA',
            payload: {
                branch_id: search.branch_id,
                class_id: search.class_id,
                page: search.page,
                limit: search.limit,
                class_cam: class_cam?.name,
            },
        });
        history.push(
            `${pathname}?${Helper.convertParamSearchConvert(
                {
                    ...search,
                    startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
                    endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
                },
                variables.QUERY_STRING,
            )}`,
        );
    }, [search]);

    const paginationProps = useMemo(
        () => ({
            size: 'default',
            total: pagination?.total || 0,
            pageSize: variables.PAGINATION.PAGE_SIZE,
            defaultCurrent: Number(search.page),
            current: Number(search.page),
            hideOnSinglePage: (pagination?.total || 0) <= 15,
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

    const columns = [
        {
            title: 'Ngày',
            width: 80,
            className: 'min-width-250',
            render: (record) => (
                <Text size="normal">
                    {Helper.getDate(record?.time_go_in_safe_region, variables.DATE_FORMAT.DATE_VI)}
                </Text>
            ),
        },
        {
            title: 'Thời điểm',
            width: 100,
            className: 'min-width-250',
            render: (record) => (
                <Text size="normal">
                    {Helper.getDate(record?.time_go_in_safe_region, variables.DATE_FORMAT.TIME_FULL)}
                </Text>
            ),
        },
        {
            title: 'Cơ sở',
            width: 150,
            key: 'branch_cam',
            className: 'min-width-250',
            render: (record) =>
                (record?.branch_name && record.branch_name !== null && record.branch_name) || 'Chưa có cơ sở',
        },
        {
            title: 'Lớp',
            width: 150,
            key: 'class_cam',
            className: 'min-width-250',
            render: (record) =>
                (record?.class_name && record.class_name !== null && record.class_name) || 'Chưa có lớp',
        },

        {
            title: 'Hình ảnh',
            width: '150',
            className: 'min-width-150',
            render: (record) => (
                <ZoomableAvatar size="large" src={record.image_url}>
                    {/* {image_url ? '' : 'image_url'} */}
                </ZoomableAvatar>
            ),
        },
    ];

    return (
        <>
            <Helmet title="Quản lý té ngã" />
            <Pane className="p20">
                <Pane className={styles.heading}>
                    <h3 className={styles['heading--title']}>Quản lý té ngã</h3>
                </Pane>
                <Pane className="card mt20">
                    <Pane className="p20">
                        <Form
                            layout="vertical"
                            form={form}
                            initialValues={{
                                ...search,
                                date: search.startDate &&
                                    search.endDate && [moment(search.startDate), moment(search.endDate)],
                            }}
                        >
                            <Pane className="row">
                                <Pane className="col-lg-3">
                                    <FormItem
                                        name="date"
                                        type={variables.RANGE_PICKER}
                                        disabledDate={Helper.disabledDateRank}
                                        onChange={(value) => onChangeDateRank(value)}
                                    />
                                </Pane>
                                <Pane className="col-lg-3">
                                    <FormItem
                                        name="branch_id"
                                        type={variables.SELECT}
                                        data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                                        onChange={(value) => onChangeBranch(value)}
                                        allowClear={false}
                                    />
                                </Pane>
                                <Pane className="col-lg-3">
                                    <FormItem
                                        name="class_id"
                                        type={variables.SELECT}
                                        data={[{ id: null, name: 'Chọn tất cả các lớp' }, ...classes]}
                                        onChange={(value) =>
                                            setSearch((prevState) => ({ ...prevState, class_id: value }))
                                        }
                                        allowClear={false}
                                    />
                                </Pane>
                            </Pane>
                        </Form>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={effects['fallDetection/GET_DATA']}
                            isError={error.isError}
                            pagination={paginationProps}
                            rowKey={(record) => `${record?.id}`}
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
