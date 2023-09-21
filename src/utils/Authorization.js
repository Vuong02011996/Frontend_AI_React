import React, { Component } from 'react';
import { Redirect } from 'umi';
import { intersection, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { isValidCondition } from '@/utils/authority';

const vaild = (permission, allowedPermission, orPermission = false) => {
  if (
    (!orPermission &&
      intersection(permission, allowedPermission)?.length === allowedPermission?.length) ||
    (orPermission && intersection(permission, allowedPermission)?.length > 0)
  ) {
    return true;
  }

  return false;
};

const Authorization = (
  allowedPermission = [],
  isPage = false,
  allowedOrPermission,
  customCondition,
) => WrappedComponent => {
  let dataPermission = allowedPermission;
  const dataOrPermission = allowedOrPermission;

  class WithAuthorization extends Component {
    render() {
      const { orPermission, auth, permission, children } = this.props;
      const parentProps = { ...this.props };

      if (permission) {
        dataPermission = permission;
      }

      // Trường hợp có điều kiện đặc biệt
      let isValidCustomCondition = false;
      if (!isEmpty(customCondition)) {
        const isValid = isValidCondition({
          ...customCondition,
          userPermission: auth.permission,
        });
        isValidCustomCondition = isValid;
      }

      if (
        (!orPermission &&
          !dataOrPermission &&
          intersection(auth.permission, dataPermission)?.length === dataPermission?.length) ||
        (orPermission &&
          !dataOrPermission &&
          intersection(auth.permission, orPermission)?.length > 0) ||
        (dataOrPermission && intersection(auth.permission, dataOrPermission)?.length > 0) ||
        isValidCustomCondition
      ) {
        if (children) {
          return children;
        }

        return <WrappedComponent {...parentProps} />;
      }

      if (isPage) {
        return <Redirect push to="/" />;
      }

      return false;
    }
  }

  WithAuthorization.propTypes = {
    auth: PropTypes.objectOf(PropTypes.any),
    orPermission: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ]),
    permission: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ]),
    children: PropTypes.any,
    actions: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  WithAuthorization.defaultProps = {
    auth: {},
    orPermission: undefined,
    permission: undefined,
    children: undefined,
  };

  return WithAuthorization;
};

export default {
  Component: Authorization,
  Element: Authorization()(),
  vaild,
};
