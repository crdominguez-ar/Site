import React, { useState } from 'react';
import { BusinessVertical, Lead, ContactType, CompanyDepartment } from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { leadCaptureService } from '../../lib/leadCaptureService';
import { ArrowRight, CheckCircle2, Sparkles, Building2, Globe, Scale, LineChart, Cpu, Loader2, Users, Briefcase } from 'lucide-react';

interface InteractiveDiagnosticProps {
  onLeadCreated?: (lead: Lead) => void;
  initialVertical?: BusinessVertical;
}

export const InteractiveDiagnostic: React.FC<InteractiveDiagnosticProps> = ({
  onLeadCreated,
  initialVertical = 'cfo_estrategico',
}) => {
  const [step, setStep] = useState<number>(1);
  const [vertical, setVertical] = useState<BusinessVertical>(initialVertical);
  
  // Diagnostic answers
  const [annualTurnover, setAnnualTurnover] = useState<string>('50k_200k');
  const [mainChallenge, setMainChallenge] = useState<string>('costos_rentabilidad');
  const [entityType, setEntityType] = useState<string>('srl_sa');
  
  // Contact & Structure
  const [contactType, setContactType] = useState<ContactType>('empresa');
  const [companyName, setCompanyName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('Dirección General / Titular');
  const [department, setDepartment] = useState<CompanyDepartment>('direccion_gerencia');
  const [employeeRange, setEmployeeRange] = useState<string>('6-20');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('Trelew, Chubut');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  const verticalConfig = BUSINESS_VERTICALS[vertical];

  const handleNext = () => {
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email) return;

    setIsSubmitting(true);

    try {
      // Calculate lead score based on profile
      let calculatedScore = 75;
      if (annualTurnover === 'more_500k') calculatedScore += 15;
      if (vertical === 'ia_zhc' || vertical === 'cfo_estrategico') calculatedScore += 10;
      if (employeeRange === '21-50' || employeeRange === '50+') calculatedScore += 5;

      const estimatedBudget = annualTurnover === 'more_500k' ? 2500 : 1200;

      const result = await leadCaptureService.captureOpportunityFromForm({
        source: 'Diagnóstico Estratégico',
        opportunityTitle: `Diagnóstico: ${companyName} (${verticalConfig.shortTitle})`,
        companyName,
        contactName,
        email,
        phone: phone || '+54 280 400-0000',
        whatsappNumber: phone,
        roleTitle,
        contactType,
        department,
        location: location || 'Trelew, Chubut',
        vertical,
        priority: calculatedScore > 85 ? 'alta' : 'media',
        score: Math.min(100, calculatedScore),
        estimatedMonthlyBudgetUsd: estimatedBudget,
        revenueRange: annualTurnover === 'more_500k' ? '> USD 200k/año' : annualTurnover === '50k_200k' ? 'USD 50k - 200k/año' : '< USD 50k/año',
        employeeRange,
        identifiedProblem: `Desafío: ${mainChallenge} | Personería: ${entityType}`,
        notes: `Diagnóstico interactivo completado. Vertical: ${verticalConfig.title}. Tipo: ${contactType}. Área: ${department}. Rango personal: ${employeeRange}.`,
        technicalDetails: {
          annualTurnover,
          mainChallenge,
          entityType,
          employeeRange,
          department,
          contactType,
        },
      });

      setSubmittedLead(result.lead);
      setStep(4);
      if (onLeadCreated) {
        onLeadCreated(result.lead);
      }
    } catch (err) {
      console.error('Error al guardar lead de diagnóstico:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verticalIcons: Record<BusinessVertical, React.ReactNode> = {
    tradicional_pyme: <Building2 className="w-5 h-5 text-[#0078D4]" />,
    digital_saas: <Globe className="w-5 h-5 text-[#107C41]" />,
    franquicias: <Scale className="w-5 h-5 text-[#0078D4]" />,
    cfo_estrategico: <LineChart className="w-5 h-5 text-[#0078D4]" />,
    ia_zhc: <Cpu className="w-5 h-5 text-[#8764B8]" />,
  };

  return (
    <div id="diagnostico" className="w-full space-y-6">
      {/* Header bar with step indicator */}
      <div className="py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#0078D4] font-semibold block font-mono">
            Diagnóstico Financiero & Estratégico Interactivo
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Evaluación Personalizada para tu Negocio
          </h2>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#0078D4]'
                  : s < step
                  ? 'w-4 bg-slate-400'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="py-2">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Paso 1: Selecciona la vertical que mejor describe tu actividad
              </h3>
              <p className="text-sm text-slate-600">
                Cada modelo de negocio en Cr Dominguez cuenta con una metodología financiera específica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => {
                const item = BUSINESS_VERTICALS[vKey];
                const isSelected = vertical === vKey;

                return (
                  <button
                    key={vKey}
                    type="button"
                    onClick={() => setVertical(vKey)}
                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#0078D4] ring-1 ring-[#0078D4] shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className={`p-2.5 rounded-lg inline-flex mb-3 ${
                        isSelected ? 'bg-blue-100 text-[#0078D4]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {verticalIcons[vKey]}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono">{item.shortTitle}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0078D4]" />
                      ) : (
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                Continuar al Paso 2
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#0078D4] font-semibold uppercase mb-1">
                <span>{verticalConfig.title}</span>
                <span>·</span>
                <span>Configuración de Parámetros</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Paso 2: Diagnóstico específico de tu operación
              </h3>
              <p className="text-sm text-slate-600">
                Responde 3 preguntas clave para evaluar tu estructura de rentabilidad y contingencias.
              </p>
            </div>

            <div className="space-y-6">
              {/* Question 1 */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  1. Rango de facturación o volumen operativo actual
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'under_50k', label: 'Hasta USD 50,000 / año', sub: 'Etapa inicial / Validación' },
                    { id: '50k_200k', label: 'USD 50,000 a USD 200,000 / año', sub: 'Tracción / Crecimiento' },
                    { id: 'more_500k', label: 'Más de USD 200,000 / año', sub: 'Consolidado / Expansión' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnnualTurnover(opt.id)}
                      className={`p-3.5 rounded-lg border text-left transition-colors ${
                        annualTurnover === opt.id
                          ? 'bg-blue-50/80 border-[#0078D4] text-[#0078D4] ring-1 ring-[#0078D4]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  2. ¿Cuál es el principal cuello de botella económico o legal que enfrentas?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'costos_rentabilidad', label: 'Falta de visibilidad en costos y punto de equilibrio real' },
                    { id: 'divisas_mulc', label: 'Cierre de liquidación de divisas e impuestos por exportación' },
                    { id: 'contrato_franquicia', label: 'Evaluación o confección de Circular de Franquicia (CCyC)' },
                    { id: 'cfo_flujos', label: 'Ausencia de presupuestos dinámicos a 12 meses y modelos de retorno' },
                    { id: 'zhc_cripto', label: 'Encuadre normativo de agentes IA, tokens y tesorería digital' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMainChallenge(opt.id)}
                      className={`p-3.5 rounded-lg border text-left transition-colors ${
                        mainChallenge === opt.id
                          ? 'bg-blue-50/80 border-[#0078D4] text-[#0078D4] ring-1 ring-[#0078D4]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <span className="text-xs font-medium block">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  3. Tipo de personería o vehículo societario actual
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'srl_sa', label: 'SRL o S.A.' },
                    { id: 'sas', label: 'S.A.S.' },
                    { id: 'coop_asoc', label: 'Cooperativa / Mutual' },
                    { id: 'unipersonal_exterior', label: 'Unipersonal / LLC / On-Chain' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEntityType(opt.id)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        entityType === opt.id
                          ? 'bg-blue-50/80 border-[#0078D4] text-[#0078D4] ring-1 ring-[#0078D4]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                Continuar a Datos de Contacto
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Paso 3: Datos de tu Empresa para el Dictamen Preliminar
              </h3>
              <p className="text-sm text-slate-600">
                Los informes son analizados personalmente por el equipo del Cr. Carlos Rodrigo Domínguez.
              </p>
            </div>

            {/* Contact Type Toggle */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Estructura de la Organización / Tipo de Contacto
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setContactType('empresa');
                    setRoleTitle('Dirección General / Titular');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold border transition-all ${
                    contactType === 'empresa'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Empresa / Corporativo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContactType('individual');
                    setRoleTitle('Profesional Independiente / Socio');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold border transition-all ${
                    contactType === 'individual'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Profesional / Individual
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  {contactType === 'empresa' ? 'Razón Social / Nombre Comercial *' : 'Nombre del Proyecto / Actividad *'}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={contactType === 'empresa' ? 'ej. Frío Sur Logística SRL' : 'ej. Estudio Jurídico / Consultora'}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Nombre del Titular o Contacto Decisor *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="ej. Martín Rossi"
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Cargo / Rol del Decisor
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="ej. Socio Gerente / Director Financiero"
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Área / Departamento Atendido
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as CompanyDepartment)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                >
                  <option value="direccion_gerencia">Dirección General / Directorio</option>
                  <option value="administracion_finanzas">Administración & Finanzas</option>
                  <option value="compras_pagos">Compras & Cuentas por Pagar</option>
                  <option value="logistica_operaciones">Logística & Operaciones</option>
                  <option value="recursos_humanos">Recursos Humanos & Nóminas</option>
                  <option value="legales_cumplimiento">Legales & Cumplimiento</option>
                  <option value="comercial_ventas">Comercial & Ventas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Correo Electrónico Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="direccion@empresa.com"
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Teléfono / WhatsApp Directo
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 280 4..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Nómina / Dotación de Empleados
                </label>
                <select
                  value={employeeRange}
                  onChange={(e) => setEmployeeRange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                >
                  <option value="1-5">1 a 5 colaboradores (Microempresa)</option>
                  <option value="6-20">6 a 20 colaboradores (Pequeña)</option>
                  <option value="21-50">21 a 50 colaboradores (Mediana tramo 1)</option>
                  <option value="50+">Más de 50 colaboradores (Mediana tramo 2 / Corporación)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Ubicación / Radicación Principal
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:border-[#0078D4] focus:outline-none"
                >
                  <option value="Trelew, Chubut">Trelew, Chubut</option>
                  <option value="Puerto Madryn, Chubut">Puerto Madryn, Chubut</option>
                  <option value="Rawson, Chubut">Rawson, Chubut</option>
                  <option value="Gaiman, Chubut">Gaiman, Chubut</option>
                  <option value="Comodoro Rivadavia, Chubut">Comodoro Rivadavia, Chubut</option>
                  <option value="Rada Tilly, Chubut">Rada Tilly, Chubut</option>
                  <option value="Esquel, Chubut">Esquel, Chubut</option>
                  <option value="Buenos Aires / CABA">Buenos Aires / CABA</option>
                  <option value="Resto de Argentina / Remoto">Resto de Argentina / Remoto</option>
                  <option value="Internacional / ZHC">Internacional / Exterior</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando Dictamen...
                  </>
                ) : (
                  <>
                    Generar Diagnóstico Estratégico
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 4 && submittedLead && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-full text-[#107C41]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Diagnóstico Inicial Generado con Éxito
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ingresado en el CRM Ejecutivo de Cr Dominguez
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">Score de Calificación</span>
                  <span className="text-2xl font-extrabold text-[#0078D4] font-mono">
                    {submittedLead.score}/100
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Prioridad: {submittedLead.priority.toUpperCase()}</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">Vertical Asignada</span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {BUSINESS_VERTICALS[submittedLead.vertical].shortTitle}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Marco: {BUSINESS_VERTICALS[submittedLead.vertical].normativeBase.slice(0, 30)}...</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">Presupuesto Sugerido</span>
                  <span className="text-2xl font-extrabold text-[#107C41] font-mono">
                    USD {submittedLead.estimatedMonthlyBudgetUsd} <span className="text-xs font-normal text-slate-500">/ mes</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Modalidad Fraccional</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-2">
                <span className="font-semibold text-slate-900 block">Entregables recomendados para {submittedLead.companyName}:</span>
                <ul className="space-y-1 list-disc list-inside text-slate-600">
                  {BUSINESS_VERTICALS[submittedLead.vertical].deliverables.map((deliv, i) => (
                    <li key={i}>{deliv}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-500">
                El Cr. Carlos Rodrigo Domínguez o un consultor senior revisará tu ficha antes de las próximas 24 horas hábiles.
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCompanyName('');
                  setContactName('');
                }}
                className="text-xs text-[#0078D4] hover:underline font-semibold transition-colors"
              >
                Realizar otro diagnóstico
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
