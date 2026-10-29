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
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
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
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      badgeBorder: 'border-blue-200',
      tabActive: 'bg-[#0078D4] text-white border-[#0078D4] shadow-xs',
      tabInactive: 'bg-blue-50/70 hover:bg-blue-100/80 border-blue-200/80 text-blue-950',
      panelBg: 'bg-gradient-to-b from-blue-50/40 via-white to-white',
      panelBorder: 'border-blue-200',
      cardBg: 'bg-blue-50/50 border-blue-200/70',
      numberBg: 'bg-[#0078D4] text-white',
      btnPrimary: 'bg-[#0078D4] hover:bg-[#106EBE] text-white',
    },
    digital_saas: {
      primary: '#107C41',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-200',
      tabActive: 'bg-[#107C41] text-white border-[#107C41] shadow-xs',
      tabInactive: 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-950',
      panelBg: 'bg-gradient-to-b from-emerald-50/40 via-white to-white',
      panelBorder: 'border-emerald-200',
      cardBg: 'bg-emerald-50/50 border-emerald-200/70',
      numberBg: 'bg-[#107C41] text-white',
      btnPrimary: 'bg-[#107C41] hover:bg-[#0E6A37] text-white',
    },
    franquicias: {
      primary: '#D97706',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      badgeBorder: 'border-amber-200',
      tabActive: 'bg-amber-600 text-white border-amber-600 shadow-xs',
      tabInactive: 'bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/80 text-amber-950',
      panelBg: 'bg-gradient-to-b from-amber-50/40 via-white to-white',
      panelBorder: 'border-amber-200',
      cardBg: 'bg-amber-50/50 border-amber-200/70',
      numberBg: 'bg-amber-600 text-white',
      btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    cfo_estrategico: {
      primary: '#4F46E5',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-900',
      badgeBorder: 'border-indigo-200',
      tabActive: 'bg-indigo-600 text-white border-indigo-600 shadow-xs',
      tabInactive: 'bg-indigo-50/70 hover:bg-indigo-100/80 border-indigo-200/80 text-indigo-950',
      panelBg: 'bg-gradient-to-b from-indigo-50/40 via-white to-white',
      panelBorder: 'border-indigo-200',
      cardBg: 'bg-indigo-50/50 border-indigo-200/70',
      numberBg: 'bg-indigo-600 text-white',
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    ia_zhc: {
      primary: '#7C3AED',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-900',
      badgeBorder: 'border-purple-200',
      tabActive: 'bg-purple-600 text-white border-purple-600 shadow-xs',
      tabInactive: 'bg-purple-50/70 hover:bg-purple-100/80 border-purple-200/80 text-purple-950',
      panelBg: 'bg-gradient-to-b from-purple-50/40 via-white to-white',
      panelBorder: 'border-purple-200',
      cardBg: 'bg-purple-50/50 border-purple-200/70',
      numberBg: 'bg-purple-600 text-white',
      btnPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  };

  const activeTheme = VERTICAL_THEMES[selectedVertical];

  return (
    <div className="space-y-8">
      {/* Top Banner - Integrated, Refined Borders */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4]">
            <span>Soluciones Estratégicas</span>
            <span>·</span>
            <span>Cr Dominguez</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ingeniería Financiera, Tributaria & Modelos de Negocio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Identifica cada servicio especializado por su color representativo y conoce su alcance técnico, entregables certificados y marco normativo.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDiagnostic}
              className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-md transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Diagnosticar mi Empresa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onOpenSimulators}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs rounded-md transition-colors cursor-pointer"
            >
              <span>Abrir Simuladores Financieros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solutions Navigation Grid - Every service identified with its representative background tint */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => {
          const item = BUSINESS_VERTICALS[vKey];
          const isSelected = selectedVertical === vKey;
          const theme = VERTICAL_THEMES[vKey];

          return (
            <button
              key={vKey}
              type="button"
              onClick={() => setSelectedVertical(vKey)}
              className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected ? theme.tabActive : theme.tabInactive
              }`}
            >
              <div className="space-y-2">
                <div className={`p-1.5 rounded-md inline-block ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                  {verticalIcons[vKey]}
                </div>
                <h4 className={`text-xs font-bold block leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {item.shortTitle}
                </h4>
              </div>

              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                isSelected ? 'border-white/20 text-white/90' : 'border-slate-200/80 text-slate-500'
              }`}>
                <span>{isSelected ? 'Activo' : 'Ver alcance'}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-0.5' : 'opacity-50'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Service Deep-Dive Block - Integrated with the Selected Service's Palette */}
      <div className={`${activeTheme.panelBg} border ${activeTheme.panelBorder} rounded-xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span 
                className="p-2 rounded-lg inline-block text-white shadow-xs"
                style={{ backgroundColor: activeTheme.primary }}
              >
                {verticalIcons[selectedVertical]}
              </span>
              <div>
                <span 
                  className="text-[11px] font-mono uppercase tracking-wider block font-bold"
                  style={{ color: activeTheme.primary }}
                >
                  División Especializada
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {current.title}
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {current.description}
            </p>
          </div>

          <div className="p-4 bg-white/90 border border-slate-200/90 rounded-lg space-y-2 shrink-0 md:w-80 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Marco Normativo & Respaldo
            </span>
            <p className="text-xs text-slate-800 font-mono leading-relaxed">
              {current.normativeBase}
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#107C41] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Matrícula CPCE Chubut & FACPCE</span>
            </div>
          </div>
        </div>

        {/* 2-Column Breakdown: Key Aspects and Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Key Aspects */}
          <div className="space-y-3.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: activeTheme.primary }} />
              <span>Alcance Operativo & Puntos de Intervención</span>
            </h3>

            <div className="space-y-2">
              {current.keyAspects.map((aspect, index) => (
                <div key={index} className={`p-3 ${activeTheme.cardBg} rounded-lg flex items-start gap-3 transition-colors`}>
                  <span 
                    className="w-5 h-5 rounded-full text-white font-mono text-[11px] flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-2xs"
                    style={{ backgroundColor: activeTheme.primary }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs text-slate-800 leading-relaxed font-medium">
                    {aspect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Matrix */}
          <div className="space-y-3.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#107C41]" />
              <span>Entregables Formales & Dictámenes Certificados</span>
            </h3>

            <div className="space-y-2.5">
              {current.deliverables.map((deliv, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200/90 rounded-lg space-y-1 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                    <span className="text-xs font-bold text-slate-900">{deliv}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                    Documento formal emitido con firma profesional del Cr. Carlos Rodrigo Domínguez, estructurado para toma de decisiones internas, presentaciones bancarias o defensas fiscales.
                  </p>
                </div>
              ))}
            </div>

            <div className={`p-4 ${activeTheme.cardBg} rounded-lg space-y-2 border`}>
              <span className="text-xs font-bold text-slate-900 block">
                ¿Necesitas aplicar esta solución a tu empresa?
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinamos un relevamiento inicial confidencial en nuestra sede de Trelew o en formato remoto seguro.
              </p>
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={onOpenConsultationModal}
                  className={`px-4 py-2 ${activeTheme.btnPrimary} font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer`}
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
