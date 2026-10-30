import React, { useState, useEffect } from 'react';
import { 
  CRMProposal, 
  ProposalLineItem, 
  AccountingServiceItem, 
  Lead, 
  CRMContact, 
  CompanyEmployee,
  BusinessVertical 
} from '../../types';
import { proposalService, ACCOUNTING_SERVICES_CATALOG } from '../../lib/proposalService';
import { 
  X, Plus, Trash2, Send, MessageSquare, Printer, CheckCircle2, 
  Sparkles, FileText, Clock, DollarSign, RefreshCw, AlertCircle, 
  ArrowRight, Shield, Building2, User, Mail, Phone, Calendar,
  ChevronDown, ExternalLink, Edit3, Award, Layers
} from 'lucide-react';

interface ProposalBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId?: string | null;
  initialLead?: Lead | null;
  initialContact?: CRMContact | null;
  onProposalSaved?: (proposal: CRMProposal) => void;
  onClientActivated?: (proposal: CRMProposal) => void;
}

export const ProposalBuilderModal: React.FC<ProposalBuilderModalProps> = ({
  isOpen,
  onClose,
  proposalId,
  initialLead,
  initialContact,
  onProposalSaved,
  onClientActivated,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Proposal State
  const [currentProposal, setCurrentProposal] = useState<CRMProposal | null>(null);

  // Form Fields
  const [recipientName, setRecipientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [cuit, setCuit] = useState('');
  const [title, setTitle] = useState('');
  const [vertical, setVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [validityDays, setValidityDays] = useState<number>(30);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(21);
  const [paymentTerms, setPaymentTerms] = useState(
    '50% de anticipo al inicio de las tareas profesionales, y el saldo restante contra entrega del informe ejecutivo / dictamen final.'
  );
  const [scopeSummary, setScopeSummary] = useState(
    'Servicios profesionales de consultoría estratégica, análisis tributario y dirección financiera ejecutiva.'
  );
  const [specialTerms, setSpecialTerms] = useState(
    'Incluye acceso a la Bóveda Documental privada en crdominguez.ar/portal y canal preferencial de soporte vía WhatsApp.'
  );

  // Line Items
  const [items, setItems] = useState<ProposalLineItem[]>([]);
  const [selectedCatalogServiceId, setSelectedCatalogServiceId] = useState<string>('');

  // Selected Employee if company contact
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // Modals inside
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCustomNote, setEmailCustomNote] = useState('');
  const [showReformulateModal, setShowReformulateModal] = useState(false);
  const [reformulateNotes, setReformulateNotes] = useState('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  // Load existing or initialize
  useEffect(() => {
    if (!isOpen) return;

    setActionStatus(null);

    const init = async () => {
      setLoading(true);
      if (proposalId) {
        const prop = await proposalService.getProposalById(proposalId);
        if (prop) {
          setCurrentProposal(prop);
          setRecipientName(prop.recipientName);
          setCompanyName(prop.companyName);
          setRecipientEmail(prop.recipientEmail);
          setRecipientPhone(prop.recipientPhone);
          setCuit(prop.cuit || '');
          setTitle(prop.title);
          setVertical(prop.vertical);
          setCurrency(prop.currency);
          setValidityDays(prop.validityDays);
          setDiscountPercent(prop.discountPercent);
          setTaxRatePercent(prop.taxRatePercent);
          setPaymentTerms(prop.paymentTerms);
          setScopeSummary(prop.scopeSummary);
          setSpecialTerms(prop.specialTerms || '');
          setItems(prop.items);
          setSelectedEmployeeId(prop.employeeId || '');
          setLoading(false);
          return;
        }
      }

      // If initialLead has existing proposal
      if (initialLead?.proposalId) {
        const prop = await proposalService.getProposalById(initialLead.proposalId);
        if (prop) {
          setCurrentProposal(prop);
          setRecipientName(prop.recipientName);
          setCompanyName(prop.companyName);
          setRecipientEmail(prop.recipientEmail);
          setRecipientPhone(prop.recipientPhone);
          setCuit(prop.cuit || '');
          setTitle(prop.title);
          setVertical(prop.vertical);
          setCurrency(prop.currency);
          setValidityDays(prop.validityDays);
          setDiscountPercent(prop.discountPercent);
          setTaxRatePercent(prop.taxRatePercent);
          setPaymentTerms(prop.paymentTerms);
          setScopeSummary(prop.scopeSummary);
          setSpecialTerms(prop.specialTerms || '');
          setItems(prop.items);
          setSelectedEmployeeId(prop.employeeId || '');
          setLoading(false);
          return;
        }
      }

      // New Proposal initialized from Lead or Contact
      setCurrentProposal(null);
      const cName = initialContact?.companyName || initialLead?.companyName || 'Empresa Patagónica';
      const rName = initialContact?.name || initialLead?.contactName || 'Titular / Director';
      const rEmail = initialContact?.email || initialLead?.email || '';
      const rPhone = initialContact?.whatsappNumber || initialContact?.phone || initialLead?.phone || '';
      const rCuit = initialContact?.cuit || '';
      const rVert = initialContact?.vertical || initialLead?.vertical || 'cfo_estrategico';

      setCompanyName(cName);
      setRecipientName(rName);
      setRecipientEmail(rEmail);
      setRecipientPhone(rPhone);
      setCuit(rCuit);
      setVertical(rVert);
      setTitle(`Propuesta de Servicios Contables & CFO - ${cName}`);
      setCurrency('ARS');
      setValidityDays(30);
      setDiscountPercent(0);
      setTaxRatePercent(21);

      // Preload 1 or 2 relevant catalog services based on vertical
      const defaultServices: ProposalLineItem[] = [];
      if (rVert === 'franquicias') {
        const s = ACCOUNTING_SERVICES_CATALOG.find((x) => x.id === 'srv-03') || ACCOUNTING_SERVICES_CATALOG[0];
        defaultServices.push({
          id: `item-${Date.now()}-1`,
          serviceId: s.id,
          serviceName: s.name,
          description: s.description,
          hoursEstimated: s.estimatedDefaultHours,
          hourlyRate: s.defaultHourlyRateArs,
          subtotal: s.estimatedDefaultHours * s.defaultHourlyRateArs,
        });
      } else if (rVert === 'digital_saas' || rVert === 'ia_zhc') {
        const s = ACCOUNTING_SERVICES_CATALOG.find((x) => x.id === 'srv-04') || ACCOUNTING_SERVICES_CATALOG[0];
        defaultServices.push({
          id: `item-${Date.now()}-1`,
          serviceId: s.id,
          serviceName: s.name,
          description: s.description,
          hoursEstimated: s.estimatedDefaultHours,
          hourlyRate: s.defaultHourlyRateArs,
          subtotal: s.estimatedDefaultHours * s.defaultHourlyRateArs,
        });
      } else {
        const s = ACCOUNTING_SERVICES_CATALOG.find((x) => x.id === 'srv-01') || ACCOUNTING_SERVICES_CATALOG[0];
        defaultServices.push({
          id: `item-${Date.now()}-1`,
          serviceId: s.id,
          serviceName: s.name,
          description: s.description,
          hoursEstimated: s.estimatedDefaultHours,
          hourlyRate: s.defaultHourlyRateArs,
          subtotal: s.estimatedDefaultHours * s.defaultHourlyRateArs,
        });
      }

      setItems(defaultServices);
      setLoading(false);
    };

    init();
  }, [isOpen, proposalId, initialLead, initialContact]);

  if (!isOpen) return null;

  // Add service from catalog
  const handleAddCatalogService = () => {
    if (!selectedCatalogServiceId) return;
    const cat = ACCOUNTING_SERVICES_CATALOG.find((s) => s.id === selectedCatalogServiceId);
    if (!cat) return;

    const rate = currency === 'USD' ? cat.defaultHourlyRateUsd : cat.defaultHourlyRateArs;
    const newItem: ProposalLineItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      serviceId: cat.id,
      serviceName: cat.name,
      description: cat.description,
      hoursEstimated: cat.estimatedDefaultHours,
      hourlyRate: rate,
      subtotal: cat.estimatedDefaultHours * rate,
    };

    setItems([...items, newItem]);
    setSelectedCatalogServiceId('');
  };

  // Add custom line item
  const handleAddCustomItem = () => {
    const defaultRate = currency === 'USD' ? 45 : 50000;
    const newItem: ProposalLineItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      serviceName: 'Servicio Contable / Auditoría Especializada',
      description: 'Alcance técnico a convenir con el cliente según requerimientos específicos.',
      hoursEstimated: 10,
      hourlyRate: defaultRate,
      subtotal: 10 * defaultRate,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof ProposalLineItem, value: any) => {
    const updated = [...items];
    const target = { ...updated[index], [field]: value };
    if (field === 'hoursEstimated' || field === 'hourlyRate') {
      const hours = field === 'hoursEstimated' ? Number(value) || 0 : target.hoursEstimated;
      const rate = field === 'hourlyRate' ? Number(value) || 0 : target.hourlyRate;
      target.subtotal = Number((hours * rate).toFixed(2));
    }
    updated[index] = target;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Switch currency and adapt rates if requested
  const handleCurrencyChange = (newCurr: 'ARS' | 'USD') => {
    if (newCurr === currency) return;
    setCurrency(newCurr);
    // Adapt rates based on catalog
    const updated = items.map((it) => {
      if (it.serviceId) {
        const cat = ACCOUNTING_SERVICES_CATALOG.find((c) => c.id === it.serviceId);
        if (cat) {
          const rate = newCurr === 'USD' ? cat.defaultHourlyRateUsd : cat.defaultHourlyRateArs;
          return {
            ...it,
            hourlyRate: rate,
            subtotal: it.hoursEstimated * rate,
          };
        }
      }
      const rate = newCurr === 'USD' ? Math.max(25, Math.round(it.hourlyRate / 1250)) : it.hourlyRate * 1250;
      return {
        ...it,
        hourlyRate: rate,
        subtotal: it.hoursEstimated * rate,
      };
    });
    setItems(updated);
  };

  // Live calculations
  const totals = proposalService.calculateTotals(items, discountPercent, taxRatePercent);

  // Save / Update proposal
  const handleSaveProposal = async (status: 'borrador' | 'enviada' = 'borrador') => {
    if (!recipientName || !companyName) {
      alert('Por favor complete el nombre del destinatario y la empresa');
      return;
    }
    if (items.length === 0) {
      alert('Debe agregar al menos un servicio en la propuesta');
      return;
    }

    setLoading(true);
    try {
      const issueDate = currentProposal?.issueDate || new Date().toISOString().split('T')[0];
      const validUntilDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (currentProposal) {
        // Update existing
        const updated = await proposalService.updateProposal(currentProposal.id, {
          recipientName,
          companyName,
          recipientEmail,
          recipientPhone,
          cuit,
          title,
          vertical,
          currency,
          validityDays,
          discountPercent,
          taxRatePercent,
          paymentTerms,
          scopeSummary,
          specialTerms,
          items,
          status: currentProposal.status === 'borrador' ? status : currentProposal.status,
          validUntilDate,
          employeeId: selectedEmployeeId || undefined,
        });
        setCurrentProposal(updated);
        onProposalSaved?.(updated);
        setActionStatus({ type: 'success', message: '¡Propuesta actualizada correctamente!' });
      } else {
        // Create new
        const created = await proposalService.createProposal({
          leadId: initialLead?.id,
          contactId: initialContact?.id,
          employeeId: selectedEmployeeId || undefined,
          recipientName,
          companyName,
          recipientEmail,
          recipientPhone,
          cuit,
          title,
          vertical,
          currency,
          version: 1,
          status,
          issueDate,
          validUntilDate,
          validityDays,
          discountPercent,
          taxRatePercent,
          paymentTerms,
          scopeSummary,
          specialTerms,
          items,
        });
        setCurrentProposal(created);
        onProposalSaved?.(created);
        setActionStatus({ type: 'success', message: '¡Propuesta creada y vinculada con éxito!' });
      }
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: err.message || 'Error al guardar la propuesta' });
    } finally {
      setLoading(false);
    }
  };

  // Send by Email
  const handleSendEmail = async () => {
    if (!currentProposal) {
      await handleSaveProposal('enviada');
    }
    if (!recipientEmail) {
      alert('Debe ingresar un email para enviar la propuesta');
      return;
    }

    setLoading(true);
    try {
      const propId = currentProposal ? currentProposal.id : (await proposalService.getProposals())[0].id;
      await proposalService.sendProposalByEmail(propId, recipientEmail, emailCustomNote);
      const reloaded = await proposalService.getProposalById(propId);
      if (reloaded) {
        setCurrentProposal(reloaded);
        onProposalSaved?.(reloaded);
      }
      setShowEmailModal(false);
      setActionStatus({ 
        type: 'success', 
        message: `¡Propuesta enviada exitosamente a ${recipientEmail}! Registrado en el historial de Resend.` 
      });
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: err.message || 'Error al enviar por email' });
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Proposal Link
  const handleOpenWhatsApp = () => {
    const p = currentProposal || {
      recipientName,
      companyName,
      proposalNumber: 'BORRADOR',
      version: 1,
      items,
      totalHours: totals.totalHours,
      currency,
      totalAmount: totals.totalAmount,
      paymentTerms,
      validityDays,
    } as any;

    const message = proposalService.generateWhatsAppProposalMessage(p);
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length >= 10 ? cleanPhone : '5492804567890';
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Trigger Print / PDF download
  const handlePrintPdf = () => {
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Reformulate Negotiation
  const handleReformulate = async () => {
    if (!currentProposal) return;
    setLoading(true);
    try {
      const updated = await proposalService.reformulateProposal(
        currentProposal.id,
        reformulateNotes,
        {
          newItems: items,
          newDiscountPercent: discountPercent,
          newPaymentTerms: paymentTerms,
          newScopeSummary: scopeSummary,
          newCurrency: currency,
        }
      );
      setCurrentProposal(updated);
      onProposalSaved?.(updated);
      setShowReformulateModal(false);
      setReformulateNotes('');
      setActionStatus({ 
        type: 'success', 
        message: `¡Propuesta re-formulada con éxito a Versión ${updated.version}! El lead pasó a etapa 'Negociación'.` 
      });
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: err.message || 'Error al re-formular' });
    } finally {
      setLoading(false);
    }
  };

  // Confirm Payment & Activate Client
  const handleConfirmPaymentAndActivate = async () => {
    if (!currentProposal) {
      alert('Primero guarde la propuesta');
      return;
    }
    setLoading(true);
    try {
      const result = await proposalService.confirmPaymentAndActivateClient(currentProposal.id, {
        paymentReference,
      });
      setCurrentProposal(result.proposal);
      onProposalSaved?.(result.proposal);
      onClientActivated?.(result.proposal);
      setShowActivateModal(false);
      setActionStatus({ 
        type: 'success', 
        message: `¡Cliente ACTIVADO con éxito! Se envió el correo de bienvenida con las credenciales de acceso a ${currentProposal.recipientEmail}.` 
      });
    } catch (err: any) {
      console.error(err);
      setActionStatus({ type: 'error', message: err.message || 'Error al activar cliente' });
    } finally {
      setLoading(false);
    }
  };

  const currencySign = currency === 'USD' ? 'USD ' : '$ ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0078D4] flex items-center justify-center font-bold text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {currentProposal ? `Propuesta ${currentProposal.proposalNumber}` : 'Nueva Propuesta Presupuesto'}
                </h3>
                {currentProposal && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    currentProposal.status === 'aprobada_pagada' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    currentProposal.status === 'en_negociacion' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    currentProposal.status === 'enviada' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                    'bg-slate-700 text-slate-300 border-slate-600'
                  }`}>
                    {currentProposal.status.replace('_', ' ')} · v{currentProposal.version}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {companyName} {cuit ? `· CUIT ${cuit}` : ''} · Cr Dominguez Consultoría Estratégica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Executive Action Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-white text-[#0078D4] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Plantilla & Servicios</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-[#0078D4] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Vista Previa / Imprimir PDF</span>
            </button>
            {currentProposal?.negotiationHistory && (
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-white text-[#0078D4] shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Historial de Negociación ({currentProposal.negotiationHistory.length})</span>
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintPdf}
              title="Descargar en PDF o Imprimir"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>PDF / Imprimir</span>
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              title="Compartir por WhatsApp con texto formateado"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              title="Enviar propuesta por Email oficial desde Resend"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0078D4] hover:bg-[#006cbd] text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar por Email</span>
            </button>

            {currentProposal && currentProposal.status !== 'aprobada_pagada' && (
              <button
                type="button"
                onClick={() => setShowReformulateModal(true)}
                title="Re-formular Negociación (Crear nueva versión)"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-formular Negociación</span>
              </button>
            )}

            {currentProposal && currentProposal.status !== 'aprobada_pagada' && (
              <button
                type="button"
                onClick={() => setShowActivateModal(true)}
                title="Confirmar Pago y Activar Cliente con envío de credenciales"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#107C41] hover:bg-[#0e6b37] text-white rounded-lg text-xs font-bold shadow-sm transition-all shadow-emerald-900/20"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Confirmar Pago & Activar</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Notification Banner */}
        {actionStatus && (
          <div className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between ${
            actionStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'
          }`}>
            <span className="flex items-center gap-2">
              {actionStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              {actionStatus.message}
            </span>
            <button type="button" onClick={() => setActionStatus(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Recipient & Company Header Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#0078D4]" />
                    <span>Datos de la Empresa / Contacto Destinatario</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Moneda de Presupuesto:</span>
                    <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white">
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange('ARS')}
                        className={`px-2 py-0.5 text-xs font-bold rounded ${currency === 'ARS' ? 'bg-[#0078D4] text-white' : 'text-slate-600'}`}
                      >
                        ARS ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange('USD')}
                        className={`px-2 py-0.5 text-xs font-bold rounded ${currency === 'USD' ? 'bg-[#0078D4] text-white' : 'text-slate-600'}`}
                      >
                        USD ($)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Razón Social / Empresa</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ej: Cooperativa Lanera Patagónica"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">CUIT / Identificación Fiscal</label>
                    <input
                      type="text"
                      value={cuit}
                      onChange={(e) => setCuit(e.target.value)}
                      placeholder="30-XXXXXXXX-X"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Contacto Titular / Destinatario</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nombre del interlocutor"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    />
                  </div>

                  {/* If contact has multiple employees */}
                  {initialContact?.employees && initialContact.employees.length > 0 && (
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Área / Empleado Específico</label>
                      <select
                        value={selectedEmployeeId}
                        onChange={(e) => {
                          setSelectedEmployeeId(e.target.value);
                          const emp = initialContact.employees?.find((x) => x.id === e.target.value);
                          if (emp) {
                            setRecipientName(emp.name);
                            setRecipientEmail(emp.email);
                            setRecipientPhone(emp.whatsappNumber || emp.phone);
                          }
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                      >
                        <option value="">Contacto Principal ({initialContact.name})</option>
                        {initialContact.employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.roleTitle})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="contacto@empresa.com.ar"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="+54 280 442-8812"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Título de la Propuesta</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título descriptivo del servicio"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">División / Vertical</label>
                    <select
                      value={vertical}
                      onChange={(e) => setVertical(e.target.value as BusinessVertical)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                    >
                      <option value="cfo_estrategico">Dirección Financiera & CFO</option>
                      <option value="tradicional_pyme">Costos & Balances PyME</option>
                      <option value="franquicias">Franquicias (Ley 1512 CCyC)</option>
                      <option value="digital_saas">Economía del Conocimiento / Tech</option>
                      <option value="ia_zhc">Empresas Autónomas IA & Cripto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Área de Servicios Contables & Catalog Selector */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0078D4]" />
                      <span>Área de Servicios Contables, Costos & Honorarios</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Coteja costos, honorarios por hora, tiempo estimado y entregables según catálogo profesional o ítems a medida.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Add from preloaded catalog */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedCatalogServiceId}
                        onChange={(e) => setSelectedCatalogServiceId(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 max-w-[260px] focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                      >
                        <option value="">-- Seleccionar del Catálogo Oficial --</option>
                        {ACCOUNTING_SERVICES_CATALOG.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} ({currency === 'USD' ? `USD ${srv.defaultHourlyRateUsd}/h` : `$${srv.defaultHourlyRateArs.toLocaleString('es-AR')}/h`})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddCatalogService}
                        disabled={!selectedCatalogServiceId}
                        className="px-2.5 py-1.5 bg-[#0078D4] hover:bg-[#006cbd] disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                      >
                        + Agregar
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      + Ítem Personalizado
                    </button>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-2.5 px-3">Servicio Profesional & Alcance</th>
                          <th className="py-2.5 px-3 text-center w-24">Horas Est.</th>
                          <th className="py-2.5 px-3 text-right w-36">Precio / Hora ({currency})</th>
                          <th className="py-2.5 px-3 text-right w-36">Subtotal ({currency})</th>
                          <th className="py-2.5 px-3 text-center w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">
                              No hay ítems agregados. Seleccione un servicio del catálogo superior para comenzar.
                            </td>
                          </tr>
                        ) : (
                          items.map((it, idx) => (
                            <tr key={it.id || idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3 space-y-1.5 align-top">
                                <input
                                  type="text"
                                  value={it.serviceName}
                                  onChange={(e) => handleUpdateItem(idx, 'serviceName', e.target.value)}
                                  className="w-full font-bold text-slate-900 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                                  placeholder="Nombre del servicio contable"
                                />
                                <textarea
                                  value={it.description}
                                  onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full text-slate-600 border border-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                                  placeholder="Descripción técnica del alcance y entregables"
                                />
                              </td>
                              <td className="py-3 px-3 align-top text-center">
                                <div className="inline-flex items-center gap-1">
                                  <input
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={it.hoursEstimated}
                                    onChange={(e) => handleUpdateItem(idx, 'hoursEstimated', Number(e.target.value))}
                                    className="w-16 text-center border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                                  />
                                  <span className="text-slate-400 text-[10px]">hs</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 align-top text-right">
                                <div className="inline-flex items-center gap-1">
                                  <span className="text-slate-400 text-xs">{currencySign}</span>
                                  <input
                                    type="number"
                                    min={0}
                                    step={currency === 'USD' ? 5 : 500}
                                    value={it.hourlyRate}
                                    onChange={(e) => handleUpdateItem(idx, 'hourlyRate', Number(e.target.value))}
                                    className="w-24 text-right border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-3 align-top text-right font-bold text-slate-900">
                                {currencySign}{it.subtotal.toLocaleString('es-AR')}
                              </td>
                              <td className="py-3 px-3 align-top text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                                  title="Eliminar ítem"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations and Totals Bar */}
                  <div className="bg-slate-50 border-t border-slate-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Terms and conditions */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold mb-0.5">Condiciones de Pago & Anticipos</label>
                          <textarea
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value)}
                            rows={2}
                            className="w-full text-slate-700 border border-slate-200 rounded p-1.5 text-xs bg-white"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="block text-slate-500 font-semibold mb-0.5">Validez (días)</label>
                            <input
                              type="number"
                              min={7}
                              max={180}
                              value={validityDays}
                              onChange={(e) => setValidityDays(Number(e.target.value))}
                              className="w-20 border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold mb-0.5">Bonificación (%)</label>
                            <input
                              type="number"
                              min={0}
                              max={50}
                              value={discountPercent}
                              onChange={(e) => setDiscountPercent(Number(e.target.value))}
                              className="w-20 border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold mb-0.5">Alícuota IVA (%)</label>
                            <select
                              value={taxRatePercent}
                              onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                              className="border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                            >
                              <option value={21}>21% (Responsable Inscripto)</option>
                              <option value={10.5}>10.5% (Diferencial)</option>
                              <option value={0}>0% (Exento / Exportación Factura E)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-2 self-start">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Horas Totales Estimadas:</span>
                          <span className="font-bold text-slate-900">{totals.totalHours} hs</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Subtotal de Honorarios:</span>
                          <span className="font-semibold text-slate-900">{currencySign}{totals.subtotalAmount.toLocaleString('es-AR')}</span>
                        </div>
                        {totals.discountAmount > 0 && (
                          <div className="flex items-center justify-between text-red-600 font-medium">
                            <span>Bonificación especial ({discountPercent}%):</span>
                            <span>-{currencySign}{totals.discountAmount.toLocaleString('es-AR')}</span>
                          </div>
                        )}
                        {totals.taxAmount > 0 && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span>IVA ({taxRatePercent}%):</span>
                            <span>+{currencySign}{totals.taxAmount.toLocaleString('es-AR')}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-slate-900 uppercase">HONORARIOS TOTALES ({currency}):</span>
                          <span className="text-base font-extrabold text-[#0078D4]">
                            {currencySign}{totals.totalAmount.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope & Special Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Resumen Ejecutivo del Alcance</label>
                  <textarea
                    value={scopeSummary}
                    onChange={(e) => setScopeSummary(e.target.value)}
                    rows={3}
                    className="w-full text-slate-700 border border-slate-200 rounded-lg p-2.5 bg-white"
                    placeholder="Resumen del valor que aportará este servicio a la compañía..."
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Términos Especiales & Beneficios del Portal</label>
                  <textarea
                    value={specialTerms}
                    onChange={(e) => setSpecialTerms(e.target.value)}
                    rows={3}
                    className="w-full text-slate-700 border border-slate-200 rounded-lg p-2.5 bg-white"
                    placeholder="Beneficios exclusivos de la firma, acceso al portal de clientes..."
                  />
                </div>
              </div>

              {/* Bottom Save Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {currentProposal && (
                    <span className="text-xs text-slate-500">
                      Última actualización: {new Date(currentProposal.updatedAt).toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProposal('borrador')}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-300"
                  >
                    Guardar como Borrador
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveProposal('enviada')}
                    disabled={loading}
                    className="px-5 py-2 bg-[#0078D4] hover:bg-[#006cbd] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar & Marcar Lista</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Preview & Printable Executive PDF */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center justify-between">
                <span>Esta es la vista ejecutiva lista para exportar. Haga clic en <strong>"Imprimir / PDF"</strong> para generar el documento oficial.</span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs"
                >
                  Imprimir / Guardar como PDF
                </button>
              </div>

              {/* Printable Document Sheet */}
              <div id="printable-proposal" className="bg-white p-8 sm:p-12 border border-slate-300 rounded-xl shadow-lg max-w-4xl mx-auto text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Cr Dominguez</h1>
                    <p className="text-xs font-bold text-[#0078D4] uppercase tracking-wider mt-0.5">
                      Consultoría Estratégica & Dirección Financiera CFO
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Cr. Carlos Rodrigo Domínguez · Matrícula Oficial CPCE Chubut
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Trelew, Valle Inferior del Río Chubut · Patagonia Argentina
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded">
                      PROPUESTA #{currentProposal?.proposalNumber || 'PROP-2026-BORRADOR'}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      Versión: <strong>{currentProposal?.version || 1}.0</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Fecha: {currentProposal?.issueDate || new Date().toISOString().split('T')[0]}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Válida hasta: {currentProposal?.validUntilDate || new Date(Date.now() + validityDays * 86400000).toISOString().split('T')[0]}
                    </p>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 text-xs grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Destinatario / Razón Social:</span>
                    <strong className="text-sm text-slate-900 block">{companyName}</strong>
                    <span className="text-slate-600 block">{recipientName}</span>
                    {cuit && <span className="text-slate-500 font-mono">CUIT: {cuit}</span>}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-500 uppercase block mb-1">Contacto Registrado:</span>
                    <span className="text-slate-700 block">{recipientEmail}</span>
                    <span className="text-slate-700 block">{recipientPhone}</span>
                    <span className="text-[#0078D4] font-medium block mt-1">crdominguez.ar/portal</span>
                  </div>
                </div>

                {/* Scope & Title */}
                <div className="mb-6">
                  <h2 className="text-base font-bold text-slate-900 mb-2">{title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{scopeSummary}</p>
                </div>

                {/* Table of Services */}
                <div className="mb-8 border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase text-[11px]">
                        <th className="py-2.5 px-3">Servicio Profesional & Entregables</th>
                        <th className="py-2.5 px-3 text-center w-24">Horas</th>
                        <th className="py-2.5 px-3 text-right w-36">Precio / Hora</th>
                        <th className="py-2.5 px-3 text-right w-36">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.map((it, idx) => (
                        <tr key={idx} className="even:bg-slate-50/60">
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 block text-xs">{idx + 1}. {it.serviceName}</strong>
                            <span className="text-slate-600 text-[11px] block mt-0.5">{it.description}</span>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-700 font-semibold">{it.hoursEstimated} hs</td>
                          <td className="py-3 px-3 text-right text-slate-700">{currencySign}{it.hourlyRate.toLocaleString('es-AR')}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">{currencySign}{it.subtotal.toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {discountPercent > 0 && (
                        <tr className="border-t border-slate-200 bg-slate-50">
                          <td colSpan={3} className="py-2 px-3 text-right text-slate-600">Bonificación Comercial ({discountPercent}%):</td>
                          <td className="py-2 px-3 text-right text-red-600 font-bold">-{currencySign}{totals.discountAmount.toLocaleString('es-AR')}</td>
                        </tr>
                      )}
                      {totals.taxAmount > 0 && (
                        <tr className="border-t border-slate-200 bg-slate-50">
                          <td colSpan={3} className="py-2 px-3 text-right text-slate-600">IVA ({taxRatePercent}%):</td>
                          <td className="py-2 px-3 text-right text-slate-700">+{currencySign}{totals.taxAmount.toLocaleString('es-AR')}</td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-slate-900 bg-slate-100">
                        <td colSpan={3} className="py-3 px-3 text-right text-xs font-black text-slate-900 uppercase">HONORARIOS TOTALES ({currency}):</td>
                        <td className="py-3 px-3 text-right text-sm font-black text-[#0078D4]">{currencySign}{totals.totalAmount.toLocaleString('es-AR')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Terms & Conditions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-slate-200 rounded-lg p-4 mb-8 bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Condiciones de Contratación:</h4>
                    <p className="text-slate-600">{paymentTerms}</p>
                    <p className="text-slate-500 mt-2 text-[11px]">
                      * Propuesta válida por {validityDays} días desde su fecha de emisión.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Bóveda Documental & Portal Privado:</h4>
                    <p className="text-slate-600">{specialTerms}</p>
                    <p className="text-slate-500 mt-2 text-[11px]">
                      * Secreto profesional regido por la Ley 20.488 y código de ética FACPCE.
                    </p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-10 border-t border-slate-300 flex justify-between items-end text-center text-xs">
                  <div className="w-56 border-t border-slate-400 pt-2">
                    <p className="font-bold text-slate-900">Cr. Carlos Rodrigo Domínguez</p>
                    <p className="text-[11px] text-slate-500">Director de Consultoría & CFO</p>
                    <p className="text-[10px] text-slate-400">CPCE Provincia del Chubut</p>
                  </div>

                  <div className="w-56 border-t border-slate-400 pt-2">
                    <p className="font-bold text-slate-900">Conformidad de la Empresa</p>
                    <p className="text-[11px] text-slate-500">{companyName}</p>
                    <p className="text-[10px] text-slate-400">Firma, Aclaración y Fecha</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Negotiation History */}
          {activeTab === 'history' && currentProposal?.negotiationHistory && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Historial de Negociación y Versiones</h4>
                  <p className="text-xs text-slate-500">
                    Registro de cada ajuste de honorarios, contrapropuesta y acuerdos alcanzados con el cliente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReformulateModal(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  + Re-formular Nueva Versión
                </button>
              </div>

              <div className="space-y-3">
                {currentProposal.negotiationHistory.map((entry, idx) => (
                  <div key={entry.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold font-mono">
                          Versión {entry.version}.0
                        </span>
                        <span className="text-slate-500">{entry.date}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium">{entry.author}</span>
                      </div>
                      <span className="font-extrabold text-sm text-[#0078D4]">
                        {entry.currency === 'USD' ? 'USD ' : '$ '}
                        {entry.totalAmount.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-2.5">
                      {entry.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sub-Dialog: Send by Email */}
        {showEmailModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0078D4]" />
                <span>Enviar Propuesta Presupuesto por Email</span>
              </h4>
              <p className="text-xs text-slate-600">
                Se enviará una plantilla ejecutiva oficial desde <strong>carlos@crdominguez.ar</strong> con el desglose de ítems, honorarios y condiciones.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Destinatario</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nota personalizada (opcional)</label>
                  <textarea
                    value={emailCustomNote}
                    onChange={(e) => setEmailCustomNote(e.target.value)}
                    rows={3}
                    placeholder="Estimado cliente, tal como conversamos en la llamada..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#0078D4] hover:bg-[#006cbd] text-white rounded-lg text-xs font-bold"
                >
                  Confirmar y Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sub-Dialog: Reformulate Negotiation */}
        {showReformulateModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>Re-formular Negociación</span>
              </h4>
              <p className="text-xs text-slate-600">
                Incrementará la versión de la propuesta y registrará la minuta de negociación. El lead avanzará o se mantendrá en etapa de <strong>Negociación</strong>.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Motivo / Minuta de la renegociación</label>
                  <textarea
                    value={reformulateNotes}
                    onChange={(e) => setReformulateNotes(e.target.value)}
                    rows={4}
                    placeholder="Se acordó bonificar un 10% adicional por pago anual anticipado..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReformulateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleReformulate}
                  disabled={loading}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
                >
                  Guardar Re-formulación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sub-Dialog: Confirm Payment & Activate Client */}
        {showActivateModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Confirmar Pago & Activar Cliente</h4>
                  <p className="text-xs text-slate-500">Pasa al estado de cliente activo automáticamente</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                <p className="font-bold">Esta acción ejecutará automáticamente:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Transición del Lead a etapa <strong>Cliente Activo</strong>.</li>
                  <li>Creación del usuario y credenciales en el <strong>Portal de Clientes</strong>.</li>
                  <li>Envío automático del <strong>Correo de Bienvenida</strong> con credenciales de acceso.</li>
                  <li>Actualización del contacto o grupo de contactos a <strong>cliente_activo</strong>.</li>
                </ul>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Referencia de Pago / Factura (opcional)</label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ej: Transf. Santander #489102 / Cheque #1920"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPaymentAndActivate}
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#107C41] hover:bg-[#0e6b37] text-white rounded-lg text-xs font-bold"
                >
                  Confirmar Pago y Activar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
