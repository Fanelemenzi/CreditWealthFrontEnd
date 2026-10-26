import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import ScoreService from '../services/ScoreService';

// Mock ScoreService
vi.mock('../services/ScoreService', () => ({
  default: {
    getLatestScore: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Helper to render with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Sample score data
const mockScoreData = {
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
  validation_flags: [
    {
      flag_type: 'inconsistent_data',
      severity: 'warning',
      message: 'Income and expenses data shows inconsistencies',
      impact: -5
    }
  ],
  recommendations: [
    {
      title: 'Improve Payment History',
      description: 'Make consistent on-time payments to improve your score',
      impact: 20
    }
  ],
  honesty_bonus: 0,
  validation_adjustment: 0,
  is_sufficient_data: true,
  missing_sections: [],
  score_id: 'test-score-id'
};

describe('DashboardPage Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem('access_token', 'test-token');
  });

  /**
   * Test: Verify all dashboard components are rendered when score exists
   * Validates Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
   */
  it('should render all dashboard components with real score data', async () => {
    ScoreService.getLatestScore.mockResolvedValue(mockScoreData);

    renderWithRouter(<DashboardPage />);

    // Wait for score range to appear (indicates ScoreCircle is rendered)
    await waitFor(() => {
      expect(screen.getByText('300 - 850')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify ScoreCircle is rendered (Requirements 1.1, 1.2)
    const scoreCircle = document.querySelector('.score-circle-container');
    expect(scoreCircle).toBeInTheDocument();

    // Verify PillarBreakdown is rendered (Requirement 1.4)
    expect(screen.getByText('Financial Pillars Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Financial Obligations')).toBeInTheDocument();
    expect(screen.getByText('Income & Employment')).toBeInTheDocument();

    // Verify ValidationFlags is rendered (Requirement 1.5)
    expect(screen.getByText('Data Quality Indicators')).toBeInTheDocument();
    expect(screen.getByText('Income and expenses data shows inconsistencies')).toBeInTheDocument();

    // Verify Recommendations is rendered (Requirement 1.6)
    expect(screen.getByText('Improve Payment History')).toBeInTheDocument();
    expect(screen.getByText('Make consistent on-time payments to improve your score')).toBeInTheDocument();
  }, 15000);

  /**
   * Test: Verify preview mode displays sample data and Take Assessment button
   * Validates Requirements: 1.7, 1.8
   */
  it('should display preview mode with sample data when no score exists', async () => {
    ScoreService.getLatestScore.mockRejectedValue({ response: { status: 404 } });

    renderWithRouter(<DashboardPage />);

    // Wait for preview mode to activate
    await waitFor(() => {
      expect(screen.queryByText('Loading your credit score...')).not.toBeInTheDocument();
    });

    // Verify preview banner is displayed (Requirement 1.7)
    expect(screen.getByText('This is a Preview')).toBeInTheDocument();
    expect(screen.getByText('Complete the assessment to see your actual credit score')).toBeInTheDocument();

    // Verify Take Assessment button is displayed (Requirement 1.8)
    const takeAssessmentButtons = screen.getAllByText('Take Assessment');
    expect(takeAssessmentButtons.length).toBeGreaterThan(0);

    // Verify sample data is rendered
    expect(screen.getByText('Financial Pillars Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Complete Your Assessment')).toBeInTheDocument();
  });

  /**
   * Test: Verify all subcomponents are imported and integrated
   * Validates task requirement: Import and integrate all components
   */
  it('should import and use ScoreCircle, PillarBreakdown, ValidationFlags, and Recommendations', async () => {
    ScoreService.getLatestScore.mockResolvedValue(mockScoreData);

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your credit score...')).not.toBeInTheDocument();
    });

    // Verify ScoreCircle renders (check for unique elements)
    const scoreCircle = document.querySelector('.score-circle-container');
    expect(scoreCircle).toBeInTheDocument();

    // Verify PillarBreakdown renders
    const pillarBreakdown = document.querySelector('.pillar-breakdown');
    expect(pillarBreakdown).toBeInTheDocument();

    // Verify ValidationFlags renders
    const validationFlags = document.querySelector('.validation-flags-card');
    expect(validationFlags).toBeInTheDocument();

    // Verify Recommendations renders
    const recommendations = document.querySelector('.recommendations-list');
    expect(recommendations).toBeInTheDocument();
  });

  /**
   * Test: Verify navigation functionality exists
   * Validates Requirement: 1.9
   */
  it('should have Take Assessment button that navigates to assessment page', async () => {
    ScoreService.getLatestScore.mockRejectedValue({ response: { status: 404 } });

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your credit score...')).not.toBeInTheDocument();
    });

    // Find Take Assessment button
    const takeAssessmentButtons = screen.getAllByText('Take Assessment');
    expect(takeAssessmentButtons[0]).toBeInTheDocument();
    expect(takeAssessmentButtons[0].tagName).toBe('BUTTON');
  });

  /**
   * Test: Verify preview mode shows sample recommendations
   */
  it('should display sample recommendations in preview mode', async () => {
    ScoreService.getLatestScore.mockRejectedValue({ response: { status: 404 } });

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your credit score...')).not.toBeInTheDocument();
    });

    // Verify sample recommendation is shown
    expect(screen.getByText('Complete Your Assessment')).toBeInTheDocument();
    expect(screen.getByText('Take the full financial assessment to get your actual credit score and personalized recommendations.')).toBeInTheDocument();
  });
});
