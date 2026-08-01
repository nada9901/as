/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Longitudinal Assessment Comparison Engine
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
  AlertCircle,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api';
import { PredictionHistoryRecord } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';

export const CompareResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedIds: string[] = location.state?.selectedIds || [];

  const [comparisons, setComparisons] = useState<PredictionHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trend, setTrend] = useState<{ probability_diff: number; bmi_diff: number } | null>(null);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      loadComparison();
    } else {
      setLoading(false);
    }
  }, [selectedIds]);

  const loadComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.comparePredictions(selectedIds);
      setComparisons(res.comparison || []);
      setTrend(res.trend_analysis || null);
    } catch (err: any) {
      setError('Failed to load assessment comparison data.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length < 2) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <GitCompare className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Assessments Selected for Comparison
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please select at least two longitudinal screening reports from your Patient History table to evaluate trends.
        </p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Patient History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Longitudinal History</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Longitudinal Assessment Comparison
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Side-by-side risk score trajectory and biomarker progression
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Trajectory Analysis Summary Box */}
      {trend && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Risk Score Trend Between Earliest &amp; Latest
            </span>
            <div className="mt-2 flex items-center gap-3">
              {trend.probability_diff > 0 ? (
                <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-2xl font-extrabold">
                    +{trend.probability_diff.toFixed(1)}%
                  </span>
                </div>
              ) : trend.probability_diff < 0 ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <TrendingDown className="h-6 w-6" />
                  <span className="text-2xl font-extrabold">
                    {trend.probability_diff.toFixed(1)}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-slate-500">
                  <Minus className="h-6 w-6" />
                  <span className="text-2xl font-extrabold">No Change</span>
                </div>
              )}
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {trend.probability_diff < 0
                  ? 'Favorable Risk Score Reduction!'
                  : trend.probability_diff > 0
                  ? 'Elevated Risk Trajectory Identified'
                  : 'Stable Risk Score'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              BMI Variation Over Assessments
            </span>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                {trend.bmi_diff > 0 ? `+${trend.bmi_diff}` : trend.bmi_diff}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {trend.bmi_diff < 0
                  ? 'Positive BMI Reduction Progress'
                  : trend.bmi_diff > 0
                  ? 'BMI Increase Detected'
                  : 'BMI Unchanged'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Loading comparison data...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((rec, index) => (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Assessment #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {new Date(rec.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-center py-4">
                  <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {rec.probability.toFixed(1)}%
                  </span>
                  <div className="mt-2 flex justify-center">
                    <RiskBadge tier={rec.risk_tier} size="md" />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Primary Contributing Risk Factors:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {rec.top_risk_factors?.map((rf, idx) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Recommended Intervention:
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-snug">
                    {rec.recommendations?.[0] || 'Standard clinical lifestyle monitoring.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/result', {
                    state: {
                      prediction: rec,
                      payload: { BMI: 26.5, Age: 5, Sex: 1 },
                    },
                  })
                }
                className="mt-6 w-full rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/40 py-2.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors"
              >
                View Full Clinical Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
