import apiClient from './apiClient.js';

/**
 * ScoreService handles all score-related API operations
 * 
 * This service provides methods to:
 * - Fetch the latest calculated credit score
 * - Trigger new score calculations
 */
class ScoreService {
  /**
   * Fetch the latest calculated credit score for the authenticated user
   * 
   * @returns {Promise<Object>} Score data object containing:
   *   - composite_score: number (300-850)
   *   - score_band: string ('poor' | 'weak' | 'fair' | 'good' | 'excellent')
   *   - score_band_display: string
   *   - calculated_at: string (ISO timestamp)
   *   - pillar_scores: object with scores for all 9 pillars
   *   - pillar_breakdown: object with detailed pillar information
   *   - validation_flags: array of validation warnings
   *   - recommendations: array of score improvement recommendations
   *   - honesty_bonus: number
   *   - validation_adjustment: number
   *   - is_sufficient_data: boolean
   *   - missing_sections: array of strings
   *   - score_id: string
   * 
   * @throws {Error} 404 if no score exists for the user
   * @throws {Error} 401 if authentication fails (handled by interceptor)
   * @throws {Error} Network or server errors
   * 
   * Validates Requirements: 1.1, 1.2, 1.3, 1.4, 6.3
   */
  async getLatestScore() {
    const response = await apiClient.get('/api/score-calculation/latest/');
    return response.data.score;
  }

  /**
   * Trigger a new credit score calculation for the authenticated user
   * 
   * This method initiates the score calculation process based on the user's
   * completed assessment data. The calculation considers all nine financial
   * pillars with their respective weights.
   * 
   * @returns {Promise<Object>} Newly calculated score data with same structure as getLatestScore()
   * 
   * @throws {Error} 400 if insufficient assessment data exists
   * @throws {Error} 401 if authentication fails (handled by interceptor)
   * @throws {Error} Network or server errors
   * 
   * Validates Requirements: 1.1, 1.2, 1.3, 1.4, 6.3
   */
  async calculateScore() {
    const response = await apiClient.post('/api/score-calculation/calculate/');
    return response.data.score;
  }
}

// Export a singleton instance
export default new ScoreService();
