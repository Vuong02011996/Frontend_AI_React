import React from 'react';
import { connect } from 'umi';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

const mapStateToProps = ({ settings }) => ({
  isSettingsOpen: settings.isSettingsOpen,
});

@connect(mapStateToProps)
class Settings extends React.Component {
  handleClick = () => {
    const { dispatch, isSettingsOpen } = this.props;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSettingsOpen',
        value: !isSettingsOpen,
      },
    });
  };

  render() {
    return (
      <span
        className={classnames('icon-setting', styles.toggle)}
        role="presentation"
        onClick={this.handleClick}
      />
    );
  }
}

Settings.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  isSettingsOpen: PropTypes.bool,
};

Settings.defaultProps = {
  dispatch: {},
  isSettingsOpen: false,
};

export default Settings;
