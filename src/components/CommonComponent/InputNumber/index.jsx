import React, { useState } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function InputNumberCus({ value = 0, onChange }) {
  const [number, setNumber] = useState(value);

  const triggerChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const add = () => {
    setNumber((prev) => prev + 1);

    triggerChange(number + 1);
  };

  const sub = () => {
    if (number > 0) {
      setNumber((prev) => prev - 1);
      triggerChange(number - 1);
    }
  };

  return (
    <div className={classnames(styles['wrapper-container'], 'd-flex')}>
      <Button className={styles.button} onClick={sub}>
        -
      </Button>
      <span className={styles.number}>{number || 0}</span>
      <Button className={styles.button} onClick={add}>
        +
      </Button>
    </div>
  );
}

InputNumberCus.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

InputNumberCus.defaultProps = {
  value: null,
  onChange: () => {},
};
