import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreCircle from '../components/ScoreCircle';
import PillarBreakdown from '../components/PillarBreakdown';
import ValidationFlags from '../components/ValidationFlags';
import Recommendations from '../components/Recommendations';
import ScoreService from '../services/ScoreService';
import '../styles/CreditScorePage.css';

/**
 * DashboardPage - Main credit score dashboard interface
 * 
 * Features:
 * - Authentication check on mount
 * - Fetch and display credit score data
 * - Preview mode when no score exists
 * - Display score visualization, pillar breakdown, validation flags, and recommendations
 * 
 * Validates Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 10.1, 10.3
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    // Check authentication on mount (Requirement 2.1, 10.1)
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login if no token (Requirement 10.3)
      navigate('/login');
      return;
    }

    // Fetch score data
    fetchScoreData();
  }, [navigate]);

  /**
   * Fetch score data from backend
   * Handles 404 (no score), 401 (unauthorized), and network errors
   * 
   * Validates Requirements: 2.2, 2.3, 2.4, 9.1
   */
  const fetchScoreData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Retrieve score from backend (Requirement 2.4)
      const data = await ScoreService.getLatestScore();
      setScore(data);
      setIsPreviewMode(false);
    } catch (err) {
      if (err.response?.status === 404) {
        // No score exists - enable preview mode (Requirement 1.7)
        setIsPreviewMode(true);
        setScore(getSampleData());
      } else if (err.response?.status === 401) {
        // Authentication failed - redirect to login (Requirement 2.3)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else if (!err.response) {
        // Network error - no response from server (Requirement 9.1)
        setError('Network error. Please check your connection and try again.');
        console.error('Network error:', err);
      } else if (err.response?.status >= 500) {
        // Server error - 500-level status codes (Requirement 9.3)
        setError('Server error. Our system is experiencing issues. Please try again later.');
        console.error('Server error:', err);
      } else {
        // Other errors
        setError('Failed to load credit score. Please try again later.');
        console.error('Error fetching score:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to assessment page
   * Validates Requirement: 1.9
   */
  const handleTakeAssessment = () => {
    navigate('/assessment');
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  /**
   * Get sample data for preview mode
   * Validates Requirement: 1.7
   */
  const getSampleData = () => {
    return {
      composite_score: 680,
      score_band: 'good',
      score_band_display: 'Good (650-749)',
      calculated_at: new Date().toISOString(),
      pillar_scores: {
        financial_obligations: 72,
        income_employment: 85,
        mobile_money: 65,
        assets: 60,
        savings_banking: 70,
        expense_management: 68,
        household_profile: 75,
        financial_literacy: 62,
        business_profile: 55
      },
      pillar_breakdown: {
        financial_obligations: { score: 72, weight: 15, contribution: 10.8, status: 'good' },
        income_employment: { score: 85, weight: 15, contribution: 12.75, status: 'excellent' },
        mobile_money: { score: 65, weight: 12, contribution: 7.8, status: 'fair' },
        assets: { score: 60, weight: 12, contribution: 7.2, status: 'fair' },
        savings_banking: { score: 70, weight: 12, contribution: 8.4, status: 'good' },
        expense_management: { score: 68, weight: 12, contribution: 8.16, status: 'good' },
        household_profile: { score: 75, weight: 8, contribution: 6.0, status: 'good' },
        financial_literacy: { score: 62, weight: 8, contribution: 4.96, status: 'fair' },
        business_profile: { score: 55, weight: 6, contribution: 3.3, status: 'fair' }
      },
      validation_flags: [],
      recommendations: [
        {
          title: 'Complete Your Assessment',
          description: 'Take the full financial assessment to get your actual credit score and personalized recommendations.',
          impact: 0
        }
      ],
      honesty_bonus: 0,
      validation_adjustment: 0,
      is_sufficient_data: false,
      missing_sections: [],
      score_id: 'preview'
    };
  };

  // Get score band color
  const getScoreBandColor = (scoreValue) => {
    if (scoreValue >= 750) return '#10b981'; // Excellent
    if (scoreValue >= 650) return '#84cc16'; // Good
    if (scoreValue >= 550) return '#eab308'; // Fair
    if (scoreValue >= 450) return '#f97316'; // Weak
    return '#ef4444'; // Poor
  };

  // Get score band label
  const getScoreBandLabel = (scoreValue) => {
    if (scoreValue >= 750) return 'Excellent';
    if (scoreValue >= 650) return 'Good';
    if (scoreValue >= 550) return 'Fair';
    if (scoreValue >= 450) return 'Weak';
    return 'Poor';
  };

  // Loading state
  if (loading) {
    return (
      <div className="credit-score-page">
        <nav className="dashboard-nav">
          <div className="nav-container">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="#4f46e5" strokeWidth="3" />
                <path d="M16 8v8l5 3" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="logo-text">CreditScore</span>
            </div>
          </div>
        </nav>
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your credit score...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isPreviewMode) {
    return (
      <div className="credit-score-page">
        <nav className="dashboard-nav">
          <div className="nav-container">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="#4f46e5" strokeWidth="3" />
                <path d="M16 8v8l5 3" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="logo-text">CreditScore</span>
            </div>
          </div>
        </nav>
        <div className="dashboard-container">
          <div className="error-container">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>{error}</h2>
            <button onClick={fetchScoreData} className="btn-primary">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="credit-score-page">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="#4f46e5" strokeWidth="3" />
              <path d="M16 8v8l5 3" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="logo-text">CreditScore</span>
          </div>
          <div className="nav-actions">
            <button className="icon-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="icon-button user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1>Your Credit Health</h1>
            <p className="dashboard-subtitle">
              {isPreviewMode ? 'Preview Mode - Sample Data' : `Last updated: ${new Date(score.calculated_at).toLocaleDateString()}`}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-outline">
            Logout
          </button>
        </div>

        {/* Preview Mode Banner - Requirement 1.7, 1.8 */}
        {isPreviewMode && (
          <div className="preview-banner">
            <div className="preview-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <h3>This is a Preview</h3>
                <p>Complete the assessment to see your actual credit score</p>
              </div>
            </div>
            <button onClick={handleTakeAssessment} className="btn-primary">
              Take Assessment
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Main Score Card - Requirements 1.1, 1.2, 1.3 */}
          <div className="score-card main-score-card">
            <div className="card-header">
              <h2>Your Credit Score</h2>
              {!isPreviewMode && (
                <div className="score-badge" style={{ color: getScoreBandColor(score.composite_score) }}>
                  {getScoreBandLabel(score.composite_score)}
                </div>
              )}
            </div>

            <ScoreCircle score={score.composite_score} animated={true} />

            <div className="score-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-label">Poor</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range poor"></div>
                </div>
                <div className="breakdown-range-text">300-449</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Weak</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range" style={{ background: '#f97316', width: '100%' }}></div>
                </div>
                <div className="breakdown-range-text">450-549</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Fair</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range fair"></div>
                </div>
                <div className="breakdown-range-text">550-649</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Good</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range good"></div>
                </div>
                <div className="breakdown-range-text">650-749</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Excellent</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range excellent"></div>
                </div>
                <div className="breakdown-range-text">750-850</div>
              </div>
            </div>

            {!isPreviewMode && (
              <div className="score-actions">
                <button onClick={handleTakeAssessment} className="btn-outline">
                  Retake Assessment
                </button>
              </div>
            )}
          </div>

          {/* Pillar Breakdown - Requirement 1.4 */}
          <div className="pillar-card">
            <PillarBreakdown pillarBreakdown={score.pillar_breakdown} />
          </div>

          {/* Validation Flags - Requirement 1.5 */}
          {score.validation_flags && score.validation_flags.length > 0 && (
            <div className="validation-card">
              <ValidationFlags validationFlags={score.validation_flags} />
            </div>
          )}

          {/* Recommendations - Requirement 1.6 */}
          <Recommendations recommendations={score.recommendations} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
