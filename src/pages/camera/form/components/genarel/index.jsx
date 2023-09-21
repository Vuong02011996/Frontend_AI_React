import { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import Loading from '@/components/CommonComponent/Loading';

const Index = memo(({ form }) => {
  const [
    loading,
    { error, branches, classes },
  ] = useSelector(({ loading: { effects }, cameraAdd }) => [effects, cameraAdd]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'cameraAdd/GET_BRANCHES',
      payload: {},
    });
  }, []);

  const onChangeBranch = (branch) => {
    form.setFieldsValue({ class_id: null });
    dispatch({
      type: 'cameraAdd/GET_CLASSES',
      payload: {
        branch,
      },
    });
  };

  return (
    <Loading
      loading={loading['cameraAdd/GET_DATA'] || loading['cameraAdd/GET_BRANCHES']}
      isError={error.isError}
      params={{
        error,
        type: 'container',
        goBack: '/camera',
      }}
    >
      <Pane className="border-bottom pb20 pr20 pl20">
        <FormItem
          label="Tên Camera"
          name="name_cam"
          type={variables.INPUT}
          rules={[variables.RULES.EMPTY]}
        />
        <FormItem
          data={branches}
          label="Cơ sở"
          name="branch_id"
          type={variables.SELECT}
          rules={[variables.RULES.EMPTY]}
          onChange={onChangeBranch}
        />
        <FormItem
          data={classes}
          label="Lớp"
          name="class_id"
          type={variables.SELECT}
          rules={[variables.RULES.EMPTY]}
        />
        <FormItem
          label="Vị trí"
          name="position_cam"
          type={variables.INPUT}
          rules={[variables.RULES.EMPTY]}
        />
        <FormItem label="IP" name="ip_cam" type={variables.INPUT} rules={[variables.RULES.EMPTY]} />
        <FormItem
          label="PORT"
          name="port_cam"
          type={variables.INPUT}
          rules={[variables.RULES.EMPTY]}
        />
        <FormItem label="Tên đăng nhập" name="username_cam" type={variables.INPUT} />
        <FormItem label="Mật khẩu" name="password_cam" type={variables.INPUT} />
      </Pane>
    </Loading>
  );
});

Index.propTypes = {
  form: PropTypes.any,
};

Index.defaultProps = {
  form: null,
};
export default Index;
