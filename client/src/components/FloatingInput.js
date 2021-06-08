import React from 'react'
import PropTypes from 'prop-types'

const FloatingInput = ({
  spacing,
  type,
  name,
  inputClassName,
  id,
  placeholder,
  onChange,
  value,
  required,
}) => {
  return (
    <div className={`form-floating ${spacing || 'mb-3'}`}>
      <input
        type={type || 'text'}
        className={inputClassName || 'form-control'}
        name={name || 'name'}
        id={id || 'id'}
        placeholder={placeholder || 'placeholder'}
        onChange={onChange}
        value={value}
        required={required || ''}
      />
      <label htmlFor={id || 'id'}>{placeholder || 'placeholder'}</label>
    </div>
  )
}

FloatingInput.propTypes = {
  spacing: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.string,
}

export default FloatingInput
