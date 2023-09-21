import React from 'react';
import { history } from 'umi';
import { get } from 'lodash';
import { Result, Button } from 'antd';
import { variables } from '@/utils';

export default function systemError(props) {
  const onBack = () => {
    if (props.goBack) {
      return history.push(props.goBack);
    }
    return history.goBack();
  };

  if (get(props, 'error.status') === variables.STATUS_404) {
    return (
      <Result
        extra={
          <Button onClick={onBack} type="primary">
            Quay về
          </Button>
        }
        status={get(props, 'error.status')}
        subTitle="Trang này không tồn tại. Vui lòng kiềm tra lại."
        title={get(props, 'error.status')}
      />
    );
  }
  if (get(props, 'error.status') === variables.STATUS_403) {
    return (
      <Result
        extra={
          <Button onClick={onBack} type="primary">
            Quay về
          </Button>
        }
        status={get(props, 'error.status')}
        subTitle="Bạn không có quyền truy cập vào trang này. Vui lòng kiềm tra lại."
        title={get(props, 'error.status')}
      />
    );
  }
  if (get(props, 'error.status') === variables.STATUS_500) {
    return (
      <Result
        extra={
          <Button onClick={onBack} type="primary">
            Quay về
          </Button>
        }
        status={get(props, 'error.status')}
        subTitle="TDữ liệu lỗi. Vui lòng kiềm tra lại."
        title={get(props, 'error.status')}
      />
    );
  }
  if (get(props, 'error.status') === variables.STATUS_204) {
    return (
      <Result
        extra={
          <Button onClick={onBack} type="primary">
            Quay về
          </Button>
        }
        status={404}
        subTitle="Dữ liệu không tồn tại. Bạn vui lòng kiểm tra lại"
        title="Thông báo"
      />
    );
  }
  return (
    <Result
      extra={
        <Button onClick={onBack} type="primary">
          Quay về
        </Button>
      }
      status={404}
      subTitle="Dữ liệu không tồn tại. Bạn vui lòng kiểm tra lại"
      title="Thông báo"
    />
  );
}

systemError.propTypes = {};

systemError.defaultProps = {};

systemError.displayName = 'SystemError';
