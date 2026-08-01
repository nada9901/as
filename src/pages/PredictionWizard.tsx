/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - 21-Feature XGBoost Clinical Screening Wizard
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  Activity,
  User,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calculator,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import {
  PredictionInputPayload,
  AGE_GROUP_LABELS,
  EDUCATION_LABELS,
  INCOME_LABELS
} from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PredictionWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state with sensible clinical defaults
  const [formData, setFormData] = useState<PredictionInputPayload>({
    BMI: location.state?.initialBmi || user?.bmi || 26.5,
    HighBP: 0,
    HighChol: 0,
    CholCheck: 1,
    Stroke: 0,
    HeartDiseaseorAttack: 0,
    Smoker: 0,
    HvyAlcoholConsump: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    MentHlth: 2,
    PhysHlth: 1,
    DiffWalk: 0,
    GenHlth: 2,
    Sex: user?.sex !== undefined ? user.sex : 1,
    Age: user?.age_group || 5, // 40-44 years
    Education: 6, // College graduate
    Income: 7,    // $50k-$75k
    AnyHealthcare: 1,
    NoDocbcCost: 0,
  });

  // Helper to load sample high-risk or low-risk profiles for testing
  const loadPreset = (preset: 'high' | 'low') => {
    if (preset === 'high') {
      setFormData({
        BMI: 34.2,
        HighBP: 1,
        HighChol: 1,
        CholCheck: 1,
        Stroke: 0,
        HeartDiseaseorAttack: 0,
        Smoker: 1,
        HvyAlcoholConsump: 0,
        PhysActivity: 0,
        Fruits: 0,
        Veggies: 0,
        MentHlth: 8,
        PhysHlth: 10,
        DiffWalk: 1,
        GenHlth: 4,
        Sex: 1,
        Age: 9,
        Education: 4,
        Income: 4,
        AnyHealthcare: 1,
        NoDocbcCost: 1,
      });
    } else {
      setFormData({
        BMI: 21.5,
        HighBP: 0,
        HighChol: 0,
        CholCheck: 1,
        Stroke: 0,
        HeartDiseaseorAttack: 0,
        Smoker: 0,
        HvyAlcoholConsump: 0,
        PhysActivity: 1,
        Fruits: 1,
        Veggies: 1,
        MentHlth: 0,
        PhysHlth: 0,
        DiffWalk: 0,
        GenHlth: 1,
        Sex: 0,
        Age: 4,
        Education: 6,
        Income: 8,
        AnyHealthcare: 1,
        NoDocbcCost: 0,
      });
    }
  };

  const handleToggle = (field: keyof PredictionInputPayload) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === 1 ? 0 : 1,
    }));
  };

  const handleNumberChange = (field: keyof PredictionInputPayload, val: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.submitPrediction(formData);
      navigate('/result', {
        state: {
          prediction: response,
          payload: formData,
        },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'An error occurred while evaluating risk score.'
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Demographics & Biometrics', subtitle: 'BMI, Age, Sex, Health' },
    { id: 2, label: 'Cardiovascular History', subtitle: 'BP, Cholesterol, Heart' },
    { id: 3, label: 'Lifestyle & Nutrition', subtitle: 'Activity, Diet, Habits' },
    { id: 4, label: 'Functional & Socioeconomic', subtitle: 'Mental, Physical, Access' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header & Quick Presets */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 dark:bg-teal-950 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
            <Sparkles className="h-4 w-4" />
            <span>XGBoost 21-Feature Assessment</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Clinical Diabetes Screening Wizard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Answer 21 epidemiological questions to generate an instant risk probability &amp; personalized report
          </p>
        </div>

        {/* Instant Testing Preset Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('high')}
            className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
            title="Auto-fill high risk parameters for instant testing"
          >
            Auto-Fill High Risk
          </button>
          <button
            type="button"
            onClick={() => loadPreset('low')}
            className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
            title="Auto-fill low risk parameters for instant testing"
          >
            Auto-Fill Low Risk
          </button>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                isCurrent
                  ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 ring-1 ring-teal-500'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold ${
                    isCurrent
                      ? 'text-teal-700 dark:text-teal-300'
                      : isCompleted
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  Step 0{step.id}
                </span>
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              </div>
              <span className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                {step.label}
              </span>
              <span className="text-[10px] text-slate-500">{step.subtitle}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Wizard Form Container */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* STEP 1: DEMOGRAPHICS & BIOMETRICS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 1: Demographics &amp; Biometrics
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="bmi-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Body Mass Index (BMI)
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    id="bmi-input"
                    type="number"
                    step="0.1"
                    min="10"
                    max="80"
                    value={formData.BMI}
                    onChange={(e) => handleNumberChange('BMI', Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    Normal: 18.5 - 24.9
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Weight (kg) divided by height squared (m²). Strongest risk factor in model.
                </p>
              </div>

              <div>
                <label
                  htmlFor="age-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Age Category
                </label>
                <select
                  id="age-select"
                  value={formData.Age}
                  onChange={(e) => handleNumberChange('Age', Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                >
                  {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  KSA MOH &amp; CDC BRFSS age stratification from 18-24 (1) to 80+ (13).
                </p>
              </div>

              <div>
                <label
                  htmlFor="sex-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Biological Sex
                </label>
                <select
                  id="sex-select"
                  value={formData.Sex}
                  onChange={(e) => handleNumberChange('Sex', Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                >
                  <option value={0}>Female</option>
                  <option value={1}>Male</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Sex assigned at birth (epidemiological model standard).
                </p>
              </div>

              <div>
                <label
                  htmlFor="genhlth-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  General Health Self-Rating
                </label>
                <select
                  id="genhlth-select"
                  value={formData.GenHlth}
                  onChange={(e) => handleNumberChange('GenHlth', Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                >
                  <option value={1}>1 - Excellent</option>
                  <option value={2}>2 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Fair</option>
                  <option value={5}>5 - Poor</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  In general, would you say your health is excellent, good, or poor?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CARDIOVASCULAR & CHRONIC HISTORY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 2: Cardiovascular &amp; Medical History
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  key: 'HighBP',
                  title: 'High Blood Pressure (Hypertension)',
                  desc: 'Have you ever been told by a doctor or health professional that you have high blood pressure?',
                },
                {
                  key: 'HighChol',
                  title: 'High Blood Cholesterol',
                  desc: 'Have you ever been told by a doctor or health professional that your cholesterol is high?',
                },
                {
                  key: 'CholCheck',
                  title: 'Cholesterol Checked in Past 5 Years',
                  desc: 'Have you had your cholesterol checked within the past five years?',
                },
                {
                  key: 'HeartDiseaseorAttack',
                  title: 'Coronary Heart Disease or Myocardial Infarction',
                  desc: 'Have you ever been diagnosed with coronary heart disease (CHD) or a heart attack?',
                },
                {
                  key: 'Stroke',
                  title: 'History of Stroke',
                  desc: 'Have you ever been told you had a stroke?',
                },
              ].map((item) => {
                const val = formData[item.key as keyof PredictionInputPayload];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key as any)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      val === 1
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          val === 1
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val === 1 ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: LIFESTYLE & NUTRITION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 3: Lifestyle &amp; Nutrition Habits
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  key: 'PhysActivity',
                  title: 'Physical Activity (Past 30 Days)',
                  desc: 'Have you participated in physical activity or exercise (running, walking, gardening) outside of work?',
                },
                {
                  key: 'Fruits',
                  title: 'Daily Fruit Consumption',
                  desc: 'Do you consume fruit 1 or more times per day?',
                },
                {
                  key: 'Veggies',
                  title: 'Daily Vegetable Consumption',
                  desc: 'Do you consume vegetables 1 or more times per day?',
                },
                {
                  key: 'Smoker',
                  title: 'Cigarette Smoker (>100 cigarettes)',
                  desc: 'Have you smoked at least 100 cigarettes in your entire life?',
                },
                {
                  key: 'HvyAlcoholConsump',
                  title: 'Heavy Alcohol Consumption',
                  desc: 'Adult men >14 drinks per week; Adult women >7 drinks per week.',
                },
              ].map((item) => {
                const val = formData[item.key as keyof PredictionInputPayload];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key as any)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      val === 1
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          val === 1
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val === 1 ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: FUNCTIONAL & SOCIOECONOMIC HEALTH */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Step 4: Functional &amp; Socioeconomic Health
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="physhlth-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Days of Poor Physical Health (0 - 30 days)
                </label>
                <input
                  id="physhlth-input"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.PhysHlth}
                  onChange={(e) =>
                    handleNumberChange(
                      'PhysHlth',
                      Math.min(30, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white font-mono"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  How many days during the past 30 days was your physical health not good?
                </p>
              </div>

              <div>
                <label
                  htmlFor="menthlth-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Days of Poor Mental Health (0 - 30 days)
                </label>
                <input
                  id="menthlth-input"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.MentHlth}
                  onChange={(e) =>
                    handleNumberChange(
                      'MentHlth',
                      Math.min(30, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white font-mono"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  How many days during the past 30 days was your mental health not good?
                </p>
              </div>

              <div>
                <label
                  htmlFor="edu-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Education Level Completed
                </label>
                <select
                  id="edu-select"
                  value={formData.Education}
                  onChange={(e) => handleNumberChange('Education', Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                >
                  {Object.entries(EDUCATION_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="income-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Household Income Category
                </label>
                <select
                  id="income-select"
                  value={formData.Income}
                  onChange={(e) => handleNumberChange('Income', Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-sm text-slate-900 dark:text-white"
                >
                  {Object.entries(INCOME_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    key: 'DiffWalk',
                    title: 'Difficulty Walking or Climbing Stairs',
                    desc: 'Do you have serious difficulty walking or climbing stairs?',
                  },
                  {
                    key: 'AnyHealthcare',
                    title: 'Any Healthcare Access / Insurance',
                    desc: 'Do you have any kind of health care coverage or insurance?',
                  },
                  {
                    key: 'NoDocbcCost',
                    title: 'Cost Prevented Doctor Visit',
                    desc: 'Was there a time in past 12 months when you needed to see a doctor but could not because of cost (in SAR / out-of-pocket)?',
                  },
                ].map((item) => {
                  const val = formData[item.key as keyof PredictionInputPayload];
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggle(item.key as any)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        val === 1
                          ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            val === 1
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {val === 1 ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-teal-700 transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
            >
              <HeartPulse className="h-5 w-5 animate-pulse" />
              <span>{loading ? 'Evaluating XGBoost Risk...' : 'Generate Clinical Screening Report'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
