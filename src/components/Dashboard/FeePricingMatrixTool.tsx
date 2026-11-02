import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Download,
  Send,
  FileCheck,
  Edit2,
  Clock,
  DollarSign,
  Briefcase,
  Layers,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { proposalService } from '../../lib/proposalService';
import { ProposalLineItem } from '../../types';

export interface AccountingServiceCatalogItem {
  id: string;
  name: string;
  category: 'impositivo' | 'laboral' | 'auditoria' | 'cfo' | 'societario';
  description: string;
  hourlyRate: number; // Precio por hora en ARS
  typicalHours: number; // Horas típicas por mes o por trabajo
  isSubscription: boolean; // recurrente mensual vs puntual
}

const DEFAULT_SERVICES: AccountingServiceCatalogItem[] = [
  {
    id: 'srv_1',
    name: 'Liquidación Mensual IVA, IIBB Chubut & Regímenes',
    category: 'impositivo',
    description: 'Conciliación de comprobantes, cómputo de crédito fiscal, liquidación mensual y presentación de DDJJ.',
    hourlyRate: 35000,
    typicalHours: 8,
    isSubscription: true
  },
  {
    id: 'srv_2',
    name: 'Liquidación de Sueldos & Libro de Sueldos Digital F.931',
    category: 'laboral',
    description: 'Cálculo de haberes según CCT patagónicos (Comercio, Petróleo, Construcción), emisión de recibos y F.931.',
    hourlyRate: 38000,
    typicalHours: 6,
    isSubscription: true
  },
  {
    id: 'srv_3',
    name: 'Auditoría de Estados Contables & Certificación CPCE',
    category: 'auditoria',
    description: 'Auditoría externa de balance general, confección de notas, cuadros anexos y certificación ante el CPCE Chubut.',
    hourlyRate: 45000,
    typicalHours: 25,
    isSubscription: false
  },
  {
    id: 'srv_4',
    name: 'Consultoría CFO Estratégico & Flujo de Fondos',
    category: 'cfo',
    description: 'Planificación de tesorería, análisis de rentabilidad por unidad de negocio y asesoramiento de directorio.',
    hourlyRate: 50000,
    typicalHours: 10,
    isSubscription: true
  },
  {
    id: 'srv_5',
    name: 'Constitución y Formalización de Sociedades (SRL / SAS)',
    category: 'societario',
    description: 'Redacción de estatuto, inscripción en Registro Público de Comercio e IGJ Chubut y trámite de CUIT ante ARCA.',
    hourlyRate: 42000,
    typicalHours: 15,
    isSubscription: false
  },
  {
    id: 'srv_6',
    name: 'Defensa & Asistencia en Fiscalizaciones ARCA / DGR',
    category: 'impositivo',
    description: 'Respuesta técnica a requerimientos, descargo ante intimaciones fiscales y auditoría preventiva de desvíos.',
    hourlyRate: 48000,
    typicalHours: 12,
    isSubscription: false
  }
];

interface QuoteItem {
  serviceId: string;
  name: string;
  description: string;
  hourlyRate: number;
  hours: number;
  total: number;
}

interface FeePricingMatrixToolProps {
  onGoToCRM?: () => void;
}

