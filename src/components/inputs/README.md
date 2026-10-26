# Input Components

This directory contains reusable form input components for the Credit Score Assessment feature. Each component follows consistent styling patterns, accessibility guidelines, and error handling requirements.

## Components

### TextInput

Single-line text input component for free-form text entry.

**Props:**
- `id` (string, required) - Unique input identifier
- `label` (string, required) - Display label for the input
- `value` (string) - Current input value
- `error` (string|null) - Error message to display
- `required` (boolean) - Whether the field is required
- `onChange` (function, required) - Handler called when value changes: `(id, value) => void`

**Example:**
```jsx
<TextInput
  id="full_name"
  label="Full Name"
  value={name}
  error={errors.full_name}
  required={true}
  onChange={handleChange}
/>
```

**Validates Requirements:** 3.5, 4.2, 9.5

---

### NumberInput

Numeric input component with min/max validation attributes and range hints.

**Props:**
- `id` (string, required) - Unique input identifier
- `label` (string, required) - Display label for the input
- `value` (number|null) - Current input value
- `error` (string|null) - Error message to display
- `required` (boolean) - Whether the field is required
- `validation` (object) - Validation rules with `min` and `max` properties
- `onChange` (function, required) - Handler called when value changes: `(id, value) => void`

**Example:**
```jsx
<NumberInput
  id="monthly_income"
  label="Monthly Income"
  value={income}
  error={errors.monthly_income}
  required={true}
  validation={{ min: 0, max: 1000000 }}
  onChange={handleChange}
/>
```

**Features:**
- Displays range hint below input (e.g., "Range: 0 - 1000000")
- Converts empty input to `null` for consistent validation
- HTML5 min/max attributes for browser validation

**Validates Requirements:** 3.6, 4.2, 9.5

---

### SelectInput

Dropdown select component for choosing from predefined options.

**Props:**
- `id` (string, required) - Unique input identifier
- `label` (string, required) - Display label for the input
- `value` (string) - Current selected value
- `error` (string|null) - Error message to display
- `required` (boolean) - Whether the field is required
- `options` (array, required) - Array of option objects: `[{ value: string, label: string }]`
- `onChange` (function, required) - Handler called when value changes: `(id, value) => void`

**Example:**
```jsx
<SelectInput
  id="employment_status"
  label="Employment Status"
  value={status}
  error={errors.employment_status}
  required={true}
  options={[
    { value: 'employed', label: 'Employed' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'unemployed', label: 'Unemployed' }
  ]}
  onChange={handleChange}
/>
```

**Features:**
- Includes default "Select an option" placeholder
- Custom dropdown arrow styling
- Keyboard navigable

**Validates Requirements:** 3.7, 4.2, 9.5

---

### RadioInput

Radio button group component for selecting a single option.

**Props:**
- `id` (string, required) - Unique input identifier
- `label` (string, required) - Display label for the input group
- `value` (string) - Current selected value
- `error` (string|null) - Error message to display
- `required` (boolean) - Whether the field is required
- `options` (array, required) - Array of option objects: `[{ value: string, label: string }]`
- `onChange` (function, required) - Handler called when value changes: `(id, value) => void`

**Example:**
```jsx
<RadioInput
  id="owns_home"
  label="Do you own your home?"
  value={ownsHome}
  error={errors.owns_home}
  required={true}
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ]}
  onChange={handleChange}
/>
```

**Features:**
- Each option rendered as a clickable card
- Selected option visually highlighted
- Uses fieldset/legend for accessibility

**Validates Requirements:** 3.8, 4.2, 9.5

---

### CheckboxInput

Checkbox group component for multiple selections.

**Props:**
- `id` (string, required) - Unique input identifier
- `label` (string, required) - Display label for the input group
- `value` (array) - Array of currently selected values
- `error` (string|null) - Error message to display
- `options` (array, required) - Array of option objects: `[{ value: string, label: string }]`
- `onChange` (function, required) - Handler called when value changes: `(id, value) => void`

**Example:**
```jsx
<CheckboxInput
  id="income_sources"
  label="Income Sources"
  value={sources}
  error={errors.income_sources}
  options={[
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business' },
    { value: 'investments', label: 'Investments' }
  ]}
  onChange={handleChange}
/>
```

**Features:**
- Returns array of selected values
- Each option rendered as a clickable card
- Uses fieldset/legend for accessibility

