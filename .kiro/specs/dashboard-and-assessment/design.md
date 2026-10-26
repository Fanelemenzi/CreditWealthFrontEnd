# Design Document: Dashboard and Assessment Feature

## Introduction

This document presents the technical design for the Credit Score Dashboard and Assessment feature. The design addresses two primary user-facing interfaces: a Dashboard Page that displays credit score analytics and a multi-step Assessment Page for collecting comprehensive financial data. The architecture follows React best practices, integrates with the existing authentication system, and maintains visual consistency with the current application.

## Architecture Overview

### System Components

The feature comprises four primary architectural layers:

1. **Presentation Layer**: React components implementing the Dashboard and Assessment interfaces
2. **State Management Layer**: Component-level state management using React hooks
3. **Service Layer**: API client services for backend communication
4. **Routing Layer**: React Router integration for navigation

### Component Hierarchy

```
App (Router)
├── DashboardPage
│   ├── ScoreCircle
│   ├── PillarBreakdown
│   ├── ValidationFlags
│   ├── Recommendations
│   └── PreviewState
└── AssessmentPage
    ├── ProgressBar
    ├── SectionNavigator
    ├── QuestionRenderer
    │   ├── TextInput
    │   ├── NumberInput
    │   ├── SelectInput
    │   ├── RadioInput
    │   ├── CheckboxInput
    │   └── DateInput
    └── SubmissionFlow
```

### Data Flow

```
User Action → Component Event Handler → Service Layer → Backend API
                                            ↓
                                      State Update
                                            ↓
                                      UI Re-render
```

## Component Design

### 1. DashboardPage Component

**Purpose**: Display user's credit score, pillar breakdown, validation flags, and recommendations.

**Props**: None (retrieves data internally)

**State**:
```javascript
{
  score: null | {
    composite_score: number,
    score_band: string,
    pillar_scores: object,
    pillar_breakdown: object,
    validation_flags: array,
    recommendations: array
  },
  loading: boolean,
  error: string | null,
  isPreviewMode: boolean
}
```

**Key Methods**:
- `fetchScoreData()`: Retrieves latest score from backend
- `handleTakeAssessment()`: Navigates to assessment page
- `getScoreBandColor(score)`: Maps score to appropriate color
- `getScoreBandLabel(score)`: Maps score to band label (Poor, Weak, Fair, Good, Excellent)

**Lifecycle**:
1. On mount: Check JWT token, fetch score data
2. If no score exists: Display preview mode with sample data
3. If score exists: Render full dashboard with actual data
4. Handle 401 errors: Redirect to login

**Styling**: Follows existing `CreditScorePage.css` patterns

**Example Structure**:
```javascript
const DashboardPage = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchScoreData();
  }, []);

  const fetchScoreData = async () => {
    try {
      const data = await ScoreService.getLatestScore();
      setScore(data);
      setIsPreviewMode(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setIsPreviewMode(true);
      } else if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credit-score-page">
      {/* Navigation bar */}
      {/* Score visualization */}
      {/* Pillar breakdown */}
      {/* Recommendations */}
    </div>
  );
};
```

### 2. ScoreCircle Component

**Purpose**: Animated circular visualization of credit score.

**Props**:
```javascript
{
  score: number,           // 300-850
  targetScore: number,     // For animation
  animated: boolean
}
```

**Features**:
- SVG-based circular progress indicator
- Gradient coloring based on score range
- Animation from 0 to target score over 2 seconds
- Responsive sizing

**Implementation**:
```javascript
const ScoreCircle = ({ score, animated = true }) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      animateScore(score);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  const scorePercentage = (score / 850) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <svg className="score-circle" width="320" height="320">
      {/* Background circle */}
      {/* Progress circle with gradient */}
      {/* Score text in center */}
    </svg>
  );
};
```

### 3. PillarBreakdown Component

**Purpose**: Display scores for all nine financial pillars with contribution percentages.

**Props**:
```javascript
{
  pillarBreakdown: {
    [pillarName]: {
      score: number,
      weight: number,
      contribution: number,
      status: string
    }
  }
}
```

**Layout**: Grid or list layout showing each pillar with visual indicators

