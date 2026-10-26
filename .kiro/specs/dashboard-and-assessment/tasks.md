# Implementation Plan: Dashboard and Assessment Feature

## Overview

This implementation plan guides the development of a Credit Score Dashboard and multi-step Assessment wizard for the credit scoring platform. The implementation follows a component-based architecture using React, integrates with existing authentication, and maintains visual consistency with the current application design.

## Tasks

- [x] 1. Set up project structure and service layer
  - [x] 1.1 Create service layer directory and API client configuration
    - Create `src/services/` directory
    - Create `src/services/apiClient.js` with axios configuration and JWT token interceptors
    - Configure base URL and request/response interceptors
    - _Requirements: 2.2, 5.5_
  
  - [x] 1.2 Implement ScoreService for score-related API operations
    - Create `src/services/ScoreService.js`
    - Implement `getLatestScore()` method to fetch latest score from `/api/score-calculation/latest/`
    - Implement `calculateScore()` method to trigger score calculation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.3_
  
  - [x] 1.3 Implement AssessmentService for assessment session management
    - Create `src/services/AssessmentService.js`
    - Implement `getActiveSession()` to retrieve active assessment session
    - Implement `createSession()` to create new assessment session
    - Implement `saveAnswer()` to save individual answers
    - Implement `saveMultipleAnswers()` to save section answers in bulk
    - Implement `markSectionCompleted()` to mark section as done
    - Implement `markCompleted()` to finalize assessment submission
    - _Requirements: 5.2, 5.3, 5.5, 6.1, 6.2_
  
  - [x] 1.4 Implement ValidationService for client-side validation
    - Create `src/services/ValidationService.js`
    - Implement `validateRequired()` for required field validation
    - Implement `validateNumber()` for number range validation
    - Implement `validateSection()` to validate all fields in a section
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 2. Implement Dashboard Page core components
  - [x] 2.1 Create DashboardPage component with authentication and data fetching
    - Create `src/pages/DashboardPage.jsx`
    - Implement authentication check on mount (retrieve JWT from localStorage)
    - Implement `fetchScoreData()` to retrieve score from backend
    - Handle 404 response by setting preview mode
    - Handle 401 response by redirecting to login
    - Manage loading, error, and preview states
    - _Requirements: 1.1, 1.7, 1.8, 2.1, 2.2, 2.3, 2.4, 10.1, 10.3_
  
  - [x] 2.2 Implement ScoreCircle component with animation
    - Create `src/components/ScoreCircle.jsx`
    - Build SVG-based circular progress indicator
    - Implement animation from 0 to target score over 2 seconds
    - Apply gradient coloring based on score range
    - _Requirements: 1.2_
  
  - [x] 2.3 Implement PillarBreakdown component
    - Create `src/components/PillarBreakdown.jsx`
    - Display all nine pillar scores with weights and contribution percentages
    - Use grid or list layout with visual indicators
    - _Requirements: 1.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  
  - [x] 2.4 Implement ValidationFlags component
    - Create `src/components/ValidationFlags.jsx`
    - Display all validation flags with severity indicators
    - Show flag type, message, and impact
    - _Requirements: 1.5_
  
  - [x] 2.5 Implement Recommendations component
    - Create `src/components/Recommendations.jsx`
    - Display recommendations from score calculation
    - Show title, description, and impact for each recommendation
    - _Requirements: 1.6_
  
  - [x] 2.6 Wire DashboardPage components together
    - Import and integrate ScoreCircle, PillarBreakdown, ValidationFlags, and Recommendations
    - Implement "Take Assessment" button navigation to assessment page
    - Implement preview state display with sample data
    - _Requirements: 1.8, 1.9_
  
  - [ ]* 2.7 Write property test for Score Display Completeness
    - **Property 1: Score Display Completeness**
    - **Validates: Requirements 1.1, 1.3, 1.4**
    - Verify that for any valid score data structure, Dashboard rendering includes composite_score, score_band, and pillar_breakdown
  
  - [ ]* 2.8 Write property test for Score Band Mapping Consistency
    - **Property 2: Score Band Mapping Consistency**
    - **Validates: Requirements 1.3**
    - Verify that for any score between 300-850, the displayed band matches the correct range

