/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Application Footer & Compliance Links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                Health<span className="text-teal-600 dark:text-teal-400">Gluco</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Production-ready healthcare SaaS platform for XGBoost-powered diabetes risk screening, longitudinal tracking, and clinical decision support.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>HIPAA / GDPR Ready Architecture</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Clinical Tools
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/screen" className="hover:text-teal-600 transition-colors">
                  21-Feature XGBoost Wizard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-teal-600 transition-colors">
                  Longitudinal Patient History
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-teal-600 transition-colors">
                  Compare Assessment Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Model & Architecture */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              AI & Architecture
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center justify-between">
                <span>Model Classifier</span>
                <span className="font-mono text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  XGBoost v2.1
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Risk Threshold</span>
                <span className="font-mono text-xs font-semibold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded text-amber-700 dark:text-amber-300">
                  0.10 (High Sensitivity)
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Training Dataset</span>
                <span className="font-mono text-xs text-slate-500">
                  CDC BRFSS 2015
                </span>
              </li>
            </ul>
          </div>

          {/* API Documentation Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Developer & API
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <a
                  href="/api/v1/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600 transition-colors"
                >
                  Swagger UI Docs
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="/api/v1/redoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600 transition-colors"
                >
                  ReDoc OpenAPI Spec
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="/api/v1/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600 transition-colors"
                >
                  Health Check Endpoint
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer Notice */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} HealthGluco AI Systems. Built with XGBoost, FastAPI, React 18, and Tailwind CSS.
          </p>
          <p className="mt-1">
            <strong>Clinical Notice:</strong> This software is designed for screening and decision support only and does not replace clinical laboratory testing or advice from a certified healthcare provider.
          </p>
        </div>
      </div>
    </footer>
  );
};
