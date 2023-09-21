import { message } from 'antd';

const allowImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const allowVideoTypes = ['video/mp4'];

const warningType = 'Định dạng hình ảnh thuộc loại .JPG, .PNG';

const maxSize = 5 * 2 ** 20; // 5 mB

const maxSizeVideo = 20 * 2 ** 20; // 20 mB

const warningSize = 'Dung lượng hình ảnh nhỏ hơn 5MB';

const warningSizeVideo = 'Dung lượng hình ảnh, video nhỏ hơn 20MB';

export const imageUploadProps = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type)) {
      message.error(warningType);
      return null;
    }

    if (size > maxSize) {
      message.error(warningSize);
      return null;
    }

    return file;
  },
  showUploadList: false,
  fileList: [],
};

export const videoUploadProps = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type) && !allowVideoTypes.includes(type)) {
      message.error(warningType);
      return null;
    }

    if (size > maxSizeVideo) {
      message.error(warningSizeVideo);
      return null;
    }

    return file;
  },
  showUploadList: false,
  fileList: [],
};