**Validates Requirements:** 3.9, 4.2, 9.5

---

### DateInput

Date picker input component for date selection.

**Props:**
- `id` (string, required) - Unique input identifier
- `label` (string, required) - Display label for the input
- `value` (string) - Current date value in YYYY-MM-DD format
- `error` (string|null) - Error message to display
- `required` (boolean) - Whether the field is required
- `onChange` (function, required) - Handler called when value changes: `(id, value) => void`

**Example:**
```jsx
<DateInput
  id="birth_date"
  label="Date of Birth"
  value={birthDate}
  error={errors.birth_date}
  required={true}
  onChange={handleChange}
/>
```

**Features:**
- Native browser date picker
- Returns date in YYYY-MM-DD format
- Accessible date selection

**Validates Requirements:** 3.10, 4.2, 9.5

---

## Styling

All components share consistent styling through `InputStyles.css`:

### Visual States

- **Default**: Clean white background with subtle border
- **Hover**: Border color changes on hover
- **Focus**: Blue border with focus ring (primary color)
- **Error**: Red border and background tint, with error icon and message
- **Disabled**: Reduced opacity and disabled cursor

### Color Scheme

Components use CSS custom properties for theming:

```css
--primary-color: #4f46e5 (indigo)
--text-primary: #111827 (gray-900)
--text-secondary: #6b7280 (gray-500)
--border: #e5e7eb (gray-200)
--background: #f9fafb (gray-50)
```

### Error Handling

Error states include:
- Red border color (#ef4444)
- Light red background tint
- Error icon (⚠) with error message
- ARIA attributes for screen readers

### Accessibility Features

- Proper label associations using `htmlFor`/`id`
- Required field indicators (*)
- Error messages with `role="alert"`
- ARIA attributes: `aria-invalid`, `aria-describedby`, `aria-required`
- Keyboard navigation support
- Focus visible outlines
- Fieldset/legend for radio and checkbox groups
- High contrast mode support
- Reduced motion support

### Responsive Design

Components adapt to different screen sizes:

- **Desktop** (>768px): Full padding and font sizes
- **Tablet** (≤768px): Slightly reduced padding
- **Mobile** (≤640px): Compact padding and smaller fonts

## Usage with QuestionRenderer

All input components are designed to work with the `QuestionRenderer` component:

```jsx
import QuestionRenderer from './QuestionRenderer';

<QuestionRenderer
  question={{
    id: 'monthly_income',
    type: 'number',
    label: 'Monthly Income',
    required: true,
    validation: { min: 0, max: 1000000 }
  }}
  value={answers.monthly_income}
  error={errors.monthly_income}
  onChange={handleChange}
/>
```

The `QuestionRenderer` automatically selects the correct input component based on `question.type`.

## Import Options

### Individual imports:
```jsx
import TextInput from './inputs/TextInput';
import NumberInput from './inputs/NumberInput';
```

### Barrel import:
```jsx
import { TextInput, NumberInput, SelectInput } from './inputs';
```

## Testing

All input components are tested through the `QuestionRenderer.test.jsx` suite, which validates:

- Correct rendering for each input type
- onChange handler behavior
- Error display and styling
- Accessibility attributes
- Edge cases (empty values, null values, missing options)

Run tests with:
```bash
npm test QuestionRenderer.test
```

## Browser Compatibility

Components use modern HTML5 input types and CSS features:

- HTML5 input types: text, number, date
- CSS Custom Properties (CSS Variables)
- CSS Grid and Flexbox
- Modern semantic HTML (fieldset, legend)

Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential improvements for future iterations:

1. **Custom date picker** - Replace native date input with custom UI
2. **Validation messages** - Built-in validation with custom messages
3. **Async validation** - Support for server-side validation
4. **Autocomplete** - Text input with suggestions
5. **File upload** - Component for file inputs
6. **Rich text** - Textarea with formatting options
7. **Phone input** - Formatted phone number input
8. **Currency input** - Formatted currency input with symbol

## Related Documentation

- [QuestionRenderer Component](../QuestionRenderer.jsx)
- [Design Document](../../../.kiro/specs/dashboard-and-assessment/design.md)
- [Requirements Document](../../../.kiro/specs/dashboard-and-assessment/requirements.md)
- [AssessmentPage Component](../../pages/AssessmentPage.jsx)
