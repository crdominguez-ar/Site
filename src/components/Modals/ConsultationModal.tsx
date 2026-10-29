import React, { useState } from 'react';
import { leadCaptureService } from '../../lib/leadCaptureService';
import { BusinessVertical, Lead, ContactType, CompanyDepartment, CRMContact } from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { X, Send, CheckCircle2, Loader2, Building2, User, Sparkles } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (lead: Lead) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [contactType, setContactType] = useState<ContactType>('empresa');
  const [company, setCompany] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [department, setDepartment] = useState<CompanyDepartment>('direccion_gerencia');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('Trelew, Chubut');
  const [revenueRange, setRevenueRange] = useState<string>('$50M - $200M ARS');
  const [employeeRange, setEmployeeRange] = useState<string>('1 a 10 empleados');
  const [vertical, setVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{ lead: Lead; contact: CRMContact } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !contact || !email) return;

    setIsSubmitting(true);
    try {
      const result = await leadCaptureService.captureOpportunityFromForm({
        source: 'Formulario de Asesoría',
        opportunityTitle: `Solicitud Asesoría: ${company} (${BUSINESS_VERTICALS[vertical].shortTitle})`,
        companyName: company,
        contactName: contact,
        roleTitle: roleTitle || (contactType === 'empresa' ? 'Dirección General / Titular' : 'Profesional Independiente'),
        contactType,
        department,
        email,
        phone,
        location,
        vertical,
        priority: 'alta',
        revenueRange,
        employeeRange,
        identifiedProblem: message || 'Evaluación inicial solicitada desde la web',
        notes: `Solicitud de asesoría directa: ${message || 'Sin mensaje adicional'}`,
        score: 90,
      });

      setSubmittedResult(result);
      if (onSuccess) onSuccess(result.lead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedResult(null);
    setCompany('');
    setContact('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#0078D4] font-mono font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cr Dominguez · Consultoría Estratégica</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Solicitud de Asesoría & Diagnóstico Inicial
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Completa tus datos para coordinar una primera evaluación técnica y agendar la oportunidad en nuestro CRM.
              </p>
            </div>

            {/* Type selector: Empresa vs Individual */}
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
                <span>Contacto Individual</span>
              </button>
            </div>

            {/* Company & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {contactType === 'empresa' ? 'Empresa / Razón Social *' : 'Nombre de Fantasía o Proyecto *'}
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={contactType === 'empresa' ? 'ej. AgroPesca Chubut SA' : 'ej. Estudio Profesional Sur'}
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
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="ej. Carlos San Martín"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Role & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cargo o Rol
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder={contactType === 'empresa' ? 'ej. Socio Gerente / Director' : 'ej. Titular'}
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
                >
                  <option value="direccion_gerencia">Dirección General / Presidencia</option>
                  <option value="finanzas_pagos">Finanzas, Tesorería & Pagos</option>
                  <option value="administracion">Administración & Contabilidad</option>
                  <option value="logistica_envios">Logística & Envíos</option>
                  <option value="comercial_ventas">Comercial & Ventas</option>
                  <option value="legales_compliance">Legales & Compliance</option>
                  <option value="tecnologia_sistemas">Tecnología & Sistemas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. gerencia@empresa.com.ar"
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

            {/* City Location, Turnover, Employees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Ciudad / Sede
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
                  Facturación Estimada
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
                  Dotación de Personal
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

            {/* Vertical de Negocio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Eje de Solución Principal Requerido
              </label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value as BusinessVertical)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:bg-white focus:outline-none"
              >
                {Object.values(BUSINESS_VERTICALS).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Consulta o Necesidad Inicial
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe brevemente la situación de la empresa, contingencia impositiva, franquicia a auditar o necesidad de CFO."
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
                    <span>Conectando con CRM...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitud de Asesoría</span>
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
                Conexión Exitosa con CRM Cr Dominguez
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                ¡Solicitud Registrada en Pipeline!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Hemos registrado el contacto de <strong>{submittedResult.contact.companyName}</strong> y creado una nueva oportunidad de consultoría calificada. El Cr. Carlos Domínguez se pondrá en contacto a la brevedad.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Oportunidad:</span>
                <strong className="text-slate-900">{submittedResult.lead.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID Contacto:</span>
                <strong className="text-slate-900">{submittedResult.contact.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sede Registrada:</span>
                <span className="text-slate-800">{submittedResult.contact.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prioridad:</span>
                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded font-bold uppercase text-[10px]">Alta</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer"
              >
                Cerrar y Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
