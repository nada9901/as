/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Main Application Wrapper Layout
 */

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
        <MedicalDisclaimer variant="banner" />
      </div>
      <main className="flex-1 pb-12 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