- [x] 3. Implement Dashboard Page styling
  - [x] 3.1 Create DashboardPage.css with consistent styling
    - Create `src/styles/DashboardPage.css`
    - Apply styling patterns matching CreditScorePage.css
    - Use consistent CSS class naming conventions
    - Implement score band color scheme
    - Style navigation, cards, buttons, and layout
    - _Requirements: 8.1, 8.3_
  
  - [ ]* 3.2 Write unit tests for Dashboard components
    - Test DashboardPage rendering in different states (loading, preview, data loaded)
    - Test authentication redirect on missing token
    - Test error handling for API failures

- [ ] 4. Checkpoint - Verify Dashboard functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Assessment Page structure and navigation
  - [x] 5.1 Create AssessmentPage component with session management
    - Create `src/pages/AssessmentPage.jsx`
    - Implement authentication check on mount (retrieve JWT from localStorage)
    - Implement session loading (retrieve or create active session)
    - Manage state for session, currentSectionIndex, answers, errors, loading
    - Handle 401 errors by redirecting to login
    - _Requirements: 3.1, 5.1, 5.2, 5.3, 5.4, 10.2, 10.4_
  
  - [x] 5.2 Define assessment section configuration
    - Create section configuration array with all nine pillars
    - Define questions for each section with types, labels, validation rules
    - Include Financial Obligations (15%), Income & Employment (15%), Mobile Money (12%), Assets (12%), Savings & Banking (12%), Expense Management (12%), Household Profile (8%), Financial Literacy (8%), Business Profile (6%)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  
  - [x] 5.3 Implement ProgressBar component
    - Create `src/components/ProgressBar.jsx`
    - Display visual progress bar with completion percentage
    - Show section indicators (dots or numbers)
    - Highlight current section
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [x] 5.4 Implement section navigation logic
    - Implement `validateSection()` to validate current section fields
    - Implement `saveAndAdvance()` to save answers and advance to next section
    - Handle "Next" button click with validation
    - Handle "Submit" button on final section
    - Prevent navigation if validation fails
    - _Requirements: 3.11, 3.12, 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_
  
  - [x] 5.5 Write property test for Single Section Visibility
    - **Property 6: Single Section Visibility**
    - **Validates: Requirements 3.1**
    - Verify that rendered Assessment page displays exactly one section's questions
  
  - [x] 5.6 Write property test for Progress Calculation Accuracy
    - **Property 7: Progress Calculation Accuracy**
    - **Validates: Requirements 3.3**
    - Verify that completion percentage equals (N / M) × 100 for N completed sections out of M total

- [x] 6. Implement Assessment Page input components
  - [x] 6.1 Create QuestionRenderer component
    - Create `src/components/QuestionRenderer.jsx`
    - Implement logic to render appropriate input based on question type
    - Handle question props (id, type, label, required, options, validation)
    - Pass value, error, and onChange handler to child input components
    - _Requirements: 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_
  
  - [x] 6.2 Create input components for all question types
    - Create `src/components/inputs/TextInput.jsx` with label, value, error display
    - Create `src/components/inputs/NumberInput.jsx` with min/max validation attributes
    - Create `src/components/inputs/SelectInput.jsx` with options dropdown
    - Create `src/components/inputs/RadioInput.jsx` with radio button group
    - Create `src/components/inputs/CheckboxInput.jsx` with checkbox group
    - Create `src/components/inputs/DateInput.jsx` with date picker
    - Apply consistent styling with error state handling
    - _Requirements: 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 4.2, 9.5_
  
  - [ ]* 6.3 Write property test for Required Field Validation Enforcement
    - **Property 8: Required Field Validation Enforcement**
    - **Validates: Requirements 4.1, 4.3**
    - Verify that attempting to advance with empty required fields prevents navigation
  
  - [ ]* 6.4 Write property test for Optional Field Acceptance
    - **Property 10: Optional Field Acceptance**
    - **Validates: Requirements 4.6**
    - Verify that leaving optional fields empty allows validation to pass when all required fields are valid

