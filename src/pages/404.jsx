import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage = () => (
  <div className="d-flex justify-content-center align-items-center h-100" style={{ zIndex: 1 }}>
    <Result
      extra={
        <Button onClick={() => history.push('/')} type="primary">
          Back Home
        </Button>
      }
      status="404"
      subTitle="Trang này không tồn tại vui lòng kiểm tra lại"
      title="404"
    />
  </div>
);

export default NoFoundPage;
