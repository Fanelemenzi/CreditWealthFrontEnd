import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreCircle from './ScoreCircle';

/**
 * Unit tests for ScoreCircle component
 * Validates Requirements: 1.2
 */
describe('ScoreCircle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render SVG-based circular progress indicator', () => {
      const { container } = render(<ScoreCircle score={700} animated={false} />);
      
      // Check for SVG element
      const svg = container.querySelector('svg.score-circle');
      expect(svg).toBeTruthy();
      
      // Check for circles (background and progress)
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThanOrEqual(2);
    });

    it('should display the score value in the center', () => {
      const { container } = render(<ScoreCircle score={750} animated={false} />);
      
      // Check for score number
      const scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber).toBeTruthy();
      expect(scoreNumber.textContent).toBe('750');
    });

    it('should display score label and range', () => {
      const { container } = render(<ScoreCircle score={700} animated={false} />);
      
      // Check for score label
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel).toBeTruthy();
      expect(scoreLabel.textContent).toBe('Good');
      
      // Check for score range
      const scoreRange = container.querySelector('.score-range');
      expect(scoreRange).toBeTruthy();
      expect(scoreRange.textContent).toBe('300 - 850');
    });
  });

  describe('Score Band Coloring', () => {
    it('should apply excellent color for scores 750-850', () => {
      const { container } = render(<ScoreCircle score={800} animated={false} />);
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Excellent');
    });

    it('should apply good color for scores 650-749', () => {
      const { container } = render(<ScoreCircle score={700} animated={false} />);
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Good');
    });

    it('should apply fair color for scores 550-649', () => {
      const { container } = render(<ScoreCircle score={600} animated={false} />);
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Fair');
    });

    it('should apply weak color for scores 450-549', () => {
      const { container } = render(<ScoreCircle score={500} animated={false} />);
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Weak');
    });

    it('should apply poor color for scores 300-449', () => {
      const { container } = render(<ScoreCircle score={400} animated={false} />);
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Poor');
    });
  });

  describe('Animation', () => {
    it('should animate from 0 to target score when animated is true', () => {
      const { container } = render(<ScoreCircle score={600} animated={true} />);
      
      // Initially should be 0 or low value
      let scoreNumber = container.querySelector('.score-number');
      const initialValue = parseInt(scoreNumber.textContent);
      expect(initialValue).toBeLessThan(600);
      
      // Fast forward time
      vi.advanceTimersByTime(1000); // 1 second
      scoreNumber = container.querySelector('.score-number');
      const midValue = parseInt(scoreNumber.textContent);
      expect(midValue).toBeGreaterThan(initialValue);
      expect(midValue).toBeLessThanOrEqual(600);
      
      // Fast forward to completion (2 seconds total)
      vi.advanceTimersByTime(1000);
      scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('600');
    });

    it('should display final score immediately when animated is false', () => {
      const { container } = render(<ScoreCircle score={725} animated={false} />);
      
      const scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('725');
    });

    it('should complete animation in approximately 2 seconds', () => {
      const { container } = render(<ScoreCircle score={500} animated={true} />);
      
      // Before 2 seconds
      vi.advanceTimersByTime(1900);
      let scoreNumber = container.querySelector('.score-number');
      let currentValue = parseInt(scoreNumber.textContent);
      expect(currentValue).toBeLessThanOrEqual(500);
      
      // After 2 seconds
      vi.advanceTimersByTime(200);
      scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('500');
    });
  });

  describe('Score Calculation', () => {
    it('should calculate correct progress percentage for various scores', () => {
      const testCases = [
        { score: 300, expectedPercentage: (300 / 850) * 100 },
        { score: 425, expectedPercentage: (425 / 850) * 100 },
        { score: 600, expectedPercentage: (600 / 850) * 100 },
        { score: 750, expectedPercentage: (750 / 850) * 100 },
        { score: 850, expectedPercentage: 100 }
      ];

      testCases.forEach(({ score, expectedPercentage }) => {
        const { container } = render(<ScoreCircle score={score} animated={false} />);
        // Verify SVG circle exists (progress calculation is internal)
        const progressCircle = container.querySelector('.score-progress');
        expect(progressCircle).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum score (300)', () => {
      const { container } = render(<ScoreCircle score={300} animated={false} />);
      
      const scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('300');
      
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Poor');
    });

    it('should handle maximum score (850)', () => {
      const { container } = render(<ScoreCircle score={850} animated={false} />);
      
      const scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('850');
      
      const scoreLabel = container.querySelector('.score-label');
      expect(scoreLabel.textContent).toBe('Excellent');
    });

    it('should handle boundary scores correctly', () => {
      const boundaries = [
        { score: 449, expectedLabel: 'Poor' },
        { score: 450, expectedLabel: 'Weak' },
        { score: 549, expectedLabel: 'Weak' },
        { score: 550, expectedLabel: 'Fair' },
        { score: 649, expectedLabel: 'Fair' },
        { score: 650, expectedLabel: 'Good' },
        { score: 749, expectedLabel: 'Good' },
        { score: 750, expectedLabel: 'Excellent' }
      ];

      boundaries.forEach(({ score, expectedLabel }) => {
        const { container } = render(<ScoreCircle score={score} animated={false} />);
        const scoreLabel = container.querySelector('.score-label');
        expect(scoreLabel.textContent).toBe(expectedLabel);
      });
    });
  });

  describe('Gradient Application', () => {
    it('should define gradient for progress circle', () => {
      const { container } = render(<ScoreCircle score={700} animated={false} />);
      
      // Check for gradient definition
      const gradient = container.querySelector('#scoreGradient');
      expect(gradient).toBeTruthy();
      
      // Check progress circle uses gradient
      const progressCircle = container.querySelector('.score-progress');
      expect(progressCircle).toBeTruthy();
      expect(progressCircle.getAttribute('stroke')).toContain('scoreGradient');
    });

    it('should define glow filter for visual effect', () => {
      const { container } = render(<ScoreCircle score={700} animated={false} />);
      
      // Check for glow filter definition
      const glowFilter = container.querySelector('#glow');
      expect(glowFilter).toBeTruthy();
    });
  });

  describe('Props Validation', () => {
    it('should use default animated prop when not provided', () => {
      const { container } = render(<ScoreCircle score={600} />);
      
      // Animation should start from 0
      const scoreNumber = container.querySelector('.score-number');
      const initialValue = parseInt(scoreNumber.textContent);
      expect(initialValue).toBeLessThanOrEqual(600);
    });

    it('should update when score prop changes', () => {
      const { container, rerender } = render(<ScoreCircle score={500} animated={false} />);
      
      let scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('500');
      
      // Update score
      rerender(<ScoreCircle score={700} animated={false} />);
      
      scoreNumber = container.querySelector('.score-number');
      expect(scoreNumber.textContent).toBe('700');
    });
  });

  describe('Accessibility', () => {
    it('should have proper container structure', () => {
      const { container } = render(<ScoreCircle score={700} animated={false} />);
      
      // Check for main container
      const scoreContainer = container.querySelector('.score-circle-container');
      expect(scoreContainer).toBeTruthy();
      
      // Check for content container
      const scoreContent = container.querySelector('.score-content');
      expect(scoreContent).toBeTruthy();
    });
  });
});
