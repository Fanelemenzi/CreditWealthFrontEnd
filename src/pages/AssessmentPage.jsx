import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentService from '../services/AssessmentService';
import ValidationService from '../services/ValidationService';
import ScoreService from '../services/ScoreService';
import { assessmentSections, getSectionByIndex } from '../config/assessmentSections';
import '../styles/AssessmentPage.css';

/**
 * AssessmentPage - Multi-step financial assessment wizard
 * 
 * Features:
 * - Authentication check on mount
 * - Load or create assessment session
 * - Multi-step form navigation
 * - Session state management
 * - Progress tracking
 * 
 * Validates Requirements: 3.1, 5.1, 5.2, 5.3, 5.4, 10.2, 10.4
 */
const AssessmentPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [session, setSession] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication on mount (Requirement 5.1, 10.2)
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login if no token (Requirement 10.4)
      navigate('/login');
      return;
    }

    // Load or create assessment session
    loadSession();
  }, [navigate]);

  /**
   * Load existing session or create new one
   * Handles session retrieval and restoration of progress
   * 
   * Validates Requirements: 5.2, 5.3, 5.4, 9.2
   */
  const loadSession = async () => {
    try {
      setLoading(true);
      setError(null);

      let sessionData;
      
      try {
        // Try to retrieve active session (Requirement 5.2)
        sessionData = await AssessmentService.getActiveSession();
      } catch (err) {
        if (err.response?.status === 404) {
          // No active session exists, create new one (Requirement 5.3)
          sessionData = await AssessmentService.createSession({
            session_name: 'Credit Assessment',
            device_type: 'desktop',
            user_agent: navigator.userAgent
          });
        } else if (err.response?.status === 401) {
          // Authentication failed - redirect to login (Requirement 5.6)
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
          return;
        } else {
          throw err;
        }
      }

      // Set session data
      setSession(sessionData);

      // Restore progress: set current section based on saved progress (Requirement 5.4)
      if (sessionData.current_section) {
        // Map section name to index
        const sectionIndex = getSectionIndexFromName(sessionData.current_section);
        setCurrentSectionIndex(sectionIndex >= 0 ? sectionIndex : 0);
      } else {
        setCurrentSectionIndex(0);
      }

      // Initialize answers from session (Requirement 5.4)
      if (sessionData.form_answers) {
        setAnswers(sessionData.form_answers);
      }

    } catch (err) {
      console.error('Error loading session:', err);
      if (err.response?.status === 401) {
        // Handle 401 during session operations (Requirement 5.6)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else if (!err.response) {
        // Network error - no response from server (Requirement 9.2)
        setError('Network error. Please check your connection and try again.');
      } else if (err.response?.status >= 500) {
        // Server error - 500-level status codes (Requirement 9.4)
        setError('Server error. Our system is experiencing issues. Please try again later.');
      } else {
        setError('Failed to load assessment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Map section name to index
   * Helper function to convert backend section names to array indices
   */
  const getSectionIndexFromName = (sectionName) => {
    return assessmentSections.findIndex(section => section.id === sectionName);
  };

  /**
   * Validate the current section's required fields
   * Returns validation errors object (empty if valid)
   * 
   * Validates Requirements: 4.1, 4.3
   */
  const validateSection = () => {
    const currentSection = getSectionByIndex(currentSectionIndex);
    if (!currentSection) {
      return {};
    }

    const sectionErrors = ValidationService.validateSection(
      currentSection.questions,
      answers
    );

    return sectionErrors;
  };

  /**
   * Save current section answers and advance to next section
   * Handles validation, API calls, and state updates
   * 
   * Validates Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7, 9.2
   */
  const saveAndAdvance = async () => {
    // Validate current section (Requirement 4.1)
    const validationErrors = validateSection();
    
    // If validation fails, display errors and prevent navigation (Requirements 4.2, 4.3)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.error-message');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // Clear any previous errors
    setErrors({});

    try {
      setSubmitting(true);
      
      const currentSection = getSectionByIndex(currentSectionIndex);
      
      // Collect answers for current section questions
      const sectionAnswers = {};
      currentSection.questions.forEach(question => {
        if (answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== '') {
          sectionAnswers[question.id] = answers[question.id];
        }
      });

      // Save section answers to backend (Requirement 4.4)
      await AssessmentService.saveMultipleAnswers(session.id, sectionAnswers);
      
      // Mark section as completed
      await AssessmentService.markSectionCompleted(session.id, currentSection.id);

      // Advance to next section (Requirement 4.5, 4.7)
      setCurrentSectionIndex(prev => prev + 1);
      
      // Scroll to top of page for new section
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Error saving section:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else if (!err.response) {
        // Network error - no response from server (Requirement 9.2)
        setError('Network error. Please check your connection and try again.');
      } else if (err.response?.status >= 500) {
        // Server error - 500-level status codes (Requirement 9.4)
        setError('Server error. Our system is experiencing issues. Please try again later.');
      } else {
        setError('Failed to save your answers. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle final section submission and score calculation
   * Validates, saves, marks complete, calculates score, and redirects
   * 
   * Validates Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 9.2
   */
  const handleSubmit = async () => {
    // Validate final section (Requirement 6.1)
    const validationErrors = validateSection();
    
    // If validation fails, display errors and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.error-message');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setErrors({});

    try {
      setSubmitting(true);
      
      const currentSection = getSectionByIndex(currentSectionIndex);
      
      // Collect answers for final section
      const sectionAnswers = {};
      currentSection.questions.forEach(question => {
        if (answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== '') {
          sectionAnswers[question.id] = answers[question.id];
        }
      });

      // Save final section answers (Requirement 6.1)
      await AssessmentService.saveMultipleAnswers(session.id, sectionAnswers);
      
      // Mark section as completed
      await AssessmentService.markSectionCompleted(session.id, currentSection.id);
      
      // Mark entire assessment as completed (Requirement 6.2)
      await AssessmentService.markCompleted(session.id);
      
      // Trigger score calculation (Requirement 6.3)
      await ScoreService.calculateScore();
      
      // Display success message (Requirement 6.4)
      setError(null);
      setSubmitting(false);
      
      // Show success state
      alert('Assessment submitted successfully! Calculating your credit score...');
      
      // Wait 2 seconds (Requirement 6.5)
      setTimeout(() => {
        // Redirect to dashboard (Requirement 6.6)
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error submitting assessment:', err);
      setSubmitting(false);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else if (!err.response) {
        // Network error - no response from server (Requirement 9.2)
        setError('Network error. Please check your connection and try again.');
      } else if (err.response?.status >= 500) {
        // Server error - 500-level status codes (Requirement 9.4)
        setError('Server error. Our system is experiencing issues. Please try again later.');
      } else {
        setError('Failed to submit your assessment. Please try again.');
      }
    }
  };

  /**
   * Handle answer changes for form inputs
   * Updates the answers state
   */
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
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
   * Navigate back to dashboard
   */
  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
            <p>Loading your assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={loadSession} className="btn-primary">Retry</button>
              <button onClick={handleBackToDashboard} className="btn-outline">Back to Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main assessment interface
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
            <button onClick={handleBackToDashboard} className="btn-outline" style={{ marginRight: '1rem' }}>
              Back to Dashboard
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
        {/* Assessment Header */}
        <div className="dashboard-header">
          <div>
            <h1>Financial Assessment</h1>
            <p className="dashboard-subtitle">
              {session && `Session Progress: ${Math.round(session.completion_percentage || 0)}% Complete`}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-outline">
            Logout
          </button>
        </div>

        {/* Assessment Content Area */}
        <div className="dashboard-grid">
          {/* Main Assessment Form */}
          <div className="score-card main-score-card">
            {(() => {
              const currentSection = getSectionByIndex(currentSectionIndex);
              const isLastSection = currentSectionIndex === assessmentSections.length - 1;
              
              return (
                <>
                  <div className="card-header">
                    <div>
                      <h2>{currentSection?.title || 'Assessment'}</h2>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {currentSection?.description}
                      </p>
                    </div>
                    <div className="score-badge" style={{ color: '#4f46e5' }}>
                      Section {currentSectionIndex + 1} of {assessmentSections.length}
                    </div>
                  </div>

                  {/* Section Questions */}
                  <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                      {/* Progress indicator */}
                      <div style={{ 
                        background: '#f3f4f6', 
                        height: '8px', 
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem'
                      }}>
                        <div 
                          style={{ 
                            background: '#4f46e5',
                            height: '100%',
                            width: `${((currentSectionIndex + 1) / assessmentSections.length) * 100}%`,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                        {Math.round(((currentSectionIndex + 1) / assessmentSections.length) * 100)}% Complete
                      </p>
                    </div>

                    {/* Question Fields */}
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                      {currentSection?.questions.map(question => (
                        <div key={question.id} style={{ marginBottom: '1.5rem' }}>
                          <label style={{ 
                            display: 'block',
                            fontWeight: '500',
                            marginBottom: '0.5rem',
                            color: '#111827'
                          }}>
                            {question.label}
                            {question.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
                          </label>
                          
                          {question.helpText && (
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                              {question.helpText}
                            </p>
                          )}

                          {/* Render different input types */}
                          {question.type === 'text' && (
                            <input
                              type="text"
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              placeholder={question.placeholder}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: errors[question.id] ? '1px solid #ef4444' : '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem'
                              }}
                            />
                          )}

                          {question.type === 'number' && (
                            <input
                              type="number"
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              placeholder={question.placeholder}
                              min={question.validation?.min}
                              max={question.validation?.max}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: errors[question.id] ? '1px solid #ef4444' : '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem'
                              }}
                            />
                          )}

                          {question.type === 'select' && (
                            <select
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: errors[question.id] ? '1px solid #ef4444' : '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                background: 'white'
                              }}
                            >
                              <option value="">Select an option</option>
                              {question.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {question.type === 'radio' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {question.options?.map(opt => (
                                <label 
                                  key={opt.value}
                                  style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    background: answers[question.id] === opt.value ? '#eff6ff' : 'white'
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={opt.value}
                                    checked={answers[question.id] === opt.value}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {question.type === 'checkbox' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {question.options?.map(opt => (
                                <label 
                                  key={opt.value}
                                  style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    background: (answers[question.id] || []).includes(opt.value) ? '#eff6ff' : 'white'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={(answers[question.id] || []).includes(opt.value)}
                                    onChange={(e) => {
                                      const currentValues = answers[question.id] || [];
                                      const newValues = e.target.checked
                                        ? [...currentValues, opt.value]
                                        : currentValues.filter(v => v !== opt.value);
                                      handleAnswerChange(question.id, newValues);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {question.type === 'date' && (
                            <input
                              type="date"
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: errors[question.id] ? '1px solid #ef4444' : '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem'
                              }}
                            />
                          )}

                          {/* Error message */}
                          {errors[question.id] && (
                            <p className="error-message" style={{ 
                              color: '#ef4444',
                              fontSize: '0.875rem',
                              marginTop: '0.5rem'
                            }}>
                              {errors[question.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </form>

                    {/* Navigation Buttons */}
                    <div style={{ 
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '2rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      {currentSectionIndex > 0 && (
                        <button
                          onClick={() => {
                            setCurrentSectionIndex(prev => prev - 1);
                            setErrors({});
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          disabled={submitting}
                          className="btn-outline"
                          style={{ minWidth: '120px' }}
                        >
                          Previous
                        </button>
                      )}
                      
                      {/* Show "Next" button for sections 0-7, "Submit" button for section 8 (Requirements 3.11, 3.12) */}
                      {!isLastSection ? (
                        <button
                          onClick={saveAndAdvance}
                          disabled={submitting}
                          className="btn-primary"
                          style={{ minWidth: '120px', marginLeft: 'auto' }}
                        >
                          {submitting ? 'Saving...' : 'Next'}
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="btn-primary"
                          style={{ minWidth: '120px', marginLeft: 'auto' }}
                        >
                          {submitting ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Progress Summary Card */}
          <div className="info-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Progress Overview
            </h3>
            
            {session && (
              <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Current Section:</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {currentSectionIndex + 1} of {assessmentSections.length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Questions Answered:</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {Object.keys(answers).length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Completed Sections:</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {session.completed_sections?.length || 0}
                  </span>
                </div>
                {session.time_remaining_days !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Time Remaining:</span>
                    <span style={{ color: session.time_remaining_days < 2 ? '#ef4444' : '#111827', fontWeight: '500' }}>
                      {session.time_remaining_days} days
                    </span>
                  </div>
                )}
              </div>
            )}

            {session && session.completed_sections && session.completed_sections.length > 0 && (
              <>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
                  Completed Sections
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {session.completed_sections.map((sectionName, index) => (
                    <li 
                      key={index}
                      style={{ 
                        padding: '0.5rem 0.75rem',
                        marginBottom: '0.5rem',
                        background: '#f0fdf4',
                        borderRadius: '0.375rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ color: '#166534', textTransform: 'capitalize' }}>
                        {sectionName.replace(/_/g, ' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
