/**
 * Supabase Client Integration with Real RLS Support and Resilient Local Fallback
 * Estudio Contable Domínguez & Lambrecht
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, CRMTask, DeliverableReport, AdvisoryTicket, ClientProfile, LeadStage } from '../types';

const supabaseUrl = 
  (import.meta.env.VITE_SUPABASE_URL as string) || 
  (import.meta.env.SUPABASE_URL as string) || 
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || 
  '';

const supabaseAnonKey = 
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 
  (import.meta.env.SUPABASE_ANON_KEY as string) || 
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || 
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial high-fidelity seed data representing real Patagonian and modern clients
const SEED_CLIENT: ClientProfile = {
  id: 'cli-001',
  companyName: 'Patagonia Cloud Software SAS',
  cuit: '30-71894520-4',
  legalEntity: 'SAS',
  location: 'Trelew, Chubut',
  vertical: 'digital_saas',
  activePlan: 'Compliance & Liquidación Digital',
  runwayMonths: 18.5,
  monthlyRevenueUsd: 48500,
  grossMarginPercent: 78.4,
  cfoHoursAllocated: 12,
  cfoHoursUsed: 7.5,
  nextFiscalDeadline: '15 Nov 2026 (F. 2002 IVA & Retenciones)',
  fiscalHealthScore: 96,
};

const SEED_LEADS: Lead[] = [
  {
    id: 'lead-101',
    companyName: 'Cooperativa Lanera Patagónica',
    contactName: 'Ing. Marcos Vallejos',
    email: 'm.vallejos@lanapatagonica.com.ar',
    phone: '+54 280 442-8812',
    location: 'Trelew, Parque Industrial',
    vertical: 'tradicional_pyme',
    stage: 'negociacion',
    priority: 'alta',
    estimatedMonthlyBudgetUsd: 1400,
    score: 92,
    notes: 'Reestructuración de costos de producción y determinación de punto de equilibrio para nueva línea de peinado.',
    createdAt: '2026-10-18T14:30:00Z',
    updatedAt: '2026-10-24T11:20:00Z',
  },
  {
    id: 'lead-102',
    companyName: 'Patagonia Data Engine',
    contactName: 'Lucía Fernández',
    email: 'lucia@patagoniadata.io',
    phone: '+54 9 280 465-9011',
    location: 'Puerto Madryn / Remoto',
    vertical: 'digital_saas',
    stage: 'propuesta',
    priority: 'alta',
    estimatedMonthlyBudgetUsd: 1800,
    score: 88,
    notes: 'Exportación de servicios de analítica de datos. Necesitan optimizar encuadre de Factura E y régimen cambiario.',
    createdAt: '2026-10-21T09:15:00Z',
    updatedAt: '2026-10-25T16:00:00Z',
  },
  {
    id: 'lead-103',
    companyName: 'Franquicias Dulces del Valle',
    contactName: 'Esteban Domínguez Rossi',
    email: 'esteban@dulcesdelvalle.com.ar',
    phone: '+54 280 448-1200',
    location: 'Gaiman / Trelew',
    vertical: 'franquicias',
    stage: 'diagnostico',
    priority: 'media',
    estimatedMonthlyBudgetUsd: 2200,
    score: 79,
    notes: 'Evaluación precontractual y redacción de Circular de Oferta de Franquicia según Ley CCyC art. 1512-1524.',
    createdAt: '2026-10-23T16:45:00Z',
    updatedAt: '2026-10-25T18:30:00Z',
  },
  {
    id: 'lead-104',
    companyName: 'AeroDrone Logistics ZHC',
    contactName: 'Agent Lead / Nicolás Braun',
    email: 'governance@aerodrone.ai',
    phone: '+54 9 11 5092-4411',
    location: 'Trelew Tech Hub / On-Chain',
    vertical: 'ia_zhc',
    stage: 'nuevo',
    priority: 'alta',
    estimatedMonthlyBudgetUsd: 3100,
    score: 95,
    notes: 'Zero-Human Company con 4 agentes autónomos y tesorería en USDC. Requieren encuadre normativo y cálculo de costos de inferencia.',
    createdAt: '2026-10-26T10:10:00Z',
    updatedAt: '2026-10-26T10:10:00Z',
  },
  {
    id: 'lead-105',
    companyName: 'Pesquera San Carlos SRL',
    contactName: 'Carlos San Martín',
    email: 'csanmartin@pesquerasancarlos.com.ar',
    phone: '+54 280 445-3390',
    location: 'Rawson / Trelew',
    vertical: 'cfo_estrategico',
    stage: 'activo',
    priority: 'alta',
    estimatedMonthlyBudgetUsd: 2500,
    score: 98,
    notes: 'Contratado servicio de CFO a tiempo parcial con tablero de control de cash flow a 12 meses y análisis VAN/TIR de nueva bodega.',
    createdAt: '2026-09-12T08:00:00Z',
    updatedAt: '2026-10-20T14:10:00Z',
  },
];

const SEED_TASKS: CRMTask[] = [
  {
    id: 'task-01',
    leadId: 'lead-103',
    companyName: 'Franquicias Dulces del Valle',
    title: 'Auditar Circular de Oferta de Franquicia (COF art. 1514 CCyC)',
    dueDate: '28 Oct 2026',
    priority: 'urgente',
    completed: false,
    assignedRole: 'socio',
    vertical: 'franquicias',
  },
  {
    id: 'task-02',
    leadId: 'lead-102',
    companyName: 'Patagonia Data Engine',
    title: 'Modelar esquema de liquidación de divisas MULC vs MEP corporativo',
    dueDate: '30 Oct 2026',
    priority: 'normal',
    completed: false,
    assignedRole: 'consultor',
    vertical: 'digital_saas',
  },
  {
    id: 'task-03',
    leadId: 'lead-104',
    companyName: 'AeroDrone Logistics ZHC',
    title: 'Dictamen de personería tributaria y costos de API multi-agente',
    dueDate: '02 Nov 2026',
    priority: 'urgente',
    completed: false,
    assignedRole: 'socio',
    vertical: 'ia_zhc',
  },
  {
    id: 'task-04',
    leadId: 'lead-101',
    companyName: 'Cooperativa Lanera Patagónica',
    title: 'Validación de planilla de costos fijos y punto de equilibrio',
    dueDate: '25 Oct 2026',
    priority: 'normal',
    completed: true,
    assignedRole: 'consultor',
    vertical: 'tradicional_pyme',
  },
];

const SEED_REPORTS: DeliverableReport[] = [
  {
    id: 'rep-301',
    title: 'Evaluación Precontractual de Franquicia & Ratio de Recupero (CCyC)',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    vertical: 'franquicias',
    type: 'franquicia_ccyc',
    date: '24 Oct 2026',
    version: 'v2.1 Final Auditado',
    status: 'auditado_firmado',
    summary: 'Auditoría jurídica-financiera del contrato según Artículos 1512 a 1524 del Código Civil y Comercial. Se detectó cláusula de no competencia abusiva y se recalculó el Payback a 19 meses.',
    keyMetrics: [
      { label: 'Payback Est.', value: '19.2 meses', variance: '-4 meses vs propuesta' },
      { label: 'TIR Estimada', value: '34.8% anual' },
      { label: 'Cumplimiento COF', value: '9/10 ítems CCyC' },
    ],
    fileSize: '2.4 MB (PDF Firmado)',
    author: 'Cr. Carlos Rodrigo Domínguez',
  },
  {
    id: 'rep-302',
    title: 'Tablero de Control CFO: Presupuesto Financiero 12 Meses & VAN/TIR',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    vertical: 'cfo_estrategico',
    type: 'van_tir',
    date: '18 Oct 2026',
    version: 'v1.4 Q4-2026',
    status: 'auditado_firmado',
    summary: 'Simulación de flujo de fondos descontados a tasa WACC 14.5%. Runway asegurado para 18 meses con reinversión de utilidades.',
    keyMetrics: [
      { label: 'VAN (NPV)', value: 'USD 142,500' },
      { label: 'TIR Proyectada', value: '41.2%' },
      { label: 'Runway Actual', value: '18.5 meses' },
    ],
    fileSize: '3.8 MB (Reporte + Modelo XLS)',
    author: 'Cr. Carlos Rodrigo Domínguez',
  },
  {
    id: 'rep-303',
    title: 'Informe Técnico de Costos Reales & Punto de Equilibrio Operativo',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    vertical: 'tradicional_pyme',
    type: 'punto_equilibrio',
    date: '05 Oct 2026',
    version: 'v1.0 Aprobado',
    status: 'publicado',
    summary: 'Determinación de umbral de rentabilidad por unidad de negocio. Margen de contribución ponderado optimizado en 8.2 puntos porcentuales.',
    keyMetrics: [
      { label: 'Punto Equilibrio', value: 'USD 22,400 / mes' },
      { label: 'Margen Contribución', value: '54.2%' },
      { label: 'Costo Fijo Absorbido', value: '100%' },
    ],
    fileSize: '1.9 MB (PDF)',
    author: 'Equipo Consultor D&L',
  },
  {
    id: 'rep-304',
    title: 'Dictamen de Compliance ZHC: Bucles de Agentes y Tesorería On-Chain',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    vertical: 'ia_zhc',
    type: 'zhc_compliance',
    date: '28 Sep 2026',
    version: 'v1.2 Vigente',
    status: 'auditado_firmado',
    summary: 'Encuadre normativo para empresas sin personal humano bajo legislación nacional e internacional. Tratamiento de gastos de LLM API y conciliación contable de wallets corporativas.',
    keyMetrics: [
      { label: 'Agentes Auditados', value: '4 Bucles' },
      { label: 'Eficiencia Costo API', value: '-38% vs Nómina' },
      { label: 'Riesgo Fiscal', value: 'Mitigado Nivel A' },
    ],
    fileSize: '4.1 MB (Whitepaper Legal-Tributario)',
    author: 'Cr. Carlos Rodrigo Domínguez',
  },
];

const SEED_TICKETS: AdvisoryTicket[] = [
  {
    id: 'tkt-201',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    subject: 'Liquidación de Factura E por USD 18,500 en Banco Chubut',
    category: 'divisas_mulc',
    priority: 'alta',
    status: 'resuelto',
    createdAt: '2026-10-22T10:00:00Z',
    question: 'Emitimos Factura E a cliente en California. ¿Cuál es el plazo estricto de liquidación en el mercado libre de cambios y qué documentación de afectación se requiere?',
    resolution: 'Dispones de 5 días hábiles desde la acreditación en la cuenta corresponsal para liquidar o ingresar bajo el régimen de exención de servicios basados en conocimiento. Se adjuntó la minuta para el oficial de comercio exterior del banco.',
    resolvedAt: '2026-10-22T14:30:00Z',
    advisorName: 'Cr. Carlos Rodrigo Domínguez',
  },
  {
    id: 'tkt-202',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    subject: 'Consulta sobre deducibilidad de tokens y créditos OpenAI / Anthropic',
    category: 'tributaria',
    priority: 'media',
    status: 'resuelto',
    createdAt: '2026-10-24T16:20:00Z',
    question: '¿Los cargos con tarjeta corporativa en el exterior por consumo de API de inferencia computan como gasto operativo deducible de Ganancias?',
    resolution: 'Sí, encuadran como gastos necesarios para la obtención de la ganancia gravada (Art. 83 LIG). Se deben retener los impuestos a los sellos locales de Chubut y verificar la imputación de percepciones RG AFIP.',
    resolvedAt: '2026-10-25T11:00:00Z',
    advisorName: 'Cr. Carlos Rodrigo Domínguez',
  },
  {
    id: 'tkt-203',
    clientId: 'cli-001',
    clientName: 'Patagonia Cloud Software SAS',
    subject: 'Ajuste de presupuesto financiero Q1-2027 ante variaciones de tipo de cambio',
    category: 'cfo_flujos',
    priority: 'alta',
    status: 'en_proceso',
    createdAt: '2026-10-26T08:45:00Z',
    question: 'Solicitamos corrida de sensibilidad del modelo de cash flow considerando un desdoblamiento de costos de infraestructura en dólares y salarios en pesos ajustados por IPC Patagonia.',
    advisorName: 'Cr. Carlos Rodrigo Domínguez',
  },
];

// Persistent state management using LocalStorage with fallback
class DataRepository {
  private leadsKey = 'dl_consulting_leads';
  private tasksKey = 'dl_consulting_tasks';
  private reportsKey = 'dl_consulting_reports';
  private ticketsKey = 'dl_consulting_tickets';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(this.leadsKey)) {
      localStorage.setItem(this.leadsKey, JSON.stringify(SEED_LEADS));
    }
    if (!localStorage.getItem(this.tasksKey)) {
      localStorage.setItem(this.tasksKey, JSON.stringify(SEED_TASKS));
    }
    if (!localStorage.getItem(this.reportsKey)) {
      localStorage.setItem(this.reportsKey, JSON.stringify(SEED_REPORTS));
    }
    if (!localStorage.getItem(this.ticketsKey)) {
      localStorage.setItem(this.ticketsKey, JSON.stringify(SEED_TICKETS));
    }
  }

  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Lead[];
    }
    const local = localStorage.getItem(this.leadsKey);
    return local ? JSON.parse(local) : SEED_LEADS;
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').insert([newLead]);
      } catch (e) {
        console.warn('Supabase insert fallback to local storage', e);
      }
    }

    const current = await this.getLeads();
    const updated = [newLead, ...current];
    localStorage.setItem(this.leadsKey, JSON.stringify(updated));
    return newLead;
  }

  async updateLeadStage(leadId: string, stage: LeadStage): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').update({ stage, updated_at: new Date().toISOString() }).eq('id', leadId);
      } catch (e) {
        console.warn('Supabase update fallback', e);
      }
    }
    const current = await this.getLeads();
    const updated = current.map((l) => (l.id === leadId ? { ...l, stage, updatedAt: new Date().toISOString() } : l));
    localStorage.setItem(this.leadsKey, JSON.stringify(updated));
  }

  async getTasks(): Promise<CRMTask[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('crm_tasks').select('*');
      if (!error && data && data.length > 0) return data as CRMTask[];
    }
    const local = localStorage.getItem(this.tasksKey);
    return local ? JSON.parse(local) : SEED_TASKS;
  }

  async toggleTask(taskId: string): Promise<void> {
    const current = await this.getTasks();
    const updated = current.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    localStorage.setItem(this.tasksKey, JSON.stringify(updated));
  }

  async addTask(task: Omit<CRMTask, 'id'>): Promise<CRMTask> {
    const newTask: CRMTask = {
      ...task,
      id: `task-${Date.now().toString().slice(-4)}`,
    };
    const current = await this.getTasks();
    const updated = [newTask, ...current];
    localStorage.setItem(this.tasksKey, JSON.stringify(updated));
    return newTask;
  }

  async getReports(): Promise<DeliverableReport[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('deliverable_reports').select('*');
      if (!error && data && data.length > 0) return data as DeliverableReport[];
    }
    const local = localStorage.getItem(this.reportsKey);
    return local ? JSON.parse(local) : SEED_REPORTS;
  }

  async getTickets(): Promise<AdvisoryTicket[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('advisory_tickets').select('*');
      if (!error && data && data.length > 0) return data as AdvisoryTicket[];
    }
    const local = localStorage.getItem(this.ticketsKey);
    return local ? JSON.parse(local) : SEED_TICKETS;
  }

  async createTicket(ticket: Omit<AdvisoryTicket, 'id' | 'createdAt' | 'status'>): Promise<AdvisoryTicket> {
    const newTicket: AdvisoryTicket = {
      ...ticket,
      id: `tkt-${Date.now().toString().slice(-4)}`,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      advisorName: 'Cr. Carlos Rodrigo Domínguez',
    };
    const current = await this.getTickets();
    const updated = [newTicket, ...current];
    localStorage.setItem(this.ticketsKey, JSON.stringify(updated));
    return newTicket;
  }

  getClientProfile(): ClientProfile {
    return SEED_CLIENT;
  }
}

export const dbRepository = new DataRepository();
