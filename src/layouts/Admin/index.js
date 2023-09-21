import React from 'react';
import { Layout } from 'antd';
import { connect, withRouter } from 'umi';
import classnames from 'classnames';
import Menu from '@/components/LayoutComponents/Menu';
import PropTypes from 'prop-types';
import TopBar from '@/components/LayoutComponents/TopBar';
import styles from './style.module.scss';

const mapStateToProps = ({ settings, menu }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isMenuCollapsed: settings.isMenuCollapsed,
  menuData: menu.menuLeftData,
});

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  render() {
    const {
      children,
      isMenuTop,
      isBorderless,
      isFixedWidth,
      isMenuShadow,
      isSquaredBorders,
      menuData,
    } = this.props;
    return (
      <Layout
        className={classnames(
          {
            settings__borderLess: isBorderless,
            settings__squaredBorders: isSquaredBorders,
            settings__fixedWidth: isFixedWidth,
            settings__menuShadow: isMenuShadow,
            settings__menuTop: isMenuTop,
          },
          styles.layout,
        )}
      >
        <Menu menu={menuData} />
        <Layout>
          <Layout.Header>
            <TopBar />
          </Layout.Header>
          {children}
        </Layout>
      </Layout>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.any,
  isBorderless: PropTypes.bool,
  isSquaredBorders: PropTypes.bool,
  isFixedWidth: PropTypes.bool,
  isMenuShadow: PropTypes.bool,
  isMenuTop: PropTypes.bool,
  menuData: PropTypes.arrayOf(PropTypes.any),
};

MainLayout.defaultProps = {
  children: '',
  isBorderless: false,
  isSquaredBorders: false,
  isFixedWidth: false,
  isMenuShadow: false,
  isMenuTop: false,
  menuData: [],
};

export default MainLayout;
