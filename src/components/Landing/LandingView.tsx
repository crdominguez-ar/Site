import React from 'react';
import { ArrowRight, ChevronRight, Building2, Globe, Scale, LineChart, Cpu, ShieldCheck } from 'lucide-react';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { PartnerProfile } from '../About/PartnerProfile';
import { InteractiveDiagnostic } from '../Diagnostic/InteractiveDiagnostic';
import { ExecutiveVideoSection } from '../Video/ExecutiveVideoSection';

interface LandingViewProps {
  onSelectTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo') => void;
  onOpenConsultationModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTab, onOpenConsultationModal }) => {
  return (
    <div className="w-full space-y-0 pb-0">
      {/* Block 1: Hero Section (Full-Width Obsidian Slate #020617) */}
      <section className="w-full bg-[#020617] border-b border-slate-800 py-10 sm:py-16 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto space-y-10">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 fluent-shadow-elevated">
            <div className="relative min-h-[540px] lg:min-h-[580px] flex flex-col justify-end p-6 sm:p-10 lg:p-14">
              {/* Background photography */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/src/assets/images/hero_patagonia_consultancy_1793059908678.jpg"
                  alt="Estudio Contable Domínguez & Lambrecht - Consultoría Estratégica en Patagonia"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00A4EF] uppercase tracking-wider">
                  <span>Trelew, Chubut</span>
                  <span aria-hidden="true">·</span>
                  <span>Patagonia Argentina</span>
                  <span aria-hidden="true">·</span>
                  <span>Cr. Carlos Rodrigo Domínguez</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] text-balance">
                  Consultoría de Negocios Estratégica & Dirección Financiera
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                  Superamos la gestoría administrativa tradicional. Desarrollamos arquitectura contable, fiscal y de dirección financiera moderna para PyMEs patagónicas, franquicias, exportadores de software y empresas 100% IA (Zero-Human Companies).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => onSelectTab('solutions')}
                    className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white font-bold text-xs sm:text-sm rounded-md transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Conocer Soluciones & Servicios</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTab('diagnostic')}
                    className="px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2"
                  >
                    <span>Diagnóstico de Empresa</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4-Column KPI strip in Microsoft Enterprise Dashboard Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800 bg-slate-950/90 divide-x divide-slate-800/80">
              <div className="p-5 sm:p-6">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums block">
                  18+
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Años de experiencia financiera y tributaria en Patagonia
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <span className="text-2xl sm:text-3xl font-black text-[#00A4EF] font-mono tabular-nums block">
                  5
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Ejes estratégicos de negocio
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums block">
                  100%
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Blindaje legal Ley CCyC 1512-1524 & AFIP
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <span className="text-2xl sm:text-3xl font-black text-[#107C41] font-mono tabular-nums block">
                  USD 45M+
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  En flujos de caja y modelos evaluados
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Executive YouTube Video Player (Tone: Corporate Deep Slate Navy #0F172A) */}
      <ExecutiveVideoSection />

      {/* Block 3: 5 Strategic Axes (Tone: Corporate Midnight #0B0F19) */}
      <section className="w-full bg-[#0B0F19] border-b border-slate-800 py-16 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#00A4EF] mb-1">
                <span>Soluciones Empresariales</span>
                <span>·</span>
                <span>Estudio Domínguez & Lambrecht</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Cinco Ejes de Consultoría Integral
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
                Metodologías analíticas adaptadas a la escala real de cada negocio. De la cooperativa regional a las arquitecturas autónomas de IA.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('solutions')}
              className="text-xs font-semibold text-[#00A4EF] hover:underline flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Ver desarrollo de servicios</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Tradicionales */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-[#0078D4]/60 transition-all fluent-shadow-card">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <span>01. Costeo Marginal</span>
                  <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[#00A4EF]">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {BUSINESS_VERTICALS.tradicional_pyme.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.tradicional_pyme.description}
                </p>
                <ul className="text-xs text-slate-300 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.tradicional_pyme.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0078D4] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">Punto de Equilibrio</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#00A4EF] hover:underline font-semibold"
                >
                  Abrir Calculador →
                </button>
              </div>
            </div>

            {/* Card 2: Digitales & Creadores */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-[#107C41]/60 transition-all fluent-shadow-card">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <span>02. Economía del Conocimiento</span>
                  <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[#107C41]">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {BUSINESS_VERTICALS.digital_saas.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.digital_saas.description}
                </p>
                <ul className="text-xs text-slate-300 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.digital_saas.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#107C41] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">Factura E & Divisas</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#107C41] hover:underline font-semibold"
                >
                  Simular Liquidación →
                </button>
              </div>
            </div>

            {/* Card 3: Franquicias */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-[#0078D4]/60 transition-all fluent-shadow-card">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <span>03. Ley CCyC 1512-1524</span>
                  <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[#0078D4]">
                    <Scale className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {BUSINESS_VERTICALS.franquicias.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.franquicias.description}
                </p>
                <ul className="text-xs text-slate-300 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.franquicias.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0078D4] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">Circular COF & Payback</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#0078D4] hover:underline font-semibold"
                >
                  Auditar Franquicia →
                </button>
              </div>
            </div>

            {/* Card 4: CFO a Tiempo Parcial (col-span-2) */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-[#0078D4]/60 transition-all fluent-shadow-card">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <span>04. Dirección Financiera Fraccional</span>
                  <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[#00A4EF]">
                    <LineChart className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {BUSINESS_VERTICALS.cfo_estrategico.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.cfo_estrategico.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-xs font-bold text-white block mb-1">Presupuestos a 12 Meses</span>
                    <span className="text-[11px] text-slate-400">Modelos dinámicos en pesos y dólares ajustados por inflación patagónica.</span>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-xs font-bold text-white block mb-1">Evaluación VAN / TIR</span>
                    <span className="text-[11px] text-slate-400">Análisis riguroso de proyectos de capital y tasa de corte WACC.</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Comités ejecutivos de dirección financiera</span>
                <button
                  type="button"
                  onClick={onOpenConsultationModal}
                  className="text-[#00A4EF] hover:underline font-bold"
                >
                  Solicitar Propuesta CFO →
                </button>
              </div>
            </div>

            {/* Card 5: Empresas 100% IA */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-[#6B29A3]/60 transition-all fluent-shadow-card">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <span>05. Vanguardia Operativa</span>
                  <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[#9B4F96]">
                    <Cpu className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {BUSINESS_VERTICALS.ia_zhc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {BUSINESS_VERTICALS.ia_zhc.description}
                </p>
                <ul className="text-xs text-slate-300 space-y-2 mb-6">
                  {BUSINESS_VERTICALS.ia_zhc.keyAspects.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#9B4F96] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">ZHC & Agentes Autónomos</span>
                <button
                  type="button"
                  onClick={() => onSelectTab('simulators')}
                  className="text-[#9B4F96] hover:underline font-semibold"
                >
                  Simular Costos IA →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 4: Case Studies (Tone: Dark Zinc Corporate #18181B) */}
      <section className="w-full bg-[#18181B] border-b border-slate-800 py-16 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#00A4EF]">
              Casos de Estudio & Métricas Cuantitativas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Impacto Comprobado en Empresas de la Patagonia
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Metodología financiera aplicada con rigor normativo y resultados auditados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="text-xs font-mono text-[#00A4EF]">Cooperativa Industrial · Trelew</span>
              <h4 className="text-sm font-bold text-white">
                Determinación de Costos Ocultos y Punto de Equilibrio
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Se estructuró una matriz de costeo marginal que reclasificó gastos fijos, incrementando el margen de contribución un 18.4% en 6 meses.
              </p>
              <div className="pt-3 border-t border-slate-900 text-xs font-mono text-[#107C41] font-semibold">
                +18.4% Margen Operativo Neto
              </div>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="text-xs font-mono text-[#107C41]">SaaS B2B Tech · Puerto Madryn</span>
              <h4 className="text-sm font-bold text-white">
                Liquidación de Factura E & Registro Economía del Conocimiento
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Encuadre fiscal con cupo legal en dólares, bono de crédito fiscal para cargas sociales y deducción de retenciones internacionales.
              </p>
              <div className="pt-3 border-t border-slate-900 text-xs font-mono text-[#107C41] font-semibold">
                USD 48,000 / año Ahorro Impositivo
              </div>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="text-xs font-mono text-[#0078D4]">Red Comercial · Valle de Chubut</span>
              <h4 className="text-sm font-bold text-white">
                Auditoría Precontractual de Franquicia (CCyC 1512-1524)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identificación de cláusulas abusivas de exclusividad y recálculo del Payback real de 12 a 19 meses, renegociando el canon inicial un 25%.
              </p>
              <div className="pt-3 border-t border-slate-900 text-xs font-mono text-[#00A4EF] font-semibold">
                25% Reducción en Canon Inicial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 5: Partner Profile (Tone: Deep Slate Navy #0F172A) */}
      <section className="w-full bg-[#0F172A] border-b border-slate-800 py-16 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto">
          <PartnerProfile />
        </div>
      </section>

      {/* Block 6: Interactive Diagnostic (Tone: Deep Midnight Slate #020617) */}
      <section className="w-full bg-[#020617] py-16 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto">
          <InteractiveDiagnostic onLeadCreated={() => onSelectTab('crm')} />
        </div>
      </section>
    </div>
  );
};
