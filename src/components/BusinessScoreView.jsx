import React from 'react';
import TierLadder from './TierLadder';
import {
  BUSINESS_PILLARS,
  BUSINESS_SCORE_MAX,
  SAMPLE_BUSINESS_RESULT,
  getBusinessTier,
  getBusinessTierById,
} from '../config/businessScore';

const formatCurrency = (amount) => `E${Math.round(amount).toLocaleString('en-ZA')}`;

const REQUIREMENTS = [
  'Your monthly revenue, profit margin and any existing debts',
  'How long you have traded, your customer base and your records',
  'Two non-family references we can contact by SMS',
  'Your stokvel coordinator’s phone number, if you are an active member',
];

const ScoreSummary = ({ result, isSample }) => {
  const score = Math.round(result.final_bvss);
  const tier = getBusinessTierById(result.risk_tier) || getBusinessTier(score);

  return (
    <section className="biz-score cw-card">
      <div className="biz-score-main">
        <p className="cw-eyebrow">{isSample ? 'Sample report' : 'Your business score'}</p>
        <p className="biz-score-number">
          {score}
          <span>/ {BUSINESS_SCORE_MAX}</span>
        </p>
        <p className="biz-score-tier">
          <span className="cw-tier-badge" style={{ background: tier.color }}>{tier.id}</span>
          {tier.label} tier
        </p>
        <div
          className="cw-meter biz-score-meter"
          role="img"
          aria-label={`${score} out of ${BUSINESS_SCORE_MAX}`}
        >
          <span style={{ width: `${(score / BUSINESS_SCORE_MAX) * 100}%` }} />
        </div>
      </div>
      <dl className="biz-score-facts">
        <div>
          <dt>Indicative first disbursement</dt>
          <dd>{result.approved_loan_max > 0 ? formatCurrency(result.approved_loan_max) : 'Not yet eligible'}</dd>
          <p>60% of your tier limit. Funding is staged, and this is not a loan offer.</p>
        </div>
        {!isSample && (
          <div>
            <dt>Reference checks</dt>
            <dd>{result.status === 'complete' ? 'Complete' : 'In progress'}</dd>
            <p>
              {result.status === 'complete'
                ? 'Your references have been checked.'
                : 'Your score may change once your references respond.'}
            </p>
          </div>
        )}
        {result.expires_at && (
          <div>
            <dt>Valid until</dt>
            <dd>{new Date(result.expires_at).toLocaleDateString()}</dd>
          </div>
        )}
      </dl>
    </section>
  );
};

const BusinessReport = ({ result, isSample }) => (
  <>
    <ScoreSummary result={result} isSample={isSample} />
    <div className="biz-grid">
      <section className="cw-card">
        <h3 className="cw-card-title">Score by pillar</h3>
        <ul className="biz-pillars">
          {BUSINESS_PILLARS.map((pillar) => {
            const value = Math.round(result[pillar.key] ?? 0);
            return (
              <li key={pillar.key}>
                <div className="biz-pillar-head">
                  <span>
                    <strong>{pillar.label}</strong>
                    <small>{pillar.weight}% of score</small>
                  </span>
                  <b>{value}/100</b>
                </div>
                <div className="cw-meter"><span style={{ width: `${value}%` }} /></div>
                <p>{pillar.description}</p>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="biz-rail">
        <section className="cw-card">
          <h3 className="cw-card-title">Finance readiness tiers</h3>
          <TierLadder
            currentTierId={result.risk_tier}
            currentLabel={isSample ? 'Sample' : 'Your tier'}
          />
          <p className="cw-fineprint">Indicative limits and pricing. Each financier makes its own decision.</p>
        </section>
        {result.improvement_tips?.length > 0 && (
          <section className="cw-card">
            <h3 className="cw-card-title">Where to improve first</h3>
            <ul className="biz-tips">
              {result.improvement_tips.map((tip) => (
                <li key={tip.pillar}>
                  <strong>{tip.pillar.replace(/\s*\(P\d\)$/, '')}</strong>
                  <p>{tip.advice}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  </>
);

/**
 * BusinessScoreView - the Business Viability Score side of the dashboard.
 * status: 'loading' | 'none' | 'pending' | 'ready' | 'unavailable'
 *
 * Only owner-safe fields are shown: anti-gaming flags and penalties never reach
 * this view, in line with the build guide.
 */
const BusinessScoreView = ({ status, result }) => {
  const isReady = status === 'ready';
  const isPending = status === 'pending';

  return (
    <div className="biz-view">
      <header className="dash-header">
        <div>
          <h1>Business Viability Score</h1>
          <p>
            A separate score out of {BUSINESS_SCORE_MAX} showing financiers how ready your
            small business or early-stage startup is for finance. It does not change your
            personal credit score.
          </p>
        </div>
      </header>

      {status === 'loading' && <p className="biz-note" role="status">Checking for a business score…</p>}

      {status === 'unavailable' && (
        <p className="biz-note" role="status">
          We couldn’t check for a saved business score just now, so this may not reflect your
          latest result. Please try again later.
        </p>
      )}

      {isPending && (
        <section className="biz-start cw-card" role="status">
          <div>
            <p className="cw-eyebrow">Assessment received</p>
            <h2>Your business score is being prepared</h2>
            <p>We’re scoring and reviewing your answers. Your result will appear here once that’s done.</p>
          </div>
        </section>
      )}

      {!isReady && !isPending && status !== 'loading' && (
        <section className="biz-start cw-card">
          <div>
            <p className="cw-eyebrow">Get finance-ready</p>
            <h2>Show financiers what your business can carry</h2>
            <p>
              Answer questions across six pillars and get a score, a finance readiness tier and
              clear steps to improve. Honest answers matter: responses are cross-checked and
              your references are contacted.
            </p>
            <button type="button" className="cw-btn cw-btn-primary" disabled>
              Business assessment opening soon
            </button>
          </div>
          <div className="biz-needs">
            <h3>What you’ll need</h3>
            <ul>
              {REQUIREMENTS.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
      )}

      {isReady && <BusinessReport result={result} isSample={false} />}

      {!isReady && !isPending && status !== 'loading' && (
        <>
          <p className="biz-sample-label">
            <span>Sample data</span> This is an example report, not your business’s result.
          </p>
          <BusinessReport result={SAMPLE_BUSINESS_RESULT} isSample />
        </>
      )}
    </div>
  );
};

export default BusinessScoreView;
