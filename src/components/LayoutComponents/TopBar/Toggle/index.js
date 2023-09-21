import React, { Component } from 'react';
import { connect, withRouter } from 'umi';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuLeftData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isSettingsOpen: settings.isSettingsOpen,
  isLightTheme: settings.isLightTheme,
  isMobileMenuOpen: settings.isMobileMenuOpen,
});

@withRouter
@connect(mapStateToProps)
class Index extends Component {

  /**
   * Function collapse menu
   */
  onCollapse = () => {
    const { dispatch, isMenuCollapsed } = this.props;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    });
  };

  render() {
    const { isMenuCollapsed } = this.props;
    return (
      <div className="d-flex align-items-center">
        {!isMenuCollapsed && <MenuFoldOutlined className={styles.icon} onClick={this.onCollapse} />}
        {isMenuCollapsed && (
          <MenuUnfoldOutlined className={styles.icon} onClick={this.onCollapse} />
        )}
      </div>
    );
  }
}

Index.propTypes = {
  isMenuCollapsed: PropTypes.bool,
  dispatch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  isMenuCollapsed: false,
  dispatch: {},
};

export default Index;
