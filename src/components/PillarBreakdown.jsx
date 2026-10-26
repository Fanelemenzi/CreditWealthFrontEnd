import React from 'react';

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
  // Define pillar configuration with labels and weights
  const pillars = [
    { key: 'financial_obligations', label: 'Financial Obligations', weight: 15 },
    { key: 'income_employment', label: 'Income & Employment', weight: 15 },
    { key: 'mobile_money', label: 'Mobile Money', weight: 12 },
    { key: 'assets', label: 'Assets', weight: 12 },
    { key: 'savings_banking', label: 'Savings & Banking', weight: 12 },
    { key: 'expense_management', label: 'Expense Management', weight: 12 },
    { key: 'household_profile', label: 'Household Profile', weight: 8 },
    { key: 'financial_literacy', label: 'Financial Literacy', weight: 8 },
    { key: 'business_profile', label: 'Business Profile', weight: 6 }
  ];

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
        {pillars.map(pillar => {
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
