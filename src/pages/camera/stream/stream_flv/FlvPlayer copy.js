import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'umi';

import flvjs from 'flv.js';

const FlvPlayer = ({ url_stream_flv }) => {
    const [flvUrl, setFlvUrl] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const [loading, { coordinates }] = useSelector(({ loading: { effects }, safeRegionConfig }) => [
        effects,
        safeRegionConfig,
    ]);
    console.log('coordinates in FLV Player: ', coordinates);
    // const coords = [
    //     {
    //         name_regions: 'Vùng 1',
    //         coord: [
    //             [0.33, 0.18],
    //             [0.32, 0.35],
    //             [0.4, 0.17],canvasRef
    //     },
    //     // {
    //     //     name_regions: 'Vùng 2',
    //     //     coord: [
    //     //         [0.35, 0.18],
    //     //         [0.33, 0.4],
    //     //         [0.5, 0.5],
    //     //         [0.4, 0.42],
    //     //     ],
    //     // },
    // ];

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

        // Draw coordinates onto canvas element
        // const video = videoRef.current;
        // const canvas = canvasRef.current;
        if (video) {
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            };

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            coordinates.forEach((region) => {
                const [firstCoord, ...restCoords] = region.coord;
                ctx.beginPath();
                ctx.moveTo(firstCoord[0] * canvas.width, firstCoord[1] * canvas.height);
                restCoords.forEach((coord) => {
                    ctx.lineTo(coord[0] * canvas.width, coord[1] * canvas.height);
                });
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = 'red';
                ctx.fillText(region.name_regions, firstCoord[0] * canvas.width, firstCoord[1] * canvas.height);
            });
        }

        return () => {
            if (flvPlayer) {
                flvPlayer.pause();
                flvPlayer.unload();
                flvPlayer.detachMediaElement();
                flvPlayer.off(flvjs.Events.ERROR, handleError);
                flvPlayer.destroy();
            }
        };
    }, [flvUrl, videoRef.current?.currentURL, coordinates, video]);

    const handleClick = (e) => {
        e.preventDefault();
    };

    // return <video ref={videoRef} controls={true} style={{ width: '100%', height: 'auto' }} onClick={handleClick} />;
    return (
        // <>
        //     <video ref={videoRef} controls={true} style={{ width: '100%', height: 'auto' }} onClick={handleClick} />
        //     <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
        // </>

        <>
            <video
                ref={videoRef}
                controls
                style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 0 }}
                onClick={handleClick}
            />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
        </>
    );
};
FlvPlayer.propTypes = {
    url_stream_flv: PropTypes.string.isRequired,
};
export default FlvPlayer;
