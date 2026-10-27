/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { LandingView } from './components/Landing/LandingView';
import { CalculatorsSuite } from './components/Calculators/CalculatorsSuite';
import { InteractiveDiagnostic } from './components/Diagnostic/InteractiveDiagnostic';
import { ClientPortal } from './components/Portal/ClientPortal';
import { InternalCRM } from './components/CRM/InternalCRM';
import { ConsultationModal } from './components/Modals/ConsultationModal';
import { UserRole } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'simulators' | 'diagnostic' | 'portal' | 'crm'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);

  const handleTabChange = (tab: 'landing' | 'simulators' | 'diagnostic' | 'portal' | 'crm') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentTab === 'landing' && (
          <LandingView
            onSelectTab={handleTabChange}
            onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
          />
        )}

        {currentTab === 'simulators' && (
          <CalculatorsSuite />
        )}

        {currentTab === 'diagnostic' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Auditoría Inicial Automatizada
              </span>
              <h1 className="text-3xl font-black text-white">
                Diagnóstico Estratégico Empresarial
              </h1>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Evalúa en 4 pasos la estructura financiera, contingencias tributarias y potencial de franquiciabilidad o digitalización de tu organización.
              </p>
            </div>
            <InteractiveDiagnostic onLeadCreated={() => handleTabChange('crm')} />
          </div>
        )}

        {currentTab === 'portal' && (
          <ClientPortal />
        )}

        {currentTab === 'crm' && (
          <InternalCRM currentRole={currentRole} />
        )}
      </main>

      {/* Primary Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        onSuccess={() => {
          // If in admin mode, they can immediately see the lead in CRM
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleTabChange} />
    </div>
  );
}
