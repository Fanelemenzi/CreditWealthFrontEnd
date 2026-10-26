import React from 'react';
import './InputStyles.css';

/**
 * DateInput - Date picker input component
 * 
 * Validates Requirements: 3.10, 4.2, 9.5
 * 
 * @param {string} id - Unique input identifier
 * @param {string} label - Display label for the input
 * @param {string} value - Current date value in YYYY-MM-DD format
 * @param {string|null} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {Function} onChange - Handler called when value changes (id, value) => void
 */
const DateInput = ({ id, label, value, error, required, onChange }) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={id}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={required}
      />
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

export default DateInput;