- [x] 7. Implement Assessment submission and score calculation flow
  - [x] 7.1 Implement submission logic on final section
    - In AssessmentPage, implement `handleSubmit()` method
    - Validate final section fields
    - Save final section answers via AssessmentService
    - Mark session as completed via `markCompleted()`
    - Trigger score calculation via ScoreService
    - Display success message
    - Redirect to Dashboard after 2-second delay
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 7.2 Write property test for Validation Error Display
    - **Property 9: Validation Error Display**
    - **Validates: Requirements 4.2, 9.5**
    - Verify that for any invalid required field, an error message is displayed adjacent to that field
  
  - [ ]* 7.3 Write property test for Successful Save Triggers Progression
    - **Property 11: Successful Save Triggers Progression**
    - **Validates: Requirements 4.5**
    - Verify that when save operation completes successfully, current section index advances by one

- [x] 8. Implement Assessment Page styling
  - [x] 8.1 Create AssessmentPage.css with consistent styling
    - Create `src/styles/AssessmentPage.css`
    - Apply styling patterns matching CreditScorePage.css
    - Style form fields, buttons, progress bar, section layout
    - Implement error message styling
    - Apply responsive design for different screen sizes
    - _Requirements: 8.2, 8.4_
  
  - [ ]* 8.2 Write unit tests for Assessment components
    - Test AssessmentPage session loading and creation
    - Test input component rendering for all types
    - Test validation logic for required and optional fields
    - Test navigation between sections

- [x] 9. Implement error handling across both pages
  - [x] 9.1 Add network error handling
    - Implement error handling for network failures in Dashboard and Assessment
    - Display user-friendly error messages for connection issues
    - _Requirements: 9.1, 9.2_
  
  - [x] 9.2 Add server error handling
    - Implement error handling for 500 server errors
    - Display appropriate error messages for server issues
    - _Requirements: 9.3, 9.4_
  
  - [ ]* 9.3 Write property test for Authentication Header Inclusion
    - **Property 5: Authentication Header Inclusion**
    - **Validates: Requirements 2.2, 5.5**
    - Verify that when JWT token exists in localStorage, all API requests include Authorization header

- [x] 10. Update routing and integrate pages into application
  - [x] 10.1 Update App.jsx with new routes
    - Import DashboardPage and AssessmentPage components
    - Add `/dashboard` route for DashboardPage
    - Add `/assessment` route for AssessmentPage
    - Update redirect logic if needed
    - _Requirements: 1.9_
  
  - [ ]* 10.2 Write property test for Session Progress Restoration
    - **Property 12: Session Progress Restoration**
    - **Validates: Requirements 5.4**
    - Verify that Assessment page displays section corresponding to current_section value from session
  
  - [ ]* 10.3 Write integration tests for full user flows
    - Test complete assessment flow from start to submission
    - Test dashboard navigation to assessment and back
    - Test authentication flows and redirects

- [ ] 11. Final checkpoint - Verify complete implementation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation uses React with JavaScript (JSX)
- Authentication is handled via JWT tokens stored in localStorage
- The design follows existing patterns from CreditScorePage.jsx for consistency
- All API communication goes through the service layer for maintainability
- Client-side validation prevents unnecessary API calls
- Property tests validate universal correctness properties from the design document
- Unit tests cover specific examples and edge cases

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "5.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.5", "5.2", "5.3"] },
    { "id": 4, "tasks": ["2.6", "2.7", "2.8", "5.4", "5.5", "5.6", "6.1"] },
    { "id": 5, "tasks": ["3.1", "6.2", "6.3", "6.4"] },
    { "id": 6, "tasks": ["3.2", "7.1", "7.2", "7.3", "8.1"] },
    { "id": 7, "tasks": ["8.2", "9.1", "9.2", "9.3"] },
    { "id": 8, "tasks": ["10.1", "10.2", "10.3"] }
  ]
}
```
