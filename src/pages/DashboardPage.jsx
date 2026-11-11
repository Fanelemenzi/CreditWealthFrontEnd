import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import BusinessScoreView from '../components/BusinessScoreView';
import ScoreCircle from '../components/ScoreCircle';
import ScoreScale from '../components/ScoreScale';
import PillarBreakdown from '../components/PillarBreakdown';
import ValidationFlags from '../components/ValidationFlags';
import Recommendations from '../components/Recommendations';
import ScoreService from '../services/ScoreService';
import BusinessScoreService from '../services/BusinessScoreService';
import { logOut } from '../services/auth.js';
import { useAuth } from '../AuthContext.jsx';
import EmailVerificationPrompt from '../components/EmailVerificationPrompt.jsx';
import { getMe } from '../services/api.js';
import { PERSONAL_PILLARS, getPersonalBand } from '../config/personalScore';
import { getBusinessTier, getBusinessTierById } from '../config/businessScore';
import '../styles/CreditScorePage.css';
import '../styles/NewDesign.css';
import '../styles/Redesign.css';

/**
 * Get sample data for preview mode
 * Validates Requirement: 1.7
 */
const getSampleData = () => ({
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
      description: 'Take the full financial assessment to get your actual credit score and personalized recommendations.'
    }
  ],
  honesty_bonus: 0,
  validation_adjustment: 0,
  is_sufficient_data: false,
  missing_sections: [],
  score_id: 'preview'
});

const BUSINESS_SCORE_ENABLED = import.meta.env.VITE_ENABLE_BUSINESS_SCORE === 'true';

// The highest and lowest scoring pillars, shown beside the score
const getPillarHighlights = (breakdown) => {
  const scored = PERSONAL_PILLARS
    .filter((pillar) => breakdown?.[pillar.key])
    .map((pillar) => ({ label: pillar.label, score: breakdown[pillar.key].score || 0 }));
  if (scored.length === 0) return null;

  const byScore = [...scored].sort((a, b) => b.score - a.score);
  return { strongest: byScore[0], focus: byScore[byScore.length - 1] };
};

/**
 * Compact pointer to the business score, secondary to the personal score
 */
const BusinessTeaser = ({ status, result, onOpen }) => {
  if (status === 'ready') {
    const score = Math.round(result.final_bvss);
    const tier = getBusinessTierById(result.risk_tier) || getBusinessTier(score);
    return (
      <aside className="dash-teaser cw-card">
        <p className="cw-eyebrow">Business Viability Score</p>
        <p className="dash-teaser-score">
          {score}<span>/ 1000</span>
        </p>
        <p>{tier.label} tier ({tier.id})</p>
        <button type="button" className="cw-btn cw-btn-ghost" onClick={onOpen}>View business score</button>
      </aside>
    );
  }

  return (
    <aside className="dash-teaser cw-card">
      <p className="cw-eyebrow">Business Viability Score</p>
      <h3>{status === 'pending' ? 'Your business score is being prepared' : 'Run a business?'}</h3>
      {status !== 'pending' && (
        <p>See how ready your small business or startup is for finance. It’s separate from your personal score.</p>
      )}
      <button type="button" className="cw-btn cw-btn-ghost" onClick={onOpen}>Explore business score</button>
    </aside>
  );
};

