import React, { useState } from 'react';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { BusinessVertical } from '../../types';
import { 
  Building2, Globe, Scale, LineChart, Cpu, 
  CheckCircle2, ArrowRight, ShieldCheck, FileText, ChevronRight, Layers, Sparkles
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
    tradicional_pyme: <Building2 className="w-5 h-5 text-[#00A4EF]" />,
    digital_saas: <Globe className="w-5 h-5 text-[#107C41]" />,
    franquicias: <Scale className="w-5 h-5 text-[#0078D4]" />,
    cfo_estrategico: <LineChart className="w-5 h-5 text-[#00A4EF]" />,
    ia_zhc: <Cpu className="w-5 h-5 text-[#9B4F96]" />,
  };

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 fluent-shadow-elevated">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#00A4EF]">
            <span>Soluciones Estratégicas</span>
            <span>·</span>
            <span>Estudio Contable Domínguez & Lambrecht</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ingeniería Financiera, Tributaria & Modelos de Negocio
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Conoce en detalle el alcance técnico, la metodología de ejecución, los entregables certificados y el marco normativo de cada una de nuestras divisiones de consultoría.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDiagnostic}
              className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Diagnosticar mi Empresa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenSimulators}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-md transition-colors"
            >
              <span>Abrir Simuladores Financieros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solutions Navigation Grid (Microsoft Command Pivot Tabs) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => {
          const item = BUSINESS_VERTICALS[vKey];
          const isSelected = selectedVertical === vKey;

          return (
            <button
              key={vKey}
              type="button"
              onClick={() => setSelectedVertical(vKey)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-[#0078D4] ring-1 ring-[#0078D4] shadow-md'
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="p-2 bg-slate-950 rounded-lg inline-block border border-slate-800">
                  {verticalIcons[vKey]}
                </div>
                <h4 className="text-xs font-bold text-white block leading-tight">
                  {item.shortTitle}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Ver alcance</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#00A4EF] translate-x-1' : 'opacity-40'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Service Deep-Dive Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 fluent-shadow-elevated">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-950 rounded-lg border border-slate-800 inline-block">
                {verticalIcons[selectedVertical]}
              </span>
              <div>
                <span className="text-xs font-mono text-[#00A4EF] uppercase tracking-wider block font-semibold">
                  División Especializada
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {current.title}
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {current.description}
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 shrink-0 md:w-80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Marco Normativo & Respaldo
            </span>
            <p className="text-xs text-white font-mono leading-relaxed">
              {current.normativeBase}
            </p>
            <div className="pt-2 border-t border-slate-900 text-[11px] text-[#107C41] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Matrícula CPCE Chubut & FACPCE</span>
            </div>
          </div>
        </div>

        {/* 2-Column Breakdown: Key Aspects and Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Aspects */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0078D4]" />
              <span>Alcance Operativo & Puntos de Intervención</span>
            </h3>

            <div className="space-y-2.5">
              {current.keyAspects.map((aspect, index) => (
                <div key={index} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-[#00A4EF] font-mono text-xs flex items-center justify-center shrink-0 border border-slate-800 font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-xs text-slate-200 leading-relaxed font-medium">
                    {aspect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Matrix */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#107C41]" />
              <span>Entregables Formales & Dictámenes Certificados</span>
            </h3>

            <div className="space-y-3">
              {current.deliverables.map((deliv, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                    <span className="text-xs font-bold text-white">{deliv}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                    Documento formal emitido con firma profesional del Cr. Carlos Rodrigo Domínguez, estructurado para toma de decisiones internas, presentaciones bancarias o defensas fiscales.
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-950/40 to-slate-950 border border-blue-800/30 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-white block">
                ¿Necesitas aplicar esta solución a tu empresa?
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coordinamos un relevamiento inicial confidencial en nuestra sede de Trelew o en formato remoto seguro.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenConsultationModal}
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
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
