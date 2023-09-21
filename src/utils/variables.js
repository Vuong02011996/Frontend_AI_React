export const variables = {
    // Layout Form
    LAYOUT_FORM_VERTICAL: 'vertical',
    LAYOUT_FORM_HORIZONTAL: 'horizontal',
    // TYPE FORM
    INPUT: 'input',
    INPUT_PASSWORD: 'inputPassword',
    PRICE: 'price',
    PERCENT: 'percent',
    INPUT_SEARCH: 'inputSearch',
    SELECT: 'select',
    SELECT_ADD: 'selectAdd',
    SELECT_MUTILPLE: 'selectMutilple',
    SELECT_TAGS: 'tags',
    CASCADER: 'cascader',
    TEXTAREA: 'textArea',
    RANGE_PICKER: 'rangePicker',
    RANGE_PICKER_TIME: 'rangePickerTime',
    TIME_RANGE: 'timeRange',
    TIME_PICKER: 'timePicker',
    TREE_SELECT: 'treeSelect',
    TREE_SELECT_ADD: 'treeSelectAdd',
    TREE_SELECT_SINGLE: 'treeSelectSingle',
    DATE_PICKER: 'datePicker',
    MONTH_PICKER: 'monthPicker',
    YEAR_PICKER: 'yearPicker',
    DATE_TIME_PICKER: 'dateTimePicker',
    CHECKBOX: 'checkbox',
    CHECKBOX_SINGLE: 'checkboxSingle',
    CHECKBOX_FORM: 'checkboxform',
    RADIO: 'radio',
    INPUT_NUMBER: 'inputNumber',
    INPUT_NOTE: 'inputNote',
    INPUT_COUNT: 'inputCount',
    INPUT_DATE: 'inputDate',
    SWITCH: 'switch',
    AUTO_COMPLETE: 'AutoComplete',
    // RULES
    RULES: {
        EMPTY: { required: true, message: 'Vui lòng không được để trống trường này' },
        EMPTY_INPUT: {
            required: true,
            message: 'Vui lòng không được để trống trường này',
            whitespace: true,
        },
        MAX_LENGTH_INPUT_CODE: { max: 30, message: 'Trường này không quá 30 kí tự' },
        MAX_LENGTH_INPUT: { max: 500, message: 'Trường này không quá 500 kí tự' },
        MAX_LENGTH_TEXTAREA: { max: 1000, message: 'Trường này không quá 1000 kí tự' },
        // TODO: Rename
        MAX_LENGTH_255: { max: 255, message: 'Trường này không quá 255 kí tự' },
        MAX_NUMBER: { max: 15, message: 'Trường này không quá 15 kí tự' },
        NUMBER: { pattern: /^\d+$/, message: 'Trường này là chỉ là số' },
        EMAIL: { type: 'email', message: 'Trường này là email' },
        PHONE: {
            pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
            message: 'Trường này là số điện thoại',
        },
        YEAR_FROM: 'Từ Năm không được lớn hơn Đến Năm',
        YEAR_TO: 'Đến Năm không được nhỏ hơn Từ Năm',
        INVALID_DATE: 'Ngày không hợp lệ',
    },
    // PAGINATION
    PAGINATION: {
        PAGE: 1,
        PAGE_SIZE_SMALL: 5,
        PAGE_SIZE: 10,
        SIZEMAX: 1000,
        PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
        SHOW_SIZE_CHANGER: true,
        PER_PAGE_TEXT: '/ trang',
    },
    // DATE FORMAT
    DATE_FORMAT: {
        DATE: 'DD-MM-YYYY',
        DATE_TIME: 'DD-MM-YYYY, HH:mm',
        FULL_DATE_TIME_1: 'DD-MM-YYYY HH:mm',
        FULL_DATE_TIME_2: 'DD/MM/YYYY, HH:mm',
        TIME_DATE: 'HH:mm, DD-MM-YYYY',
        TIME_DATE_MONTH: 'HH:mm, DD/MM',
        YEAR: 'YYYY',
        MONTH: 'MM',
        DATE_AFTER: 'YYYY-MM-DD',
        HOUR: 'HH:mm',
        TIME_FULL: 'HH:mm:ss',
        DAY_NAME: 'ddd',
        WEEKLY: 'weekly',
        // TODO: rename
        DATE_VI: 'DD/MM/YYYY',
        TIME_DATE_VI: 'HH:mm, DD/MM/YYYY',
        DATE_TIME_UTC: 'YYYY-MM-DD[T]HH:mm:ss',
        DATE_MONTH: 'DD/MM',
        SHOW_FULL_DATE: 'dddd - DD/MM/YYYY',
        MONTH_FULL: '[Tháng] MM/YYYY',
        MONTH_NAME: '[Tháng] MM',
        MONTH_YEAR: 'MM/YYYY',
        YEAR_MONTH_DAY: 'YYYY/MM/DD',
    },
    PARENT_ID: '00000000-0000-0000-0000-000000000000',
    SYMBOL: 'xem thêm',
    setDateData: {
        format: { targetValue: 'HH:mm:ss' },
        attributes: ['hour', 'minute', 'second'],
    },
    STATUS_204: 204,
    STATUS_400: 400,
    STATUS_403: 403,
    STATUS_404: 404,
    STATUS_500: 500,
    QUERY_STRING: 'queryString',
    EMPTY_DATA_TEXT: 'Chưa có dữ liệu',
    CHOOSE: [
        {
            id: 'DATE',
            name: 'Ngày',
        },
        {
            id: 'MONTH',
            name: 'Tháng',
        },
    ],
    STATUS: {
        ACTIVE: 'ACTIVE',
        CANCEL: 'CANCEL',
        PENDING: 'PENDING',
        CONNECT: 'CONNECT',
        DISCONNECT: 'DISCONNECT',
        OVERVIEW: 'OVERVIEW',
        INDIVIDUAL: 'INDIVIDUAL',
    },
    STATUS_NAME: {
        ACTIVE: 'Đang hoạt động',
        CANCEL: 'Không có tín hiệu',
        PENDING: 'Chưa hoạt động',
        CONNECT: 'Đang hoạt động',
        DISCONNECT: 'Không có tín hiệu',
    },
    STATUS_ATTENDANCE: {
        CONFIRM: 'CONFIRM',
        UNCONFIRM: 'UNCONFIRM',
    },
    STATUS_ATTENDANCE_NAME: {
        CONFIRM: 'Đã điểm danh xong',
        UNCONFIRM: 'Chưa điểm danh về',
    },
    NO_DATA: 'Không có dữ liệu',
    // eslint-disable-next-line security/detect-unsafe-regex
    REGEX_NUMBER: /\B(?=(\d{3})+(?!\d))/g,
    method: ['put', 'post', 'delete', 'patch'],
    SEMESTER_1: 'HOCKY1',
    SEMESTER_2: 'HOCKY2',
    GENDERS: {
        MALE: 'Nam',
        FEMALE: 'Nữ',
    },
};

export default variables;
