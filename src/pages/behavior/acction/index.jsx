import { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch, useParams, useHistory } from 'umi';
import ReactPlayer from 'react-player';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import styles from '@/assets/styles/Common/common.scss';
import { Form } from 'antd';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import classNames from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import { EditableCell, EditableRow } from '@/components/CommonComponent/Table/EditableCell';
import { v4 as uuidv4 } from 'uuid';

const Index = memo(() => {
  const [
    menuLeftData,
    { details, students, error },
    { effects },
  ] = useSelector(({ menu, manageBehaviorAcction, loading }) => [
    menu,
    manageBehaviorAcction,
    loading,
  ]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [data, setData] = useState([]);

  const onRemove = (record) => {
    setData((prevState) => prevState.filter((item) => item.id !== record.id));
  };

  const onAdd = () => {
    setData((prev) => [...prev, { id: uuidv4() }]);
  };

  const columns = [
    {
      title: <span className="text-white">STT</span>,
      width: 10,
      className: 'min-width-10',
      align: 'center',
      render: (text, record, index) => Helper.sttList(1, index, details?.url_face.length),
    },
    {
      title: <span className="text-white">Học sinh</span>,
      width: 180,
      className: 'min-width-180',
      editable: true,
      dataIndex: 'studentId',
      key: 'student',
      type: variables.SELECT,
      dataSelect: students?.map((item) => ({ ...item, name: item.fullName })),
      render: () => (
        <Select
          dataSet={students?.map((item) => ({ ...item, name: item.fullName }))}
          style={{ width: '100%' }}
          placeholder="Chọn"
        />
      ),
    },
    {
      title: <span className="text-white">Ảnh đại diện</span>,
      width: 100,
      className: 'min-width-100',
      key: 'avatar',
      align: 'center',
      render: (record) => (
        <div className={classNames(styles['img-zone'])}>
          <img src={record?.url_image} alt={record.url_image ? 'anh safe-zone' : ''} />
        </div>
      ),
    },
    {
      title: '',
      className: 'min-width-10',
      width: 10,
      render: (record) => (
        <div className={styles.action}>
          <button
            type="button"
            className={styles['action--button']}
            onClick={() => onRemove(record)}
          >
            <span className="icon-remove" />
          </button>
        </div>
      ),
    },
  ];

  const columnsTable = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        type: col.type,
        title: col.title,
        dataSelect: col.dataSelect,
        editable: col.editable,
      }),
    };
  });

  useEffect(() => {
    dispatch({
      type: 'manageBehaviorAcction/GET_DATA',
      payload: {
        user_id: params?.id,
      },
      callback: (response) => {
        if (response) {
          form.setFieldsValue({
            message: response.message,
          });
        }
      },
    });

    dispatch({
      type: 'manageBehaviorAcction/GET_STUDENTS',
      payload: {
        class: '',
      },
    });
  }, []);

  useEffect(() => {
    setData(details?.url_face?.map((item) => ({ id: uuidv4(), url_image: item })));
  }, [details]);

  const onFinish = (value) => {
    dispatch({
      type: 'manageBehaviorAcction/UPDATE',
      payload: {
        ...details,
        message: value.message,
      },
      callback: (response) => {
        if(response) {
          history.goBack();
        }
      }
    });
  };

  return (
    <>
      <div className="pl-4 pt-2">
        <Breadcrumbs last="Chi tiết" menu={menuLeftData} />
      </div>
      <div className={classNames(styles['form-zone'], 'm-3')}>
        <Pane className="card p20">
          <Pane className={styles.heading}>
            <h4 className={styles['heading--title']}>Thông tin chung</h4>
          </Pane>
          <Pane className="w-100 d-flex flex-row justify-content-between my-3">
            <div className="d-flex flex-column ">
              <Text size="normal">Ngày</Text>
              <Text size="medium" className={styles['font-weight-bold']}>
                {Helper.getDate(details?.time_go_in_behavior, variables.DATE_FORMAT.DATE_VI)}
              </Text>
            </div>
            <div className="d-flex flex-column ">
              <Text size="normal">Hành vi</Text>
              <Text size="medium" className={styles['font-weight-bold']}>
                {details?.name_behavior}
              </Text>
            </div>
            <div className="d-flex flex-column ">
              <Text size="normal">Thời điểm</Text>
              <Text size="medium" className={styles['font-weight-bold']}>
                {Helper.getDate(details?.time_go_in_behavior, variables.DATE_FORMAT.TIME_FULL)}
              </Text>
            </div>
          </Pane>
          <div className="mt-2">
            <Text className={styles['font-weight-bold']} size="medium">
              Clip
            </Text>
            <div className="w-100">
              <ReactPlayer url={details?.clip_url} width="95%" height="285px" controls />
            </div>
          </div>
          <div className="mt-3">
            <Text size="medium" className={styles['font-weight-bold']}>
              Hình ảnh
            </Text>
            <div className="w-100 d-flex flex-row mt-2">
              {details?.image_url?.map((item, idx) => (
                <div className={classNames(styles['img-details-zone'], 'mr-2')} key={idx}>
                  <img src={item} alt={`anh camera ${idx}`} />
                </div>
              ))}
            </div>
          </div>
        </Pane>
        <Form className="w-100 d-flex flex-column" form={form} layout="vertical" onFinish={onFinish}>
          <div className={classNames('border-bottom rounded-top', styles['bg-white'])}>
            <div className="p20">
              <Pane className={classNames(styles.heading, 'mb-3')}>
                <h4 className={styles['heading--title']}>Nội dung</h4>
              </Pane>
              <FormItem type={variables.TEXTAREA} name="message" />
            </div>
          </div>
          <div className={classNames('border-bottom', styles['bg-white'])}>
            <div className="p20">
              <Pane className={styles.heading}>
                <h5 className={styles['heading--title']}>Thông tin học sinh</h5>
              </Pane>
              <Table
                columns={columnsTable}
                dataSource={data}
                loading={effects['manageBehaviorAcction/GET_STUDENTS']}
                isError={error.isError}
                components={{
                  body: {
                    row: EditableRow,
                    cell: EditableCell,
                  },
                }}
                pagination={false}
                rowKey={(record) => record?.id}
                className={classNames('table-edit', styles['table-details'])}
                scroll={{ x: '100%' }}
                footer={() => (
                  <Button color="success" icon="plus" onClick={onAdd}>
                    Thêm
                  </Button>
                )}
              />
            </div>
          </div>
          <div
            className={classNames(
              'border-bottom rounded-bottom d-flex justify-content-end px-4 py-2',
              styles['bg-white'],
            )}
          >
            <Button color="success" loading={effects['manageBehaviorAcction/UPDATE']} htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
});

export default Index;
