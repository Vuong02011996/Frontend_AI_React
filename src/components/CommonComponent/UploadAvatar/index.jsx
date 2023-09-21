import { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Upload, Image, Spin, notification } from 'antd';
import { CloudUploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'dva';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { imageUploadProps } from '@/utils/upload';
import { Helper } from '@/utils';
import styles from './styles.module.scss';

const { ...otherProps } = imageUploadProps;

const ImageUpload = memo(({ callback, removeFiles, files }) => {
    const mounted = useRef(false);
    const { loading } = useSelector(({ loading }) => ({ loading }));

    const mountedSet = (setFunction, value) => !!mounted?.current && setFunction(value);

    const dispatch = useDispatch();
    const [images, setImages] = useState(files || []);

    const uploadAction = useCallback((file) => {
        dispatch({
            type: 'upload/UPLOAD',
            payload: file,
            callback: (res) => {
                if (res) {
                    mountedSet(setImages, (prev) => [...prev, get(res, 'results[0].fileInfo.url')]);
                    callback(get(res, 'results[0].fileInfo.url'));
                }
            },
        });
    }, []);

    const uploadProps = useMemo(
        () => ({
            ...otherProps,
            multiple: true,
            beforeUpload: () => null,
            customRequest({ file }) {
                const allowImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
                const maxSize = 20 * 2 ** 20;
                const { type, size } = file;

                if (!allowImageTypes.includes(type)) {
                    return notification.error({
                        message: 'Thông báo',
                        description: 'Chỉ hỗ trợ định dạng jpeg, png, jpg, webp. Dung lượng tối đa không quá 20mb',
                    });
                }

                if (size > maxSize) {
                    return notification.error({
                        message: 'Thông báo',
                        description: 'Chỉ hỗ trợ định dạng jpeg, png, jpg, webp. Dung lượng tối đa không quá 20mb',
                    });
                }

                return uploadAction(file);
            },
        }),
        [uploadAction],
    );

    useEffect(() => {
        mounted.current = true;
        return mounted.current;
    }, []);

    useEffect(() => {
        mountedSet(setImages, files);
    }, [files]);

    return (
        <>
            <div className="row">
                <div className="pl15">
                    <Image.PreviewGroup>
                        {(images || []).map((item, index) => {
                            if (Helper.isVideo(item)) {
                                return (
                                    <Image
                                        width={105}
                                        height={105}
                                        src="/image-default.png"
                                        key={index}
                                        preview={{
                                            maskClassName: 'customize-mask',
                                            mask: (
                                                <>
                                                    <EyeOutlined className="mr5" />
                                                    <DeleteOutlined
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setImages((prev) => prev.filter((image) => image !== item));
                                                            removeFiles(images.filter((image) => image !== item));
                                                        }}
                                                    />
                                                </>
                                            ),
                                        }}
                                    />
                                );
                            }
                            return (
                                <div
                                    key={index}
                                    className="container-preview-image"
                                    style={{ backgroundImage: `url(${API_UPLOAD}${item})` }}
                                >
                                    <Image
                                        width={102}
                                        height={102}
                                        src={`${API_UPLOAD}${item}`}
                                        preview={{
                                            maskClassName: 'customize-mask',
                                            mask: (
                                                <>
                                                    <EyeOutlined className="mr5" />
                                                    <DeleteOutlined
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setImages((prev) => prev.filter((image) => image !== item));
                                                            removeFiles(images.filter((image) => image !== item));
                                                        }}
                                                    />
                                                </>
                                            ),
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </Image.PreviewGroup>
                </div>

                <div className="col d-flex align-items-center">
                    <Upload
                        {...uploadProps}
                        listType="picture-card"
                        className={loading?.effects['upload/UPLOAD'] ? styles['loading-upload'] : ''}
                    >
                        <div className={styles['icon-loading']}>
                            <Spin />
                        </div>
                        <CloudUploadOutlined />
                    </Upload>
                </div>
            </div>
        </>
    );
});

ImageUpload.propTypes = {
    callback: PropTypes.any,
    removeFiles: PropTypes.func,
    files: PropTypes.arrayOf(PropTypes.any),
};

ImageUpload.defaultProps = {
    callback: null,
    removeFiles: () => {},
    files: [],
};

export default ImageUpload;
