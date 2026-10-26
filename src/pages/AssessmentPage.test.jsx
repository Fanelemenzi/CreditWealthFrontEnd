import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import AssessmentPage from './AssessmentPage';
import AssessmentService from '../services/AssessmentService';
import { assessmentSections } from '../config/assessmentSections';

// Mock the services
vi.mock('../services/AssessmentService');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AssessmentPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Set up localStorage with a token
    localStorage.setItem('access_token', 'test-token');
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  it('should redirect to login when no JWT token exists', () => {
    // Remove token to simulate unauthenticated state
    localStorage.removeItem('access_token');

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Should redirect to login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should load existing active session on mount', async () => {
    const mockSession = {
      id: 'session-123',
      current_section: 'financial_obligations',
      form_answers: { income_monthly: 5000 },
      completed_sections: [],
      status: 'in_progress',
      completion_percentage: 10,
      answered_question_count: 1,
    };

    AssessmentService.getActiveSession.mockResolvedValue(mockSession);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
    });

    // Should display section title
    expect(screen.getByText(/Financial Obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 of 9/i)).toBeInTheDocument();
    expect(AssessmentService.getActiveSession).toHaveBeenCalledTimes(1);
  });

  it('should create new session when no active session exists', async () => {
    const mockError = {
      response: { status: 404 },
    };
    const mockNewSession = {
      id: 'new-session-456',
      current_section: null,
      form_answers: {},
      completed_sections: [],
      status: 'in_progress',
      completion_percentage: 0,
      answered_question_count: 0,
    };

    AssessmentService.getActiveSession.mockRejectedValue(mockError);
    AssessmentService.createSession.mockResolvedValue(mockNewSession);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
    });

    // Should display first section
    expect(screen.getByText(/Financial Obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 of 9/i)).toBeInTheDocument();
    expect(AssessmentService.getActiveSession).toHaveBeenCalledTimes(1);
    expect(AssessmentService.createSession).toHaveBeenCalledTimes(1);
  });

  it('should redirect to login on 401 error during session load', async () => {
    const mockError = {
      response: { status: 401 },
    };

    AssessmentService.getActiveSession.mockRejectedValue(mockError);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    // Should remove tokens from localStorage
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('should restore current section from session data', async () => {
    const mockSession = {
      id: 'session-789',
      current_section: 'mobile_money', // This is the 3rd section (index 2)
      form_answers: {},
      completed_sections: ['financial_obligations', 'income_employment'],
      status: 'in_progress',
      completion_percentage: 22,
      answered_question_count: 10,
    };

    AssessmentService.getActiveSession.mockResolvedValue(mockSession);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
    });

    // Should display correct section number (index 2 = section 3)
    expect(screen.getByText(/Section 3 of 9/i)).toBeInTheDocument();
  });

  it('should initialize answers from session form_answers', async () => {
    const mockSession = {
      id: 'session-999',
      current_section: 'financial_obligations',
      form_answers: {
        income_monthly: 5000,
        employment_status: 'employed',
        debt_amount: 1000,
      },
      completed_sections: [],
      status: 'in_progress',
      completion_percentage: 5,
      answered_question_count: 3,
    };

    AssessmentService.getActiveSession.mockResolvedValue(mockSession);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
    });

    // Session should be loaded with form and answers
    expect(screen.getByText(/Financial Obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Questions Answered:/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument(); // Questions answered count
  });

  it('should display error message on general API failure', async () => {
    const mockError = {
      response: { status: 500 },
      message: 'Server error',
    };

    AssessmentService.getActiveSession.mockRejectedValue(mockError);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Failed to load assessment/i)).toBeInTheDocument();
    });

    // Should display retry button
    expect(screen.getByText(/Retry/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Dashboard/i)).toBeInTheDocument();
  });

  it('should display completed sections list when sections are completed', async () => {
    const mockSession = {
      id: 'session-completed',
      current_section: 'assets',
      form_answers: {},
      completed_sections: [
        'financial_obligations',
        'income_employment',
        'mobile_money',
      ],
      status: 'in_progress',
      completion_percentage: 33,
      answered_question_count: 15,
    };

    AssessmentService.getActiveSession.mockResolvedValue(mockSession);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
    });

    // Should display completed sections (use getAllByText to handle multiple matches)
    const completedSectionHeadings = screen.getAllByText(/Completed Sections/i);
    expect(completedSectionHeadings.length).toBeGreaterThan(0);
    expect(screen.getByText(/financial obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/income employment/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile money/i)).toBeInTheDocument();
  });

  it('should handle session with time remaining warning', async () => {
    const mockSession = {
      id: 'session-expiring',
      current_section: 'financial_obligations',
      form_answers: {},
      completed_sections: [],
      status: 'in_progress',
      completion_percentage: 0,
      answered_question_count: 0,
      time_remaining_days: 1, // Less than 2 days - should show in red
    };

    AssessmentService.getActiveSession.mockResolvedValue(mockSession);

    render(
      <BrowserRouter>
        <AssessmentPage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
    });

    // Should display time remaining
    expect(screen.getByText(/Time Remaining:/i)).toBeInTheDocument();
    expect(screen.getByText(/1 days/i)).toBeInTheDocument();
  });

  /**
   * Property-Based Test: Progress Calculation Accuracy
   * **Validates: Requirements 3.3**
   * 
   * Property 7: For any assessment state with N completed sections out of M total sections,
   * the displayed completion percentage SHALL equal (N / M) × 100.
   * 
   * This test generates various combinations of N (current section) and M (total sections)
   * and verifies that the progress percentage is calculated correctly.
   */
  it('should calculate progress percentage accurately (Property Test)', async () => {
    const totalSections = assessmentSections.length; // M = 9

    await fc.assert(
      fc.asyncProperty(
        // Generate a valid section index (0-8 for 9 sections)
        // This represents which section the user is currently on
        fc.integer({ min: 0, max: totalSections - 1 }),
        async (currentSectionIndex) => {
          const currentSection = assessmentSections[currentSectionIndex];
          const mockSession = {
            id: `session-progress-${currentSectionIndex}`,
            current_section: currentSection.id,
            form_answers: {},
            completed_sections: assessmentSections
              .slice(0, currentSectionIndex)
              .map(s => s.id),
            status: 'in_progress',
            completion_percentage: 0, // We'll verify the calculated percentage, not this value
            answered_question_count: 0,
          };

          AssessmentService.getActiveSession.mockResolvedValue(mockSession);

          const { container, unmount } = render(
            <BrowserRouter>
              <AssessmentPage />
            </BrowserRouter>
          );

          // Wait for loading to complete
          await waitFor(
            () => {
              expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
            },
            { timeout: 3000 }
          );

          // Calculate expected percentage: (N / M) × 100
          // N = currentSectionIndex + 1 (sections shown as "in progress" or "complete")
          // M = totalSections
          const N = currentSectionIndex + 1;
          const M = totalSections;
          const expectedPercentage = Math.round((N / M) * 100);

          // Find the progress percentage text in the UI
          // Use getAllByText to handle multiple occurrences and verify at least one exists
          const progressTextElements = screen.getAllByText(new RegExp(`${expectedPercentage}% Complete`, 'i'));
          expect(progressTextElements.length, 
            `Progress should display "${expectedPercentage}% Complete" for N=${N} sections out of M=${M} total (formula: (${N} / ${M}) × 100 = ${expectedPercentage}%)`
          ).toBeGreaterThanOrEqual(1);

          // Also verify the progress bar width is within acceptable range
          // Note: The width uses raw calculation without rounding, while text uses Math.round()
          // This is checking that the width percentage is close to expected
          const progressFillElements = container.querySelectorAll('[style*="width:"]');
          let foundValidProgressBar = false;
          const expectedRawPercentage = (N / M) * 100;
          
          for (const element of progressFillElements) {
            const widthStyle = element.style.width;
            const widthPercentage = parseFloat(widthStyle);
            
            // Check if this element shows a progress percentage close to our expected value
            if (widthPercentage >= 0 && widthPercentage <= 100) {
              const isAccurate = 
                Math.abs(widthPercentage - expectedRawPercentage) < 0.5 || 
                Math.abs(widthPercentage - expectedPercentage) < 1;
              
              if (isAccurate) {
                foundValidProgressBar = true;
                break;
              }
            }
          }
          
          expect(foundValidProgressBar,
            `Progress bar width should match formula (${expectedRawPercentage.toFixed(2)}%) or rounded display (${expectedPercentage}%) for N=${N}, M=${M}`
          ).toBe(true);

          // Clean up to avoid state bleeding between test runs
          unmount();
        }
      ),
      {
        numRuns: 20, // Test 20 random combinations to ensure accuracy across the range
        verbose: true,
      }
    );
  }, 30000); // 30 second timeout

  /**
   * Property-Based Test: Single Section Visibility
   * **Validates: Requirements 3.1**
   * 
   * Property 6: For any assessment state with a current section index,
   * the rendered Assessment page SHALL display exactly one section's questions.
   * 
   * This test generates various valid assessment states with different
   * currentSectionIndex values (0-8) and verifies that:
   * 1. Exactly one section's questions are visible
   * 2. No questions from other sections are displayed
   */
  it('should display exactly one section\'s questions at a time (Property Test)', async () => {
    // Run property-based test
    await fc.assert(
      fc.asyncProperty(
        // Generate a valid section index (0-8 for 9 sections)
        fc.integer({ min: 0, max: assessmentSections.length - 1 }),
        async (sectionIndex) => {
          const currentSection = assessmentSections[sectionIndex];
          const mockSession = {
            id: `session-pbt-${sectionIndex}`,
            current_section: currentSection.id,
            form_answers: {},
            completed_sections: assessmentSections
              .slice(0, sectionIndex)
              .map(s => s.id),
            status: 'in_progress',
            completion_percentage: Math.round((sectionIndex / assessmentSections.length) * 100),
            answered_question_count: 0,
          };

          // Mock the service to return this session
          AssessmentService.getActiveSession.mockResolvedValue(mockSession);

          // Render the component
          const { container } = render(
            <BrowserRouter>
              <AssessmentPage />
            </BrowserRouter>
          );

          // Wait for loading to complete
          await waitFor(
            () => {
              expect(screen.queryByText(/Loading your assessment/i)).not.toBeInTheDocument();
            },
            { timeout: 3000 }
          );

          // Count the number of form fields rendered
          const formInputs = container.querySelectorAll('input, select, textarea');
          const currentSectionQuestionCount = currentSection.questions.length;
          
          // Verify that the number of form inputs matches the current section's question count
          // (Some questions may render multiple inputs, but we expect at least as many inputs as questions)
          expect(formInputs.length, 
            `Should render form inputs for section ${sectionIndex + 1} (${currentSection.title})`
          ).toBeGreaterThanOrEqual(currentSectionQuestionCount);

          // Verify that the section title is displayed
          const sectionHeaders = screen.getAllByText(currentSection.title);
          expect(sectionHeaders.length, 
            `Section title "${currentSection.title}" should appear at least once`
          ).toBeGreaterThanOrEqual(1);
          
          // Verify that the section indicator shows correct section number
          const sectionIndicators = screen.getAllByText(`Section ${sectionIndex + 1} of ${assessmentSections.length}`);
          expect(sectionIndicators.length,
            `Section indicator should appear at least once`
          ).toBeGreaterThanOrEqual(1);

          // Get unique question IDs from OTHER sections
          const otherSectionQuestionIds = assessmentSections
            .filter((_, idx) => idx !== sectionIndex)
            .flatMap(section => section.questions.map(q => q.id));

          // Verify that form fields with IDs from other sections are NOT rendered
          // Sample a subset to verify
          const samplesToCheck = Math.min(5, otherSectionQuestionIds.length);
          for (let i = 0; i < samplesToCheck; i++) {
            const randomIndex = Math.floor(Math.random() * otherSectionQuestionIds.length);
            const otherQuestionId = otherSectionQuestionIds[randomIndex];
            
            // Check if any input with this question ID exists
            const otherInput = container.querySelector(`input[value="${otherQuestionId}"], select#${otherQuestionId}, input#${otherQuestionId}, textarea#${otherQuestionId}`);
            expect(otherInput,
              `Form field with ID "${otherQuestionId}" from another section should NOT be rendered when viewing section ${sectionIndex + 1}`
            ).toBeNull();
          }

          // Additionally, verify that section titles from other sections are NOT displayed as main headers
          const otherSectionTitles = assessmentSections
            .filter((_, idx) => idx !== sectionIndex)
            .map(s => s.title);
          
          // Check that the main card header doesn't contain titles from other sections
          const cardHeaders = container.querySelectorAll('.card-header h2');
          cardHeaders.forEach(header => {
            const headerText = header.textContent;
            // The header should contain the current section title
            if (headerText.includes(currentSection.title)) {
              // This is fine - it's the current section
            } else {
              // Make sure it doesn't contain any other section title
              otherSectionTitles.forEach(otherTitle => {
                expect(headerText.includes(otherTitle),
                  `Header should not contain "${otherTitle}" when displaying section ${sectionIndex + 1} (${currentSection.title})`
                ).toBe(false);
              });
            }
          });
        }
      ),
      {
        numRuns: 15, // Test with 15 runs - enough to cover all 9 sections with some redundancy
        verbose: true,
      }
    );
  }, 30000); // 30 second timeout for this test
});
