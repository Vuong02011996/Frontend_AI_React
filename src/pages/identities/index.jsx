import { memo, useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useHistory, useSelector, useDispatch } from 'umi';
import { Helmet } from 'react-helmet';
import { Form, notification } from 'antd';

import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import styles from '@/assets/styles/Common/common.scss';
import { variables, Helper } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Pane from '@/components/CommonComponent/Pane';
import ListImage from '@/components/CommonComponent/ListImage';
import FormItem from '@/components/CommonComponent/FormItem';

const Index = memo(() => {
    const [form] = Form.useForm();
    const [
        { effects },
        { data, error, pagination, branches, classes, students },
    ] = useSelector(({ loading, identities }) => [loading, identities]);
    const dispatch = useDispatch();
    const { query, pathname } = useLocation();
    const history = useHistory();

    const [search, setSearch] = useState({
        branch_id: query?.branch_id,
        class_id: query?.class_id,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        user_id: query?.user_id ? query?.user_id?.split(',') : null,
    });

    const loadClasses = (branchId) => {
        dispatch({
            type: 'identities/GET_CLASSES',
            payload: {
                branch: branchId,
            },
        });
        setSearch((prevState) => ({
            ...prevState,
            branch_id: branchId,
            class_id: null,
        }));
        form.setFieldsValue({
            class_id: null,
        });
    };

    const onChangeBranch = (branch) => {
        loadClasses(branch, 'change');
    };

    useEffect(() => {
        dispatch({
            type: 'identities/GET_BRANCHES',
            payload: {},
        });
    }, []);

    useEffect(() => {
        dispatch({
            type: 'identities/GET_STUDENTS',
            payload: {
                class: search.class_id,
                branchId: search.branch_id,
            },
        });
    }, [search.branch_id, search.class_id]);

    const onLoad = () => {
        dispatch({
            type: 'identities/GET_DATA',
            payload: {
                ...search,
            },
        });
        history.push(
            `${pathname}?${Helper.convertParamSearchConvert(
                {
                    ...search,
                },
                variables.QUERY_STRING,
            )}`,
        );
    };

    useEffect(() => {
        onLoad();
    }, [search]);

    const onRemove = (item, record) => {
        dispatch({
            type: 'identities/REMOVE',
            payload: {
                url_delete: item.src,
                user_id: record.user_id,
            },
            callback: (response) => {
                if (response) {
                    onLoad();
                }
            },
        });
    };

    // const mounted = useRef(false);

    const handleUpdateFace = (record, files) => {
        if (files.length === 0) {
            notification.error({
                message: 'THÔNG BÁO',
                description: 'Chưa có file ảnh! Vui lòng upload file!',
            });
        } else {
            dispatch({
                type: 'identities/ADD_FACE',
                payload: {
                    data: files,
                    user_id: record.user_id,
                },
                callback: (response) => {
                    if (response) {
                        if (response.status_code === 400) {
                            notification.error({
                                message: 'THÔNG BÁO',
                                description: response.message,
                            });
                        } else {
                            notification.success({
                                message: 'THÔNG BÁO',
                                description: response.message,
                            });
                            onLoad();
                        }
                    } else {
                        notification.error({
                            message: 'THÔNG BÁO',
                            description: 'Không nhận response từ api',
                        });
                    }
                },
            });
        }
    };

    const handleUpdateFromHSDT = () => {
        dispatch({
            type: 'identities/GET_DATA_FROM_BE',
            callback: (response) => {
                console.log('response GET_DATA_FROM_BE: ', response);
                if (response) {
                    if (response.status_code === 400) {
                        notification.error({
                            message: 'THÔNG BÁO',
                            description: response.message,
                        });
                    } else {
                        notification.success({
                            message: 'THÔNG BÁO',
                            description: response.message,
                        });
                        onLoad();
                    }
                } else {
                    notification.error({
                        message: 'THÔNG BÁO',
                        description: 'Không nhận response từ api',
                    });
                }
            },
        });
    };

    const columns = [
        {
            title: 'STT',
            width: 80,
            className: 'min-width-80',
            align: 'center',
            render: (text, record, index) => Helper.serialOrder(search?.page, index),
        },
        {
            title: 'Họ và tên',
            key: 'name',
            className: 'min-width-200',
            render: (record) => <Text size="normal">{record?.name}</Text>,
        },
        {
            title: 'Cơ sở',
            key: 'branch',
            className: 'min-width-200',
            render: (record) => <Text size="normal">{record?.branch_name || 'Chưa có cơ sở'}</Text>,
        },
        {
            title: 'Lớp',
            key: 'class',
            className: 'min-width-200',
            render: (record) => <Text size="normal">{record?.class_name || 'Chưa có lớp'} </Text>,
        },
        {
            title: 'Khuôn mặt',
            width: 150,
            className: 'min-width-150',
            render: (record) => (
                <ListImage
                    items={[...(record?.image_url?.map((item) => ({ src: item })) || [])]}
                    isAction
                    onRemove={(item) => {
                        onRemove(item, record);
                    }}
                />
            ),
        },
        {
            title: 'Thêm khuôn mặt',
            key: 'add',
            className: 'min-width-200',
            render: (record) => {
                const [filesLists, setFilesLists] = useState([]);
                const mountedSet = (setFunction, value) => setFunction(value);
                const uploadFiles = (file) => {
                    mountedSet(setFilesLists, (prev) => [...prev, file]);
                };
                return (
                    <div className="row d-flex align-items-center">
                        <MultipleImageUpload
                            files={filesLists}
                            callback={(files) => uploadFiles(files)}
                            removeFiles={(files) => mountedSet(setFilesLists, files)}
                        />
                        <Button color="success" onClick={() => handleUpdateFace(record, filesLists)}>
                            Thêm
                        </Button>
                    </div>
                );
            },
        },
    ];

    const paginationProps = useMemo(
        () => ({
            size: 'default',
            total: pagination?.total || 0,
            // pageSize: variables.PAGINATION.PAGE_SIZE,
            pageSize: 5,
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

    return (
        <>
            <Helmet title="Dữ liệu khuôn mặt đối tượng" />
            <Pane className="p20">
                <Pane className={styles.heading}>
                    <h3 className={styles['heading--title']}>Dữ liệu khuôn mặt </h3>
                    <Button
                        className="ml-auto"
                        color="success"
                        onClick={handleUpdateFromHSDT}
                        loading={effects['identities/GET_DATA_FROM_BE']}
                    >
                        Cập nhật từ hồ sơ đối tượng
                    </Button>
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
                                name: query?.name,
                                user_id: search?.user_id || null,
                            }}
                        >
                            <Pane className="row">
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
                            loading={effects['identities/GET_DATA']}
                            isError={error.isError}
                            pagination={paginationProps}
                            rowKey={(record) => record?.user_id}
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
