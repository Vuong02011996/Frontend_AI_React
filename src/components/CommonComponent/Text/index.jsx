import React from 'react';
import { Link } from 'umi';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export default function View({ children, size, color, extra, extraColor, className, url, style }) {
  if (size === 'large-medium') {
    if (url) {
      return (
        <h3
          className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
          style={style}
        >
          <Link className={styles.link} to={url}>
            {children}
            {extra && (
              <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>
                {extra}
              </p>
            )}
          </Link>
        </h3>
      );
    }
    return (
      <h3
        className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
        style={style}
      >
        {children}
        {extra && (
          <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>{extra}</p>
        )}
      </h3>
    );
  }
  if (size === 'large-normal') {
    if (url) {
      return (
        <p
          className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
          style={style}
        >
          <Link className={styles.link} to={url}>
            {children}
            {extra && (
              <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>
                {extra}
              </p>
            )}
          </Link>
        </p>
      );
    }
    return (
      <p
        className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
        style={style}
      >
        {children}
        {extra && (
          <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>{extra}</p>
        )}
      </p>
    );
  }
  if (size === 'large') {
    if (url) {
      return (
        <h3
          className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
          style={style}
        >
          <Link className={styles.link} to={url}>
            {children}
            {extra && (
              <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>
                {extra}
              </p>
            )}
          </Link>
        </h3>
      );
    }
    return (
      <h3
        className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
        style={style}
      >
        {children}
        {extra && (
          <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>{extra}</p>
        )}
      </h3>
    );
  }
  if (size === 'medium') {
    if (url) {
      return (
        <h5
          className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
          style={style}
        >
          <Link className={styles.link} to={url}>
            {children}
            {extra && (
              <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>
                {extra}
              </p>
            )}
          </Link>
        </h5>
      );
    }
    return (
      <h5
        className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
        style={style}
      >
        {children}
        {extra && (
          <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>{extra}</p>
        )}
      </h5>
    );
  }
  if (size === 'normal') {
    if (url) {
      return (
        <p
          className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
          style={style}
        >
          <Link className={styles.link} to={url}>
            {children}
            {extra && (
              <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>
                {extra}
              </p>
            )}
          </Link>
        </p>
      );
    }
    return (
      <p
        className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
        style={style}
      >
        {children}
        {extra && (
          <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>{extra}</p>
        )}
      </p>
    );
  }
  if (size === 'description') {
    if (url) {
      return (
        <p
          className={classnames(styles[`text-${size}`], styles[`${color}`], className)}
          style={style}
        >
          <Link className={styles.link} to={url}>
            {children}
            {extra && (
              <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>
                {extra}
              </p>
            )}
          </Link>
        </p>
      );
    }
    return (
      <p className={classnames(styles[`text-${size}`], styles[`${color}`], className)}>
        {children}
        {extra && (
          <p className={classnames(styles.extra, styles[`${extraColor}`], className)}>{extra}</p>
        )}
      </p>
    );
  }
  return (
    <h1>
      {children}
      {extra && <p>{extra}</p>}
    </h1>
  );
}

View.propTypes = {
  size: PropTypes.string,
  children: PropTypes.any,
  color: PropTypes.string,
  className: PropTypes.string,
  extra: PropTypes.string,
  extraColor: PropTypes.string,
  url: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};

View.defaultProps = {
  children: '',
  color: 'dark',
  size: 'large',
  className: '',
  extra: '',
  extraColor: 'dark',
  url: '',
  style: {},
};

View.displayName = 'Index';
