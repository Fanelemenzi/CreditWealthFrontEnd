import React from 'react';
import { BUSINESS_TIERS } from '../config/businessScore';

/**
 * The A-E finance readiness tiers, with an optional highlighted tier.
 */
const TierLadder = ({ currentTierId, currentLabel = 'Your tier' }) => (
  <ol className="cw-tiers">
    {BUSINESS_TIERS.map((tier) => {
      const isCurrent = tier.id === currentTierId;
      return (
        <li key={tier.id} className={`cw-tier${isCurrent ? ' is-current' : ''}`}>
          <span className="cw-tier-badge" style={{ background: tier.color }}>{tier.id}</span>
          <span className="cw-tier-name">
            <strong>{tier.label}</strong>
            <small>{tier.min}–{tier.max}</small>
          </span>
          <span className="cw-tier-terms">
            {tier.multiple}
            {tier.rate && <small>{tier.rate}</small>}
          </span>
          {isCurrent && <span className="cw-tier-flag">{currentLabel}</span>}
        </li>
      );
    })}
  </ol>
);

export default TierLadder;
