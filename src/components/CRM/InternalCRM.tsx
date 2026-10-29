import React, { useState, useEffect } from 'react';
import { dbRepository } from '../../lib/supabaseClient';
import { resendService } from '../../lib/resendService';
import { 
  Lead, 
  CRMTask, 
  LeadStage, 
  BusinessVertical, 
  UserRole, 
  CRMContact, 
  CRMMeeting, 
  ContactRelationshipStatus, 
  ContactType,
  CompanyDepartment,
  CompanyEmployee,
  MeetingPlatform, 
  MeetingType,
  PipelineStageConfig
} from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { 
  CheckSquare, Plus, Search, ArrowRight, X, Calendar as CalendarIcon, 
  Video, MessageSquare, Mail, Phone, Clock, User, Users, CheckCircle2, 
  ExternalLink, Copy, FileText, ChevronLeft, ChevronRight, Download, 
  Building2, MapPin, Tag, Check, Trash2, Edit3, Shield, ArrowUpRight,
  Send, Sparkles, Briefcase, ChevronDown, ChevronUp, Star, Layers,
  Globe, AlertCircle, TrendingUp, LayoutGrid, List, SlidersHorizontal,
  GripVertical, Settings2, RotateCcw, Eye, EyeOff
} from 'lucide-react';

interface InternalCRMProps {
  currentRole: UserRole;
  initialSubTab?: 'pipeline' | 'contacts' | 'calendar' | 'tasks';
}

const DEFAULT_STAGES: PipelineStageConfig[] = [
  { id: 'nuevo', label: 'Nuevo Diagnóstico', countColor: 'text-[#0078D4]', bgBadge: 'bg-blue-50 border-blue-200', enabled: true, order: 1 },
  { id: 'diagnostico', label: 'Evaluación Técnica', countColor: 'text-indigo-600', bgBadge: 'bg-indigo-50 border-indigo-200', enabled: true, order: 2 },
  { id: 'propuesta', label: 'Propuesta / Modelo', countColor: 'text-cyan-700', bgBadge: 'bg-cyan-50 border-cyan-200', enabled: true, order: 3 },
  { id: 'negociacion', label: 'Negociación Socio', countColor: 'text-amber-700', bgBadge: 'bg-amber-50 border-amber-200', enabled: true, order: 4 },
  { id: 'activo', label: 'Cliente Activo', countColor: 'text-[#107C41]', bgBadge: 'bg-emerald-50 border-emerald-200', enabled: true, order: 5 },
];

