import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Building2, Globe, Scale, LineChart, Cpu, Shield, Award, ChevronRight } from 'lucide-react';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { BusinessVertical } from '../../types';
import { PartnerProfile } from '../About/PartnerProfile';
import { InteractiveDiagnostic } from '../Diagnostic/InteractiveDiagnostic';

interface LandingViewProps {
  onSelectTab: (tab: 'landing' | 'simulators' | 'diagnostic' | 'portal' | 'crm') => void;
  onOpenConsultationModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTab, onOpenConsultationModal }) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
        <div className="relative min-h-[580px] lg:min-h-[620px] flex flex-col justify-end p-6 sm:p-10 lg:p-14">
          {/* Background Hero Photography with measured scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/hero_patagonia_consultancy_1793059908678.jpg"
              alt="Estudio Contable Domínguez & Lambrecht - Consultoría Estratégica en Patagonia"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-60"
            />
            {/* Scrim ensuring 4.5:1 WCAG contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
              <span>Trelew, Chubut</span>
              <span aria-hidden="true">·</span>
              <span>Patagonia Argentina</span>
              <span aria-hidden="true">·</span>
              <span>Cr. Carlos Rodrigo Domínguez</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] text-balance">
              Consultoría de Negocios Estratégica & Dirección Financiera de Vanguardia
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Superamos la gestoría administrativa tradicional. Proveemos arquitectura financiera moderna para PyMEs patagónicas, franquicias comerciales, exportadores de software y organizaciones 100% IA (Zero-Human Companies).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => onSelectTab('diagnostic')}
                className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xl shadow-cyan-950/50 flex items-center gap-2"
              >
                <span>Iniciar Diagnóstico Estratégico</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('simulators')}
                className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <span>Simuladores Financieros</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column KPI strip placed in a full-width row below hero content */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800/80 bg-slate-900/90 divide-x divide-slate-800/80">
          <div className="p-5 sm:p-6">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums block">
              18+
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Años de experiencia financiera y tributaria en Patagonia
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tabular-nums block">
              5
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Ejes estratégicos (Tradicional, SaaS, Franquicias, CFO, IA)
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums block">
              100%
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Alineación jurídica Ley CCyC 1512-1524 & Normativa AFIP
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums block">
              USD 45M+
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              En presupuestos y modelos de flujo asesorados
            </span>
          </div>
        </div>
      </section>

      {/* 5 Core Strategic Axes Bento Grid */}
      <section id="areas-estrategicas" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Metodología & Especialización
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Cinco Ejes de Consultoría Integral
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Cada unidad de negocio requiere un tratamiento contable y tributario específico. De la fábrica local a los agentes autónomos de software.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('simulators')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Ver herramientas de cálculo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Tradicionales (col-span-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                <span>01. Costeo Marginal</span>
                <Building2 className="w-4 h-4 text-cyan-400" />
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
                    <span className="text-cyan-400 font-bold">·</span>
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
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Abrir Calculador →
              </button>
            </div>
          </div>

          {/* Card 2: Digitales & Creadores (col-span-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                <span>02. Economía del Conocimiento</span>
                <Globe className="w-4 h-4 text-emerald-400" />
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
                    <span className="text-emerald-400 font-bold">·</span>
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
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Simular Liquidación →
              </button>
            </div>
          </div>

          {/* Card 3: Franquicias (col-span-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                <span>03. Ley CCyC 1512-1524</span>
                <Scale className="w-4 h-4 text-blue-400" />
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
                    <span className="text-blue-400 font-bold">·</span>
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
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Auditar Franquicia →
              </button>
            </div>
          </div>

          {/* Card 4: CFO a Tiempo Parcial (col-span-2) */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                <span>04. Dirección Financiera Fraccional</span>
                <LineChart className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {BUSINESS_VERTICALS.cfo_estrategico.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {BUSINESS_VERTICALS.cfo_estrategico.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <span className="text-xs font-bold text-white block mb-1">Presupuestos a 12 Meses</span>
                  <span className="text-[11px] text-slate-400">Modelos dinámicos en pesos y dólares ajustados por inflación regional.</span>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <span className="text-xs font-bold text-white block mb-1">Evaluación VAN / TIR</span>
                  <span className="text-[11px] text-slate-400">Análisis riguroso de proyectos de capital y cálculo de tasa de corte WACC.</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Comités mensuales de dirección financiera</span>
              <button
                type="button"
                onClick={onOpenConsultationModal}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Solicitar Propuesta CFO →
              </button>
            </div>
          </div>

          {/* Card 5: Empresas 100% IA (col-span-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                <span>05. Vanguardia Operativa</span>
                <Cpu className="w-4 h-4 text-indigo-400" />
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
                    <span className="text-indigo-400 font-bold">·</span>
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
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Simular Costos IA →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Proof of Impact (adjacent to capabilities) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            Casos de Estudio & Resultados Cuantitativos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Impacto Comprobado en Empresas de la Región
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Metodología aplicada con precisión financiera y respaldo normativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-mono text-cyan-400">Cooperativa Industrial · Trelew</span>
            <h4 className="text-sm font-bold text-white">
              Determinación de Costos Ocultos de Faena y Punto de Equilibrio
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Se estructuró una matriz de costeo marginal que reclasificó el 35% de los gastos fijos como directos, elevando el margen de contribución un 18.4% en 6 meses.
            </p>
            <div className="pt-3 border-t border-slate-900 text-xs font-mono text-emerald-400 font-semibold">
              +18.4% Margen Operativo Neto
            </div>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-mono text-emerald-400">SaaS B2B Tech · Puerto Madryn</span>
            <h4 className="text-sm font-bold text-white">
              Liquidación de Factura E & Registro en Economía del Conocimiento
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encuadre fiscal con cupo legal de libre disponibilidad en dólares, bonos de crédito fiscal para cargas sociales y deducción de retenciones de pasarelas del exterior.
            </p>
            <div className="pt-3 border-t border-slate-900 text-xs font-mono text-emerald-400 font-semibold">
              USD 48,000 / año Ahorro Impositivo
            </div>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-mono text-blue-400">Red Comercial · Valle de Chubut</span>
            <h4 className="text-sm font-bold text-white">
              Auditoría Precontractual de Franquicia (CCyC art. 1512-1524)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identificación previa de cláusulas abusivas de exclusividad y recálculo del Payback real de 12 a 19 meses, renegociando el canon inicial un 25% a favor del inversor.
            </p>
            <div className="pt-3 border-t border-slate-900 text-xs font-mono text-cyan-400 font-semibold">
              25% Reducción en Canon Inicial
            </div>
          </div>
        </div>
      </section>

      {/* Partner Profile Component */}
      <PartnerProfile />

      {/* Diagnostic Quick Tool */}
      <InteractiveDiagnostic onLeadCreated={() => onSelectTab('crm')} />
    </div>
  );
};