**Example**:
```javascript
const PillarBreakdown = ({ pillarBreakdown }) => {
  const pillars = [
    { key: 'financial_obligations', label: 'Financial Obligations', weight: 15 },
    { key: 'income_employment', label: 'Income & Employment', weight: 15 },
    { key: 'mobile_money', label: 'Mobile Money', weight: 12 },
    { key: 'assets', label: 'Assets', weight: 12 },
    { key: 'savings_banking', label: 'Savings & Banking', weight: 12 },
    { key: 'expense_management', label: 'Expense Management', weight: 12 },
    { key: 'household_profile', label: 'Household Profile', weight: 8 },
    { key: 'financial_literacy', label: 'Financial Literacy', weight: 8 },
    { key: 'business_profile', label: 'Business Profile', weight: 6 }
  ];

  return (
    <div className="pillar-breakdown">
      {pillars.map(pillar => (
        <div key={pillar.key} className="pillar-item">
          <span>{pillar.label}</span>
          <span>{pillarBreakdown[pillar.key]?.score}/100</span>
          <span>{pillar.weight}% weight</span>
        </div>
      ))}
    </div>
  );
};
```

### 4. AssessmentPage Component

**Purpose**: Multi-step wizard for collecting financial assessment data.

**State**:
```javascript
{
  session: {
    id: string,
    current_section: string,
    form_answers: object,
    completed_sections: array,
    completion_percentage: number
  },
  currentSectionIndex: number,
  answers: object,
  errors: object,
  loading: boolean,
  submitting: boolean
}
```

**Key Methods**:
- `loadSession()`: Fetch or create assessment session
- `validateSection()`: Validate all required fields in current section
- `saveAndAdvance()`: Save answers and move to next section
- `handleSubmit()`: Complete assessment and trigger score calculation
- `renderQuestionField(question)`: Render appropriate input based on question type

**Section Configuration**:
```javascript
const sections = [
  {
    id: 'financial_obligations',
    title: 'Financial Obligations',
    weight: 15,
    questions: [
      {
        id: 'financial_obligations_monthly_debt',
        type: 'number',
        label: 'Monthly Debt Payments',
        required: true,
        validation: { min: 0, max: 100000 }
      },
      // Additional questions...
    ]
  },
  // Additional sections...
];
```

**Lifecycle**:
1. On mount: Check authentication, load active session
2. If no session: Create new session
3. Display section based on saved progress
4. On "Next": Validate, save, advance
5. On "Submit": Save, mark complete, calculate score, redirect

### 5. ProgressBar Component

**Purpose**: Visual indicator of assessment progress.

**Props**:
```javascript
{
  currentSection: number,
  totalSections: number,
  completionPercentage: number
}
```

**Features**:
- Visual progress bar with percentage
- Section indicators (dots or numbers)
- Current section highlight

