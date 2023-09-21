import { get as getLodash, isArray, isEmpty } from 'lodash';
import Authorization from './Authorization';

const getRouteAuthority = (path, routeData = []) => {
  let authorities;
  if (routeData.authority) {
    authorities = routeData.authority;
  } // exact match

  if (routeData.path === path) {
    authorities = routeData.authority || authorities;
  } // get children authority recursively

  if (routeData.routes) {
    authorities = this.getRouteAuthority(path, routeData.routes) || authorities;
  }
  return authorities;
};

/**
  * Kiểm tra điều kiện có hợp lệ không
  * @export
  * @param {Object} data Dữ liệu đầu vào
  * @param {Object[]} [data.conditions=[]] Danh sách điều kiện
  * @param {String} data.conditions[].operator Phép so sánh
  * @param {String} data.conditions[].originValueName Tên trường ban đầu được dùng so sánh
  * @param {*} data.conditions[].originValue Giá trị của trường ban đầu được dùng so sánh
  * @param {String} data.conditions[].targetValueName Tên trường dùng để so sánh với trường ban đầu
  * @param {*} data.conditions[].targetValue Giá trị trường dùng để so sánh với trường ban đầu
  * @param {*} data.conditions[].permission Danh sách quyền cho phép
  * @param {*} data.conditions[].isOrPermission Cho phép 1 trong các quyền
  * @param {Object} data.record Record được áp dụng
  * @param {String[]} data.userPermission Danh sách quyền của user hiện tại
  * @param {Boolean} data.isOrConditions Điều kiện là "hoặc" hay không
  * @returns {Boolean} result
  */
const isValidCondition = ({
  conditions = [],
  record = {},
  userPermission = [],
  isOrConditions = false,
}) => {
  let result = true;
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return result;
  }
  for (let i = 0; i < conditions.length; i += 1) {
    const condition = conditions[i];
    let isValidPermission = true;
    if (
      'permission' in condition &&
      Array.isArray(condition.permission) &&
      condition.permission.length
    ) {
      isValidPermission = Authorization.vaild(
        userPermission,
        condition.permission,
        condition.isOrPermission === true,
      );
    }
    // check isValid permission
    if (!isValidPermission && !isOrConditions) {
      result = false;
      return result;
    }
    // case: nested conditions
    if (!isEmpty(getLodash(condition, 'conditions'))) {
      result = this.isValidCondition({
        record,
        conditions: getLodash(condition, 'conditions'),
        userPermission,
        isOrConditions: getLodash(condition, 'isOrConditions'),
      });
    } else {
      let { targetValue, originValue } = condition;
      const { operator = '=' } = condition;
      if (
        'targetValueName' in condition &&
        getLodash(record, condition.targetValueName) !== undefined
      ) {
        targetValue = getLodash(record, condition.targetValueName);
      }
      if (
        'originValueName' in condition &&
        getLodash(record, condition.originValueName) !== undefined
      ) {
        originValue = getLodash(record, condition.originValueName);
      }
      if (isOrConditions) {
        // check case isOrConditions = true
        result = false;
        switch (operator) {
          case '>':
            if (originValue > targetValue && isValidPermission) {
              result = true;
            }
            break;
          case '>=':
            if (originValue >= targetValue && isValidPermission) {
              result = true;
            }
            break;
          case '<':
            if (originValue < targetValue && isValidPermission) {
              result = true;
            }
            break;
          case '<=':
            if (originValue <= targetValue && isValidPermission) {
              result = true;
            }
            break;
          case 'in':
            if (
              isArray(targetValue) &&
              targetValue.indexOf(originValue) > -1 &&
              isValidPermission
            ) {
              result = true;
            }
            break;
          case 'notIn':
            if (
              isArray(targetValue) &&
              targetValue.indexOf(originValue) === -1 &&
              isValidPermission
            ) {
              result = true;
            }
            break;
          case '<>':
            if (originValue !== targetValue && isValidPermission) {
              result = true;
            }
            break;
          case 'empty':
            if (isEmpty(originValue) && isValidPermission) {
              result = true;
            }
            break;
          case 'notEmpty':
            if (!isEmpty(originValue) && isValidPermission) {
              result = true;
            }
            break;
          default:
            // operator = "="
            if (originValue === targetValue && isValidPermission) {
              result = true;
            }
        }
      } else {
        // check case isOrConditions = false
        result = true;
        switch (operator) {
          case '>':
            if (originValue <= targetValue) {
              result = false;
            }
            break;
          case '>=':
            if (originValue < targetValue) {
              result = false;
            }
            break;
          case '<':
            if (originValue >= targetValue) {
              result = false;
            }
            break;
          case '<=':
            if (originValue > targetValue) {
              result = false;
            }
            break;
          case 'in':
            if (!isArray(targetValue) || targetValue.indexOf(originValue) === -1) {
              result = false;
            }
            break;
          case 'notIn':
            if (!isArray(targetValue) || targetValue.indexOf(originValue) > -1) {
              result = false;
            }
            break;
          case '<>':
            if (originValue === targetValue) {
              result = false;
            }
            break;
          case 'empty':
            if (!isEmpty(originValue)) {
              result = false;
            }
            break;
          case 'notEmpty':
            if (isEmpty(originValue)) {
              result = false;
            }
            break;
          default:
            // operator = "="
            if (originValue !== targetValue) {
              result = false;
            }
        }
      }
    }
    if ((isOrConditions && result) || (!isOrConditions && !result)) {
      break;
    }
  }
  return result;
};

export { getRouteAuthority, isValidCondition };