import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import { connect, Link } from 'umi';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import styles from './index.scss';

const cookies = new Cookies();
@connect(({ user, loading }) => ({ user, loading }))
class Index extends PureComponent {
  /**
   * Function Submit Form Login
   * @param {object} values values of form login
   * @param {function} dispatch Call effects model login
   */
  onFinish = (values) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    cookies.remove('access_token', { path: '/' });
    cookies.remove('token_type', { path: '/' });
    dispatch({
      type: 'user/login',
      payload: {
        ...values,
        redirect: query.redirect,
        grant_type: 'password',
        scope: 'Erp',
      },
    });
  };

  render() {
    const {
      loading: { effects },
    } = this.props;
    const loading = effects['user/login'];
    return (
      <div className={classnames(styles.block, 'login-container')}>
        <Helmet title="Login" />
        <div className={styles.inner}>
          <div className={styles.form}>
            <div
              className={classnames(styles['logo-container'], 'd-flex', 'justify-content-center')}
            >
              <Link to="/">
                <img src="/images/logo.png" alt="logo" />
              </Link>
            </div>
            <Form hideRequiredMark initialValues={{}} layout="vertical" onFinish={this.onFinish}>
              <FormItem
                label="User ID / Email"
                name="username"
                rules={[variables.RULES.EMPTY_INPUT]}
                type={variables.INPUT}
                className="input-login"
              />
              <FormItem
                label="Mật khẩu"
                name="password"
                rules={[variables.RULES.EMPTY_INPUT]}
                type={variables.INPUT_PASSWORD}
                className="input-password"
              />
              <div className="form-actions">
                <Button
                  color="success"
                  htmlType="submit"
                  className={styles.button}
                  loading={loading}
                >
                  ĐĂNG NHẬP
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Index;
