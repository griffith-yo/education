import React from 'react'
import PropTypes from 'prop-types'
import Creatable from 'react-select/creatable'

const ReactCreatableSelect = ({
  onChange,
  options,
  name,
  id,
  value,
  label,
}) => (
  <div className="form-floating">
    <Creatable
      className="mb-3"
      styles={{
        control: (provided, state) => ({
          ...provided,
          paddingLeft: '0.1rem',
          paddingTop: '1.5rem',
        }),
      }}
      placeholder="Выбрать или создать..."
      onChange={onChange}
      closeMenuOnSelect={false}
      options={options}
      name={name}
      id={id}
      formatCreateLabel={() => 'Добавить'}
      createOptionPosition={'first'}
      value={value}
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

ReactCreatableSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
}

export default ReactCreatableSelect
