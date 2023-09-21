import React from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Badge } from 'antd';
import styles from './style.module.scss';

class Notification extends React.Component {
  render() {
    const menu = (
      <Menu className={styles.activity} selectable={false}>
        <Menu.Item className={styles.item}>
          <i className={`${styles.icon} icon-star-full`} />
          <div className={styles.inner}>
            <div className={styles.title}>
              <span className="pull-right">now</span>
              <a href="">
                Update Status: <span className="badge badge-danger">New</span>
              </a>
            </div>
            <div className={styles.descr}>
              Failed to get available update data. To ensure the proper functioning of your
              application, update now.
            </div>
          </div>
        </Menu.Item>
        <Menu.Item className={styles.item}>
          <i className={`${styles.icon} icon-stack`} />
          <div className={styles.inner}>
            <div className={styles.title}>
              <span className="pull-right">24 min ago</span>
              <a href="">
                Income: <span className="badge badge-default">$299.00</span>
              </a>
            </div>
            <div className={styles.descr}>
              Failed to get available update data. To ensure the proper functioning of your
              application, update now.
            </div>
          </div>
        </Menu.Item>
        <Menu.Item className={styles.item}>
          <i className={`${styles.icon} icon-list`} />
          <div className={styles.inner}>
            <div className={styles.title}>
              <span className="pull-right">30 min ago</span>
              <a href="">Inbox Message</a>
            </div>
            <div className={styles.descr}>
              From: <a href="">David Bowie</a>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item className={styles.item}>
          <i className={`${styles.icon} icon-home`} />
          <div className={styles.inner}>
            <div className={styles.title}>
              <span className="pull-right">now</span>
              <a href="">
                Update Status: <span className="badge badge-primary">New</span>
              </a>
            </div>
            <div className={styles.descr}>
              Failed to get available update data. To ensure the proper functioning of your
              application, update now.
            </div>
          </div>
        </Menu.Item>
        <Menu.Item className={styles.item}>
          <i className={`${styles.icon} icon-loop`} />
          <div className={styles.inner}>
            <div className={styles.title}>
              <span className="pull-right">24 min ago</span>
              <a href="">
                Income: <span className="badge badge-warning">$299.00</span>
              </a>
            </div>
            <div className={styles.descr}>
              Failed to get available update data. To ensure the proper functioning of your
              application, update now.
            </div>
          </div>
        </Menu.Item>
        <Menu.Item className={styles.item}>
          <i className={`${styles.icon} icon-cog utils__spin-delayed--pseudo-selector`} />
          <div className={styles.inner}>
            <div className={styles.title}>
              <span className="pull-right">30 min ago</span>
              <a href="">Inbox Message</a>
            </div>
            <div className={styles.descr}>
              From: <a href="">David Bowie</a>
            </div>
          </div>
        </Menu.Item>
      </Menu>
    );
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
