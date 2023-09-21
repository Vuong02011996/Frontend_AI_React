/* eslint-disable no-param-reassign */
import {
  isArray,
  pickBy,
  isEmpty,
  get as getLodash,
  toString,
  omit,
  size,
  head,
  last,
  toNumber,
} from 'lodash';
import { notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

const { confirm } = Modal;
export default class Helpers {
  static tagCamera = (type) => {
    if (type === variables.STATUS.PENDING) {
      return <Tag color="primary">{variables.STATUS_NAME.PENDING}</Tag>;
    }
    if (type === variables.STATUS.DISCONNECT) {
      return <Tag color="danger">{variables.STATUS_NAME.DISCONNECT}</Tag>;
    }
    if (type === variables.STATUS.ACTIVE) {
      return <Tag color="success">{variables.STATUS_NAME.ACTIVE}</Tag>;
    }
    if (type === variables.STATUS.CONNECT) {
      return <Tag color="success">{variables.STATUS_NAME.CONNECT}</Tag>;
    }
    return null;
  };

  static percentage = (partialValue, totalValue) => (100 * partialValue) / totalValue;

  static getPrice = (value, number = 0, unit = false, charactor) => {
    if (value) {
      return `${`${parseFloat(value).toFixed(number)}`.replace(
        variables.REGEX_NUMBER,
        charactor || ',',
      )}${unit ? '' : ` đ`}`;
    }
    return null;
  };

  static getPriceUnit = (value, number = 0, unit = null, charactor) => {
    if (value) {
      return `${`${parseFloat(value).toFixed(number)}`.replace(
        variables.REGEX_NUMBER,
        charactor || ',',
      )}${unit || ` đ`}`;
    }
    return null;
  };

  static convertIncludes = (include = []) => {
    if (!isEmpty(include)) {
      return include.join(',');
    }
    return undefined;
  };

  static getPercent = (value) => {
    if (value) {
      return `${parseFloat(value)} %`;
    }
    return null;
  };

  static getDateLocal = (value, format = variables.DATE_FORMAT.DATE) => {
    if (value) {
      const date = value.replace('+00:00', '+07:00');
      return moment(date).format(format);
    }
    return null;
  };

  static getDate = (value, format = variables.DATE_FORMAT.DATE) => {
    if (value) {
      return moment.utc(value).local().format(format);
    }
    return null;
  };

  static getDateSearch = (value, format = variables.DATE_FORMAT.DATE_AFTER) => {
    if (value) {
      return moment(value).format(format);
    }
    return null;
  };

  static slugify = (text) => {
    const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
    const to = 'aaaaaeeeeeiiiiooooouuuunc------';
    if (text) {
      text.toLowerCase();
      const newText = text
        .split('')
        .map((letter, i) => letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i)));
      return (
        newText
          .toString() // Cast to string
          .toLowerCase() // Convert the string to lowercase letters
          .trim() // Remove whitespace from both sides of a string
          .replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
          .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
          .replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
          .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
          .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
          .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
          .replace(/(đ)/g, 'd')
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/&/g, '-y-') // Replace & with 'and'
          // eslint-disable-next-line no-useless-escape
          .replace(/[^\w\-]+/g, '') // Remove all non-word chars
          // eslint-disable-next-line no-useless-escape
          .replace(/\-\-+/g, '-')
      ); // Replace multiple - with single -
    }
    return null;
  };

  /**
   * Get value of a property in an object by a path, example: "post.user.name"
   * @param {object} obj The object to query.
   * @param {string} path The path of the property to get., like "post.user.name" or "name"
   * @param {*} defaultValue the default value
   * @returns {*} the value
   * @static
   * @memberof Helpers
   */
  static get = (obj = {}, path = '', defaultValue) => getLodash(obj, path, defaultValue);

  /**
   *Set a date and return it
   * @param {*} originValue the origin value
   * @param {*} targetValue the target value
   * @param {object} format the formats
   * @param {string} format.originValue the format of the originValue
   * @param {string} format.targetValue the format of the targetValue
   * @param {array} attributes the attributes which are set for a new value
   * @param {object} add an object data which defines input for "moment.add()" method
   * @param {object} subtract an object data which defines input for "moment.subtract()" method
   * @returns {moment} the moment instace
   * @static
   * @memberof Helpers
   */
  static setDate = ({
    originValue = null,
    targetValue = null,
    format = {
      originValue: undefined,
      targetValue: undefined,
    },
    attributes = ['year', 'month', 'date'],
    add = {},
    subtract = {},
    isUTC = false,
  }) => {
    if (!originValue && (!targetValue || isEmpty(add) || isEmpty(subtract))) {
      return undefined;
    }
    const formatOrigin = Helpers.get(format, 'originValue');
    const formatTarget = Helpers.get(format, 'targetValue');
    let result = formatOrigin ? moment(originValue, formatOrigin) : moment(originValue);
    if (isUTC) {
      result = result.utcOffset(0);
    }
    if (targetValue) {
      const options = {};
      attributes.forEach((attr) => {
        options[attr] = formatTarget
          ? moment(targetValue, formatTarget).get(attr)
          : moment(targetValue).get(attr);
      });
      result = result.set(options);
    }
    if (!isEmpty(add)) {
      const keys = Object.keys(add);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).add(add[key], `${key}`);
      }
    }
    if (!isEmpty(subtract)) {
      const keys = Object.keys(subtract);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).subtract(subtract[key], `${key}`);
      }
    }
    return result;
  };

  /**
   * Check a value is a valid datetime
   * @param {*} value
   * @param {object} options a options which defines conditions to check the valu
   * @param {string} options.format the format of the date value
   * @param {moment} options.before the before datetime
   * @param {moment} options.after the after datetime
   * @returns {boolean} isValid
   * @static
   * @memberof Helpers
   */
  static isValidDateTime = (value, options = {}) => {
    if (value === undefined) {
      return false;
    }
    const defaultFormat = variables.DATE_FORMAT.DATE;
    let format = Helpers.get(options, 'format');
    let isValid = format ? moment(value, format).isValid() : moment(value).isValid();
    const {
      same = {
        value: null,
        format: defaultFormat,
      },
      before = {
        value: null,
        format: defaultFormat,
      },
      after = {
        value: null,
        format: defaultFormat,
      },
    } = options;
    if (same && same.value) {
      format = same.format || defaultFormat;
      const sameDate = moment(same.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isSame(moment(sameDate, format))) {
        isValid = false;
      }
    }
    if (before && before.value) {
      format = before.format || defaultFormat;
      const beforeDate = moment(before.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isBefore(moment(beforeDate, format))) {
        isValid = false;
      }
    }
    if (after && after.value) {
      format = after.format || defaultFormat;
      const afterDate = moment(after.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isAfter(moment(afterDate, format))) {
        isValid = false;
      }
    }
    return isValid;
  };

  /**
   *Get the datetime by format
   * @param {*} obj.value the datetime value
   * @param {string} obj.format the format which will be used to convert the value
   * @param {boolean} obj.isUTC if true, the value will be converted to UTC time (default use local time)
   * @param {boolean} obj.isString if true, the value will be returned as a string
   * @returns {moment} the moment instance
   * @static
   * @memberof Helpers
   */
  static getDateTime = ({
    value = undefined,
    format = null,
    isUTC = true,
    isString = true,
  } = {}) => {
    if (!value || !moment(value).isValid()) {
      return undefined;
    }
    const newValue = isUTC ? moment(value).utc() : moment(value).utc().local();
    let result = newValue;
    if (isString && isEmpty(format)) {
      result = moment(newValue).format();
    }
    if (isString && !isEmpty(format)) {
      result = moment(newValue).format(format);
    }
    if (!isString && isEmpty(format)) {
      result = moment(moment(newValue).format());
    }
    if (!isString && !isEmpty(format)) {
      result = moment(moment(newValue).format(format), format);
    }
    return result;
  };

  /**
   *Set a date and return it
   * @param {*} originValue the origin value
   * @param {*} targetValue the target value
   * @param {object} format the formats
   * @param {string} format.originValue the format of the originValue
   * @param {string} format.targetValue the format of the targetValue
   * @param {array} attributes the attributes which are set for a new value
   * @param {object} add an object data which defines input for "moment.add()" method
   * @param {object} subtract an object data which defines input for "moment.subtract()" method
   * @returns {moment} the moment instace
   * @static
   * @memberof Helpers
   */
  static setDate = ({
    originValue = null,
    targetValue = null,
    format = {
      originValue: undefined,
      targetValue: undefined,
    },
    attributes = ['year', 'month', 'date'],
    add = {},
    subtract = {},
    isUTC = false,
  }) => {
    if (!originValue && (!targetValue || isEmpty(add) || isEmpty(subtract))) {
      return undefined;
    }
    const formatOrigin = Helpers.get(format, 'originValue');
    const formatTarget = Helpers.get(format, 'targetValue');
    let result = formatOrigin ? moment(originValue, formatOrigin) : moment(originValue);
    if (isUTC) {
      result = result.utcOffset(0);
    }
    if (targetValue) {
      const options = {};
      attributes.forEach((attr) => {
        options[attr] = formatTarget
          ? moment(targetValue, formatTarget).get(attr)
          : moment(targetValue).get(attr);
      });
      result = result.set(options);
    }
    if (!isEmpty(add)) {
      const keys = Object.keys(add);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).add(add[key], `${key}`);
      }
    }
    if (!isEmpty(subtract)) {
      const keys = Object.keys(subtract);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).subtract(subtract[key], `${key}`);
      }
    }
    return result;
  };

  /**
   *Get the datetime by format from utc
   * @param {*} obj.value the datetime value
   * @param {string} obj.format the format which will be used to convert the value
   * @returns {moment} the moment instance
   * @static
   * @memberof Helpers
   */
  static getDateTimeFromUTC = ({ value = undefined, format = null } = {}) => {
    if (!value || !moment(value).isValid()) {
      return undefined;
    }
    if (value && format) {
      return moment.utc(value).local().format(format);
    }
    return moment.utc(value).local();
  };

  static addObjectToArray = (array, data) => {
    if (isArray(data)) {
      return [...array, ...data];
    }
    return [...array, data];
  };

  static convertParamSearch = (search) => {
    let objects = {};
    Object.keys(pickBy(search, (value) => value)).forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(
          pickBy(search, (value) => {
            if (isArray(value)) {
              return !isEmpty(value.filter((item) => item))
                ? value.filter((item) => item)
                : undefined;
            }
            return value;
          }),
          key,
        )
      ) {
        objects = {
          ...objects,
          [`${key}`]: pickBy(search, (value) => value)[key],
        };
      }
    });
    if (!isEmpty(objects)) {
      return objects;
    }
    return undefined;
  };

  static convertParamSearchConvert = (search, type = '') => {
    const arr = [];
    if (type === variables.QUERY_STRING) {
      Object.keys(
        pickBy(search, (value) => {
          if (isArray(value)) {
            return !isEmpty(value.filter((item) => item))
              ? value.filter((item) => item)
              : undefined;
          }
          return value;
        }),
      ).forEach((key) => {
        if (
          Object.prototype.hasOwnProperty.call(
            pickBy(search, (value) => value),
            key,
          )
        ) {
          if (isArray(pickBy(search, (value) => value)[key])) {
            arr.push(`${key}=${pickBy(search, (value) => value)[key].filter((item) => item)}`);
          } else {
            arr.push(`${key}=${pickBy(search, (value) => value)[key]}`);
          }
        }
      });
      return arr.join('&');
    }
    Object.keys(pickBy(search, (value) => value)).forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(
          pickBy(search, (value) => {
            if (isArray(value)) {
              return !isEmpty(value.filter((item) => item))
                ? value.filter((item) => item)
                : undefined;
            }
            return value;
          }),
          key,
        )
      ) {
        arr.push(`${key}:${pickBy(search, (value) => value)[key]}`);
      }
    });
    return arr.join(';');
  };

  static disabledDate = (current) => current && current <= moment().startOf('day');

  static disabledDateFuture = (current) => current && current >= moment().endOf('day');

  static serialOrder = (page, index, size = variables.PAGINATION.PAGE_SIZE) => {
    const num = (page - 1) * size + index + 1;
    return num;
  };

  static getPagination = (page, limit) => ({
    skipCount: toString((Number(page) - 1) * Number(limit)),
    maxResultCount: limit,
  });

  static convertTreeSelect = (items = [], keyValue = 'value', keyLabel = 'label') =>
    items.map((item) => ({
      [`${keyValue}`]: item.id,
      [`${keyLabel}`]: item.name,
      children: this.convertTreeSelect(item.children),
    }));

  static convertSelectSingle = (items = []) =>
    items.map((item) => ({
      id: item,
      name: item,
    }));

  static convertRadioSingle = (items = []) =>
    items.map((item) => ({
      value: item,
      label: item,
    }));

  static isJSON = (text) => {
    if (text) {
      if (
        /^[\],:{}\s]*$/.test(
          text
            .replace(/\\["\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
        )
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  static romanize(num) {
    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let str = '';
    let number = num;
    Object.keys(roman).forEach((item) => {
      const q = Math.floor(number / roman[item]);
      number -= q * roman[item];
      str += item.repeat(q);
    });
    return str;
  }

  /**
   * Function convert tree to flat
   * @param {array} items data need convert
   */
  static flatten = (items) => {
    if (!isEmpty(items)) {
      const array = Array.isArray(items) ? items : [items];
      return array.reduce((acc, value) => {
        let dataNew = value?.children ? acc.push(omit(value, 'children')) : acc;
        if (value?.children) {
          dataNew = value?.children ? acc.concat(this.flatten(value?.children)) : acc;
          delete dataNew?.children;
        }
        return dataNew;
      }, []);
    }
    return [];
  };

  /**
   * Function convert flat to tree
   * @param {array} items data need convert
   * @param {interger} id id of record
   * @param {string} key key of parentId
   */
  static nest = (items, id = null, key = 'parent_id') =>
    items
      .filter((item) => item[key] === id)
      .map((item) => ({ ...item, children: this.nest(items, item.id) }));

  static removeEmptyChildren = (items = []) =>
    items.map((item) => {
      const { children, ...other } = item;
      if (size(children)) {
        return {
          ...other,
          children: this.removeEmptyChildren(item.children),
        };
      }
      return other;
    });

  static exportExcel = async (path, paramSearch, nameFile = 'total.xlsx') => {
    const params = {
      ...pickBy(paramSearch, (value) => value),
    };
    const url = new URL(`${API_URL_LAVAREL}${path}`);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const data = nameFile;
          response.blob().then((blob) => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = data;
            link.click();
          });
        } else {
          notification.error({
            message: 'Thất bại',
            description: 'Bạn đã tải excel không thành công',
          });
        }
      })
      .catch(() => {
        notification.error({
          message: 'Thất bại',
          description: 'Bạn đã tải excel không thành công',
        });
      });
  };

  static sttList(page, index, size = variables.PAGINATION.SIZE) {
    const num = (page - 1) * size + index + 1;
    return num;
  }

  static getTwoDate = (startDate, endDate, format = variables.DATE_FORMAT.DATE_SLASH) => {
    if (startDate && endDate) {
      return `${moment(startDate).format(format)} - ${moment(endDate).format(format)}`;
    }
    if (startDate) return moment(startDate).format(format);
    if (endDate) return moment(endDate).format(format);
    return null;
  };

  static convertArrayDays = (start_date = moment(), end_date = moment()) => {
    const days = [];
    let day = moment(start_date);
    while (day <= moment(end_date).endOf('days')) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    return days.map((item) => moment(item));
  };

  static convertArrayDaysNotWeekends = (start_date = moment(), end_date = moment()) => {
    const days = [];
    let day = moment(start_date);
    while (day <= moment(end_date).endOf('days')) {
      if (moment(day).day() !== 0 && moment(day).day() !== 6) {
        days.push(day.toDate());
      }
      day = day.clone().add(1, 'd');
    }
    return days.map((item) => moment(item));
  };

  static toFixed = (num) => {
    if (!num) return;
    // eslint-disable-next-line consistent-return
    return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  };

  static getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = moment(startDate).startOf('day');
    const stopDate1 = moment(stopDate).startOf('day');
    while (currentDate <= stopDate1) {
      dateArray.push(moment(currentDate));
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  static getDateRank = (startTime, endTime, format = variables.DATE_FORMAT.DATE_AFTER) => {
    if (startTime && endTime) {
      return `${moment(startTime).format(format)} - ${moment(endTime).format(format)}`;
    }
    return null;
  };

  static joinDateTime = (date, time) =>
    `${moment(date).format(variables.DATE_FORMAT.DATE_AFTER)} ${moment(time).format(
      variables.DATE_FORMAT.TIME_FULL,
    )}`;

  static joinDateTimeLocal = (date, time) =>
    `${moment.utc(date).local().format(variables.DATE_FORMAT.DATE_AFTER)} ${moment
      .utc(time)
      .local()
      .format(variables.DATE_FORMAT.TIME_FULL)}`;

  static getPathAvatarJson = (fileImage) => {
    const allowTypes = ['jpeg', 'jpg', 'png'];
    if (this.isJSON(fileImage)) {
      const files = JSON.parse(fileImage);
      if (!isEmpty(files) && isArray(files)) {
        return head(files.filter((item) => allowTypes.includes(last(item.split('.')))));
      }
      return null;
    }
    return null;
  };

  static convertSelectUsers = (items) => {
    if (!isEmpty(items)) {
      return items.map((item) => ({
        id: item.id,
        name: `${item.fullName}  ${
          getLodash(item, 'positionLevel[0].division.name')
            ? `(${getLodash(item, 'positionLevel[0].division.name')})`
            : ''
        }`,
      }));
    }
    return [];
  };

  static convertSelectParent = (items) => {
    if (!isEmpty(items)) {
      return items.map((item) => ({
        id: item.id,
        name: `${item.fullName}  ${
          getLodash(item, 'phone') ? `(${getLodash(item, 'phone')})` : ''
        }`,
      }));
    }
    return [];
  };

  static onSortDates = (data = [], key = 'created_at', sort = 'desc') => {
    if (!isEmpty(data)) {
      if (sort === 'asc') {
        return data.sort((a, b) => new Date(a[`${key}`]) - new Date(b[`${key}`]));
      }
      return data.sort((a, b) => new Date(b[`${key}`]) - new Date(a[`${key}`]));
    }
    return [];
  };

  static isVideo = (string) => {
    const arrayLink = string.split('.');
    if (last(arrayLink) === 'mp4') return true;
    return false;
  };

  static disabledDateWeekeend = (current) =>
    moment(current).day() === 0 || moment(current).day() === 6;

  static checkdisabledYear = (current, data, yearKey) => {
    if (data[yearKey]) {
      return (
        current < moment(data[yearKey]).startOf('year') ||
        current > moment(data[yearKey]).endOf('year')
      );
    }
    return null;
  };

  static disabledDateTo = (current, formRef, key = 'startDate', values) => {
    if (formRef.current) {
      const data = formRef.current.getFieldsValue();
      if (values?.yearKey) {
        if (!data[key]) {
          return this.checkdisabledYear(current, data, values?.yearKey);
        }
        return (
          (current && current <= moment(data[key]).startOf('day')) ||
          current > moment(data[values?.yearKey]).endOf('year')
        );
      }
      if (data[key] && !values?.yearKey) {
        return (
          (current && current < moment(data[key]).startOf('day')) ||
          (values?.month ? current > moment(data[key]).add(values?.month, 'month') : null)
        );
      }
      return null;
    }
    return null;
  };

  static disabledDateFrom = (current, formRef, key = 'endDate', values) => {
    if (formRef.current) {
      const data = formRef.current.getFieldsValue();
      if (values?.yearKey) {
        if (!data[key]) {
          return this.checkdisabledYear(current, data, values?.yearKey);
        }
        return (
          (current && current >= moment(data[key]).endOf('day')) ||
          current < moment(data[values?.yearKey]).startOf('year')
        );
      }
      if (data[key] && !values?.yearKey) {
        return (
          (current && current >= moment(data[key]).startOf('day')) ||
          (values?.month ? current < moment(data[key]).add(-values?.month, 'month') : null)
        );
      }
      return null;
    }
    return null;
  };

  static disabledDatebyValue = (current, { date, year, type }) => {
    if (year && !date) {
      return current < moment(year).startOf('year') || current > moment(year).endOf('year');
    }
    if (date) {
      if (type === 'startDate') {
        return (
          (current && current > moment(date)) ||
          (year ? current < moment(year).startOf('year') : null)
        );
      }
      if (type === 'endDate') {
        return (
          (current && current < moment(date)) ||
          (year ? current > moment(year).endOf('year') : null)
        );
      }
      return null;
    }

    return false;
  };

  static disabledYear = (
    current,
    formRef,
    { key = '', value = '', format = 'YYYY', compare = '>=' },
  ) => {
    if (formRef.current && key) {
      const data = formRef.current.getFieldsValue();
      let getValue = '';

      if (value) {
        getValue = moment(value, format);
      }
      if (data[key]) {
        if (key !== 'yearFrom' || key !== 'yearTo') {
          getValue = moment(formRef?.current?.getFieldValue(key), format);
        }
        if (key === 'yearFrom') {
          getValue = moment(formRef?.current?.getFieldValue('yearFrom'), format).startOf('year');
        }
        if (key === 'yearTo') {
          getValue = moment(formRef?.current?.getFieldValue('yearTo'), format).endOf('year');
        }
      }

      if (getValue) {
        if (compare === '=') {
          return current && current === moment(getValue);
        }
        if (compare === '>') {
          return current && current >= moment(getValue);
        }
        if (compare === '<=') {
          return current && current <= moment(getValue);
        }
        if (compare === '<') {
          return current && current < moment(getValue);
        }
        return current && current >= moment(getValue);
      }
      return null;
    }
    return null;
  };

  static centerLatLng = (items) => {
    let lat = 0;
    let lng = 0;
    items.forEach((item) => {
      lat += item.lat;
      lng += item.long;
    });
    return [lat / items.length, lng / items.length];
  };

  static treeDate = (data) => {
    const groups = data.reduce((r, o) => {
      const m = moment(o).format('MM');
      // eslint-disable-next-line no-unused-expressions
      r[m] ? r[m].data.push(o) : (r[m] = { month: moment(o), data: [o] });
      return r;
    }, {});

    const result = this.onSortDates(
      Object.keys(groups).map((k) => groups[k]),
      'month',
      'asc',
    );
    return result;
  };

  static onSortData = (data = [], type = 'orderIndex', asc = true) => {
    if (!isEmpty(data)) {
      return data.sort((a, b) => {
        if (asc) {
          return Number(a[type]) - Number(b[type]);
        }
        return Number(b[type]) - Number(a[type]);
      });
    }
    return [];
  };

  static getArrayHolidays(items) {
    let dataSource = [];
    items.forEach((item) => {
      let currentDate = moment(item.startDate).startOf('day');
      const endDate = moment(item.endDate).startOf('day');
      while (currentDate <= endDate) {
        dataSource = [...dataSource, { ...item, date: moment(currentDate).endOf('days') }];
        currentDate = moment(currentDate).add(1, 'days');
      }
    });
    return dataSource;
  }

  static confirmAction = ({ callback }) => {
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        callback();
      },
      onCancel() {},
    });
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  static paginationLavarel = ({ pagination, callback }) => ({
    size: 'default',
    total: pagination?.total,
    pageSize: pagination?.per_page,
    defaultCurrent: pagination?.current_page,
    hideOnSinglePage: pagination?.total_pages <= 1 && pagination?.per_page <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      callback({ page, limit: size });
    },
    onShowSizeChange: (current, size) => {
      callback({ page: current, limit: size });
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  static paginationNet = ({ pagination, query, callback }) => ({
    size: 'default',
    total: pagination.total,
    pageSize: query?.limit || variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(query?.page || variables.PAGINATION.PAGE),
    current: Number(query?.page || variables.PAGINATION.PAGE),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      callback({ page, limit: size });
    },
    onShowSizeChange: (current, size) => {
      callback({ page: current, limit: size });
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  static getStartDate = (date, choose) => {
    if (date) {
      return moment(date);
    }
    return moment().startOf(choose || 'isoWeek');
  };

  static getEndDate = (date, choose) => {
    if (date) {
      return moment(date);
    }
    return moment().endOf(choose || 'isoWeek');
  };

  static disabledDateRank = (current) =>
    current < moment().subtract(1, 'months') || current > moment().add(1, 'months');

  static getRange = (startDate, endDate, type) => {
    const fromDate = moment(startDate);
    const toDate = moment(endDate);
    const diff = toDate.diff(fromDate, type);
    const range = [];
    for (let i = 0; i < diff; i += 1) {
      range.push(moment(startDate).add(i, type));
    }
    return range;
  };

  static charCounter = (src = '', char) => src.split(char).length - 1;

  static splitString = (str) => {
    const tmp = [];
    if (!str) return tmp;

    const src = str.split(' ');

    let brackCounter = 0;
    let currentChildren = [];

    const src2 = src.reduce((result, item) => {
      if (brackCounter === 0 && !(item.includes('(') || item.includes(')'))) {
        return [...result, item];
      }

      const startBrackCounter = this.charCounter(item, '(');
      const endBrackCounter = this.charCounter(item, ')');
      brackCounter = brackCounter + startBrackCounter - endBrackCounter;

      if (brackCounter > 0) {
        currentChildren = [...currentChildren, item];
        return result;
      }
      const tmpChildren = [...currentChildren, item];
      currentChildren = [];
      return [...result, tmpChildren.join(' ')];
    }, []);

    let currentRecipe = null;

    src2.forEach((item) => {
      if (['+', '-', '*', '/'].includes(item)) {
        // eslint-disable-next-line no-return-assign
        return (currentRecipe = item);
      }

      if (item.includes('(')) {
        tmp.push({
          recipe: currentRecipe,
          enum: item,
          children: this.splitString(item.substring(1, item.length - 1)),
        });
        // eslint-disable-next-line no-return-assign
        return (currentRecipe = null);
      }

      tmp.push({
        recipe: currentRecipe,
        enum: +item ? +item : item,
      });
      // eslint-disable-next-line no-return-assign
      return (currentRecipe = null);
    });

    return tmp;
  };

  static getStatusContracts = (contractFrom, contractTo) => {
    const diffSignDate = moment(
      moment(contractFrom).format(variables.DATE_FORMAT.DATE_BEFORE),
    ).diff(moment().format(variables.DATE_FORMAT.DATE_BEFORE), 'days');
    const diffExpirationDate = moment(
      moment(contractTo).format(variables.DATE_FORMAT.DATE_BEFORE),
    ).diff(moment().format(variables.DATE_FORMAT.DATE_BEFORE), 'days');
    const diffExpirationDateMonth = moment(contractTo).diff(moment(), 'month');
    if (diffSignDate <= 0 && diffExpirationDateMonth > 0) {
      return <Tag color="success">Đang hiệu lực</Tag>;
    }
    if (diffExpirationDateMonth < 1 && diffExpirationDate >= 0) {
      return <Tag color="yellow">Gần hết hạn</Tag>;
    }
    if (diffExpirationDate < 0) {
      return <Tag color="danger">Đã hết hạn</Tag>;
    }
    return '';
  };

  static getStatusAttendance = (status) => {
    if (status === variables.STATUS_ATTENDANCE.CONFIRM) {
      return <Tag color="success">{variables.STATUS_ATTENDANCE_NAME.CONFIRM}</Tag>;
    }
    if (status === variables.STATUS_ATTENDANCE.UNCONFIRM) {
      return <Tag color="danger">{variables.STATUS_ATTENDANCE_NAME.UNCONFIRM}</Tag>;
    }
    return null;
  };

  static summary = (items, key = 'amount', number = 0) => {
    if (!isEmpty(items)) {
      return items.reduce(
        (result, item) => result + toNumber(parseFloat(item[`${key}`]).toFixed(number)) || 0,
        0,
      );
    }
    return null;
  };

  static summaryMultip = (items, key = 'amount', keyPrice = 'price') => {
    if (!isEmpty(items)) {
      return items.reduce((result, item) => {
        const summary = toNumber(item[`${key}`] || 0) * toNumber(item[`${keyPrice}`] || 0);
        return result + summary;
      }, 0);
    }
    return null;
  };

  static average = (items, key = 'amount') => {
    if (!isEmpty(items)) {
      const total = items.reduce((result, item) => result + item[`${key}`] || 0, 0);
      return total / items.length;
    }
    return null;
  };

  static getTagSales = (status) => {
    if (status === variables.STATUS_SALES.PENDING || status === variables.STATUS_SALES.CONFIRMED) {
      return <Tag color="yellow">{variables.STATUS_SALES_NAME.PENDING}</Tag>;
    }
    if (status === variables.STATUS_SALES.SHIPPING) {
      return <Tag color="primary">{variables.STATUS_SALES_NAME.SHIPPING}</Tag>;
    }
    if (status === variables.STATUS_SALES.COMPLETED) {
      return <Tag color="success">{variables.STATUS_SALES_NAME.COMPLETED}</Tag>;
    }
    return '';
  };

  static handleSelectMultiple = (value) => {
    if (!isEmpty(value)) {
      if (value[value.length - 1] === null) {
        return [null];
      }
      return value.filter((item) => item !== null);
    }
    return [null];
  };
}
