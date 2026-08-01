/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Longitudinal Patient Screening History
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Activity,
  Filter,
  GitCompare,
  ArrowRight,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileText,
  PlusCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { apiService } from '../services/api';
import { PredictionHistoryRecord } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { useAuth } from '../context/AuthContext';

export const PredictionHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [records, setRecords] = useState<PredictionHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [filterTier]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPredictionHistory(filterTier);
      setRecords(data.predictions || []);
    } catch (err: any) {
      setError('Could not fetch longitudinal history. Please check your session.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) return;
    navigate('/compare', { state: { selectedIds } });
  };

  // Format historical trend chart data (chronological order for line chart)
  const chartData = [...records]
    .reverse()
    .map((item, index) => ({
      date: new Date(item.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      probability: Number(item.probability.toFixed(1)),
      tier: item.risk_tier,
      idx: index + 1,
    }));

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Longitudinal Patient History
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track risk score trajectory &amp; evaluate clinical interventions over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length >= 2 && (
            <button
              type="button"
              onClick={handleCompare}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              <GitCompare className="h-4 w-4" />
              <span>Compare Selected ({selectedIds.length})</span>
            </button>
          )}

          <Link
            to="/screen"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Screening</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Longitudinal Trajectory Area Chart */}
      {chartData.length >= 2 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Longitudinal Trajectory
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <span>Diabetes Risk Score Over Time (%)</span>
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              0.10 Cutoff &rarr; High Sensitivity Alert Band &ge; 40%
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="probColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="probability"
                  name="Risk Score (%)"
                  stroke="#0d9488"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#probColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filtering Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Filter by Risk Level:
          </span>
          {['ALL', 'High Risk', 'Moderate Risk', 'Low Risk'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilterTier(tier)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                filterTier === tier
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tier === 'ALL' ? 'All Assessments' : tier}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing {records.length} assessments
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading longitudinal assessments...
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <History className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Screening Records Found
            </h3>
            <p className="text-xs text-slate-500">
              You have not recorded any assessments matching this filter yet.
            </p>
            <Link
              to="/screen"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
            >
              Start New Assessment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-center">Compare</th>
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="px-4 py-3">Probability Score</th>
                  <th className="px-4 py-3">Stratified Tier</th>
                  <th className="px-4 py-3">Top Risk Factors</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((rec) => {
                  const isChecked = selectedIds.includes(rec.id);
                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelection(rec.id)}
                          className="h-4 w-4 rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {new Date(rec.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(rec.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                          {rec.probability.toFixed(1)}%
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <RiskBadge tier={rec.risk_tier} size="sm" />
                      </td>

                      <td className="px-4 py-4 max-w-xs truncate text-xs text-slate-600 dark:text-slate-300">
                        {rec.top_risk_factors?.slice(0, 2).join(' • ') || 'Standard Profile'}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate('/result', {
                              state: {
                                prediction: rec,
                                payload: { BMI: 26.5, Age: 5, Sex: 1 }, // default display payload
                              },
                            })
                          }
                          className="rounded-lg px-3 py-1.5 text-xs font-bold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors"
                        >
                          View Report &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
