import React, { useState } from 'react';
import { 
  OFFICIAL_SERVICES, 
  TARGET_ARCHETYPES, 
  COMMON_PITFALLS, 
  MACRO_METRICS_2026,
  CONCILIATED_METRICS,
  BUSINESS_VERTICALS
} from '../../data/verticals';
import { CoreServiceCode, BusinessVertical } from '../../types';
import { 
  Building2, Globe, Scale, LineChart, Cpu, 
  CheckCircle2, ArrowRight, ShieldCheck, FileText, ChevronRight, Layers,
  Calendar, Clock, DollarSign, Target, Sparkles, BookOpen, AlertCircle,
  HelpCircle, ArrowUpRight
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
  const [activeTab, setActiveTab] = useState<'servicios' | 'arquetipos'>('servicios');
  const [selectedServiceCode, setSelectedServiceCode] = useState<CoreServiceCode>('01');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('saas_software');

  const selectedService = OFFICIAL_SERVICES[selectedServiceCode];
  const selectedArchetype = TARGET_ARCHETYPES.find((a) => a.id === selectedArchetypeId) || TARGET_ARCHETYPES[0];

  return (
    <div className="w-full space-y-12 py-8 px-4 sm:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">
      {/* Executive Header */}
      <div className="bg-[#1B3636] text-white rounded-2xl p-6 sm:p-10 border border-[#2D5A5A] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal-300">
            <span>Propuesta de Servicios Profesionales</span>
            <span>·</span>
            <span>Cr. Carlos Rodrigo Domínguez</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Números confiables para decidir mejor
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
            Combino la mirada del <strong>contador</strong> —que el número sea correcto, legal y auditable— con la del <strong>administrador</strong> —que el número sirva para decidir y crecer. Servicios estructurados con alcance, plazos y entregables definidos.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onOpenDiagnostic}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#1B3636] text-xs font-black rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Empezar con un Diagnóstico</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onOpenSimulators}
              className="px-5 py-2.5 bg-black/30 hover:bg-black/50 text-white border border-white/20 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <LineChart className="w-3.5 h-3.5 text-teal-300" />
              <span>Simuladores Interactivos</span>
            </button>
          </div>
        </div>

        {/* Ambient Subtle Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Catálogo de Soluciones & Modelos de Intervención
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Elige la perspectiva de análisis: por servicio específico o según el tipo de empresa
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('servicios')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'servicios'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cinco Servicios Oficiales (01 a 05)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arquetipos')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'arquetipos'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            A Quién Acompaño (Arquetipos)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: CINCO SERVICIOS OFICIALES (01 A 05) */}
      {/* ========================================================================= */}
      {activeTab === 'servicios' && (
        <div className="space-y-8">
          {/* Service Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(Object.keys(OFFICIAL_SERVICES) as CoreServiceCode[]).map((code) => {
              const svc = OFFICIAL_SERVICES[code];
              const isSelected = selectedServiceCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedServiceCode(code)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1B3636] bg-[#1B3636] text-white shadow-md ring-2 ring-[#1B3636]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                      <span className={isSelected ? 'text-teal-300' : 'text-[#0078D4]'}>
                        Servicio {code}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isSelected ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {svc.modalityLabel}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2">
                      {svc.title}
                    </h3>
                  </div>
                  <p className={`text-[11px] mt-2 line-clamp-1 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {svc.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Service Deep Dive Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0078D4] uppercase">
                  <span>Código Oficial: {selectedService.code}</span>
                  <span>·</span>
                  <span className="text-slate-500">{selectedService.tagline}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedService.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>Para quién:</strong> {selectedService.targetAudience}
                </p>
              </div>

              {/* Service Meta Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 shrink-0 min-w-[260px] space-y-2.5">
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Modalidad:</span>
                  <span className="font-bold text-slate-800">{selectedService.modalityLabel}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Plazo / Frecuencia:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedService.durationOrCadence}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Honorarios de Referencia:</span>
                  <span className="font-mono font-black text-slate-900 text-base tabular-nums">
                    USD {selectedService.recommendedPriceUsd.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">A cotizar según diagnóstico inicial</span>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenConsultationModal}
                    className="w-full py-2 bg-[#1B3636] hover:bg-[#122525] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Cotizar este Servicio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Deliverables and Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entregable Concreto */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0078D4]" />
                  <span>Qué Recibe el Cliente (Entregable Verificable)</span>
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedService.deliverable}
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Base Normativa: {selectedService.normativeBase}</span>
                </div>
              </div>

              {/* Métricas que medimos juntos */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#107C41]" />
                  <span>Métricas Contables Conciliadas en este Servicio</span>
                </h4>
                <div className="space-y-2">
                  {selectedService.keyMetricsCovered.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-medium text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#107C41] shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Atención presencial en Trelew/Patagonia y remota en todo el país y el exterior.
              </div>
              <div className="flex items-center gap-2">
                {selectedServiceCode === '01' && (
                  <button
                    type="button"
                    onClick={onOpenSimulators}
                    className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LineChart className="w-3.5 h-3.5" />
                    <span>Abrir Simulador Unit Economics</span>
                  </button>
                )}
                {selectedServiceCode === '03' && (
                  <button
                    type="button"
                    onClick={onOpenSimulators}
                    className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Simular Factura E & Divisas BCRA</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenDiagnostic}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Iniciar Diagnóstico Previo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: ARQUETIPOS DE CLIENTES ACOMPAÑADOS (SLIDE 5)                     */}
      {/* ========================================================================= */}
      {activeTab === 'arquetipos' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {TARGET_ARCHETYPES.map((arch) => {
              const isSelected = selectedArchetypeId === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setSelectedArchetypeId(arch.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1B3636] bg-[#1B3636] text-white shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-black mb-1">
                      {arch.name}
                    </h3>
                    <p className={`text-[11px] leading-snug line-clamp-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {arch.tagline}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono mt-3 inline-block font-semibold ${
                    isSelected ? 'text-teal-300' : 'text-[#0078D4]'
                  }`}>
                    {arch.linkedServiceCodes.length} servicios aplicables
                  </span>
                </button>
              );
            })}
          </div>

          {/* Archetype Detail Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#0078D4] tracking-wider">
                Arquetipo de Empresa Acompañada
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedArchetype.name}
              </h3>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                {selectedArchetype.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Desafíos Típicos Resueltos:
                </h4>
                <div className="space-y-2">
                  {selectedArchetype.typicalNeeds.map((need, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Servicios Oficiales Directamente Aplicables:
                </h4>
                <div className="space-y-2.5">
                  {selectedArchetype.linkedServiceCodes.map((code) => {
                    const svc = OFFICIAL_SERVICES[code];
                    return (
                      <div key={code} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#0078D4]">Servicio {code}</span>
                          <h5 className="text-xs font-bold text-slate-900">{svc.title}</h5>
                          <span className="text-[11px] text-slate-500">{svc.modalityLabel}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedServiceCode(code);
                            setActiveTab('servicios');
                          }}
                          className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-md transition-colors"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 3: MARCO FISCAL Y NORMATIVO QUE REVISAMOS (SLIDE 9)               */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-1">
            <span>Blindaje Jurídico & Impositivo</span>
            <span>·</span>
            <span>Cr. Carlos Rodrigo Domínguez</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Marco Fiscal y Normativo que Revisamos
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            El encuadre se analiza caso por caso y se actualiza con la normativa vigente de ARCA (ex-AFIP), BCRA y la jurisdicción provincial (Convenio Multilateral).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
              <span>IVA y Ganancias</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ventas locales, exportación de servicios exenta con recupero de créditos fiscales de IVA, alícuotas societarias progresivas y deducciones admitidas.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Ingresos Brutos & Convenio</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jurisdicción local y aplicación del Convenio Multilateral cuando se prestan servicios o venden productos a clientes en varias provincias.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>Monotributo vs. RI vs. SAS</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Elección estratégica de la figura societaria según escala de facturación, perfil de clientes y conveniencia de recupero de crédito fiscal.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Factura E y Divisas (BCRA)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Emisión correcta del comprobante de exportación y cobro de divisas según la Comunicación BCRA &quot;A&quot; 8481 (14/09/2026) hasta el tope legal.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span>Economía del Conocimiento</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acceso y cumplimiento de beneficios fiscales bajo las Leyes 27.506 y 27.570 (bono fiscal para contribuciones patronales y descuento de Ganancias).
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Contratos y Consumidor</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Implementación obligatoria de botón de baja y botón de arrepentimiento, términos y condiciones, y protección de datos personales (Ley 25.326).
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 4: CÓMO TRABAJAMOS Y DOS FORMAS DE CONTRATAR (SLIDES 10 & 11)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Proceso en 4 Etapas (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0078D4] tracking-wider">
              Metodología Comprobada
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Cómo Trabajamos
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Trabajo presencial en Patagonia y remoto para Argentina y el exterior.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#1B3636] text-white text-xs font-bold font-mono flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-slate-900">1. Reunión Inicial</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Entendemos el negocio, los objetivos de los socios y la información contable y financiera disponible.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#1B3636] text-white text-xs font-bold font-mono flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-slate-900">2. Diagnóstico</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ordenamos datos contables y comerciales; medimos lo que importa con base en registros auditables.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#1B3636] text-white text-xs font-bold font-mono flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-slate-900">3. Propuesta y Modelo</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Construimos el modelo financiero, definimos el encuadre fiscal óptimo y entregamos un plan de acción priorizado.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#1B3636] text-white text-xs font-bold font-mono flex items-center justify-center">4</span>
              <h4 className="text-xs font-bold text-slate-900">4. Seguimiento</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Implementación continua, tablero mensual de control, comités financieros de socios y ajuste de decisiones.
              </p>
            </div>
          </div>
        </div>

        {/* Dos Formas de Contratar (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0078D4] tracking-wider">
              Esquemas de Contratación
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Dos Formas de Contratar
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Honorarios a cotizar según el diagnóstico inicial y el alcance acordado.
            </p>

            <div className="space-y-3.5 mt-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
                    <span>Por Proyecto</span>
                  </span>
                  <span className="text-[10px] text-[#0078D4] font-mono font-bold">Alcance Cerrado</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pt-1">
                  <li>• Alcance, plazo y entregables definidos desde el inicio.</li>
                  <li>• Ideal para diagnóstico, modelo financiero, estructuración o rondas.</li>
                  <li>• Propuesta cerrada luego de la reunión inicial.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#107C41]" />
                    <span>Abono Mensual</span>
                  </span>
                  <span className="text-[10px] text-[#107C41] font-mono font-bold">Acompañamiento Continuo</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pt-1">
                  <li>• Acompañamiento continuo como CFO fraccional.</li>
                  <li>• Reporte mensual, comité financiero de socios y cumplimiento fiscal.</li>
                  <li>• Se ajusta al tamaño y la etapa del negocio.</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenConsultationModal}
            className="w-full py-3 bg-[#1B3636] hover:bg-[#122525] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Solicitar Reunión Inicial de Diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
