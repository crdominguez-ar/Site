import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Building2, Globe, Scale, LineChart, Cpu, ShieldCheck } from 'lucide-react';
import { PartnerProfile } from '../About/PartnerProfile';
import { InteractiveDiagnostic } from '../Diagnostic/InteractiveDiagnostic';
import { ExecutiveVideoSection } from '../Video/ExecutiveVideoSection';
import { HeroCarousel } from './HeroCarousel';
import { contentService, SiteContent } from '../../lib/contentService';

interface LandingViewProps {
  onSelectTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => void;
  onOpenConsultationModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTab, onOpenConsultationModal }) => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());

  useEffect(() => {
    const unsub = contentService.subscribe((updated) => setContent(updated));
    return () => unsub();
  }, []);

  const getAxisIcon = (index: number) => {
    switch (index) {
      case 0: return Building2;
      case 1: return Globe;
      case 2: return Scale;
      case 3: return LineChart;
      case 4: return Cpu;
      default: return Building2;
    }
  };

  return (
    <div className="w-full space-y-0 pb-0 bg-white text-slate-900 overflow-x-hidden">
      {/* Block 1: Hero Carousel Full-Width (Multi-slide, Video-enabled, Microsoft Clean Style) */}
      <HeroCarousel 
        onSelectTab={onSelectTab} 
        onOpenConsultationModal={onOpenConsultationModal} 
      />

      {/* Block 2: Executive YouTube Video Player */}
      <ExecutiveVideoSection />

      {/* Block 3: 5 Strategic Axes - Bento Block Architecture with Full Solid Color Blocks & High Contrast */}
      <section className="w-full bg-[#080E18] text-white border-b border-slate-800 py-14 sm:py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden">
        {/* Subtle architectural ambient light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full space-y-8 sm:space-y-10 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>Cinco Divisiones Especializadas</span>
                <span>·</span>
                <span className="text-slate-400 font-semibold">{content.profile.founderName}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Arquitectura de Soluciones Estratégicas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-normal">
                Diseño en bloques modulares con metodologías financieras, tributarias y normativas ejecutadas con máxima precisión analítica.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('solutions')}
              className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-slate-950 text-xs font-bold rounded-md transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-white/20 self-start md:self-auto"
            >
              <span>Ver alcance detallado</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bento Modular Block Grid with Full Solid Color Backgrounds (Fondos Plenos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {content.axes.map((axis, idx) => {
              const Icon = getAxisIcon(idx);
              const bentoBlocks = [
                {
                  span: 'col-span-1 md:col-span-2',
                  bg: 'bg-[#0D223F]',
                  border: 'border-blue-700/60 hover:border-[#38BDF8]',
                  tagColor: 'text-[#38BDF8]',
                  tagBg: 'bg-blue-950/80 border-blue-800',
                  iconBg: 'bg-[#0078D4] text-white',
                  btnStyle: 'bg-[#0078D4] hover:bg-[#106EBE] text-white',
                  accentDot: 'text-[#38BDF8]',
                  isLead: true,
                },
                {
                  span: 'col-span-1',
                  bg: 'bg-[#0A3324]',
                  border: 'border-emerald-700/60 hover:border-[#4ADE80]',
                  tagColor: 'text-[#4ADE80]',
                  tagBg: 'bg-emerald-950/80 border-emerald-800',
                  iconBg: 'bg-[#107C41] text-white',
                  btnStyle: 'bg-[#107C41] hover:bg-[#0E6A37] text-white',
                  accentDot: 'text-[#4ADE80]',
                  isLead: false,
                },
                {
                  span: 'col-span-1',
                  bg: 'bg-[#3D1E0C]',
                  border: 'border-amber-700/60 hover:border-[#FBBF24]',
                  tagColor: 'text-[#FBBF24]',
                  tagBg: 'bg-amber-950/80 border-amber-800',
                  iconBg: 'bg-amber-600 text-white',
                  btnStyle: 'bg-[#D97706] hover:bg-[#B45309] text-white',
                  accentDot: 'text-[#FBBF24]',
                  isLead: false,
                },
                {
                  span: 'col-span-1',
                  bg: 'bg-[#191D45]',
                  border: 'border-indigo-700/60 hover:border-[#818CF8]',
                  tagColor: 'text-[#818CF8]',
                  tagBg: 'bg-indigo-950/80 border-indigo-800',
                  iconBg: 'bg-indigo-600 text-white',
                  btnStyle: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white',
                  accentDot: 'text-[#818CF8]',
                  isLead: false,
                },
                {
                  span: 'col-span-1',
                  bg: 'bg-[#291048]',
                  border: 'border-purple-700/60 hover:border-[#C084FC]',
                  tagColor: 'text-[#C084FC]',
                  tagBg: 'bg-purple-950/80 border-purple-800',
                  iconBg: 'bg-purple-600 text-white',
                  btnStyle: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
                  accentDot: 'text-[#C084FC]',
                  isLead: false,
                },
              ];
              const block = bentoBlocks[idx % bentoBlocks.length];

              return (
                <div 
                  key={axis.id}
                  className={`${block.span} ${block.bg} border ${block.border} rounded-lg p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden group`}
                >
                  <div>
                    {/* Top Monospace Tag & Icon */}
                    <div className="flex items-center justify-between text-xs font-mono mb-4">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold border uppercase tracking-wider ${block.tagColor} ${block.tagBg}`}>
                        {axis.number} · {axis.category}
                      </span>
                      <div className={`p-2 rounded-md ${block.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* High-Contrast Bold Headline */}
                    <h3 className={`font-black text-white tracking-tight mb-2.5 ${block.isLead ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
                      {axis.title}
                    </h3>

                    {/* High-Contrast Body Text */}
                    <p className={`text-slate-300 leading-relaxed mb-5 ${block.isLead ? 'text-xs sm:text-sm max-w-2xl' : 'text-xs'}`}>
                      {axis.description}
                    </p>

                    {/* Aspects Checklist with stark contrast */}
                    <ul className="text-xs text-slate-200 space-y-2 mb-6">
                      {axis.keyAspects.slice(0, block.isLead ? 3 : 2).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className={`${block.accentDot} font-black text-sm leading-none mt-0.5`}>■</span>
                          <span className="font-medium text-slate-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">Solución Integrada</span>
                    <button
                      type="button"
                      onClick={() => onSelectTab(axis.ctaTab)}
                      className={`px-3.5 py-2 ${block.btnStyle} rounded-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer`}
                    >
                      <span>{axis.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Block 4: Case Studies - Solid Modular Blocks with High-Contrast KPI Metrics */}
      <section className="w-full bg-[#F1F5F9] border-b border-slate-200 py-14 sm:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="w-full space-y-8 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
              <span>Resultados Comprobados & Auditorías Reales</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Impacto Cuantitativo en Empresas Patagónicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Métricas auditadas con respaldo normativo, reestructuración financiera y optimización fiscal demostrable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Case Block 1: Deep Navy Solid */}
            <div className="p-6 bg-[#0D223F] border border-blue-800/80 rounded-lg text-white space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 bg-blue-950 text-[#38BDF8] border border-blue-800 rounded text-[11px] font-mono font-bold uppercase tracking-wider inline-block">
                  Industrial · Trelew
                </span>
                <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                  Costos Ocultos y Punto de Equilibrio Marginal
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reclasificación analítica de costos fijos y absorción industrial que incrementó el margen de contribución en 6 meses de intervención.
                </p>
              </div>
              <div className="pt-4 border-t border-blue-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">Resultado Auditado</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#38BDF8]">
                  +18.4%
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Margen Operativo Neto Certificado</span>
              </div>
            </div>

            {/* Case Block 2: Deep Emerald Solid */}
            <div className="p-6 bg-[#0A3324] border border-emerald-800/80 rounded-lg text-white space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 bg-emerald-950 text-[#4ADE80] border border-emerald-800 rounded text-[11px] font-mono font-bold uppercase tracking-wider inline-block">
                  SaaS Tech · Puerto Madryn
                </span>
                <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                  Factura E & Economía del Conocimiento
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Encuadre fiscal integral con cupo legal de divisas, bono fiscal para contribuciones patronales y deducción de retenciones transfronterizas.
                </p>
              </div>
              <div className="pt-4 border-t border-emerald-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">Ahorro Impositivo</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#4ADE80]">
                  USD 48,000 / año
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Optimización Fiscal y Cambiaria</span>
              </div>
            </div>

            {/* Case Block 3: Deep Amber Solid */}
            <div className="p-6 bg-[#3D1E0C] border border-amber-800/80 rounded-lg text-white space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 bg-amber-950 text-[#FBBF24] border border-amber-800 rounded text-[11px] font-mono font-bold uppercase tracking-wider inline-block">
                  Red Comercial · Valle Chubut
                </span>
                <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                  Auditoría Precontractual de Franquicia (CCyC)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Identificación de cláusulas abusivas de exclusividad, recálculo de Payback real y renegociación formal del canon de ingreso inicial.
                </p>
              </div>
              <div className="pt-4 border-t border-amber-800/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">Beneficio Negociado</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#FBBF24]">
                  -25% Reducción
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Canon Inicial Directo Ahorrado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 5: Partner Profile (Tone: Crisp White #FFFFFF) */}
      <section className="w-full bg-white border-b border-slate-200 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <PartnerProfile />
        </div>
      </section>

      {/* Block 6: Interactive Diagnostic (Tone: Soft Gray #F8FAFC) */}
      <section className="w-full bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <InteractiveDiagnostic onLeadCreated={() => onSelectTab('crm')} />
        </div>
      </section>
    </div>
  );
};
