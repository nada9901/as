/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Administrator Analytics & Clinical Executive Dashboard
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  AlertTriangle,
  Download,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  BarChart2,
  PieChart as PieChartIcon,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { apiService } from '../services/api';
import { AdminDashboardData, User, AuditLogRecord } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [logsList, setLogsList] = useState<AuditLogRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit'>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dash, users, logs] = await Promise.all([
        apiService.getAdminDashboard(),
        apiService.getAdminUsers(),
        apiService.getAdminLogs(),
      ]);
      setData(dash);
      setUsersList(users);
      setLogsList(logs);
    } catch (err: any) {
      setError('Could not fetch administrator analytics. Please verify Administrator role.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      const exportData = await apiService.getAdminExport();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `healthgluco_export_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      // ignore
    }
  };

  const handleExportCSV = () => {
    if (!usersList || usersList.length === 0) return;
    const headers = ['id', 'email', 'full_name', 'role', 'age_group', 'sex', 'bmi', 'is_active'];
    const rows = usersList.map((u) =>
      [u.id, u.email, u.full_name, u.role, u.age_group, u.sex, u.bmi, u.is_active].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `healthgluco_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredUsers = usersList.filter(
    (u) => roleFilter === 'ALL' || u.role === roleFilter
  );

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Clinical Population &amp; Screening Analytics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Monitor model thresholds, longitudinal epidemiology, and system audit logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadDashboardData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export HIPAA JSON</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Overview & Epidemiology', icon: BarChart2 },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'audit', label: 'HIPAA Audit Logs', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Loading executive analytics &amp; audit stream...
        </div>
      ) : !data ? (
        <div className="py-16 text-center text-sm text-slate-500">
          No executive metrics found.
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & EPIDEMIOLOGY */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Registered Users
                    </span>
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    {data.metrics.totalUsers}
                  </div>
                  <span className="mt-1 block text-xs text-emerald-600 font-semibold">
                    &bull; Active HIPAA database accounts
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Assessments
                    </span>
                    <Activity className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    {data.metrics.totalPredictions}
                  </div>
                  <span className="mt-1 block text-xs text-slate-500">
                    &bull; Today: {data.metrics.todayPredictions} &bull; Week: {data.metrics.weeklyPredictions}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      High Risk Proportion
                    </span>
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                    {data.metrics.highRiskPercent.toFixed(1)}%
                  </div>
                  <span className="mt-1 block text-xs text-slate-500">
                    &bull; Probability &ge; 0.10 threshold
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Estimated KSA Savings
                    </span>
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {(data.metrics.estimatedSavingsSar || 0).toLocaleString()} <span className="text-sm font-normal">SAR (ر.س)</span>
                  </div>
                  <span className="mt-1 block text-xs text-emerald-600 font-semibold">
                    &bull; Vision 2030 early intervention
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      XGBoost Model Status
                    </span>
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {data.systemStatus.model_status}
                  </div>
                  <span className="mt-1 block text-xs text-slate-500 font-mono">
                    Cutoff: {data.systemStatus.model_threshold}
                  </span>
                </div>
              </div>

              {/* Recharts Charts Grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Risk Distribution Pie / Donut Chart */}
                <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Risk Stratification Breakdown
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Population Risk Tier Distribution
                    </h2>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.metrics.riskDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          label
                        >
                          {data.metrics.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Age Distribution Bar Chart */}
                <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Epidemiology Demographics
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Assessment Distribution by Age Category
                    </h2>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.metrics.ageDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                        <XAxis dataKey="age_group" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
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
                        <Bar dataKey="count" name="Assessments" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Saudi Arabia Regional Epidemiology (KSA MOH Vision 2030) */}
              {data.metrics.regionalDistribution && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        <MapPin className="h-4 w-4" />
                        <span>KSA Ministry of Health Epidemiological Coverage</span>
                      </div>
                      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        Saudi Arabia Regional Risk Stratification &amp; Screening Distribution
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {data.metrics.regionalDistribution.map((reg, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4"
                      >
                        <span className="block text-xs font-bold text-slate-500 truncate">
                          {reg.region}
                        </span>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                          {reg.count}{' '}
                          <span className="text-xs font-normal text-slate-500">screened</span>
                        </div>
                        <span className="mt-1 inline-block text-xs font-semibold text-teal-600 dark:text-teal-400">
                          Prevalence: {reg.prevalence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Filter Role:
                  </span>
                  {['ALL', 'Patient', 'Administrator'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleFilter(r)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                        roleFilter === r
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {r === 'ALL' ? 'All Roles' : r}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500">
                  Total accounts: {filteredUsers.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Account Role</th>
                      <th className="px-4 py-3">BMI / Sex</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                          {u.full_name}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                          {u.email}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              u.role === 'Administrator'
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          BMI: {u.bmi} &bull; {u.sex === 1 ? 'Male' : 'Female'}
                        </td>
                        <td className="px-4 py-3.5">
                          {u.is_active !== false ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                              <XCircle className="h-3.5 w-3.5" />
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: HIPAA AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    System &amp; Security Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tracks authentication, prediction evaluation, and administrative exports for HIPAA compliance
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">User / Account</th>
                      <th className="px-4 py-3">Action &amp; Endpoint</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                    {logsList.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-md px-2 py-0.5 font-bold ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : log.status === 'WARNING'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold">
                          {log.user_id}
                        </td>
                        <td className="px-4 py-3 text-teal-600 dark:text-teal-400">
                          {log.action} ({log.endpoint})
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                          {log.details || 'OK'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
