import React, { useState } from 'react';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { BusinessVertical } from '../../types';
import { 
  Building2, Globe, Scale, LineChart, Cpu, 
  CheckCircle2, ArrowRight, ShieldCheck, FileText, ChevronRight, Layers
} from 'lucide-react';

interface SolutionsViewProps {
  onOpenConsultationModal: () => void;
  onOpenDiagnostic: () => void;
  onOpenSimulators: () => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  onOpenConsultationModal,
  onOpenDiagnostic,
  onOpenSimulators,
}) => {
  const [selectedVertical, setSelectedVertical] = useState<BusinessVertical>('tradicional_pyme');

  const current = BUSINESS_VERTICALS[selectedVertical];

  const verticalIcons: Record<BusinessVertical, React.ReactNode> = {
    tradicional_pyme: <Building2 className="w-5 h-5" />,
    digital_saas: <Globe className="w-5 h-5" />,
    franquicias: <Scale className="w-5 h-5" />,
    cfo_estrategico: <LineChart className="w-5 h-5" />,
    ia_zhc: <Cpu className="w-5 h-5" />,
  };

  const VERTICAL_THEMES: Record<BusinessVertical, {
    primary: string;
    accentTag: string;
    badgeBg: string;
    tabActive: string;
    tabInactive: string;
    panelBg: string;
    panelBorder: string;
    cardBg: string;
    numberBg: string;
    btnPrimary: string;
  }> = {
    tradicional_pyme: {
      primary: '#0078D4',
      accentTag: 'text-[#38BDF8]',
      badgeBg: 'bg-blue-950 border-blue-800 text-[#38BDF8]',
      tabActive: 'bg-[#0078D4] text-white border-blue-400 shadow-md ring-2 ring-blue-400',
      tabInactive: 'bg-[#0D223F] text-white border-blue-900/80 hover:border-[#38BDF8]',
      panelBg: 'bg-[#0A1A2F]',
      panelBorder: 'border-blue-900/80',
      cardBg: 'bg-blue-950/60 border-blue-800/80',
      numberBg: 'bg-[#0078D4] text-white',
      btnPrimary: 'bg-[#0078D4] hover:bg-[#106EBE] text-white',
    },
    digital_saas: {
      primary: '#107C41',
      accentTag: 'text-[#4ADE80]',
      badgeBg: 'bg-emerald-950 border-emerald-800 text-[#4ADE80]',
      tabActive: 'bg-[#107C41] text-white border-emerald-400 shadow-md ring-2 ring-emerald-400',
      tabInactive: 'bg-[#0A3324] text-white border-emerald-900/80 hover:border-[#4ADE80]',
      panelBg: 'bg-[#072419]',
      panelBorder: 'border-emerald-900/80',
      cardBg: 'bg-emerald-950/60 border-emerald-800/80',
      numberBg: 'bg-[#107C41] text-white',
      btnPrimary: 'bg-[#107C41] hover:bg-[#0E6A37] text-white',
    },
    franquicias: {
      primary: '#D97706',
      accentTag: 'text-[#FBBF24]',
      badgeBg: 'bg-amber-950 border-amber-800 text-[#FBBF24]',
      tabActive: 'bg-[#D97706] text-white border-amber-400 shadow-md ring-2 ring-amber-400',
      tabInactive: 'bg-[#3D1E0C] text-white border-amber-900/80 hover:border-[#FBBF24]',
      panelBg: 'bg-[#2E1609]',
      panelBorder: 'border-amber-900/80',
      cardBg: 'bg-amber-950/60 border-amber-800/80',
      numberBg: 'bg-[#D97706] text-white',
      btnPrimary: 'bg-[#D97706] hover:bg-[#B45309] text-white',
    },
    cfo_estrategico: {
      primary: '#4F46E5',
      accentTag: 'text-[#818CF8]',
      badgeBg: 'bg-indigo-950 border-indigo-800 text-[#818CF8]',
      tabActive: 'bg-[#4F46E5] text-white border-indigo-400 shadow-md ring-2 ring-indigo-400',
      tabInactive: 'bg-[#191D45] text-white border-indigo-900/80 hover:border-[#818CF8]',
      panelBg: 'bg-[#121533]',
      panelBorder: 'border-indigo-900/80',
      cardBg: 'bg-indigo-950/60 border-indigo-800/80',
      numberBg: 'bg-[#4F46E5] text-white',
      btnPrimary: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white',
    },
    ia_zhc: {
      primary: '#7C3AED',
      accentTag: 'text-[#C084FC]',
      badgeBg: 'bg-purple-950 border-purple-800 text-[#C084FC]',
      tabActive: 'bg-[#7C3AED] text-white border-purple-400 shadow-md ring-2 ring-purple-400',
      tabInactive: 'bg-[#291048] text-white border-purple-900/80 hover:border-[#C084FC]',
      panelBg: 'bg-[#1E0B36]',
      panelBorder: 'border-purple-900/80',
      cardBg: 'bg-purple-950/60 border-purple-800/80',
      numberBg: 'bg-[#7C3AED] text-white',
      btnPrimary: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
    },
  };

  const activeTheme = VERTICAL_THEMES[selectedVertical];

  return (
    <div className="space-y-8">
      {/* Top Banner - Solid Architectural Executive Canvas with High Typographic Contrast */}
      <div className="bg-[#080E18] text-white border border-slate-800 rounded-lg p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span>Soluciones Estratégicas · Cr Dominguez</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ingeniería Financiera, Tributaria & Modelos de Negocio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Arquitectura de consultoría en bloques modulares con fondos plenos y alta legibilidad: alcance técnico, entregables certificados y marco normativo auditado.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onOpenDiagnostic}
              className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-md transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Diagnosticar mi Empresa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onOpenSimulators}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-slate-950 border border-white/20 font-bold text-xs rounded-md transition-all cursor-pointer"
            >
              <span>Abrir Simuladores Financieros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solutions Navigation Grid - Solid Color Blocks (Fondos Plenos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => {
          const item = BUSINESS_VERTICALS[vKey];
          const isSelected = selectedVertical === vKey;
          const theme = VERTICAL_THEMES[vKey];

          return (
            <button
              key={vKey}
              type="button"
              onClick={() => setSelectedVertical(vKey)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected ? theme.tabActive : theme.tabInactive
              }`}
            >
              <div className="space-y-2.5">
                <div className={`p-2 rounded-md inline-block ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-white border border-white/10'}`}>
                  {verticalIcons[vKey]}
                </div>
                <h4 className="text-xs font-black block leading-tight text-white tracking-wide">
                  {item.shortTitle}
                </h4>
              </div>

              <div className={`mt-4 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
                isSelected ? 'border-white/30 text-white font-bold' : 'border-white/10 text-slate-300'
              }`}>
                <span>{isSelected ? '■ ACTIVO' : 'VER ALCANCE'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : 'opacity-70'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Service Deep-Dive Block - Full Solid Modular Block Architecture */}
      <div className={`${activeTheme.panelBg} text-white border ${activeTheme.panelBorder} rounded-lg p-6 sm:p-10 space-y-8 shadow-xl transition-all duration-300`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span 
                className="p-2.5 rounded-lg inline-block text-white shadow-md"
                style={{ backgroundColor: activeTheme.primary }}
              >
                {verticalIcons[selectedVertical]}
              </span>
              <div>
                <span className={`text-[11px] font-mono uppercase tracking-wider block font-bold ${activeTheme.accentTag}`}>
                  División Especializada
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {current.title}
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
              {current.description}
            </p>
          </div>

          <div className="p-4 bg-black/40 border border-white/10 rounded-lg space-y-2 shrink-0 md:w-80 shadow-md">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Marco Normativo & Respaldo
            </span>
            <p className="text-xs text-white font-mono leading-relaxed">
              {current.normativeBase}
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] text-[#4ADE80] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Matrícula CPCE Chubut & FACPCE</span>
            </div>
          </div>
        </div>

        {/* 2-Column Breakdown: Key Aspects and Deliverables in Solid Modular Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Key Aspects Block */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: activeTheme.primary }} />
              <span>Alcance Operativo & Puntos de Intervención</span>
            </h3>

            <div className="space-y-2.5">
              {current.keyAspects.map((aspect, index) => (
                <div key={index} className={`p-3.5 ${activeTheme.cardBg} border rounded-lg flex items-start gap-3 shadow-xs`}>
                  <span 
                    className="w-5 h-5 rounded text-white font-mono text-[11px] flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-xs"
                    style={{ backgroundColor: activeTheme.primary }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs text-slate-100 leading-relaxed font-medium">
                    {aspect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Matrix Block */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4ADE80]" />
              <span>Entregables Formales & Dictámenes Certificados</span>
            </h3>

            <div className="space-y-2.5">
              {current.deliverables.map((deliv, idx) => (
                <div key={idx} className="p-3.5 bg-black/30 border border-white/10 rounded-lg space-y-1 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                    <span className="text-xs font-bold text-white">{deliv}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                    Documento formal emitido con firma profesional del Cr. Carlos Rodrigo Domínguez, estructurado para toma de decisiones internas, presentaciones bancarias o defensas fiscales.
                  </p>
                </div>
              ))}
            </div>

            {/* Direct Consultation CTA Solid Card */}
            <div className={`p-4 ${activeTheme.cardBg} border rounded-lg space-y-2 mt-4`}>
              <span className="text-xs font-bold text-white block">
                ¿Necesitas aplicar esta solución a tu empresa?
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                Coordinamos un relevamiento inicial confidencial en nuestra sede de Trelew o en formato remoto seguro.
              </p>
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={onOpenConsultationModal}
                  className={`px-4 py-2 ${activeTheme.btnPrimary} font-bold text-xs rounded-md transition-all flex items-center gap-1.5 shadow-md cursor-pointer`}
                >
                  <span>Solicitar Relevamiento para este Servicio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
