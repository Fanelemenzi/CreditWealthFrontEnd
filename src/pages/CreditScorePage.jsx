import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreditScorePage.css'

const CreditScorePage = () => {
  const navigate = useNavigate()
  const [score, setScore] = useState(0)
  const targetScore = 724
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Animate score counting up
    const duration = 2000
    const steps = 60
    const increment = targetScore / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= targetScore) {
        setScore(targetScore)
        setAnimationComplete(true)
        clearInterval(timer)
      } else {
        setScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  const getScoreColor = (score) => {
    if (score >= 700) return '#10b981'
    if (score >= 600) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score) => {
    if (score >= 740) return 'Excellent'
    if (score >= 670) return 'Good'
    if (score >= 580) return 'Fair'
    return 'Poor'
  }

  const handleLogout = () => {
    navigate('/')
  }

  const scorePercentage = (targetScore / 850) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference

  return (
    <div className="credit-score-page">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="#4f46e5" strokeWidth="3" />
              <path d="M16 8v8l5 3" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="logo-text">CreditScore</span>
          </div>
          <div className="nav-actions">
            <button className="icon-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="icon-button user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Your Credit Health</h1>
            <p className="dashboard-subtitle">Last updated: Today</p>
          </div>
          <button onClick={handleLogout} className="btn-outline">
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="score-card main-score-card">
            <div className="card-header">
              <h2>Your Credit Score</h2>
              <div className="score-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: getScoreColor(targetScore) }}>+20 points</span>
              </div>
            </div>

            <div className="score-circle-container">
              <svg className="score-circle" width="320" height="320" viewBox="0 0 320 320">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor={getScoreColor(targetScore)} />
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
                <div className="score-number">{score}</div>
                <div className="score-label">{getScoreLabel(targetScore)}</div>
                <div className="score-range">300 - 850</div>
              </div>
            </div>

            <div className="score-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-label">Poor</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range poor"></div>
                </div>
                <div className="breakdown-range-text">300-579</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Fair</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range fair"></div>
                </div>
                <div className="breakdown-range-text">580-669</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Good</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range good"></div>
                </div>
                <div className="breakdown-range-text">670-739</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Very Good</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range very-good"></div>
                </div>
                <div className="breakdown-range-text">740-799</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Excellent</div>
                <div className="breakdown-bar">
                  <div className="breakdown-range excellent"></div>
                </div>
                <div className="breakdown-range-text">800-850</div>
              </div>
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-content">
                <h3>Payment History</h3>
                <p className="info-value">100%</p>
                <p className="info-description">All payments made on time</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-content">
                <h3>Credit Utilization</h3>
                <p className="info-value">28%</p>
                <p className="info-description">Good - Keep below 30%</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-content">
                <h3>Credit Age</h3>
                <p className="info-value">7 years</p>
                <p className="info-description">Average account age</p>
              </div>
            </div>
          </div>

          <div className="factors-card">
            <h2>Score Factors</h2>
            <div className="factors-list">
              <div className="factor-item positive">
                <div className="factor-header">
                  <div className="factor-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>No Missed Payments</h4>
                    <p>All your accounts are in good standing</p>
                  </div>
                </div>
              </div>

              <div className="factor-item positive">
                <div className="factor-header">
                  <div className="factor-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Low Credit Utilization</h4>
                    <p>Using only 28% of available credit</p>
                  </div>
                </div>
              </div>

              <div className="factor-item neutral">
                <div className="factor-header">
                  <div className="factor-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Recent Credit Inquiry</h4>
                    <p>1 inquiry in the last 6 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations-card">
            <h2>Recommendations</h2>
            <div className="recommendations-list">
              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4>Keep Payment History Perfect</h4>
                  <p>Continue making all payments on time to maintain your excellent payment history</p>
                </div>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4>Pay Down Credit Card Balance</h4>
                  <p>Reducing your balance by $2,000 could improve your score by 15-25 points</p>
                </div>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4>Avoid New Credit Applications</h4>
                  <p>Each application creates a hard inquiry. Wait 6 months before applying for new credit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-date">Today</div>
                <div className="activity-content">
                  <h4>Score Updated</h4>
                  <p>Your credit score increased by 20 points</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">3 days ago</div>
                <div className="activity-content">
                  <h4>Payment Reported</h4>
                  <p>On-time payment reported for Credit Card •••• 4532</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">1 week ago</div>
                <div className="activity-content">
                  <h4>Balance Update</h4>
                  <p>Credit card balance decreased by $1,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditScorePage
