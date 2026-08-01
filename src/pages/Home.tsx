/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Home & Landing Page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  ArrowRight,
  FileText,
  BarChart2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  Award,
  Calculator,
  Lock,
  LogIn,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GaugeChart } from '../components/common/GaugeChart';

export const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Quick interactive BMI Calculator on Landing Page
  const [weightKg, setWeightKg] = useState(78);
  const [heightCm, setHeightCm] = useState(175);
  const calculatedBmi = Number(((weightKg / Math.pow(heightCm / 100, 2)) || 0).toFixed(1));

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-600 dark:text-amber-400' };
    if (bmi <= 24.9) return { label: 'Normal Weight', color: 'text-emerald-600 dark:text-emerald-400' };
    if (bmi <= 29.9) return { label: 'Overweight', color: 'text-amber-600 dark:text-amber-400' };
    return { label: 'Obese', color: 'text-rose-600 dark:text-rose-400' };
  };

  const bmiCategory = getBmiCategory(calculatedBmi);

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-900 via-slate-900 to-indigo-950 px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1.5 text-xs font-bold text-teal-300 backdrop-blur-xs border border-teal-500/30">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>XGBoost Epidemiological Screening Engine &bull; KSA MOH &amp; CDC BRFSS</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Clinical Diabetes Risk Stratification with{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300">
                0.10 High Sensitivity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              HealthGluco optimizes early screening across Saudi Arabia by replacing default 0.50 classification thresholds with an empirical <strong>0.10 clinical decision cutoff</strong>, preventing false-negative dismissals in at-risk KSA populations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/screen"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-base font-bold text-white shadow-lg hover:bg-teal-600 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Start 21-Feature Screening</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/history"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-xs border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <span>My Longitudinal History</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-base font-bold text-white shadow-lg hover:bg-teal-600 transition-all transform hover:-translate-y-0.5"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In to Start Screening</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-xs border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Create Free Patient Account</span>
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>84.2% ROC-AUC Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>21 Clinical Features</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Printable Clinical PDF Report</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Gauge Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
              Live Stratification Gauge Demo
            </span>
            <GaugeChart probability={42.5} riskTier="High Risk" size={240} />
            <div className="mt-4 w-full rounded-xl bg-rose-950/60 border border-rose-500/30 p-3 text-center">
              <p className="text-xs font-semibold text-rose-200">
                &bull; Probability 42.5% &gt; 0.10 Threshold &rarr; Flagged High Risk
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Recommended Action: FPG / HbA1c screening test & dietary consultation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface Login & User Creation Gateway (Required Before Prediction) */}
      {!isAuthenticated && (
        <section className="rounded-3xl border-2 border-teal-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 p-6 sm:p-10 shadow-xl text-white">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1.5 text-xs font-bold text-teal-300 border border-teal-500/30">
                <Lock className="h-4 w-4 text-teal-400" />
                <span>Authentication Required Before Clinical Prediction</span>
              </div>
              <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                Sign In or Create Your Patient Account to Start Screening
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                To protect patient privacy under Saudi Arabia Ministry of Health guidelines and generate longitudinal risk trajectories, user authentication is required before launching the 21-feature XGBoost prediction engine.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg hover:bg-teal-600 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Existing Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm sm:text-base font-bold text-white border border-white/20 hover:bg-white/20 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Free Patient Account</span>
                </Link>
              </div>
            </div>

            {/* Instant Demo One-Click Login Panel */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Instant Demo Access
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                Test with Preloaded Saudi MOH Profiles
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Want to evaluate the prediction wizard instantly without typing credentials? Use one-click demo sign in:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-600/80 hover:bg-teal-600 px-4 py-3 text-xs font-bold text-white transition-colors border border-teal-500/50"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Patient Demo Login &rarr;</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 px-4 py-3 text-xs font-bold text-white transition-colors border border-indigo-500/50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Demo Login &rarr;</span>
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-slate-400 text-center">
                One click on the sign in screen authenticates you and unlocks the prediction section.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Why 0.10 High Sensitivity Threshold? Epidemiological Explanation */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            0.10 Clinical Cutoff
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In epidemiological diabetes screening, a standard 0.50 threshold misses up to 68% of early prediabetic patients. Our 0.10 high-sensitivity threshold prioritizes recall to catch early risk.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            Longitudinal Tracking
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Save assessments over time to track risk score trajectory, BMI changes, and physical activity improvements. Compare any two screening reports side-by-side.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            PDF Clinical Reports
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Generate printable, professional clinical summary reports complete with gauge visualization, risk tier badge, top risk factors, and personalized lifestyle recommendations.
          </p>
        </div>
      </section>

      {/* Calm Image Cards: Saudi Arabia Vision 2030 Clinical & Lifestyle Prevention Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Kingdom of Saudi Arabia Healthcare Modernization
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              Vision 2030 Prevention &amp; Clinical Quality
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Empowering early diabetes screening across all KSA provinces with high-sensitivity predictive analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1: KSA MOH Proactive Regional Screening */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all hover:shadow-md flex flex-col">
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
                alt="Modern clinical healthcare and screening in Saudi Arabia"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                KSA MOH Vision 2030
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Proactive Regional Diabetes Screening
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Expanding preventive risk stratification across Riyadh, Makkah, Eastern Province, Madinah, and Aseer to detect prediabetes before clinical onset.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <span>0.10 High Sensitivity Threshold</span>
              </div>
            </div>
          </div>

          {/* Card 2: Mediterranean & Saudi Nutritional Lifestyle */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all hover:shadow-md flex flex-col">
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
                alt="Balanced nutrition and fresh vegetables"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                Dietary Prevention
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Saudi &amp; Mediterranean Nutritional Balance
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tailored recommendations promoting daily vegetable and fruit intake alongside cultural dietary adaptations to maintain healthy fasting blood glucose.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Personalized Lifestyle Guidance</span>
              </div>
            </div>
          </div>

          {/* Card 3: Economic Impact & SAR Savings */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all hover:shadow-md flex flex-col">
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=600&q=80"
                alt="Clinical analytics and economic impact assessment"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                Economic Impact
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  18,500 SAR (ر.س) Annual Prevention Savings
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Early detection and primary intervention prevent expensive secondary diabetic complications, reducing annual healthcare costs per patient by an estimated 18,500 SAR.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span>Saudi Health Council Economic Model</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick BMI Calculator Widget */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 dark:bg-teal-950 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
              <Calculator className="h-4 w-4" />
              <span>Biometric Pre-Screening</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              Interactive BMI & Risk Preview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Body Mass Index (BMI) is one of the strongest predictors in our XGBoost model. Adjust weight and height to see your BMI and normal reference range before starting the 21-feature assessment.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Weight: {weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)</span>
                  <span className="text-slate-500">30 kg - 180 kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Height: {heightCm} cm ({Math.floor(heightCm / 30.48)}' {Math.round((heightCm % 30.48) / 2.54)}")</span>
                  <span className="text-slate-500">120 cm - 215 cm</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="215"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 text-center">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
              Calculated Body Mass Index
            </span>
            <div className="mt-2 text-5xl font-extrabold font-mono text-slate-900 dark:text-white">
              {calculatedBmi}
            </div>
            <div className={`mt-2 text-base font-bold ${bmiCategory.color}`}>
              {bmiCategory.label}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 w-full text-[11px] font-semibold">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2 text-amber-700 dark:text-amber-300">
                <div>&lt;18.5</div>
                <div>Underweight</div>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2 text-emerald-700 dark:text-emerald-300">
                <div>18.5 - 24.9</div>
                <div>Normal</div>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2 text-amber-700 dark:text-amber-300">
                <div>25.0 - 29.9</div>
                <div>Overweight</div>
              </div>
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 p-2 text-rose-700 dark:text-rose-300">
                <div>30.0+</div>
                <div>Obese</div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate('/screen', { state: { initialBmi: calculatedBmi } })}
                className="mt-6 w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                Use BMI {calculatedBmi} in Screening Wizard &rarr;
              </button>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login', { state: { initialBmi: calculatedBmi } })}
                  className="w-full rounded-xl bg-teal-600 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Use BMI &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="rounded-3xl bg-slate-900 dark:bg-slate-800 px-6 py-12 text-white sm:px-12 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready for a Comprehensive Clinical Diabetes Screening?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Complete the 21-question screening wizard to receive an instant XGBoost probability score, risk category badge, and personalized clinical recommendations.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/screen"
              className="rounded-xl bg-teal-500 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-teal-600 transition-colors"
            >
              Launch Screening Wizard Now
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-teal-600 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In to Launch Screening Wizard</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-3.5 text-base font-bold text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                <span>Create Free Patient Account</span>
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
