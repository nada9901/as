/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Medical Gauge Chart Component (0-100% Probability Speedometer)
 */

import React from 'react';

interface GaugeChartProps {
  probability: number; // 0 to 100 percentage
  riskTier: 'Low Risk' | 'Moderate Risk' | 'High Risk' | string;
  size?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  probability,
  riskTier,
  size = 240,
}) => {
  const clampedProb = Math.min(Math.max(probability, 0), 100);

  // SVG Gauge geometry (semicircle arc from 180 to 0 degrees)
  const strokeWidth = 16;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;

  // Convert probability to angle (-90 deg to +90 deg from top center)
  // Or 180 deg (left) to 0 deg (right)
  const angleDeg = 180 - (clampedProb / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;

  const needleX = center + (radius - 10) * Math.cos(angleRad);
  const needleY = center - (radius - 10) * Math.sin(angleRad);

  const getTierColor = () => {
    switch (riskTier) {
      case 'Low Risk':
        return '#10b981'; // Emerald 500
      case 'Moderate Risk':
        return '#f59e0b'; // Amber 500
      case 'High Risk':
        return '#ef4444'; // Rose 500
      default:
        return '#64748b'; // Slate 500
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size * 0.65}
        viewBox={`0 0 ${size} ${size * 0.65}`}
        className="overflow-visible"
        aria-label={`Diabetes Risk Gauge: ${clampedProb.toFixed(1)}%`}
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="25%" stopColor="#10b981" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Background Arc */}
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${
            size - strokeWidth
          } ${center}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Threshold Markers */}
        {/* 10% Marker (Low to Moderate threshold) */}
        <line
          x1={center + (radius - strokeWidth / 2) * Math.cos((162 * Math.PI) / 180)}
          y1={center - (radius - strokeWidth / 2) * Math.sin((162 * Math.PI) / 180)}
          x2={center + (radius + strokeWidth / 2) * Math.cos((162 * Math.PI) / 180)}
          y2={center - (radius + strokeWidth / 2) * Math.sin((162 * Math.PI) / 180)}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* 40% Marker (Moderate to High threshold) */}
        <line
          x1={center + (radius - strokeWidth / 2) * Math.cos((108 * Math.PI) / 180)}
          y1={center - (radius - strokeWidth / 2) * Math.sin((108 * Math.PI) / 180)}
          x2={center + (radius + strokeWidth / 2) * Math.cos((108 * Math.PI) / 180)}
          y2={center - (radius + strokeWidth / 2) * Math.sin((108 * Math.PI) / 180)}
          stroke="#ffffff"
          strokeWidth={2}
        />

        {/* Gauge Needle / Pointer */}
        <line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke={getTierColor()}
          strokeWidth={4}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Center Pivot Circle */}
        <circle
          cx={center}
          cy={center}
          r={7}
          fill={getTierColor()}
          className="stroke-white dark:stroke-slate-900 stroke-2"
        />

        {/* Percentage Label */}
        <text
          x={center}
          y={center - 24}
          textAnchor="middle"
          className="text-3xl font-extrabold fill-slate-900 dark:fill-white font-mono"
        >
          {clampedProb.toFixed(1)}%
        </text>
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          className="text-xs uppercase font-semibold fill-slate-500 dark:fill-slate-400 tracking-wider"
        >
          Risk Score
        </text>
      </svg>
    </div>
  );
};
