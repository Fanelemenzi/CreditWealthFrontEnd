/**
 * ValidationService
 * 
 * Provides client-side validation methods for form fields.
 * Validates required fields, number ranges, and entire sections.
 * 
 * Requirements: 4.1, 4.2, 4.3
 */

class ValidationService {
  /**
   * Validate that a value is not null, undefined, or empty string
   * 
   * @param {any} value - The value to validate
   * @returns {boolean} - True if value is valid (not null, undefined, or empty string)
   * 
   * Requirement 4.1: Required field validation
   */
  validateRequired(value) {
    // Check for null, undefined, and empty string
    if (value === null || value === undefined || value === '') {
      return false;
    }
    
    // For arrays (checkbox inputs), check if at least one item is selected
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    
    // For strings, trim whitespace and check if empty
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    
    return true;
  }

  /**
   * Validate that a value is a number within the specified range
   * 
   * @param {any} value - The value to validate
   * @param {number} [min] - Minimum allowed value (inclusive)
   * @param {number} [max] - Maximum allowed value (inclusive)
   * @returns {boolean} - True if value is a valid number within range
   * 
   * Requirement 4.2: Number range validation
   */
  validateNumber(value, min, max) {
    // Convert to number
    const num = parseFloat(value);
    
    // Check if it's a valid number
    if (isNaN(num)) {
      return false;
    }
    
    // Check minimum constraint
    if (min !== undefined && num < min) {
      return false;
    }
    
    // Check maximum constraint
    if (max !== undefined && num > max) {
      return false;
    }
    
    return true;
  }

  /**
   * Validate all fields in a section
   * 
   * @param {Array} questions - Array of question objects with validation rules
   * @param {Object} answers - Object mapping question IDs to their values
   * @returns {Object} - Object mapping question IDs to error messages (empty if no errors)
   * 
   * Requirements 4.1, 4.2, 4.3: Section validation with required and number field checks
   * 
   * @example
   * const questions = [
   *   { id: 'q1', required: true, type: 'text', label: 'Name' },
   *   { id: 'q2', required: true, type: 'number', validation: { min: 0, max: 100 } }
   * ];
   * const answers = { q1: 'John', q2: 50 };
   * const errors = validateSection(questions, answers);
   * // errors will be {} if all valid, or { q1: 'error message', ... } if invalid
   */
  validateSection(questions, answers) {
    const errors = {};
    
    questions.forEach(question => {
      const value = answers[question.id];
      
      // Validate required fields
      if (question.required && !this.validateRequired(value)) {
        errors[question.id] = 'This field is required';
        return; // Skip further validation if required check fails
      }
      
      // Validate number fields (only if value exists)
      if (question.type === 'number' && value !== null && value !== undefined && value !== '') {
        const { min, max } = question.validation || {};
        
        if (!this.validateNumber(value, min, max)) {
          let message = 'Please enter a valid number';
          
          if (min !== undefined && max !== undefined) {
            message = `Value must be between ${min} and ${max}`;
          } else if (min !== undefined) {
            message = `Value must be at least ${min}`;
          } else if (max !== undefined) {
            message = `Value must be at most ${max}`;
          }
          
          errors[question.id] = message;
        }
      }
      
      // Additional validation types can be added here in the future
      // e.g., email, phone, date range, etc.
    });
    
    return errors;
  }
}

// Export a singleton instance
export default new ValidationService();
