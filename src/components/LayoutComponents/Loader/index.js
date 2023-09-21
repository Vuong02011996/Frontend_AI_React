import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

const Loader = ({ spinning = true, fullScreen }) => (
  <div
    className={classnames(styles.loader, {
      [styles.hidden]: !spinning,
      [styles.fullScreen]: fullScreen,
    })}
  />
);

Loader.propTypes = {
  spinning: PropTypes.bool,
  fullScreen: PropTypes.bool,
};

Loader.defaultProps = {
  spinning: false,
  fullScreen: false,
};

export default Loader;
