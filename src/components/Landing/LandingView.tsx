import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Building2, Globe, Scale, LineChart, Cpu } from 'lucide-react';
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

  const fontClass = (() => {
    switch (content.theme?.fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'geometric': return 'font-sans tracking-tight';
      case 'sans':
      default: return 'font-sans';
    }
  })();

  const radiusClass = (() => {
    switch (content.theme?.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'xl': return 'rounded-xl';
      case 'lg':
      default: return 'rounded-lg';
    }
  })();

  const sortedBlocks = [...(content.homeBlocks || [])]
    .sort((a, b) => a.order - b.order)
    .filter((b) => b.enabled);

  const renderBlock = (blockId: string) => {
    switch (blockId) {
      case 'hero':
        return (
          <HeroCarousel 
            key="hero"
            onSelectTab={onSelectTab} 
            onOpenConsultationModal={onOpenConsultationModal} 
          />
        );

      case 'video':
        return <ExecutiveVideoSection key="video" />;

      case 'axes': {
        const headers = content.homeSectionHeaders || {
          axesBadge: 'Cinco Divisiones Especializadas',
          axesTitle: 'Arquitectura de Soluciones Estratégicas',
          axesSubtitle: 'Diseño en bloques modulares con metodologías financieras, tributarias y normativas ejecutadas con máxima precisión analítica.',
        };

        const defaultCardColors = [
          { bg: '#0D223F', border: '#1D4ED8', tagColor: '#38BDF8', tagBg: 'bg-blue-950/80 border-blue-800', iconBg: 'bg-[#0078D4] text-white', btnBg: '#0078D4', dotColor: '#38BDF8', span: 'col-span-1 md:col-span-2', isLead: true },
          { bg: '#0A3324', border: '#047857', tagColor: '#4ADE80', tagBg: 'bg-emerald-950/80 border-emerald-800', iconBg: 'bg-[#107C41] text-white', btnBg: '#107C41', dotColor: '#4ADE80', span: 'col-span-1', isLead: false },
          { bg: '#3D1E0C', border: '#B45309', tagColor: '#FBBF24', tagBg: 'bg-amber-950/80 border-amber-800', iconBg: 'bg-amber-600 text-white', btnBg: '#D97706', dotColor: '#FBBF24', span: 'col-span-1', isLead: false },
          { bg: '#191D45', border: '#4338CA', tagColor: '#818CF8', tagBg: 'bg-indigo-950/80 border-indigo-800', iconBg: 'bg-indigo-600 text-white', btnBg: '#4F46E5', dotColor: '#818CF8', span: 'col-span-1', isLead: false },
          { bg: '#291048', border: '#7E22CE', tagColor: '#C084FC', tagBg: 'bg-purple-950/80 border-purple-800', iconBg: 'bg-purple-600 text-white', btnBg: '#7C3AED', dotColor: '#C084FC', span: 'col-span-1', isLead: false },
        ];

        return (
          <section 
            key="axes" 
            style={{ backgroundColor: content.theme?.axesBackground || '#080E18' }}
            className="w-full text-white border-b border-slate-800 py-14 sm:py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden transition-colors duration-300"
          >
            {/* Subtle architectural ambient light */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full space-y-8 sm:space-y-10 max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span>{headers.axesBadge}</span>
                    <span>·</span>
                    <span className="text-slate-400 font-semibold">{content.profile?.founderName || 'Cr. Carlos M. Domínguez'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {headers.axesTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-normal">
                    {headers.axesSubtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab('solutions')}
                  className={`px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-slate-950 text-xs font-bold ${radiusClass} transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-white/20 self-start md:self-auto`}
                >
                  <span>Ver alcance detallado</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {(content.axes || []).map((axis, idx) => {
                  const Icon = getAxisIcon(idx);
                  const def = defaultCardColors[idx % defaultCardColors.length];
                  const bgColor = axis.bgColor || def.bg;
                  const borderColor = axis.borderColor || def.border;
                  const tagColor = axis.tagColor || def.tagColor;
                  const btnColor = axis.btnColor || def.btnBg;
                  const span = def.span;
                  const isLead = def.isLead;

                  return (
                    <div 
                      key={axis.id}
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: borderColor 
                      }}
                      className={`${span} border ${radiusClass} p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden group`}
                    >
                      <div>
                        {/* Monospace Tag & Icon */}
                        <div className="flex items-center justify-between text-xs font-mono mb-4">
                          <span 
                            style={{ color: tagColor }}
                            className={`px-2.5 py-1 ${radiusClass} text-[11px] font-bold border uppercase tracking-wider bg-black/40 border-white/10`}
                          >
                            {axis.number} · {axis.category}
                          </span>
                          <div className={`p-2 ${radiusClass} ${def.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>

                        {/* High-Contrast Bold Headline */}
                        <h3 className={`font-black text-white tracking-tight mb-2.5 ${isLead ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
                          {axis.title}
                        </h3>

                        {/* High-Contrast Body Text */}
                        <p className={`text-slate-300 leading-relaxed mb-5 ${isLead ? 'text-xs sm:text-sm max-w-2xl' : 'text-xs'}`}>
                          {axis.description}
                        </p>

                        {/* Aspects Checklist */}
                        <ul className="text-xs text-slate-200 space-y-2 mb-6">
                          {(axis.keyAspects || []).slice(0, isLead ? 3 : 2).map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span style={{ color: tagColor }} className="font-black text-sm leading-none mt-0.5">■</span>
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
                          onClick={() => onSelectTab(axis.ctaTab || 'solutions')}
                          style={{ backgroundColor: btnColor }}
                          className={`px-3.5 py-2 text-white hover:opacity-90 ${radiusClass} text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer`}
                        >
                          <span>{axis.ctaLabel || 'Consultar'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      case 'case_studies': {
        const headers = content.homeSectionHeaders || {
          caseStudiesBadge: 'Resultados Comprobados & Auditorías Reales',
          caseStudiesTitle: 'Impacto Cuantitativo en Empresas Patagónicas',
          caseStudiesSubtitle: 'Métricas auditadas con respaldo normativo, reestructuración financiera y optimización fiscal demostrable.',
        };

        const defaultCaseColors = [
          { bg: '#0D223F', border: '#1D4ED8', tagColor: '#38BDF8', metricColor: '#38BDF8' },
          { bg: '#0A3324', border: '#047857', tagColor: '#4ADE80', metricColor: '#4ADE80' },
          { bg: '#3D1E0C', border: '#B45309', tagColor: '#FBBF24', metricColor: '#FBBF24' },
        ];

        return (
          <section key="case_studies" className="w-full bg-[#F1F5F9] border-b border-slate-200 py-14 sm:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
            <div className="w-full space-y-8 max-w-7xl mx-auto">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
                  <span>{headers.caseStudiesBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  {headers.caseStudiesTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                  {headers.caseStudiesSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {(content.caseStudies || []).map((study, idx) => {
                  const def = defaultCaseColors[idx % defaultCaseColors.length];
                  const bgColor = study.bgColor || def.bg;
                  const borderColor = study.borderColor || def.border;
                  const tagColor = study.tagColor || def.tagColor;
                  const metricColor = study.metricColor || def.metricColor;

                  return (
                    <div 
                      key={study.id || idx}
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: borderColor 
                      }}
                      className={`p-6 border ${radiusClass} text-white space-y-4 shadow-md flex flex-col justify-between`}
                    >
                      <div className="space-y-3">
                        <span 
                          style={{ color: tagColor }}
                          className={`px-2.5 py-1 bg-black/40 border border-white/10 ${radiusClass} text-[11px] font-mono font-bold uppercase tracking-wider inline-block`}
                        >
                          {study.tag}
                        </span>
                        <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                          {study.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {study.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                          {study.metricLabel || 'Resultado Auditado'}
                        </span>
                        <div 
                          style={{ color: metricColor }}
                          className="text-2xl sm:text-3xl font-black font-mono"
                        >
                          {study.metric}
                        </div>
                        <span className="text-[11px] text-slate-300 font-medium">
                          Garantía de Metodología Cr Dominguez
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      case 'profile':
        return (
          <section key="profile" className="w-full bg-white border-b border-slate-200 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
            <div className="w-full max-w-7xl mx-auto">
              <PartnerProfile />
            </div>
          </section>
        );

      case 'diagnostic':
        return (
          <section key="diagnostic" className="w-full bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
            <div className="w-full max-w-7xl mx-auto">
              <InteractiveDiagnostic onLeadCreated={() => onSelectTab('crm')} />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full space-y-0 pb-0 bg-white text-slate-900 overflow-x-hidden ${fontClass}`}>
      {sortedBlocks.map((block) => renderBlock(block.id))}
    </div>
  );
};
