import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import styles from './styles.module.scss';

const Index = memo(({ url, title, description, onClose, onChange }) => {
  const np = new NodePlayer();
  const id = `canvas${Math.random().toString(36).substr(2, 9)}`;
  const [isSignal, setIsSignal] = useState(false);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    np.setBufferTime(1000);
    np.setView(id);
    np.on('stats', () => {});
    np.on('error', (error) => {
      if (error) setIsSignal(true);
    });
    np.start(url);
  }, []);

  useEffect(() => {
    if (isSignal) {
      np.stop();
    }
  }, [isSignal]);

  return (
    <div className={styles['wrapper-fullscreen']}>
      <div className={styles['block-view']}>
        {id && (
          <canvas id={id} className={styles.cavas} style={{ transform: `scale(1.${zoom})` }} />
        )}
      </div>
      <div className={styles['block-action']}>
        <div className={styles.heading}>
          <h4 className={styles.title}>Xem trực tiếp</h4>
          <span
            className="icon-cancel"
            role="presentation"
            onClick={() => {
              onClose();
              np.on('stop', () => {});
            }}
          />
        </div>
        <div className={styles['content-view']}>
          <h4 className={styles['sub-title']}>{title}</h4>
          <div className={classnames(styles['info-item'], 'mt10')}>
            <p className={styles.label}>Quản lý nhóm camera</p>
            <p className={styles.norm}>{title}</p>
          </div>
          <div className={classnames(styles['info-item'], 'mt10')}>
            <p className={styles.label}>Địa chỉ</p>
            <p className={styles.norm}>{description}</p>
          </div>
          <hr />
          <h4 className={classnames(styles['sub-title'])}>Điều chỉnh camera</h4>
          <div className={classnames(styles['action-item'], 'mt10')}>
            <p className={styles.label}>Pan/Tilt</p>
            <div className={styles['pan-container']}>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-top-left" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-top-center" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-top-right" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-center-left" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-application" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-center-right" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-bottom-left" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-bottom-center" />
              </div>
              <div className={styles['pan-item']}>
                <span className="icon-arrow-bottom-right" />
              </div>
            </div>
          </div>
          <h4 className={classnames(styles['sub-title'], 'my10')}>Zoom</h4>
          <div className={styles['slider-container']}>
            <div
              className={styles['shaped-item']}
              role="presentation"
              onClick={() => setZoom((prev) => (prev < 9 ? prev + 1 : prev))}
            >
              <PlusOutlined />
            </div>
            <Slider vertical value={zoom} className={styles.slider} min={0} max={10} />
            <div
              className={styles['shaped-item']}
              role="presentation"
              onClick={() => setZoom((prev) => (prev ? prev - 1 : prev))}
            >
              <MinusOutlined />
            </div>
          </div>
          <div className={styles['block-footer']}>
            <Button
              color="gray"
              onClick={() => {
                np.on('stop', () => {});
                onChange();
              }}
            >
              Xem phát lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

Index.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  description: PropTypes.string,
  onChange: PropTypes.func,
};
Index.defaultProps = {
  url: '',
  title: '',
  description: '',
  onClose: () => {},
  onChange: () => {},
};

export default Index;
