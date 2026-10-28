import React from 'react';
import { UserRole } from '../../types';
import { BrandLogo } from '../Common/BrandLogo';
import { MessageCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard';
  setCurrentTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => void;
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 fluent-shadow-card w-full">
      <div className="w-full px-6 sm:px-12 lg:px-20 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Clean Executive Logo Cr Dominguez (Solo) */}
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className="flex items-center text-left whitespace-nowrap shrink-0 group focus:outline-none cursor-pointer"
          aria-label="Ir al inicio - Cr Dominguez"
        >
          <BrandLogo size="md" variant="light" showSubtitle={true} />
        </button>

        {/* Zone 2: Navigation Links (Microsoft Pivot Tabs) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setCurrentTab('landing')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 ${
              currentTab === 'landing' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            Inicio
            {currentTab === 'landing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('solutions')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 ${
              currentTab === 'solutions' ? 'text-slate-950 font-bold' : 'text-slate-600'
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
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 ${
              currentTab === 'simulators' ? 'text-slate-950 font-bold' : 'text-slate-600'
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
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 ${
              currentTab === 'diagnostic' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            Diagnóstico
            {currentTab === 'diagnostic' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('blog')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 ${
              currentTab === 'blog' ? 'text-slate-950 font-bold' : 'text-slate-600'
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
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 ${
              currentTab === 'portal' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            Portal Clientes
            {currentTab === 'portal' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Dashboard (with integrated CRM & Widgets) */}
          <button
            type="button"
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 ${
              currentTab === 'dashboard' ? 'text-[#0078D4] font-bold' : 'text-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
            <span>Dashboard</span>
            {currentTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Control & Auditoría de Posicionamiento Orgánico */}
          <button
            type="button"
            onClick={() => setCurrentTab('seo')}
            title="Control & Auditoría de Posicionamiento Orgánico"
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 ${
              currentTab === 'seo' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            <span className="hidden 2xl:inline">Control & Auditoría de Posicionamiento Orgánico</span>
            <span className="2xl:hidden">Control & Auditoría SEO</span>
            {currentTab === 'seo' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + role toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Tenant role selector with comprehensive RBAC hierarchy */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 shadow-xs">
            <span className="hidden sm:inline text-[11px] text-slate-500 font-mono mr-1.5">
              Rol:
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-900 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-white text-slate-900">Super Admin (Cr. Domínguez)</option>
              <option value="admin" className="bg-white text-slate-900">Admin de Gestión</option>
              <option value="consultor_staff" className="bg-white text-slate-900">Consultor Staff Senior</option>
              <option value="auditor_externo" className="bg-white text-slate-900">Auditor Externo CCyC</option>
              <option value="cliente" className="bg-white text-slate-900">Cliente (Portal Privado)</option>
            </select>
          </div>

          {/* Quick WhatsApp Header Button */}
          <a
            href="https://wa.me/5492804567890?text=Hola%20Cr.%20Dom%C3%ADnguez,%20quisiera%20realizar%20una%20consulta%20profesional"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Escribir por WhatsApp directamente al Cr. Carlos Domínguez"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          {/* Microsoft Azure Blue Primary Button */}
          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Solicitar Asesoría
          </button>
        </div>
      </div>

      {/* Mobile secondary navigation strip */}
      <div className="xl:hidden flex items-center justify-around px-2 py-2 bg-slate-50 border-t border-slate-200 text-[11px] font-semibold text-slate-600 overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setCurrentTab('landing')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'landing' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Inicio
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('solutions')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'solutions' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Soluciones
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('simulators')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'simulators' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Simuladores
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('diagnostic')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'diagnostic' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Diagnóstico
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('blog')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'blog' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Blog
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('portal')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'portal' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Portal
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'dashboard' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('seo')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'seo' ? 'text-[#0078D4] font-bold' : ''}`}
        >
          Auditoría SEO
        </button>
      </div>
    </header>
  );
};