export const DEPARTMENT_CONFIG: Record<CompanyDepartment, { label: string; color: string; short: string }> = {
  administracion: { label: 'Administración & Contabilidad', short: 'Administración', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  finanzas_pagos: { label: 'Finanzas, Tesorería & Pagos', short: 'Finanzas & Pagos', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  logistica_envios: { label: 'Logística, Envíos & Depósito', short: 'Logística & Envíos', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  direccion_gerencia: { label: 'Dirección & Gerencia General', short: 'Dirección / CEO', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  comercial_ventas: { label: 'Comercial, Ventas & Clientes', short: 'Comercial & Ventas', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  legales_compliance: { label: 'Legales & Compliance', short: 'Legales', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  operaciones_planta: { label: 'Operaciones & Producción', short: 'Operaciones', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  recursos_humanos: { label: 'Recursos Humanos', short: 'RRHH', color: 'bg-pink-50 text-pink-800 border-pink-200' },
  tecnologia_sistemas: { label: 'Tecnología & Sistemas', short: 'Sistemas & TI', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  otro: { label: 'Otra Área', short: 'Área General', color: 'bg-slate-100 text-slate-700 border-slate-300' },
};

export const InternalCRM: React.FC<InternalCRMProps> = ({ currentRole, initialSubTab = 'pipeline' }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'contacts' | 'calendar' | 'tasks'>(initialSubTab);

  // View modes
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'table'>('kanban');
  const [contactsViewMode, setContactsViewMode] = useState<'cards' | 'table'>('cards');

  // Core Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [meetings, setMeetings] = useState<CRMMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Pipeline Stage Customization
  const [pipelineStages, setPipelineStages] = useState<PipelineStageConfig[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cr_pipeline_stages_config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_STAGES;
  });
  const [showStageSettingsModal, setShowStageSettingsModal] = useState(false);
  const [tempStages, setTempStages] = useState<PipelineStageConfig[]>(DEFAULT_STAGES);

  // Drag and Drop State
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<LeadStage | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<BusinessVertical | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'alta' | 'media' | 'baja'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [contactTypeFilter, setContactTypeFilter] = useState<'all' | 'empresa' | 'individual'>('all');
  const [contactStatusFilter, setContactStatusFilter] = useState<ContactRelationshipStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<CompanyDepartment | 'all'>('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // Expanded Company Cards
  const [expandedCompanyIds, setExpandedCompanyIds] = useState<Record<string, boolean>>({});

  // Lead Modal & Detail States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSourceMode, setLeadSourceMode] = useState<'from_contact' | 'new_company'>('from_contact');
  const [selectedContactForLead, setSelectedContactForLead] = useState<string>('');
  const [selectedEmployeeForLead, setSelectedEmployeeForLead] = useState<string>('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadLocation, setNewLeadLocation] = useState('Trelew, Chubut');
  const [newLeadVertical, setNewLeadVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [newLeadBudget, setNewLeadBudget] = useState<number>(1800);
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCompany, setNewTaskCompany] = useState('');

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState<ContactType>('empresa');
  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactCuit, setContactCuit] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactDepartment, setContactDepartment] = useState<CompanyDepartment>('direccion_gerencia');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactLocation, setContactLocation] = useState('Trelew, Chubut');
  const [contactWebsite, setContactWebsite] = useState('');
  const [contactVertical, setContactVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [contactStatus, setContactStatus] = useState<ContactRelationshipStatus>('lead');
  const [contactNotes, setContactNotes] = useState('');
  const [contactTags, setContactTags] = useState('');

  // Add Employee to Company Modal
  const [activeCompanyForEmployee, setActiveCompanyForEmployee] = useState<CRMContact | null>(null);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpDept, setNewEmpDept] = useState<CompanyDepartment>('administracion');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpWhatsapp, setNewEmpWhatsapp] = useState('');
  const [newEmpIsPrimary, setNewEmpIsPrimary] = useState(false);
  const [newEmpNotes, setNewEmpNotes] = useState('');

  // Meeting Scheduler Modal State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingContactId, setMeetingContactId] = useState('');
  const [meetingEmployeeId, setMeetingEmployeeId] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingStartTime, setMeetingStartTime] = useState('11:00');
  const [meetingEndTime, setMeetingEndTime] = useState('12:00');
  const [meetingType, setMeetingType] = useState<MeetingType>('videollamada');
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>('jitsi_meet');
  const [meetingCustomUrl, setMeetingCustomUrl] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingSendEmailInvite, setMeetingSendEmailInvite] = useState(true);
  const [meetingSendWhatsapp, setMeetingSendWhatsapp] = useState(false);

  // Minutes / Notes Modal State
  const [activeMeetingForMinutes, setActiveMeetingForMinutes] = useState<CRMMeeting | null>(null);
  const [meetingMinutesText, setMeetingMinutesText] = useState('');

  // Email Direct Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  // Copy Feedback Toast
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [l, t, c, m] = await Promise.all([
        dbRepository.getLeads(),
        dbRepository.getTasks(),
        dbRepository.getContacts(),
        dbRepository.getMeetings(),
      ]);
      setLeads(l);
      setTasks(t);
      setContacts(c);
      setMeetings(m);

      const defaultExpanded: Record<string, boolean> = {};
      c.forEach((contact) => {
        if (contact.type === 'empresa' && contact.employees && contact.employees.length > 0) {
          defaultExpanded[contact.id] = true;
        }
      });
      setExpandedCompanyIds((prev) => ({ ...defaultExpanded, ...prev }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleOpportunityCreated = () => {
      loadData();
    };

    window.addEventListener('cr_opportunity_created', handleOpportunityCreated);
    return () => {
      window.removeEventListener('cr_opportunity_created', handleOpportunityCreated);
    };
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const toggleCompanyExpand = (contactId: string) => {
    setExpandedCompanyIds((prev) => ({
      ...prev,
      [contactId]: !prev[contactId],
    }));
  };

  // Stage change handler
  const handleStageChange = async (leadId: string, nextStage: LeadStage) => {
    await dbRepository.updateLeadStage(leadId, nextStage);
    const linkedContact = contacts.find((c) => c.leadId === leadId);
    if (linkedContact) {
      await dbRepository.updateContact(linkedContact.id, {
        stage: nextStage,
        status: nextStage === 'activo' ? 'cliente_activo' : 'lead',
      });
    }
    await loadData();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: nextStage });
    }
  };

  // Drag and drop handlers for Kanban cards
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggingLeadId(null);
    setDragOverStageId(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: LeadStage) => {
    if (dragOverStageId === stageId) {
      setDragOverStageId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, stageId: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggingLeadId;
    setDraggingLeadId(null);
    setDragOverStageId(null);

    if (leadId) {
      await handleStageChange(leadId, stageId);
      const stageObj = pipelineStages.find((s) => s.id === stageId);
      setCopyFeedback(`Oportunidad movida a: ${stageObj?.label || stageId}`);
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  // Pipeline stage customization save
  const handleSaveStageSettings = () => {
    setPipelineStages(tempStages);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cr_pipeline_stages_config', JSON.stringify(tempStages));
    }
    setShowStageSettingsModal(false);
    setCopyFeedback('¡Estructura de columnas del Pipeline actualizada!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleResetStageSettings = () => {
    setTempStages(DEFAULT_STAGES);
  };

  // Task completion toggle
  const handleToggleTask = async (taskId: string) => {
    await dbRepository.toggleTaskCompletion(taskId);
    await loadData();
  };

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    await dbRepository.createTask({
      title: newTaskTitle,
      companyName: newTaskCompany || 'Cr Dominguez Consultoría',
      assignedRole: currentRole === 'admin' ? 'socio' : 'consultor',
      dueDate: 'En 48 hs',
      priority: 'urgente',
    });

    setNewTaskTitle('');
    setNewTaskCompany('');
    setShowTaskModal(false);
    await loadData();
  };

  // Handle open Create Lead Modal
  const handleOpenCreateLeadModal = (prefilledContact?: CRMContact, prefilledEmployee?: CompanyEmployee) => {
    if (prefilledContact) {
      setLeadSourceMode('from_contact');
      setSelectedContactForLead(prefilledContact.id);
      setSelectedEmployeeForLead(prefilledEmployee ? prefilledEmployee.id : '');
      setNewLeadCompany(prefilledContact.companyName);
      setNewLeadContact(prefilledEmployee ? prefilledEmployee.name : prefilledContact.name);
      setNewLeadEmail(prefilledEmployee ? prefilledEmployee.email : prefilledContact.email);
      setNewLeadPhone(prefilledEmployee ? prefilledEmployee.phone : prefilledContact.phone);
      setNewLeadLocation(prefilledContact.location || 'Trelew, Chubut');
      setNewLeadVertical(prefilledContact.vertical || 'cfo_estrategico');
      setNewLeadBudget(1800);
      setNewLeadNotes(
        prefilledEmployee
          ? `Oportunidad originada a través de ${prefilledEmployee.name} (${DEPARTMENT_CONFIG[prefilledEmployee.department]?.short || 'Área'}).`
          : `Oportunidad comercial generada desde la ficha de ${prefilledContact.companyName}.`
      );
    } else {
      setLeadSourceMode('from_contact');
      if (contacts.length > 0) {
        const first = contacts[0];
        setSelectedContactForLead(first.id);
        setSelectedEmployeeForLead('');
        setNewLeadCompany(first.companyName);
        setNewLeadContact(first.name);
        setNewLeadEmail(first.email);
        setNewLeadPhone(first.phone);
        setNewLeadLocation(first.location || 'Trelew, Chubut');
        setNewLeadVertical(first.vertical || 'cfo_estrategico');
      } else {
        setLeadSourceMode('new_company');
        setNewLeadCompany('');
        setNewLeadContact('');
        setNewLeadEmail('');
        setNewLeadPhone('');
      }
      setNewLeadBudget(1800);
      setNewLeadNotes('');
    }
    setShowLeadModal(true);
  };

  const handleContactSelectForLead = (contactId: string) => {
    setSelectedContactForLead(contactId);
    setSelectedEmployeeForLead('');
    const c = contacts.find((contact) => contact.id === contactId);
    if (c) {
      setNewLeadCompany(c.companyName);
      setNewLeadContact(c.name);
      setNewLeadEmail(c.email);
      setNewLeadPhone(c.phone);
      setNewLeadLocation(c.location);
      setNewLeadVertical(c.vertical);
    }
  };

  const handleEmployeeSelectForLead = (empId: string) => {
    setSelectedEmployeeForLead(empId);
    const c = contacts.find((contact) => contact.id === selectedContactForLead);
    if (c && c.employees) {
      const emp = c.employees.find((e) => e.id === empId);
      if (emp) {
        setNewLeadContact(emp.name);
        setNewLeadEmail(emp.email || c.email);
        setNewLeadPhone(emp.phone || c.phone);
      } else {
        setNewLeadContact(c.name);
        setNewLeadEmail(c.email);
        setNewLeadPhone(c.phone);
      }
    }
  };

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadCompany || !newLeadContact) return;

    let finalContactId = selectedContactForLead;

    if (leadSourceMode === 'new_company') {
      const cleanPhone = (newLeadPhone || '').replace(/[^0-9]/g, '');
      const cleanWhatsapp = cleanPhone.startsWith('54') ? cleanPhone : cleanPhone.length > 6 ? `549${cleanPhone}` : '';
      const createdContact = await dbRepository.createContact({
        type: 'empresa',
        name: newLeadContact,
        companyName: newLeadCompany,
        roleTitle: 'Titular / Decisor',
        email: newLeadEmail || 'contacto@empresa.com',
        phone: newLeadPhone || '+54 280 400-0000',
        whatsappNumber: cleanWhatsapp || '5492804000000',
        location: newLeadLocation || 'Trelew, Chubut',
        vertical: newLeadVertical,
        status: 'lead',
        tags: [BUSINESS_VERTICALS[newLeadVertical].shortTitle, 'Lead Calificado'],
        notes: newLeadNotes || 'Creado desde nueva oportunidad.',
      });
      finalContactId = createdContact.id;
    }

    const createdLead = await dbRepository.createLead({
      contactId: finalContactId,
      employeeId: selectedEmployeeForLead || undefined,
      companyName: newLeadCompany,
      contactName: newLeadContact,
      email: newLeadEmail || 'contacto@empresa.com',
      phone: newLeadPhone || '+54 280 400-0000',
      location: newLeadLocation || 'Trelew, Chubut',
      vertical: newLeadVertical,
      stage: 'nuevo',
      priority: 'alta',
      score: 85,
      estimatedMonthlyBudgetUsd: newLeadBudget,
      notes: newLeadNotes || `Alta directa desde el CRM por dirección ejecutiva (${BUSINESS_VERTICALS[newLeadVertical].shortTitle}).`,
    });

    if (finalContactId) {
      await dbRepository.updateContact(finalContactId, {
        leadId: createdLead.id,
        stage: 'nuevo',
        status: 'lead',
      });
    }

    setShowLeadModal(false);
    setCopyFeedback('¡Oportunidad creada y vinculada con éxito!');
    setTimeout(() => setCopyFeedback(null), 3000);
    await loadData();
    setActiveTab('pipeline');
  };

  // Create Contact
  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactCompany) return;

    const tagsArray = contactTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let cleanWa = contactWhatsapp.replace(/[^0-9]/g, '');
    if (!cleanWa && contactPhone) {
      cleanWa = contactPhone.replace(/[^0-9]/g, '');
      if (!cleanWa.startsWith('54') && cleanWa.length >= 8) {
        cleanWa = `549${cleanWa}`;
      }
    }

    const newContactData: Omit<CRMContact, 'id' | 'lastContactDate' | 'interactionCount'> = {
      type: contactType,
      name: contactName,
      companyName: contactCompany,
      cuit: contactCuit || undefined,
      roleTitle: contactRole || (contactType === 'empresa' ? 'Dirección General' : 'Profesional Independiente'),
      department: contactType === 'individual' ? contactDepartment : 'direccion_gerencia',
      email: contactEmail || 'contacto@empresa.com',
      phone: contactPhone || '+54 280 400-0000',
      whatsappNumber: cleanWa || '5492804000000',
      location: contactLocation,
      website: contactWebsite || undefined,
      vertical: contactVertical,
      status: contactStatus,
      tags: tagsArray.length > 0 ? tagsArray : [contactType === 'empresa' ? 'Empresa' : 'Individual', BUSINESS_VERTICALS[contactVertical].shortTitle],
      notes: contactNotes || 'Contacto registrado en agenda de Cr Dominguez.',
      employees: contactType === 'empresa' ? [
        {
          id: `emp-${Date.now().toString().slice(-4)}-1`,
          name: contactName,
          department: 'direccion_gerencia',
          roleTitle: contactRole || 'Dirección General / Titular',
          email: contactEmail || 'contacto@empresa.com',
          phone: contactPhone || '+54 280 400-0000',
          whatsappNumber: cleanWa || '5492804000000',
          isPrimaryContact: true,
          notes: 'Contacto principal registrado en el alta de la empresa.'
        }
      ] : undefined,
    };

    await dbRepository.createContact(newContactData);

    setContactName('');
    setContactCompany('');
    setContactCuit('');
    setContactRole('');
    setContactEmail('');
    setContactPhone('');
    setContactWhatsapp('');
    setContactWebsite('');
    setContactNotes('');
    setContactTags('');
    setShowContactModal(false);
    setCopyFeedback(`¡${contactType === 'empresa' ? 'Empresa' : 'Contacto Individual'} guardado con éxito!`);
    setTimeout(() => setCopyFeedback(null), 3000);
    await loadData();
  };

  // Add Employee to Existing Company
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompanyForEmployee || !newEmpName) return;

    let cleanWa = newEmpWhatsapp.replace(/[^0-9]/g, '');
    if (!cleanWa && newEmpPhone) {
      cleanWa = newEmpPhone.replace(/[^0-9]/g, '');
      if (!cleanWa.startsWith('54') && cleanWa.length >= 8) {
        cleanWa = `549${cleanWa}`;
      }
    }

    await dbRepository.addEmployeeToContact(activeCompanyForEmployee.id, {
      name: newEmpName,
      department: newEmpDept,
      roleTitle: newEmpRole || DEPARTMENT_CONFIG[newEmpDept].short,
      email: newEmpEmail || activeCompanyForEmployee.email,
      phone: newEmpPhone || activeCompanyForEmployee.phone,
      whatsappNumber: cleanWa || activeCompanyForEmployee.whatsappNumber,
      isPrimaryContact: newEmpIsPrimary,
      notes: newEmpNotes,
    });

    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpEmail('');
    setNewEmpPhone('');
    setNewEmpWhatsapp('');
    setNewEmpNotes('');
    setNewEmpIsPrimary(false);
    setActiveCompanyForEmployee(null);
    setCopyFeedback('¡Colaborador agregado al área de la empresa con éxito!');
    setTimeout(() => setCopyFeedback(null), 3000);
    await loadData();
  };

  const handleRemoveEmployee = async (contactId: string, employeeId: string) => {
    await dbRepository.removeEmployeeFromContact(contactId, employeeId);
    await loadData();
  };

  // Open Meeting Scheduler with Pre-selection
  const handleOpenMeetingScheduler = (contact?: CRMContact, employee?: CompanyEmployee) => {
    if (contact) {
      setMeetingContactId(contact.id);
      setMeetingEmployeeId(employee ? employee.id : '');
      const targetName = employee ? employee.name : contact.name;
      const deptLabel = employee ? ` (${DEPARTMENT_CONFIG[employee.department]?.short || 'Área'})` : '';
      setMeetingTitle(`Reunión Estratégica: ${contact.companyName}${deptLabel}`);
      setMeetingDescription(`Sesión de trabajo con ${targetName} para avanzar en plan de acción y asesoramiento de ${contact.companyName}.`);
    } else {
      setMeetingContactId('');
      setMeetingEmployeeId('');
      setMeetingTitle('Reunión de Asesoramiento Cr Dominguez');
      setMeetingDescription('');
    }
    setMeetingDate(new Date().toISOString().split('T')[0]);
    setMeetingPlatform('jitsi_meet');
    setShowMeetingModal(true);
  };

  const generateMeetingUrl = (platform: MeetingPlatform, title: string): string => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);
    const randomHex = Math.random().toString(36).substring(2, 7);
    switch (platform) {
      case 'jitsi_meet':
        return `https://meet.jit.si/CrDominguez-${slug}-${randomHex}`;
      case 'google_meet':
        return `https://meet.google.com/crd-${randomHex}-${Math.random().toString(36).substring(2, 6)}`;
      case 'zoom':
        return `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      case 'teams':
        return `https://teams.microsoft.com/l/meetup-join/crdominguez-${randomHex}`;
      default:
        return 'Sede Central: Av. Rawson 450, Trelew, Chubut';
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle) return;

    const contact = contacts.find((c) => c.id === meetingContactId);
    const employee = contact?.employees?.find((emp) => emp.id === meetingEmployeeId);
    const finalMeetingUrl = meetingCustomUrl || generateMeetingUrl(meetingPlatform, meetingTitle);

    const targetName = employee ? employee.name : contact?.name || 'Cliente Corporativo';
    const targetEmail = employee ? employee.email : contact?.email || 'carlos@crdominguez.ar';
    const targetPhone = employee ? employee.phone : contact?.phone || '+54 280 442-0000';

    const newMeeting = await dbRepository.createMeeting({
      title: meetingTitle,
      contactId: contact?.id,
      employeeId: employee?.id,
      employeeName: employee?.name,
      contactName: targetName,
      contactEmail: targetEmail,
      contactPhone: targetPhone,
      companyName: contact?.companyName || 'Empresa Patagónica',
      date: meetingDate,
      startTime: meetingStartTime,
      endTime: meetingEndTime,
      type: meetingType,
      platform: meetingPlatform,
      meetingUrl: finalMeetingUrl,
      status: 'programada',
      description: meetingDescription || 'Reunión agendada desde el sistema de CRM de Cr Dominguez.',
      notesMinutes: '',
      leadId: contact?.leadId,
      assignedTo: 'Cr. Carlos Rodrigo Domínguez',
      reminderSent: false,
    });

    if (meetingSendEmailInvite && targetEmail) {
      try {
        await resendService.sendMeetingInvite(newMeeting);
        await dbRepository.updateMeeting(newMeeting.id, { reminderSent: true });
      } catch (err) {
        console.warn('Could not auto-dispatch Resend email:', err);
      }
    }

    if (meetingSendWhatsapp) {
      const waNumber = employee?.whatsappNumber || contact?.whatsappNumber;
      if (waNumber) {
        const waText = encodeURIComponent(
          `Hola ${targetName}, te confirmo nuestra reunión de trabajo con el Cr. Carlos Rodrigo Domínguez:\n\n` +
          `📅 Fecha: ${meetingDate}\n⏰ Horario: ${meetingStartTime} - ${meetingEndTime} hs\n` +
          `💻 Enlace de acceso: ${finalMeetingUrl}\n\n` +
          `¡Nos encontramos en ese horario!`
        );
        window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
      }
    }

    setShowMeetingModal(false);
    await loadData();
    setActiveTab('calendar');
  };

  const getGoogleCalendarUrl = (m: CRMMeeting): string => {
    const startClean = `${m.date.replace(/-/g, '')}T${m.startTime.replace(/:/g, '')}00`;
    const endClean = `${m.date.replace(/-/g, '')}T${m.endTime.replace(/:/g, '')}00`;
    const titleEnc = encodeURIComponent(`${m.title} · Cr Dominguez`);
    const detailsEnc = encodeURIComponent(
      `${m.description}\n\nEnlace de acceso: ${m.meetingUrl}\nParticipante: ${m.contactName} (${m.companyName})\nAsesor: ${m.assignedTo}`
    );
    const locationEnc = encodeURIComponent(m.meetingUrl || 'Trelew, Chubut');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&dates=${startClean}/${endClean}&details=${detailsEnc}&location=${locationEnc}`;
  };

  const handleDownloadIcs = (m: CRMMeeting) => {
    const startIso = `${m.date.replace(/-/g, '')}T${m.startTime.replace(/:/g, '')}00`;
    const endIso = `${m.date.replace(/-/g, '')}T${m.endTime.replace(/:/g, '')}00`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cr Dominguez//CRM Meetings//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:meet-${m.id}@crdominguez.ar`,
      `DTSTAMP:${startIso}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${m.title} · Cr Dominguez`,
      `DESCRIPTION:${m.description.replace(/\n/g, '\\n')} - Enlace: ${m.meetingUrl}`,
      `LOCATION:${m.meetingUrl}`,
      'STATUS:CONFIRMED',
      'ORGANIZER;CN=Cr Carlos Rodrigo Dominguez:mailto:carlos@crdominguez.ar',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reunion-${m.date}-${m.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendWhatsApp = (contact: CRMContact, employee?: CompanyEmployee, messageTemplate: 'general' | 'reunion' | 'propuesta' = 'general') => {
    const targetName = employee ? employee.name : contact.name;
    const waNumber = employee?.whatsappNumber || contact.whatsappNumber;

    let text = '';
    if (messageTemplate === 'general') {
      text = `Estimado/a ${targetName}, le saluda el equipo del Cr. Carlos Rodrigo Domínguez (Consultoría Estratégica & Dirección Financiera). ¿Cómo está? Queríamos coordinar los avances para ${contact.companyName}.`;
    } else if (messageTemplate === 'reunion') {
      text = `Hola ${targetName}, coordinamos la próxima sesión de trabajo de ${contact.companyName} con el Cr. Carlos Rodrigo Domínguez. ¿Qué día y horario le resulta más conveniente para una videollamada?`;
    } else {
      text = `Estimado/a ${targetName}, nos comunicamos para darle seguimiento al diagnóstico y propuesta de honorarios de ${contact.companyName}. Quedamos a total disposición para repasar los números.`;
    }

    dbRepository.recordContactInteraction(contact.id);
    const encoded = encodeURIComponent(text);
    const targetUrl = `https://wa.me/${waNumber || '5492804000000'}?text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  const handleOpenEmailComposer = (contact: CRMContact, employee?: CompanyEmployee) => {
    const targetName = employee ? employee.name : contact.name;
    const targetEmail = employee ? employee.email : contact.email;
    setEmailRecipient(targetEmail);
    setEmailSubject(`Asesoramiento Estratégico & Finanzas · ${contact.companyName}`);
    setEmailBody(
      `Estimado/a ${targetName},\n\nLe escribimos en relación a los servicios de consultoría estratégica y dirección financiera para ${contact.companyName}.\n\nQuedamos a su disposición para coordinar una reunión de trabajo o remitirle cualquier documentación complementaria.\n\nAtentamente,\nCr. Carlos Rodrigo Domínguez\nConsultoría Estratégica & CFO\ncarlos@crdominguez.ar`
    );
    setEmailStatusMsg(null);
    setShowEmailModal(true);
  };

  const handleSendDirectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient || !emailSubject) return;

    setIsSendingEmail(true);
    setEmailStatusMsg(null);

    try {
      await resendService.sendEmail({
        to: [emailRecipient],
        subject: emailSubject,
        text: emailBody,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="border-bottom: 2px solid #0078D4; padding-bottom: 12px; margin-bottom: 16px;">
              <h2 style="color: #0078D4; margin: 0; font-size: 18px;">Cr Dominguez</h2>
              <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Consultoría Estratégica & Dirección Financiera</span>
            </div>
            <div style="white-space: pre-line; color: #1e293b; font-size: 14px; line-height: 1.6;">
              ${emailBody}
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 12px;" />
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              Enviado formalmente desde <strong>carlos@crdominguez.ar</strong> · Cr Dominguez Consultoría
            </p>
          </div>
        `,
        type: 'lead_notification',
      });

      const linked = contacts.find((c) => c.email === emailRecipient || c.employees?.some((emp) => emp.email === emailRecipient));
      if (linked) {
        await dbRepository.recordContactInteraction(linked.id);
      }

      setEmailStatusMsg('¡Correo despachado con éxito vía Resend.com (carlos@crdominguez.ar)!');
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailStatusMsg(null);
      }, 2000);
      await loadData();
    } catch (err: any) {
      setEmailStatusMsg(`Error al enviar: ${err.message || 'Error de conexión'}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSaveMinutes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeetingForMinutes) return;

    await dbRepository.saveMeetingMinutes(activeMeetingForMinutes.id, meetingMinutesText);
    setActiveMeetingForMinutes(null);
    setMeetingMinutesText('');
    await loadData();
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      l.companyName.toLowerCase().includes(q) ||
      l.contactName.toLowerCase().includes(q) ||
      (l.opportunityTitle && l.opportunityTitle.toLowerCase().includes(q)) ||
      (l.source && l.source.toLowerCase().includes(q)) ||
      (l.location && l.location.toLowerCase().includes(q)) ||
      (l.identifiedProblem && l.identifiedProblem.toLowerCase().includes(q)) ||
      l.notes.toLowerCase().includes(q);
    const matchesVertical = selectedVertical === 'all' || l.vertical === selectedVertical;
    const matchesPriority = priorityFilter === 'all' || l.priority === priorityFilter;
    const matchesSource = sourceFilter === 'all' || (l.source && l.source.toLowerCase().includes(sourceFilter.toLowerCase())) || (l.opportunityTitle && l.opportunityTitle.toLowerCase().includes(sourceFilter.toLowerCase()));
    const matchesLocation = locationFilter === 'all' || (l.location && l.location.toLowerCase().includes(locationFilter.toLowerCase()));
    return matchesSearch && matchesVertical && matchesPriority && matchesSource && matchesLocation;
  });

  // Filtered Contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.cuit && c.cuit.includes(searchQuery)) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.employees && c.employees.some((emp) => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    const matchesVertical = selectedVertical === 'all' || c.vertical === selectedVertical;
    const matchesStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter;
    const matchesType = contactTypeFilter === 'all' || c.type === contactTypeFilter;
    const matchesDept = 
      departmentFilter === 'all' || 
      c.department === departmentFilter ||
      (c.employees && c.employees.some((emp) => emp.department === departmentFilter));

    return matchesSearch && matchesVertical && matchesStatus && matchesType && matchesDept;
  });

  // Filtered Meetings
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const enabledStages = pipelineStages.filter((s) => s.enabled);
  const totalPipelineBudget = leads.reduce((acc, curr) => acc + (curr.estimatedMonthlyBudgetUsd || 0), 0);
  const companyCount = contacts.filter((c) => c.type === 'empresa').length;
  const individualCount = contacts.filter((c) => c.type === 'individual').length;
  const totalEmployeesCount = contacts.reduce((acc, c) => acc + (c.employees?.length || 0), 0);
  const upcomingMeetingsCount = meetings.filter((m) => m.status === 'programada').length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* TOP HEADER: Module Title & Summary KPIs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0078D4] border border-blue-200">
                Cr Dominguez · Suite CRM 360°
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">Pipeline Drag & Drop · Vistas Tarjetas/Listado · Columnas Editables</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Gestión Comercial, Estructura de Empresas & Agenda Ejecutiva
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Administración de oportunidades con arrastre interactivo, alternancia de vistas en tarjetas o listados compactos y columnas configurables.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Oportunidades</span>
              <span className="text-base font-black text-[#0078D4]">{leads.length}</span>
              <span className="text-[10px] text-slate-400 block font-mono">USD {totalPipelineBudget.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Empresas</span>
              <span className="text-base font-black text-indigo-700">{companyCount}</span>
              <span className="text-[10px] text-slate-400 block">{totalEmployeesCount} colaboradores</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Individuales</span>
              <span className="text-base font-black text-slate-900">{individualCount}</span>
              <span className="text-[10px] text-slate-400 block">Profesionales</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Reuniones</span>
              <span className="text-base font-black text-[#107C41]">{upcomingMeetingsCount}</span>
              <span className="text-[10px] text-slate-400 block">Programadas</span>
            </div>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-white text-[#0078D4] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Pipeline de Oportunidades</span>
              <span className="px-1.5 py-0.2 bg-blue-100 text-[#0078D4] rounded-full text-[10px]">
                {leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-white text-[#0078D4] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Agenda: Empresas & Contactos</span>
              <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px]">
                {contacts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white text-[#0078D4] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Calendario & Videollamadas</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
                {meetings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-white text-[#0078D4] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Tareas & Dictámenes</span>
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
                {tasks.filter((t) => !t.completed).length}
              </span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenCreateLeadModal()}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0078D4] border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+ Nueva Oportunidad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContactType('empresa');
                setShowContactModal(true);
              }}
              className="px-3 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Contacto / Empresa</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenMeetingScheduler()}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agendar Reunión</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOOLBAR: SEARCH, FILTERS & VIEW MODE SWITCHERS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'pipeline'
                ? 'Buscar por empresa, contacto, notas del lead...'
                : activeTab === 'contacts'
                ? 'Buscar por empresa, CUIT, persona, área (administración, finanzas, envíos...), WhatsApp...'
                : activeTab === 'calendar'
                ? 'Buscar reunión por título, participante o empresa...'
                : 'Buscar tareas...'
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0078D4] focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Switcher and Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PIPELINE VIEW SWITCHER & COLUMN SETTINGS */}
          {/* PIPELINE VIEW SWITCHER & COLUMN SETTINGS & ADVANCED FILTERS */}
          {activeTab === 'pipeline' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="alta">Prioridad Alta</option>
                <option value="media">Prioridad Media</option>
                <option value="baja">Prioridad Baja</option>
              </select>

              {/* Source / Form Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
              >
                <option value="all">Todos los Formularios / Orígenes</option>
                <option value="Diagnóstico">Diagnóstico Estratégico</option>
                <option value="Formulario de Asesoría">Formulario de Asesoría</option>
                <option value="Punto de Equilibrio">Simulador Punto de Equilibrio</option>
                <option value="Factura E">Simulador Factura E</option>
                <option value="Franquicias">Simulador Franquicias CCyC</option>
                <option value="ZHC">Simulador ZHC IA</option>
              </select>

              {/* Location Filter */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
              >
                <option value="all">Todas las Localidades</option>
                <option value="Trelew">Trelew</option>
                <option value="Puerto Madryn">Puerto Madryn</option>
                <option value="Rawson">Rawson</option>
                <option value="Gaiman">Gaiman</option>
                <option value="Comodoro">Comodoro Rivadavia</option>
                <option value="Rada Tilly">Rada Tilly</option>
                <option value="Esquel">Esquel</option>
                <option value="Buenos Aires">Buenos Aires / CABA</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setTempStages(pipelineStages);
                  setShowStageSettingsModal(true);
                }}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                title="Configurar y renombrar columnas, achicar o expandir embudo"
              >
                <Settings2 className="w-3.5 h-3.5 text-[#0078D4]" />
                <span>Columnas ({enabledStages.length}/{pipelineStages.length})</span>
              </button>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPipelineViewMode('kanban')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    pipelineViewMode === 'kanban'
                      ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista Tablero Kanban con Arrastre y Soltado"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kanban</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPipelineViewMode('table')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    pipelineViewMode === 'table'
                      ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista Tabla / Listado compacto"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Listado</span>
                </button>
              </div>
            </div>
          )}

          {/* CONTACTS VIEW SWITCHER */}
          {activeTab === 'contacts' && (
            <>
              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setContactTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                    contactTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Todos ({contacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setContactTypeFilter('empresa')}
                  className={`px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-all ${
                    contactTypeFilter === 'empresa' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Empresas ({companyCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactTypeFilter('individual')}
                  className={`px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-all ${
                    contactTypeFilter === 'individual' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Individuales ({individualCount})</span>
                </button>
              </div>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
              >
                <option value="all">Todas las Áreas</option>
                {(Object.keys(DEPARTMENT_CONFIG) as CompanyDepartment[]).map((deptKey) => (
                  <option key={deptKey} value={deptKey}>
                    {DEPARTMENT_CONFIG[deptKey].short}
                  </option>
                ))}
              </select>

              {/* View Switcher: Cards vs Table */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setContactsViewMode('cards')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    contactsViewMode === 'cards'
                      ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista de Tarjetas con Estructura Expandible"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactsViewMode('table')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    contactsViewMode === 'table'
                      ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista de Listado Ejecutivo Compacto"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Listado</span>
                </button>
              </div>
            </>
          )}

          {/* Vertical Filter */}
          <select
            value={selectedVertical}
            onChange={(e) => setSelectedVertical(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
          >
            <option value="all">Todas las Verticales</option>
            {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => (
              <option key={vKey} value={vKey}>
                {BUSINESS_VERTICALS[vKey].shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PIPELINE DE OPORTUNIDADES (KANBAN DRAG & DROP / LISTADO) */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {pipelineViewMode === 'kanban' ? (
            /* KANBAN BOARD WITH DRAG AND DROP */
            <div className={`grid gap-4 ${
              enabledStages.length === 1 ? 'grid-cols-1' :
              enabledStages.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              enabledStages.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
              enabledStages.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
            }`}>
              {enabledStages.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
                const stageBudget = stageLeads.reduce((acc, curr) => acc + (curr.estimatedMonthlyBudgetUsd || 0), 0);
                const isOver = dragOverStageId === stage.id;

                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDragLeave={(e) => handleDragLeave(e, stage.id)}
                    onDrop={(e) => handleDrop(e, stage.id)}
                    className={`rounded-xl p-3 flex flex-col min-h-[540px] transition-all border ${
                      isOver
                        ? 'border-[#0078D4] bg-blue-50/70 ring-2 ring-blue-300'
                        : 'border-slate-200/90 bg-slate-50/70'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          stage.id === 'activo' ? 'bg-[#107C41]' :
                          stage.id === 'negociacion' ? 'bg-amber-600' :
                          stage.id === 'propuesta' ? 'bg-cyan-600' :
                          stage.id === 'diagnostico' ? 'bg-indigo-600' : 'bg-[#0078D4]'
                        }`} />
                        <h4 className="text-xs font-bold text-slate-800 truncate" title={stage.label}>
                          {stage.label}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs shrink-0">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono mb-2 flex justify-between items-center">
                      <span>Proyectado:</span>
                      <span className="font-bold text-slate-700">USD {stageBudget.toLocaleString()}</span>
                    </div>

                    {/* Drop target indicator */}
                    {isOver && (
                      <div className="p-3 mb-2.5 rounded-lg border-2 border-dashed border-[#0078D4] bg-blue-100/60 text-[#0078D4] text-xs font-bold text-center animate-pulse">
                        Soltar aquí para mover a {stage.label}
                      </div>
                    )}

                    {/* Cards Container */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                      {stageLeads.map((lead) => {
                        const vert = BUSINESS_VERTICALS[lead.vertical];
                        const linkedContact = contacts.find((c) => c.id === lead.contactId || c.leadId === lead.id || c.companyName === lead.companyName);
                        const linkedEmployee = linkedContact?.employees?.find((e) => e.id === lead.employeeId);
                        const isDragging = draggingLeadId === lead.id;

                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => setSelectedLead(lead)}
                            className={`bg-white border rounded-lg p-3 shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing group relative ${
                              isDragging
                                ? 'opacity-40 border-dashed border-[#0078D4]'
                                : 'border-slate-200 hover:border-[#0078D4]'
                            }`}
                          >
                            {/* Drag Grip Handle */}
                            <div className="absolute top-2.5 right-2 text-slate-300 group-hover:text-slate-500 cursor-grab" title="Arrastrar para avanzar o retroceder">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>

                            <div className="flex items-start justify-between gap-1 mb-1.5 pr-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0078D4] truncate block max-w-[120px]">
                                {vert?.shortTitle || lead.vertical}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                USD {lead.estimatedMonthlyBudgetUsd}
                              </span>
                            </div>

                            {/* Origin & Priority Badges */}
                            <div className="flex flex-wrap items-center gap-1 mb-1.5">
                              {lead.source && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-[160px]" title={lead.source}>
                                  {lead.source}
                                </span>
                              )}
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                lead.priority === 'alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                lead.priority === 'media' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-slate-50 text-slate-600 border border-slate-200'
                              }`}>
                                {lead.priority}
                              </span>
                            </div>

                            <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors leading-tight mb-1 pr-3">
                              {lead.companyName}
                            </h5>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1.5">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate font-medium">{lead.contactName}</span>
                              {linkedEmployee && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                  {DEPARTMENT_CONFIG[linkedEmployee.department]?.short}
                                </span>
                              )}
                            </div>

                            {/* Location & Organization Scale */}
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                              <div className="flex items-center gap-1 truncate max-w-[140px]">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{lead.location}</span>
                              </div>
                              {(lead.revenueRange || lead.employeeRange) && (
                                <span className="text-[9px] font-mono text-slate-600 bg-slate-50 px-1 py-0.2 rounded border border-slate-200 shrink-0 ml-1">
                                  {lead.revenueRange || lead.employeeRange}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                              {lead.notes}
                            </p>

                            {/* Actions and Stage Dropdown */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1">
                                {linkedContact && (
                                  <button
                                    type="button"
                                    title="Enviar WhatsApp"
                                    onClick={() => handleSendWhatsApp(linkedContact, linkedEmployee, 'propuesta')}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  title="Agendar Videollamada"
                                  onClick={() => handleOpenMeetingScheduler(linkedContact, linkedEmployee)}
                                  className="p-1 text-[#0078D4] hover:bg-blue-50 rounded transition-colors"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Manual stage switcher dropdown (also works on mobile!) */}
                              <select
                                value={lead.stage}
                                onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                                className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none"
                              >
                                {pipelineStages.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.label.split(' ')[0]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}

                      {stageLeads.length === 0 && (
                        <div className="h-28 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400 italic">
                          Arrastra oportunidades aquí
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* HIGH-DENSITY LIST / TABLE VIEW FOR PIPELINE */
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Empresa / Razón Social</th>
                      <th className="py-3 px-4">Contacto / Decisor</th>
                      <th className="py-3 px-4">Origen / Formulario</th>
                      <th className="py-3 px-4">Vertical</th>
                      <th className="py-3 px-4">Etapa del Pipeline</th>
                      <th className="py-3 px-4">Prioridad</th>
                      <th className="py-3 px-4">Presupuesto</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const vert = BUSINESS_VERTICALS[lead.vertical];
                      const linkedContact = contacts.find((c) => c.id === lead.contactId || c.leadId === lead.id || c.companyName === lead.companyName);
                      const linkedEmployee = linkedContact?.employees?.find((e) => e.id === lead.employeeId);
                      const stageObj = pipelineStages.find((s) => s.id === lead.stage);

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {lead.companyName}
                            <span className="text-[10px] text-slate-400 block font-normal font-mono truncate max-w-[200px]">
                              {lead.location}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{lead.contactName}</div>
                            {linkedEmployee && (
                              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                                {DEPARTMENT_CONFIG[linkedEmployee.department]?.short}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {lead.source || 'Diagnóstico'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0078D4]">
                            {vert?.shortTitle || lead.vertical}
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.stage}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800 focus:outline-none focus:border-[#0078D4]"
                            >
                              {pipelineStages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              lead.priority === 'alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              lead.priority === 'media' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              {lead.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            USD {lead.estimatedMonthlyBudgetUsd}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-emerald-600">{lead.score}/100</span>
                          </td>
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {linkedContact && (
                                <button
                                  type="button"
                                  title="WhatsApp"
                                  onClick={() => handleSendWhatsApp(linkedContact, linkedEmployee, 'propuesta')}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {linkedContact && (
                                <button
                                  type="button"
                                  title="Email"
                                  onClick={() => handleOpenEmailComposer(linkedContact, linkedEmployee)}
                                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Videollamada"
                                onClick={() => handleOpenMeetingScheduler(linkedContact, linkedEmployee)}
                                className="p-1.5 text-[#0078D4] hover:bg-blue-50 rounded"
                              >
                                <Video className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: AGENDA DE CONTACTOS (CARDS vs LISTADO/TABLA) */}
      {/* ========================================================================= */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contactsViewMode === 'cards' ? (
            /* CARDS VIEW */
            <div className="grid grid-cols-1 gap-4">
              {filteredContacts.map((contact) => {
                const vert = BUSINESS_VERTICALS[contact.vertical];
                const linkedLead = leads.find((l) => l.id === contact.leadId || l.contactId === contact.id);
                const isExpanded = Boolean(expandedCompanyIds[contact.id]);
                const isCompany = contact.type === 'empresa';
                const employees = contact.employees || [];

                const statusBadges: Record<ContactRelationshipStatus, { label: string; color: string }> = {
                  lead: { label: 'Lead Calificado', color: 'bg-blue-50 text-[#0078D4] border-blue-200' },
                  cliente_activo: { label: 'Cliente Activo', color: 'bg-emerald-50 text-[#107C41] border-emerald-200' },
                  partner: { label: 'Partner Estratégico', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                  proveedor: { label: 'Proveedor', color: 'bg-slate-100 text-slate-700 border-slate-300' },
                  ex_cliente: { label: 'Ex Cliente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                };
                const badge = statusBadges[contact.status] || statusBadges.lead;

                return (
                  <div
                    key={contact.id}
                    className={`bg-white border rounded-xl shadow-xs transition-all overflow-hidden ${
                      isCompany ? 'border-slate-200 hover:border-indigo-300' : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {/* Top Bar / Card Header */}
                    <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-sm border shadow-2xs ${
                          isCompany
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-blue-50 border-blue-200 text-[#0078D4]'
                        }`}>
                          {isCompany ? (
                            <Building2 className="w-6 h-6 text-indigo-600" />
                          ) : (
                            <User className="w-6 h-6 text-[#0078D4]" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isCompany ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {isCompany ? 'Empresa / Razón Social' : 'Contacto Individual'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                              {badge.label}
                            </span>
                            {contact.cuit && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                CUIT: {contact.cuit}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                            {contact.companyName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800">
                              {isCompany ? `Titular: ${contact.name}` : contact.name}
                            </span>
                            <span>·</span>
                            <span className="text-slate-500">{contact.roleTitle}</span>
                            <span>·</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {contact.location}
                            </span>
                            <span>·</span>
                            <span className="text-[#0078D4] font-medium flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {vert?.shortTitle || contact.vertical}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenCreateLeadModal(contact)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0078D4] border border-blue-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Crear una nueva oportunidad en el pipeline para este contacto"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+ Crear Oportunidad</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(contact, undefined, 'general')}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEmailComposer(contact)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <span>Email</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenMeetingScheduler(contact)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Reunión</span>
                        </button>

                        {isCompany && (
                          <button
                            type="button"
                            onClick={() => toggleCompanyExpand(contact.id)}
                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{employees.length} Colaboradores</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pipeline link banner if associated */}
                    {linkedLead && (
                      <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-[#0078D4]" />
                          <span className="font-semibold text-slate-700">Oportunidad activa en Pipeline:</span>
                          <span className="font-bold text-[#0078D4] uppercase text-[11px]">
                            Etapa: {pipelineStages.find((s) => s.id === linkedLead.stage)?.label || linkedLead.stage}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-mono text-slate-600 font-bold">USD {linkedLead.estimatedMonthlyBudgetUsd}/mes</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLead(linkedLead);
                            setActiveTab('pipeline');
                          }}
                          className="text-[#0078D4] hover:underline font-bold text-[11px] flex items-center gap-1"
                        >
                          <span>Ver en Pipeline Kanban</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* EMPRESA EXPANDED: DEPARTMENTS & EMPLOYEES ROSTER */}
                    {isCompany && isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-4 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Estructura de la Empresa & Áreas de Atención</span>
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Colaboradores en Administración, Finanzas, Logística, Envíos, Pagos y Gerencia
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCompanyForEmployee(contact);
                              setNewEmpName('');
                              setNewEmpRole('');
                              setNewEmpEmail('');
                              setNewEmpPhone('');
                              setNewEmpWhatsapp('');
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Agregar Colaborador a {contact.companyName}</span>
                          </button>
                        </div>

                        {/* Employee List Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {employees.map((emp) => {
                            const deptCfg = DEPARTMENT_CONFIG[emp.department] || DEPARTMENT_CONFIG.otro;

                            return (
                              <div
                                key={emp.id}
                                className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${deptCfg.color}`}>
                                      {deptCfg.short}
                                    </span>
                                    {emp.isPrimaryContact && (
                                      <span className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                        <span>Decisor</span>
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                    {emp.name}
                                  </h5>
                                  <span className="text-[11px] text-slate-500 block mb-2">
                                    {emp.roleTitle}
                                  </span>

                                  <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2 mb-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400">Email:</span>
                                      <span className="font-mono text-slate-800 truncate max-w-[150px]">{emp.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400">Tel / WA:</span>
                                      <span className="font-mono text-slate-800">{emp.phone}</span>
                                    </div>
                                  </div>

                                  {emp.notes && (
                                    <p className="text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded mb-2">
                                      "{emp.notes}"
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      title="WhatsApp"
                                      onClick={() => handleSendWhatsApp(contact, emp, 'general')}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Email"
                                      onClick={() => handleOpenEmailComposer(contact, emp)}
                                      className="p-1 text-[#0078D4] hover:bg-blue-50 rounded"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Reunión"
                                      onClick={() => handleOpenMeetingScheduler(contact, emp)}
                                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                    >
                                      <Video className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      title="Crear Oportunidad con este Colaborador"
                                      onClick={() => handleOpenCreateLeadModal(contact, emp)}
                                      className="p-1 text-amber-700 hover:bg-amber-50 rounded"
                                    >
                                      <TrendingUp className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    title="Eliminar colaborador"
                                    onClick={() => handleRemoveEmployee(contact.id, emp.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {employees.length === 0 && (
                            <div className="col-span-full py-6 text-center bg-white border border-dashed border-slate-300 rounded-lg text-xs text-slate-500">
                              No hay colaboradores registrados en la estructura todavía.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* HIGH-DENSITY LIST / TABLE VIEW FOR CONTACTS */
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Empresa / Nombre</th>
                      <th className="py-3 px-4">Decisor / Titular</th>
                      <th className="py-3 px-4">Áreas / Colaboradores</th>
                      <th className="py-3 px-4">Contacto Directo</th>
                      <th className="py-3 px-4">Vertical</th>
                      <th className="py-3 px-4">Vínculo</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredContacts.map((contact) => {
                      const vert = BUSINESS_VERTICALS[contact.vertical];
                      const isCompany = contact.type === 'empresa';
                      const employees = contact.employees || [];

                      return (
                        <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isCompany ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isCompany ? 'Empresa' : 'Individual'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {contact.companyName}
                            {contact.cuit && (
                              <span className="text-[10px] text-slate-400 font-mono block font-normal">
                                CUIT: {contact.cuit}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {contact.name}
                            <span className="text-[10px] text-slate-500 block">{contact.roleTitle}</span>
                          </td>
                          <td className="py-3 px-4">
                            {isCompany ? (
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {employees.map((emp) => (
                                  <span
                                    key={emp.id}
                                    title={`${emp.name} (${emp.roleTitle})`}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                                  >
                                    {DEPARTMENT_CONFIG[emp.department]?.short}
                                  </span>
                                ))}
                                {employees.length === 0 && <span className="text-slate-400 italic text-[11px]">-</span>}
                              </div>
                            ) : (
                              <span className="text-slate-600 text-[11px]">Profesional Directo</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                            <div className="truncate max-w-[150px]">{contact.email}</div>
                            <div className="text-slate-500 text-[10px]">{contact.phone}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0078D4]">
                            {vert?.shortTitle || contact.vertical}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0078D4]">
                              {contact.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                title="+ Crear Oportunidad"
                                onClick={() => handleOpenCreateLeadModal(contact)}
                                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded"
                              >
                                <TrendingUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="WhatsApp"
                                onClick={() => handleSendWhatsApp(contact, undefined, 'general')}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Email"
                                onClick={() => handleOpenEmailComposer(contact)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Reunión"
                                onClick={() => handleOpenMeetingScheduler(contact)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <Video className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CALENDARIO DE REUNIONES & VIDEOLLAMADAS */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Interactive Calendar View */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#0078D4]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Calendario de Comités & Videollamadas
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCalendarMonthOffset(calendarMonthOffset - 1)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 min-w-[120px] text-center capitalize">
                    {new Date(2026, 9 + calendarMonthOffset, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCalendarMonthOffset(calendarMonthOffset + 1)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {calendarMonthOffset !== 0 && (
                    <button
                      type="button"
                      onClick={() => setCalendarMonthOffset(0)}
                      className="px-2 py-1 text-[11px] font-semibold text-[#0078D4] hover:underline ml-1"
                    >
                      Hoy
                    </button>
                  )}
                </div>
              </div>

              {/* Calendar Grid (Days of Week) */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 py-1">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Month Day Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNumber = (i % 31) + 1;
                  const monthNum = String(10 + calendarMonthOffset).padStart(2, '0');
                  const dayStr = `2026-${monthNum}-${String(dayNumber).padStart(2, '0')}`;
                  const dayMeetings = meetings.filter((m) => m.date === dayStr);
                  const isSelected = selectedCalendarDate === dayStr;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedCalendarDate(dayStr)}
                      className={`min-h-[78px] p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0078D4] bg-blue-50/50 shadow-xs'
                          : dayMeetings.length > 0
                          ? 'border-blue-200 bg-white hover:border-[#0078D4]'
                          : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-[#0078D4]' : 'text-slate-700'}`}>
                          {dayNumber}
                        </span>
                        {dayMeetings.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
                        )}
                      </div>

                      <div className="space-y-1">
                        {dayMeetings.slice(0, 2).map((m) => (
                          <div
                            key={m.id}
                            title={`${m.startTime} ${m.title} (${m.companyName})`}
                            className="text-[9px] font-semibold truncate px-1 py-0.5 rounded bg-blue-100/80 text-blue-900 border border-blue-200/50"
                          >
                            {m.startTime} {m.companyName}
                          </div>
                        ))}
                        {dayMeetings.length > 2 && (
                          <span className="text-[9px] text-slate-500 font-bold block">
                            +{dayMeetings.length - 2} más
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
                    <span className="text-[11px]">Reunión programada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px]">Google Meet / Jitsi</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenMeetingScheduler()}
                  className="text-xs font-bold text-[#0078D4] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Programar en este mes</span>
                </button>
              </div>
            </div>

            {/* Upcoming Meetings List */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Agenda Próxima</h4>
                    <span className="text-[11px] text-slate-500">Reuniones registradas</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenMeetingScheduler()}
                    className="p-1.5 bg-blue-50 text-[#0078D4] hover:bg-blue-100 rounded-lg transition-colors"
                    title="Nueva Reunión"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                  {filteredMeetings.map((m) => {
                    const linkedContact = contacts.find((c) => c.id === m.contactId);
                    const isTodayOrSelected = m.date === selectedCalendarDate;

                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-lg border transition-all ${
                          isTodayOrSelected
                            ? 'border-[#0078D4] bg-blue-50/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#0078D4] block">
                              {m.platform === 'google_meet' ? 'Google Meet' :
                               m.platform === 'jitsi_meet' ? 'Jitsi Meet' :
                               m.platform === 'zoom' ? 'Zoom' : 'Presencial'}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {m.title}
                            </h5>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 shrink-0">
                            {m.startTime} hs
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-0.5 mb-2">
                          <p className="font-semibold text-slate-800">{m.companyName}</p>
                          <p className="text-slate-500">
                            Con: <strong>{m.contactName}</strong>
                            {m.employeeName && m.employeeName !== m.contactName ? ` (${m.employeeName})` : ''}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">Fecha: {m.date} ({m.startTime} - {m.endTime} hs)</p>
                        </div>

                        {m.meetingUrl && (
                          <div className="bg-slate-50 border border-slate-200 rounded p-1.5 mb-2.5 flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[190px] font-mono text-[#0078D4]">
                              {m.meetingUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(m.meetingUrl, 'Enlace de videollamada')}
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Copiar enlace"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {m.notesMinutes ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-[11px] text-emerald-900 mb-2.5">
                            <span className="font-bold block text-[10px] uppercase text-emerald-800">Minuta guardada:</span>
                            <p className="line-clamp-2 italic">{m.notesMinutes}</p>
                          </div>
                        ) : null}

                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1 text-[10px]">
                          {m.meetingUrl && (
                            <a
                              href={m.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold rounded flex items-center gap-1 transition-colors"
                            >
                              <Video className="w-3 h-3" />
                              <span>Entrar</span>
                            </a>
                          )}

                          {m.contactPhone && (
                            <button
                              type="button"
                              title="Enviar recordatorio por WhatsApp"
                              onClick={() => {
                                const waMsg = encodeURIComponent(
                                  `Hola ${m.contactName}, te recuerdo nuestra reunión con Cr. Carlos Rodrigo Domínguez:\n` +
                                  `📅 ${m.date} a las ${m.startTime} hs.\n` +
                                  `Enlace: ${m.meetingUrl}`
                                );
                                window.open(`https://wa.me/${m.contactPhone.replace(/[^0-9]/g, '')}?text=${waMsg}`, '_blank');
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded border border-emerald-200 flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WA</span>
                            </button>
                          )}

                          <a
                            href={getGoogleCalendarUrl(m)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1"
                            title="Google Calendar"
                          >
                            <CalendarIcon className="w-3 h-3" />
                            <span>GCal</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDownloadIcs(m)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1"
                            title="Descargar .ICS"
                          >
                            <Download className="w-3 h-3" />
                            <span>.ICS</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMeetingForMinutes(m);
                              setMeetingMinutesText(m.notesMinutes || '');
                            }}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded border border-amber-200 flex items-center gap-1"
                            title="Minuta de acuerdos"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Minuta</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredMeetings.length === 0 && (
                    <div className="py-10 text-center text-xs text-slate-400 italic">
                      No hay reuniones agendadas en esta vista.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: TAREAS OPERATIVAS & DICTÁMENES */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Checklist de Cumplimiento & Asesoría</h3>
              <p className="text-xs text-slate-500">Dictámenes, auditorías de contratos y liquidaciones pendientes</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTaskModal(true)}
              className="px-3 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Tarea</span>
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50/60 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-[#0078D4] focus:ring-[#0078D4]"
                  />
                  <div>
                    <h5 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{task.companyName}</span>
                      <span>·</span>
                      <span>Vence: <strong className="text-slate-700">{task.dueDate}</strong></span>
                      <span>·</span>
                      <span>Rol: {task.assignedRole}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.priority === 'urgente'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PERSONALIZAR Y ACHICAR COLUMNAS DEL PIPELINE */}
      {/* ========================================================================= */}
      {showStageSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0078D4] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Personalizar Columnas del Pipeline</h3>
                  <p className="text-[11px] text-slate-500">Edite los nombres o desactive etapas para achicar el embudo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStageSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 text-xs">
                Active o desactive las columnas que desee ver en el tablero Kanban. También puede renombrarlas según la terminología de su estudio:
              </p>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {tempStages.map((stage, idx) => (
                  <div key={stage.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stage.enabled}
                          onChange={(e) => {
                            const updated = tempStages.map((s, i) =>
                              i === idx ? { ...s, enabled: e.target.checked } : s
                            );
                            setTempStages(updated);
                          }}
                          className="rounded text-[#0078D4] focus:ring-[#0078D4]"
                        />
                        <span className="text-xs">Columna #{idx + 1} ({stage.id})</span>
                      </label>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stage.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {stage.enabled ? 'Visible' : 'Oculta'}
                      </span>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={stage.label}
                        onChange={(e) => {
                          const updated = tempStages.map((s, i) =>
                            i === idx ? { ...s, label: e.target.value } : s
                          );
                          setTempStages(updated);
                        }}
                        placeholder="Nombre de la etapa..."
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetStageSettings}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStageSettingsModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStageSettings}
                    className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Guardar Columnas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREAR OPORTUNIDAD / LEAD (CON SELECCIÓN DE CONTACTO DE AGENDA) */}
      {/* ========================================================================= */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0078D4] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Crear Oportunidad / Negocio en Pipeline</h3>
                  <p className="text-[11px] text-slate-500">Vincular con contacto de la agenda o registrar nueva empresa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLeadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLeadSourceMode('from_contact')}
                className={`py-1.5 px-3 rounded-md text-center transition-all ${
                  leadSourceMode === 'from_contact'
                    ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Desde Contacto Agendado
              </button>
              <button
                type="button"
                onClick={() => setLeadSourceMode('new_company')}
                className={`py-1.5 px-3 rounded-md text-center transition-all ${
                  leadSourceMode === 'new_company'
                    ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Nueva Empresa Externa
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              {leadSourceMode === 'from_contact' ? (
                <div className="space-y-3 bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                      Seleccionar Empresa o Contacto Agendado *
                    </label>
                    <select
                      value={selectedContactForLead}
                      onChange={(e) => handleContactSelectForLead(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#0078D4] focus:outline-none"
                    >
                      <option value="">-- Seleccionar de la agenda --</option>
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.type === 'empresa' ? '🏢 [Empresa] ' : '👤 [Persona] '} {c.companyName} · {c.name} ({BUSINESS_VERTICALS[c.vertical]?.shortTitle || c.vertical})
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const chosen = contacts.find((c) => c.id === selectedContactForLead);
                    if (chosen && chosen.employees && chosen.employees.length > 0) {
                      return (
                        <div>
                          <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                            Colaborador / Área de Contacto
                          </label>
                          <select
                            value={selectedEmployeeForLead}
                            onChange={(e) => handleEmployeeSelectForLead(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                          >
                            <option value="">Contacto Principal: {chosen.name} (General)</option>
                            {chosen.employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name} · {DEPARTMENT_CONFIG[emp.department]?.short} ({emp.roleTitle})
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Empresa / Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    placeholder="Ej: Pesquera San Carlos SRL"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Persona de Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadContact}
                    onChange={(e) => setNewLeadContact(e.target.value)}
                    placeholder="Ej: Ing. Carlos San Martín"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+54 280 4..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Vertical del Negocio
                  </label>
                  <select
                    value={newLeadVertical}
                    onChange={(e) => setNewLeadVertical(e.target.value as BusinessVertical)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  >
                    {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => (
                      <option key={vKey} value={vKey}>
                        {BUSINESS_VERTICALS[vKey].title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Presupuesto Mensual Estimado (USD)
                  </label>
                  <input
                    type="number"
                    value={newLeadBudget}
                    onChange={(e) => setNewLeadBudget(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Notas de la Oportunidad / Requerimiento
                </label>
                <textarea
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Detalles sobre necesidad contable, financiera o jurídica..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Crear Oportunidad</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVO CONTACTO (EMPRESA vs INDIVIDUAL CON ÁREAS) */}
      {/* ========================================================================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  contactType === 'empresa' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-[#0078D4]'
                }`}>
                  {contactType === 'empresa' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Alta de Contacto en Agenda</h3>
                  <p className="text-[11px] text-slate-500">Seleccione si es una Empresa o un Contacto Individual</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setContactType('empresa')}
                className={`py-2 px-3 rounded-md text-center flex items-center justify-center gap-2 transition-all ${
                  contactType === 'empresa'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Contacto Empresa / Corporativo</span>
              </button>
              <button
                type="button"
                onClick={() => setContactType('individual')}
                className={`py-2 px-3 rounded-md text-center flex items-center justify-center gap-2 transition-all ${
                  contactType === 'individual'
                    ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-[#0078D4]" />
                <span>Contacto Individual / Profesional</span>
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs">
              <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                contactType === 'empresa'
                  ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950'
                  : 'bg-blue-50/50 border-blue-200 text-blue-950'
              }`}>
                {contactType === 'empresa' ? (
                  <span>
                    🏢 <strong>Contacto Empresa:</strong> Podrá agregar múltiples colaboradores y áreas de atención (Administración, Finanzas, Pagos, Envíos, Logística, Gerencia).
                  </span>
                ) : (
                  <span>
                    👤 <strong>Contacto Individual:</strong> Para profesionales, directores independientes, consultores o socios estratégicos unipersonales.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    {contactType === 'empresa' ? 'Razón Social / Nombre Comercial *' : 'Nombre de Fantasía / Estudio'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    placeholder={contactType === 'empresa' ? 'Ej: Pesquera San Carlos SRL' : 'Ej: Estudio Jurídico Roberts'}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    {contactType === 'empresa' ? 'Titular / Contacto Principal *' : 'Nombre y Apellido *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej: Lic. Hernán Pereyra"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    CUIT / CUIL (Opcional)
                  </label>
                  <input
                    type="text"
                    value={contactCuit}
                    onChange={(e) => setContactCuit(e.target.value)}
                    placeholder="30-71894520-4"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Cargo / Función / Especialidad
                  </label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder={contactType === 'empresa' ? 'Director General / Socio Gerente' : 'Perito Tributario / Abogado'}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              {contactType === 'individual' && (
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Área / Especialidad
                  </label>
                  <select
                    value={contactDepartment}
                    onChange={(e) => setContactDepartment(e.target.value as CompanyDepartment)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  >
                    {(Object.keys(DEPARTMENT_CONFIG) as CompanyDepartment[]).map((deptKey) => (
                      <option key={deptKey} value={deptKey}>
                        {DEPARTMENT_CONFIG[deptKey].label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contacto@empresa.com.ar"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    WhatsApp (con código de país)
                  </label>
                  <input
                    type="text"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="5492804428812"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Localidad / Sede
                  </label>
                  <input
                    type="text"
                    value={contactLocation}
                    onChange={(e) => setContactLocation(e.target.value)}
                    placeholder="Trelew / Puerto Madryn, Chubut"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Vertical de Negocio
                  </label>
                  <select
                    value={contactVertical}
                    onChange={(e) => setContactVertical(e.target.value as BusinessVertical)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
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
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Vínculo Comercial
                </label>
                <select
                  value={contactStatus}
                  onChange={(e) => setContactStatus(e.target.value as ContactRelationshipStatus)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                >
                  <option value="lead">Lead Calificado</option>
                  <option value="cliente_activo">Cliente Activo</option>
                  <option value="partner">Partner Estratégico</option>
                  <option value="proveedor">Proveedor</option>
                  <option value="ex_cliente">Ex-cliente</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Notas / Resumen
                </label>
                <textarea
                  rows={2}
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  placeholder="Información relevante sobre la empresa, necesidades o antecedentes..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Guardar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AGREGAR COLABORADOR / EMPLEADO A LA EMPRESA */}
      {/* ========================================================================= */}
      {activeCompanyForEmployee && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agregar Colaborador a la Estructura</h3>
                  <p className="text-[11px] text-slate-500">{activeCompanyForEmployee.companyName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCompanyForEmployee(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="Ej: Romina Beltrán"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Departamento / Área *
                </label>
                <select
                  value={newEmpDept}
                  onChange={(e) => setNewEmpDept(e.target.value as CompanyDepartment)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                >
                  {(Object.keys(DEPARTMENT_CONFIG) as CompanyDepartment[]).map((deptKey) => (
                    <option key={deptKey} value={deptKey}>
                      {DEPARTMENT_CONFIG[deptKey].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Puesto / Función
                </label>
                <input
                  type="text"
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  placeholder="Ej: Jefa de Facturación & Cobranzas / Logística de Envíos"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Email Directo
                  </label>
                  <input
                    type="email"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="pagos@empresa.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    WhatsApp Directo
                  </label>
                  <input
                    type="text"
                    value={newEmpWhatsapp}
                    onChange={(e) => setNewEmpWhatsapp(e.target.value)}
                    placeholder="5492804..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 pt-1">
                <input
                  type="checkbox"
                  checked={newEmpIsPrimary}
                  onChange={(e) => setNewEmpIsPrimary(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-600"
                />
                <span>Marcar como decisor / contacto principal del área</span>
              </label>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Notas sobre el rol o responsabilidades
                </label>
                <textarea
                  rows={2}
                  value={newEmpNotes}
                  onChange={(e) => setNewEmpNotes(e.target.value)}
                  placeholder="Ej: Responsable de emisión de órdenes de pago los días jueves..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCompanyForEmployee(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Incorporar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AGENDAR VIDEOLLAMADA / REUNIÓN */}
      {/* ========================================================================= */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0078D4] flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agendar Videollamada / Reunión</h3>
                  <p className="text-[11px] text-slate-500">Conexión con Meet, Jitsi, WhatsApp y confirmación Resend</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Título de la Reunión *
                </label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Ej: Comité CFO Mensual / Evaluación de Factura E"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Empresa o Contacto de la Agenda
                </label>
                <select
                  value={meetingContactId}
                  onChange={(e) => {
                    setMeetingContactId(e.target.value);
                    setMeetingEmployeeId('');
                    const selected = contacts.find((c) => c.id === e.target.value);
                    if (selected && !meetingTitle) {
                      setMeetingTitle(`Reunión Estratégica: ${selected.companyName}`);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                >
                  <option value="">-- Seleccionar de la agenda de contactos --</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.type === 'empresa' ? '🏢 ' : '👤 '} {c.companyName} · {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const c = contacts.find((contact) => contact.id === meetingContactId);
                if (c && c.employees && c.employees.length > 0) {
                  return (
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                        Participante Específico de la Empresa
                      </label>
                      <select
                        value={meetingEmployeeId}
                        onChange={(e) => setMeetingEmployeeId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                      >
                        <option value="">Contacto Principal: {c.name}</option>
                        {c.employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} · {DEPARTMENT_CONFIG[emp.department]?.short} ({emp.roleTitle})
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Inicio *
                  </label>
                  <input
                    type="time"
                    required
                    value={meetingStartTime}
                    onChange={(e) => setMeetingStartTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Fin *
                  </label>
                  <input
                    type="time"
                    required
                    value={meetingEndTime}
                    onChange={(e) => setMeetingEndTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Tipo de Encuentro
                  </label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  >
                    <option value="videollamada">Videollamada</option>
                    <option value="comite_cfo">Comité CFO de Dirección</option>
                    <option value="auditoria_franquicia">Auditoría de Franquicia</option>
                    <option value="presencial">Presencial en Oficina</option>
                    <option value="telefonica">Conferencia Telefónica</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                    Plataforma
                  </label>
                  <select
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value as MeetingPlatform)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  >
                    <option value="jitsi_meet">Jitsi Meet (Instantáneo, Sin Registro)</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="zoom">Zoom</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="sede_presencial">Sede Trelew (Presencial)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Enlace Personalizado (Opcional)
                </label>
                <input
                  type="url"
                  value={meetingCustomUrl}
                  onChange={(e) => setMeetingCustomUrl(e.target.value)}
                  placeholder="Se generará automáticamente un enlace seguro si lo deja vacío"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Temario & Objetivos
                </label>
                <textarea
                  rows={2}
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  placeholder="Detalle los puntos clave a tratar en la sesión..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Notificaciones Automáticas:</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={meetingSendEmailInvite}
                    onChange={(e) => setMeetingSendEmailInvite(e.target.checked)}
                    className="rounded text-[#0078D4] focus:ring-[#0078D4]"
                  />
                  <span>Enviar invitación formal con enlace vía Resend.com (carlos@crdominguez.ar)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={meetingSendWhatsapp}
                    onChange={(e) => setMeetingSendWhatsapp(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-600"
                  />
                  <span>Abrir WhatsApp para enviar confirmación instantánea</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Confirmar & Agendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: COMPOSER DE EMAIL DIRECTO VÍA RESEND */}
      {/* ========================================================================= */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0078D4] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enviar Correo Institucional</h3>
                  <p className="text-[11px] text-slate-500">Desde: carlos@crdominguez.ar (Resend Free)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {emailStatusMsg && (
              <div className={`p-3 rounded-lg text-xs font-semibold ${
                emailStatusMsg.includes('éxito') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {emailStatusMsg}
              </div>
            )}

            <form onSubmit={handleSendDirectEmail} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Destinatario *</label>
                <input
                  type="email"
                  required
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Asunto *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Mensaje</label>
                <textarea
                  rows={6}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <a
                  href={`mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="text-xs text-[#0078D4] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en cliente local (Outlook/Mail)</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingEmail ? 'Enviando...' : 'Despachar Correo'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MINUTA DE REUNIÓN & ACUERDOS */}
      {/* ========================================================================= */}
      {activeMeetingForMinutes && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Minuta de Reunión & Compromisos</h3>
                  <p className="text-[11px] text-slate-500">{activeMeetingForMinutes.title} · {activeMeetingForMinutes.companyName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMeetingForMinutes(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMinutes} className="space-y-3 text-xs">
              <p className="text-slate-600 text-xs">
                Registre los temas tratados, conclusiones y tareas pactadas con el cliente. Al guardar, el estado de la reunión se actualizará automáticamente a <strong>Realizada</strong>.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
                  Texto de la Minuta / Decisiones
                </label>
                <textarea
                  rows={6}
                  required
                  value={meetingMinutesText}
                  onChange={(e) => setMeetingMinutesText(e.target.value)}
                  placeholder="Ej: Se acordó presentar corrida financiera de cash flow el viernes 6. Se revisó la Circular de Oferta con observaciones en cláusula 8..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveMeetingForMinutes(null)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Guardar Minuta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVA TAREA */}
      {/* ========================================================================= */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Nueva Tarea / Dictamen</h3>
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Descripción de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej: Dictamen de exención fiscal exportación..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Empresa / Cliente</label>
                <input
                  type="text"
                  value={newTaskCompany}
                  onChange={(e) => setNewTaskCompany(e.target.value)}
                  placeholder="Ej: Patagonia Data Engine"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL: LEAD DETAIL VIEW */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0078D4]">
                  {BUSINESS_VERTICALS[selectedLead.vertical]?.title}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedLead.companyName}</h3>
                <p className="text-xs text-slate-500">Contacto: {selectedLead.contactName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Email:</span>
                <span className="font-mono text-slate-800">{selectedLead.email}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Teléfono:</span>
                <span className="font-mono text-slate-800">{selectedLead.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Presupuesto Mensual:</span>
                <span className="font-bold text-[#0078D4]">USD {selectedLead.estimatedMonthlyBudgetUsd}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Score de Calificación:</span>
                <span className="font-bold text-emerald-600">{selectedLead.score}/100</span>
              </div>
            </div>

            <div>
              <span className="text-slate-700 text-xs font-bold block mb-1">Notas del Diagnóstico:</span>
              <p className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                {selectedLead.notes}
              </p>
            </div>

            <div>
              <span className="text-slate-700 text-xs font-bold block mb-1.5">Cambiar Etapa de Negociación:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {pipelineStages.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleStageChange(selectedLead.id, s.id)}
                    className={`px-2 py-1.5 rounded text-[11px] font-bold text-center transition-all ${
                      selectedLead.stage === s.id
                        ? 'bg-[#0078D4] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const linked = contacts.find((c) => c.id === selectedLead.contactId || c.leadId === selectedLead.id || c.name === selectedLead.contactName);
                    handleOpenMeetingScheduler(linked);
                    setSelectedLead(null);
                  }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0078D4] font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Agendar Videollamada</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
