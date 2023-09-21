import { memo, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio } from 'antd';
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
    ] = useSelector(({ loading: { effects }, results_attendance }) => [effects, results_attendance]);

    const history = useHistory();
    const { query, pathname } = useLocation();
    const [form] = Form.useForm();

    const [search, setSearch] = useState({
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        branch_id: query?.branch_id,
        class_id: query?.class_id,
        fromDate: query?.fromDate ? moment(query?.fromDate) : moment().startOf('months'),
        toDate: query?.toDate ? moment(query?.toDate) : moment().endOf('months'),
        user_id: query?.user_id ? query?.user_id?.split(',') : null,
        status_result_ai: query?.status_result_ai ? query.status_result_ai : 1, // nếu có thì lấy không thì mặc định 1 lấy tất cả
    });

    const onLoad = () => {
        dispatch({
            type: 'results_attendance/GET_DATA',
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
    // console.log('data: ', data);

    const columns = useMemo(
        () => [
            {
                title: 'Họ và tên',
                key: 'name',
                width: 150,
                className: 'min-width-150',
                render: (record) => <Text size="normal">{record?.name}</Text>,
            },
            {
                title: 'Cơ sở',
                width: 150,
                key: 'branch_cam',
                className: 'min-width-150',
                render: (record) =>
                    (record?.branch_name && record.branch_name !== null && record.branch_name) || 'Chưa có cơ sở',
            },
            {
                title: 'Lớp',
                width: 150,
                key: 'class_cam',
                className: 'min-width-150',
                render: (record) =>
                    (record?.class_name && record.class_name !== null && record.class_name) || 'Chưa có lớp',
            },
            {
                title: 'Vào lớp',
                width: 180,
                className: 'min-width-180',
                render: (record) => (
                    <Text size="normal">
                        {Helper.getDate(
                            record?.time_go_in_class && record.time_go_in_class !== null && record.time_go_in_class,
                            variables.DATE_FORMAT.FULL_DATE_TIME_2,
                        )}
                    </Text>
                ),
            },
            {
                title: 'Camera điểm danh',
                width: 50,
                key: 'class_cam',
                className: 'min-width-150',
                render: (record) => (record?.status_result_ai && record.status_result_ai === true ? 'Có' : 'Không'),
            },

            {
                title: 'Hình nhận diện',
                width: 150,
                className: 'min-width-150',
                render: (record) => (
                    <ListImage
                        items={[
                            ...(record?.url_face?.map((item) => ({ src: item })) || []),
                            ...(record?.avatars_match ? [{ src: record?.avatars_match }] : []),
                        ]}
                    />
                ),
            },
            {
                title: 'Kết quả camera điểm danh',
                width: 150,
                key: 'class_cam',
                className: 'min-width-150',
                render: (record) => {
                    if (record.status_result_ai === false) {
                        return <p>Nhận diện thiếu</p>;
                    }
                    const [value, setValue] = useState();
                    // if (record?.result_ai) {
                    //     let value_check = 0;
                    //     if (record?.result_ai && record?.result_ai === 'Đúng') {
                    //         value_check = 1;
                    //     } else if (record?.result_ai && record?.result_ai === 'Sai') {
                    //         value_check = 2;
                    //     }
                    //     // setValue(value_check);
                    // }

                    const onChangeResultAttendance = (e) => {
                        // console.log('radio checked', e.target.value);
                        setValue(e.target.value);
                        // dispatch({
                        //     type: 'results_attendance/UPDATE_RESULT_AI',
                        //     payload: {
                        //         id_object_attendance: record?.id_object_attendance,
                        //         result_ai: e.target.value,
                        //     },
                        // });
                    };
                    return (
                        <Radio.Group onChange={onChangeResultAttendance} value={value}>
                            <Radio value={1}>Nhận diện đúng</Radio>
                            <Radio value={2}>Nhận diện sai</Radio>
                        </Radio.Group>
                    );
                },
            },
        ],
        [],
    );

    const loadClasses = (idBranch) => {
        dispatch({
            type: 'results_attendance/GET_CLASSES',
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
            type: 'results_attendance/GET_BRANCHES',
            payload: {},
        });
    }, []);

    useEffect(() => {
        onLoad();
    }, [search]);

    useEffect(() => {
        dispatch({
            type: 'results_attendance/GET_STUDENTS',
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
            <Pane className="p20">
                <Pane className={classnames(styles.heading)}>
                    <h3 className={styles['heading--title']}>Kết quả điểm danh</h3>
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
                                status_result_ai: search?.user_id || null,
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
                                <Pane className="col-lg-6">
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
                                <Pane className="col-lg-6">
                                    <FormItem
                                        data={[
                                            { id: 1, name: 'Tất cả kết quả' },
                                            { id: 2, name: 'Camera có điểm danh' },
                                            { id: 3, name: 'Camera không điểm danh được' },
                                        ]}
                                        name="status_result_ai"
                                        type={variables.SELECT}
                                        placeholder="Lọc theo kết quả AI"
                                        // allowClear={false}
                                        onChange={(value) =>
                                            setSearch((prev) => ({ ...prev, status_result_ai: value }))
                                        }
                                    />
                                </Pane>
                            </Pane>
                        </Form>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={loading['results_attendance/GET_DATA']}
                            isError={error.isError}
                            pagination={paginationProps}
                            rowKey={(record) => (record?.id ? record?.id : `${Math.random() * 1000000}`)}
                            className="table-normal"
                            scroll={{ x: '100%' }}
                        />
                    </Pane>
                </Pane>

                <Pane className={classnames(styles.heading)}>
                    <h3 className={styles['heading--title']}>Kết quả:</h3>
                </Pane>
            </Pane>
        </>
    );
});

export default Index;
