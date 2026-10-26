import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PillarBreakdown from './PillarBreakdown';

describe('PillarBreakdown Component', () => {
  const mockPillarData = {
    financial_obligations: { score: 85, contribution: 12.75 },
    income_employment: { score: 90, contribution: 13.5 },
    mobile_money: { score: 75, contribution: 9.0 },
    assets: { score: 80, contribution: 9.6 },
    savings_banking: { score: 70, contribution: 8.4 },
    expense_management: { score: 65, contribution: 7.8 },
    household_profile: { score: 88, contribution: 7.04 },
    financial_literacy: { score: 92, contribution: 7.36 },
    business_profile: { score: 78, contribution: 4.68 }
  };

  it('renders all nine pillars with correct labels', () => {
    render(<PillarBreakdown pillarBreakdown={mockPillarData} />);
    
    expect(screen.getByText('Financial Obligations')).toBeInTheDocument();
    expect(screen.getByText('Income & Employment')).toBeInTheDocument();
    expect(screen.getByText('Mobile Money')).toBeInTheDocument();
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Savings & Banking')).toBeInTheDocument();
    expect(screen.getByText('Expense Management')).toBeInTheDocument();
    expect(screen.getByText('Household Profile')).toBeInTheDocument();
    expect(screen.getByText('Financial Literacy')).toBeInTheDocument();
    expect(screen.getByText('Business Profile')).toBeInTheDocument();
  });

  it('displays correct weights for each pillar', () => {
    render(<PillarBreakdown pillarBreakdown={mockPillarData} />);
    
    // Check for 15% weight pillars
    const fifteenPercentWeights = screen.getAllByText('15% weight');
    expect(fifteenPercentWeights).toHaveLength(2);
    
    // Check for 12% weight pillars
    const twelvePercentWeights = screen.getAllByText('12% weight');
    expect(twelvePercentWeights).toHaveLength(4);
    
    // Check for 8% weight pillars
    const eightPercentWeights = screen.getAllByText('8% weight');
    expect(eightPercentWeights).toHaveLength(2);
    
    // Check for 6% weight pillar
    expect(screen.getByText('6% weight')).toBeInTheDocument();
  });

  it('displays scores and contributions for each pillar', () => {
    render(<PillarBreakdown pillarBreakdown={mockPillarData} />);
    
    expect(screen.getByText('85/100')).toBeInTheDocument();
    expect(screen.getByText('90/100')).toBeInTheDocument();
    expect(screen.getByText('+12.8 pts')).toBeInTheDocument();
    expect(screen.getByText('+13.5 pts')).toBeInTheDocument();
  });

  it('handles missing pillar data gracefully', () => {
    render(<PillarBreakdown pillarBreakdown={{}} />);
    
    // Should still render all pillar labels
    expect(screen.getByText('Financial Obligations')).toBeInTheDocument();
    expect(screen.getByText('Income & Employment')).toBeInTheDocument();
    
    // Should show 0 scores for missing data
    const zeroScores = screen.getAllByText('0/100');
    expect(zeroScores.length).toBeGreaterThan(0);
  });

  it('handles null pillarBreakdown prop', () => {
    render(<PillarBreakdown pillarBreakdown={null} />);
    
    // Should render without crashing
    expect(screen.getByText('Financial Pillars Breakdown')).toBeInTheDocument();
  });

  it('renders progress bars for each pillar', () => {
    const { container } = render(<PillarBreakdown pillarBreakdown={mockPillarData} />);
    
    const progressBars = container.querySelectorAll('.pillar-progress-bar');
    expect(progressBars).toHaveLength(9);
  });

  it('applies correct width to progress bar based on score', () => {
    const { container } = render(<PillarBreakdown pillarBreakdown={mockPillarData} />);
    
    const progressFills = container.querySelectorAll('.pillar-progress-fill');
    const firstFill = progressFills[0];
    
    // Financial obligations has score 85, so width should be 85%
    expect(firstFill).toHaveStyle({ width: '85%' });
  });

  it('displays component title', () => {
    render(<PillarBreakdown pillarBreakdown={mockPillarData} />);
    
    expect(screen.getByText('Financial Pillars Breakdown')).toBeInTheDocument();
  });
});