**Example**:
```javascript
const ProgressBar = ({ currentSection, totalSections, completionPercentage }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <div className="progress-text">
        Section {currentSection} of {totalSections} - {completionPercentage}% Complete
      </div>
      <div className="section-indicators">
        {Array.from({ length: totalSections }).map((_, i) => (
          <div 
            key={i}
            className={`indicator ${i < currentSection ? 'completed' : ''} ${i === currentSection ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
```

### 6. QuestionRenderer Component

**Purpose**: Render appropriate input component based on question type.

**Props**:
```javascript
{
  question: {
    id: string,
    type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date',
    label: string,
    required: boolean,
    options?: array,
    validation?: object
  },
  value: any,
  error: string | null,
  onChange: (id, value) => void
}
```

**Input Types**:

**TextInput**:
```javascript
const TextInput = ({ id, label, value, error, required, onChange }) => (
  <div className="form-field">
    <label>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(id, e.target.value)}
      className={error ? 'error' : ''}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

**NumberInput**:
```javascript
const NumberInput = ({ id, label, value, error, required, validation, onChange }) => (
  <div className="form-field">
    <label>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      type="number"
      value={value || ''}
      min={validation?.min}
      max={validation?.max}
      onChange={(e) => onChange(id, parseFloat(e.target.value))}
      className={error ? 'error' : ''}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

**SelectInput**:
```javascript
const SelectInput = ({ id, label, value, error, required, options, onChange }) => (
  <div className="form-field">
    <label>
      {label} {required && <span className="required">*</span>}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(id, e.target.value)}
      className={error ? 'error' : ''}
    >
      <option value="">Select an option</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

**RadioInput**:
```javascript
const RadioInput = ({ id, label, value, error, required, options, onChange }) => (
  <div className="form-field">
    <label>
      {label} {required && <span className="required">*</span>}
    </label>
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt.value} className="radio-label">
          <input
            type="radio"
            name={id}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(id, e.target.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

**CheckboxInput**:
```javascript
const CheckboxInput = ({ id, label, value, error, options, onChange }) => (
  <div className="form-field">
    <label>{label}</label>
    <div className="checkbox-group">
      {options.map(opt => (
        <label key={opt.value} className="checkbox-label">
          <input
            type="checkbox"
            value={opt.value}
            checked={(value || []).includes(opt.value)}
            onChange={(e) => {
              const newValue = e.target.checked
                ? [...(value || []), opt.value]
                : (value || []).filter(v => v !== opt.value);
              onChange(id, newValue);
            }}
          />
          {opt.label}
        </label>
      ))}
    </div>
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

**DateInput**:
```javascript
const DateInput = ({ id, label, value, error, required, onChange }) => (
  <div className="form-field">
    <label>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(id, e.target.value)}
      className={error ? 'error' : ''}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);
```

## Service Layer

### ScoreService

**Purpose**: Handle all score-related API operations.

**Methods**:
```javascript
class ScoreService {
  async getLatestScore() {
    const response = await apiClient.get('/api/score-calculation/latest/');
    return response.data.score;
  }

  async calculateScore() {
    const response = await apiClient.post('/api/score-calculation/calculate/');
    return response.data.score;
  }
}

export default new ScoreService();
```

### AssessmentService

**Purpose**: Handle assessment session and answer management.

**Methods**:
```javascript
class AssessmentService {
  async getActiveSession() {
    const response = await apiClient.get('/api/assessment-sessions/active-session/');
    return response.data;
  }

  async createSession() {
    const response = await apiClient.post('/api/assessment-sessions/', {
      session_name: 'Credit Assessment',
      device_type: 'desktop',
      user_agent: navigator.userAgent
    });
    return response.data;
  }

  async saveAnswer(sessionId, questionId, value) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/save_answer/`,
      { question_id: questionId, answer_value: value }
    );
    return response.data;
  }

  async saveMultipleAnswers(sessionId, answers) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/save_multiple_answers/`,
      { answers }
    );
    return response.data;
  }

  async markSectionCompleted(sessionId, sectionName) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/mark_section_completed/`,
      { section_name: sectionName }
    );
    return response.data;
  }

  async markCompleted(sessionId) {
    const response = await apiClient.post(
      `/api/assessment-sessions/${sessionId}/mark_completed/`
    );
    return response.data;
  }
}

export default new AssessmentService();
```

### ValidationService

**Purpose**: Client-side and server-side validation.

**Methods**:
```javascript
class ValidationService {
  async validateField(questionId, value, context = {}) {
    const response = await apiClient.post('/api/assessments/validate-field/', {
      question_id: questionId,
      field_value: value,
      context
    });
    return response.data;
  }

  validateRequired(value) {
    return value !== null && value !== undefined && value !== '';
  }

  validateNumber(value, min, max) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  }

  validateSection(questions, answers) {
    const errors = {};
    
    questions.forEach(question => {
      if (question.required && !this.validateRequired(answers[question.id])) {
        errors[question.id] = 'This field is required';
      }
      
      if (question.type === 'number' && answers[question.id]) {
        const { min, max } = question.validation || {};
        if (!this.validateNumber(answers[question.id], min, max)) {
          errors[question.id] = `Value must be between ${min} and ${max}`;
        }
      }
    });
    
    return errors;
  }
}

