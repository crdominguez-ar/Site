/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { LandingView } from './components/Landing/LandingView';
import { SolutionsView } from './components/Solutions/SolutionsView';
import { CalculatorsSuite } from './components/Calculators/CalculatorsSuite';
import { InteractiveDiagnostic } from './components/Diagnostic/InteractiveDiagnostic';
import { BlogView } from './components/Blog/BlogView';
import { ClientPortal } from './components/Portal/ClientPortal';
import { InternalCRM } from './components/CRM/InternalCRM';
import { SEOControlPanel } from './components/SEO/SEOControlPanel';
import { WidgetizableDashboard } from './components/Dashboard/WidgetizableDashboard';
import { ConsultationModal } from './components/Modals/ConsultationModal';
import { UserRole } from './types';
import { userService } from './lib/userService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => userService.getCurrentUser().role);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    userService.setCurrentRole(role);
  };

  const handleTabChange = (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
      />

      {/* Main Content Viewport - Full Width Ancho Completo */}
      <main className="flex-1 w-full min-h-screen">
        {currentTab === 'landing' && (
          <LandingView
            onSelectTab={handleTabChange}
            onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <div className="w-full">
            <WidgetizableDashboard
              onNavigateTab={handleTabChange}
              onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'solutions' && (
          <div className="w-full px-6 sm:px-12 lg:px-20 py-10 sm:py-14">
            <SolutionsView
              onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
              onOpenDiagnostic={() => handleTabChange('diagnostic')}
              onOpenSimulators={() => handleTabChange('simulators')}
            />
          </div>
        )}

        {currentTab === 'simulators' && (
          <div className="w-full px-6 sm:px-12 lg:px-20 py-10 sm:py-14">
            <CalculatorsSuite />
          </div>
        )}

        {currentTab === 'diagnostic' && (
          <div className="w-full px-6 sm:px-12 lg:px-20 py-10 sm:py-14 space-y-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4]">
                Auditoría Inicial Automatizada
              </span>
              <h1 className="text-3xl font-black text-slate-900">
                Diagnóstico Estratégico Empresarial
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                Evalúa en 4 pasos la estructura financiera, contingencias tributarias y potencial de franquiciabilidad o digitalización de tu organización.
              </p>
            </div>
            <InteractiveDiagnostic onLeadCreated={() => handleTabChange('crm')} />
          </div>
        )}

        {currentTab === 'blog' && (
          <div className="w-full px-6 sm:px-12 lg:px-20 py-10 sm:py-14">
            <BlogView />
          </div>
        )}

        {currentTab === 'portal' && (
          <div className="w-full px-6 sm:px-12 lg:px-20 py-10 sm:py-14">
            <ClientPortal />
          </div>
        )}

        {currentTab === 'crm' && (
          <div className="w-full">
            <WidgetizableDashboard
              initialView="crm"
              onNavigateTab={handleTabChange}
              onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'seo' && (
          <div className="w-full px-6 sm:px-12 lg:px-20 py-10 sm:py-14">
            <SEOControlPanel />
          </div>
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
