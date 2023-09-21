import React from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Dropdown, Badge } from 'antd';
import styles from './style.module.scss';

class Notification extends React.Component {
  render() {
    const menu = <></>;
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.dropdown}>
          <Badge>
            <BellOutlined className={styles.bell} />
          </Badge>
        </div>
      </Dropdown>
    );
  }
}

export default Notification;
