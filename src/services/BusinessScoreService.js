import { authApiClient } from './apiClient.js';

const NUMERIC_FIELDS = [
  'final_bvss',
  'score_p1',
  'score_p2',
  'score_p3',
  'score_p4',
  'score_p5',
  'score_p6',
  'approved_loan_max',
];

// Statuses with a final result, matching what the single-result endpoint serves.
const RESULT_STATUSES = ['verified', 'complete'];

/**
 * BusinessScoreService reads the owner's Business Viability Score (BVSS).
 */
class BusinessScoreService {
  /**
   * @returns {Promise<Object|null>} null when the owner has no submitted
   *   assessment. While scoring or review is under way, { pending: true, status },
   *   with no scores, because a held assessment's figures must not be shown.
   *   Otherwise the result, with numeric fields as numbers because DRF serialises
   *   decimals as strings.
   */
  async getLatestResult() {
    let response;
    try {
      response = await authApiClient.get('/api/assessments/');
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }

    // The list is paginated only when necessary, and newest first.
    const assessments = Array.isArray(response.data)
      ? response.data
      : response.data?.results || [];
    const latest = assessments.find((assessment) => assessment.status !== 'draft');

    if (!latest) return null;
    if (!RESULT_STATUSES.includes(latest.status)) {
      return { pending: true, status: latest.status };
    }

    const result = { ...latest };
    NUMERIC_FIELDS.forEach((field) => {
      if (result[field] !== null && result[field] !== undefined) {
        result[field] = Number(result[field]);
      }
    });
    return result;
  }
}

export default new BusinessScoreService();
