import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Helper from '@/utils/Helper';
import _ from 'lodash';

import NoData from '../NoData';

export default function SelectCustom({
  options,
  dataSet,
  notFoundContent,
  filterOption,
  disabledOptions,
  itemValue,
  ...rest
}) {
  return (
    <Select
      {...rest}
      filterOption={filterOption}
      notFoundContent={notFoundContent || <NoData simple />}
    >
      {dataSet.map((item) => (
        <Select.Option
          key={item[`${options[0]}`]}
          value={item[`${options[0]}`]}
          disabled={_.includes(disabledOptions, item[`${options[0]}`])}
        >
          {itemValue(item) || item[`${options[1]}`]}
        </Select.Option>
      ))}
    </Select>
  );
}

SelectCustom.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any),
  dataSet: PropTypes.arrayOf(PropTypes.any).isRequired,
  notFoundContent: PropTypes.any,
  filterOption: PropTypes.any,
  disabledOptions: PropTypes.arrayOf(PropTypes.any),
  itemValue: PropTypes.func,
};

SelectCustom.defaultProps = {
  options: ['id', 'name'],
  notFoundContent: <NoData simple />,
  filterOption: (input, option) =>
    Helper.slugify(option.children)?.indexOf(Helper.slugify(input)) >= 0,
  disabledOptions: [],
  itemValue: () => null,
};

SelectCustom.displayName = 'Button';
