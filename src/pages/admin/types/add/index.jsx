import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const [
    { menuLeftData },
    loading,
    { error },
  ] = useSelector(({ menu, loading: { effects }, typesAdd }) => [menu, effects, typesAdd]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'typesAdd/UPDATE' : 'typesAdd/ADD',
      payload: {
        ...values,
        ...params,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
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
          type: 'typesAdd/REMOVE',
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
        type: 'typesAdd/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
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

  return (
    <>
      <Helmet title="Quản lý nông sản" />
      <Breadcrumbs last="Tạo mới" menu={menuLeftData} />
      <Pane>
        <Pane className="pl20 pr20 mt20">
          <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
            <Pane className="row">
              <Pane className="offset-lg-3 col-lg-6">
                <Pane className="card">
                  <Loading
                    loading={loading['typesAdd/GET_DATA']}
                    isError={error.isError}
                    params={{
                      error,
                      type: 'container',
                      goBack: '/quan-ly/loai-nong-san',
                    }}
                  >
                    <Pane className="border-bottom p20">
                      <h3 type={styles['title-form']}>Thông tin chung</h3>
                      <Pane className="row mt20">
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Tên loại nông sản"
                            name="name"
                            type={variables.INPUT}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </Pane>
                      </Pane>
                    </Pane>
                  </Loading>
                </Pane>
                <Pane className="d-flex justify-content-between align-items-center mb20">
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
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loading['typesAdd/ADD'] || loading['typesAdd/UPDATE']}
                  >
                    Lưu
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
