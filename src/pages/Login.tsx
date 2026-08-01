/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Login Page with One-Click Demo Credentials
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, Mail, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiService.login({ email, password });
      await login(res.access_token, res.refresh_token, res.user);
      navigate(res.user.role === 'Administrator' ? '/admin' : '/screen');
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Invalid email or password. Please try again or use Demo Login.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('DemoPass123!');
    setError(null);
    setLoading(true);

    try {
      const res = await apiService.login({ email: demoEmail, password: 'DemoPass123!' });
      await login(res.access_token, res.refresh_token, res.user);
      navigate(res.user.role === 'Administrator' ? '/admin' : '/screen');
    } catch (err: any) {
      setError('Demo account is being initialized. Please register a test account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
          <HeartPulse className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
          Sign In to HealthGluco
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Access your longitudinal screening history &amp; clinical reports
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow-xs hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* One-Click Demo testing account buttons */}
        <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Instant Demo Account Access (One-Click Login)
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoFill('patient@healthgluco.ai')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/80 dark:bg-teal-950/40 px-3 py-2.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              <span>Patient Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('admin@healthgluco.ai')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 px-3 py-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Demo</span>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-center text-slate-400">
            No password typing required &mdash; click to sign in instantly with preloaded clinical data.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:underline">
            Register New Account
          </Link>
        </p>
      </div>
    </div>
  );
};
