import React from 'react';
import './InputStyles.css';

/**
 * NumberInput - Numeric input component with min/max validation
 * 
 * Validates Requirements: 3.6, 4.2, 9.5
 * 
 * @param {string} id - Unique input identifier
 * @param {string} label - Display label for the input
 * @param {number|null} value - Current input value
 * @param {string|null} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {Object} validation - Validation rules with min and max properties
 * @param {number} validation.min - Minimum allowed value
 * @param {number} validation.max - Maximum allowed value
 * @param {Function} onChange - Handler called when value changes (id, value) => void
 */
const NumberInput = ({ id, label, value, error, required, validation, onChange }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    // Convert to number or null if empty
    onChange(id, val === '' ? null : parseFloat(val));
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={id}
        type="number"
        value={value ?? ''}
        min={validation?.min}
        max={validation?.max}
        onChange={handleChange}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={required}
      />
      {validation && (
        <span className="input-hint">
          {validation.min !== undefined && validation.max !== undefined
            ? `Range: ${validation.min} - ${validation.max}`
            : validation.min !== undefined
            ? `Minimum: ${validation.min}`
            : validation.max !== undefined
            ? `Maximum: ${validation.max}`
            : ''}
        </span>
      )}
      {error && (
        <span 
          id={`${id}-error`} 
          className="error-message" 
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default NumberInput;
