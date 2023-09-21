/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { Avatar } from 'antd';

const ZoomableAvatar = ({ src, size, className }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'zoom-in' }}>
            <Avatar size={size} src={src} className={className} style={{ borderRadius: 0 }} />
            {isZoomed && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={handleClick}
                >
                    <img src={src} style={{ maxWidth: '60%', maxHeight: '60%' }} />
                </div>
            )}
        </div>
    );
};

export default ZoomableAvatar;
