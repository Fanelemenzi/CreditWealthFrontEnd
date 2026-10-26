import React, { useState, useEffect } from 'react';

/**
 * ScoreCircle - Animated circular visualization of credit score
 * 
 * Features:
 * - SVG-based circular progress indicator
 * - Gradient coloring based on score range
 * - Animation from 0 to target score over 2 seconds
 * - Responsive sizing
 * 
 * Validates Requirements: 1.2
 */
const ScoreCircle = ({ score, animated = true }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (animated) {
      // Animate score counting up over 2 seconds
      const duration = 2000;
      const steps = 60;
      const increment = score / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          setAnimationComplete(true);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayScore(score);
      setAnimationComplete(true);
    }
  }, [score, animated]);

  // Calculate score percentage for progress circle
  const scorePercentage = (score / 850) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  // Determine score color based on range
  const getScoreColor = (scoreValue) => {
    if (scoreValue >= 750) return '#10b981'; // Excellent
    if (scoreValue >= 650) return '#84cc16'; // Good
    if (scoreValue >= 550) return '#eab308'; // Fair
    if (scoreValue >= 450) return '#f97316'; // Weak
    return '#ef4444'; // Poor
  };

  // Determine score label based on range
  const getScoreLabel = (scoreValue) => {
    if (scoreValue >= 750) return 'Excellent';
    if (scoreValue >= 650) return 'Good';
    if (scoreValue >= 550) return 'Fair';
    if (scoreValue >= 450) return 'Weak';
    return 'Poor';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="score-circle-container">
      <svg className="score-circle" width="320" height="320" viewBox="0 0 320 320">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor={scoreColor} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="120"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
        />
        
        {/* Progress circle */}
        <circle
          className={`score-progress ${animationComplete ? 'pulse' : ''}`}
          cx="160"
          cy="160"
          r="120"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 160 160)"
          filter="url(#glow)"
        />
      </svg>
      
      <div className="score-content">
        <div className="score-number">{displayScore}</div>
        <div className="score-label">{getScoreLabel(score)}</div>
        <div className="score-range">300 - 850</div>
      </div>
    </div>
  );
};

export default ScoreCircle;
