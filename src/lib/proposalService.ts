/**
 * Accounting Services Catalog & Proposal Engine
 * Cr Dominguez · Consultoría Estratégica & CFO
 * Trelew, Chubut, Patagonia Argentina
 */

import { 
  AccountingServiceItem, 
  CRMProposal, 
  ProposalLineItem, 
  ProposalStatus, 
  ProposalNegotiationEntry,
  BusinessVertical 
} from '../types';
import { dbRepository } from './supabaseClient';
import { resendService } from './resendService';
import { userService } from './userService';

export const ACCOUNTING_SERVICES_CATALOG: AccountingServiceItem[] = [
  {
    id: 'srv-01',
    code: 'CFO-FRAC',
    name: 'Dirección Financiera & CFO Fraccional On-Demand',
    category: 'cfo_finanzas',
    description: 'Dirección financiera estratégica ejecutiva. Modelado de flujos de fondos (Cash Flow a 12 semanas), comités mensuales con socios, monitoreo de costo de capital (WACC) y toma de decisiones.',
    defaultHourlyRateArs: 65000,
    defaultHourlyRateUsd: 50,
    estimatedDefaultHours: 12,
    deliverables: [
      'Tablero de control mensual de Cash Flow & Runway',
      'Comité directivo quincenal/mensual con socios',
      'Informe de estructura de costos y punto de equilibrio operativo',
      'Planificación de endeudamiento y líneas bancarias'
    ],
    normativeFramework: 'Estándares IFRS / FACPCE RT 54',
  },
  {
    id: 'srv-02',
    code: 'AUD-TRIB',
    name: 'Auditoría Contable, Balances & Compliance Fiscal Mensual',
    category: 'tributaria',
    description: 'Planificación fiscal estratégica y auditoría de declaraciones juradas mensuales (F.2002 IVA, IIBB Convenio Multilateral / Chubut, SICORE, Agentes de Retención). Cierre de ejercicio y balance auditado.',
    defaultHourlyRateArs: 45000,
    defaultHourlyRateUsd: 35,
    estimatedDefaultHours: 15,
    deliverables: [
      'Auditoría y presentación mensual de DDJJ impositivas',
      'Papeles de trabajo y dictamen de estados contables anuales',
      'Estrategia de deducción impositiva y amortizaciones aceleradas',
      'Certificaciones contables legalizadas ante CPCE'
    ],
    normativeFramework: 'Normas Profesionales FACPCE y Código Fiscal Chubut',
  },
  {
    id: 'srv-03',
    code: 'FRANQ-CCYC',
    name: 'Auditoría Precontractual de Franquicias (Ley CCyC 1512-1524)',
    category: 'franquicias',
    description: 'Auditoría exhaustiva de la Circular de Oferta de Franquicia (COF). Modelado financiero de Payback real, VAN y TIR. Detección de cláusulas leoninas o abusivas de provisión y territorio.',
    defaultHourlyRateArs: 60000,
    defaultHourlyRateUsd: 45,
    estimatedDefaultHours: 20,
    deliverables: [
      'Dictamen técnico-financiero sobre la Circular de Oferta (COF)',
      'Matriz de riesgos legales y 10 obligaciones inderogables CCyC',
      'Modelo de flujos proyectados y simulación VAN/TIR a 5 años',
      'Propuesta de renegociación de canon inicial y regalías'
    ],
    normativeFramework: 'Código Civil y Comercial de la Nación Arts. 1512 a 1524',
  },
  {
    id: 'srv-04',
    code: 'TECH-EXP',
    name: 'Encuadre Cambiario & Factura E (Economía del Conocimiento)',
    category: 'tributaria',
    description: 'Arquitectura para exportadores de software, servicios profesionales y contenidos. Régimen de disponibilidad de divisas BCRA, bono fiscal de contribuciones patronales y deducción de retenciones del exterior.',
    defaultHourlyRateArs: 55000,
    defaultHourlyRateUsd: 40,
    estimatedDefaultHours: 10,
    deliverables: [
      'Estructuración del circuito de emisión de Factura E y liquidación MULC',
      'Inscripción y auditoría de cumplimiento en el Registro Ley 27.506',
      'Gestión y aplicación de bonos de crédito fiscal para aportes patronales',
      'Encuadre de tratados para evitar doble imposición internacional'
    ],
    normativeFramework: 'Ley 27.506 y Comunicaciones BCRA "A" 7518/7766',
  },
  {
    id: 'srv-05',
    code: 'ZHC-AI',
    name: 'Gobierno ZHC & Tesorería Cripto / Agentes Autónomos IA',
    category: 'zhc_tech',
    description: 'Pioneros en encuadre impositivo para empresas con agentes de inteligencia artificial y tesorerías descentralizadas en stablecoins. Deducibilidad de costos de cómputo/inferencia de modelos LLM.',
    defaultHourlyRateArs: 75000,
    defaultHourlyRateUsd: 60,
    estimatedDefaultHours: 12,
    deliverables: [
      'Manual de políticas contables para wallets corporativas y smart contracts',
      'Tratamiento impositivo y deducción de costos de APIs (OpenAI, Anthropic)',
      'Dictamen de solvencia patrimonial on-chain',
      'Matriz de cumplimiento preventivo UIF y tributario'
    ],
    normativeFramework: 'Resolución CNV 994/2024 y Ley de Procedimiento Tributario 11.683',
  },
  {
    id: 'srv-06',
    code: 'RRHH-PAT',
    name: 'Liquidación de Sueldos y Cargas Sociales Patagónicas (Zona Desfavorable)',
    category: 'sociedades_laboral',
    description: 'Liquidación técnica integral de nómina salarial con aplicación de coeficientes de zona fría patagónica, Libro de Sueldos Digital AFIP, F.931, y convenios colectivos específicos.',
    defaultHourlyRateArs: 40000,
    defaultHourlyRateUsd: 30,
    estimatedDefaultHours: 10,
    deliverables: [
      'Emisión mensual de recibos de sueldo digitales legalizados',
      'Generación y validación de F.931 y Libro de Sueldos Digital',
      'Cálculo exacto del adicional por zona desfavorable patagónica',
      'Auditoría preventiva de riesgos laborales y contingencias'
    ],
    normativeFramework: 'Ley de Contrato de Trabajo 20.744 y Ley 26.341',
  },
  {
    id: 'srv-07',
    code: 'VAL-DCF',
    name: 'Valuación de Empresas & Estructuración Financiera M&A',
    category: 'cfo_finanzas',
    description: 'Dictamen pericial independiente de valuación de empresas mediante metodología de Flujo de Fondos Descontados (DCF), múltiplos de EBITDA comparables y análisis de valor sustancial de activos.',
    defaultHourlyRateArs: 70000,
    defaultHourlyRateUsd: 55,
    estimatedDefaultHours: 25,
    deliverables: [
      'Informe ejecutivo de valuación con rangos de sensibilidad',
      'Modelo financiero dinámico en planilla con proyecciones a 5 años',
      'Auditoría previa (Vendor Due Diligence) financiero-tributaria',
      'Defensa técnica en comités de negociación de compraventa'
    ],
    normativeFramework: 'Metodología Internacional IVS (International Valuation Standards)',
  },
];

