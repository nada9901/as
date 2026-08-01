/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Patient Profile & Biometric Default Settings
 */

import React, { useState } from 'react';
import { User as UserIcon, Activity, ShieldAlert, CheckCircle, Bell, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { AGE_GROUP_LABELS } from '../types';

export const Profile: React.FC = () => {
  const { user, refreshProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [ageGroup, setAgeGroup] = useState(user?.age_group || 5);
  const [sex, setSex] = useState(user?.sex || 1);
  const [bmi, setBmi] = useState(user?.bmi || 26.5);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await apiService.updateProfile({
        full_name: fullName,
        age_group: Number(ageGroup),
        sex: Number(sex),
        bmi: Number(bmi),
      });
      await refreshProfile();
      setMessage('Biometric profile defaults updated successfully.');
    } catch (err: any) {
      setError('Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to deactivate your HealthGluco account? This action will archive your longitudinal records.')) {
      return;
    }
    try {
      await apiService.deleteAccount();
      await logout();
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          Account Settings &amp; Biometrics
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage your default parameters for the 21-feature screening wizard
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleUpdateProfile}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fullName-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Full Name
            </label>
            <input
              id="fullName-input"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="email-display"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <input
              id="email-display"
              type="email"
              disabled
              value={user?.email || ''}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 py-2.5 px-3 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="age-profile-select"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Default Age Category
            </label>
            <select
              id="age-profile-select"
              value={ageGroup}
              onChange={(e) => setAgeGroup(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
            >
              {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sex-profile-select"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Biological Sex
            </label>
            <select
              id="sex-profile-select"
              value={sex}
              onChange={(e) => setSex(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
            >
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="bmi-profile-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Default Body Mass Index (BMI)
            </label>
            <input
              id="bmi-profile-input"
              type="number"
              step="0.1"
              min="10"
              max="80"
              value={bmi}
              onChange={(e) => setBmi(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Account Role &amp; Permission
            </label>
            <div className="mt-2 text-sm font-bold text-teal-600 dark:text-teal-400">
              {user?.role}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Biometric Defaults'}
          </button>
        </div>
      </form>

      {/* Account Deactivation Panel */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-100">
              Deactivate HealthGluco Account
            </h3>
            <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
              Deactivating your account will archive your screening records and disable further login.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Deactivate My Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
