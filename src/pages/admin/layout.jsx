import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import classnames from 'classnames';

const mapStateToProps = ({ settings }) => ({
  isMenuCollapsed: settings.isMenuCollapsed,
});
@withRouter
@connect(mapStateToProps)
class Index extends PureComponent {
  render() {
    const { children, isMenuCollapsed } = this.props;
    return (
      <Layout.Content
        className={classnames({ [`${styles['layout-collapse']}`]: isMenuCollapsed })}
        style={{ height: '100%', position: 'relative' }}
      >
        <div className={styles.content}>{children}</div>
      </Layout.Content>
    );
  }
}

Index.propTypes = {
  children: PropTypes.any,
  isMenuCollapsed: PropTypes.bool,
};

Index.defaultProps = {
  children: null,
  isMenuCollapsed: false,
};

export default Index;
