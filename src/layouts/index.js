import React, { Fragment } from 'react';
import { connect, Redirect } from 'umi';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Loader from '@/components/LayoutComponents/Loader';
import LoginLayout from './Login';
import AdminLayout from './Admin';

const Layouts = {
  login: LoginLayout,
  admin: AdminLayout,
};

@connect(({ user, loading }) => ({ user, loading }))
class IndexLayout extends React.PureComponent {
  previousPath = '';

  render() {
    const {
      children,
      loading,
      location: { pathname, search, query },
      user,
    } = this.props;

    // Layout Rendering
    const getLayout = () => {
      if (/^\/login(?=\/|$)/i.test(pathname) || /^\/verify-token(?=\/|$)/i.test(pathname)) {
        return 'login';
      }
      return 'admin';
    };

    const Container = Layouts[getLayout()];
    const isUserAuthorized = user.authorized;
    const isUserLoading = loading.models.user;
    const isLoginLayout = getLayout() === 'login';

    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authorized yet and not on login pages
      if (isUserLoading && !isUserAuthorized && !isLoginLayout) {
        return <Loader />;
      }
      // redirect to login page if current is not login page and user not authorized
      if (!isLoginLayout && !isUserAuthorized) {
        return (
          <Redirect to={{ pathname: '/login', query: { redirect: `${pathname}?${search}` } }} />
        );
      }
      if (isLoginLayout && isUserAuthorized) {
        if (query.redirect) {
          return <Redirect to={query.redirect} />;
        }
        return <Redirect to="/camera" />;
      }
      // in other case render previously set layout
      return <Container>{children}</Container>;
    };

    return (
      <>
        <Helmet title="Clover AI" titleTemplate="Clover AI | %s" />
        {BootstrappedLayout()}
      </>
    );
  }
}

IndexLayout.propTypes = {
  location: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.any,
  loading: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

IndexLayout.defaultProps = {
  location: {},
  children: {},
  loading: {},
  user: {},
};

export default IndexLayout;
