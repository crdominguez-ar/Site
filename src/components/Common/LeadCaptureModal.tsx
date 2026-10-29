import React, { useState } from 'react';
import { leadCaptureService, CaptureOpportunityParams } from '../../lib/leadCaptureService';
import { BusinessVertical, ContactType, CompanyDepartment, Lead, CRMContact } from '../../types';
import { X, Send, CheckCircle2, Loader2, Sparkles, Building2, User, MapPin, DollarSign, Users } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: CaptureOpportunityParams['source'];
  vertical: BusinessVertical;
  defaultOpportunityTitle: string;
  identifiedProblemDefault?: string;
  calculatedMetrics?: Record<string, any>;
  dealValue?: number;
  onSuccess?: (result: { lead: Lead; contact: CRMContact }) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  source,
  vertical,
  defaultOpportunityTitle,
  identifiedProblemDefault,
  calculatedMetrics,
  dealValue,
  onSuccess,
}) => {
  const [contactType, setContactType] = useState<ContactType>('empresa');
  const [companyName, setCompanyName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [department, setDepartment] = useState<CompanyDepartment>('direccion_gerencia');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('Trelew, Chubut');
  const [revenueRange, setRevenueRange] = useState<string>('$50M - $200M ARS');
  const [employeeRange, setEmployeeRange] = useState<string>('1 a 10 empleados');
  const [identifiedProblem, setIdentifiedProblem] = useState<string>(identifiedProblemDefault || '');
  const [notes, setNotes] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultData, setResultData] = useState<{ lead: Lead; contact: CRMContact } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email) return;

    setIsSubmitting(true);
    try {
      const result = await leadCaptureService.captureOpportunityFromForm({
        source,
        opportunityTitle: defaultOpportunityTitle,
        companyName,
        contactName,
        email,
        phone,
        roleTitle: roleTitle || (contactType === 'empresa' ? 'Dirección General / Titular' : 'Profesional Independiente'),
        contactType,
        department,
        location,
        vertical,
        priority: 'alta',
        dealValue,
        estimatedMonthlyBudgetUsd: dealValue,
        revenueRange,
        employeeRange,
        identifiedProblem: identifiedProblem || identifiedProblemDefault || 'Solicitud de dictamen preliminar',
        notes: notes || `Generado desde ${source}.`,
        technicalDetails: calculatedMetrics,
      });

      setResultData(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error('Error al capturar oportunidad:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setResultData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!resultData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{source} · Registro en CRM</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Guardar Simulación & Solicitar Dictamen Pericial
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Los datos de tu cálculo se guardarán vinculados a tu empresa y se agendarán en el pipeline de oportunidades del Cr. Carlos Domínguez.
              </p>
            </div>

            {/* Metrics preview banner */}
            {calculatedMetrics && Object.keys(calculatedMetrics).length > 0 && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-xs">
                <span className="font-mono text-[10px] font-bold text-[#0078D4] uppercase block">
                  Métricas Cuantitativas del Cálculo:
                </span>
                <div className="flex flex-wrap gap-2 text-slate-800 font-semibold font-mono text-[11px]">
                  {Object.entries(calculatedMetrics).slice(0, 4).map(([key, val]) => (
                    <span key={key} className="px-2 py-0.5 bg-white rounded border border-blue-200">
                      {key}: <strong className="text-slate-900">{String(val)}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selector: Empresa vs Individual */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setContactType('empresa')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  contactType === 'empresa'
                    ? 'bg-white text-[#0078D4] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Contacto Empresa</span>
              </button>
              <button
                type="button"
                onClick={() => setContactType('individual')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  contactType === 'individual'
                    ? 'bg-white text-[#0078D4] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profesional / Individual</span>
              </button>
            </div>

            {/* Company & Contact Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {contactType === 'empresa' ? 'Razón Social / Empresa *' : 'Nombre del Proyecto / Estudio *'}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={contactType === 'empresa' ? 'ej. Lana Patagónica SRL' : 'ej. Estudio Roberts'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Persona de Contacto / Titular *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="ej. Carlos San Martín"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Role & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cargo o Posición
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder={contactType === 'empresa' ? 'ej. Director / Gerente de Finanzas' : 'ej. Abogado / Consultor'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Área o Departamento
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as CompanyDepartment)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                >
                  <option value="direccion_gerencia">Dirección General / Presidencia</option>
                  <option value="finanzas_pagos">Finanzas, Tesorería & Pagos</option>
                  <option value="administracion">Administración & Contabilidad</option>
                  <option value="logistica_envios">Logística & Envíos</option>
                  <option value="comercial_ventas">Comercial & Expansión</option>
                  <option value="legales_compliance">Legales & Compliance</option>
                  <option value="operaciones_planta">Operaciones & Planta</option>
                  <option value="tecnologia_sistemas">Tecnología & Sistemas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Email & Phone / WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@empresa.com.ar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ej. +54 9 280 445-3390"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* City Location, Turnover, Employees (Crucial for filtering) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Sede / Ciudad
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                >
                  <option value="Trelew, Chubut">Trelew, Chubut</option>
                  <option value="Puerto Madryn, Chubut">Puerto Madryn, Chubut</option>
                  <option value="Rawson, Chubut">Rawson, Chubut</option>
                  <option value="Gaiman / VIRCh">Gaiman / VIRCh</option>
                  <option value="Comodoro Rivadavia">Comodoro Rivadavia</option>
                  <option value="Esquel / Cordillera">Esquel / Cordillera</option>
                  <option value="Neuquén / Río Negro">Neuquén / Río Negro</option>
                  <option value="Buenos Aires / CABA">Buenos Aires / CABA</option>
                  <option value="Remoto / Internacional">Remoto / Internacional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Facturación Anual
                </label>
                <select
                  value={revenueRange}
                  onChange={(e) => setRevenueRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                >
                  <option value="Hasta $30M ARS">Hasta $30M ARS</option>
                  <option value="$30M - $100M ARS">$30M - $100M ARS</option>
                  <option value="$100M - $300M ARS">$100M - $300M ARS</option>
                  <option value="$300M+ ARS">$300M+ ARS</option>
                  <option value="USD 50k - 200k/año">USD 50k - 200k/año</option>
                  <option value="USD 200k+/año">USD 200k+/año</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Equipo / Dotación
                </label>
                <select
                  value={employeeRange}
                  onChange={(e) => setEmployeeRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                >
                  <option value="1 a 5 personas">1 a 5 personas</option>
                  <option value="6 a 20 personas">6 a 20 personas</option>
                  <option value="21 a 50 personas">21 a 50 personas</option>
                  <option value="50+ personas">50+ personas</option>
                </select>
              </div>
            </div>

            {/* Notes / Special requirement */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Consulta o Desafío Específico
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indica cualquier particularidad (ej: próxima firma de contrato de franquicia, revisión de pasivos bancarios, liquidación Factura E, etc.)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando en CRM...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Guardar Oportunidad & Solicitar Dictamen</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0078D4]">
                Registro Exitoso en CRM & Pipeline
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                ¡Oportunidad & Contacto Creados!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Se registró el contacto de <strong>{resultData.contact.companyName}</strong> en la agenda y se creó una nueva oportunidad en el Pipeline de Dirección del Cr. Carlos Domínguez.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Oportunidad:</span>
                <strong className="text-slate-900">{resultData.lead.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID Contacto:</span>
                <strong className="text-slate-900">{resultData.contact.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Etapa:</span>
                <span className="px-1.5 py-0.2 bg-blue-100 text-[#0078D4] rounded font-bold">Nuevo Lead</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Origen:</span>
                <span className="text-slate-800">{resultData.lead.source}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer"
              >
                Entendido, Continuar Navegando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
