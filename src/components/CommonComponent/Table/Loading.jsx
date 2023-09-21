import React, { PureComponent } from 'react';
import { Skeleton, Table, Spin } from 'antd';
import PropTypes from 'prop-types';

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
      const { type, showHeader, header, className } = this.props;
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
        <div className={`${className}`}>
          {!type && <Skeleton active {...this.props} />}
          {type === 'multiple' && (
            <>
              {
                         
              }
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
              className="table-loading"
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
  type: '',
  header: null,
  className: '',
  showHeader: true,
};
export default Loading;
