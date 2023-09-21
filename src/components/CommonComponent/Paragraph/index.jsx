import React, { useState, useRef, useEffect } from 'react';
import { isArray, size, isString } from 'lodash';
import { Typography } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const { Paragraph } = Typography;
export default function View({ children, row }) {
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const [ellipsis, setEllipsis] = useState(true);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const toggle = () => {
    mountedSet(setEllipsis, !ellipsis);
  };

  return (
    <div className={styles.paragraph}>
      <Paragraph ellipsis={ellipsis ? { rows: row, expandable: true, symbol: '' } : false}>
        {children}
      </Paragraph>
      {isArray(children) && size(children) >= 3 && (
        <p className={styles.toggle} onClick={toggle} role="presentation">
          {!ellipsis ? 'Thu gọn' : 'Xem thêm'}
        </p>
      )}
      {isString(children) && size(children) > 100 && (
        <p className={styles.toggle} onClick={toggle} role="presentation">
          {!ellipsis ? 'Thu gọn' : 'Xem thêm'}
        </p>
      )}
    </div>
  );
}

View.propTypes = {
  children: PropTypes.any,
  row: PropTypes.number,
};

View.defaultProps = {
  children: null,
  row: 3,
};

View.displayName = 'Index';
