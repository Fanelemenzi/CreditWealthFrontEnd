import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import '../styles/AssessmentPage.css';

/**
 * ProgressBarDemo - Demonstration component for ProgressBar
 * 
 * This file demonstrates the ProgressBar component with interactive controls
 * to verify it works correctly with different values.
 */
const ProgressBarDemo = () => {
  const [currentSection, setCurrentSection] = useState(2);
  const [totalSections] = useState(9);
  
  // Calculate completion percentage based on current section
  const completionPercentage = Math.round((currentSection / totalSections) * 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>ProgressBar Component Demo</h1>
      
      {/* Demo ProgressBar */}
      <ProgressBar 
        currentSection={currentSection}
        totalSections={totalSections}
        completionPercentage={completionPercentage}
      />

      {/* Interactive Controls */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: 'white', 
        borderRadius: '1rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#111827' }}>
          Controls
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
            Current Section: {currentSection + 1}
          </label>
          <input 
            type="range" 
            min="0" 
            max={totalSections - 1}
            value={currentSection}
            onChange={(e) => setCurrentSection(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              background: currentSection === 0 ? '#f3f4f6' : 'white',
              cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            Previous Section
          </button>
          
          <button 
            onClick={() => setCurrentSection(Math.min(totalSections - 1, currentSection + 1))}
            disabled={currentSection === totalSections - 1}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: currentSection === totalSections - 1 ? '#9ca3af' : '#4f46e5',
              color: 'white',
              cursor: currentSection === totalSections - 1 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            Next Section
          </button>
        </div>
      </div>

      {/* Component Info */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#f0fdf4',
        borderRadius: '1rem',
        border: '1px solid #86efac'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#166534' }}>
          ✓ Component Features
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#166534', fontSize: '0.875rem' }}>
          <li>Visual progress bar with animated fill</li>
          <li>Section indicators (dots) showing all sections</li>
          <li>Active section highlighted with pulse animation</li>
          <li>Completed sections marked with green color</li>
          <li>Text display: "Section X of Y - Z% Complete"</li>
          <li>Responsive design for mobile devices</li>
          <li>Smooth transitions and animations</li>
        </ul>
      </div>

      {/* Requirements Validation */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#eff6ff',
        borderRadius: '1rem',
        border: '1px solid #93c5fd'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e40af' }}>
          Requirements Validated
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e40af', fontSize: '0.875rem' }}>
          <li><strong>Requirement 3.2:</strong> Displays current section position</li>
          <li><strong>Requirement 3.3:</strong> Shows overall completion percentage</li>
          <li><strong>Requirement 3.4:</strong> Indicates section completion status</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressBarDemo;
