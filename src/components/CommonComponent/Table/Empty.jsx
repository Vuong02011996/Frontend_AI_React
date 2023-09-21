import React from 'react';
import PropTypes from 'prop-types';
import { Empty } from 'antd';

export default function Index(props) {
  return (
    <Empty description={props.description} />
  );
}

Index.propTypes = {
  description: PropTypes.string
};

Index.defaultProps = {
  description: 'Chưa có dữ liệu'
};

Index.displayName = 'Index';
