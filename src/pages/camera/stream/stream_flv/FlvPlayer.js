import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'umi';

import flvjs from 'flv.js';

const FlvPlayer = ({ url_stream_flv }) => {
    const [flvUrl, setFlvUrl] = useState(null);
    const videoRef = useRef(null);

    // const [loading, { coordinates }] = useSelector(({ loading: { effects }, safeRegionConfig }) => [
    //     effects,
    //     safeRegionConfig,
    // ]);
    // console.log('coordinates in FLV Player: ', coordinates);

    useEffect(() => {
        if (url_stream_flv) {
            setFlvUrl(url_stream_flv);
        }
    }, [url_stream_flv]);

    useEffect(() => {
        let flvPlayer = null;

        const reloadFlvPlayer = () => {
            if (flvPlayer) {
                flvPlayer.destroy();
            }
            flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: flvUrl,
                isLive: true,
            });
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();
        };

        if (flvjs.isSupported()) {
            reloadFlvPlayer();
        }

        const handleError = (errorType, errorDetail) => {
            console.log('My log:FLV player encountered an error:', errorType, errorDetail);
            reloadFlvPlayer();
        };

        flvPlayer.on(flvjs.Events.ERROR, handleError);

        return () => {
            if (flvPlayer) {
                flvPlayer.pause();
                flvPlayer.unload();
                flvPlayer.detachMediaElement();
                flvPlayer.off(flvjs.Events.ERROR, handleError);
                flvPlayer.destroy();
            }
        };
    }, [flvUrl, videoRef.current?.currentURL]);

    const handleClick = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <video ref={videoRef} controls={true} style={{ width: '100%', height: 'auto' }} onClick={handleClick} />
        </>
    );
};
FlvPlayer.propTypes = {
    url_stream_flv: PropTypes.string.isRequired,
};
export default FlvPlayer;
