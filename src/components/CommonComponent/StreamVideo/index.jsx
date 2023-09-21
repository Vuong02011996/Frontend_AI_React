import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import styles from './styles.module.scss';
import LiveStreamFull from './LiveStreamFull';
import Review from './Review';

const Index = memo(({ url, title, description, isAction }) => {
  const np = new NodePlayer();
  const id = `canvas${Math.random().toString(36).substr(2, 9)}`;
  const [isSignal, setIsSignal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isReview, setIsReview] = useState(false);

  useEffect(() => {
    if (!isFullScreen && !isReview) {
      np.setBufferTime(1000);
      np.setView(id);
      np.on('stats', () => {});
      np.on('error', (error) => {
        if (error) setIsSignal(true);
      });
      np.start(url);
    }
    return () => {
      np.on('stop', () => {});
    };
  }, [isFullScreen, isReview]);

  useEffect(() => {
    if (isSignal) {
      np.stop();
    }
  }, [isSignal]);

  const downloadCavas = () => {
    html2canvas(document.querySelector(`#${id}`)).then((canvas) => {
      const image = canvas.toDataURL();
      const aDownloadLink = document.createElement('a');
      aDownloadLink.download = `${title}.png`;
      aDownloadLink.href = image;
      aDownloadLink.click();
    });
  };

  if (isReview) {
    return (
      <Review
        url={url}
        title={title}
        description={description}
        onClose={() => {
          setIsFullScreen(false);
          setIsReview(false);
        }}
        onChange={() => {
          setIsReview(false);
          setIsFullScreen(true);
        }}
      />
    );
  }

  if (isFullScreen)
    return (
      <LiveStreamFull
        url={url}
        title={title}
        description={description}
        onClose={() => {
          setIsFullScreen(false);
          setIsReview(false);
        }}
        onChange={() => {
          setIsFullScreen(false);
          setIsReview(true);
        }}
      />
    );

  return (
    <div className={styles.wrapper} id="wrapper-camera">
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.norm}>{description}</p>}
      </div>
      {isSignal && <div className={styles['notsignal-container']}>Không có tín hiệu từ camera</div>}
      {!isSignal && isAction && (
        <>
          <div className={styles['group-actions']}>
            <Tooltip
              placement="top"
              title="Xem full màn hình"
              color="#159b4b"
              onClick={() => {
                setIsFullScreen(true);
                np.on('stop', () => {});
              }}
            >
              <FullscreenOutlined />
            </Tooltip>
            <Tooltip
              placement="top"
              title="Chụp screenshot"
              color="#159b4b"
              onClick={downloadCavas}
            >
              <span className="icon-camera" />
            </Tooltip>
          </div>
        </>
      )}

      {id && <canvas id={id} className={styles.cavas} />}
    </div>
  );
});

Index.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isAction: PropTypes.bool,
};
Index.defaultProps = {
  url: '',
  title: '',
  description: '',
  isAction: false,
};

export default Index;