const SEED_PROPOSALS: CRMProposal[] = [
  {
    id: 'prop-001',
    proposalNumber: 'PROP-2026-001',
    leadId: 'lead-101',
    contactId: 'contact-101',
    companyName: 'Cooperativa Lanera Patagónica',
    recipientName: 'Ing. Marcos Vallejos',
    recipientEmail: 'm.vallejos@lanapatagonica.com.ar',
    recipientPhone: '+54 280 442-8812',
    cuit: '30-68912344-8',
    title: 'Propuesta de Dirección Financiera Fraccional & Reestructuración de Costos Industriales',
    vertical: 'tradicional_pyme',
    currency: 'ARS',
    version: 2,
    status: 'en_negociacion',
    issueDate: '2026-10-20',
    validUntilDate: '2026-11-20',
    validityDays: 30,
    items: [
      {
        id: 'item-1',
        serviceId: 'srv-01',
        serviceName: 'Dirección Financiera & CFO Fraccional On-Demand',
        description: 'Modelado de flujos de fondos proyectados a 12 semanas y comité directivo mensual para la nueva planta de peinado de lana.',
        hoursEstimated: 14,
        hourlyRate: 65000,
        subtotal: 910000,
      },
      {
        id: 'item-2',
        serviceId: 'srv-06',
        serviceName: 'Liquidación de Sueldos y Cargas Sociales Patagónicas (Zona Desfavorable)',
        description: 'Auditoría y adecuación de nómina de 45 operarios con cómputo de adicionales de zona fría y F.931.',
        hoursEstimated: 10,
        hourlyRate: 40000,
        subtotal: 400000,
      },
    ],
    totalHours: 24,
    subtotalAmount: 1310000,
    discountPercent: 10,
    discountAmount: 131000,
    taxRatePercent: 21,
    taxAmount: 247590,
    totalAmount: 1426590,
    paymentTerms: '50% anticipo al inicio de actividades, 50% al cierre mensual contra entrega del informe ejecutivo.',
    scopeSummary: 'Acompañamiento directivo integral y optimización del costo laboral para el Parque Industrial de Trelew.',
    specialTerms: 'Incluye acceso ilimitado para el equipo de administración a la Bóveda de Documentos y soporte vía WhatsApp corporativo.',
    negotiationHistory: [
      {
        id: 'neg-1',
        date: '2026-10-20',
        version: 1,
        author: 'Cr. Carlos Rodrigo Domínguez',
        notes: 'Emisión de propuesta inicial con alcance completo de 28 horas.',
        totalAmount: 1585100,
        currency: 'ARS',
        status: 'enviada',
      },
      {
        id: 'neg-2',
        date: '2026-10-24',
        version: 2,
        author: 'Cr. Carlos Rodrigo Domínguez',
        notes: 'Reunión de negociación con el Consejo de Administración. Se ajustaron las horas de liquidación de 14 a 10 y se aplicó una bonificación del 10% por pago bancario puntual.',
        totalAmount: 1426590,
        currency: 'ARS',
        status: 'en_negociacion',
      },
    ],
    sentAt: '2026-10-20T16:00:00Z',
    createdAt: '2026-10-20T15:30:00Z',
    updatedAt: '2026-10-24T18:00:00Z',
  },
  {
    id: 'prop-002',
    proposalNumber: 'PROP-2026-002',
    leadId: 'lead-102',
    contactId: 'contact-102',
    companyName: 'Patagonia Data Engine',
    recipientName: 'Lic. Lucía Fernández',
    recipientEmail: 'lucia@patagoniadata.io',
    recipientPhone: '+54 9 280 465-9011',
    cuit: '30-71894520-4',
    title: 'Propuesta de Encuadre Cambiario & Régimen de Factura E',
    vertical: 'digital_saas',
    currency: 'USD',
    version: 1,
    status: 'enviada',
    issueDate: '2026-10-22',
    validUntilDate: '2026-11-22',
    validityDays: 30,
    items: [
      {
        id: 'item-201',
        serviceId: 'srv-04',
        serviceName: 'Encuadre Cambiario & Factura E (Economía del Conocimiento)',
        description: 'Circuitos de cobro de analítica internacional en Stripe/Wise, encuadre de Factura E y régimen cambiario BCRA.',
        hoursEstimated: 12,
        hourlyRate: 40,
        subtotal: 480,
      },
      {
        id: 'item-202',
        serviceId: 'srv-01',
        serviceName: 'Dirección Financiera & CFO Fraccional On-Demand',
        description: 'Supervisión de métricas SaaS (MRR, Churn, LTV/CAC) y preparación de plan de negocio financiero para inversores.',
        hoursEstimated: 15,
        hourlyRate: 50,
        subtotal: 750,
      },
    ],
    totalHours: 27,
    subtotalAmount: 1230,
    discountPercent: 5,
    discountAmount: 61.5,
    taxRatePercent: 0,
    taxAmount: 0,
    totalAmount: 1168.5,
    paymentTerms: 'Transferencia bancaria o USDT/USDC mensual anticipado con factura E de consultoría profesional.',
    scopeSummary: 'Blindaje normativo integral de exportación de servicios desde Puerto Madryn.',
    specialTerms: 'Garantía de respuesta en menos de 4 horas hábiles para dudas cambiarias de transferencias del exterior.',
    negotiationHistory: [
      {
        id: 'neg-102',
        date: '2026-10-22',
        version: 1,
        author: 'Cr. Carlos Rodrigo Domínguez',
        notes: 'Propuesta enviada por correo electrónico tras llamada de diagnóstico técnico.',
        totalAmount: 1168.5,
        currency: 'USD',
        status: 'enviada',
      },
    ],
    sentAt: '2026-10-22T11:00:00Z',
    createdAt: '2026-10-22T10:30:00Z',
    updatedAt: '2026-10-22T11:00:00Z',
  },
];

