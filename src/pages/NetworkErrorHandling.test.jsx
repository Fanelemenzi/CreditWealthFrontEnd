import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import AssessmentPage from './AssessmentPage';
import ScoreService from '../services/ScoreService';
import AssessmentService from '../services/AssessmentService';

// Mock the services
vi.mock('../services/ScoreService');
vi.mock('../services/AssessmentService');
vi.mock('../services/ValidationService');
vi.mock('../config/assessmentSections', () => ({
  assessmentSections: [
    {
      id: 'test_section',
      title: 'Test Section',
      weight: 100,
      questions: [
        {
          id: 'test_question',
          type: 'text',
          label: 'Test Question',
          required: true
        }
      ]
    }
  ],
  getSectionByIndex: (index) => ({
    id: 'test_section',
    title: 'Test Section',
    weight: 100,
    questions: [
      {
        id: 'test_question',
        type: 'text',
        label: 'Test Question',
        required: true
      }
    ]
  })
}));

// Helper to render with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Network Error Handling', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn((key) => {
        if (key === 'access_token') return 'mock-token';
        return null;
      }),
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  describe('DashboardPage', () => {
    it('should display network error message when API request fails without response', async () => {
      // Simulate network error (no response object)
      const networkError = new Error('Network Error');
      networkError.response = undefined;
      
      ScoreService.getLatestScore.mockRejectedValue(networkError);

      renderWithRouter(<DashboardPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Network error. Please check your connection and try again./i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display generic error for server errors with response', async () => {
      // Simulate server error (has response object)
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      
      ScoreService.getLatestScore.mockRejectedValue(serverError);

      renderWithRouter(<DashboardPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Failed to load credit score. Please try again later./i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('AssessmentPage', () => {
    it('should display network error message when session load fails without response', async () => {
      // Simulate network error (no response object)
      const networkError = new Error('Network Error');
      networkError.response = undefined;
      
      AssessmentService.getActiveSession.mockRejectedValue(networkError);

      renderWithRouter(<AssessmentPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Network error. Please check your connection and try again./i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display generic error for server errors with response', async () => {
      // Simulate server error (has response object)
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      
      AssessmentService.getActiveSession.mockRejectedValue(serverError);

      renderWithRouter(<AssessmentPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Failed to load assessment. Please try again./i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});
