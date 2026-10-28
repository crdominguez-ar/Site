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
    tradicional_pyme: <Building2 className="w-5 h-5 text-[#0078D4]" />,
    digital_saas: <Globe className="w-5 h-5 text-[#107C41]" />,
    franquicias: <Scale className="w-5 h-5 text-[#0078D4]" />,
    cfo_estrategico: <LineChart className="w-5 h-5 text-[#0078D4]" />,
    ia_zhc: <Cpu className="w-5 h-5 text-[#8764B8]" />,
  };

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4]">
            <span>Soluciones Estratégicas</span>
            <span>·</span>
            <span>Cr Dominguez</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ingeniería Financiera, Tributaria & Modelos de Negocio
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
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
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm rounded-md transition-colors"
            >
              <span>Abrir Simuladores Financieros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solutions Navigation Grid (Microsoft Command Pivot Tabs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
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
                  ? 'bg-blue-50/70 border-[#0078D4] ring-1 ring-[#0078D4] shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="p-2 bg-slate-50 rounded-lg inline-block border border-slate-200">
                  {verticalIcons[vKey]}
                </div>
                <h4 className={`text-xs font-bold block leading-tight ${isSelected ? 'text-[#0078D4]' : 'text-slate-900'}`}>
                  {item.shortTitle}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Ver alcance</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#0078D4] translate-x-1' : 'opacity-40'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Service Deep-Dive Block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-50 rounded-lg border border-slate-200 inline-block">
                {verticalIcons[selectedVertical]}
              </span>
              <div>
                <span className="text-xs font-mono text-[#0078D4] uppercase tracking-wider block font-semibold">
                  División Especializada
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {current.title}
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {current.description}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shrink-0 md:w-80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Marco Normativo & Respaldo
            </span>
            <p className="text-xs text-slate-800 font-mono leading-relaxed">
              {current.normativeBase}
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-[#107C41] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Matrícula CPCE Chubut & FACPCE</span>
            </div>
          </div>
        </div>

        {/* 2-Column Breakdown: Key Aspects and Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Aspects */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0078D4]" />
              <span>Alcance Operativo & Puntos de Intervención</span>
            </h3>

            <div className="space-y-2.5">
              {current.keyAspects.map((aspect, index) => (
                <div key={index} className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-lg flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white text-[#0078D4] font-mono text-xs flex items-center justify-center shrink-0 border border-slate-200 font-bold mt-0.5 shadow-2xs">
                    {index + 1}
                  </span>
                  <span className="text-xs text-slate-700 leading-relaxed font-medium">
                    {aspect}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Matrix */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#107C41]" />
              <span>Entregables Formales & Dictámenes Certificados</span>
            </h3>

            <div className="space-y-3">
              {current.deliverables.map((deliv, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
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

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-900 block">
                ¿Necesitas aplicar esta solución a tu empresa?
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
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
