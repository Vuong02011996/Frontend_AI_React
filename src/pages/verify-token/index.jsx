import React, { PureComponent } from 'react';
import { connect } from 'umi';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.scss';

@connect(({ user, loading }) => ({ user, loading }))
class Index extends PureComponent {
  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    dispatch({
      type: 'user/VERIFY_TOKEN',
      payload: {
        access_token: query.token,
        token_type: 'Bearer',
      },
    });
  }

  render() {
    return <div className={classnames(styles.block, 'login-container')} />;
  }
}

Index.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  location: {},
};

export default Index;
