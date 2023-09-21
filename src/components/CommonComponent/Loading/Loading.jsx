import React, { PureComponent } from 'react';
import { Skeleton, Table, Spin } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';

class Loading extends PureComponent {
  header = () => {
    const renderHeader = [];
    for (let i = 0; i < 5; i += 1) {
      renderHeader.push({
        key: `key${i + 1}`,
        title: <Skeleton active paragraph={{ rows: 1 }} title={false} />,
        align: 'left',
        render: () => <Skeleton active paragraph={{ rows: 1 }} title={false} />,
      });
    }
    return renderHeader;
  }

  render() {
    const { type, showHeader, header } = this.props;
    const tableColumns = () => {
      if (!header) {
        return this.header();
      }
      const tableHeader = header.map(value => {
        const newValue = {
          ...value,
          render: () => <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />,
        };
        return newValue;
      });
      return tableHeader;
    };

    return (
      <div className={classnames(styles['loading-container'], 'd-flex', 'justify-content-center', 'align-items-center')}>
        {!type && <Skeleton active {...this.props} />}
        {type === 'multiple' && (
          <>
            <Skeleton active {...this.props} />
            <Skeleton active {...this.props} />
            <Skeleton active {...this.props} />
            <Skeleton active {...this.props} />
            <Skeleton active {...this.props} />
          </>
        )}
        {type === 'table' && (
          <Table
            bordered={false}
            columns={tableColumns()}
            dataSource={[{ key: 0 }, { key: 1 }]}
            pagination={false}
            showHeader={showHeader}
          />
        )}
        {type === 'container' && (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  }
}

Loading.propTypes = {
  header: PropTypes.any,
  type: PropTypes.string,
  className: PropTypes.string,
  showHeader: PropTypes.bool,
};

Loading.defaultProps = {
  header: null,
  type: '',
  className: '',
  showHeader: true,
};
export default Loading;
