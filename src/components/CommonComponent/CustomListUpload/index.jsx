import React from 'react';
import { Image } from 'antd';
import { last } from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const allowTypesFile = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
const allowTypesImage = ['jpeg', 'jpg', 'png'];
export default function Index(props) {
  const { data, remove, isComponentUpload, componentUpload } = props;
  const filterFiles = () => {
    let images = [];
    let files = [];
    data.forEach((item) => {
      if (allowTypesFile.includes(last(item?.name?.split('.')))) {
        files = [...files, item];
      }
      if (allowTypesImage.includes(last(item?.name?.split('.')))) {
        images = [...images, item];
      }
    });
    return [
      {
        images,
      },
      {
        files,
      },
    ];
  };

  const renderComponentUpload = () => (isComponentUpload ? componentUpload() : null);
  
  return (
    <>
      {(data || []).length
        ? filterFiles().map((file, index) => {
            if (file.images) {
              return (
                <div
                  className={classnames(
                    styles.listUpload,
                    'd-flex',
                    'flex-wrap',
                    styles['image-group'],
                    'align-items-center',
                  )}
                  key={index}
                >
                  <Image.PreviewGroup>
                    {file.images.map((item, index) => (
                      <Image
                        style={{ borderRadius: 2, marginRight: 20 }}
                        width={80}
                        height={80}
                        src={item.url ? `${API_UPLOAD}${item.url}` : '/default-upload.png'}
                        key={index}
                        preview={{
                          maskClassName: 'customize-mask',
                          mask: (
                            <>
                              <span
                                className={styles.icon}
                                role="presentation"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  remove(item);
                                }}
                              >
                                <span className="icon-close-circle" />
                              </span>
                            </>
                          ),
                        }}
                      />
                    ))}
                    {isComponentUpload && file.images.length ? componentUpload() : null}
                  </Image.PreviewGroup>
                </div>
              );
            }
            return (
              <div className={classnames(styles['files-container'], 'mt10')} key={index}>
                {file.files &&
                  file.files.map((item) => (
                    <div className={styles.item} key={item.id}>
                      <a href={`${API_UPLOAD}${item.url}`} target="_blank" rel="noreferrer">
                        {item.name}
                      </a>
                      <span
                        className="icon-cross"
                        role="presentation"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(item);
                        }}
                      />
                    </div>
                  ))}
                {file.files.length && isComponentUpload ? componentUpload() : null}
              </div>
            );
          })
        : renderComponentUpload()}
    </>
  );
}

Index.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  remove: PropTypes.func,
  isComponentUpload: PropTypes.bool,
  componentUpload: PropTypes.func,
};

Index.defaultProps = {
  data: [],
  remove: () => {},
  isComponentUpload: false,
  componentUpload: () => {},
};

Index.displayName = 'Button';