class ProposalService {
  private storageKey = 'cr_crm_proposals_v1';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(SEED_PROPOSALS));
    }
  }

  getServicesCatalog(): AccountingServiceItem[] {
    return ACCOUNTING_SERVICES_CATALOG;
  }

  async getProposals(): Promise<CRMProposal[]> {
    if (typeof window === 'undefined') return SEED_PROPOSALS;
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : SEED_PROPOSALS;
  }

  async getProposalById(id: string): Promise<CRMProposal | null> {
    const list = await this.getProposals();
    return list.find((p) => p.id === id) || null;
  }

  async getProposalsByLeadId(leadId: string): Promise<CRMProposal[]> {
    const list = await this.getProposals();
    return list.filter((p) => p.leadId === leadId);
  }

  async getProposalsByContactId(contactId: string): Promise<CRMProposal[]> {
    const list = await this.getProposals();
    return list.filter((p) => p.contactId === contactId);
  }

  calculateTotals(
    items: ProposalLineItem[],
    discountPercent: number = 0,
    taxRatePercent: number = 21
  ): {
    totalHours: number;
    subtotalAmount: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  } {
    const totalHours = items.reduce((acc, it) => acc + (Number(it.hoursEstimated) || 0), 0);
    const subtotalAmount = items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
    const discountAmount = Number(((subtotalAmount * (discountPercent || 0)) / 100).toFixed(2));
    const taxableBase = Math.max(0, subtotalAmount - discountAmount);
    const taxAmount = Number(((taxableBase * (taxRatePercent || 0)) / 100).toFixed(2));
    const totalAmount = Number((taxableBase + taxAmount).toFixed(2));

    return {
      totalHours,
      subtotalAmount,
      discountAmount,
      taxAmount,
      totalAmount,
    };
  }

  async createProposal(data: Omit<CRMProposal, 'id' | 'proposalNumber' | 'createdAt' | 'updatedAt' | 'totalHours' | 'subtotalAmount' | 'discountAmount' | 'taxAmount' | 'totalAmount'> & {
    customNumber?: string;
  }): Promise<CRMProposal> {
    const currentList = await this.getProposals();
    const sequence = currentList.length + 1;
    const year = new Date().getFullYear();
    const proposalNumber = data.customNumber || `PROP-${year}-${String(sequence).padStart(3, '0')}`;

    const calculated = this.calculateTotals(data.items, data.discountPercent, data.taxRatePercent);

    const initialHistoryEntry: ProposalNegotiationEntry = {
      id: `neg-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      version: data.version || 1,
      author: 'Cr. Carlos Rodrigo Domínguez',
      notes: 'Creación de propuesta inicial de servicios contables y dirección financiera.',
      totalAmount: calculated.totalAmount,
      currency: data.currency,
      status: data.status || 'borrador',
    };

    const newProposal: CRMProposal = {
      ...data,
      id: `prop-${Date.now().toString().slice(-6)}`,
      proposalNumber,
      totalHours: calculated.totalHours,
      subtotalAmount: calculated.subtotalAmount,
      discountAmount: calculated.discountAmount,
      taxAmount: calculated.taxAmount,
      totalAmount: calculated.totalAmount,
      negotiationHistory: data.negotiationHistory || [initialHistoryEntry],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProposal, ...currentList];
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }

    // If linked to lead, update lead proposal fields
    if (newProposal.leadId) {
      await dbRepository.updateLead(newProposal.leadId, {
        proposalId: newProposal.id,
        proposalTotal: newProposal.totalAmount,
        proposalStatus: newProposal.status,
        dealValue: newProposal.totalAmount,
      });
    }

    return newProposal;
  }

  async updateProposal(id: string, updates: Partial<CRMProposal>): Promise<CRMProposal> {
    const currentList = await this.getProposals();
    let updatedItem: CRMProposal | null = null;

    const updated = currentList.map((prop) => {
      if (prop.id === id) {
        const mergedItems = updates.items || prop.items;
        const discountPercent = updates.discountPercent !== undefined ? updates.discountPercent : prop.discountPercent;
        const taxRatePercent = updates.taxRatePercent !== undefined ? updates.taxRatePercent : prop.taxRatePercent;
        const calc = this.calculateTotals(mergedItems, discountPercent, taxRatePercent);

        updatedItem = {
          ...prop,
          ...updates,
          items: mergedItems,
          totalHours: calc.totalHours,
          subtotalAmount: calc.subtotalAmount,
          discountAmount: calc.discountAmount,
          taxAmount: calc.taxAmount,
          totalAmount: calc.totalAmount,
          updatedAt: new Date().toISOString(),
        };
        return updatedItem;
      }
      return prop;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }

    if (updatedItem && (updatedItem as CRMProposal).leadId) {
      await dbRepository.updateLead((updatedItem as CRMProposal).leadId!, {
        proposalTotal: (updatedItem as CRMProposal).totalAmount,
        proposalStatus: (updatedItem as CRMProposal).status,
        dealValue: (updatedItem as CRMProposal).totalAmount,
      });
    }

    return updatedItem || currentList[0];
  }

  async deleteProposal(id: string): Promise<void> {
    const currentList = await this.getProposals();
    const target = currentList.find((p) => p.id === id);
    const updated = currentList.filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }

    if (target?.leadId) {
      await dbRepository.updateLead(target.leadId, {
        proposalId: undefined,
        proposalTotal: undefined,
        proposalStatus: undefined,
      });
    }
  }

  /**
   * Reformulate negotiation: increment version, change state to 'en_negociacion',
   * record negotiation notes in history and update pricing/items.
   */
  async reformulateProposal(
    proposalId: string,
    notes: string,
    options?: {
      newItems?: ProposalLineItem[];
      newDiscountPercent?: number;
      newPaymentTerms?: string;
      newScopeSummary?: string;
      newCurrency?: 'ARS' | 'USD';
    }
  ): Promise<CRMProposal> {
    const prop = await this.getProposalById(proposalId);
    if (!prop) throw new Error('Propuesta no encontrada');

    const nextVersion = (prop.version || 1) + 1;
    const items = options?.newItems || prop.items;
    const discountPercent = options?.newDiscountPercent !== undefined ? options.newDiscountPercent : prop.discountPercent;
    const paymentTerms = options?.newPaymentTerms || prop.paymentTerms;
    const scopeSummary = options?.newScopeSummary || prop.scopeSummary;
    const currency = options?.newCurrency || prop.currency;

    const calc = this.calculateTotals(items, discountPercent, prop.taxRatePercent);

    const historyEntry: ProposalNegotiationEntry = {
      id: `neg-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      version: nextVersion,
      author: 'Cr. Carlos Rodrigo Domínguez',
      notes: notes || `Re-formulación de negociación (Versión ${nextVersion}).`,
      totalAmount: calc.totalAmount,
      currency,
      status: 'en_negociacion',
    };

    const updated = await this.updateProposal(proposalId, {
      version: nextVersion,
      status: 'en_negociacion',
      currency,
      items,
      discountPercent,
      paymentTerms,
      scopeSummary,
      negotiationHistory: [historyEntry, ...(prop.negotiationHistory || [])],
    });

    // Also transition lead to 'negociacion' stage if linked
    if (prop.leadId) {
      await dbRepository.updateLeadStage(prop.leadId, 'negociacion');
    }

    return updated;
  }

  /**
   * Send Proposal by Email directly from platform (Resend Service integration)
   */
  async sendProposalByEmail(
    proposalId: string,
    recipientEmail?: string,
    notes?: string
  ): Promise<{ success: boolean; messageId: string }> {
    const prop = await this.getProposalById(proposalId);
    if (!prop) throw new Error('Propuesta no encontrada');

    const emailToSend = recipientEmail || prop.recipientEmail;
    if (!emailToSend) throw new Error('No se definió un correo destinatario');

    const result = await resendService.sendProposalEmail(prop, emailToSend, notes);

    await this.updateProposal(proposalId, {
      status: prop.status === 'borrador' ? 'enviada' : prop.status,
      sentAt: new Date().toISOString(),
    });

    // If lead is in 'nuevo' or 'diagnostico', move to 'propuesta'
    if (prop.leadId) {
      const leads = await dbRepository.getLeads();
      const lead = leads.find((l) => l.id === prop.leadId);
      if (lead && (lead.stage === 'nuevo' || lead.stage === 'diagnostico')) {
        await dbRepository.updateLeadStage(prop.leadId, 'propuesta');
      }
    }

    return { success: true, messageId: result.messageId };
  }

  /**
   * Confirm payment, approve contracted services, and activate client:
   * 1. Proposal marked as 'aprobada_pagada'
   * 2. Lead stage moved to 'activo'
   * 3. Contact status moved to 'cliente_activo'
   * 4. Provisions client user account in userService with login credentials
   * 5. Sends automatic Welcome Email via resendService
   */
  async confirmPaymentAndActivateClient(
    proposalId: string,
    details?: {
      paymentReference?: string;
      notifyMembers?: boolean;
      customPassword?: string;
    }
  ): Promise<{
    proposal: CRMProposal;
    newUser: any;
    emailResult: any;
  }> {
    const prop = await this.getProposalById(proposalId);
    if (!prop) throw new Error('Propuesta no encontrada');

    const now = new Date().toISOString();

    // 1. Update proposal
    const updatedProp = await this.updateProposal(proposalId, {
      status: 'aprobada_pagada',
      paidAt: now,
      activatedAt: now,
      specialTerms: details?.paymentReference 
        ? `${prop.specialTerms || ''}\n[Pago Confirmado]: Ref #${details.paymentReference} - ${new Date().toLocaleDateString('es-AR')}`.trim()
        : prop.specialTerms,
    });

    // 2. Update Lead to 'activo'
    if (prop.leadId) {
      await dbRepository.updateLeadStage(prop.leadId, 'activo');
    }

    // 3. Update Contact to 'cliente_activo'
    let contactCompanyName = prop.companyName;
    let contactType: 'empresa' | 'individual' = 'empresa';
    let contactDepartment = 'Dirección General & Finanzas';

    if (prop.contactId) {
      const contacts = await dbRepository.getContacts();
      const contact = contacts.find((c) => c.id === prop.contactId);
      if (contact) {
        contactCompanyName = contact.companyName || prop.companyName;
        contactType = contact.type || 'empresa';
        await dbRepository.updateContact(prop.contactId, {
          status: 'cliente_activo',
          stage: 'activo',
        });
      }
    }

    // 4. Provision User in userService
    const tempPassword = details?.customPassword || `Patagonia${new Date().getFullYear()}!`;
    const newUser = userService.addUser({
      name: prop.recipientName,
      email: prop.recipientEmail,
      role: 'cliente',
      title: 'Cliente Titular / Director',
      companyName: contactCompanyName,
      phone: prop.recipientPhone,
      department: contactDepartment,
      isActive: true,
    });

    // Contracted services list
    const contractedServicesNames = prop.items.map((i) => i.serviceName);

    // 5. Send Welcome Email with access credentials
    const emailResult = await resendService.sendClientWelcomeEmail({
      name: prop.recipientName,
      email: prop.recipientEmail,
      companyName: contactCompanyName,
      temporaryPassword: tempPassword,
      contractedServices: contractedServicesNames,
      proposalNumber: prop.proposalNumber,
      totalAmount: prop.totalAmount,
      currency: prop.currency,
      isCompany: contactType === 'empresa',
      loginUrl: 'https://crdominguez.ar/portal',
    });

    return {
      proposal: updatedProp,
      newUser,
      emailResult,
    };
  }

  generateWhatsAppProposalMessage(proposal: CRMProposal): string {
    const currencySign = proposal.currency === 'USD' ? 'USD ' : '$ ';
    const itemsList = proposal.items
      .map((it, idx) => `  ${idx + 1}. *${it.serviceName}* (${it.hoursEstimated} hs @ ${currencySign}${it.hourlyRate.toLocaleString('es-AR')}/h)`)
      .join('\n');

    const totalFormatted = `${currencySign}${proposal.totalAmount.toLocaleString('es-AR')}`;

    return `Estimado/a ${proposal.recipientName} (${proposal.companyName}),\n\nLe comparto desde *Cr Dominguez · Consultoría Estratégica & CFO* la propuesta de servicios contables y dirección financiera *#${proposal.proposalNumber}* (Versión ${proposal.version}).\n\n📋 *Alcance y Servicios Incluidos:*\n${itemsList}\n\n⏱ *Horas Totales Estimadas:* ${proposal.totalHours} hs.\n💰 *Honorarios Totales:* *${totalFormatted}* ${proposal.currency}\n📜 *Condiciones:* ${proposal.paymentTerms}\n⏳ *Validez:* ${proposal.validityDays} días corridos.\n\nPuede descargar el dictamen en PDF o consultarnos cualquier ajuste para su análisis en comité.\n\nAtentamente,\n*Cr. Carlos Rodrigo Domínguez*\nSocio Director · Trelew, Chubut\nhttps://crdominguez.ar`;
  }
}

export const proposalService = new ProposalService();
