import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { withRouter, connect } from 'umi';
import styles from './style.module.scss';

const mapStateToProps = ({ settings }) => ({
  background: settings.background,
});

@withRouter
@connect(mapStateToProps)
class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Layout.Content className={styles.wrapper}>
          <div className={styles.content}>{children}</div>
        </Layout.Content>
      </Layout>
    );
  }
}

LoginLayout.propTypes = {
  children: PropTypes.objectOf(PropTypes.any),
};

LoginLayout.defaultProps = {
  children: null,
};

export default LoginLayout;
