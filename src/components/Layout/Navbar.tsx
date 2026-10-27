import React from 'react';
import { UserRole } from '../../types';
import { Sparkles, SlidersHorizontal, BookOpen, Shield } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo';
  setCurrentTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenConsultationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  onOpenConsultationModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 fluent-shadow-card w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Clean Corporate Monogram & Wordmark (sin ventanitas de colores) */}
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          {/* Refined corporate emblem D&L */}
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0078D4] to-[#004E8C] flex items-center justify-center text-white font-black text-xs tracking-wider shadow-sm border border-blue-400/30">
            D&L
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-[#00A4EF] transition-colors">
              Domínguez & Lambrecht
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              | Consultoría Estratégica
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Microsoft Fluent Pivot Tabs) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <button
            type="button"
            onClick={() => setCurrentTab('landing')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'landing' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Inicio
            {currentTab === 'landing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Soluciones Button requested by user */}
          <button
            type="button"
            onClick={() => setCurrentTab('solutions')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'solutions' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Soluciones
            {currentTab === 'solutions' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('simulators')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'simulators' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Simuladores
            {currentTab === 'simulators' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('diagnostic')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'diagnostic' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Diagnóstico
            {currentTab === 'diagnostic' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Blog / Perspectivas requested by user */}
          <button
            type="button"
            onClick={() => setCurrentTab('blog')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'blog' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Blog & Podcast
            {currentTab === 'blog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('portal')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'portal' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Portal Clientes
            {currentTab === 'portal' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('crm')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'crm' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            CRM Dynamics
            {currentTab === 'crm' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* SEO Control Tab */}
          <button
            type="button"
            onClick={() => setCurrentTab('seo')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-white ${
              currentTab === 'seo' ? 'text-white font-bold' : 'text-slate-400'
            }`}
          >
            Control SEO
            {currentTab === 'seo' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + role toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Microsoft 365 style role selector */}
          <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-xs">
            <span className="hidden sm:inline text-[11px] text-slate-400 font-mono mr-1.5">
              Entorno:
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="admin" className="bg-slate-900 text-white">Socio (Cr. Domínguez)</option>
              <option value="consultant" className="bg-slate-900 text-white">Consultor Staff</option>
              <option value="client" className="bg-slate-900 text-white">Cliente (Portal)</option>
            </select>
          </div>

          {/* Microsoft Azure Blue Primary Button */}
          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Solicitar Asesoría
          </button>
        </div>
      </div>

      {/* Mobile secondary navigation strip */}
      <div className="xl:hidden flex items-center justify-around px-2 py-2 bg-slate-950 border-t border-slate-800 text-[11px] font-semibold text-slate-400 overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'landing' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          Inicio
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('solutions')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'solutions' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          Soluciones
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('simulators')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'simulators' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          Simuladores
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('diagnostic')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'diagnostic' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          Diagnóstico
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('blog')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'blog' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          Blog
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('portal')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'portal' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          Portal
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('crm')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'crm' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          CRM
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('seo')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'seo' ? 'text-[#00A4EF] font-bold' : ''}`}
        >
          SEO
        </button>
      </div>
    </header>
  );
};
