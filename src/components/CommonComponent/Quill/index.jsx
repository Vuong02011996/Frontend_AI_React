import React from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';

export default function Index({ ...rest }) {
  return (
    <ReactQuill placeholder="Nhập" {...rest} />
  );
}

Index.propTypes = {
  props: PropTypes.any,
};

Index.defaultProps = {
  props: '',
};
