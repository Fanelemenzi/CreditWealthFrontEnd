import React from 'react';

/**
 * ValidationFlags - Display validation warnings and data quality indicators
 * 
 * Shows:
 * - Flag type and severity (warning, info)
 * - Descriptive message
 * - Impact on score
 * 
 * Validates Requirements: 1.5
 */
const ValidationFlags = ({ validationFlags }) => {
  // Return null if no flags
  if (!validationFlags || validationFlags.length === 0) {
    return null;
  }

  // Get icon based on severity
  const getSeverityIcon = (severity) => {
    if (severity === 'warning') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  // Get CSS class based on severity
  const getSeverityClass = (severity) => {
    return severity === 'warning' ? 'warning' : 'info';
  };

  return (
    <div className="validation-flags-card">
      <h3 className="validation-flags-title">Data Quality Indicators</h3>
      <div className="validation-flags-list">
        {validationFlags.map((flag, index) => (
          <div 
            key={index} 
            className={`validation-flag-item ${getSeverityClass(flag.severity)}`}
          >
            <div className="validation-flag-header">
              <div className="validation-flag-icon">
                {getSeverityIcon(flag.severity)}
              </div>
              <div className="validation-flag-content">
                <div className="validation-flag-type">
                  {flag.flag_type || 'Validation Flag'}
                </div>
                <div className="validation-flag-message">
                  {flag.message}
                </div>
                {flag.impact !== undefined && flag.impact !== 0 && (
                  <div className="validation-flag-impact">
                    Impact: {flag.impact > 0 ? '+' : ''}{flag.impact} points
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationFlags;
