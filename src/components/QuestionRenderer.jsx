import React from 'react';
import TextInput from './inputs/TextInput';
import NumberInput from './inputs/NumberInput';
import SelectInput from './inputs/SelectInput';
import RadioInput from './inputs/RadioInput';
import CheckboxInput from './inputs/CheckboxInput';
import DateInput from './inputs/DateInput';

/**
 * QuestionRenderer - Renders appropriate input component based on question type
 * 
 * This component acts as a router to render the correct input component
 * (TextInput, NumberInput, SelectInput, RadioInput, CheckboxInput, DateInput)
 * based on the question.type prop.
 * 
 * Validates Requirements: 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 */

/**
 * QuestionRenderer component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.question - Question configuration object
 * @param {string} props.question.id - Unique question identifier
 * @param {string} props.question.type - Question type ('text', 'number', 'select', 'radio', 'checkbox', 'date')
 * @param {string} props.question.label - Display label for the question
 * @param {boolean} props.question.required - Whether the question is required
 * @param {Array} props.question.options - Options array for select, radio, checkbox types
 * @param {Object} props.question.validation - Validation rules (e.g., min, max for numbers)
 * @param {*} props.value - Current value of the question
 * @param {string|null} props.error - Error message to display
 * @param {Function} props.onChange - Handler called when value changes (id, value) => void
 */
const QuestionRenderer = ({ question, value, error, onChange }) => {
  if (!question) {
    return null;
  }

  const commonProps = {
    id: question.id,
    label: question.label,
    value,
    error,
    required: question.required,
    onChange
  };

  // Render appropriate input component based on question type
  switch (question.type) {
    case 'text':
      return <TextInput {...commonProps} />;
    
    case 'number':
      return (
        <NumberInput 
          {...commonProps} 
          validation={question.validation}
        />
      );
    
    case 'select':
      return (
        <SelectInput 
          {...commonProps} 
          options={question.options}
        />
      );
    
    case 'radio':
      return (
        <RadioInput 
          {...commonProps} 
          options={question.options}
        />
      );
    
    case 'checkbox':
      return (
        <CheckboxInput 
          {...commonProps} 
          options={question.options}
        />
      );
    
    case 'date':
      return <DateInput {...commonProps} />;
    
    default:
      console.warn(`Unknown question type: ${question.type}`);
      return (
        <div className="form-field">
          <p className="error-message">
            Unsupported question type: {question.type}
          </p>
        </div>
      );
  }
};

export default QuestionRenderer;
