/**
 * Business Viability Score (BVSS) definitions, taken from the BVSS build guide.
 * Pillar weights and tier boundaries must stay in step with the scoring backend.
 */

export const BUSINESS_SCORE_MAX = 1000;

export const BUSINESS_PILLARS = [
  {
    key: 'score_p1',
    label: 'Owner Character',
    weight: 20,
    description: 'Experience, repayment history, savings discipline and commitment.',
  },
  {
    key: 'score_p2',
    label: 'Financial Performance',
    weight: 25,
    description: 'Revenue, consistency, profit margin and existing debt.',
  },
  {
    key: 'score_p3',
    label: 'Business Maturity',
    weight: 15,
    description: 'Time operating, customer base, location and record keeping.',
  },
  {
    key: 'score_p4',
    label: 'Market Position',
    weight: 15,
    description: 'Demand, competitive advantage, growth and revenue streams.',
  },
  {
    key: 'score_p5',
    label: 'Social Capital',
    weight: 15,
    description: 'Stokvels, business associations, guarantors and reputation.',
  },
  {
    key: 'score_p6',
    label: 'Repayment Capacity',
    weight: 10,
    description: 'Debt-to-income, emergency buffer and collateral.',
  },
];

// Ordered from the top tier down. `min` alone decides the tier, so decimal
// scores such as 799.5 cannot fall between two tiers.
export const BUSINESS_TIERS = [
  { id: 'A', label: 'Premium', min: 800, max: 1000, multiple: '12× monthly revenue', rate: 'Prime + 2%', color: '#1d9e75' },
  { id: 'B', label: 'Standard', min: 650, max: 799, multiple: '8× monthly revenue', rate: 'Prime + 5%', color: '#639922' },
  { id: 'C', label: 'Conditional', min: 500, max: 649, multiple: '4× monthly revenue', rate: 'Prime + 9%', color: '#ba7517' },
  { id: 'D', label: 'Micro', min: 350, max: 499, multiple: '2× monthly revenue', rate: 'Microfinance', color: '#d85a30' },
  { id: 'E', label: 'Not ready', min: 0, max: 349, multiple: 'Not yet eligible', rate: null, color: '#a32d2d' },
];

export const getBusinessTier = (score) =>
  BUSINESS_TIERS.find((tier) => score >= tier.min) || BUSINESS_TIERS[BUSINESS_TIERS.length - 1];

export const getBusinessTierById = (id) => BUSINESS_TIERS.find((tier) => tier.id === id);

// Shown, clearly labelled as a sample, until the owner has a real result.
export const SAMPLE_BUSINESS_RESULT = {
  id: 'sample',
  status: 'sample',
  final_bvss: 701,
  risk_tier: 'B',
  score_p1: 78,
  score_p2: 68,
  score_p3: 74,
  score_p4: 72,
  score_p5: 60,
  score_p6: 66,
  approved_loan_max: 67200,
  expires_at: null,
  improvement_tips: [
    {
      pillar: 'Social capital (P5)',
      current_score: 60,
      advice: "Join a registered stokvel or traders' association and secure two contactable non-family guarantors.",
    },
    {
      pillar: 'Repayment capacity (P6)',
      current_score: 66,
      advice: 'Reduce existing debt below 20% of monthly revenue and build a 1-month cash buffer.',
    },
  ],
};
