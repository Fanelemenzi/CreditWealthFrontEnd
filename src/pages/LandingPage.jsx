import React from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import ScoreCircle from '../components/ScoreCircle'
import ScoreScale from '../components/ScoreScale'
import TierLadder from '../components/TierLadder'
import { PERSONAL_PILLARS } from '../config/personalScore'
import { BUSINESS_PILLARS } from '../config/businessScore'
import '../styles/LandingPage.css'
import '../styles/NewDesign.css'
import '../styles/Redesign.css'

const BUSINESS_DASHBOARD = '/dashboard?view=business'

const STEPS = [
  { title: 'Create your account', text: 'Sign up with your phone number and a password.' },
  { title: 'Complete the assessment', text: 'Answer questions about your income, spending, savings and obligations.' },
  { title: 'See your score', text: 'Get your score, what shapes it and what to do next.' },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const goToLogin = () => navigate('/login')
  const goToBusiness = () => {
    if (localStorage.getItem('access_token')) {
      navigate(BUSINESS_DASHBOARD)
    } else {
      navigate('/login', { state: { redirectTo: BUSINESS_DASHBOARD } })
    }
  }

  return (
    <div className="lp">
      <nav className="lp-nav" aria-label="Main">
        <div className="lp-wrap lp-nav-inner">
          <BrandLogo />
          <div className="lp-nav-links">
            <a href="#personal">Your score</a>
            <a href="#how-it-works">How it works</a>
            <a href="#business">For business</a>
            <button type="button" onClick={goToLogin} className="cw-btn cw-btn-ghost">Login</button>
          </div>
        </div>
      </nav>

      <header className="lp-hero">
        <div className="lp-wrap lp-hero-grid">
          <div>
            <h1>Know your credit score. <em>Take control.</em></h1>
            <p className="lp-lead">
              See where you stand, understand what shapes your score and get clear next steps
              to improve your financial health. Mobile money and everyday finances count too.
            </p>
            <div className="lp-actions">
              <button type="button" onClick={goToLogin} className="cw-btn cw-btn-primary cw-btn-lg">
                Get Started Free
              </button>
              <a href="#how-it-works" className="cw-btn cw-btn-ghost cw-btn-lg">See how it works</a>
            </div>
            <dl className="lp-facts">
              <div><dt>300–850</dt><dd>score range</dd></div>
              <div><dt>{PERSONAL_PILLARS.length}</dt><dd>financial pillars</dd></div>
              <div><dt>Tailored</dt><dd>recommendations</dd></div>
            </dl>
          </div>

          <div className="lp-score-card cw-card">
            <div className="lp-score-card-head">
              <strong>Your credit score</strong>
              <span className="cw-tag">Sample</span>
            </div>
            <div className="cw-ring"><ScoreCircle score={724} /></div>
            <ScoreScale score={724} />
          </div>
        </div>

        <div className="lp-wrap">
          <button type="button" className="lp-business-strip" onClick={goToBusiness}>
            <span><strong>Run a business?</strong> Check how ready it is for finance with the Business Viability Score.</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      <section id="personal" className="lp-section">
        <div className="lp-wrap lp-personal">
          <div>
            <p className="cw-eyebrow">Your personal score</p>
            <h2>A full picture of your financial life</h2>
            <p className="lp-lead">
              Your score draws on nine pillars, so you can see exactly what is helping you,
              what is holding you back and where to focus next.
            </p>
          </div>
          <ul className="lp-pillars">
            {PERSONAL_PILLARS.map((pillar) => (
              <li key={pillar.key}>
                <span>{pillar.label}</span>
                <b>{pillar.weight}%</b>
                <div className="cw-meter"><span style={{ width: `${pillar.weight * 5}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="lp-section lp-section-tint">
        <div className="lp-wrap">
          <h2>How it works</h2>
          <ol className="lp-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="lp-step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="business" className="lp-business">
        <div className="lp-wrap lp-business-grid">
          <div>
            <p className="cw-eyebrow">Also available for business</p>
            <h2>Business Viability Score</h2>
            <p>
              A separate score out of 1000 for small business owners, SMEs and early-stage
              startups. It gauges readiness for finance, so owners know where they stand and
              financiers can manage risk with more confidence.
            </p>
            <div className="lp-audiences">
              <div>
                <h3>For owners and founders</h3>
                <p>See your finance readiness tier and the steps most likely to improve it before you apply.</p>
              </div>
              <div>
                <h3>For financiers</h3>
                <p>Compare applicants on one scale, backed by cross-checked answers and non-family references.</p>
              </div>
            </div>
            <ul className="lp-chips" aria-label="The six business pillars">
              {BUSINESS_PILLARS.map((pillar) => <li key={pillar.key}>{pillar.label}</li>)}
            </ul>
            <button type="button" onClick={goToBusiness} className="cw-btn cw-btn-light">
              Explore the business score
            </button>
          </div>
          <div className="cw-card lp-business-tiers">
            <h3 className="cw-card-title">Finance readiness tiers</h3>
            <TierLadder />
            <p className="cw-fineprint">Indicative limits and pricing. Each financier makes its own decision.</p>
          </div>
        </div>
      </section>

      <section className="lp-closing">
        <div className="lp-wrap">
          <h2>Start with your credit score</h2>
          <p>Find out where you stand and what to do next.</p>
          <button type="button" onClick={goToLogin} className="cw-btn cw-btn-primary cw-btn-lg">
            Get Started Free
          </button>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <BrandLogo />
          <p>&copy; {new Date().getFullYear()} CreditScore Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
