/**
 * Domain types for Estudio Contable Domínguez & Lambrecht
 * Trelew, Chubut, Patagonia Argentina
 */

export type UserRole = 'admin' | 'consultant' | 'client';

export type BusinessVertical = 
  | 'tradicional_pyme'
  | 'digital_saas'
  | 'franquicias'
  | 'cfo_estrategico'
  | 'ia_zhc';

export interface VerticalMetadata {
  id: BusinessVertical;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  keyAspects: string[];
  deliverables: string[];
  normativeBase: string;
}

export type LeadStage = 'nuevo' | 'diagnostico' | 'propuesta' | 'negociacion' | 'activo';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  vertical: BusinessVertical;
  stage: LeadStage;
  priority: 'alta' | 'media' | 'baja';
  estimatedMonthlyBudgetUsd: number;
  notes: string;
  score: number; // 0 - 100 calculated from diagnostic completeness
  diagnosticData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CRMTask {
  id: string;
  leadId?: string;
  companyName: string;
  title: string;
  dueDate: string;
  priority: 'urgente' | 'normal';
  completed: boolean;
  assignedRole: 'socio' | 'consultor';
  vertical: BusinessVertical;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  cuit: string;
  legalEntity: 'SA' | 'SRL' | 'SAS' | 'Cooperativa' | 'Unipersonal' | 'LLC/Delaware' | 'DAO / On-Chain';
  location: string;
  vertical: BusinessVertical;
  activePlan: 'CFO Fraccional Estratégico' | 'Compliance & Liquidación Digital' | 'Desarrollo de Franquicia' | 'Gobierno ZHC & Tesorería';
  runwayMonths: number;
  monthlyRevenueUsd: number;
  grossMarginPercent: number;
  cfoHoursAllocated: number;
  cfoHoursUsed: number;
  nextFiscalDeadline: string;
  fiscalHealthScore: number;
}

export interface DeliverableReport {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  vertical: BusinessVertical;
  type: 'van_tir' | 'punto_equilibrio' | 'franquicia_ccyc' | 'ddjj_fiscal' | 'zhc_compliance';
  date: string;
  version: string;
  status: 'auditado_firmado' | 'en_analisis' | 'publicado';
  summary: string;
  keyMetrics: { label: string; value: string; variance?: string }[];
  fileSize: string;
  author: string;
}

export interface AdvisoryTicket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  category: 'tributaria' | 'estructuracion' | 'cfo_flujos' | 'divisas_mulc' | 'franquicia_legal';
  priority: 'alta' | 'media';
  status: 'pendiente' | 'en_proceso' | 'resuelto';
  createdAt: string;
  question: string;
  resolution?: string;
  resolvedAt?: string;
  advisorName?: string;
}
