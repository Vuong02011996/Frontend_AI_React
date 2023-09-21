import { memo, useMemo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs, Modal } from 'antd';
import { useLocation, useHistory, useSelector, useDispatch } from 'umi';
import classnames from 'classnames';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { TabPane } = Tabs;
const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    loading,
    { pagination, error, data, branches, classes },
  ] = useSelector(({ loading: { effects }, camera }) => [effects, camera]);

  const history = useHistory();
  const { query, pathname } = useLocation();
  const [form] = Form.useForm();

  const mounted = useRef(false);

  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
    branch_id: query.branch_id,
    class_id: query.class_id,
    status: variables.STATUS.CONNECT,
  });

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  const onLoad = () => {
    dispatch({
      type: 'camera/GET_DATA',
      payload: { ...search },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
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

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  const onRemove = (id) => {
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'camera/REMOVE',
          payload: id,
          callback: (response) => {
            if (response) onLoad();
          },
        });
      },
      onCancel() {},
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
      title: 'Tên camera',
      key: 'name',
      width: 150,
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record?.name_cam}</Text>,
    },
    {
      title: 'Cơ sở',
      width: 150,
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record?.branch_cam}</Text>,
    },
    {
      title: 'Lớp',
      width: 150,
      className: 'min-width-150',
      render: (record) => <Text size="normal">{record?.class_cam}</Text>,
    },
    {
      title: 'Vị trí',
      width: 200,
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record?.position_cam}</Text>,
    },
    {
      title: 'Trạng thái',
      width: 150,
      className: 'min-width-150',
      render: (record) => Helper.tagCamera(record.status_cam),
    },
    {
      title: 'Thao tác',
      className: 'min-width-100',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (record) => (
        <div className={styles.action}>
          <button
            type="button"
            className={classnames(styles['action--button'], styles['action--button__success'])}
            onClick={(e) => {
              e.stopPropagation();
              history.push(`${pathname}/${record?.cam_id}/chi-tiet-chinh-sua`);
            }}
          >
            <span className="icon-edit" />
          </button>
          <button
            type="button"
            className={styles['action--button']}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(record.cam_id);
            }}
          >
            <span className="icon-remove" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'camera/GET_BRANCHES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    onLoad();
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onChangeBranch = (branch) => {
    form.setFieldsValue({ class_id: null });
    changeFilter('branch_id')(branch);
    dispatch({
      type: 'camera/GET_CLASSES',
      payload: {
        branch,
      },
    });
  };

  return (
    <>
      <Helmet title="Quản lý Camera" />
      <Pane className="p20">
        <Pane className={classnames(styles.heading)}>
          <h3 className={styles['heading--title']}>Quản lý Camera</h3>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/them-moi`)}
          >
            Tạo mới
          </Button>
        </Pane>

        <Pane className="card mt20">
          <Pane className="p20">
            <Tabs
              defaultActiveKey={search.status}
              onChange={(value) => changeFilter('status')(value)}
            >
              <TabPane tab="Đang hoạt động" key="CONNECT" />
              <TabPane tab="Không có tín hiệu" key="DISCONNECT" />
            </Tabs>
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                ...search,
                branch_id: search.branch_id || null,
                class_id: search.class_id || null,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.INPUT_SEARCH}
                    name="keyWord"
                    onChange={({ target: { value } }) => changeFilter('keyWord')(value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả cơ sở' }, ...branches]}
                    name="branch_id"
                    type={variables.SELECT}
                    onChange={onChangeBranch}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                    name="class_id"
                    type={variables.SELECT}
                    allowClear={false}
                    onChange={(value) => changeFilter('class_id')(value)}
                  />
                </Pane>
              </Pane>
            </Form>
            <Table
              columns={columns}
              dataSource={data}
              loading={loading['camera/GET_DATA']}
              isError={error.isError}
              pagination={paginationProps}
              rowKey={(record) => record.cam_id}
              className="table-normal"
              scroll={{ x: '100%' }}
              onRow={(record) => ({
                onClick: () => {
                  history.push(`${pathname}/${record?.cam_id}/chi-tiet-stream`);
                },
              })}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