export default new ValidationService();
```

## Data Models

### Score Data Model
```javascript
{
  composite_score: number,        // 300-850
  score_band: string,             // 'poor' | 'weak' | 'fair' | 'good' | 'excellent'
  score_band_display: string,     // Human-readable band with range
  calculated_at: string,          // ISO timestamp
  pillar_scores: {
    financial_obligations: number,
    income_employment: number,
    mobile_money: number,
    assets: number,
    savings_banking: number,
    expense_management: number,
    household_profile: number,
    financial_literacy: number,
    business_profile: number
  },
  pillar_breakdown: {
    [pillarName]: {
      score: number,
      weight: number,
      contribution: number,
      status: string
    }
  },
  validation_flags: [
    {
      flag_type: string,
      severity: 'warning' | 'info',
      message: string,
      impact: number
    }
  ],
  recommendations: [
    {
      title: string,
      description: string,
      impact: number
    }
  ],
  honesty_bonus: number,
  validation_adjustment: number,
  is_sufficient_data: boolean,
  missing_sections: string[],
  score_id: string
}
```

### Assessment Session Model
```javascript
{
  id: string,
  user: string,
  session_name: string,
  current_question: number,
  current_section: string,
  form_answers: {
    [questionId]: any
  },
  completed_sections: string[],
  skipped_questions: string[],
  status: 'in_progress' | 'submitted' | 'expired',
  start_time: string,
  expires_at: string,
  completion_percentage: number,
  is_expired: boolean,
  is_active: boolean,
  time_remaining_days: number,
  answered_question_count: number
}
```

## Error Handling

### Authentication Errors (401)
```javascript
const handleAuthError = (navigate) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  navigate('/login');
};
```

### Network Errors
```javascript
const handleNetworkError = (setError) => {
  setError('Network error. Please check your connection and try again.');
};
```

### Server Errors (500)
```javascript
const handleServerError = (setError, message) => {
  setError(message || 'Server error. Please try again later.');
};
```

### Validation Errors
```javascript
const handleValidationErrors = (errors, setErrors) => {
  setErrors(errors);
  // Scroll to first error
  const firstErrorElement = document.querySelector('.error');
  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
```

## Routing Configuration

Update `App.jsx`:
```javascript
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
```

## Styling Guidelines

### CSS Class Naming Convention

Follow existing patterns from `CreditScorePage.css`:

**Page containers**: `.credit-score-page`, `.assessment-page`
**Navigation**: `.dashboard-nav`, `.nav-container`, `.nav-actions`
**Cards**: `.score-card`, `.info-card`, `.factors-card`
**Form elements**: `.form-field`, `.form-label`, `.form-input`
**Buttons**: `.btn-primary`, `.btn-outline`, `.icon-button`
**Progress**: `.progress-bar`, `.progress-fill`, `.progress-text`
**Errors**: `.error-message`, `.field-error`

### Color Scheme

Match existing application colors:
- **Primary**: `#4f46e5` (indigo)
- **Success**: `#10b981` (green)
- **Warning**: `#f59e0b` (amber)
- **Error**: `#ef4444` (red)
- **Background**: `#f9fafb` (gray-50)
- **Text**: `#111827` (gray-900)

### Score Band Colors

```javascript
const scoreBandColors = {
  poor: '#ef4444',      // red
  weak: '#f97316',      // orange
  fair: '#eab308',      // yellow
  good: '#84cc16',      // lime
  excellent: '#10b981'  // green
};
```

## Assessment Section Definitions

### Section 1: Financial Obligations (15% weight)
Questions about debts, loans, payment history, credit accounts.

### Section 2: Income and Employment (15% weight)
Questions about employment status, income sources, job stability, employer information.

### Section 3: Mobile Money (12% weight)
Questions about mobile money usage, transaction volume, savings via mobile platforms.

### Section 4: Assets (12% weight)
Questions about property ownership, vehicles, valuable assets, livestock.

### Section 5: Savings and Banking (12% weight)
Questions about bank accounts, savings habits, emergency funds.

### Section 6: Expense Management (12% weight)
Questions about monthly expenses, budgeting, spending patterns.

### Section 7: Household Profile (8% weight)
Questions about dependents, household size, marital status, housing situation.

### Section 8: Financial Literacy (8% weight)
Questions about financial knowledge, planning, goal setting, financial education.

### Section 9: Business Profile (6% weight)
Questions about business ownership, business income, business accounts.

## Performance Considerations

### Lazy Loading
Consider lazy loading the AssessmentPage since it's not needed on initial load:
```javascript
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
```

### Debouncing
Debounce autosave operations to reduce API calls:
```javascript
const debouncedSave = useMemo(
  () => debounce((sessionId, questionId, value) => {
    AssessmentService.saveAnswer(sessionId, questionId, value);
  }, 1000),
  []
);
```

### Memoization
Memoize expensive computations:
```javascript
const pillarBreakdownArray = useMemo(
  () => Object.entries(pillarBreakdown).map(([key, value]) => ({ key, ...value })),
  [pillarBreakdown]
);
```

## Security Considerations

1. **Token Storage**: JWT tokens stored in localStorage (already implemented)
2. **Token Refresh**: Automatic token refresh handled by API interceptor
3. **Authentication Guards**: All protected pages check for token and redirect if missing
4. **Input Sanitization**: Validate and sanitize all user inputs before sending to backend
5. **HTTPS**: Ensure production deployment uses HTTPS
6. **CORS**: Backend configured with appropriate CORS settings

## Testing Strategy

### Unit Tests
- Component rendering with different props
- Input validation logic
- State management logic
- Service layer methods

### Integration Tests
- API communication flows
- Authentication flows
- Navigation between pages
- Form submission workflows

### Property-Based Tests
See Correctness Properties section for properties that should be validated through property-based testing.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Score Display Completeness

For any valid score data structure containing composite_score, score_band, and pillar_breakdown, the Dashboard rendering function SHALL include all of these elements in its output.

**Validates: Requirements 1.1, 1.3, 1.4**

### Property 2: Score Band Mapping Consistency

For any credit score value between 300 and 850, the displayed score band SHALL match the correct range: Poor (300-449), Weak (450-549), Fair (550-649), Good (650-749), or Excellent (750-850).

**Validates: Requirements 1.3**

### Property 3: Validation Flag Display Completeness

For any non-empty array of validation flags, all validation flags SHALL appear in the Dashboard rendered output.

**Validates: Requirements 1.5**

### Property 4: Recommendation Display Completeness

For any non-empty array of recommendations, all recommendations SHALL appear in the Dashboard rendered output.

**Validates: Requirements 1.6**

### Property 5: Authentication Header Inclusion

For any API request made by the Dashboard or Assessment pages, when a JWT token exists in localStorage, the request SHALL include an Authorization header with that token.

**Validates: Requirements 2.2, 5.5**

### Property 6: Single Section Visibility

For any assessment state with a current section index, the rendered Assessment page SHALL display exactly one section's questions.

**Validates: Requirements 3.1**

### Property 7: Progress Calculation Accuracy

For any assessment state with N completed sections out of M total sections, the displayed completion percentage SHALL equal (N / M) × 100.

**Validates: Requirements 3.3**

### Property 8: Required Field Validation Enforcement

For any section containing required fields, when the user attempts to advance with any required field empty, validation SHALL fail and prevent navigation.

**Validates: Requirements 4.1, 4.3**

### Property 9: Validation Error Display

For any invalid required field, an error message SHALL be displayed adjacent to that field in the rendered output.

**Validates: Requirements 4.2, 9.5**

### Property 10: Optional Field Acceptance

For any section where all required fields are valid, leaving optional fields empty SHALL allow validation to pass and navigation to proceed.

**Validates: Requirements 4.6**

### Property 11: Successful Save Triggers Progression

For any section with valid data, when the save operation completes successfully, the current section index SHALL advance by one.

**Validates: Requirements 4.5**

### Property 12: Session Progress Restoration

For any assessment session retrieved from the backend containing a current_section value, the Assessment page SHALL display the section corresponding to that current_section value.

**Validates: Requirements 5.4**

## Implementation Notes

### Development Order

1. **Phase 1**: Set up routing and basic page structure
2. **Phase 2**: Implement DashboardPage with preview mode
3. **Phase 3**: Implement ScoreCircle and PillarBreakdown components
4. **Phase 4**: Implement AssessmentPage structure and navigation
5. **Phase 5**: Implement QuestionRenderer with all input types
6. **Phase 6**: Implement validation and error handling
7. **Phase 7**: Implement submission flow and score calculation trigger
8. **Phase 8**: Style components to match existing design
9. **Phase 9**: Testing and refinement

### API Integration Checklist

- [ ] Configure API base URL
- [ ] Set up axios interceptors for token handling
- [ ] Implement ScoreService
- [ ] Implement AssessmentService
- [ ] Implement ValidationService
- [ ] Add error handling for all API calls
- [ ] Test token refresh flow
- [ ] Test 401 redirect behavior

### Accessibility Considerations

- All form inputs must have associated labels
- Error messages must be announced to screen readers
- Keyboard navigation must work throughout the assessment
- Focus management on section transitions
- Color contrast ratios must meet WCAG AA standards
- Loading states must be announced

## Future Enhancements

### Potential Improvements

1. **Autosave**: Automatically save answers as user types (with debouncing)
2. **Progress Persistence**: Save scroll position and restore on page reload
3. **Answer Review**: Allow users to review all answers before final submission
4. **Section Navigation**: Allow users to jump to previous sections (if business rules permit)
5. **Offline Support**: Cache answers locally and sync when connection restored
6. **Validation Hints**: Real-time inline validation as user types
7. **Analytics**: Track completion rates and drop-off points
8. **Multi-language Support**: Internationalization for different languages
9. **Mobile Optimization**: Touch-friendly controls and responsive layouts
10. **Score History**: Track score changes over time with visualization

## Conclusion

This design provides a comprehensive blueprint for implementing the Dashboard and Assessment feature. The architecture follows React best practices, maintains consistency with the existing application, and provides a solid foundation for future enhancements. The component-based structure ensures reusability, testability, and maintainability.
