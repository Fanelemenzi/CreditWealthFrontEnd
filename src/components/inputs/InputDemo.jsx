import React, { useState } from 'react';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import SelectInput from './SelectInput';
import RadioInput from './RadioInput';
import CheckboxInput from './CheckboxInput';
import DateInput from './DateInput';
import './InputStyles.css';

/**
 * InputDemo - Demo component showcasing all input types
 * 
 * This component is for development and testing purposes only.
 * It demonstrates all input components with various configurations.
 */
const InputDemo = () => {
  const [values, setValues] = useState({
    full_name: '',
    monthly_income: null,
    employment_status: '',
    owns_home: '',
    income_sources: [],
    birth_date: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleValidate = () => {
    const newErrors = {};
    
    if (!values.full_name) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!values.monthly_income) {
      newErrors.monthly_income = 'Monthly income is required';
    } else if (values.monthly_income < 0 || values.monthly_income > 1000000) {
      newErrors.monthly_income = 'Value must be between 0 and 1000000';
    }
    
    if (!values.employment_status) {
      newErrors.employment_status = 'Employment status is required';
    }
    
    if (!values.owns_home) {
      newErrors.owns_home = 'This field is required';
    }
    
    if (!values.birth_date) {
      newErrors.birth_date = 'Date of birth is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('All fields are valid! ✓\n\n' + JSON.stringify(values, null, 2));
    }
  };

  const handleReset = () => {
    setValues({
      full_name: '',
      monthly_income: null,
      employment_status: '',
      owns_home: '',
      income_sources: [],
      birth_date: ''
    });
    setErrors({});
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        Input Components Demo
      </h1>

      <TextInput
        id="full_name"
        label="Full Name"
        value={values.full_name}
        error={errors.full_name}
        required={true}
        onChange={handleChange}
      />

      <NumberInput
        id="monthly_income"
        label="Monthly Income"
        value={values.monthly_income}
        error={errors.monthly_income}
        required={true}
        validation={{ min: 0, max: 1000000 }}
        onChange={handleChange}
      />

      <SelectInput
        id="employment_status"
        label="Employment Status"
        value={values.employment_status}
        error={errors.employment_status}
        required={true}
        options={[
          { value: 'employed', label: 'Employed' },
          { value: 'self_employed', label: 'Self-Employed' },
          { value: 'unemployed', label: 'Unemployed' },
          { value: 'student', label: 'Student' },
          { value: 'retired', label: 'Retired' }
        ]}
        onChange={handleChange}
      />

      <RadioInput
        id="owns_home"
        label="Do you own your home?"
        value={values.owns_home}
        error={errors.owns_home}
        required={true}
        options={[
          { value: 'yes', label: 'Yes, I own my home' },
          { value: 'no', label: 'No, I rent' },
          { value: 'other', label: 'Other arrangement' }
        ]}
        onChange={handleChange}
      />

      <CheckboxInput
        id="income_sources"
        label="Income Sources (Optional)"
        value={values.income_sources}
        error={errors.income_sources}
        options={[
          { value: 'salary', label: 'Salary/Wages' },
          { value: 'business', label: 'Business Income' },
          { value: 'investments', label: 'Investments' },
          { value: 'rental', label: 'Rental Income' },
          { value: 'pension', label: 'Pension/Social Security' }
        ]}
        onChange={handleChange}
      />

      <DateInput
        id="birth_date"
        label="Date of Birth"
        value={values.birth_date}
        error={errors.birth_date}
        required={true}
        onChange={handleChange}
      />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          onClick={handleValidate}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Validate Form
        </button>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#4f46e5',
            border: '2px solid #4f46e5',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Reset Form
        </button>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f9fafb', 
        borderRadius: '0.5rem',
        fontSize: '0.875rem'
      }}>
        <strong>Current Values:</strong>
        <pre style={{ marginTop: '0.5rem', overflow: 'auto' }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default InputDemo;
