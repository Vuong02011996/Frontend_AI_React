import { memo } from 'react';
import { Empty } from 'antd';
import ptx from 'prop-types';

import variables from '@/utils/variables';

const { PRESENTED_IMAGE_SIMPLE, PRESENTED_IMAGE_DEFAULT } = Empty;

const NoData = memo(({ simple = false }) => (
  <Empty
    description={variables.EMPTY_DATA_TEXT}
    image={simple ? PRESENTED_IMAGE_SIMPLE : PRESENTED_IMAGE_DEFAULT}
  />
));

NoData.propTypes = {
  simple: ptx.bool,
};

NoData.defaultProps = {
  simple: false,
};

export default NoData;
