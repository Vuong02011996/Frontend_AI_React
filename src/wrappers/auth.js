import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import { connect, Redirect } from 'umi';
import PropTypes from 'prop-types';
import { isValidCondition, getRouteAuthority } from '@/utils/authority';

@connect(({ user }) => ({ user }))
class Index extends PureComponent {
  render() {
    const { user } = this.props;
    const routerAuthority =
      getRouteAuthority(this.props.location.pathname, this.props.route) || [];
    if (isEmpty(routerAuthority)) {
      return <>{this.props.children}</>;
    }
    if (user) {
      const isPermission = isValidCondition({
        conditions: [
          {
            permission: !isEmpty(routerAuthority) ? routerAuthority : [''],
            isOrPermission: false,
          },
        ],
        userPermission: user.permissions,
      });
      if (isPermission) {
        return <>{this.props.children}</>;
      }
      return <Redirect to="/" />;
    }
    return <Redirect to="/" />;
  }
}

Index.propTypes = {
  children: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
  route: PropTypes.any.isRequired,
  user: PropTypes.any,
};
Index.defaultProps = {
  user: {},
};
export default Index;
