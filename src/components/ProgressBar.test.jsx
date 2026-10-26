import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';

/**
 * Unit tests for ProgressBar component
 * 
 * Tests:
 * - Component renders with correct props
 * - Progress bar displays correct width
 * - Progress text shows correct section and percentage
 * - Correct number of section indicators
 * - Active and completed indicators have correct classes
 */
describe('ProgressBar', () => {
  it('renders with basic props', () => {
    render(
      <ProgressBar 
        currentSection={2} 
        totalSections={9} 
        completionPercentage={33} 
      />
    );
    
    // Check progress text
    expect(screen.getByText(/Section 3 of 9/i)).toBeInTheDocument();
    expect(screen.getByText(/33% Complete/i)).toBeInTheDocument();
  });

  it('displays progress bar with correct width', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={4} 
        totalSections={9} 
        completionPercentage={50} 
      />
    );
    
    const progressFill = container.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle({ width: '50%' });
  });

  it('renders correct number of section indicators', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={0} 
        totalSections={9} 
        completionPercentage={0} 
      />
    );
    
    const indicators = container.querySelectorAll('.indicator');
    expect(indicators).toHaveLength(9);
  });

  it('marks current section as active', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={3} 
        totalSections={9} 
        completionPercentage={33} 
      />
    );
    
    const indicators = container.querySelectorAll('.indicator');
    // Fourth indicator (index 3) should be active
    expect(indicators[3]).toHaveClass('active');
  });

  it('marks completed sections correctly', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={4} 
        totalSections={9} 
        completionPercentage={44} 
      />
    );
    
    const indicators = container.querySelectorAll('.indicator');
    // Sections 0-3 should be completed
    expect(indicators[0]).toHaveClass('completed');
    expect(indicators[1]).toHaveClass('completed');
    expect(indicators[2]).toHaveClass('completed');
    expect(indicators[3]).toHaveClass('completed');
    
    // Section 4 should be active
    expect(indicators[4]).toHaveClass('active');
    
    // Sections 5-8 should not have completed or active class
    expect(indicators[5]).not.toHaveClass('completed');
    expect(indicators[5]).not.toHaveClass('active');
  });

  it('handles first section correctly', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={0} 
        totalSections={9} 
        completionPercentage={0} 
      />
    );
    
    const indicators = container.querySelectorAll('.indicator');
    // First indicator should be active
    expect(indicators[0]).toHaveClass('active');
    // No indicators should be completed
    indicators.forEach((indicator, index) => {
      if (index !== 0) {
        expect(indicator).not.toHaveClass('completed');
        expect(indicator).not.toHaveClass('active');
      }
    });
  });

  it('handles last section correctly', () => {
    render(
      <ProgressBar 
        currentSection={8} 
        totalSections={9} 
        completionPercentage={100} 
      />
    );
    
    expect(screen.getByText(/Section 9 of 9/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
  });

  it('rounds completion percentage to nearest integer', () => {
    render(
      <ProgressBar 
        currentSection={2} 
        totalSections={9} 
        completionPercentage={33.333} 
      />
    );
    
    // Should round 33.333 to 33
    expect(screen.getByText(/33% Complete/i)).toBeInTheDocument();
  });

  it('handles zero completion percentage', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={0} 
        totalSections={9} 
        completionPercentage={0} 
      />
    );
    
    const progressFill = container.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle({ width: '0%' });
    expect(screen.getByText(/0% Complete/i)).toBeInTheDocument();
  });

  it('handles full completion', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={8} 
        totalSections={9} 
        completionPercentage={100} 
      />
    );
    
    const progressFill = container.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle({ width: '100%' });
    expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
  });

  it('displays section indicator titles', () => {
    const { container } = render(
      <ProgressBar 
        currentSection={0} 
        totalSections={9} 
        completionPercentage={0} 
      />
    );
    
    const indicators = container.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      expect(indicator).toHaveAttribute('title', `Section ${index + 1}`);
    });
  });
});
