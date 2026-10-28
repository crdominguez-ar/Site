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

      {/* Block 3: 5 Strategic Axes (Tone: Pure Crisp White #FFFFFF) */}
      <section className="w-full bg-white border-b border-slate-200 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="w-full space-y-8 sm:space-y-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-1">
                <span>Soluciones Empresariales</span>
                <span>·</span>
                <span className="text-slate-600 font-semibold">{content.profile.founderName}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Cinco Ejes de Consultoría Estratégica
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
                Metodologías analíticas adaptadas a la escala real de cada negocio. De la cooperativa regional a las arquitecturas autónomas de IA.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('solutions')}
              className="text-xs font-bold text-[#0078D4] hover:underline flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>Ver desarrollo de servicios</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid with Crisp Light Cards - Fully responsive across mobile, tablet and desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {content.axes.map((axis, idx) => {
              const Icon = getAxisIcon(idx);
              return (
                <div 
                  key={axis.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#0078D4] transition-all shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                      <span>{axis.number}. {axis.category}</span>
                      <div 
                        className="p-2 rounded border"
                        style={{ 
                          backgroundColor: `${axis.accentColor}10`,
                          borderColor: `${axis.accentColor}30`,
                          color: axis.accentColor
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                      {axis.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {axis.description}
                    </p>

                    <ul className="text-xs text-slate-700 space-y-2 mb-6">
                      {axis.keyAspects.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span style={{ color: axis.accentColor }} className="font-bold">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">Acceso Directo</span>
                    <button
                      type="button"
                      onClick={() => onSelectTab(axis.ctaTab)}
                      className="hover:underline font-bold cursor-pointer"
                      style={{ color: axis.accentColor }}
                    >
                      {axis.ctaLabel} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Block 4: Case Studies (Tone: Subtle Light Gray #F8FAFC) */}
      <section className="w-full bg-[#F8FAFC] border-b border-slate-200 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="w-full space-y-8 max-w-7xl mx-auto">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4]">
              Casos de Estudio & Métricas Cuantitativas
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
              Impacto Comprobado en Empresas de la Patagonia
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Metodología financiera aplicada con rigor normativo y resultados auditados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#0078D4]">Cooperativa Industrial · Trelew</span>
              <h4 className="text-sm font-bold text-slate-900">
                Determinación de Costos Ocultos y Punto de Equilibrio
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se estructuró una matriz de costeo marginal que reclasificó gastos fijos, incrementando el margen de contribución un 18.4% en 6 meses.
              </p>
              <div className="pt-3 border-t border-slate-100 text-xs font-mono text-[#107C41] font-bold">
                +18.4% Margen Operativo Neto
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#107C41]">SaaS B2B Tech · Puerto Madryn</span>
              <h4 className="text-sm font-bold text-slate-900">
                Liquidación de Factura E & Registro Economía del Conocimiento
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encuadre fiscal con cupo legal en dólares, bono de crédito fiscal para cargas sociales y deducción de retenciones internacionales.
              </p>
              <div className="pt-3 border-t border-slate-100 text-xs font-mono text-[#107C41] font-bold">
                USD 48,000 / año Ahorro Impositivo
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#0078D4]">Red Comercial · Valle de Chubut</span>
              <h4 className="text-sm font-bold text-slate-900">
                Auditoría Precontractual de Franquicia (CCyC 1512-1524)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identificación de cláusulas abusivas de exclusividad y recálculo del Payback real de 12 a 19 meses, renegociando el canon inicial un 25%.
              </p>
              <div className="pt-3 border-t border-slate-100 text-xs font-mono text-[#0078D4] font-bold">
                25% Reducción en Canon Inicial
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
