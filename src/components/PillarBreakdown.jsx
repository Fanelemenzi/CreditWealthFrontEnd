import React from 'react';
import { PERSONAL_PILLARS } from '../config/personalScore';

/**
 * PillarBreakdown - Display scores for all nine financial pillars
 * 
 * Shows:
 * - Pillar name and score
 * - Weight percentage
 * - Contribution to overall score
 * - Visual progress indicator
 * 
 * Validates Requirements: 1.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */
const PillarBreakdown = ({ pillarBreakdown }) => {
  // Get status color based on score
  const getStatusColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#84cc16'; // Lime
    if (score >= 40) return '#eab308'; // Yellow
    if (score >= 20) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="pillar-breakdown">
      <h3 className="pillar-breakdown-title">Financial Pillars Breakdown</h3>
      <div className="pillar-list">
        {PERSONAL_PILLARS.map(pillar => {
          const pillarData = pillarBreakdown?.[pillar.key] || { score: 0, contribution: 0 };
          const score = pillarData.score || 0;
          const contribution = pillarData.contribution || 0;
          const statusColor = getStatusColor(score);

          return (
            <div key={pillar.key} className="pillar-item">
              <div className="pillar-header">
                <div className="pillar-info">
                  <span className="pillar-label">{pillar.label}</span>
                  <span className="pillar-weight">{pillar.weight}% weight</span>
                </div>
                <div className="pillar-scores">
                  <span className="pillar-score" style={{ color: statusColor }}>
                    {score}/100
                  </span>
                  <span className="pillar-contribution">
                    +{contribution.toFixed(1)} pts
                  </span>
                </div>
              </div>
              <div className="pillar-progress-bar">
                <div 
                  className="pillar-progress-fill"
                  style={{ 
                    width: `${score}%`,
                    backgroundColor: statusColor
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PillarBreakdown;
