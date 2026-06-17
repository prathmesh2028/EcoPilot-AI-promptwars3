/**
 * EcoImpactMeter — SVG radial gauge showing carbon intensity.
 * Props:
 *   value      : 0-100 percentage of meter fill
 *   total      : raw kg CO₂e for label
 *   impactLevel: { label, color } from getImpactLevel()
 */
import React, { useEffect, useState } from 'react';

const RADIUS  = 70;
const CX      = 90;
const CY      = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~439.8
// We only use 75% of the circle (270°) for the gauge arc
const ARC_LENGTH = CIRCUMFERENCE * 0.75;

const COLOR_MAP = {
  green: { stroke: '#059669', glow: 'rgba(5,150,105,0.4)', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  teal:  { stroke: '#14b8a6', glow: 'rgba(20,184,166,0.4)', text: 'text-teal-400',   bg: 'bg-teal-500/10 border-teal-500/20' },
  amber: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', text: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
  red:   { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)',  text: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20'   },
};

export const EcoImpactMeter = ({ value = 0, total = 0, impactLevel = { label: '—', color: 'green' } }) => {
  const [animValue, setAnimValue] = useState(0);
  const colors = COLOR_MAP[impactLevel.color] || COLOR_MAP.green;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimValue(value), 200);
    return () => clearTimeout(timeout);
  }, [value]);

  // dashoffset calculation:
  // 0% fill  → dashoffset = ARC_LENGTH (completely hidden)
  // 100% fill → dashoffset = 0 (fully visible)
  const dashOffset = ARC_LENGTH - (animValue / 100) * ARC_LENGTH;

  // Rotate -135deg so arc starts at bottom-left and sweeps clockwise to bottom-right
  const transform = `rotate(-135, ${CX}, ${CY})`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Gauge */}
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track arc */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={transform}
          />

          {/* Colored fill arc */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="12"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={transform}
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />

          {/* Center label */}
          <text
            x={CX} y={CY - 8}
            textAnchor="middle"
            fill="white"
            fontSize="22"
            fontWeight="800"
            fontFamily="Inter, sans-serif"
          >
            {total >= 1000 ? `${(total / 1000).toFixed(1)}t` : `${total}`}
          </text>
          <text
            x={CX} y={CY + 14}
            textAnchor="middle"
            fill="rgba(255,255,255,0.45)"
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            kg CO₂e / yr
          </text>
        </svg>

        {/* Tick marks */}
        <span className="absolute bottom-3 left-3 text-[10px] font-bold text-emerald-500">LOW</span>
        <span className="absolute bottom-3 right-3 text-[10px] font-bold text-red-500">HIGH</span>
      </div>

      {/* Impact Label */}
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${colors.bg}`}>
        <span className={`text-sm font-bold ${colors.text}`}>{impactLevel.label} Impact</span>
      </div>
    </div>
  );
};
