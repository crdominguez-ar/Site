import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Building2,
  Globe,
  Scale,
  LineChart,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users
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
  const [isSuperMenuOpen, setIsSuperMenuOpen] = useState(false);
  const superMenuRef = useRef<HTMLDivElement>(null);
  const superMenuButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close super menu on escape or click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        superMenuRef.current && 
        !superMenuRef.current.contains(event.target as Node) &&
        superMenuButtonRef.current &&
        !superMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsSuperMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSuperMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSuperMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSuperMenuOpen(false);
    }, 250);
  };

  const handleNavClick = (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
    setIsSuperMenuOpen(false);
  };

  const strategicDivisions = [
    {
      num: '01',
      title: 'Costeo Marginal & PyMEs Patagónicas',
      desc: 'Ingeniería de costos, absorción industrial y punto de equilibrio.',
      icon: Building2,
      tag: 'Industrial',
      tab: 'solutions' as const,
    },
    {
      num: '02',
      title: 'Economía del Conocimiento & Factura E',
      desc: 'SaaS, creadores de software, cupo de divisas y régimen fiscal.',
      icon: Globe,
      tag: 'Exportación',
      tab: 'solutions' as const,
    },
    {
      num: '03',
      title: 'Evaluación y Blindaje de Franquicias (CCyC)',
      desc: 'Auditoría precontractual de COF, Payback real y dictámenes.',
      icon: Scale,
      tag: 'Ley 1512',
      tab: 'solutions' as const,
    },
    {
      num: '04',
      title: 'Dirección Financiera CFO On-Demand',
      desc: 'Comités mensuales, gestión del WACC y flujos proyectados.',
      icon: LineChart,
      tag: 'C-Level',
      tab: 'solutions' as const,
    },
    {
      num: '05',
      title: 'Empresas Autónomas IA & Criptoactivos',
      desc: 'Deducción de costos LLM, tesorerías on-chain y smart contracts.',
      icon: Cpu,
      tag: 'Vanguardia',
      tab: 'solutions' as const,
    },
  ];

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

        {/* Zone 2: Desktop Navigation Links with Super Menu Trigger */}
        <nav className="hidden xl:flex items-center gap-0.5 text-xs font-semibold text-slate-600">
          {/* Inicio */}
          <button
            type="button"
            onClick={() => handleNavClick('landing')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'landing' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            <span>Inicio</span>
            {currentTab === 'landing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Super Menu Trigger: Soluciones & Ecosistema */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={superMenuButtonRef}
              type="button"
              onClick={() => setIsSuperMenuOpen(!isSuperMenuOpen)}
              className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
                isSuperMenuOpen || currentTab === 'solutions' ? 'text-[#0078D4] font-bold' : 'text-slate-600'
              }`}
              aria-expanded={isSuperMenuOpen}
              aria-haspopup="true"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Soluciones & Ecosistema</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSuperMenuOpen ? 'rotate-180 text-[#0078D4]' : 'text-slate-400'}`} />
              {(currentTab === 'solutions' || isSuperMenuOpen) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
              )}
            </button>
          </div>

          {/* Simuladores */}
          <button
            type="button"
            onClick={() => handleNavClick('simulators')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'simulators' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simuladores</span>
            {currentTab === 'simulators' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Diagnóstico */}
          <button
            type="button"
            onClick={() => handleNavClick('diagnostic')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'diagnostic' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Diagnóstico</span>
            {currentTab === 'diagnostic' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Blog & Podcast */}
          <button
            type="button"
            onClick={() => handleNavClick('blog')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'blog' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog & Podcast</span>
            {currentTab === 'blog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Portal Clientes */}
          <button
            type="button"
            onClick={() => handleNavClick('portal')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'portal' ? 'text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Portal Clientes</span>
            {currentTab === 'portal' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Dashboard & CRM (Now integrates CRM, CMS, Widgets and SEO) */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'dashboard' || currentTab === 'crm' || currentTab === 'seo' ? 'text-[#0078D4] font-bold' : 'text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0078D4] animate-pulse" />
            <span>Dashboard & CRM</span>
            <span className="px-1.5 py-0.5 bg-blue-50 text-[#0078D4] border border-blue-200 rounded text-[9px] font-mono font-bold">
              CRM + SEO
            </span>
            {(currentTab === 'dashboard' || currentTab === 'crm' || currentTab === 'seo') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Desktop Actions & Role Selector */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Tenant role selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
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

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Solicitar Asesoría
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
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

      {/* ======================================================== */}
      {/* SUPER MENÚ (MEGA MENU) DESPLEGABLE DE ALTO IMPACTO       */}
      {/* ======================================================== */}
      {isSuperMenuOpen && (
        <div
          ref={superMenuRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="hidden xl:block absolute top-16 left-0 right-0 w-full bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2 z-50"
        >
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8">
            <div className="grid grid-cols-12 gap-8">
              
              {/* Columna 1: 5 Divisiones Especializadas (5 cols) */}
              <div className="col-span-5 space-y-4 border-r border-slate-100 pr-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0078D4] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
                    Cinco Divisiones Especializadas
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNavClick('solutions')}
                    className="text-xs font-bold text-[#0078D4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver catálogo completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {strategicDivisions.map((div) => {
                    const Icon = div.icon;
                    return (
                      <button
                        key={div.num}
                        type="button"
                        onClick={() => handleNavClick(div.tab)}
                        className="w-full p-2.5 rounded-lg text-left hover:bg-slate-50 transition-all group flex items-start gap-3 cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <div className="w-8 h-8 rounded-md bg-slate-100 text-[#0078D4] flex items-center justify-center shrink-0 group-hover:bg-[#0078D4] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#0078D4]">
                              {div.num}
                            </span>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors truncate block">
                              {div.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                            {div.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Columna 2: Herramientas Interactivas & Modelos (4 cols) */}
              <div className="col-span-4 space-y-4 border-r border-slate-100 pr-6">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Herramientas de Análisis & Diagnóstico
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Ecosistema Financiero Digital
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick('simulators')}
                    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="w-4 h-4 text-[#0078D4]" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4]">
                        Simuladores Financieros Interactivos
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Calculadoras de Payback, VAN/TIR, Punto de Equilibrio y Costo de Capital (WACC).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('diagnostic')}
                    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileCheck className="w-4 h-4 text-[#107C41]" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#107C41]">
                        Diagnóstico Estratégico Automatizado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Evaluación inicial en 4 etapas con reporte instantáneo de salud y contingencias.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('blog')}
                    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                        Blog & Artículos Técnicos
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Doctrina sobre Ley CCyC 1512, Factura E, economía del conocimiento y finanzas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('portal')}
                    className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-600">
                        Portal Privado de Clientes
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Bóveda documental segura de balances, auditorías y dictámenes fiduciarios.
                    </p>
                  </button>
                </div>
              </div>

              {/* Columna 3: Dashboard de Gestión, Auditoría SEO & Contacto (3 cols) */}
              <div className="col-span-3 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    Gestión Directiva & SEO
                  </span>

                  {/* Direct Link to SEO in Dashboard */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('seo')}
                    className="w-full p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-left transition-all hover:shadow-sm group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#0078D4] mb-1">
                      <Search className="w-4 h-4" />
                      <span className="text-xs font-black">Auditoría SEO & Metadatos</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Gestiona títulos, OpenGraph social cards, Schema JSON-LD y snippets de Google Console en el Dashboard.
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-[#0078D4] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Abrir módulo SEO en Dashboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>

                  {/* Direct Link to CRM & Pipeline */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-slate-900 mb-1">
                      <LayoutDashboard className="w-4 h-4 text-[#0078D4]" />
                      <span className="text-xs font-bold">Dashboard & Pipeline CRM</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Control comercial, agenda de reuniones Meet, correos y editor visual del sitio.
                    </p>
                  </button>
                </div>

                {/* Executive Contact Card */}
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 shadow-md">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] block">
                      Consultoría Personalizada
                    </span>
                    <h5 className="text-xs font-bold text-white mt-0.5">
                      Cr. Carlos Rodrigo Domínguez
                    </h5>
                    <span className="text-[10px] text-slate-400 block">
                      CPCE Provincia del Chubut
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSuperMenuOpen(false);
                        onOpenConsultationModal();
                      }}
                      className="w-full py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg transition-colors text-center cursor-pointer shadow-xs"
                    >
                      Agendar Consulta Directa
                    </button>
                    <a
                      href="https://wa.me/5492804567890?text=Hola%20Cr.%20Dom%C3%ADnguez,%20quisiera%20realizar%20una%20consulta%20profesional"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Directo</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE DRAWER / SLIDE-DOWN NAVIGATION                    */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div className="xl:hidden w-full bg-white border-b border-slate-200 px-4 py-5 shadow-2xl space-y-5 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Section 1: Main Pages */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Navegación Principal
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('landing')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'landing' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Home className="w-4 h-4 text-[#0078D4]" />
                <span>Inicio</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('solutions')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'solutions' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#0078D4]" />
                <span>Soluciones</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('simulators')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'simulators' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Calculator className="w-4 h-4 text-[#0078D4]" />
                <span>Simuladores</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('diagnostic')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'diagnostic' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <FileCheck className="w-4 h-4 text-[#0078D4]" />
                <span>Diagnóstico</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('blog')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'blog' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Blog & Notas</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('portal')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'portal' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Portal Clientes</span>
              </button>
            </div>
          </div>

          {/* Section 2: Dashboard & SEO */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Gestión Empresarial & SEO
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-left flex items-center justify-between text-xs font-bold text-[#0078D4] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-[#0078D4]" />
                  <span>Dashboard Integral & CRM</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('seo')}
                className="w-full p-3 rounded-lg bg-indigo-50/60 border border-indigo-200 text-left flex items-center justify-between text-xs font-bold text-indigo-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Auditoría SEO & Posicionamiento (En Dashboard)</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
