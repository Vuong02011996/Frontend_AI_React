import React from 'react';
import classnames from 'classnames';
import { connect } from 'umi';
import { Dropdown, Badge } from 'antd';
import styles from './style.module.scss';
import { dataSource } from './data.json';

const mapStateToProps = ({ settings }) => ({
  background: settings.background,
});
@connect(mapStateToProps)
class Notification extends React.Component {
  /**
   * Function change background home
   */
  onChangeBackground = (objects) => {
    this.props.dispatch({
      type: 'settings/CHANGE_BACKGROUND',
      payload: objects.img,
    });
  };

  render() {
    const { background } = this.props;
    const menu = (
      <div className={styles.activity}>
        <div className={styles['images-container']}>
          {dataSource.map((item, index) => (
            <div
              className={classnames(styles['images-item'], {
                [`${styles.active}`]: item.img === background,
              })}
              key={index}
              onClick={() => this.onChangeBackground(item)}
            >
              <div className={styles.image}>
                <img src={item.img} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']} arrow>
        <div className={styles.dropdown}>
          <Badge>
            <span className={classnames('icon-setting', styles.setting)} />
          </Badge>
        </div>
      </Dropdown>
    );
  }
}

export default Notification;