export const FeePricingMatrixTool: React.FC<FeePricingMatrixToolProps> = ({ onGoToCRM }) => {
  const [catalog, setCatalog] = useState<AccountingServiceCatalogItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dl_accounting_services_catalog');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_SERVICES;
  });

  const [selectedQuoteItems, setSelectedQuoteItems] = useState<QuoteItem[]>([
    {
      serviceId: 'srv_1',
      name: 'Liquidación Mensual IVA, IIBB Chubut & Regímenes',
      description: 'Conciliación de comprobantes y presentación de DDJJ.',
      hourlyRate: 35000,
      hours: 8,
      total: 280000
    },
    {
      serviceId: 'srv_2',
      name: 'Liquidación de Sueldos & Libro de Sueldos Digital F.931',
      description: 'Cálculo de haberes y F.931 para nómina hasta 5 empleados.',
      hourlyRate: 38000,
      hours: 6,
      total: 228000
    }
  ]);

  const [clientName, setClientName] = useState<string>('Empresa Patagónica S.A.');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [activeCatalogFilter, setActiveCatalogFilter] = useState<string>('all');
  const [editingService, setEditingService] = useState<AccountingServiceCatalogItem | null>(null);

  const saveCatalog = (items: AccountingServiceCatalogItem[]) => {
    setCatalog(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dl_accounting_services_catalog', JSON.stringify(items));
    }
  };

  const handleAddToQuote = (service: AccountingServiceCatalogItem) => {
    const existingIndex = selectedQuoteItems.findIndex(i => i.serviceId === service.id);
    if (existingIndex >= 0) {
      // Increase hours
      const updated = [...selectedQuoteItems];
      updated[existingIndex].hours += 2;
      updated[existingIndex].total = updated[existingIndex].hours * updated[existingIndex].hourlyRate;
      setSelectedQuoteItems(updated);
    } else {
      const newItem: QuoteItem = {
        serviceId: service.id,
        name: service.name,
        description: service.description,
        hourlyRate: service.hourlyRate,
        hours: service.typicalHours,
        total: service.hourlyRate * service.typicalHours
      };
      setSelectedQuoteItems([...selectedQuoteItems, newItem]);
    }
  };

  const handleUpdateQuoteItem = (serviceId: string, hours: number, rate: number) => {
    const updated = selectedQuoteItems.map(item => {
      if (item.serviceId === serviceId) {
        return {
          ...item,
          hours: Math.max(1, hours),
          hourlyRate: Math.max(0, rate),
          total: Math.max(1, hours) * Math.max(0, rate)
        };
      }
      return item;
    });
    setSelectedQuoteItems(updated);
  };

  const handleRemoveQuoteItem = (serviceId: string) => {
    setSelectedQuoteItems(selectedQuoteItems.filter(i => i.serviceId !== serviceId));
  };

  // Calculations
  const grossSubtotal = selectedQuoteItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = grossSubtotal * (discountPercent / 100);
  const netTotal = grossSubtotal - discountAmount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleTransferToCRMProposal = async () => {
    // Generate proposal items matching ProposalLineItem interface
    const proposalItems: ProposalLineItem[] = selectedQuoteItems.map((q, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      serviceId: q.serviceId,
      serviceName: q.name,
      description: q.description || q.name,
      hoursEstimated: q.hours,
      hourlyRate: q.hourlyRate,
      subtotal: q.total
    }));

    try {
      const now = new Date();
      const issueDateStr = now.toISOString().split('T')[0];
      const validUntilStr = new Date(now.getTime() + 15 * 86400000).toISOString().split('T')[0];

      const newProposal = await proposalService.createProposal({
        recipientName: clientName || 'Nuevo Cliente Cotizado',
        companyName: clientName || 'Empresa Patagónica S.A.',
        recipientEmail: 'contacto@cliente.com',
        recipientPhone: '+54 280 400-0000',
        title: 'Propuesta Integral Contable, Fiscal & Asesoría',
        scopeSummary: `Propuesta de servicios profesionales con descuento de abono del ${discountPercent}%. Honorarios vigentes según aranceles CPCE Chubut.`,
        vertical: 'contabilidad_general' as any,
        currency: 'ARS',
        version: 1,
        status: 'borrador',
        issueDate: issueDateStr,
        validUntilDate: validUntilStr,
        validityDays: 15,
        paymentTerms: 'Abono mensual vencimiento del 1 al 10 de cada período',
        items: proposalItems,
        discountPercent: discountPercent,
        taxRatePercent: 21,
        specialTerms: 'Emitida desde la Matriz Cotizadora del Dashboard.',
        negotiationHistory: []
      });

      alert(`¡Propuesta presupuestaria creada con éxito con código ${newProposal.proposalNumber}! Redirigiendo al CRM...`);
      if (onGoToCRM) {
        onGoToCRM();
      }
    } catch (e: any) {
      console.error(e);
      alert('Error al crear la propuesta en el CRM.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Calculator className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                Aranceles & Honorarios Profesionales
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Matriz Cotizadora de Servicios Contables & Horas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure la tarifa horaria de cada servicio, arme presupuestos transparentes para PyMEs y vincúlelos al pipeline comercial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTransferToCRMProposal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              Transferir a Presupuesto CRM
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Service Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Catálogo de Servicios Contables
                </h2>
                <p className="text-xs text-slate-500">
                  Haga clic en "+ Agregar" para incorporar al presupuesto
                </p>
              </div>

              {/* Category filter */}
              <select
                value={activeCatalogFilter}
                onChange={(e) => setActiveCatalogFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
              >
                <option value="all">Todas las Áreas</option>
                <option value="impositivo">Impositivo & Fiscal</option>
                <option value="laboral">Laboral & Nóminas</option>
                <option value="auditoria">Auditoría & Balances</option>
                <option value="cfo">CFO & Finanzas</option>
                <option value="societario">Societario</option>
              </select>
            </div>

            {/* Catalog items list */}
            <div className="space-y-3">
              {catalog
                .filter(item => activeCatalogFilter === 'all' || item.category === activeCatalogFilter)
                .map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {service.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          · {service.isSubscription ? 'Abono Mensual' : 'Trabajo Puntual'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-700">
                        <span>Tarifa: <strong className="text-slate-900">{formatCurrency(service.hourlyRate)}/h</strong></span>
                        <span>·</span>
                        <span>Estimado: <strong className="text-slate-900">{service.typicalHours} hs</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToQuote(service)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-medium transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Live Quote Builder (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Presupuesto en Elaboración
              </h2>
              <div className="mt-3">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Razón Social / Cliente
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Quote items */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {selectedQuoteItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Seleccione servicios del catálogo para comenzar a cotizar.
                </div>
              ) : (
                selectedQuoteItems.map((item) => (
                  <div key={item.serviceId} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 leading-tight">
                        {item.name}
                      </span>
                      <button
                        onClick={() => handleRemoveQuoteItem(item.serviceId)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Horas Estimadas</span>
                        <input
                          type="number"
                          min="1"
                          value={item.hours}
                          onChange={(e) => handleUpdateQuoteItem(item.serviceId, Number(e.target.value), item.hourlyRate)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Tarifa por Hora ($)</span>
                        <input
                          type="number"
                          step="1000"
                          value={item.hourlyRate}
                          onChange={(e) => handleUpdateQuoteItem(item.serviceId, item.hours, Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded font-mono bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 font-mono text-xs">
                      <span className="text-slate-500 text-[11px]">Subtotal Servicio:</span>
                      <strong className="text-slate-900">{formatCurrency(item.total)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount & Totals */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Bruto:</span>
                <span>{formatCurrency(grossSubtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1 font-sans">
                  Bonificación Abono:
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-12 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-mono ml-1"
                  />
                  %
                </span>
                <span className="text-emerald-600 font-mono">-{formatCurrency(discountAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span className="font-sans">Honorario Mensual Sugerido:</span>
                <span className="text-blue-600">{formatCurrency(netTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleTransferToCRMProposal}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Generar Propuesta y Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
