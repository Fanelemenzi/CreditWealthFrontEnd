/**
 * Personal credit score definitions, shared by the landing page and dashboard.
 */
export const PERSONAL_SCORE_MIN = 300;
export const PERSONAL_SCORE_MAX = 850;

export const PERSONAL_PILLARS = [
  { key: 'financial_obligations', label: 'Financial Obligations', weight: 15 },
  { key: 'income_employment', label: 'Income & Employment', weight: 15 },
  { key: 'mobile_money', label: 'Mobile Money', weight: 12 },
  { key: 'assets', label: 'Assets', weight: 12 },
  { key: 'savings_banking', label: 'Savings & Banking', weight: 12 },
  { key: 'expense_management', label: 'Expense Management', weight: 12 },
  { key: 'household_profile', label: 'Household Profile', weight: 8 },
  { key: 'financial_literacy', label: 'Financial Literacy', weight: 8 },
  { key: 'business_profile', label: 'Business Profile', weight: 6 },
];

export const PERSONAL_BANDS = [
  { id: 'poor', label: 'Poor', min: 300, max: 449, color: '#ef4444' },
  { id: 'weak', label: 'Weak', min: 450, max: 549, color: '#f97316' },
  { id: 'fair', label: 'Fair', min: 550, max: 649, color: '#eab308' },
  { id: 'good', label: 'Good', min: 650, max: 749, color: '#84cc16' },
  { id: 'excellent', label: 'Excellent', min: 750, max: 850, color: '#10b981' },
];

export const getPersonalBand = (score) =>
  [...PERSONAL_BANDS].reverse().find((band) => score >= band.min) || PERSONAL_BANDS[0];
