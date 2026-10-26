import React from 'react';

/**
 * Recommendations - Display recommendations from score calculation
 * 
 * Shows:
 * - Recommendation title
 * - Description text
 * - Impact value
 * 
 * Validates Requirements: 1.6
 */
const Recommendations = ({ recommendations }) => {
  // Handle empty or missing recommendations
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations-list">
        <div className="no-recommendations">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>Great job! Your credit profile is strong.<br />No specific recommendations at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-list">
      {recommendations.map((recommendation, index) => (
        <div key={index} className="recommendation-item">
          <div className="recommendation-icon">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="recommendation-content">
            <h4>{recommendation.title}</h4>
            <p>{recommendation.description}</p>
            {recommendation.impact !== undefined && (
              <div className="recommendation-impact">
                Potential Impact: +{recommendation.impact} points
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
