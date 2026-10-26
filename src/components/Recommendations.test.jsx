import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Recommendations from './Recommendations';

describe('Recommendations Component', () => {
  it('renders recommendations with all fields', () => {
    const recommendations = [
      {
        title: 'Improve Payment History',
        description: 'Making on-time payments consistently will boost your score',
        impact: 25
      },
      {
        title: 'Reduce Debt Ratio',
        description: 'Lower your debt-to-income ratio by paying down loans',
        impact: 15
      }
    ];

    render(<Recommendations recommendations={recommendations} />);

    // Check that both recommendations are rendered
    expect(screen.getByText('Improve Payment History')).toBeInTheDocument();
    expect(screen.getByText('Making on-time payments consistently will boost your score')).toBeInTheDocument();
    expect(screen.getByText('Potential Impact: +25 points')).toBeInTheDocument();

    expect(screen.getByText('Reduce Debt Ratio')).toBeInTheDocument();
    expect(screen.getByText('Lower your debt-to-income ratio by paying down loans')).toBeInTheDocument();
    expect(screen.getByText('Potential Impact: +15 points')).toBeInTheDocument();
  });

  it('renders recommendations without impact value', () => {
    const recommendations = [
      {
        title: 'Build Credit History',
        description: 'Maintain active credit accounts for longer periods'
      }
    ];

    render(<Recommendations recommendations={recommendations} />);

    expect(screen.getByText('Build Credit History')).toBeInTheDocument();
    expect(screen.getByText('Maintain active credit accounts for longer periods')).toBeInTheDocument();
    // Impact should not be shown
    expect(screen.queryByText(/Potential Impact:/)).not.toBeInTheDocument();
  });

  it('displays message when recommendations array is empty', () => {
    render(<Recommendations recommendations={[]} />);

    expect(screen.getByText(/Great job! Your credit profile is strong./)).toBeInTheDocument();
    expect(screen.getByText(/No specific recommendations at this time./)).toBeInTheDocument();
  });

  it('displays message when recommendations is null', () => {
    render(<Recommendations recommendations={null} />);

    expect(screen.getByText(/Great job! Your credit profile is strong./)).toBeInTheDocument();
  });

  it('displays message when recommendations is undefined', () => {
    render(<Recommendations recommendations={undefined} />);

    expect(screen.getByText(/Great job! Your credit profile is strong./)).toBeInTheDocument();
  });

  it('handles multiple recommendations with varying data', () => {
    const recommendations = [
      {
        title: 'First Recommendation',
        description: 'First description',
        impact: 10
      },
      {
        title: 'Second Recommendation',
        description: 'Second description',
        impact: 0
      },
      {
        title: 'Third Recommendation',
        description: 'Third description'
      }
    ];

    render(<Recommendations recommendations={recommendations} />);

    // All three should be rendered
    expect(screen.getByText('First Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Second Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Third Recommendation')).toBeInTheDocument();

    // Check impact displays correctly
    expect(screen.getByText('Potential Impact: +10 points')).toBeInTheDocument();
    expect(screen.getByText('Potential Impact: +0 points')).toBeInTheDocument();
  });
});
