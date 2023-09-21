import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useOnClickOutside } from 'use-onclickoutside-hooks';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function ListImage({ items = [], isAction = false, onRemove, isLarge = false }) {
    const [image, setImage] = useState(null);

    const ref = useRef();

    useOnClickOutside(ref, () => setImage(null));

    function renderItem() {
        if (items.length === 0) {
            return <p> Chưa có khuôn mặt</p>;
        }
        return items?.map((item, index) => (
            <div
                className={classnames(styles['img-camera'], {
                    [styles.large]: isLarge,
                })}
                role="presentation"
                key={index}
                onClick={() => setImage(item)}
            >
                <img src={item.src} alt="url_face" />
                {isAction && (
                    <span
                        className={styles['action-delete']}
                        role="presentation"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item);
                        }}
                    >
                        Xóa
                    </span>
                )}
            </div>
        ));
    }

    return (
        <div className="d-flex flex-row">
            {renderItem()}
            {image && (
                <div className={styles['img-fullscreen']}>
                    <div className={styles['img-content']} ref={ref}>
                        <img src={image.src} alt="url_face" />
                    </div>
                </div>
            )}
        </div>
    );
}

ListImage.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any),
    isAction: PropTypes.bool,
    onRemove: PropTypes.func,
    isLarge: PropTypes.bool,
};

ListImage.defaultProps = {
    items: [],
    isAction: false,
    onRemove: () => {},
    isLarge: false,
};
