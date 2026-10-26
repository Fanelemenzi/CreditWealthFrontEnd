import React from 'react';
import './InputStyles.css';

/**
 * SelectInput - Dropdown select input component
 * 
 * Validates Requirements: 3.7, 4.2, 9.5
 * 
 * @param {string} id - Unique input identifier
 * @param {string} label - Display label for the input
 * @param {string} value - Current selected value
 * @param {string|null} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {Array<{value: string, label: string}>} options - Array of option objects
 * @param {Function} onChange - Handler called when value changes (id, value) => void
 */
const SelectInput = ({ id, label, value, error, required, options, onChange }) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        className={`form-select ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={required}
      >
        <option value="">Select an option</option>
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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

export default SelectInput;
