/**
 * Supabase Client Integration with Real RLS Support and Resilient Local Fallback
 * Cr Dominguez · Consultoría Estratégica & CFO
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, CRMTask, DeliverableReport, AdvisoryTicket, ClientProfile, LeadStage, CRMContact, CRMMeeting, CompanyEmployee } from '../types';

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
    contactId: 'contact-101',
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
    contactId: 'contact-102',
    companyName: 'Patagonia Data Engine',
    contactName: 'Lic. Lucía Fernández',
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
    contactId: 'contact-103',
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
    contactId: 'contact-104',
    companyName: 'AeroDrone Logistics ZHC',
    contactName: 'Nicolás Braun',
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
    contactId: 'contact-105',
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
    author: 'Equipo Consultor Cr Dominguez',
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

export const SEED_CONTACTS: CRMContact[] = [
  {
    id: 'contact-101',
    type: 'empresa',
    name: 'Ing. Marcos Vallejos',
    companyName: 'Cooperativa Lanera Patagónica',
    cuit: '30-65239104-7',
    roleTitle: 'Director Operativo & Planta',
    email: 'm.vallejos@lanapatagonica.com.ar',
    phone: '+54 280 442-8812',
    whatsappNumber: '5492804428812',
    location: 'Trelew, Parque Industrial',
    vertical: 'tradicional_pyme',
    status: 'lead',
    leadId: 'lead-101',
    stage: 'negociacion',
    tags: ['Lana & Peinado', 'Costos Fijos', 'Parque Industrial Trelew'],
    lastContactDate: '2026-10-24T11:20:00Z',
    notes: 'Reunión acordada para validar margen de contribución. Enviar propuesta económica de honorarios de auditoría.',
    interactionCount: 6,
    employees: [
      {
        id: 'emp-101-1',
        name: 'Ing. Marcos Vallejos',
        department: 'direccion_gerencia',
        roleTitle: 'Director Operativo & Planta',
        email: 'm.vallejos@lanapatagonica.com.ar',
        phone: '+54 280 442-8812',
        whatsappNumber: '5492804428812',
        isPrimaryContact: true,
        notes: 'Decisor principal técnico y de planta.'
      },
      {
        id: 'emp-101-2',
        name: 'Cra. Silvina Barrientos',
        department: 'administracion',
        roleTitle: 'Jefa de Administración & Liquidaciones',
        email: 'silvina.admi@lanapatagonica.com.ar',
        phone: '+54 280 443-1090',
        whatsappNumber: '5492804551122',
        isPrimaryContact: false,
        notes: 'Maneja el sistema contable y planillas de costos del personal de fábrica.'
      },
      {
        id: 'emp-101-3',
        name: 'Pablo Antieco',
        department: 'logistica_envios',
        roleTitle: 'Coordinador de Envíos & Depósito Parque Industrial',
        email: 'pablo.logistica@lanapatagonica.com.ar',
        phone: '+54 280 442-8815',
        whatsappNumber: '5492804337788',
        isPrimaryContact: false,
        notes: 'Responsable de remitos y fletes a Puerto Madryn.'
      },
      {
        id: 'emp-101-4',
        name: 'Romina Beltrán',
        department: 'finanzas_pagos',
        roleTitle: 'Tesorería & Cuentas a Pagar',
        email: 'pagos@lanapatagonica.com.ar',
        phone: '+54 280 443-1092',
        whatsappNumber: '5492804992211',
        isPrimaryContact: false,
        notes: 'Gestión de cheques diferidos, banco y pagos a productores.'
      }
    ]
  },
  {
    id: 'contact-102',
    type: 'empresa',
    name: 'Lic. Lucía Fernández',
    companyName: 'Patagonia Data Engine',
    cuit: '30-71789230-9',
    roleTitle: 'Co-Founder & Head of Growth',
    email: 'lucia@patagoniadata.io',
    phone: '+54 9 280 465-9011',
    whatsappNumber: '5492804659011',
    location: 'Puerto Madryn / Remoto',
    vertical: 'digital_saas',
    status: 'lead',
    leadId: 'lead-102',
    stage: 'propuesta',
    tags: ['SaaS Export', 'Factura E', 'MULC vs MEP'],
    lastContactDate: '2026-10-25T16:00:00Z',
    notes: 'Requiere videollamada para repasar esquema cambiario de exportación de servicios y plan CFO.',
    interactionCount: 9,
    employees: [
      {
        id: 'emp-102-1',
        name: 'Lic. Lucía Fernández',
        department: 'direccion_gerencia',
        roleTitle: 'Co-Founder & Head of Growth',
        email: 'lucia@patagoniadata.io',
        phone: '+54 9 280 465-9011',
        whatsappNumber: '5492804659011',
        isPrimaryContact: true,
        notes: 'Lidera la contratación de servicios profesionales y expansión comercial.'
      },
      {
        id: 'emp-102-2',
        name: 'Matías Kogan',
        department: 'tecnologia_sistemas',
        roleTitle: 'VP of Engineering & Cloud Infrastructure',
        email: 'matias@patagoniadata.io',
        phone: '+54 9 11 4099-3322',
        whatsappNumber: '5491140993322',
        isPrimaryContact: false,
        notes: 'A cargo de las APIs y costos de infraestructura AWS.'
      },
      {
        id: 'emp-102-3',
        name: 'Laura Giménez',
        department: 'finanzas_pagos',
        roleTitle: 'Billing & Facturación Internacional',
        email: 'billing@patagoniadata.io',
        phone: '+54 9 280 488-3344',
        whatsappNumber: '5492804883344',
        isPrimaryContact: false,
        notes: 'Coordinación de Factura E y cobros Stripe.'
      }
    ]
  },
  {
    id: 'contact-103',
    type: 'empresa',
    name: 'Esteban Domínguez Rossi',
    companyName: 'Franquicias Dulces del Valle',
    cuit: '30-70984421-3',
    roleTitle: 'Gerente General de Expansión',
    email: 'esteban@dulcesdelvalle.com.ar',
    phone: '+54 280 448-1200',
    whatsappNumber: '5492804481200',
    location: 'Gaiman / Trelew, Chubut',
    vertical: 'franquicias',
    status: 'lead',
    leadId: 'lead-103',
    stage: 'diagnostico',
    tags: ['Franquicias', 'Circular Oferta', 'Art. 1514 CCyC'],
    lastContactDate: '2026-10-25T18:30:00Z',
    notes: 'Revisando Circular de Oferta de Franquicia. Coordinamos auditoría de cláusulas abusivas.',
    interactionCount: 4,
    employees: [
      {
        id: 'emp-103-1',
        name: 'Esteban Domínguez Rossi',
        department: 'direccion_gerencia',
        roleTitle: 'Gerente General de Expansión',
        email: 'esteban@dulcesdelvalle.com.ar',
        phone: '+54 280 448-1200',
        whatsappNumber: '5492804481200',
        isPrimaryContact: true,
        notes: 'Interlocutor clave en la estructura de franquicias.'
      },
      {
        id: 'emp-103-2',
        name: 'Marina Hughes',
        department: 'legales_compliance',
        roleTitle: 'Auditora de Contratos & COF',
        email: 'marina.legales@dulcesdelvalle.com.ar',
        phone: '+54 280 448-1205',
        whatsappNumber: '5492804665511',
        isPrimaryContact: false,
        notes: 'Intercambio jurídico con Estudio Quintana.'
      },
      {
        id: 'emp-103-3',
        name: 'Gabriel Jones',
        department: 'logistica_envios',
        roleTitle: 'Coordinador de Despacho & Abastecimiento a Locales',
        email: 'distribucion@dulcesdelvalle.com.ar',
        phone: '+54 280 448-1210',
        whatsappNumber: '5492804771199',
        isPrimaryContact: false,
        notes: 'Logística de productos refrigerados y packaging.'
      }
    ]
  },
  {
    id: 'contact-104',
    type: 'empresa',
    name: 'Nicolás Braun',
    companyName: 'AeroDrone Logistics ZHC',
    cuit: '30-71954302-8',
    roleTitle: 'Representante Legal & Lead Arch.',
    email: 'governance@aerodrone.ai',
    phone: '+54 9 11 5092-4411',
    whatsappNumber: '5491150924411',
    location: 'Trelew Tech Hub / Remoto',
    vertical: 'ia_zhc',
    status: 'lead',
    leadId: 'lead-104',
    stage: 'nuevo',
    tags: ['Zero-Human Co.', 'Agentes IA', 'USDC Treasury'],
    lastContactDate: '2026-10-26T10:10:00Z',
    notes: 'Startup operada por IA. Requieren dictamen sobre deducibilidad de API tokens y encuadre SAS.',
    interactionCount: 3,
    employees: [
      {
        id: 'emp-104-1',
        name: 'Nicolás Braun',
        department: 'direccion_gerencia',
        roleTitle: 'Representante Legal & Gobernanza',
        email: 'governance@aerodrone.ai',
        phone: '+54 9 11 5092-4411',
        whatsappNumber: '5491150924411',
        isPrimaryContact: true,
        notes: 'Firma y personería jurídica de la SAS.'
      },
      {
        id: 'emp-104-2',
        name: 'Bucle Despacho Daemon-1',
        department: 'operaciones_planta',
        roleTitle: 'Agente Autónomo de Ruteo & Baterías',
        email: 'fleet-ops@aerodrone.ai',
        phone: '+54 9 11 5092-4411',
        whatsappNumber: '5491150924411',
        isPrimaryContact: false,
        notes: 'Monitoreo de gas fees y consumo de API LLM.'
      }
    ]
  },
  {
    id: 'contact-105',
    type: 'empresa',
    name: 'Carlos San Martín',
    companyName: 'Pesquera San Carlos SRL',
    cuit: '30-68192341-2',
    roleTitle: 'Director General',
    email: 'csanmartin@pesquerasancarlos.com.ar',
    phone: '+54 280 445-3390',
    whatsappNumber: '5492804453390',
    location: 'Puerto Rawson / Trelew',
    vertical: 'cfo_estrategico',
    status: 'cliente_activo',
    leadId: 'lead-105',
    stage: 'activo',
    tags: ['Pesca & Frigorífico', 'CFO Externo', 'Flujo 12M'],
    lastContactDate: '2026-10-26T14:10:00Z',
    notes: 'Cliente activo con abono CFO mensual. Comité directivo programado para análisis de inversión en cámaras.',
    interactionCount: 18,
    employees: [
      {
        id: 'emp-105-1',
        name: 'Carlos San Martín',
        department: 'direccion_gerencia',
        roleTitle: 'Director General',
        email: 'csanmartin@pesquerasancarlos.com.ar',
        phone: '+54 280 445-3390',
        whatsappNumber: '5492804453390',
        isPrimaryContact: true,
        notes: 'Participa de los comités mensuales de dirección con el Cr. Rodrigo Domínguez.'
      },
      {
        id: 'emp-105-2',
        name: 'Lic. Hernán Pereyra',
        department: 'administracion',
        roleTitle: 'Gerente Administrativo & Compras',
        email: 'hpereyra@pesquerasancarlos.com.ar',
        phone: '+54 280 445-3394',
        whatsappNumber: '5492804123456',
        isPrimaryContact: false,
        notes: 'Coordinación de facturas de combustible para buques y proveedores navales.'
      },
      {
        id: 'emp-105-3',
        name: 'Claudia Morán',
        department: 'finanzas_pagos',
        roleTitle: 'Responsable de Tesorería & Pagos',
        email: 'tesoreria@pesquerasancarlos.com.ar',
        phone: '+54 280 445-3398',
        whatsappNumber: '5492804654321',
        isPrimaryContact: false,
        notes: 'Conciliaciones bancarias y seguimiento de descubiertos.'
      }
    ]
  },
  {
    id: 'contact-106',
    type: 'individual',
    name: 'Dra. Valeria Quintana',
    companyName: 'Estudio Quintana & Asociados',
    cuit: '27-29381024-5',
    roleTitle: 'Socia Directora & Asesora Legal Externa',
    department: 'legales_compliance',
    email: 'valeria@quintanalegal.com.ar',
    phone: '+54 9 280 411-9988',
    whatsappNumber: '5492804119988',
    location: 'Trelew, Chubut',
    vertical: 'franquicias',
    status: 'partner',
    tags: ['Derecho Corporativo', 'Contratos Franquicia', 'Socio Estratégico'],
    lastContactDate: '2026-10-22T17:00:00Z',
    notes: 'Partner legal para dictámenes cruzados y arbitraje comercial en Chubut.',
    interactionCount: 12,
  },
  {
    id: 'contact-107',
    type: 'individual',
    name: 'Dr. Marcelo E. Roberts',
    companyName: 'Roberts Consultores Tributarios',
    cuit: '20-22194830-4',
    roleTitle: 'Especialista Fiscal & Perito',
    department: 'administracion',
    email: 'marcelo@robertsconsultores.ar',
    phone: '+54 9 280 455-7722',
    whatsappNumber: '5492804557722',
    location: 'Comodoro Rivadavia / Remoto',
    vertical: 'cfo_estrategico',
    status: 'partner',
    tags: ['Tributario', 'Recupero IVA', 'Ley I-26 Chubut'],
    lastContactDate: '2026-10-20T11:00:00Z',
    notes: 'Convenio de colaboración para peritajes contables y fiscalidad de hidrocarburos.',
    interactionCount: 7,
  },
];

export const SEED_MEETINGS: CRMMeeting[] = [
  {
    id: 'meet-01',
    title: 'Comité de Dirección CFO: Plan Financiero Q4 & Flujo 12 Meses',
    contactId: 'contact-105',
    contactName: 'Carlos San Martín',
    contactEmail: 'csanmartin@pesquerasancarlos.com.ar',
    contactPhone: '+54 280 445-3390',
    companyName: 'Pesquera San Carlos SRL',
    date: '2026-10-29',
    startTime: '10:00',
    endTime: '11:30',
    type: 'comite_cfo',
    platform: 'google_meet',
    meetingUrl: 'https://meet.google.com/cr-dominguez-cfo',
    status: 'programada',
    description: 'Revisión mensual del tablero CFO: análisis de desvíos presupuestarios, cobranzas en moneda extranjera y asignación de fondos para la nueva bodega de Rawson.',
    notesMinutes: 'Minuta preliminar: verificar evolución de costos de combustible y tipo de cambio oficial.',
    leadId: 'lead-105',
    assignedTo: 'Cr. Carlos Rodrigo Domínguez',
    reminderSent: true,
    createdAt: '2026-10-26T14:00:00Z',
  },
  {
    id: 'meet-02',
    title: 'Videollamada Técnica: Encuadre Factura E & Desembolsos MULC',
    contactId: 'contact-102',
    contactName: 'Lic. Lucía Fernández',
    contactEmail: 'lucia@patagoniadata.io',
    contactPhone: '+54 9 280 465-9011',
    companyName: 'Patagonia Data Engine',
    date: '2026-10-30',
    startTime: '15:00',
    endTime: '16:00',
    type: 'videollamada',
    platform: 'jitsi_meet',
    meetingUrl: 'https://meet.jit.si/CrDominguez-PatagoniaData',
    status: 'programada',
    description: 'Sesión remota para coordinar el ingreso de divisas de clientes estadounidenses bajo el cupo de USD 36.000 anuales de servicios basados en el conocimiento.',
    notesMinutes: 'Presentar simulación de ahorro impositivo en Factura E.',
    leadId: 'lead-102',
    assignedTo: 'Cr. Carlos Rodrigo Domínguez',
    reminderSent: false,
    createdAt: '2026-10-26T16:30:00Z',
  },
  {
    id: 'meet-03',
    title: 'Auditoría Jurídico-Contable Circular de Oferta de Franquicia',
    contactId: 'contact-103',
    contactName: 'Esteban Domínguez Rossi',
    contactEmail: 'esteban@dulcesdelvalle.com.ar',
    contactPhone: '+54 280 448-1200',
    companyName: 'Franquicias Dulces del Valle',
    date: '2026-11-02',
    startTime: '11:00',
    endTime: '12:30',
    type: 'auditoria_franquicia',
    platform: 'google_meet',
    meetingUrl: 'https://meet.google.com/cr-franquicias-valle',
    status: 'programada',
    description: 'Revisión cláusula por cláusula de la COF según Art. 1514 CCyC: canon inicial, royalties, fondo de publicidad y delimitación territorial en el VIRCh.',
    leadId: 'lead-103',
    assignedTo: 'Cr. Carlos Rodrigo Domínguez',
    reminderSent: false,
    createdAt: '2026-10-27T09:15:00Z',
  },
  {
    id: 'meet-04',
    title: 'Mesa de Trabajo: Estructuración Tributaria & Bucles ZHC',
    contactId: 'contact-104',
    contactName: 'Nicolás Braun',
    contactEmail: 'governance@aerodrone.ai',
    contactPhone: '+54 9 11 5092-4411',
    companyName: 'AeroDrone Logistics ZHC',
    date: '2026-11-04',
    startTime: '16:30',
    endTime: '17:30',
    type: 'videollamada',
    platform: 'jitsi_meet',
    meetingUrl: 'https://meet.jit.si/CrDominguez-AeroDroneZHC',
    status: 'programada',
    description: 'Primer encuentro con el equipo de gobierno del proyecto de logística autónoma para formalizar SAS unipersonal y encuadre de facturación automatizada.',
    leadId: 'lead-104',
    assignedTo: 'Cr. Carlos Rodrigo Domínguez',
    reminderSent: false,
    createdAt: '2026-10-27T11:00:00Z',
  },
];

// Persistent state management using LocalStorage with fallback
class DataRepository {
  private leadsKey = 'dl_consulting_leads';
  private tasksKey = 'dl_consulting_tasks';
  private reportsKey = 'dl_consulting_reports';
  private ticketsKey = 'dl_consulting_tickets';
  private contactsKey = 'cr_crm_contacts';
  private meetingsKey = 'cr_crm_meetings';

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
    if (!localStorage.getItem(this.contactsKey)) {
      localStorage.setItem(this.contactsKey, JSON.stringify(SEED_CONTACTS));
    }
    if (!localStorage.getItem(this.meetingsKey)) {
      localStorage.setItem(this.meetingsKey, JSON.stringify(SEED_MEETINGS));
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
    await this.updateLead(leadId, { stage });
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', leadId);
      } catch (e) {
        console.warn('Supabase update fallback', e);
      }
    }
    const current = await this.getLeads();
    let updatedLead: Lead | null = null;
    const updated = current.map((l) => {
      if (l.id === leadId) {
        updatedLead = { ...l, ...updates, updatedAt: new Date().toISOString() };
        return updatedLead;
      }
      return l;
    });
    localStorage.setItem(this.leadsKey, JSON.stringify(updated));
    return updatedLead || current[0];
  }

  async deleteLead(leadId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').delete().eq('id', leadId);
      } catch (e) {
        console.warn('Supabase delete fallback', e);
      }
    }
    const current = await this.getLeads();
    const updated = current.filter((l) => l.id !== leadId);
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

  async toggleTaskCompletion(taskId: string): Promise<void> {
    return this.toggleTask(taskId);
  }

  async updateTask(taskId: string, updates: Partial<CRMTask>): Promise<CRMTask> {
    const current = await this.getTasks();
    let updatedTask: CRMTask | null = null;
    const updated = current.map((t) => {
      if (t.id === taskId) {
        updatedTask = { ...t, ...updates };
        return updatedTask;
      }
      return t;
    });
    localStorage.setItem(this.tasksKey, JSON.stringify(updated));
    return updatedTask || current[0];
  }

  async deleteTask(taskId: string): Promise<void> {
    const current = await this.getTasks();
    const updated = current.filter((t) => t.id !== taskId);
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

  async createTask(task: Partial<CRMTask> & { title: string; companyName: string }): Promise<CRMTask> {
    return this.addTask({
      title: task.title,
      companyName: task.companyName,
      dueDate: task.dueDate || 'En 48 hs',
      priority: task.priority || 'normal',
      completed: false,
      assignedRole: (task.assignedRole as any) || 'socio',
      vertical: task.vertical || 'cfo_estrategico',
    });
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

  // CRM Contacts Directory
  async getContacts(): Promise<CRMContact[]> {
    if (typeof window === 'undefined') return SEED_CONTACTS;
    const local = localStorage.getItem(this.contactsKey);
    return local ? JSON.parse(local) : SEED_CONTACTS;
  }

  async createContact(contactData: Omit<CRMContact, 'id' | 'lastContactDate' | 'interactionCount'>): Promise<CRMContact> {
    const newContact: CRMContact = {
      ...contactData,
      id: `contact-${Date.now().toString().slice(-4)}`,
      lastContactDate: new Date().toISOString(),
      interactionCount: 1,
    };
    const current = await this.getContacts();
    const updated = [newContact, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.contactsKey, JSON.stringify(updated));
    }
    return newContact;
  }

  async updateContact(contactId: string, updates: Partial<CRMContact>): Promise<CRMContact> {
    const current = await this.getContacts();
    let updatedContact: CRMContact | null = null;
    const updated = current.map((c) => {
      if (c.id === contactId) {
        updatedContact = { ...c, ...updates };
        return updatedContact;
      }
      return c;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.contactsKey, JSON.stringify(updated));
    }
    return updatedContact || current[0];
  }

  async deleteContact(contactId: string): Promise<void> {
    const current = await this.getContacts();
    const updated = current.filter((c) => c.id !== contactId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.contactsKey, JSON.stringify(updated));
    }
  }

  async recordContactInteraction(contactId: string): Promise<void> {
    const current = await this.getContacts();
    const updated = current.map((c) =>
      c.id === contactId
        ? { ...c, interactionCount: c.interactionCount + 1, lastContactDate: new Date().toISOString() }
        : c
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.contactsKey, JSON.stringify(updated));
    }
  }

  async addEmployeeToContact(contactId: string, employeeData: Omit<CompanyEmployee, 'id'>): Promise<CRMContact> {
    const contacts = await this.getContacts();
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) throw new Error('Contacto no encontrado');
    const newEmployee: CompanyEmployee = {
      ...employeeData,
      id: `emp-${Date.now().toString().slice(-4)}`,
    };
    const currentEmployees = contact.employees || [];
    const updatedEmployees = [...currentEmployees, newEmployee];
    return this.updateContact(contactId, { employees: updatedEmployees });
  }

  async removeEmployeeFromContact(contactId: string, employeeId: string): Promise<CRMContact> {
    const contacts = await this.getContacts();
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) throw new Error('Contacto no encontrado');
    const updatedEmployees = (contact.employees || []).filter((e) => e.id !== employeeId);
    return this.updateContact(contactId, { employees: updatedEmployees });
  }

  // CRM Meetings & Activities
  async getMeetings(): Promise<CRMMeeting[]> {
    if (typeof window === 'undefined') return SEED_MEETINGS;
    const local = localStorage.getItem(this.meetingsKey);
    return local ? JSON.parse(local) : SEED_MEETINGS;
  }

  async createMeeting(meetingData: Omit<CRMMeeting, 'id' | 'createdAt'>): Promise<CRMMeeting> {
    const newMeeting: CRMMeeting = {
      ...meetingData,
      id: `meet-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    const current = await this.getMeetings();
    const updated = [newMeeting, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.meetingsKey, JSON.stringify(updated));
    }
    // Also record an interaction with the contact if linked
    if (meetingData.contactId) {
      await this.recordContactInteraction(meetingData.contactId);
    }
    return newMeeting;
  }

  async updateMeeting(meetingId: string, updates: Partial<CRMMeeting>): Promise<CRMMeeting> {
    const current = await this.getMeetings();
    let updatedMeeting: CRMMeeting | null = null;
    const updated = current.map((m) => {
      if (m.id === meetingId) {
        updatedMeeting = { ...m, ...updates };
        return updatedMeeting;
      }
      return m;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.meetingsKey, JSON.stringify(updated));
    }
    return updatedMeeting || current[0];
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    const current = await this.getMeetings();
    const updated = current.filter((m) => m.id !== meetingId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.meetingsKey, JSON.stringify(updated));
    }
  }

  async saveMeetingMinutes(meetingId: string, minutes: string): Promise<CRMMeeting> {
    return this.updateMeeting(meetingId, { notesMinutes: minutes, status: 'realizada' });
  }

  getClientProfile(): ClientProfile {
    return SEED_CLIENT;
  }
}

export const dbRepository = new DataRepository();
