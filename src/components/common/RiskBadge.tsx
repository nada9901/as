/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Risk Tier Badge Component
 */

import React from 'react';

interface RiskBadgeProps {
  tier: 'Low Risk' | 'Moderate Risk' | 'High Risk' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ tier, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (tier) {
      case 'Low Risk':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Moderate Risk':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'High Risk':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs font-semibold';
      case 'lg':
        return 'px-4 py-1.5 text-base font-bold';
      default:
        return 'px-3 py-1 text-sm font-semibold';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${getBadgeStyle()} ${getSizeClasses()}`}
      role="status"
      aria-label={`Diabetes Risk Status: ${tier}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          tier === 'High Risk'
            ? 'bg-rose-500 animate-pulse'
            : tier === 'Moderate Risk'
            ? 'bg-amber-500'
            : tier === 'Low Risk'
            ? 'bg-emerald-500'
            : 'bg-slate-400'
        }`}
      />
      {tier}
    </span>
  );
};
