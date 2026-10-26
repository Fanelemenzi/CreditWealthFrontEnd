/**
 * Assessment Section Configuration
 * 
 * Defines all nine financial assessment sections with their questions,
 * input types, validation rules, and weights.
 * 
 * Validates Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */

export const assessmentSections = [
  // Section 1: Financial Obligations (15% weight) - Requirement 7.1
  {
    id: 'financial_obligations',
    title: 'Financial Obligations',
    weight: 15,
    description: 'Tell us about your debts, loans, and payment history',
    questions: [
      {
        id: 'financial_obligations_monthly_debt',
        type: 'number',
        label: 'What is your total monthly debt payment amount?',
        placeholder: 'Enter amount in local currency',
        required: true,
        validation: { min: 0, max: 10000000 },
        helpText: 'Include all loan payments, credit cards, and other debt obligations'
      },
      {
        id: 'financial_obligations_loan_count',
        type: 'number',
        label: 'How many active loans do you currently have?',
        placeholder: 'Enter number of loans',
        required: true,
        validation: { min: 0, max: 50 }
      },
      {
        id: 'financial_obligations_payment_history',
        type: 'select',
        label: 'How would you describe your payment history?',
        required: true,
        options: [
          { value: 'always_on_time', label: 'Always pay on time' },
          { value: 'mostly_on_time', label: 'Usually pay on time' },
          { value: 'sometimes_late', label: 'Sometimes pay late' },
          { value: 'often_late', label: 'Often pay late' },
          { value: 'no_payment_history', label: 'No payment history yet' }
        ]
      },
      {
        id: 'financial_obligations_missed_payments',
        type: 'number',
        label: 'How many payments have you missed in the last 12 months?',
        placeholder: 'Enter number of missed payments',
        required: true,
        validation: { min: 0, max: 100 }
      },
      {
        id: 'financial_obligations_credit_cards',
        type: 'number',
        label: 'How many credit cards or credit accounts do you have?',
        placeholder: 'Enter number of credit accounts',
        required: false,
        validation: { min: 0, max: 20 }
      },
      {
        id: 'financial_obligations_outstanding_balance',
        type: 'number',
        label: 'What is your total outstanding debt balance?',
        placeholder: 'Enter total amount owed',
        required: true,
        validation: { min: 0, max: 100000000 },
        helpText: 'Sum of all remaining balances across all debts'
      }
    ]
  },

  // Section 2: Income and Employment (15% weight) - Requirement 7.2
  {
    id: 'income_employment',
    title: 'Income & Employment',
    weight: 15,
    description: 'Share details about your employment and income sources',
    questions: [
      {
        id: 'income_employment_status',
        type: 'select',
        label: 'What is your current employment status?',
        required: true,
        options: [
          { value: 'full_time_employed', label: 'Full-time employed' },
          { value: 'part_time_employed', label: 'Part-time employed' },
          { value: 'self_employed', label: 'Self-employed' },
          { value: 'unemployed', label: 'Unemployed' },
          { value: 'retired', label: 'Retired' },
          { value: 'student', label: 'Student' }
        ]
      },
      {
        id: 'income_employment_monthly_income',
        type: 'number',
        label: 'What is your total monthly income?',
        placeholder: 'Enter monthly income',
        required: true,
        validation: { min: 0, max: 100000000 },
        helpText: 'Include all sources of income'
      },
      {
        id: 'income_employment_job_tenure',
        type: 'number',
        label: 'How many years have you been in your current job or business?',
        placeholder: 'Enter number of years',
        required: true,
        validation: { min: 0, max: 100 }
      },
      {
        id: 'income_employment_employer_type',
        type: 'select',
        label: 'What type of employer do you work for?',
        required: false,
        options: [
          { value: 'government', label: 'Government' },
          { value: 'private_company', label: 'Private company' },
          { value: 'ngo', label: 'NGO/Non-profit' },
          { value: 'own_business', label: 'Own business' },
          { value: 'informal_sector', label: 'Informal sector' },
          { value: 'not_applicable', label: 'Not applicable' }
        ]
      },
      {
        id: 'income_employment_income_stability',
        type: 'radio',
        label: 'How stable is your income?',
        required: true,
        options: [
          { value: 'very_stable', label: 'Very stable (same amount each month)' },
          { value: 'mostly_stable', label: 'Mostly stable (small variations)' },
          { value: 'somewhat_variable', label: 'Somewhat variable' },
          { value: 'highly_variable', label: 'Highly variable (changes significantly)' }
        ]
      },
      {
        id: 'income_employment_additional_sources',
        type: 'checkbox',
        label: 'Do you have additional income sources? (Select all that apply)',
        required: false,
        options: [
          { value: 'rental_income', label: 'Rental income' },
          { value: 'business_income', label: 'Business income' },
          { value: 'investment_income', label: 'Investment income' },
          { value: 'remittances', label: 'Remittances from family' },
          { value: 'pension', label: 'Pension' },
          { value: 'other', label: 'Other sources' }
        ]
      }
    ]
  },

  // Section 3: Mobile Money (12% weight) - Requirement 7.3
  {
    id: 'mobile_money',
    title: 'Mobile Money',
    weight: 12,
    description: 'Information about your mobile money usage and transactions',
    questions: [
      {
        id: 'mobile_money_usage',
        type: 'radio',
        label: 'Do you use mobile money services?',
        required: true,
        options: [
          { value: 'regularly', label: 'Yes, regularly' },
          { value: 'occasionally', label: 'Yes, occasionally' },
          { value: 'rarely', label: 'Rarely' },
          { value: 'never', label: 'No, never' }
        ]
      },
      {
        id: 'mobile_money_monthly_transactions',
        type: 'number',
        label: 'How many mobile money transactions do you make per month?',
        placeholder: 'Enter number of transactions',
        required: true,
        validation: { min: 0, max: 1000 }
      },
      {
        id: 'mobile_money_monthly_volume',
        type: 'number',
        label: 'What is your average monthly mobile money transaction volume?',
        placeholder: 'Enter total amount',
        required: true,
        validation: { min: 0, max: 100000000 },
        helpText: 'Total amount of money moved through mobile money per month'
      },
      {
        id: 'mobile_money_services_used',
        type: 'checkbox',
        label: 'Which mobile money services do you use? (Select all that apply)',
        required: false,
        options: [
          { value: 'send_money', label: 'Send money to others' },
          { value: 'receive_money', label: 'Receive money' },
          { value: 'pay_bills', label: 'Pay bills' },
          { value: 'buy_airtime', label: 'Buy airtime' },
          { value: 'savings', label: 'Mobile savings' },
          { value: 'loans', label: 'Mobile loans' },
          { value: 'merchant_payments', label: 'Merchant payments' }
        ]
      },
      {
        id: 'mobile_money_balance',
        type: 'number',
        label: 'What is your typical mobile money wallet balance?',
        placeholder: 'Enter average balance',
        required: false,
        validation: { min: 0, max: 10000000 }
      },
      {
        id: 'mobile_money_duration',
        type: 'number',
        label: 'How many years have you been using mobile money?',
        placeholder: 'Enter number of years',
        required: true,
        validation: { min: 0, max: 50 }
      }
    ]
  },

  // Section 4: Assets (12% weight) - Requirement 7.4
  {
    id: 'assets',
    title: 'Assets',
    weight: 12,
    description: 'Tell us about your valuable assets and property',
    questions: [
      {
        id: 'assets_property_ownership',
        type: 'radio',
        label: 'Do you own any property or land?',
        required: true,
        options: [
          { value: 'own_multiple', label: 'Yes, I own multiple properties' },
          { value: 'own_one', label: 'Yes, I own one property' },
          { value: 'none', label: 'No, I don\'t own property' }
        ]
      },
      {
        id: 'assets_property_value',
        type: 'number',
        label: 'What is the estimated value of your property/land?',
        placeholder: 'Enter estimated value',
        required: false,
        validation: { min: 0, max: 1000000000 },
        helpText: 'Leave blank if you don\'t own property'
      },
      {
        id: 'assets_vehicle_ownership',
        type: 'checkbox',
        label: 'What vehicles do you own? (Select all that apply)',
        required: false,
        options: [
          { value: 'car', label: 'Car' },
          { value: 'motorcycle', label: 'Motorcycle/Motorbike' },
          { value: 'bicycle', label: 'Bicycle' },
          { value: 'truck', label: 'Truck/Commercial vehicle' },
          { value: 'none', label: 'No vehicles' }
        ]
      },
      {
        id: 'assets_livestock',
        type: 'number',
        label: 'How many livestock do you own? (cattle, goats, chickens, etc.)',
        placeholder: 'Enter total number',
        required: false,
        validation: { min: 0, max: 10000 }
      },
      {
        id: 'assets_valuable_items',
        type: 'checkbox',
        label: 'What other valuable assets do you own? (Select all that apply)',
        required: false,
        options: [
          { value: 'electronics', label: 'Electronics (TV, computer, etc.)' },
          { value: 'jewelry', label: 'Jewelry or precious metals' },
          { value: 'equipment', label: 'Business equipment' },
          { value: 'furniture', label: 'Furniture and appliances' },
          { value: 'other', label: 'Other valuable items' }
        ]
      },
      {
        id: 'assets_total_value',
        type: 'number',
        label: 'What is the estimated total value of all your assets?',
        placeholder: 'Enter estimated total value',
        required: true,
        validation: { min: 0, max: 1000000000 },
        helpText: 'Include property, vehicles, and other valuable possessions'
      }
    ]
  },

  // Section 5: Savings and Banking (12% weight) - Requirement 7.5
  {
    id: 'savings_banking',
    title: 'Savings & Banking',
    weight: 12,
    description: 'Information about your savings and banking habits',
    questions: [
      {
        id: 'savings_banking_account',
        type: 'radio',
        label: 'Do you have a bank account?',
        required: true,
        options: [
          { value: 'multiple', label: 'Yes, multiple accounts' },
          { value: 'one', label: 'Yes, one account' },
          { value: 'none', label: 'No bank account' }
        ]
      },
      {
        id: 'savings_banking_account_duration',
        type: 'number',
        label: 'How many years have you had a bank account?',
        placeholder: 'Enter number of years',
        required: false,
        validation: { min: 0, max: 100 },
        helpText: 'Leave blank if you don\'t have a bank account'
      },
      {
        id: 'savings_banking_current_balance',
        type: 'number',
        label: 'What is your current total savings balance?',
        placeholder: 'Enter total savings',
        required: true,
        validation: { min: 0, max: 1000000000 },
        helpText: 'Include all bank accounts and savings'
      },
      {
        id: 'savings_banking_monthly_savings',
        type: 'number',
        label: 'How much do you save each month?',
        placeholder: 'Enter monthly savings amount',
        required: true,
        validation: { min: 0, max: 10000000 }
      },
      {
        id: 'savings_banking_emergency_fund',
        type: 'radio',
        label: 'Do you have an emergency fund?',
        required: true,
        options: [
          { value: 'yes_six_months', label: 'Yes, covering 6+ months of expenses' },
          { value: 'yes_three_months', label: 'Yes, covering 3-6 months of expenses' },
          { value: 'yes_less', label: 'Yes, but less than 3 months' },
          { value: 'no', label: 'No emergency fund' }
        ]
      },
      {
        id: 'savings_banking_savings_methods',
        type: 'checkbox',
        label: 'What savings methods do you use? (Select all that apply)',
        required: false,
        options: [
          { value: 'bank_savings', label: 'Bank savings account' },
          { value: 'mobile_savings', label: 'Mobile money savings' },
          { value: 'sacco', label: 'SACCO/Credit union' },
          { value: 'chama', label: 'Chama/Savings group' },
          { value: 'home', label: 'Cash at home' },
          { value: 'investments', label: 'Investments' }
        ]
      }
    ]
  },

  // Section 6: Expense Management (12% weight) - Requirement 7.6
  {
    id: 'expense_management',
    title: 'Expense Management',
    weight: 12,
    description: 'Share your monthly expenses and spending habits',
    questions: [
      {
        id: 'expense_management_monthly_expenses',
        type: 'number',
        label: 'What is your total monthly expense amount?',
        placeholder: 'Enter total monthly expenses',
        required: true,
        validation: { min: 0, max: 100000000 },
        helpText: 'Include all regular expenses'
      },
      {
        id: 'expense_management_housing_cost',
        type: 'number',
        label: 'What is your monthly housing cost (rent or mortgage)?',
        placeholder: 'Enter housing cost',
        required: true,
        validation: { min: 0, max: 10000000 }
      },
      {
        id: 'expense_management_utilities',
        type: 'number',
        label: 'What is your monthly utilities cost (electricity, water, etc.)?',
        placeholder: 'Enter utilities cost',
        required: true,
        validation: { min: 0, max: 1000000 }
      },
      {
        id: 'expense_management_budget',
        type: 'radio',
        label: 'Do you have a monthly budget?',
        required: true,
        options: [
          { value: 'detailed_written', label: 'Yes, I have a detailed written budget' },
          { value: 'informal_mental', label: 'Yes, I keep track mentally' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'no', label: 'No, I don\'t budget' }
        ]
      },
      {
        id: 'expense_management_spending_tracking',
        type: 'radio',
        label: 'How often do you track your spending?',
        required: true,
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'rarely', label: 'Rarely or never' }
        ]
      },
      {
        id: 'expense_management_categories',
        type: 'checkbox',
        label: 'What are your major expense categories? (Select all that apply)',
        required: false,
        options: [
          { value: 'food', label: 'Food and groceries' },
          { value: 'transport', label: 'Transportation' },
          { value: 'education', label: 'Education' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'debt_payments', label: 'Debt payments' },
          { value: 'family_support', label: 'Family support' }
        ]
      }
    ]
  },

  // Section 7: Household Profile (8% weight) - Requirement 7.7
  {
    id: 'household_profile',
    title: 'Household Profile',
    weight: 8,
    description: 'Tell us about your household and living situation',
    questions: [
      {
        id: 'household_profile_size',
        type: 'number',
        label: 'How many people live in your household?',
        placeholder: 'Enter number of people',
        required: true,
        validation: { min: 1, max: 50 }
      },
      {
        id: 'household_profile_dependents',
        type: 'number',
        label: 'How many dependents do you have?',
        placeholder: 'Enter number of dependents',
        required: true,
        validation: { min: 0, max: 30 },
        helpText: 'People who rely on your income (children, elderly, etc.)'
      },
      {
        id: 'household_profile_marital_status',
        type: 'select',
        label: 'What is your marital status?',
        required: true,
        options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' },
          { value: 'prefer_not_say', label: 'Prefer not to say' }
        ]
      },
      {
        id: 'household_profile_housing_status',
        type: 'radio',
        label: 'What is your housing situation?',
        required: true,
        options: [
          { value: 'own_outright', label: 'Own outright' },
          { value: 'own_with_mortgage', label: 'Own with mortgage' },
          { value: 'renting', label: 'Renting' },
          { value: 'living_with_family', label: 'Living with family/relatives' }
        ]
      },
      {
        id: 'household_profile_age_group',
        type: 'select',
        label: 'What is your age group?',
        required: true,
        options: [
          { value: '18-24', label: '18-24 years' },
          { value: '25-34', label: '25-34 years' },
          { value: '35-44', label: '35-44 years' },
          { value: '45-54', label: '45-54 years' },
          { value: '55-64', label: '55-64 years' },
          { value: '65+', label: '65+ years' }
        ]
      },
      {
        id: 'household_profile_education',
        type: 'select',
        label: 'What is your highest level of education?',
        required: true,
        options: [
          { value: 'no_formal', label: 'No formal education' },
          { value: 'primary', label: 'Primary school' },
          { value: 'secondary', label: 'Secondary school' },
          { value: 'vocational', label: 'Vocational training' },
          { value: 'undergraduate', label: 'University undergraduate' },
          { value: 'postgraduate', label: 'University postgraduate' }
        ]
      }
    ]
  },

  // Section 8: Financial Literacy (8% weight) - Requirement 7.8
  {
    id: 'financial_literacy',
    title: 'Financial Literacy',
    weight: 8,
    description: 'Assessment of your financial knowledge and planning',
    questions: [
      {
        id: 'financial_literacy_planning',
        type: 'radio',
        label: 'Do you have financial goals?',
        required: true,
        options: [
          { value: 'written_detailed', label: 'Yes, written and detailed' },
          { value: 'mental_clear', label: 'Yes, clear goals in mind' },
          { value: 'vague', label: 'Vague ideas' },
          { value: 'none', label: 'No specific goals' }
        ]
      },
      {
        id: 'financial_literacy_knowledge',
        type: 'radio',
        label: 'How would you rate your financial knowledge?',
        required: true,
        options: [
          { value: 'excellent', label: 'Excellent - I understand all financial concepts' },
          { value: 'good', label: 'Good - I understand most concepts' },
          { value: 'basic', label: 'Basic - I understand the basics' },
          { value: 'limited', label: 'Limited - I need to learn more' }
        ]
      },
      {
        id: 'financial_literacy_concepts',
        type: 'checkbox',
        label: 'Which financial concepts are you familiar with? (Select all that apply)',
        required: false,
        options: [
          { value: 'budgeting', label: 'Budgeting' },
          { value: 'saving', label: 'Saving and emergency funds' },
          { value: 'investing', label: 'Investing' },
          { value: 'debt_management', label: 'Debt management' },
          { value: 'insurance', label: 'Insurance' },
          { value: 'credit_scores', label: 'Credit scores' },
          { value: 'retirement', label: 'Retirement planning' }
        ]
      },
      {
        id: 'financial_literacy_training',
        type: 'radio',
        label: 'Have you received any financial education or training?',
        required: true,
        options: [
          { value: 'formal_extensive', label: 'Yes, formal and extensive training' },
          { value: 'some_training', label: 'Yes, some training or workshops' },
          { value: 'self_taught', label: 'Self-taught through reading/online' },
          { value: 'none', label: 'No formal training' }
        ]
      },
      {
        id: 'financial_literacy_advisor',
        type: 'radio',
        label: 'Do you consult a financial advisor or mentor?',
        required: true,
        options: [
          { value: 'regularly', label: 'Yes, regularly' },
          { value: 'occasionally', label: 'Yes, occasionally' },
          { value: 'rarely', label: 'Rarely' },
          { value: 'never', label: 'Never' }
        ]
      },
      {
        id: 'financial_literacy_insurance',
        type: 'checkbox',
        label: 'What types of insurance do you have? (Select all that apply)',
        required: false,
        options: [
          { value: 'health', label: 'Health insurance' },
          { value: 'life', label: 'Life insurance' },
          { value: 'property', label: 'Property insurance' },
          { value: 'vehicle', label: 'Vehicle insurance' },
          { value: 'business', label: 'Business insurance' },
          { value: 'none', label: 'No insurance' }
        ]
      }
    ]
  },

  // Section 9: Business Profile (6% weight) - Requirement 7.9
  {
    id: 'business_profile',
    title: 'Business Profile',
    weight: 6,
    description: 'Information about your business activities (if applicable)',
    questions: [
      {
        id: 'business_profile_ownership',
        type: 'radio',
        label: 'Do you own or operate a business?',
        required: true,
        options: [
          { value: 'yes_registered', label: 'Yes, registered business' },
          { value: 'yes_informal', label: 'Yes, informal business' },
          { value: 'no', label: 'No business' }
        ]
      },
      {
        id: 'business_profile_type',
        type: 'select',
        label: 'What type of business do you operate?',
        required: false,
        options: [
          { value: 'retail', label: 'Retail/Shop' },
          { value: 'agriculture', label: 'Agriculture/Farming' },
          { value: 'services', label: 'Services' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'trading', label: 'Trading' },
          { value: 'transport', label: 'Transportation' },
          { value: 'technology', label: 'Technology' },
          { value: 'other', label: 'Other' },
          { value: 'not_applicable', label: 'Not applicable' }
        ],
        helpText: 'Leave as "Not applicable" if you don\'t own a business'
      },
      {
        id: 'business_profile_monthly_revenue',
        type: 'number',
        label: 'What is your average monthly business revenue?',
        placeholder: 'Enter monthly revenue',
        required: false,
        validation: { min: 0, max: 1000000000 },
        helpText: 'Leave blank if you don\'t have a business'
      },
      {
        id: 'business_profile_years_operating',
        type: 'number',
        label: 'How many years has your business been operating?',
        placeholder: 'Enter number of years',
        required: false,
        validation: { min: 0, max: 100 },
        helpText: 'Leave blank if you don\'t have a business'
      },
      {
        id: 'business_profile_employees',
        type: 'number',
        label: 'How many employees do you have?',
        placeholder: 'Enter number of employees',
        required: false,
        validation: { min: 0, max: 10000 },
        helpText: 'Leave blank if you don\'t have a business'
      },
      {
        id: 'business_profile_bank_account',
        type: 'radio',
        label: 'Does your business have a separate bank account?',
        required: false,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not_applicable', label: 'Not applicable' }
        ]
      },
      {
        id: 'business_profile_records',
        type: 'radio',
        label: 'Do you keep business financial records?',
        required: false,
        options: [
          { value: 'detailed_digital', label: 'Yes, detailed digital records' },
          { value: 'paper_records', label: 'Yes, paper records' },
          { value: 'informal', label: 'Informal tracking' },
          { value: 'none', label: 'No records' },
          { value: 'not_applicable', label: 'Not applicable' }
        ]
      }
    ]
  }
];

/**
 * Helper function to get section by ID
 */
export const getSectionById = (sectionId) => {
  return assessmentSections.find(section => section.id === sectionId);
};

/**
 * Helper function to get section index by ID
 */
export const getSectionIndexById = (sectionId) => {
  return assessmentSections.findIndex(section => section.id === sectionId);
};

/**
 * Helper function to get section by index
 */
export const getSectionByIndex = (index) => {
  return assessmentSections[index] || null;
};

/**
 * Get total number of sections
 */
export const getTotalSections = () => {
  return assessmentSections.length;
};

/**
 * Get all section IDs in order
 */
export const getSectionIds = () => {
  return assessmentSections.map(section => section.id);
};

/**
 * Validate that all section weights sum to 100%
 */
export const validateSectionWeights = () => {
  const totalWeight = assessmentSections.reduce((sum, section) => sum + section.weight, 0);
  return totalWeight === 100;
};

// Validate weights on module load
if (!validateSectionWeights()) {
  console.warn('Warning: Assessment section weights do not sum to 100%');
}
