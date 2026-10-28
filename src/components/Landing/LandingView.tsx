import React from 'react';
import { ArrowRight, ChevronRight, Building2, Globe, Scale, LineChart, Cpu, ShieldCheck } from 'lucide-react';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { PartnerProfile } from '../About/PartnerProfile';
import { InteractiveDiagnostic } from '../Diagnostic/InteractiveDiagnostic';
import { ExecutiveVideoSection } from '../Video/ExecutiveVideoSection';
import { HeroCarousel } from './HeroCarousel';

interface LandingViewProps {
  onSelectTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo') => void;
  onOpenConsultationModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTab, onOpenConsultationModal }) => {
  return (
    <div className="w-full space-y-0 pb-0 bg-white text-slate-900">
      {/* Block 1: Hero Carousel Full-Width (Multi-slide, Video-enabled, Microsoft Clean Style) */}
      <HeroCarousel 
        onSelectTab={onSelectTab} 
        onOpenConsultationModal={onOpenConsultationModal} 
      />

      {/* Block 2: Executive YouTube Video Player (Tone: Soft Clean Gray #F8FAFC) */}
      <ExecutiveVideoSection />

      {/* Block 3: 5 Strategic Axes (Tone: Pure Crisp White #FFFFFF) */}
      <section className="w-full bg-white border-b border-slate-200 py-16 lg:py-20 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="w-full space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-1">
                <span>Soluciones Empresariales</span>
                <span>·</span>
                <span className="text-slate-600 font-semibold">Cr Dominguez</span>
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
              className="text-xs font-bold text-[#0078D4] hover:underline flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Ver desarrollo de servicios</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bento Grid with Crisp Light Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Tradicionales */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between hover:border-[#0078D4] transition-all shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                  <span>01. Costeo Marginal</span>
                  <div className="p-1.5 bg-blue-50 rounded border border-blue-100 text-[#0078D4]">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {BUSINESS_VERTICALS.tradicional_pyme.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.tradicional_pyme.description}
                </p>
                <ul className="text-xs text-slate-700 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.tradicional_pyme.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0078D4] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">Punto de Equilibrio</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#0078D4] hover:underline font-bold"
                >
                  Abrir Calculador →
                </button>
              </div>
            </div>

            {/* Card 2: Digitales & Creadores */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between hover:border-[#107C41] transition-all shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                  <span>02. Economía del Conocimiento</span>
                  <div className="p-1.5 bg-emerald-50 rounded border border-emerald-100 text-[#107C41]">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {BUSINESS_VERTICALS.digital_saas.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.digital_saas.description}
                </p>
                <ul className="text-xs text-slate-700 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.digital_saas.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#107C41] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">Factura E & Divisas</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#107C41] hover:underline font-bold"
                >
                  Simular Liquidación →
                </button>
              </div>
            </div>

            {/* Card 3: Franquicias */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between hover:border-[#0078D4] transition-all shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                  <span>03. Ley CCyC 1512-1524</span>
                  <div className="p-1.5 bg-blue-50 rounded border border-blue-100 text-[#0078D4]">
                    <Scale className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {BUSINESS_VERTICALS.franquicias.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.franquicias.description}
                </p>
                <ul className="text-xs text-slate-700 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.franquicias.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0078D4] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">Circular COF & Payback</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#0078D4] hover:underline font-bold"
                >
                  Auditar Franquicia →
                </button>
              </div>
            </div>

            {/* Card 4: CFO a Tiempo Parcial (col-span-2) */}
            <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between hover:border-[#0078D4] transition-all shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                  <span>04. Dirección Financiera Fraccional</span>
                  <div className="p-1.5 bg-blue-50 rounded border border-blue-100 text-[#0078D4]">
                    <LineChart className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {BUSINESS_VERTICALS.cfo_estrategico.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.cfo_estrategico.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-xs font-bold text-slate-900 block mb-1">Presupuestos a 12 Meses</span>
                    <span className="text-[11px] text-slate-600">Modelos dinámicos en pesos y dólares ajustados por inflación patagónica.</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-xs font-bold text-slate-900 block mb-1">Evaluación VAN / TIR</span>
                    <span className="text-[11px] text-slate-600">Análisis riguroso de proyectos de capital y tasa de corte WACC.</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Comités ejecutivos de dirección financiera</span>
                <button
                  type="button"
                  onClick={onOpenConsultationModal}
                  className="text-[#0078D4] hover:underline font-bold"
                >
                  Solicitar Propuesta CFO →
                </button>
              </div>
            </div>

            {/* Card 5: Empresas 100% IA */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between hover:border-[#6B29A3] transition-all shadow-sm hover:shadow-md">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
                  <span>05. Vanguardia Operativa</span>
                  <div className="p-1.5 bg-purple-50 rounded border border-purple-100 text-[#6B29A3]">
                    <Cpu className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {BUSINESS_VERTICALS.ia_zhc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.ia_zhc.description}
                </p>
                <ul className="text-xs text-slate-700 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.ia_zhc.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#6B29A3] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">ZHC & Agentes Autónomos</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#6B29A3] hover:underline font-bold"
                >
                  Simular Costos IA →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 4: Case Studies (Tone: Subtle Light Gray #F8FAFC) */}
      <section className="w-full bg-[#F8FAFC] border-b border-slate-200 py-16 lg:py-20 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="w-full space-y-8">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
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

            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
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

            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
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
      <section className="w-full bg-white border-b border-slate-200 py-16 lg:py-20 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="w-full">
          <PartnerProfile />
        </div>
      </section>

      {/* Block 6: Interactive Diagnostic (Tone: Soft Gray #F8FAFC) */}
      <section className="w-full bg-[#F8FAFC] py-16 lg:py-20 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="w-full">
          <InteractiveDiagnostic onLeadCreated={() => onSelectTab('crm')} />
        </div>
      </section>
    </div>
  );
};
