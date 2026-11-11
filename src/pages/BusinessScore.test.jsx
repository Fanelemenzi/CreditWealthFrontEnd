import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import AuthService from '../services/AuthService.js';
import ScoreService from '../services/ScoreService';
import BusinessScoreService from '../services/BusinessScoreService';
import { authApiClient } from '../services/apiClient';
import { BUSINESS_PILLARS, BUSINESS_TIERS, SAMPLE_BUSINESS_RESULT, getBusinessTier } from '../config/businessScore';

vi.mock('../services/ScoreService', () => ({
  default: { getLatestScore: vi.fn() },
}));

vi.mock('../services/AuthService.js', () => ({
  default: { signin: vi.fn(), signup: vi.fn() },
}));

const realResult = {
  id: 'abc',
  status: 'complete',
  final_bvss: 812,
  risk_tier: 'A',
  score_p1: 90,
  score_p2: 85,
  score_p3: 80,
  score_p4: 75,
  score_p5: 70,
  score_p6: 65,
  approved_loan_max: 100800,
  expires_at: '2027-11-06T00:00:00Z',
  improvement_tips: [{ pillar: 'Repayment capacity (P6)', current_score: 65, advice: 'Build a buffer.' }],
};

const renderDashboard = (path = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <DashboardPage />
    </MemoryRouter>
  );

describe('Business score on the dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem('access_token', 'test-token');
    window.scrollTo = vi.fn();
    ScoreService.getLatestScore.mockRejectedValue({ response: { status: 404 } });
  });

  it('opens on the personal score, with the business score one click away', async () => {
    vi.spyOn(BusinessScoreService, 'getLatestResult').mockResolvedValue(null);
    renderDashboard();

    expect(await screen.findByText('Your Credit Health')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Business Viability Score' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Business' }));
    expect(screen.getByRole('heading', { name: 'Business Viability Score' })).toBeInTheDocument();
  });

  it('labels the report as a sample when there is no result', async () => {
    vi.spyOn(BusinessScoreService, 'getLatestResult').mockResolvedValue(null);
    renderDashboard('/dashboard?view=business');

    expect(await screen.findByText('Sample data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Business assessment opening soon' })).toBeDisabled();
  });

  it('shows a real result without any sample labelling', async () => {
    vi.spyOn(BusinessScoreService, 'getLatestResult').mockResolvedValue(realResult);
    renderDashboard('/dashboard?view=business');

    expect(await screen.findByText('812')).toBeInTheDocument();
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument();
    expect(screen.getByText('Your tier')).toBeInTheDocument();
  });

  it('shows the in-progress state without a score or fraud review details', async () => {
    vi.spyOn(BusinessScoreService, 'getLatestResult').mockResolvedValue({ pending: true, status: 'flagged' });
    renderDashboard('/dashboard?view=business');

    expect(await screen.findByText('Your business score is being prepared')).toBeInTheDocument();
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument();
    expect(screen.queryByText(/flagged/i)).not.toBeInTheDocument();
  });

  it('keeps the personal score working when the business lookup fails', async () => {
    vi.spyOn(BusinessScoreService, 'getLatestResult').mockRejectedValue(new Error('Network Error'));
    renderDashboard();

    expect(await screen.findByText('Your Credit Health')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Run a business?')).toBeInTheDocument());
  });
});

describe('BusinessScoreService', () => {
  beforeEach(() => vi.restoreAllMocks());

  const respondWith = (data) => vi.spyOn(authApiClient, 'get').mockResolvedValue({ status: 200, data });

  it('reads the list of assessments', async () => {
    const get = respondWith([]);
    await BusinessScoreService.getLatestResult();
    expect(get).toHaveBeenCalledWith('/api/assessments/');
  });

  it('returns null when the owner has no assessment', async () => {
    respondWith([]);
    await expect(BusinessScoreService.getLatestResult()).resolves.toBeNull();
  });

  it('ignores drafts', async () => {
    respondWith([{ id: 'a', status: 'draft' }]);
    await expect(BusinessScoreService.getLatestResult()).resolves.toBeNull();
  });

  it.each(['submitted', 'scoring', 'flagged'])('reports %s assessments as pending, without scores', async (status) => {
    respondWith([{ id: 'a', status, final_bvss: '700.00', risk_tier: 'B' }]);
    await expect(BusinessScoreService.getLatestResult()).resolves.toEqual({ pending: true, status });
  });

  it('uses the newest assessment from a paginated response and converts decimal strings', async () => {
    respondWith({
      count: 2,
      results: [
        { id: 'new', status: 'complete', final_bvss: '812.50', score_p1: '90.00', expires_at: null },
        { id: 'old', status: 'complete', final_bvss: '500.00' },
      ],
    });
    const result = await BusinessScoreService.getLatestResult();
    expect(result.id).toBe('new');
    expect(result.final_bvss).toBe(812.5);
    expect(result.score_p1).toBe(90);
  });

  it('rethrows other errors so the dashboard can report them', async () => {
    vi.spyOn(authApiClient, 'get').mockRejectedValue({ response: { status: 500 } });
    await expect(BusinessScoreService.getLatestResult()).rejects.toEqual({ response: { status: 500 } });
  });
});

describe('Business score config', () => {
  it('has pillar weights that sum to 100', () => {
    expect(BUSINESS_PILLARS.reduce((sum, pillar) => sum + pillar.weight, 0)).toBe(100);
  });

  it('maps boundary and decimal scores to the right tier', () => {
    expect(getBusinessTier(1000).id).toBe('A');
    expect(getBusinessTier(800).id).toBe('A');
    expect(getBusinessTier(799.5).id).toBe('B');
    expect(getBusinessTier(349.9).id).toBe('E');
    expect(getBusinessTier(0).id).toBe('E');
    expect(BUSINESS_TIERS).toHaveLength(5);
  });

  it('has a sample result that matches the published weights and tier', () => {
    const weighted = BUSINESS_PILLARS.reduce(
      (sum, pillar) => sum + SAMPLE_BUSINESS_RESULT[pillar.key] * pillar.weight,
      0
    ) / 10;
    expect(weighted).toBeCloseTo(SAMPLE_BUSINESS_RESULT.final_bvss);
    expect(getBusinessTier(weighted).id).toBe(SAMPLE_BUSINESS_RESULT.risk_tier);
  });
});

describe('LandingPage', () => {
  it('leads with the personal score and supports it with the business score', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Know your credit score');
    expect(screen.getByRole('heading', { name: 'Business Viability Score' })).toBeInTheDocument();
    expect(screen.getByText('Sample')).toBeInTheDocument();
  });

  it('returns signed-out visitors to the business view after login', async () => {
    localStorage.removeItem('access_token');
    AuthService.signin.mockResolvedValue({});
    const ShowLocation = () => {
      const location = useLocation();
      return <p>At {location.pathname}{location.search}</p>;
    };

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ShowLocation />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Explore the business score' }));
    await userEvent.type(screen.getByLabelText('Phone Number'), '+26878123456');
    await userEvent.type(screen.getByLabelText('Password'), 'test-password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('At /dashboard?view=business')).toBeInTheDocument();
  });
});
