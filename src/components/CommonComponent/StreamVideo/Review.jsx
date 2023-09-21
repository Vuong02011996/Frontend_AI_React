import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Form } from 'antd';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import styles from './styles.module.scss';

const Index = memo(({ url, title, description, onClose, onChange }) => {
  const [form] = Form.useForm();
  const np = new NodePlayer();
  const id = `canvas${Math.random().toString(36).substr(2, 9)}`;
  const [isSignal, setIsSignal] = useState(false);

  useEffect(() => {
    np.setBufferTime(1000);
    np.setView(id);
    np.on('stats', () => {});
    np.on('error', (error) => {
      if (error) setIsSignal(true);
    });
    np.start(url);
  }, []);

  useEffect(() => {
    if (isSignal) {
      np.stop();
    }
  }, [isSignal]);

  const onSearch = () => {
    form.validateFields().then(() => {});
  };

  return (
    <div className={styles['wrapper-fullscreen']}>
      <div className={styles['block-view']}>
        {id && <canvas id={id} className={styles.cavas} style={{ transform: `scale(1)` }} />}
      </div>
      <div className={styles['block-action']}>
        <div className={styles.heading}>
          <h4 className={styles.title}>Xem phát lại</h4>
          <span
            className="icon-cancel"
            role="presentation"
            onClick={() => {
              onClose();
              np.on('stop', () => {});
            }}
          />
        </div>
        <div className={styles['content-view']}>
          <h4 className={styles['sub-title']}>{title}</h4>
          <div className={classnames(styles['info-item'], 'mt10')}>
            <p className={styles.label}>Quản lý nhóm camera</p>
            <p className={styles.norm}>{title}</p>
          </div>
          <div className={classnames(styles['info-item'], 'mt10')}>
            <p className={styles.label}>Địa chỉ</p>
            <p className={styles.norm}>{description}</p>
          </div>
          <hr />
          <h4 className={classnames(styles['sub-title'])}>Điều chỉnh camera</h4>
          <div className={classnames(styles['action-item'], 'mt10')}>
            <div className="mt10">
              <Calendar fullscreen={false} className={styles.calendar} />
            </div>
          </div>
          <hr />
          <h4 className={classnames(styles['sub-title'], 'mt10')}>Tải video</h4>
          <Form initialValues={{}} layout="vertical" form={form}>
            <div className="row">
              <div className="col-4">
                <FormItem
                  label="Tải từ thời điểm"
                  name="time"
                  type={variables.SELECT}
                  data={[
                    { id: 1, name: '10:00' },
                    { id: 2, name: '11:00' },
                    { id: 3, name: '12:00' },
                  ]}
                />
              </div>
              <div className="col-4">
                <FormItem
                  data={[
                    { id: 1, name: '15 phút' },
                    { id: 2, name: '30 phút' },
                  ]}
                  label="Với độ dài"
                  name="length"
                  type={variables.SELECT}
                />
              </div>
              <div className="col-4 d-flex align-items-center mt15">
                <Button color="primary" size="medium" icon="download" onClick={onSearch}>
                  Tải
                </Button>
              </div>
            </div>
          </Form>
          <div className={styles['block-footer']}>
            <Button
              color="gray"
              onClick={() => {
                np.on('stop', () => {});
                onChange();
              }}
            >
              Xem trực tiếp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

Index.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  description: PropTypes.string,
  onChange: PropTypes.func,
};
Index.defaultProps = {
  url: '',
  title: '',
  description: '',
  onClose: () => {},
  onChange: () => {},
};

export default Index;
