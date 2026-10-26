# Requirements Document

## Introduction

This document specifies the requirements for the Credit Score Dashboard and Assessment feature. The feature enables users to view their credit score breakdown and complete a comprehensive financial assessment through a multi-step wizard interface. The system comprises two primary interfaces: a Dashboard Page displaying credit score analytics and recommendations, and an Assessment Page collecting financial data across nine categories.

## Glossary

- **Dashboard_Page**: The main interface displaying the user's credit score, pillar breakdowns, validation flags, and recommendations
- **Assessment_Page**: The multi-step wizard interface for collecting user financial data across nine sections
- **Assessment_Session**: A server-side entity tracking the user's progress through the assessment questions
- **Credit_Score**: A numerical value between 300-850 representing the user's creditworthiness
- **Pillar**: One of nine categories of financial data, each with an assigned weight contributing to the overall Credit_Score
- **Score_Band**: A categorical classification of Credit_Score (Poor, Weak, Fair, Good, Excellent)
- **Section**: A group of related questions within the Assessment_Page corresponding to one Pillar
- **Progress_Bar**: A visual indicator showing the user's current position and completion status in the Assessment_Page
- **Validation_Flag**: A server-provided indicator of data quality issues or warnings associated with the Credit_Score
- **Preview_State**: The Dashboard_Page display mode showing sample data when no actual Credit_Score exists
- **JWT_Token**: JSON Web Token stored in localStorage for authenticating API requests
- **Optional_Field**: An input field that the user may leave empty without preventing section progression
- **Required_Field**: An input field that must contain valid data before the user can advance to the next Section

## Requirements

### Requirement 1: Dashboard Page Display

**User Story:** As a user, I want to view my credit score and its detailed breakdown, so that I understand my financial standing and areas for improvement

#### Acceptance Criteria

1. WHEN the user navigates to the Dashboard_Page and a Credit_Score exists, THE Dashboard_Page SHALL display the Credit_Score as a numeric value between 300 and 850
2. WHEN the user navigates to the Dashboard_Page and a Credit_Score exists, THE Dashboard_Page SHALL display an animated score circle visualization
3. WHEN the user navigates to the Dashboard_Page and a Credit_Score exists, THE Dashboard_Page SHALL display the corresponding Score_Band indicator
4. WHEN the user navigates to the Dashboard_Page and a Credit_Score exists, THE Dashboard_Page SHALL display all nine Pillar scores with their individual contribution percentages
5. WHERE Validation_Flag data exists, THE Dashboard_Page SHALL display the validation warnings
6. WHERE recommendation data exists, THE Dashboard_Page SHALL display the recommendations from the score calculation API
7. WHEN the user navigates to the Dashboard_Page and no Credit_Score exists, THE Dashboard_Page SHALL display the Preview_State with sample data
8. WHILE the Dashboard_Page is in Preview_State, THE Dashboard_Page SHALL display a "Take Assessment" call-to-action button
9. WHEN the user clicks the "Take Assessment" button in Preview_State, THE Dashboard_Page SHALL navigate the user to the Assessment_Page

### Requirement 2: Dashboard Page Authentication

**User Story:** As a user, I want my dashboard data to be secure and personalized, so that only I can view my financial information

#### Acceptance Criteria

1. WHEN the Dashboard_Page loads, THE Dashboard_Page SHALL retrieve the JWT_Token from localStorage
2. WHEN the Dashboard_Page retrieves the Credit_Score data, THE Dashboard_Page SHALL include the JWT_Token in the API request headers
3. IF the API returns a 401 error response, THEN THE Dashboard_Page SHALL redirect the user to the login page
4. THE Dashboard_Page SHALL use the fetch API to retrieve Credit_Score data from the backend

### Requirement 3: Assessment Page Structure

**User Story:** As a user, I want to complete a structured financial assessment, so that the system can calculate my credit score accurately

#### Acceptance Criteria

1. THE Assessment_Page SHALL display one Section at a time
2. THE Assessment_Page SHALL display a Progress_Bar showing the current Section position
3. THE Assessment_Page SHALL display a Progress_Bar showing the overall completion percentage
4. THE Assessment_Page SHALL display the Section completion percentage
5. THE Assessment_Page SHALL support text input fields
6. THE Assessment_Page SHALL support number input fields
7. THE Assessment_Page SHALL support select dropdown fields
8. THE Assessment_Page SHALL support radio button fields
9. THE Assessment_Page SHALL support checkbox fields
10. THE Assessment_Page SHALL support date input fields
11. THE Assessment_Page SHALL display a "Next" button for advancing to the next Section
12. WHERE the user is on the final Section, THE Assessment_Page SHALL display a "Submit" button instead of a "Next" button

### Requirement 4: Assessment Page Navigation

**User Story:** As a user, I want to progress through the assessment in a structured manner, so that I provide all necessary information

#### Acceptance Criteria

