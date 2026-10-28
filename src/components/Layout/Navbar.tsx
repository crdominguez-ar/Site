import React, { useState } from 'react';
import { UserRole } from '../../types';
import { BrandLogo } from '../Common/BrandLogo';
import { 
  MessageCircle, 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  Calculator, 
  FileCheck, 
  BookOpen, 
  Lock, 
  LayoutDashboard, 
  Search,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Inicio', icon: Home },
    { id: 'solutions', label: 'Soluciones', icon: Briefcase },
    { id: 'simulators', label: 'Simuladores', icon: Calculator },
    { id: 'diagnostic', label: 'Diagnóstico', icon: FileCheck },
    { id: 'blog', label: 'Blog & Podcast', icon: BookOpen },
    { id: 'portal', label: 'Portal Clientes', icon: Lock },
    { id: 'dashboard', label: 'Dashboard & CRM', icon: LayoutDashboard },
    { id: 'seo', label: 'Auditoría SEO', icon: Search },
  ] as const;

  const handleNavClick = (tab: typeof navItems[number]['id']) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 fluent-shadow-card w-full max-w-full">
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo Cr Dominguez (Solo) */}
        <button
          type="button"
          onClick={() => handleNavClick('landing')}
          className="flex items-center text-left whitespace-nowrap shrink-0 group focus:outline-none cursor-pointer"
          aria-label="Ir al inicio - Cr Dominguez"
        >
          <BrandLogo size="md" variant="light" showSubtitle={true} />
        </button>

        {/* Zone 2: Desktop Navigation Links (Microsoft Pivot Tabs) - hidden on mobile/tablet */}
        <nav className="hidden xl:flex items-center gap-0.5 text-xs font-semibold text-slate-600">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-600'
                }`}
              >
                {item.id === 'dashboard' && <span className="w-2 h-2 rounded-full bg-[#0078D4]" />}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Desktop Actions & Role Selector */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Tenant role selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 shadow-xs">
            <span className="hidden md:inline text-[11px] text-slate-500 font-mono mr-1.5">
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
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Escribir por WhatsApp directamente al Cr. Carlos Domínguez"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
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

        {/* Mobile Hamburger Toggle Button (Visible on < xl) */}
        <div className="flex xl:hidden items-center gap-2">
          <a
            href="https://wa.me/5492804567890?text=Hola%20Cr.%20Dom%C3%ADnguez,%20quisiera%20realizar%20una%20consulta%20profesional"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#25D366] text-white rounded-md transition-colors shadow-sm"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden w-full bg-white border-b border-slate-200 px-4 py-5 shadow-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Navigation Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-blue-50 text-[#0078D4] border border-blue-200 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0078D4]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#0078D4]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Role selector on mobile */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Rol Activo del Sistema:
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0078D4]"
            >
              <option value="super_admin">Super Admin (Cr. Domínguez)</option>
              <option value="admin">Admin de Gestión</option>
              <option value="consultor_staff">Consultor Staff Senior</option>
              <option value="auditor_externo">Auditor Externo CCyC</option>
              <option value="cliente">Cliente (Portal Privado)</option>
            </select>
          </div>

          {/* Mobile CTA Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultationModal();
              }}
              className="w-full py-3 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-lg transition-colors text-center shadow-sm cursor-pointer min-h-[44px]"
            >
              Solicitar Asesoría Estratégica
            </button>

            <a
              href="https://wa.me/5492804567890?text=Hola%20Cr.%20Dom%C3%ADnguez,%20quisiera%20realizar%20una%20consulta%20profesional"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] rounded-lg transition-colors text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear por WhatsApp Directo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
