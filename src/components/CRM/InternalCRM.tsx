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
  MeetingPlatform, 
  MeetingType 
} from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { 
  CheckSquare, Plus, Search, ArrowRight, X, Calendar as CalendarIcon, 
  Video, MessageSquare, Mail, Phone, Clock, User, Users, CheckCircle2, 
  ExternalLink, Copy, FileText, ChevronLeft, ChevronRight, Download, 
  Building2, MapPin, Tag, Check, Trash2, Edit3, Shield, ArrowUpRight,
  Send, Sparkles
} from 'lucide-react';

interface InternalCRMProps {
  currentRole: UserRole;
  initialSubTab?: 'pipeline' | 'contacts' | 'calendar' | 'tasks';
}

const STAGES: { id: LeadStage; label: string; countColor: string; bgBadge: string }[] = [
  { id: 'nuevo', label: 'Nuevo Diagnóstico', countColor: 'text-[#0078D4]', bgBadge: 'bg-blue-50 border-blue-200' },
  { id: 'diagnostico', label: 'Evaluación Técnica', countColor: 'text-indigo-600', bgBadge: 'bg-indigo-50 border-indigo-200' },
  { id: 'propuesta', label: 'Propuesta / Modelo', countColor: 'text-cyan-700', bgBadge: 'bg-cyan-50 border-cyan-200' },
  { id: 'negociacion', label: 'Negociación Socio', countColor: 'text-amber-700', bgBadge: 'bg-amber-50 border-amber-200' },
  { id: 'activo', label: 'Cliente Activo', countColor: 'text-[#107C41]', bgBadge: 'bg-emerald-50 border-emerald-200' },
];

