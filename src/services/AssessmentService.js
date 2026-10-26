import apiClient from './apiClient';

/**
 * AssessmentService
 * 
 * Handles all assessment session and answer management operations.
 * Provides methods for session lifecycle management, answer persistence,
 * and progress tracking.
 */
class AssessmentService {
  /**
   * Retrieve the active assessment session for the current user
   * 
   * @returns {Promise<Object>} The active assessment session data
   * @throws {Error} If no active session exists (404) or other API errors
   * 
   * Response structure:
   * {
   *   id: string,
   *   user: string,
   *   session_name: string,
   *   current_question: number,
   *   current_section: string,
   *   form_answers: object,
   *   completed_sections: array,
   *   skipped_questions: array,
   *   status: 'in_progress' | 'submitted' | 'expired',
   *   start_time: string,
   *   expires_at: string,
   *   completion_percentage: number,
   *   is_expired: boolean,
   *   is_active: boolean,
   *   time_remaining_days: number,
   *   answered_question_count: number
   * }
   * 
   * Validates: Requirements 5.2
   */
  async getActiveSession() {
    const response = await apiClient.get('/api/assessment-sessions/active-session/');
    return response.data;
  }

  /**
   * Create a new assessment session for the current user
   * 
   * @param {Object} sessionData - Optional session configuration
   * @param {string} sessionData.session_name - Name for the session (default: 'Credit Assessment')
   * @param {string} sessionData.device_type - Device type (default: 'desktop')
   * @param {string} sessionData.user_agent - User agent string (default: navigator.userAgent)
   * @returns {Promise<Object>} The newly created session data
   * @throws {Error} If session creation fails
   * 
   * Validates: Requirements 5.3
   */
  async createSession(sessionData = {}) {
    const payload = {
      session_name: sessionData.session_name || 'Credit Assessment',
      device_type: sessionData.device_type || 'desktop',
      user_agent: sessionData.user_agent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'),
      ...sessionData
    };

    const response = await apiClient.post('/api/assessment-sessions/', payload);
    return response.data;
  }

  /**
   * Save a single answer to the assessment session
   * 
   * @param {string} sessionId - The assessment session ID
   * @param {string} questionId - The question identifier
   * @param {any} value - The answer value (can be string, number, array, etc.)
   * @returns {Promise<Object>} The updated session data
   * @throws {Error} If save operation fails
   * 
   * This method is useful for autosave functionality or saving individual
   * answers as the user progresses through the form.
   */
  async saveAnswer(sessionId, questionId, value) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/save_answer/`,
      {
        question_id: questionId,
        answer_value: value
      }
    );
    return response.data;
  }

  /**
   * Save multiple answers in bulk (typically for an entire section)
   * 
   * @param {string} sessionId - The assessment session ID
   * @param {Object} answers - Map of question IDs to answer values
   *                           Example: { 'income_monthly': 5000, 'employment_status': 'employed' }
   * @returns {Promise<Object>} The updated session data
   * @throws {Error} If save operation fails
   * 
   * This method is optimized for saving all answers in a section at once,
   * reducing the number of API calls compared to saving individual answers.
   * 
   * Validates: Requirements 5.5, 6.1
   */
  async saveMultipleAnswers(sessionId, answers) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/save_multiple_answers/`,
      { answers }
    );
    return response.data;
  }

  /**
   * Mark a specific section as completed
   * 
   * @param {string} sessionId - The assessment session ID
   * @param {string} sectionName - The section identifier/name
   * @returns {Promise<Object>} The updated session data
   * @throws {Error} If operation fails
   * 
   * This marks a section as fully completed, which is useful for tracking
   * progress and determining which sections the user has finished.
   */
  async markSectionCompleted(sessionId, sectionName) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/mark_section_completed/`,
      { section_name: sectionName }
    );
    return response.data;
  }

  /**
   * Mark the entire assessment session as completed
   * 
   * @param {string} sessionId - The assessment session ID
   * @returns {Promise<Object>} The finalized session data
   * @throws {Error} If finalization fails
   * 
   * This finalizes the assessment submission, changing the session status
   * to 'submitted' and making it available for score calculation.
   * After this call, the session is no longer active.
   * 
   * Validates: Requirements 6.2
   */
  async markCompleted(sessionId) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/mark_completed/`
    );
    return response.data;
  }
}

// Export a singleton instance
export default new AssessmentService();
