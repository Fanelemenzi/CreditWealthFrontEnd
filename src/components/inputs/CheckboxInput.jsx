import React from 'react';
import './InputStyles.css';

/**
 * CheckboxInput - Checkbox group component for multiple selections
 * 
 * Validates Requirements: 3.9, 4.2, 9.5
 * 
 * @param {string} id - Unique input identifier
 * @param {string} label - Display label for the input group
 * @param {Array<string>} value - Array of currently selected values
 * @param {string|null} error - Error message to display
 * @param {Array<{value: string, label: string}>} options - Array of option objects
 * @param {Function} onChange - Handler called when value changes (id, value) => void
 */
const CheckboxInput = ({ id, label, value, error, options, onChange }) => {
  const handleCheckboxChange = (optionValue, isChecked) => {
    const newValue = isChecked
      ? [...(value || []), optionValue]
      : (value || []).filter(v => v !== optionValue);
    onChange(id, newValue);
  };

  return (
    <div className="form-field">
      <fieldset className="input-fieldset">
        <legend className="form-label">{label}</legend>
        <div 
          className="checkbox-group" 
          role="group" 
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {options?.map(opt => (
            <label key={opt.value} className="checkbox-label">
              <input
                type="checkbox"
                value={opt.value}
                checked={(value || []).includes(opt.value)}
                onChange={(e) => handleCheckboxChange(opt.value, e.target.checked)}
                aria-invalid={error ? 'true' : 'false'}
                className="checkbox-input"
              />
              <span className="checkbox-text">{opt.label}</span>
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

export default CheckboxInput;
