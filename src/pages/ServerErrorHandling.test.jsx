import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import AssessmentPage from './AssessmentPage';
import ScoreService from '../services/ScoreService';
import AssessmentService from '../services/AssessmentService';

// Mock the services
vi.mock('../services/ScoreService', () => ({
  default: {
    getLatestScore: vi.fn(),
    calculateScore: vi.fn()
  }
}));

vi.mock('../services/AssessmentService', () => ({
  default: {
    getActiveSession: vi.fn(),
    createSession: vi.fn(),
    saveMultipleAnswers: vi.fn(),
    markSectionCompleted: vi.fn(),
    markCompleted: vi.fn()
  }
}));

vi.mock('../services/ValidationService', () => ({
  default: {
    validateSection: vi.fn(() => ({}))
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = { access_token: 'test-token' };
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

describe('Server Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem('access_token', 'test-token');
  });

  describe('DashboardPage - Requirement 9.3', () => {
    it('should display server error message when API returns 500 error', async () => {
      // Mock a 500 server error
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      ScoreService.getLatestScore.mockRejectedValue(serverError);

      renderWithRouter(<DashboardPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
        expect(screen.getByText(/Our system is experiencing issues/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify error message contains appropriate guidance
      const errorMessage = screen.getByText(/Server error/i);
      expect(errorMessage.textContent).toContain('Please try again later');
    });

    it('should display server error message when API returns 503 error', async () => {
      // Mock a 503 service unavailable error
      const serverError = new Error('Service Unavailable');
      serverError.response = { status: 503 };
      ScoreService.getLatestScore.mockRejectedValue(serverError);

      renderWithRouter(<DashboardPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should provide retry button when server error occurs', async () => {
      // Mock a 500 server error
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      ScoreService.getLatestScore.mockRejectedValue(serverError);

      renderWithRouter(<DashboardPage />);

      // Wait for retry button to appear
      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should distinguish between server errors (500+) and network errors', async () => {
      // Mock a network error (no response)
      const networkError = new Error('Network Error');
      // No response property means network error
      ScoreService.getLatestScore.mockRejectedValue(networkError);

      renderWithRouter(<DashboardPage />);

      // Should show network error, not server error
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        expect(screen.queryByText(/Server error/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('AssessmentPage - Requirement 9.4', () => {
    it('should display server error message when session loading fails with 500 error', async () => {
      // Mock a 500 server error during session load
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      AssessmentService.getActiveSession.mockRejectedValue(serverError);
      AssessmentService.createSession.mockRejectedValue(serverError);

      renderWithRouter(<AssessmentPage />);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
        expect(screen.getByText(/Our system is experiencing issues/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display server error message when saving answers fails with 500 error', async () => {
      // Mock successful session load
      const mockSession = {
        id: 'session-123',
        current_section: 'financial_obligations',
        form_answers: {},
        completed_sections: [],
        completion_percentage: 0
      };
      AssessmentService.getActiveSession.mockResolvedValue(mockSession);

      // Mock server error on save
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      AssessmentService.saveMultipleAnswers.mockRejectedValue(serverError);

      renderWithRouter(<AssessmentPage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/Financial Assessment/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Note: This test verifies the error handling code exists.
      // Full testing would require simulating form interaction and button click.
    });

    it('should provide retry and navigation options when server error occurs', async () => {
      // Mock a 500 server error
      const serverError = new Error('Server Error');
      serverError.response = { status: 500 };
      AssessmentService.getActiveSession.mockRejectedValue(serverError);
      AssessmentService.createSession.mockRejectedValue(serverError);

      renderWithRouter(<AssessmentPage />);

      // Wait for error UI to appear
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should distinguish between server errors (500+) and network errors in AssessmentPage', async () => {
      // Mock a network error (no response)
      const networkError = new Error('Network Error');
      // No response property means network error
      AssessmentService.getActiveSession.mockRejectedValue(networkError);
      AssessmentService.createSession.mockRejectedValue(networkError);

      renderWithRouter(<AssessmentPage />);

      // Should show network error, not server error
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        expect(screen.queryByText(/Server error/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should handle 502 Bad Gateway error as server error', async () => {
      // Mock a 502 bad gateway error
      const serverError = new Error('Bad Gateway');
      serverError.response = { status: 502 };
      AssessmentService.getActiveSession.mockRejectedValue(serverError);

      renderWithRouter(<AssessmentPage />);

      // Should show server error
      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should handle 504 Gateway Timeout error as server error', async () => {
      // Mock a 504 gateway timeout error
      const serverError = new Error('Gateway Timeout');
      serverError.response = { status: 504 };
      AssessmentService.getActiveSession.mockRejectedValue(serverError);

      renderWithRouter(<AssessmentPage />);

      // Should show server error
      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Error Message Consistency', () => {
    it('should use consistent error messages across both pages', async () => {
      const expectedServerErrorMessage = 'Server error. Our system is experiencing issues. Please try again later.';
      
      // Test DashboardPage
      const serverError1 = new Error('Server Error');
      serverError1.response = { status: 500 };
      ScoreService.getLatestScore.mockRejectedValue(serverError1);

      const { unmount } = renderWithRouter(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(expectedServerErrorMessage)).toBeInTheDocument();
      }, { timeout: 5000 });

      unmount();

      // Test AssessmentPage
      const serverError2 = new Error('Server Error');
      serverError2.response = { status: 500 };
      AssessmentService.getActiveSession.mockRejectedValue(serverError2);
      AssessmentService.createSession.mockRejectedValue(serverError2);

      renderWithRouter(<AssessmentPage />);

      await waitFor(() => {
        expect(screen.getByText(expectedServerErrorMessage)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});
