import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import Loading from './Loading';
import Empty from './Empty';
import SystemError from './SystemError';

export default function TableCustom({ ...props }) {
  if (props.isError) {
    return <SystemError error={props.error} />;
  }
  if (props.loading) {
    return <Loading {...props.params} />;
  }
  if (props.params.hiddenEmpty) {
    return (
      <Table
        {...props}
        className={`${props.loading && 'opacity'} ${props.className}`}
        loading={{
          spinning: !!props.loading,
          size: 'large',
        }}
      />
    );
  }
  if (props.dataSource?.length > 0 || props.isEmpty) {
    return (
      <Table
        {...props}
        className={`${props.loading && 'opacity'} ${props.className}`}
        loading={{
          spinning: !!props.loading,
          size: 'large',
        }}
      />
    );
  }
  return <Empty />;
}

TableCustom.propTypes = {
  isError: PropTypes.bool,
  loading: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  rowSelection: PropTypes.objectOf(PropTypes.any),
  onRow: PropTypes.func,
  components: PropTypes.objectOf(PropTypes.any),
  size: PropTypes.string,
  showHeader: PropTypes.bool,
  params: PropTypes.any,
  hiddenEmpty: PropTypes.bool,
  error: PropTypes.objectOf(PropTypes.any),
  isEmpty: PropTypes.bool,
};

TableCustom.defaultProps = {
  isError: false,
  loading: false,
  className: '',
  rowSelection: undefined,
  onRow: undefined,
  components: undefined,
  size: '',
  showHeader: true,
  dataSource: [],
  params: {},
  hiddenEmpty: false,
  error: {},
  isEmpty: false,
};

TableCustom.displayName = 'Tag';
