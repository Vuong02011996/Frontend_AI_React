import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useOnClickOutside } from 'use-onclickoutside-hooks';
import ReactPlayer from 'react-player';
import styles from './styles.module.scss';

export default function ListImage({ clip_url, size }) {
  const [url, setUrl] = useState(null);

  const ref = useRef();

  useOnClickOutside(ref, () => setUrl(null));

  return (
    <div className="d-flex flex-row">
      <ReactPlayer onClick={() => setUrl(clip_url)} url={clip_url} width={size} height={size} />
      {url && (
        <div className={styles['img-fullscreen']}>
          <div className={styles['img-content']} ref={ref}>
            <ReactPlayer controls url={url} className="video-full" />
          </div>
        </div>
      )}
    </div>
  );
}

ListImage.propTypes = {
  clip_url: PropTypes.string,
  size: PropTypes.string,
};

ListImage.defaultProps = {
  clip_url: '',
  size: '40px',
};
