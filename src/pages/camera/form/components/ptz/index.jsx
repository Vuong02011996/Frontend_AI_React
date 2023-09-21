import { memo } from 'react';
import { Slider } from 'antd';
import Pane from '@/components/CommonComponent/Pane';
import styles from './styles.module.scss';

const Index = memo(() => (
  <Pane className="border-bottom pb20 pr20 pl20">
    <div className="row">
      <div className="col-lg-8">
        <div className={styles.pan}>
          <label className={styles.pan__label}>Pan/Tilt</label>
          <div className={styles.pan__block}>
            <div className={styles.pan__group}>
              <div className={styles.pan__item}>
                <span className="icon-arrow-top-left" />
              </div>
              <div className={styles.pan__item}>
                <span className="icon-arrow-top-center" />
              </div>
              <div className={styles.pan__item}>
                <span className="icon-arrow-top-right" />
              </div>
            </div>
            <div className={styles.pan__group}>
              <div className={styles.pan__item}>
                <span className="icon-arrow-center-left" />
              </div>
              <div className={styles.pan__item}>
                <span className="icon-application" />
              </div>
              <div className={styles.pan__item}>
                <span className="icon-arrow-center-right" />
              </div>
            </div>
            <div className={styles.pan__group}>
              <div className={styles.pan__item}>
                <span className="icon-arrow-bottom-left" />
              </div>
              <div className={styles.pan__item}>
                <span className="icon-arrow-bottom-center" />
              </div>
              <div className={styles.pan__item}>
                <span className="icon-arrow-bottom-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className={styles.zoom}>
          <label className={styles.zoom__label}>Zoom</label>
          <div className={styles.zoom__block}>
            <button type="button" className={styles.zoom__button}>
              +
            </button>
            <Slider vertical defaultValue={30} />
            <button type="button" className={styles.zoom__button}>
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  </Pane>
));

export default Index;
