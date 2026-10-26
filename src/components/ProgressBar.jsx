import React from 'react';

/**
 * ProgressBar - Visual indicator of assessment progress
 * 
 * Features:
 * - Visual progress bar with completion percentage
 * - Section indicators (dots) for each section
 * - Current section highlight
 * - Shows completed sections with distinct styling
 * 
 * Validates Requirements: 3.2, 3.3, 3.4
 * 
 * @param {number} currentSection - Current section index (0-based)
 * @param {number} totalSections - Total number of sections
 * @param {number} completionPercentage - Overall completion percentage (0-100)
 */
const ProgressBar = ({ currentSection, totalSections, completionPercentage }) => {
  return (
    <div className="progress-bar-container">
      {/* Progress bar visualization */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      {/* Progress text showing section and percentage */}
      <div className="progress-text">
        Section {currentSection + 1} of {totalSections} - {Math.round(completionPercentage)}% Complete
      </div>
      
      {/* Section indicators (dots) */}
      <div className="section-indicators">
        {Array.from({ length: totalSections }).map((_, index) => (
          <div 
            key={index}
            className={`indicator ${
              index < currentSection ? 'completed' : ''
            } ${
              index === currentSection ? 'active' : ''
            }`}
            title={`Section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
