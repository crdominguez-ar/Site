import React from 'react';
import { UserRole } from '../../types';
import { Shield, ChevronDown, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'simulators' | 'diagnostic' | 'portal' | 'crm';
  setCurrentTab: (tab: 'landing' | 'simulators' | 'diagnostic' | 'portal' | 'crm') => void;
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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            Domínguez & Lambrecht
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 ml-2 font-mono">
            / Consultoría Estratégica
          </span>
        </button>

        {/* Zone 2: Navigation Links (single line whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <button
            type="button"
            onClick={() => setCurrentTab('landing')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              currentTab === 'landing' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Propuesta de Valor
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('simulators')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              currentTab === 'simulators' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Simuladores Financieros
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('diagnostic')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              currentTab === 'diagnostic' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Diagnóstico
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('portal')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              currentTab === 'portal' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Portal Clientes
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('crm')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              currentTab === 'crm' ? 'text-cyan-400 border-b border-cyan-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            CRM Interno
          </button>
        </nav>

        {/* Zone 3: 1 primary action + role toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick role switcher for testing all perspectives */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="hidden sm:inline text-[10px] text-slate-400 uppercase font-mono px-1.5">
              Rol:
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="admin" className="bg-slate-900 text-white">Socio (Cr. Domínguez)</option>
              <option value="consultant" className="bg-slate-900 text-white">Consultor Staff</option>
              <option value="client" className="bg-slate-900 text-white">Cliente (Portal)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-cyan-950/30"
          >
            Solicitar Asesoría
          </button>
        </div>
      </div>

      {/* Mobile secondary navigation strip */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] font-semibold text-slate-400 overflow-x-auto">
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'landing' ? 'text-cyan-400 font-bold' : ''}`}
        >
          Propuesta
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('simulators')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'simulators' ? 'text-cyan-400 font-bold' : ''}`}
        >
          Simuladores
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('diagnostic')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'diagnostic' ? 'text-cyan-400 font-bold' : ''}`}
        >
          Diagnóstico
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('portal')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'portal' ? 'text-cyan-400 font-bold' : ''}`}
        >
          Portal
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('crm')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'crm' ? 'text-cyan-400 font-bold' : ''}`}
        >
          CRM
        </button>
      </div>
    </header>
  );
};
