import React from 'react';
import { connect } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { Switch } from 'antd';
import styles from './style.module.scss';

const mapStateToProps = ({ settings }) => ({ settings });

@connect(mapStateToProps)
class Settings extends React.Component {
  changeSetting = (setting, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    });
  };

  closeSettings = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSettingsOpen',
        value: false,
      },
    });
  };

  render() {
    const {
      settings: { isLightTheme, isSettingsOpen, isMenuTop, isMenuCollapsed },
    } = this.props;

    return (
      <div
        className={isSettingsOpen ? `${styles.settings} ${styles.settingsOpened}` : styles.settings}
      >
        <Scrollbars style={{ height: '100vh' }}>
          <div className={styles.container}>
            <div className={styles.title}>
              Thay đổi cấu hình
              <span className={`icon-cancel`} onClick={this.closeSettings} />
            </div>
            <div className={styles.item}>
              <Switch
                disabled={isMenuTop}
                checked={isMenuCollapsed && !isMenuTop}
                onChange={(value) => {
                  this.changeSetting('isMenuCollapsed', value);
                }}
              />
              <span className={styles.itemLabel}>Đóng menu trái</span>
            </div>
            <div className={styles.item}>
              <Switch
                checked={isLightTheme}
                onChange={(value) => {
                  this.changeSetting('isLightTheme', value);
                }}
              />
              <span className={styles.itemLabel}>Giao diện trắng</span>
            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

export default Settings;
