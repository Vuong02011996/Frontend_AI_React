import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './styles.module.scss';

export default function TagCustom({ children, color }) {
  return (
    <Tag
      className={classnames(
        'd-flex',
        'justify-content-center',
        'align-items-center',
        styles.tab,
        styles[`${color}`],
      )}
    >
      {children}
    </Tag>
  );
}

TagCustom.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
};

TagCustom.defaultProps = {
  children: '',
  color: 'dark',
};

TagCustom.displayName = 'Tag';
