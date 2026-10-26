import React from 'react';
import './InputStyles.css';

/**
 * RadioInput - Radio button group component
 * 
 * Validates Requirements: 3.8, 4.2, 9.5
 * 
 * @param {string} id - Unique input identifier
 * @param {string} label - Display label for the input group
 * @param {string} value - Current selected value
 * @param {string|null} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {Array<{value: string, label: string}>} options - Array of option objects
 * @param {Function} onChange - Handler called when value changes (id, value) => void
 */
const RadioInput = ({ id, label, value, error, required, options, onChange }) => {
  return (
    <div className="form-field">
      <fieldset className="input-fieldset">
        <legend className="form-label">
          {label} {required && <span className="required">*</span>}
        </legend>
        <div 
          className="radio-group" 
          role="radiogroup" 
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {options?.map(opt => (
            <label key={opt.value} className="radio-label">
              <input
                type="radio"
                name={id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(id, e.target.value)}
                aria-invalid={error ? 'true' : 'false'}
                className="radio-input"
              />
              <span className="radio-text">{opt.label}</span>
            </label>
          ))}
        </div>
        {error && (
          <span 
            id={`${id}-error`} 
            className="error-message" 
            role="alert"
          >
            {error}
          </span>
        )}
      </fieldset>
    </div>
  );
};

export default RadioInput;