1. WHEN the user clicks the "Next" button, THE Assessment_Page SHALL validate all Required_Field inputs in the current Section
2. IF validation fails on any Required_Field, THEN THE Assessment_Page SHALL display validation error messages
3. IF validation fails on any Required_Field, THEN THE Assessment_Page SHALL prevent navigation to the next Section
4. WHEN validation succeeds for all Required_Field inputs and the user clicks "Next", THE Assessment_Page SHALL save the Section answers to the backend
5. WHEN the Section answers are successfully saved, THE Assessment_Page SHALL advance to the next Section
6. THE Assessment_Page SHALL allow the user to leave Optional_Field inputs empty
7. THE Assessment_Page SHALL enforce linear progression through Sections

### Requirement 5: Assessment Session Management

**User Story:** As a user, I want my assessment progress to be saved, so that I can resume if I navigate away

#### Acceptance Criteria

1. WHEN the Assessment_Page loads, THE Assessment_Page SHALL retrieve the JWT_Token from localStorage
2. WHEN the Assessment_Page loads, THE Assessment_Page SHALL request the active Assessment_Session from the backend
3. IF no active Assessment_Session exists, THEN THE Assessment_Page SHALL create a new Assessment_Session
4. WHEN the Assessment_Session is retrieved, THE Assessment_Page SHALL display the Section corresponding to the saved progress
5. WHEN the user clicks "Next", THE Assessment_Page SHALL save the current Section answers using the Assessment_Session API
6. IF the API returns a 401 error response during any operation, THEN THE Assessment_Page SHALL redirect the user to the login page

### Requirement 6: Assessment Submission and Score Calculation

**User Story:** As a user, I want my assessment to be submitted and scored automatically, so that I receive immediate feedback

#### Acceptance Criteria

1. WHEN the user clicks the "Submit" button on the final Section and validation succeeds, THE Assessment_Page SHALL save the final Section answers
2. WHEN the final Section answers are saved successfully, THE Assessment_Page SHALL submit the Assessment_Session to the backend
3. WHEN the Assessment_Session is submitted successfully, THE Assessment_Page SHALL request score calculation from the backend
4. WHEN the score calculation completes successfully, THE Assessment_Page SHALL display a success message
5. WHEN the success message is displayed, THE Assessment_Page SHALL wait 2 seconds
6. WHEN the 2 second delay completes, THE Assessment_Page SHALL redirect the user to the Dashboard_Page

### Requirement 7: Assessment Pillar Configuration

**User Story:** As a system administrator, I want the assessment to cover all nine financial pillars with correct weightings, so that the credit score calculation is accurate

#### Acceptance Criteria

1. THE Assessment_Page SHALL include a Section for Financial Obligations with 15% weight
2. THE Assessment_Page SHALL include a Section for Income and Employment with 15% weight
3. THE Assessment_Page SHALL include a Section for Mobile Money with 12% weight
4. THE Assessment_Page SHALL include a Section for Assets with 12% weight
5. THE Assessment_Page SHALL include a Section for Savings and Banking with 12% weight
6. THE Assessment_Page SHALL include a Section for Expense Management with 12% weight
7. THE Assessment_Page SHALL include a Section for Household Profile with 8% weight
8. THE Assessment_Page SHALL include a Section for Financial Literacy with 8% weight
9. THE Assessment_Page SHALL include a Section for Business Profile with 6% weight

### Requirement 8: Visual Consistency and Styling

**User Story:** As a user, I want the dashboard and assessment pages to match the existing application design, so that the experience feels cohesive

#### Acceptance Criteria

1. THE Dashboard_Page SHALL apply styling patterns consistent with CreditScorePage.jsx
2. THE Assessment_Page SHALL apply styling patterns consistent with CreditScorePage.jsx
3. THE Dashboard_Page SHALL use CSS class naming conventions matching the existing codebase
4. THE Assessment_Page SHALL use CSS class naming conventions matching the existing codebase

### Requirement 9: Error Handling

**User Story:** As a user, I want clear feedback when errors occur, so that I can take appropriate action

#### Acceptance Criteria

1. IF an API request fails with a network error, THEN THE Dashboard_Page SHALL display an error message
2. IF an API request fails with a network error, THEN THE Assessment_Page SHALL display an error message
3. IF an API request fails with a server error, THEN THE Dashboard_Page SHALL display an error message indicating the issue
4. IF an API request fails with a server error, THEN THE Assessment_Page SHALL display an error message indicating the issue
5. WHEN validation errors occur on the Assessment_Page, THE Assessment_Page SHALL display field-specific error messages adjacent to the invalid fields

### Requirement 10: Data Persistence

**User Story:** As a user, I want my authentication state maintained across page navigations, so that I don't need to log in repeatedly

#### Acceptance Criteria

1. THE Dashboard_Page SHALL retrieve the JWT_Token from localStorage on page load
2. THE Assessment_Page SHALL retrieve the JWT_Token from localStorage on page load
3. WHEN the JWT_Token is missing from localStorage, THE Dashboard_Page SHALL redirect to the login page
4. WHEN the JWT_Token is missing from localStorage, THE Assessment_Page SHALL redirect to the login page
