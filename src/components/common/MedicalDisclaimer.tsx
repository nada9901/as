/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Medical & Clinical Safety Disclaimer
 */

import React, { useState } from 'react';
import { AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'modal';
  onAccept?: () => void;
  onClose?: () => void;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = 'banner',
  onAccept,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clinical Screening Safety Notice
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>HealthGluco</strong> uses an XGBoost supervised machine learning model trained on the CDC Behavioral Risk Factor Surveillance System (BRFSS 2015) dataset.
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This prediction screening tool is designed for <strong>clinical decision support and educational screening only</strong>. It does not replace professional medical diagnosis, laboratory fasting plasma glucose (FPG) testing, HbA1c testing, or physician consultation.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onAccept) onAccept();
              }}
              className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div
      className="relative rounded-xl border border-amber-200 bg-amber-50/90 dark:border-amber-900/50 dark:bg-amber-950/40 p-4 text-amber-900 dark:text-amber-200"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="flex-1 text-xs sm:text-sm leading-relaxed">
          <span className="font-bold">Medical Disclaimer: </span>
          HealthGluco is an AI-powered clinical risk stratification tool using XGBoost on CDC BRFSS epidemiological data. Predictions are for clinical screening support and do not constitute a formal diagnosis. Consult a qualified physician for clinical blood glucose or HbA1c testing.
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1 text-amber-700 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-900/50"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