export const InternalCRM: React.FC<InternalCRMProps> = ({ currentRole, initialSubTab = 'pipeline' }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'contacts' | 'calendar' | 'tasks'>(initialSubTab);

  // Core Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [meetings, setMeetings] = useState<CRMMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<BusinessVertical | 'all'>('all');
  const [contactStatusFilter, setContactStatusFilter] = useState<ContactRelationshipStatus | 'all'>('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // Lead Modal & Detail States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadVertical, setNewLeadVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [newLeadBudget, setNewLeadBudget] = useState<number>(1800);

  // Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCompany, setNewTaskCompany] = useState('');

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactLocation, setContactLocation] = useState('Trelew, Chubut');
  const [contactVertical, setContactVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [contactStatus, setContactStatus] = useState<ContactRelationshipStatus>('lead');
  const [contactNotes, setContactNotes] = useState('');
  const [contactTags, setContactTags] = useState('Patagonia, CFO');

  // Meeting Scheduler Modal State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingContactId, setMeetingContactId] = useState('');
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Stage change handler
  const handleStageChange = async (leadId: string, nextStage: LeadStage) => {
    await dbRepository.updateLeadStage(leadId, nextStage);
    // Also sync stage in linked contact if present
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

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadCompany || !newLeadContact) return;

    const createdLead = await dbRepository.createLead({
      companyName: newLeadCompany,
      contactName: newLeadContact,
      email: newLeadEmail || 'contacto@empresa.com',
      phone: newLeadPhone || '+54 280 400-0000',
      location: 'Trelew, Chubut',
      vertical: newLeadVertical,
      stage: 'nuevo',
      priority: 'alta',
      score: 85,
      estimatedMonthlyBudgetUsd: newLeadBudget,
      notes: `Alta directa desde el CRM por dirección ejecutiva (${BUSINESS_VERTICALS[newLeadVertical].shortTitle}).`,
    });

    // Automatically create a linked contact in the agenda!
    const cleanPhone = (newLeadPhone || '').replace(/[^0-9]/g, '');
    const cleanWhatsapp = cleanPhone.startsWith('54') ? cleanPhone : cleanPhone.length > 6 ? `549${cleanPhone}` : '';

    await dbRepository.createContact({
      name: newLeadContact,
      companyName: newLeadCompany,
      roleTitle: 'Titular / Responsable',
      email: newLeadEmail || 'contacto@empresa.com',
      phone: newLeadPhone || '+54 280 400-0000',
      whatsappNumber: cleanWhatsapp || '5492804000000',
      location: 'Trelew, Chubut',
      vertical: newLeadVertical,
      status: 'lead',
      leadId: createdLead.id,
      stage: 'nuevo',
      tags: [BUSINESS_VERTICALS[newLeadVertical].shortTitle, 'Lead Calificado'],
      notes: `Creado desde nuevo lead en pipeline.`,
    });

    setNewLeadCompany('');
    setNewLeadContact('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setShowLeadModal(false);
    await loadData();
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

    await dbRepository.createContact({
      name: contactName,
      companyName: contactCompany,
      roleTitle: contactRole || 'Directivo',
      email: contactEmail || 'contacto@empresa.com',
      phone: contactPhone || '+54 280 400-0000',
      whatsappNumber: cleanWa || '5492804000000',
      location: contactLocation,
      vertical: contactVertical,
      status: contactStatus,
      tags: tagsArray.length > 0 ? tagsArray : ['Contacto Patagónico'],
      notes: contactNotes || 'Contacto registrado en agenda de Cr Dominguez.',
    });

    setContactName('');
    setContactCompany('');
    setContactRole('');
    setContactEmail('');
    setContactPhone('');
    setContactWhatsapp('');
    setContactNotes('');
    setShowContactModal(false);
    await loadData();
  };

  // Open Meeting Scheduler with Pre-selection
  const handleOpenMeetingScheduler = (contact?: CRMContact) => {
    if (contact) {
      setMeetingContactId(contact.id);
      setMeetingTitle(`Reunión Estratégica: ${contact.companyName}`);
      setMeetingDescription(`Sesión de trabajo con ${contact.name} (${contact.roleTitle}) para avanzar en plan de acción y asesoramiento.`);
    } else {
      setMeetingContactId('');
      setMeetingTitle('Reunión de Asesoramiento Cr Dominguez');
      setMeetingDescription('');
    }
    setMeetingDate(new Date().toISOString().split('T')[0]);
    setMeetingPlatform('jitsi_meet');
    setShowMeetingModal(true);
  };

  // Generate Auto Video Link
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

  // Create Meeting
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle) return;

    const contact = contacts.find((c) => c.id === meetingContactId);
    const finalMeetingUrl = meetingCustomUrl || generateMeetingUrl(meetingPlatform, meetingTitle);

    const newMeeting = await dbRepository.createMeeting({
      title: meetingTitle,
      contactId: contact?.id,
      contactName: contact?.name || 'Cliente Corporativo',
      contactEmail: contact?.email || 'carlos@crdominguez.ar',
      contactPhone: contact?.phone || '+54 280 442-0000',
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

    // Optional dispatch: Resend email invitation
    if (meetingSendEmailInvite && contact?.email) {
      try {
        await resendService.sendMeetingInvite(newMeeting);
        await dbRepository.updateMeeting(newMeeting.id, { reminderSent: true });
      } catch (err) {
        console.warn('Could not auto-dispatch Resend email:', err);
      }
    }

    // Optional dispatch: WhatsApp invitation link
    if (meetingSendWhatsapp && contact?.whatsappNumber) {
      const waText = encodeURIComponent(
        `Hola ${contact.name}, te confirmo nuestra reunión de trabajo con el Cr. Carlos Rodrigo Domínguez:\n\n` +
        `📅 Fecha: ${meetingDate}\n⏰ Horario: ${meetingStartTime} - ${meetingEndTime} hs\n` +
        `💻 Enlace de acceso: ${finalMeetingUrl}\n\n` +
        `¡Nos encontramos en ese horario!`
      );
      window.open(`https://wa.me/${contact.whatsappNumber}?text=${waText}`, '_blank');
    }

    setShowMeetingModal(false);
    await loadData();
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = (m: CRMMeeting): string => {
    const startClean = `${m.date.replace(/-/g, '')}T${m.startTime.replace(/:/g, '')}00`;
    const endClean = `${m.date.replace(/-/g, '')}T${m.endTime.replace(/:/g, '')}00`;
    const titleEnc = encodeURIComponent(`${m.title} · Cr Dominguez`);
    const detailsEnc = encodeURIComponent(
      `${m.description}\n\nEnlace de acceso: ${m.meetingUrl}\nContacto: ${m.contactName} (${m.companyName})\nAsesor: ${m.assignedTo}`
    );
    const locationEnc = encodeURIComponent(m.meetingUrl || 'Trelew, Chubut');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&dates=${startClean}/${endClean}&details=${detailsEnc}&location=${locationEnc}`;
  };

  // Download .ICS calendar file
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

  // WhatsApp Instant Message
  const handleSendWhatsApp = (contact: CRMContact, messageTemplate: 'general' | 'reunion' | 'propuesta') => {
    let text = '';
    if (messageTemplate === 'general') {
      text = `Estimado/a ${contact.name}, le saluda el equipo del Cr. Carlos Rodrigo Domínguez (Consultoría Estratégica & Dirección Financiera). ¿Cómo está? Queríamos coordinar los avances para ${contact.companyName}.`;
    } else if (messageTemplate === 'reunion') {
      text = `Hola ${contact.name}, coordinamos la próxima sesión de trabajo de ${contact.companyName} con el Cr. Carlos Rodrigo Domínguez. ¿Qué día y horario le resulta más conveniente para una videollamada?`;
    } else {
      text = `Estimado/a ${contact.name}, nos comunicamos para darle seguimiento al diagnóstico y propuesta integral de ${contact.companyName}. Quedamos a total disposición para repasar los números.`;
    }

    dbRepository.recordContactInteraction(contact.id);
    const encoded = encodeURIComponent(text);
    const targetUrl = `https://wa.me/${contact.whatsappNumber || '5492804000000'}?text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  // Open Direct Email Composer
  const handleOpenEmailComposer = (contact: CRMContact) => {
    setEmailRecipient(contact.email);
    setEmailSubject(`Asesoramiento Estratégico & Finanzas · ${contact.companyName}`);
    setEmailBody(
      `Estimado/a ${contact.name},\n\nLe escribimos en relación a los servicios de consultoría estratégica y dirección financiera para ${contact.companyName}.\n\nQuedamos a su disposición para coordinar una reunión de trabajo o remitirle cualquier documentación complementaria.\n\nAtentamente,\nCr. Carlos Rodrigo Domínguez\nConsultoría Estratégica & CFO\ncarlos@crdominguez.ar`
    );
    setEmailStatusMsg(null);
    setShowEmailModal(true);
  };

  // Send Direct Email via Resend
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

      // Record interaction with contact
      const linked = contacts.find((c) => c.email === emailRecipient);
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

  // Save Minutes
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
    const matchesSearch = 
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVertical = selectedVertical === 'all' || l.vertical === selectedVertical;
    return matchesSearch && matchesVertical;
  });

  // Filtered Contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVertical = selectedVertical === 'all' || c.vertical === selectedVertical;
    const matchesStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter;
    return matchesSearch && matchesVertical && matchesStatus;
  });

  // Filtered Meetings
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pipeline total value calculation
  const totalPipelineBudget = leads.reduce((acc, curr) => acc + (curr.estimatedMonthlyBudgetUsd || 0), 0);
  const activeClientsCount = contacts.filter((c) => c.status === 'cliente_activo').length;
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
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0078D4] border border-blue-200">
                Cr Dominguez · Suite CRM 360°
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">WhatsApp · Resend · Calendario & Meet</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Gestión Comercial, Contactos & Agenda Ejecutiva
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Administración de oportunidades de negocio, comunicación multicanal y agendamiento de videollamadas con clientes y empresas.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Oportunidades</span>
              <span className="text-base font-black text-[#0078D4]">{leads.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Pipeline Total</span>
              <span className="text-base font-black text-slate-900">USD {totalPipelineBudget.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Contactos</span>
              <span className="text-base font-black text-indigo-600">{contacts.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Reuniones</span>
              <span className="text-base font-black text-[#107C41]">{upcomingMeetingsCount}</span>
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
              <Users className="w-3.5 h-3.5" />
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
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agenda de Contactos</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
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
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Calendario & Videollamadas</span>
              <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px]">
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
            {activeTab === 'pipeline' && (
              <button
                type="button"
                onClick={() => setShowLeadModal(true)}
                className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Lead</span>
              </button>
            )}

            {activeTab === 'contacts' && (
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Contacto</span>
              </button>
            )}

            {activeTab === 'calendar' && (
              <button
                type="button"
                onClick={() => handleOpenMeetingScheduler()}
                className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Agendar Videollamada</span>
              </button>
            )}

            {activeTab === 'tasks' && (
              <button
                type="button"
                onClick={() => setShowTaskModal(true)}
                className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Tarea</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GLOBAL SEARCH & VERTICAL FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
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
                ? 'Buscar contacto por nombre, empresa, WhatsApp, email, etiqueta...'
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Vertical:</span>
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

          {activeTab === 'contacts' && (
            <select
              value={contactStatusFilter}
              onChange={(e) => setContactStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
            >
              <option value="all">Todos los Vínculos</option>
              <option value="lead">Leads Calificados</option>
              <option value="cliente_activo">Clientes Activos</option>
              <option value="partner">Partners Estratégicos</option>
              <option value="proveedor">Proveedores</option>
              <option value="ex_cliente">Ex-clientes</option>
            </select>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PIPELINE DE OPORTUNIDADES (KANBAN) */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              const stageBudget = stageLeads.reduce((acc, curr) => acc + (curr.estimatedMonthlyBudgetUsd || 0), 0);

              return (
                <div key={stage.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex flex-col min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        stage.id === 'activo' ? 'bg-[#107C41]' :
                        stage.id === 'negociacion' ? 'bg-amber-600' :
                        stage.id === 'propuesta' ? 'bg-cyan-600' :
                        stage.id === 'diagnostico' ? 'bg-indigo-600' : 'bg-[#0078D4]'
                      }`} />
                      <h4 className="text-xs font-bold text-slate-800">{stage.label}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono mb-2 flex justify-between">
                    <span>Proyectado:</span>
                    <span className="font-bold text-slate-700">USD {stageBudget.toLocaleString()}/mes</span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                    {stageLeads.map((lead) => {
                      const vert = BUSINESS_VERTICALS[lead.vertical];
                      const linkedContact = contacts.find((c) => c.leadId === lead.id || c.name === lead.contactName);

                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white border border-slate-200 hover:border-[#0078D4] rounded-lg p-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0078D4] truncate block max-w-[150px]">
                              {vert?.shortTitle || lead.vertical}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              USD {lead.estimatedMonthlyBudgetUsd}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors leading-tight mb-1">
                            {lead.companyName}
                          </h5>

                          <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-2">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{lead.contactName}</span>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                            {lead.notes}
                          </p>

                          {/* Quick Actions in Card */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              {linkedContact?.whatsappNumber && (
                                <button
                                  type="button"
                                  title="Enviar WhatsApp"
                                  onClick={() => handleSendWhatsApp(linkedContact, 'propuesta')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Agendar Videollamada"
                                onClick={() => handleOpenMeetingScheduler(linkedContact)}
                                className="p-1 text-[#0078D4] hover:bg-blue-50 rounded transition-colors"
                              >
                                <Video className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Stage Transition Selector */}
                            <select
                              value={lead.stage}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none"
                            >
                              {STAGES.map((s) => (
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
                        Sin leads en esta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: AGENDA DE CONTACTOS INTEGRADA CON WHATSAPP Y EMAIL */}
      {/* ========================================================================= */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => {
              const vert = BUSINESS_VERTICALS[contact.vertical];
              const linkedLead = leads.find((l) => l.id === contact.leadId);
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
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-[#0078D4] font-black text-sm flex items-center justify-center">
                          {contact.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {contact.name}
                          </h4>
                          <span className="text-xs text-slate-500 font-medium block">
                            {contact.roleTitle}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Company & Details */}
                    <div className="space-y-1.5 py-2.5 my-2 border-y border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{contact.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{contact.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-[#0078D4] shrink-0" />
                        <span>{vert?.shortTitle || contact.vertical}</span>
                      </div>
                    </div>

                    {/* Direct Contact info */}
                    <div className="space-y-1 text-xs text-slate-600 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Email:</span>
                        <span className="font-mono text-slate-800 text-[11px] truncate max-w-[190px]">
                          {contact.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Tel / WA:</span>
                        <span className="font-mono text-slate-800 text-[11px]">
                          {contact.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Último contacto:</span>
                        <span>{new Date(contact.lastContactDate).toLocaleDateString('es-AR')}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {contact.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Notes snippet */}
                    {contact.notes && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed mb-4 italic">
                        "{contact.notes}"
                      </p>
                    )}
                  </div>

                  {/* BOTTOM ACTION BUTTONS: WhatsApp, Email, Video Meet */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(contact, 'general')}
                      className="px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEmailComposer(contact)}
                      className="px-2 py-2 bg-blue-50 hover:bg-blue-100 text-[#0078D4] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0078D4]" />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenMeetingScheduler(contact)}
                      className="px-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
                    >
                      <Video className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Reunión</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredContacts.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-xl">
                <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No se encontraron contactos</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Modifique los filtros de búsqueda o registre un nuevo contacto para incorporarlo a la agenda.
                </p>
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="mt-4 px-4 py-2 bg-[#0078D4] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#106EBE]"
                >
                  + Registrar Contacto
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CALENDARIO DE REUNIONES, ACTIVIDADES & VIDEOLLAMADAS */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLS: Interactive Calendar View */}
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

              {/* Calendar Footer Info */}
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

            {/* RIGHT COL: Upcoming Meetings List & Action Center */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Agenda Próxima</h4>
                    <span className="text-[11px] text-slate-500">Reuniones y comités registrados</span>
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
                        {/* Header */}
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

                        {/* Company & Attendee */}
                        <div className="text-[11px] text-slate-600 space-y-0.5 mb-2">
                          <p className="font-semibold text-slate-800">{m.companyName}</p>
                          <p className="text-slate-500">Con: {m.contactName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Fecha: {m.date} ({m.startTime} - {m.endTime} hs)</p>
                        </div>

                        {/* Meeting URL */}
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

                        {/* Minutes note indicator */}
                        {m.notesMinutes ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-[11px] text-emerald-900 mb-2.5">
                            <span className="font-bold block text-[10px] uppercase text-emerald-800">Minuta guardada:</span>
                            <p className="line-clamp-2 italic">{m.notesMinutes}</p>
                          </div>
                        ) : null}

                        {/* ACTION BUTTONS FOR EACH MEETING */}
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

                          {linkedContact?.whatsappNumber && (
                            <button
                              type="button"
                              title="Enviar recordatorio por WhatsApp"
                              onClick={() => {
                                const waMsg = encodeURIComponent(
                                  `Hola ${m.contactName}, te recuerdo nuestra reunión con Cr. Carlos Rodrigo Domínguez:\n` +
                                  `📅 ${m.date} a las ${m.startTime} hs.\n` +
                                  `Enlace: ${m.meetingUrl}`
                                );
                                window.open(`https://wa.me/${linkedContact.whatsappNumber}?text=${waMsg}`, '_blank');
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
                            title="Agregar a Google Calendar"
                          >
                            <CalendarIcon className="w-3 h-3" />
                            <span>GCal</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDownloadIcs(m)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1"
                            title="Descargar archivo .ICS para Outlook / Apple Calendar"
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
                            title="Redactar o editar minuta de acuerdos"
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
                    onChange={() => {}} // handled by parent onClick
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
      {/* MODAL: AGENDAR VIDEOLLAMADA / REUNIÓN */}
      {/* ========================================================================= */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
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
                  Contacto / Participante de la Agenda
                </label>
                <select
                  value={meetingContactId}
                  onChange={(e) => {
                    setMeetingContactId(e.target.value);
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
                      {c.name} · {c.companyName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

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
                  Enlace Personalizado de Videollamada (Opcional)
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

              {/* Notification Toggles */}
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
                  <span>Abrir WhatsApp para enviar confirmación instantánea al contacto</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
      {/* MODAL: NUEVO CONTACTO EN AGENDA */}
      {/* ========================================================================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Registrar Contacto en Agenda</h3>
                  <p className="text-[11px] text-slate-500">Integración con WhatsApp directo y correo institucional</p>
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

            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ing. Marcos Vallejos"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Empresa / Razón Social *</label>
                  <input
                    type="text"
                    required
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    placeholder="Cooperativa Lanera Patagónica"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Cargo / Función</label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="Director General / Gerente de Finanzas"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Vínculo Comercial</label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contacto@empresa.com.ar"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">WhatsApp (con código de país)</label>
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
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Localidad</label>
                  <input
                    type="text"
                    value={contactLocation}
                    onChange={(e) => setContactLocation(e.target.value)}
                    placeholder="Trelew / Puerto Madryn, Chubut"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Vertical</label>
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
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={contactTags}
                  onChange={(e) => setContactTags(e.target.value)}
                  placeholder="Costos, Franquicias, Parque Industrial"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">Notas / Antecedentes</label>
                <textarea
                  rows={2}
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  placeholder="Detalle sobre acuerdos, necesidades o historial..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Guardar Contacto
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
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

              <div className="flex items-center justify-between pt-2">
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
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

              <div className="flex justify-end gap-2 pt-2">
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
      {/* MODAL: NUEVO LEAD */}
      {/* ========================================================================= */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Crear Oportunidad / Lead en Pipeline</h3>
              <button
                type="button"
                onClick={() => setShowLeadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Empresa / Razón Social *</label>
                <input
                  type="text"
                  required
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="Ej: Frigorífico Austral SAS"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Contacto Principal *</label>
                <input
                  type="text"
                  required
                  value={newLeadContact}
                  onChange={(e) => setNewLeadContact(e.target.value)}
                  placeholder="Ej: Lic. Martín Rossi"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="martin@empresa.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+54 280 4..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Vertical</label>
                <select
                  value={newLeadVertical}
                  onChange={(e) => setNewLeadVertical(e.target.value as any)}
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
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Presupuesto Mensual Estimado (USD)</label>
                <input
                  type="number"
                  value={newLeadBudget}
                  onChange={(e) => setNewLeadBudget(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Crear Oportunidad
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
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
              <div className="flex justify-end gap-2 pt-2">
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
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
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
                {STAGES.map((s) => (
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
              <button
                type="button"
                onClick={() => {
                  const linked = contacts.find((c) => c.leadId === selectedLead.id || c.name === selectedLead.contactName);
                  handleOpenMeetingScheduler(linked);
                  setSelectedLead(null);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0078D4] font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Agendar Videollamada</span>
              </button>

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