/**
 * DashboardPage - personal credit score first, with the business score one click away
 *
 * Features:
 * - Authentication check on mount
 * - Fetch and display credit score data
 * - Preview mode when no score exists
 * - Display score visualization, pillar breakdown, validation flags, and recommendations
 * - Business Viability Score view at /dashboard?view=business
 *
 * Validates Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 10.1, 10.3
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { firebaseUser, setProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [businessStatus, setBusinessStatus] = useState(
    BUSINESS_SCORE_ENABLED ? 'loading' : 'unavailable'
  );
  const [businessResult, setBusinessResult] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(
    Boolean(firebaseUser?.emailVerified)
  );

  const activeView = searchParams.get('view') === 'business' ? 'business' : 'personal';

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
    if (BUSINESS_SCORE_ENABLED) {
      fetchBusinessData();
    }
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
      } else if (err.response?.status === 401 && isEmailVerified) {
        // Authentication failed - redirect to login (Requirement 2.3)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else if (!err.response) {
        setError(
          err.code === 'ERR_NETWORK'
            ? 'The score service is unavailable. Please make sure the backend is running and try again.'
            : 'Network error. Please check your connection and try again.'
        );
        console.error('Score service network error:', err);
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
   * Fetch the business score separately, so a problem here never blocks the
   * personal score.
   */
  const fetchBusinessData = async () => {
    try {
      const result = await BusinessScoreService.getLatestResult();
      if (!result) {
        setBusinessStatus('none');
      } else if (result.pending) {
        setBusinessStatus('pending');
      } else {
        setBusinessResult(result);
        setBusinessStatus('ready');
      }
    } catch (err) {
      setBusinessStatus('unavailable');
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
  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const handleEmailVerified = async () => {
    setIsEmailVerified(true);
    try {
      setProfile(await getMe());
    } catch (profileError) {
      console.error('Could not load verified user profile:', profileError);
    }
  };

  const showView = (view) => {
    setSearchParams(view === 'business' ? { view: 'business' } : {});
    window.scrollTo(0, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="credit-score-page dashboard-redesign dash">
        <nav className="dash-nav" aria-label="Main">
          <div className="dash-wrap dash-nav-inner"><BrandLogo /></div>
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
      <div className="credit-score-page dashboard-redesign dash">
        <nav className="dash-nav" aria-label="Main">
          <div className="dash-wrap dash-nav-inner"><BrandLogo /></div>
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

  const band = getPersonalBand(score.composite_score);
  const highlights = getPillarHighlights(score.pillar_breakdown);

  return (
    <div className="credit-score-page dashboard-redesign dash">
      <nav className="dash-nav" aria-label="Main">
        <div className="dash-wrap dash-nav-inner">
          <BrandLogo />
          <div className="dash-switch" role="group" aria-label="Choose a score">
            <button
              type="button"
              aria-current={activeView === 'personal' ? 'page' : undefined}
              onClick={() => showView('personal')}
            >
              Personal
            </button>
            <button
              type="button"
              aria-current={activeView === 'business' ? 'page' : undefined}
              onClick={() => showView('business')}
            >
              Business
            </button>
          </div>
          <button type="button" onClick={handleLogout} className="cw-btn cw-btn-ghost dash-logout">
            Logout
          </button>
        </div>
      </nav>

      <main className="dash-wrap dash-main">
        {!isEmailVerified && (
          <EmailVerificationPrompt
            email={firebaseUser?.email}
            onVerified={handleEmailVerified}
          />
        )}
        {activeView === 'business' ? (
          <BusinessScoreView status={businessStatus} result={businessResult} />
        ) : (
          <>
            <header className="dash-header">
              <div>
                <h1>Your Credit Health</h1>
                <p>
                  {isPreviewMode
                    ? 'Preview Mode - Sample Data'
                    : `Last updated: ${new Date(score.calculated_at).toLocaleDateString()}`}
                </p>
              </div>
            </header>

            {/* Preview Mode Banner - Requirement 1.7, 1.8 */}
            {isPreviewMode && (
              <div className="dash-preview">
                <div>
                  <h3>This is a Preview</h3>
                  <p>Complete the assessment to see your actual credit score</p>
                </div>
                <button onClick={handleTakeAssessment} className="cw-btn cw-btn-primary">
                  Take Assessment
                </button>
              </div>
            )}

            {/* Main Score - Requirements 1.1, 1.2, 1.3 */}
            <section className="dash-hero" aria-label="Your credit score">
              <div className="cw-ring cw-ring-dark">
                <ScoreCircle score={score.composite_score} animated={true} />
              </div>
              <div className="dash-hero-detail">
                <p className="dash-hero-eyebrow">{isPreviewMode ? 'Sample credit score' : 'Your credit score'}</p>
                <h2>{band.label}</h2>
                <p className="dash-hero-range">
                  {band.label} scores run from {band.min} to {band.max}.
                </p>
                <ScoreScale score={score.composite_score} />
                {highlights && (
                  <dl className="dash-highlights">
                    <div>
                      <dt>Strongest pillar</dt>
                      <dd>{highlights.strongest.label}</dd>
                    </div>
                    <div>
                      <dt>Focus next on</dt>
                      <dd>{highlights.focus.label}</dd>
                    </div>
                  </dl>
                )}
                {!isPreviewMode && (
                  <button onClick={handleTakeAssessment} className="cw-btn cw-btn-light">
                    Retake Assessment
                  </button>
                )}
              </div>
            </section>

            <div className="dash-grid">
              <div className="dash-column">
                {/* Pillar Breakdown - Requirement 1.4 */}
                <section className="cw-card">
                  <PillarBreakdown pillarBreakdown={score.pillar_breakdown} />
                </section>

                {/* Validation Flags - Requirement 1.5 */}
                {score.validation_flags && score.validation_flags.length > 0 && (
                  <section className="cw-card">
                    <ValidationFlags validationFlags={score.validation_flags} />
                  </section>
                )}
              </div>

              <div className="dash-column">
                {/* Recommendations - Requirement 1.6 */}
                <section className="cw-card">
                  <h3 className="cw-card-title">Your next steps</h3>
                  <Recommendations recommendations={score.recommendations} />
                </section>

                <BusinessTeaser
                  status={businessStatus}
                  result={businessResult}
                  onOpen={() => showView('business')}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
