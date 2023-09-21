import { head } from 'lodash';
import ImageResize from 'quill-image-resize-module-react';
import * as services from '@/services/upload';
import Quill from 'quill';

Quill.register('modules/imageResize', ImageResize);

function imageHandler() {
  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];

    const range = this.quill.getSelection(true);
    this.quill.setSelection(range.index + 1);

    services.upload(file).then((response) => {
      if (response) {
        this.quill.deleteText(range.index, 1);
        this.quill.insertEmbed(
          range.index,
          'image',
          `${API_UPLOAD}${head(response?.results)?.fileInfo?.url}`,
        );
      }
    });
  };
}

export default {
  format: [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'background',
    'code',
    'video',
    `clean`,
  ],
  modules: {
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    },
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
        [('bold', 'italic', 'underline', 'strike')],
        [
          {
            color: [
              '#000000',
              '#e60000',
              '#ff9900',
              '#ffff00',
              '#008a00',
              '#0066cc',
              '#9933ff',
              '#ffffff',
              '#facccc',
              '#ffebcc',
              '#ffffcc',
              '#cce8cc',
              '#cce0f5',
              '#ebd6ff',
              '#bbbbbb',
              '#f06666',
              '#ffc266',
              '#ffff66',
              '#66b966',
              '#66a3e0',
              '#c285ff',
              '#888888',
              '#a10000',
              '#b26b00',
              '#b2b200',
              '#006100',
              '#0047b2',
              '#6b24b2',
              '#444444',
              '#5c0000',
              '#663d00',
              '#666600',
              '#003700',
              '#002966',
              '#3d1466',
              'custom-color',
            ],
          },
        ],
      ],
      handlers: {
        image: imageHandler,
      },
    },

    clipboard: {
      matchVisual: false,
    },
  },
};
