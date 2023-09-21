import { memo, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useLocation, useHistory, useSelector, useDispatch } from 'umi';
import classnames from 'classnames';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import moment from 'moment';
import Paragraph from '@/components/CommonComponent/Paragraph';

const { TabPane } = Tabs;
const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    loading,
    { pagination, error, data, branches, classes, students },
  ] = useSelector(({ loading: { effects }, reportName }) => [effects, reportName]);

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
  });

  const onLoad = () => {
    dispatch({
      type: 'reportName/GET_DATA',
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
        render: (record) => record?.branch_cam,
      },
      {
        title: 'Lớp',
        width: 150,
        key: 'class_cam',
        className: 'min-width-150',
        render: (record) => record?.class_cam,
      },
      {
        title: 'Điểm danh bằng AI vào lớp',
        width: 180,
        className: 'min-width-180',
        render: (record) => (
          <Paragraph>
            {record?.time_go_in_class.map((item) => (
              <Text size="normal" key={item}>
                {Helper.getDate(item, variables.DATE_FORMAT.FULL_DATE_TIME_2)}
              </Text>
            ))}
          </Paragraph>
        ),
      },
      {
        title: 'Số lần',
        width: 180,
        className: 'min-width-180',
        render: (record) => <Text size="normal">{record?.count_roll_call}</Text>,
      },
    ],
    [],
  );

  const loadClasses = (idBranch) => {
    dispatch({
      type: 'reportName/GET_CLASSES',
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
      type: 'reportName/GET_BRANCHES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    onLoad();
  }, [search]);

  useEffect(() => {
    dispatch({
      type: 'reportName/GET_STUDENTS',
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
      <Helmet title="Báo cáo điểm danh" />
      <Pane className="p20">
        <Pane className={classnames(styles.heading)}>
          <h3 className={styles['heading--title']}>Báo cáo điểm danh</h3>
        </Pane>

        <Pane className="card mt20">
          <Pane className="p20">
            <Tabs
              defaultActiveKey="OBJECT"
              onChange={(value) => {
                if (value === 'DAILY') {
                  history.push('/quan-ly/bao-cao-hang-ngay');
                }
              }}
            >
              <TabPane tab="Báo cáo hàng ngày" key="DAILY" />
              <TabPane tab="Báo cáo theo đối tượng" key="OBJECT" />
            </Tabs>
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
              loading={loading['reportName/GET_DATA']}
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
