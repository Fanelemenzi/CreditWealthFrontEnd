import React from 'react';
import {
  PERSONAL_BANDS,
  PERSONAL_SCORE_MAX,
  PERSONAL_SCORE_MIN,
  getPersonalBand,
} from '../config/personalScore';

/**
 * Horizontal 300-850 scale, split into score bands, with a marker at the score.
 */
const ScoreScale = ({ score }) => {
  const range = PERSONAL_SCORE_MAX - PERSONAL_SCORE_MIN;
  const clamped = Math.min(PERSONAL_SCORE_MAX, Math.max(PERSONAL_SCORE_MIN, score));
  const position = ((clamped - PERSONAL_SCORE_MIN) / range) * 100;
  const current = getPersonalBand(score);

  return (
    <div
      className="cw-scale"
      role="img"
      aria-label={`Score of ${score} on a scale of ${PERSONAL_SCORE_MIN} to ${PERSONAL_SCORE_MAX}, in the ${current.label} band`}
    >
      <div className="cw-scale-track">
        {PERSONAL_BANDS.map((band) => (
          <span
            key={band.id}
            className="cw-scale-segment"
            style={{ flexGrow: band.max - band.min + 1, background: band.color }}
          />
        ))}
        <span className="cw-scale-marker" style={{ left: `${position}%` }} />
      </div>
      <div className="cw-scale-labels">
        {PERSONAL_BANDS.map((band) => (
          <span
            key={band.id}
            className={band.id === current.id ? 'is-current' : undefined}
            style={{ flexGrow: band.max - band.min + 1 }}
          >
            {band.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScoreScale;
