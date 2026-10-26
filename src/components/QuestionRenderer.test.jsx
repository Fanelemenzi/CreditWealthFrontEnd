import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionRenderer from './QuestionRenderer';

/**
 * Unit tests for QuestionRenderer component
 * Validates Requirements: 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 */
describe('QuestionRenderer', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Text Input Rendering', () => {
    it('should render text input for question type "text"', () => {
      const question = {
        id: 'test_text',
        type: 'text',
        label: 'Test Text Question',
        required: true
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByLabelText(/Test Text Question/)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should display required indicator for required text fields', () => {
      const question = {
        id: 'test_text_required',
        type: 'text',
        label: 'Required Text',
        required: true
      };

      const { container } = render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const requiredSpan = container.querySelector('.required');
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.textContent).toBe('*');
    });

    it('should call onChange with correct arguments when text input changes', () => {
      const question = {
        id: 'test_text_change',
        type: 'text',
        label: 'Text Input',
        required: false
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });

      expect(mockOnChange).toHaveBeenCalledWith('test_text_change', 'test value');
    });
  });

  describe('Number Input Rendering', () => {
    it('should render number input for question type "number"', () => {
      const question = {
        id: 'test_number',
        type: 'number',
        label: 'Test Number Question',
        required: true,
        validation: { min: 0, max: 100 }
      };

      render(
        <QuestionRenderer 
          question={question}
          value={50}
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByLabelText(/Test Number Question/)).toBeInTheDocument();
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
      expect(input.getAttribute('min')).toBe('0');
      expect(input.getAttribute('max')).toBe('100');
    });

    it('should call onChange with parsed number value', () => {
      const question = {
        id: 'test_number_change',
        type: 'number',
        label: 'Number Input',
        required: false,
        validation: { min: 0 }
      };

      render(
        <QuestionRenderer 
          question={question}
          value={null}
          error={null}
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42' } });

      expect(mockOnChange).toHaveBeenCalledWith('test_number_change', 42);
    });

    it('should handle empty number input by passing null', () => {
      const question = {
        id: 'test_number_empty',
        type: 'number',
        label: 'Number Input',
        required: false
      };

      render(
        <QuestionRenderer 
          question={question}
          value={42}
          error={null}
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });

      expect(mockOnChange).toHaveBeenCalledWith('test_number_empty', null);
    });
  });

  describe('Select Input Rendering', () => {
    it('should render select dropdown for question type "select"', () => {
      const question = {
        id: 'test_select',
        type: 'select',
        label: 'Test Select Question',
        required: true,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByLabelText(/Test Select Question/)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should call onChange when select option changes', () => {
      const question = {
        id: 'test_select_change',
        type: 'select',
        label: 'Select Input',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'opt2' } });

      expect(mockOnChange).toHaveBeenCalledWith('test_select_change', 'opt2');
    });
  });

  describe('Radio Input Rendering', () => {
    it('should render radio buttons for question type "radio"', () => {
      const question = {
        id: 'test_radio',
        type: 'radio',
        label: 'Test Radio Question',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Test Radio Question/)).toBeInTheDocument();
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(2);
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should call onChange when radio button is selected', () => {
      const question = {
        id: 'test_radio_change',
        type: 'radio',
        label: 'Radio Input',
        required: false,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);

      expect(mockOnChange).toHaveBeenCalledWith('test_radio_change', 'yes');
    });

    it('should check the radio button matching the current value', () => {
      const question = {
        id: 'test_radio_checked',
        type: 'radio',
        label: 'Radio Input',
        required: false,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value="no"
          error={null}
          onChange={mockOnChange}
        />
      );

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).toBeChecked();
    });
  });

  describe('Checkbox Input Rendering', () => {
    it('should render checkbox group for question type "checkbox"', () => {
      const question = {
        id: 'test_checkbox',
        type: 'checkbox',
        label: 'Test Checkbox Question',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' },
          { value: 'opt3', label: 'Option 3' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value={[]}
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Test Checkbox Question/)).toBeInTheDocument();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('should call onChange with updated array when checkbox is checked', () => {
      const question = {
        id: 'test_checkbox_add',
        type: 'checkbox',
        label: 'Checkbox Input',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value={['opt1']}
          error={null}
          onChange={mockOnChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      expect(mockOnChange).toHaveBeenCalledWith('test_checkbox_add', ['opt1', 'opt2']);
    });

    it('should call onChange with filtered array when checkbox is unchecked', () => {
      const question = {
        id: 'test_checkbox_remove',
        type: 'checkbox',
        label: 'Checkbox Input',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value={['opt1', 'opt2']}
          error={null}
          onChange={mockOnChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      expect(mockOnChange).toHaveBeenCalledWith('test_checkbox_remove', ['opt2']);
    });

    it('should check checkboxes matching values in the array', () => {
      const question = {
        id: 'test_checkbox_checked',
        type: 'checkbox',
        label: 'Checkbox Input',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' },
          { value: 'opt3', label: 'Option 3' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value={['opt1', 'opt3']}
          error={null}
          onChange={mockOnChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });
  });

  describe('Date Input Rendering', () => {
    it('should render date input for question type "date"', () => {
      const question = {
        id: 'test_date',
        type: 'date',
        label: 'Test Date Question',
        required: true
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByLabelText(/Test Date Question/)).toBeInTheDocument();
      const input = screen.getByLabelText(/Test Date Question/);
      expect(input.getAttribute('type')).toBe('date');
    });

    it('should call onChange with date value', () => {
      const question = {
        id: 'test_date_change',
        type: 'date',
        label: 'Date Input',
        required: false
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const input = screen.getByLabelText(/Date Input/);
      fireEvent.change(input, { target: { value: '2024-01-15' } });

      expect(mockOnChange).toHaveBeenCalledWith('test_date_change', '2024-01-15');
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      const question = {
        id: 'test_error',
        type: 'text',
        label: 'Test Question',
        required: true
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error="This field is required"
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply error class to input when error exists', () => {
      const question = {
        id: 'test_error_class',
        type: 'text',
        label: 'Test Question',
        required: true
      };

      const { container } = render(
        <QuestionRenderer 
          question={question}
          value=""
          error="Error message"
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('error');
    });

    it('should set aria-invalid attribute when error exists', () => {
      const question = {
        id: 'test_aria_invalid',
        type: 'number',
        label: 'Test Number',
        required: true
      };

      render(
        <QuestionRenderer 
          question={question}
          value={null}
          error="Invalid number"
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('spinbutton');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('Unknown Question Type', () => {
    it('should render error message for unknown question type', () => {
      const question = {
        id: 'test_unknown',
        type: 'unknown_type',
        label: 'Unknown Question',
        required: false
      };

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Unsupported question type: unknown_type/)).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Unknown question type: unknown_type');

      consoleSpy.mockRestore();
    });
  });

  describe('Null/Undefined Question', () => {
    it('should return null when question prop is null', () => {
      const { container } = render(
        <QuestionRenderer 
          question={null}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when question prop is undefined', () => {
      const { container } = render(
        <QuestionRenderer 
          question={undefined}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should associate labels with inputs using htmlFor/id', () => {
      const question = {
        id: 'test_accessibility',
        type: 'text',
        label: 'Accessible Input',
        required: true
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const input = screen.getByLabelText(/Accessible Input/);
      expect(input.getAttribute('id')).toBe('test_accessibility');
    });

    it('should associate error messages with inputs using aria-describedby', () => {
      const question = {
        id: 'test_aria_describedby',
        type: 'text',
        label: 'Test Input',
        required: true
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error="Error message"
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('textbox');
      const errorId = `${question.id}-error`;
      expect(input.getAttribute('aria-describedby')).toBe(errorId);
      
      const errorMessage = screen.getByText('Error message');
      expect(errorMessage.getAttribute('id')).toBe(errorId);
    });

    it('should use fieldset and legend for radio groups', () => {
      const question = {
        id: 'test_radio_fieldset',
        type: 'radio',
        label: 'Radio Group',
        required: true,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' }
        ]
      };

      const { container } = render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toBeTruthy();
      
      const legend = container.querySelector('legend');
      expect(legend).toBeTruthy();
      expect(legend.textContent).toContain('Radio Group');
    });

    it('should use fieldset and legend for checkbox groups', () => {
      const question = {
        id: 'test_checkbox_fieldset',
        type: 'checkbox',
        label: 'Checkbox Group',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' }
        ]
      };

      const { container } = render(
        <QuestionRenderer 
          question={question}
          value={[]}
          error={null}
          onChange={mockOnChange}
        />
      );

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toBeTruthy();
      
      const legend = container.querySelector('legend');
      expect(legend).toBeTruthy();
      expect(legend.textContent).toContain('Checkbox Group');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value for text input', () => {
      const question = {
        id: 'test_empty_text',
        type: 'text',
        label: 'Text Input',
        required: false
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input.value).toBe('');
    });

    it('should handle null value for checkbox input', () => {
      const question = {
        id: 'test_null_checkbox',
        type: 'checkbox',
        label: 'Checkbox Input',
        required: false,
        options: [
          { value: 'opt1', label: 'Option 1' }
        ]
      };

      render(
        <QuestionRenderer 
          question={question}
          value={null}
          error={null}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle question without options for select', () => {
      const question = {
        id: 'test_no_options',
        type: 'select',
        label: 'Select Input',
        required: false
      };

      render(
        <QuestionRenderer 
          question={question}
          value=""
          error={null}
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // Should only have the default "Select an option" option
      expect(select.children).toHaveLength(1);
    });
  });
});
