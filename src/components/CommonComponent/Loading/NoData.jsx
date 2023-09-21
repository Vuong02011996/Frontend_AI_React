import React from 'react';
import { Empty } from 'antd';

export default function noData() {
  return (
    <div>
      <Empty />
    </div>
  );
}

noData.propTypes = {};

noData.defaultProps = {};

noData.displayName = 'NoData';
