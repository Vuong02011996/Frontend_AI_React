import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Cascader,
  DatePicker,
  TreeSelect,
  Checkbox,
  Radio,
  InputNumber,
  Switch,
  TimePicker,
} from 'antd';
import Select from '@/components/CommonComponent/Select';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import { variables, Helper } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import * as _ from 'lodash';

const filter = (inputValue, path) =>
  path.some((option) => Helper.slugify(option?.name).indexOf(Helper.slugify(inputValue)) > -1);

const renderChildren = (
  placeholder = '',
  data = [],
  handleScroll,
  onChange,
  disabled,
  disabledDate,
  fieldNames,
  maxTagCount,
  onSearch,
  onBlur,
  dropdownRender,
  onSelect,
  disabledHours,
  disabledMinutes,
  allowClear,
  picker,
  radioInline,
  disabledKeys,
  options,
  checked,
  value,
  notFoundContent,
  filterOption,
  disabledOptions,
) => ({
  input: (
    <Input
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder || 'Nhập'}
      value={value}
      autoComplete="new-input"
    />
  ),
  inputPassword: (
    <Input.Password
      onChange={onChange}
      placeholder={placeholder || 'Nhập'}
      autoComplete="new-password"
    />
  ),
  inputSearch: (
    <Input onChange={onChange} placeholder={placeholder || 'Nhập'} prefix={<SearchOutlined />} />
  ),
  inputNumber: (
    <InputNumber
      className={classnames('input-number', styles['input-number-container'])}
      disabled={disabled}
      formatter={(value) => `${value}`.replace(variables.REGEX_NUMBER, ',')}
      onChange={onChange}
      placeholder="Nhập"
      value={value}
    />
  ),
  inputCount: (
    <InputNumber
      className={classnames(
        'input-number',
        styles['input-number-container'],
        styles['input-number-count'],
      )}
      disabled={disabled}
      onChange={onChange}
      placeholder="Nhập"
      value={value}
    />
  ),
  inputDate: (
    <InputNumber
      className={classnames(
        'input-number',
        styles['input-number-container'],
        styles['input-number-date'],
      )}
      disabled={disabled}
      onChange={onChange}
      placeholder="Nhập"
      value={value}
    />
  ),
  select: (
    <Select
      allowClear={allowClear}
      dataSet={data}
      filterOption={
        filterOption
          ? false
          : (input, option) => Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      notFoundContent={notFoundContent}
      onChange={onChange}
      onPopupScroll={handleScroll}
      onSearch={onSearch}
      placeholder={placeholder || 'Chọn'}
      showSearch
      options={options}
      disabled={disabled}
      value={value}
      disabledOptions={disabledOptions}
    />
  ),
  selectAdd: (
    <Select
      allowClear
      dataSet={data}
      dropdownRender={dropdownRender}
      filterOption={
        filterOption
          ? false
          : (input, option) => Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      notFoundContent={notFoundContent}
      onBlur={onBlur}
      onChange={onChange}
      onPopupScroll={handleScroll}
      onSearch={onSearch}
      placeholder={placeholder || 'Chọn'}
      showSearch
      disabledOptions={disabledOptions}
    />
  ),
  selectMutilple: (
    <Select
      dataSet={data}
      filterOption={(input, option) =>
        Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      maxTagCount={maxTagCount}
      mode="multiple"
      onChange={onChange}
      onPopupScroll={handleScroll}
      placeholder={placeholder || 'Chọn'}
      showSearch
      disabledOptions={disabledOptions}
    />
  ),
  tags: (
    <Select
      dataSet={data}
      filterOption={(input, option) => {
        if (Helper.slugify(option?.children)) {
          return Helper.slugify(option?.children)?.indexOf(Helper.slugify(input)) >= 0;
        }
        return null;
      }}
      maxTagCount={maxTagCount}
      mode="tags"
      onChange={onChange}
      onPopupScroll={handleScroll}
      placeholder={placeholder || 'Chọn'}
      showSearch
    />
  ),
  cascader: (
    <Cascader
      fieldNames={fieldNames}
      options={data}
      placeholder={placeholder || 'Chọn'}
      showSearch={{ filter }}
    />
  ),
  textArea: (
    <Input.TextArea
      autoSize={{ minRows: 3, maxRows: 5 }}
      placeholder={placeholder || 'Nhập'}
      onChange={onChange}
      showCount
    />
  ),
  rangePicker: (
    <DatePicker.RangePicker
      disabledDate={disabledDate}
      disabled={disabled}
      format={picker === 'year' ? ['YYYY', 'YYYY'] : ['DD-MM-YYYY', 'DD-MM-YYYY']}
      onChange={onChange}
      placeholder={picker === 'year' ? ['Từ năm', 'Đến năm'] : ['ngày/tháng/năm', 'ngày/tháng/năm']}
      value={value}
      allowClear={allowClear}
      picker={picker}
    />
  ),
  rangePickerTime: (
    <DatePicker.RangePicker
      disabledDate={disabledDate}
      disabled={disabled}
      format={picker === 'year' ? ['YYYY', 'YYYY'] : ['DD-MM-YYYY HH:mm', 'DD-MM-YYYY HH:mm']}
      onChange={onChange}
      placeholder={picker === 'year' ? ['Từ năm', 'Đến năm'] : ['ngày/tháng/năm', 'ngày/tháng/năm']}
      value={value}
      allowClear={allowClear}
      picker={picker}
      showTime
    />
  ),
  datePicker: (
    <DatePicker
      disabled={disabled}
      allowClear={allowClear}
      disabledDate={disabledDate}
      format={variables.DATE_FORMAT.DATE}
      onChange={onChange}
      placeholder="ngày/tháng/năm"
      value={value}
    />
  ),
  monthPicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format="[Tháng] MM/YYYY"
      onChange={onChange}
      placeholder="Chọn"
      picker="month"
      allowClear={allowClear}
      value={value}
    />
  ),
  yearPicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format="[Năm] YYYY"
      onChange={onChange}
      placeholder="Chọn"
      picker="year"
      allowClear={allowClear}
      value={value}
    />
  ),
  dateTimePicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format={variables.DATE_FORMAT.DATE_TIME}
      onBlur={onBlur}
      placeholder="ngày/tháng/năm"
      showTime={{ format: 'HH:mm' }}
      value={value}
    />
  ),
  timeRange: (
    <TimePicker.RangePicker
      format={variables.DATE_FORMAT.HOUR}
      onBlur={onBlur}
      placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
      value={value}
    />
  ),
  timePicker: (
    <TimePicker
      format={variables.DATE_FORMAT.HOUR}
      onSelect={onSelect}
      disabledHours={disabledHours}
      disabledMinutes={disabledMinutes}
      placeholder="Chọn"
      disabled={disabled}
      minuteStep={15}
      value={value}
      onChange={onChange}
    />
  ),
  treeSelect: (
    <TreeSelect
      className={styles.treeSelect}
      onChange={onChange}
      placeholder={placeholder || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      showSearch
      treeCheckable
      treeData={data}
      value={value}
    />
  ),
  treeSelectAdd: (
    <TreeSelect
      className={styles.treeSelect}
      dropdownRender={dropdownRender}
      onChange={onChange}
      placeholder={placeholder || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      showSearch
      treeCheckable
      treeData={data}
      value={value}
    />
  ),
  treeSelectSingle: (
    <TreeSelect
      className={styles.treeSelect}
      onChange={onChange}
      placeholder={placeholder || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      treeCheckable={false}
      treeData={data}
      treeDefaultExpandAll
      value={value}
    />
  ),
  checkbox: (
    <Checkbox.Group onChange={onChange}>
      {data.map((item, index) => (
        <Checkbox key={item.value || index} value={item.value}>
          {item.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  ),
  checkboxChoose: (
    <Checkbox.Group onChange={onChange}>
      {data.map((item, index) => (
        <Checkbox key={item.value || index} value={item.value} checked={checked}>
          {item.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  ),
  checkboxSingle: (
    <Checkbox onChange={onChange} checked={checked} className={styles['checkbox--large']} />
  ),
  checkboxform: <Checkbox className={styles['checkbox--large']} />,
  radio: (
    <Radio.Group className="radio-custom" onChange={onChange}>
      {!_.isEmpty(data) ? (
        data.map((item, index) => (
          <Radio
            key={index}
            value={item.value}
            className={classnames({
              'd-inline-block': radioInline,
              'my-0': radioInline,
            })}
            disabled={(disabledKeys || []).includes(item.value)}
          >
            {item.label}
          </Radio>
        ))
      ) : (
        <Text className="no-data">Không có dữ liệu</Text>
      )}
    </Radio.Group>
  ),
  switch: <Switch onChange={onChange} />,
});
export default function FormItem({
  type,
  label,
  rules,
  placeholder,
  data,
  handleScroll,
  onChange,
  disabled,
  disabledDate,
  fieldNames,
  maxTagCount,
  onSearch,
  onBlur,
  dropdownRender,
  onSelect,
  disabledHours,
  disabledMinutes,
  allowClear,
  picker,
  radioInline,
  disabledKeys,
  options,
  checked,
  value,
  notFoundContent,
  filterOption,
  disabledOptions,
  ...rest
}) {
  return (
    <Form.Item {...rest} label={label && <span>{label}</span>} rules={rules}>
      {
        renderChildren(
          placeholder,
          data,
          handleScroll,
          onChange,
          disabled,
          disabledDate,
          fieldNames,
          maxTagCount,
          onSearch,
          onBlur,
          dropdownRender,
          onSelect,
          disabledHours,
          disabledMinutes,
          allowClear,
          picker,
          radioInline,
          disabledKeys,
          options,
          checked,
          value,
          notFoundContent,
          filterOption,
          disabledOptions,
        )[type]
      }
    </Form.Item>
  );
}

FormItem.propTypes = {
  children: PropTypes.any,
  type: PropTypes.any,
  label: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.any),
  placeholder: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  handleScroll: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.any,
  disabledDate: PropTypes.func,
  fieldNames: PropTypes.objectOf(PropTypes.any),
  maxTagCount: PropTypes.number,
  onSearch: PropTypes.func,
  onBlur: PropTypes.func,
  dropdownRender: PropTypes.any,
  onSelect: PropTypes.func,
  allowClear: PropTypes.bool,
  picker: PropTypes.string,
  disabledHours: PropTypes.any,
  disabledMinutes: PropTypes.any,
  radioInline: PropTypes.bool,
  disabledKeys: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.any),
  checked: PropTypes.bool,
  value: PropTypes.any,
  notFoundContent: PropTypes.any,
  filterOption: PropTypes.bool,
  disabledOptions: PropTypes.arrayOf(PropTypes.any),
};

FormItem.defaultProps = {
  children: '',
  type: 'input',
  label: '',
  rules: [],
  placeholder: '',
  data: [],
  handleScroll: () => {},
  onChange: () => {},
  onSearch: () => {},
  onBlur: () => {},
  disabled: null,
  disabledDate: () => false,
  fieldNames: { label: 'name', value: 'id', children: 'children' },
  maxTagCount: 20,
  dropdownRender: null,
  onSelect: () => {},
  allowClear: true,
  picker: 'date',
  disabledHours: null,
  disabledMinutes: null,
  radioInline: false,
  disabledKeys: null,
  options: ['id', 'name'],
  checked: false,
  value: '',
  notFoundContent: null,
  filterOption: false,
  disabledOptions: [],
};

FormItem.displayName = 'Form';
