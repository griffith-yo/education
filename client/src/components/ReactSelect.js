import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const ReactSelect = ({
  onChange,
  options,
  name,
  id,
  value,
  label,
  isMulti,
}) => (
  <div className="form-floating">
    <Select
      className="mb-3"
      styles={{
        control: (provided, state) => ({
          ...provided,
          paddingLeft: '0.1rem',
          paddingTop: '1.5rem',
        }),
      }}
      placeholder="Выбрать..."
      onChange={onChange}
      closeMenuOnSelect={false}
      options={options}
      name={name}
      id={id}
      value={value}
      isMulti={isMulti}
    />
    <label
      htmlFor={id}
      style={{
        opacity: '0.65',
        transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)',
      }}
    >
      {label}
    </label>
  </div>
)

ReactSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  isMulti: PropTypes.bool,
}

export default ReactSelect
