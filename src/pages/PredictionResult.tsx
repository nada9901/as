/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Comprehensive Clinical Screening Report Page
 */

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  HeartPulse,
  Printer,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  User,
  Calendar,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { GaugeChart } from '../components/common/GaugeChart';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  PredictionResponse,
  PredictionInputPayload,
  AGE_GROUP_LABELS
} from '../types';
import { useAuth } from '../context/AuthContext';

export const PredictionResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const prediction: PredictionResponse | undefined = location.state?.prediction;
  const payload: PredictionInputPayload | undefined = location.state?.payload;

  if (!prediction || !payload) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          No Assessment Data Found
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Please complete the 21-feature screening wizard to generate your clinical report.
        </p>
        <Link
          to="/screen"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors"
        >
          Start New Screening Assessment
        </Link>
      </div>
    );
  }

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Top Action Buttons (Hidden when printing) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          to="/screen"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>New Screening Assessment</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Download PDF Summary</span>
          </button>

          {isAuthenticated && (
            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>View Longitudinal History</span>
            </Link>
          )}
        </div>
      </div>

      {/* Printable Clinical Report Sheet */}
      <div
        id="clinical-report-sheet"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm print:shadow-none print:border-none print:p-0 space-y-8"
      >
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Clinical Diabetes Screening Report
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                XGBoost Epidemiological Risk Classifier &bull; Threshold 0.10
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              Patient: {user?.full_name || 'Anonymous Screening'}
            </div>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Report ID: HG-{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        </div>

        {/* Gauge Chart & Risk Tier Summary */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 p-6 border border-slate-100 dark:border-slate-800">
          <div className="md:col-span-6 flex flex-col items-center">
            <GaugeChart
              probability={prediction.probability}
              riskTier={prediction.risk_tier}
              size={240}
            />
          </div>

          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stratified Risk Category
              </span>
              <RiskBadge tier={prediction.risk_tier} size="lg" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {prediction.probability.toFixed(1)}% Probability Score
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {prediction.risk_tier === 'High Risk'
                ? 'Your screening profile exceeded the 0.10 high-sensitivity threshold, placing you in an elevated risk tier. We strongly recommend scheduling a fasting plasma glucose (FPG) or HbA1c test with your physician.'
                : prediction.risk_tier === 'Moderate Risk'
                ? 'Your screening profile indicates moderate diabetes risk factors. Dietary modifications, weight management, and regular physical activity can substantially lower future risk.'
                : 'Your screening profile shows a low probability of diabetes based on epidemiological indicators. Continue maintaining a healthy lifestyle and routine annual checkups.'}
            </p>
          </div>
        </div>

        {/* Top Contributing Risk Factors Breakdown */}
        {prediction.top_risk_factors && prediction.top_risk_factors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>Key Biometric &amp; Lifestyle Contributing Factors</span>
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {prediction.top_risk_factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold font-mono">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {factor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized Clinical Lifestyle Recommendations */}
        <div className="space-y-4 rounded-2xl border border-teal-200 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-950/20 p-6">
          <h3 className="text-base font-bold text-teal-900 dark:text-teal-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <span>Personalized Clinical Recommendations</span>
          </h3>

          <ul className="space-y-3">
            {prediction.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Patient Biometric Summary Sheet */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Screening Biometrics Summary
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">BMI</span>
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {payload.BMI}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Age Category</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {AGE_GROUP_LABELS[payload.Age] || `Tier ${payload.Age}`}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">High BP / Cholesterol</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {payload.HighBP ? 'Yes BP' : 'No BP'} &bull; {payload.HighChol ? 'Yes Chol' : 'No Chol'}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Physical Activity</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {payload.PhysActivity ? 'Active (30 days)' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Print Disclaimer Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-center text-[11px] text-slate-500">
          <p>
            HealthGluco XGBoost Epidemiological Screening Report &bull; Generated on {new Date().toLocaleString()}
          </p>
          <p className="mt-1">
            This document is for clinical screening and decision support only and does not replace fasting plasma glucose or HbA1c lab testing.
          </p>
        </div>
      </div>
    </div>
  );
};
