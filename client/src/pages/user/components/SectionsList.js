import React from 'react'
import PropTypes from 'prop-types'

const SectionsList = ({ sections, onClickHandler, currentSection }) => {
  return (
    <div className="list-group" role="tablist">
      {sections.map((section, index) => {
        return (
          <div key={section._id}>
            {section.sectionTheme ? (
              <span className="list-group-item text-center list-group-item-secondary">
                {section.sectionTheme}
              </span>
            ) : null}
            <button
              className={`list-group-item list-group-item-action rounded-0 ${
                currentSection.index === index ? 'active' : ''
              }`}
              role="tab"
              onClick={(event) => onClickHandler(event, index)}
            >
              {'Раздел ' + (index + 1) + '. ' + section.sectionName}
            </button>
          </div>
        )
      })}
    </div>
  )
}

SectionsList.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickHandler: PropTypes.func.isRequired,
  currentSection: PropTypes.object.isRequired,
}

export default SectionsList
