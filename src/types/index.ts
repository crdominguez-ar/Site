/**
 * Domain types for Cr Dominguez · Consultoría Estratégica & CFO
 * Trelew, Chubut, Patagonia Argentina
 */

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'consultor_staff' 
  | 'auditor_externo' 
  | 'cliente'
  | 'consultant'
  | 'client';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarUrl?: string;
  clientId?: string;
  companyName?: string;
  isActive: boolean;
  lastLogin: string;
  phone?: string;
  department?: string;
}

export interface ResendEmailLog {
  id: string;
  to: string[];
  from: string;
  subject: string;
  type: 'lead_notification' | 'blog_newsletter' | 'report_delivery' | 'ticket_response' | 'system_test' | 'meeting_invite' | 'proposal_delivery' | 'client_welcome';
  status: 'delivered' | 'sent' | 'queued' | 'simulated';
  createdAt: string;
  previewText: string;
  responseId?: string;
}

export interface ResendConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  dailyQuotaUsed: number;
  dailyQuotaMax: number;
  monthlyQuotaUsed: number;
  monthlyQuotaMax: number;
  isVerifiedDomain: boolean;
  isConfigured: boolean;
}

export type WidgetId = 
  | 'crm_pipeline' 
  | 'crm_tasks' 
  | 'seo_health' 
  | 'seo_queries' 
  | 'resend_email' 
  | 'blog_publishing' 
  | 'user_management' 
  | 'financial_kpis';

export interface DashboardWidgetConfig {
  id: WidgetId;
  title: string;
  category: 'negocio' | 'marketing' | 'operaciones' | 'usuarios';
  enabled: boolean;
  order: number;
  width: 'half' | 'full';
}

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

export interface PipelineStageConfig {
  id: LeadStage;
  label: string;
  countColor: string;
  bgBadge: string;
  enabled: boolean;
  order: number;
}

export interface Lead {
  id: string;
  contactId?: string; // Linked CRM contact
  employeeId?: string; // Linked employee inside company contact
  opportunityTitle?: string;
  source?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  vertical: BusinessVertical;
  stage: LeadStage;
  priority: 'alta' | 'media' | 'baja';
  estimatedMonthlyBudgetUsd: number;
  dealValue?: number;
  proposalId?: string;
  proposalTotal?: number;
  proposalStatus?: ProposalStatus;
  revenueRange?: string;
  employeeRange?: string;
  identifiedProblem?: string;
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

export type ContactRelationshipStatus = 'lead' | 'cliente_activo' | 'partner' | 'ex_cliente' | 'proveedor';
export type ContactType = 'empresa' | 'individual';

export type CompanyDepartment = 
  | 'administracion'
  | 'finanzas_pagos'
  | 'logistica_envios'
  | 'direccion_gerencia'
  | 'comercial_ventas'
  | 'legales_compliance'
  | 'operaciones_planta'
  | 'recursos_humanos'
  | 'tecnologia_sistemas'
  | 'otro';

export interface CompanyEmployee {
  id: string;
  name: string;
  department: CompanyDepartment;
  roleTitle: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  isPrimaryContact: boolean;
  notes?: string;
}

export interface CRMContact {
  id: string;
  type: ContactType; // 'empresa' | 'individual'
  name: string; // Contacto principal o titular
  companyName: string; // Razón Social de la empresa o Nombre de fantasía / Estudio (individual)
  cuit?: string;
  roleTitle: string; // Cargo o Profesión
  department?: CompanyDepartment;
  email: string;
  phone: string;
  whatsappNumber: string;
  location: string;
  website?: string;
  vertical: BusinessVertical;
  status: ContactRelationshipStatus;
  leadId?: string; // ID of linked lead in the pipeline
  stage?: LeadStage;
  tags: string[];
  lastContactDate: string;
  notes: string;
  interactionCount: number;
  avatarUrl?: string;
  employees?: CompanyEmployee[]; // Integración de empleados y áreas de la empresa
}

export type MeetingPlatform = 'google_meet' | 'jitsi_meet' | 'zoom' | 'teams' | 'sede_presencial';
export type MeetingType = 'videollamada' | 'presencial' | 'telefonica' | 'comite_cfo' | 'auditoria_franquicia';
export type MeetingStatus = 'programada' | 'en_curso' | 'realizada' | 'cancelada';

export interface CRMMeeting {
  id: string;
  title: string;
  contactId?: string;
  employeeId?: string;
  employeeName?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: MeetingType;
  platform: MeetingPlatform;
  meetingUrl: string;
  status: MeetingStatus;
  description: string;
  notesMinutes?: string; // Minuta de reunión y compromisos
  leadId?: string;
  assignedTo: string;
  reminderSent: boolean;
  createdAt: string;
}

export type BlogCategory = 
  | 'Tributario' 
  | 'Finanzas & CFO' 
  | 'Franquicias' 
  | 'Economía del Conocimiento' 
  | 'Empresas 100% IA';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: string;
  date: string;
  readTime: string;
  featuredImage: string;
  youtubeVideoId?: string;
  videoUrl?: string;
  spotifyEmbedUrl?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
}

export interface SocialLinksConfig {
  linkedin: string;
  youtube: string;
  instagram: string;
  twitterX: string;
  spotify: string;
  whatsapp: string;
  facebook?: string;
  github?: string;
}

export interface AccountingServiceItem {
  id: string;
  code: string;
  name: string;
  category: 'tributaria' | 'cfo_finanzas' | 'franquicias' | 'sociedades_laboral' | 'zhc_tech';
  description: string;
  defaultHourlyRateArs: number;
  defaultHourlyRateUsd: number;
  estimatedDefaultHours: number;
  deliverables: string[];
  normativeFramework?: string;
}

export interface ProposalLineItem {
  id: string;
  serviceId?: string;
  serviceName: string;
  description: string;
  hoursEstimated: number;
  hourlyRate: number; // in proposal currency
  subtotal: number;
}

export type ProposalStatus = 'borrador' | 'enviada' | 'en_negociacion' | 'aprobada_pagada' | 'rechazada';

export interface ProposalNegotiationEntry {
  id: string;
  date: string;
  version: number;
  author: string;
  notes: string;
  totalAmount: number;
  currency: 'ARS' | 'USD';
  status: ProposalStatus;
}

export interface CRMProposal {
  id: string;
  proposalNumber: string; // e.g. "PROP-2026-088"
  leadId?: string;
  contactId?: string;
  employeeId?: string; // Recipient employee if company
  recipientName: string;
  companyName: string;
  recipientEmail: string;
  recipientPhone: string;
  cuit?: string;
  title: string;
  vertical: BusinessVertical;
  currency: 'ARS' | 'USD';
  version: number;
  status: ProposalStatus;
  issueDate: string; // YYYY-MM-DD
  validUntilDate: string; // YYYY-MM-DD
  items: ProposalLineItem[];
  subtotalAmount: number;
  discountPercent: number;
  discountAmount: number;
  taxRatePercent: number; // e.g. 21% or 0
  taxAmount: number;
  totalAmount: number;
  totalHours: number;
  paymentTerms: string;
  validityDays: number;
  scopeSummary: string;
  specialTerms?: string;
  negotiationHistory?: ProposalNegotiationEntry[];
  sentAt?: string;
  paidAt?: string;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

