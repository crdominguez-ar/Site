import React, { useState, useRef, useEffect } from 'react';
import { UserRole, CoreServiceCode } from '../../types';
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
  ShieldCheck,
  Bot,
  Zap,
  FolderLock
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'arn' | 'crm' | 'seo' | 'cms' | 'dashboard' | 'agent';
  setCurrentTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'arn' | 'crm' | 'seo' | 'cms' | 'dashboard' | 'agent') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenConsultationModal: () => void;
  onSelectService?: (code: CoreServiceCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  onOpenConsultationModal,
  onSelectService,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSuperMenuOpen, setIsSuperMenuOpen] = useState(false);
  const [showTopCtaRibbon, setShowTopCtaRibbon] = useState(true);
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

  const handleNavClick = (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'arn' | 'crm' | 'seo' | 'cms' | 'dashboard' | 'agent') => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
    setIsSuperMenuOpen(false);
  };

  const handleServiceClick = (code: CoreServiceCode) => {
    if (onSelectService) {
      onSelectService(code);
    }
    handleNavClick('solutions');
  };

  const officialServicesList = [
    {
      code: '01' as CoreServiceCode,
      title: 'Diagnóstico de Unit Economics',
      desc: 'MRR/ARR, Churn, CAC y LTV. Cuánto deja cada cliente y cada plan.',
      badge: '2 a 3 sem',
      icon: LineChart,
    },
    {
      code: '02' as CoreServiceCode,
      title: 'Modelo Financiero & Pricing 36m',
      desc: 'Escenarios dinámicos, punto de equilibrio y curvas de costo de IA.',
      badge: '3 a 4 sem',
      icon: Calculator,
    },
    {
      code: '03' as CoreServiceCode,
      title: 'Estructuración del Exportador',
      desc: 'Factura E, liquidación Com. BCRA "A" 8481 y cobros tech en USD.',
      badge: 'BCRA 8481',
      icon: Globe,
    },
    {
      code: '04' as CoreServiceCode,
      title: 'Dirección Financiera CFO Fraccional',
      desc: 'Acompañamiento mensual, comités de socios, Runway y flujo de caja.',
      badge: 'Abono Mensual',
      icon: Building2,
    },
    {
      code: '05' as CoreServiceCode,
      title: 'Preparación para Inversores',
      desc: 'Data Room contable bajo FACPCE RT 54, cap tables y due diligence.',
      badge: 'Rondas VC',
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 fluent-shadow-card w-full max-w-full">
      {/* ======================================================== */}
      {/* TOP ANNOUNCEMENT & CALL TO ACTION (CTA) RIBBON           */}
      {/* ======================================================== */}
      {showTopCtaRibbon && (
        <div className="w-full bg-[#080E18] text-white border-b border-slate-800 px-4 sm:px-8 py-2 text-xs relative overflow-hidden transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950 text-[#38BDF8] border border-blue-800 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                Auditoría 2026
              </span>
              <p className="text-[11px] sm:text-xs text-slate-200 font-medium">
                ¿Exportas servicios tech o buscas ordenar tus Unit Economics? <span className="text-white font-bold">Diagnóstico y copiloto IA sin cargo.</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleNavClick('agent')}
                className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] rounded-md transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Bot className="w-3 h-3 text-amber-300" />
                <span>Consultar Agente IA</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('diagnostic')}
                className="hidden md:flex px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-semibold text-[11px] rounded-md border border-white/15 transition-all items-center gap-1 cursor-pointer"
              >
                <span>Diagnóstico sin Cargo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTopCtaRibbon(false)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors ml-1"
                aria-label="Cerrar aviso"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('landing')}
          className="flex items-center text-left whitespace-nowrap shrink-0 group focus:outline-none cursor-pointer"
          aria-label="Ir al inicio - Cr Dominguez"
        >
          <BrandLogo size="md" variant="light" showSubtitle={true} />
        </button>

        {/* Zone 2: Desktop Navigation Links (Embudo directo sin rutas rotas) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
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

          {/* Menú Soluciones (Con Dropdown Interactivo directo a 01-05) */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={superMenuButtonRef}
              type="button"
              onClick={() => handleNavClick('solutions')}
              className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
                isSuperMenuOpen || currentTab === 'solutions'
                  ? 'text-[#0078D4] font-bold' 
                  : 'text-slate-600'
              }`}
              aria-expanded={isSuperMenuOpen}
              aria-haspopup="true"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>Soluciones</span>
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[9px] font-mono">
                01 a 05
              </span>
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
            <Calculator className="w-3.5 h-3.5 text-[#0078D4]" />
            <span>Simuladores</span>
            {currentTab === 'simulators' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Agente IA Propio (Nuevo Copiloto Estratégico) */}
          <button
            type="button"
            onClick={() => handleNavClick('agent')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'agent' ? 'text-[#0078D4] font-bold' : 'text-slate-600'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Agente IA</span>
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0078D4] border border-blue-200 rounded text-[9px] font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Copiloto
            </span>
            {currentTab === 'agent' && (
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
            <span>Blog</span>
            {currentTab === 'blog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>

          {/* Dashboard & ARN (Cockpit Ejecutivo + Controles Web CMS) */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-5 transition-colors whitespace-nowrap relative hover:text-slate-950 flex items-center gap-1.5 cursor-pointer ${
              ['dashboard', 'arn', 'crm', 'cms', 'seo'].includes(currentTab) ? 'text-[#0078D4] font-bold' : 'text-slate-600'
            }`}
            title="Dashboard Ejecutivo & ARN: Controles del Sitio Web (CMS), Redes y Negocios, SEO y Suite Fiscal"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dashboard & ARN</span>
            <span className="px-1.5 py-0.5 bg-blue-50 text-[#0078D4] border border-blue-200 rounded text-[9px] font-mono font-bold">
              ARN + CMS
            </span>
            {['dashboard', 'arn', 'crm', 'cms', 'seo'].includes(currentTab) && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0078D4]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Desktop Action Buttons Cluster (Portal Clientes destacado + WhatsApp + Asesoría CTA) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Tenant role selector */}
          <div className="hidden 2xl:flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-mono mr-1.5">
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

          {/* Botón Destacado: Portal Clientes */}
          <button
            type="button"
            onClick={() => handleNavClick('portal')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer border ${
              currentTab === 'portal'
                ? 'bg-slate-950 text-white border-amber-400/80 ring-2 ring-amber-400/30'
                : 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white border-slate-700 hover:border-slate-600'
            }`}
            title="Acceso seguro al Portal Privado de Clientes y Dictámenes"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Clientes</span>
          </button>

          {/* Botón Destacado: WhatsApp Directo */}
          <a
            href="https://wa.me/5492804567890?text=Hola%20Cr.%20Dom%C3%ADnguez,%20quisiera%20realizar%20una%20consulta%20profesional"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Escribir por WhatsApp directamente al Cr. Carlos Domínguez"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Botón Destacado: Llamado a la Acción Principal */}
          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-lg transition-all whitespace-nowrap shrink-0 shadow-md cursor-pointer hover:shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Solicitar Asesoría</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex xl:hidden items-center gap-2">
          {/* Mobile Quick Agent */}
          <button
            type="button"
            onClick={() => handleNavClick('agent')}
            className="p-2 bg-blue-50 text-[#0078D4] border border-blue-200 rounded-md shadow-2xs"
            aria-label="Agente IA"
            title="Agente IA"
          >
            <Bot className="w-4 h-4 text-[#0078D4]" />
          </button>

          {/* Mobile Portal Clientes Quick Access */}
          <button
            type="button"
            onClick={() => handleNavClick('portal')}
            className="p-2 bg-slate-900 text-amber-400 rounded-md border border-slate-700 shadow-sm"
            aria-label="Portal Clientes"
            title="Portal Clientes"
          >
            <Lock className="w-4 h-4" />
          </button>

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
      {/* SUPER MENÚ (MEGA MENU) DESPLEGABLE DE SOLUCIONES         */}
      {/* ======================================================== */}
      {isSuperMenuOpen && (
        <div
          ref={superMenuRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="hidden xl:block absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2 z-50"
        >
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8">
            <div className="grid grid-cols-12 gap-8">
              
              {/* Columna 1: Cinco Servicios Canónicos (01 a 05) - Anclados y activos (5 cols) */}
              <div className="col-span-5 space-y-4 border-r border-slate-100 pr-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0078D4] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
                    Cinco Servicios Oficiales (01 a 05)
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
                  {officialServicesList.map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <button
                        key={svc.code}
                        type="button"
                        onClick={() => handleServiceClick(svc.code)}
                        className="w-full p-2.5 rounded-lg text-left hover:bg-slate-50 transition-all group flex items-start gap-3 cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <div className="w-8 h-8 rounded-md bg-slate-100 text-[#0078D4] flex items-center justify-center shrink-0 group-hover:bg-[#0078D4] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#0078D4]">
                              {svc.code}
                            </span>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors truncate block">
                              {svc.title}
                            </span>
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 text-slate-500 rounded shrink-0">
                              {svc.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                            {svc.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Columna 2: Herramientas Interactivas & Agente IA (4 cols) */}
              <div className="col-span-4 space-y-4 border-r border-slate-100 pr-6">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Herramientas de Decisión
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Ecosistema Financiero Digital
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Agente IA Propio */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('agent')}
                    className="p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black text-slate-900 group-hover:text-[#0078D4]">
                          Agente IA · Copiloto Financiero
                        </span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-[#0078D4] rounded text-[9px] font-mono font-bold">
                        Gemini Flash
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Consultas sobre Com. BCRA 8481, Unit Economics y encuadres societarios en tiempo real.
                    </p>
                  </button>

                  {/* Simuladores Financieros */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('simulators')}
                    className="p-3 bg-slate-50 hover:bg-blue-50/70 rounded-xl border border-slate-200/80 hover:border-blue-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="w-4 h-4 text-[#0078D4]" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4]">
                        Simuladores Financieros Interactivos
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Calculadoras de Unit Economics, Runway, Punto de Equilibrio y Factura E divisas.
                    </p>
                  </button>

                  {/* Diagnóstico Automatizado */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('diagnostic')}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/70 rounded-xl border border-slate-200/80 hover:border-emerald-200 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileCheck className="w-4 h-4 text-[#107C41]" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#107C41]">
                        Diagnóstico Estratégico Empresarial
                      </span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-[#107C41] rounded text-[9px] font-bold">
                        Sin Cargo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Evaluación inicial en 4 etapas con reporte instantáneo de madurez contable.
                    </p>
                  </button>

                  {/* Portal Privado Clientes */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('portal')}
                    className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition-all group cursor-pointer text-white"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white group-hover:text-amber-300">
                          Portal Privado de Clientes
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                        Seguro
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Bóveda fiduciaria para balances, auditorías, informes mensuales y dictámenes.
                    </p>
                  </button>
                </div>
              </div>

              {/* Columna 3: ARN & Centro Ejecutivo (3 cols) */}
              <div className="col-span-3 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    Centro de Control
                  </span>

                  {/* Direct Link to ARN */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('arn')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-slate-900 mb-0.5">
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-black">ARN · Redes & Negocios</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Radar de oportunidades, alertas cambiarias y CRM en vivo.
                    </p>
                    <div className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Cockpit ARN</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>

                  {/* Direct Link to Web CMS Controls */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('cms')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-slate-900 mb-0.5">
                      <Globe className="w-3.5 h-3.5 text-[#0078D4]" />
                      <span className="text-xs font-black">Control Web & CMS</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Todos los controles del sitio: sliders, fotos, textos y testimonios.
                    </p>
                    <div className="mt-1 text-[10px] font-bold text-[#0078D4] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Gestor de Contenidos</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>

                  {/* Direct Link to SEO in Dashboard */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('seo')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-slate-900 mb-0.5">
                      <Search className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs font-black">Auditoría SEO & Tráfico</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Posicionamiento en Google, metadatos y Search Console.
                    </p>
                  </button>
                </div>

                {/* Executive Call to Action Card */}
                <div className="p-4 bg-slate-950 text-white rounded-xl space-y-3 shadow-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] block flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                      Consultoría Estratégica
                    </span>
                    <h5 className="text-xs font-bold text-white mt-1">
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
                      className="w-full py-2 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white text-xs font-bold rounded-lg transition-colors text-center cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Agendar Consulta Directa</span>
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
          {/* Section 1: Main Action Banner for Mobile */}
          <div className="p-3 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#38BDF8] uppercase font-bold tracking-wider block">
              Copiloto & Diagnóstico 2026
            </span>
            <p className="text-xs text-slate-200">
              Consulta con nuestro Agente IA o inicia el diagnóstico empresarial sin cargo.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleNavClick('agent')}
                className="py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>Agente IA</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('diagnostic')}
                className="py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Diagnóstico</span>
              </button>
            </div>
          </div>

          {/* Section 2: Main Navigation Pages */}
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
                <span>Soluciones (01-05)</span>
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
                onClick={() => handleNavClick('agent')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'agent' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Agente IA</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('diagnostic')}
                className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                  currentTab === 'diagnostic' ? 'bg-blue-50 text-[#0078D4] border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <FileCheck className="w-4 h-4 text-[#107C41]" />
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

              {/* Botón Destacado: Portal Clientes */}
              <button
                type="button"
                onClick={() => handleNavClick('portal')}
                className="p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer bg-slate-900 text-white border-slate-800"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Portal Clientes</span>
              </button>

              {/* ARN Cockpit */}
              <button
                type="button"
                onClick={() => handleNavClick('arn')}
                className="p-3 rounded-lg text-xs font-bold flex items-center gap-2 border text-left cursor-pointer bg-emerald-50 text-emerald-900 border-emerald-200"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>ARN Negocios</span>
              </button>
            </div>
          </div>

          {/* Section 3: Dashboard, ARN & Controles Web */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Dashboard, ARN & Controles Web
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-left flex items-center justify-between text-xs font-bold text-[#0078D4] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-[#0078D4]" />
                  <span>Dashboard General & ARN (Cockpit)</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('arn')}
                className="w-full p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-left flex items-center justify-between text-xs font-bold text-emerald-900 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ARN (Redes & Negocios)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('cms')}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-left flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0078D4]" />
                  <span>Control Web & CMS (Sitio en Vivo)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('seo')}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-left flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-600" />
                  <span>Auditoría SEO & Posicionamiento</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
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
              className="w-full py-3 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-lg transition-colors text-center shadow-sm cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Solicitar Asesoría Estratégica</span>
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
