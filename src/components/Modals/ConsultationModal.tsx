import React, { useState } from 'react';
import { dbRepository } from '../../lib/supabaseClient';
import { BusinessVertical, Lead } from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { X, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (lead: Lead) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [company, setCompany] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [vertical, setVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !contact || !email) return;

    setIsSubmitting(true);
    try {
      const created = await dbRepository.createLead({
        companyName: company,
        contactName: contact,
        email,
        phone: phone || '+54 280 400-0000',
        location: 'Trelew, Chubut',
        vertical,
        stage: 'nuevo',
        priority: 'alta',
        estimatedMonthlyBudgetUsd: 1800,
        notes: `Solicitud de asesoría directa: ${message || 'Sin mensaje adicional'}`,
        score: 90,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setCompany('');
    setContact('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#0078D4] font-mono font-semibold">
                Estudio Contable Domínguez & Lambrecht
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Solicitud de Asesoría Estratégica
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Coordina una primera sesión de evaluación técnica con el Cr. Carlos Rodrigo Domínguez.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Empresa o Proyecto *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ej. AgroPesca Chubut SA"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre del Socio / Titular *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="ej. Rodrigo Álvarez"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="direccion@empresa.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 280 4..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Área de Interés
                  </label>
                  <select
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value as BusinessVertical)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  >
                    {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => (
                      <option key={vKey} value={vKey}>
                        {BUSINESS_VERTICALS[vKey].shortTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Breve descripción de la necesidad
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detalles sobre costos, contratos de franquicia, Factura E o CFO..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-[#107C41] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Solicitud Registrada con Éxito
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Hemos registrado la ficha para <strong className="text-slate-900">{company}</strong>. El Cr. Carlos Rodrigo Domínguez se comunicará contigo al teléfono o email provisto para coordinar la sesión.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
