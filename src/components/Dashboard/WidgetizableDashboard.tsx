import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  Mail, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  Send, 
  Eye, 
  RotateCcw, 
  ExternalLink, 
  UserCheck, 
  Lock, 
  AlertCircle,
  Key,
  Globe,
  Settings,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Check,
  X
} from 'lucide-react';
import { dbRepository } from '../../lib/supabaseClient';
import { userService } from '../../lib/userService';
import { resendService } from '../../lib/resendService';
import { 
  Lead, 
  CRMTask, 
  LeadStage, 
  SystemUser, 
  UserRole, 
  ResendConfig, 
  ResendEmailLog, 
  DashboardWidgetConfig, 
  WidgetId 
} from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { InternalCRM } from '../CRM/InternalCRM';

interface WidgetizableDashboardProps {
  initialView?: 'widgets' | 'crm';
  onNavigateTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo') => void;
  onOpenConsultationModal: () => void;
}

const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'crm_pipeline', title: 'Embudo CRM & Leads en Vivo', category: 'negocio', enabled: true, order: 1, width: 'full' },
  { id: 'crm_tasks', title: 'Tareas y Dictámenes Normativos', category: 'operaciones', enabled: true, order: 2, width: 'half' },
  { id: 'financial_kpis', title: 'Métricas de Cartera & Clientes Activos', category: 'negocio', enabled: true, order: 3, width: 'half' },
  { id: 'resend_email', title: 'Integración Resend.com (Plan Free)', category: 'marketing', enabled: true, order: 4, width: 'full' },
  { id: 'seo_health', title: 'Salud SEO & Posicionamiento Chubut', category: 'marketing', enabled: true, order: 5, width: 'half' },
  { id: 'seo_queries', title: 'Consultas Google Search Console', category: 'marketing', enabled: true, order: 6, width: 'half' },
  { id: 'blog_publishing', title: 'Publicación de Blog & Difusión por Email', category: 'marketing', enabled: true, order: 7, width: 'full' },
  { id: 'user_management', title: 'Centro de Control de Usuarios (RBAC)', category: 'usuarios', enabled: true, order: 8, width: 'full' },
];

export const WidgetizableDashboard: React.FC<WidgetizableDashboardProps> = ({ 
  initialView = 'widgets',
  onNavigateTab, 
  onOpenConsultationModal 
}) => {
  const [dashboardView, setDashboardView] = useState<'widgets' | 'crm'>(initialView);

  useEffect(() => {
    if (initialView) {
      setDashboardView(initialView);
    }
  }, [initialView]);

  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dl_dashboard_widgets');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_WIDGETS;
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [currentUser, setCurrentUser] = useState<SystemUser>(userService.getCurrentUser());
  const [resendConfig, setResendConfig] = useState<ResendConfig>(resendService.getConfig());
  const [resendLogs, setResendLogs] = useState<ResendEmailLog[]>(resendService.getLogs());

  // Widget customizer modal state
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'negocio' | 'marketing' | 'operaciones' | 'usuarios'>('all');

  // Quick action states
  const [testEmailTo, setTestEmailTo] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailSuccess, setTestEmailSuccess] = useState<string | null>(null);
  const [showResendConfigModal, setShowResendConfigModal] = useState(false);
  const [inputApiKey, setInputApiKey] = useState(resendConfig.apiKey);

  // Quick Blog Post state
  const [quickPostTitle, setQuickPostTitle] = useState('');
  const [quickPostCategory, setQuickPostCategory] = useState('Tributario');
  const [quickPostExcerpt, setQuickPostExcerpt] = useState('');
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [postPublishedSuccess, setPostPublishedSuccess] = useState<string | null>(null);

  // New User Modal State
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('consultor_staff');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('');

  // Quick Task State
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCompany, setQuickTaskCompany] = useState('');

  const loadAllData = async () => {
    const l = await dbRepository.getLeads();
    const t = await dbRepository.getTasks();
    setLeads(l);
    setTasks(t);
    setUsers(userService.getUsers());
    setCurrentUser(userService.getCurrentUser());
    setResendConfig(resendService.getConfig());
    setResendLogs(resendService.getLogs());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const saveWidgetsConfig = (updated: DashboardWidgetConfig[]) => {
    setWidgets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dl_dashboard_widgets', JSON.stringify(updated));
    }
  };

  const toggleWidget = (id: WidgetId) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    saveWidgetsConfig(updated);
  };

  const resetWidgets = () => {
    saveWidgetsConfig(DEFAULT_WIDGETS);
  };

  const isWidgetVisible = (id: WidgetId) => {
    const found = widgets.find((w) => w.id === id);
    return found ? found.enabled : true;
  };

  // Handlers for Resend
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTo) return;
    setIsSendingTestEmail(true);
    setTestEmailSuccess(null);

    try {
      const res = await resendService.sendEmail({
        to: [testEmailTo],
        subject: 'Verificación de Integración Resend.com · Estudio D&L',
        text: 'La conexión con Resend.com (Plan Free) está operando correctamente desde el Estudio Contable Domínguez & Lambrecht.',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #0078D4;">Prueba Exitosa de Resend.com</h3>
            <p>Este es un email de verificación emitido desde el <strong>Dashboard Ejecutivo</strong>.</p>
            <p><strong>Remitente:</strong> ${resendConfig.senderEmail}</p>
            <p><strong>Cuota restante hoy:</strong> ${resendConfig.dailyQuotaMax - (resendConfig.dailyQuotaUsed + 1)} envíos</p>
          </div>
        `,
        type: 'system_test',
      });
      setTestEmailSuccess(`Email enviado con éxito (ID: ${res.messageId})`);
      setTestEmailTo('');
      setResendConfig(resendService.getConfig());
      setResendLogs(resendService.getLogs());
    } catch (err: any) {
      setTestEmailSuccess(`Error: ${err.message || 'No se pudo enviar'}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSaveResendKey = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = resendService.saveConfig({ apiKey: inputApiKey.trim() });
    setResendConfig(updated);
    setShowResendConfigModal(false);
  };

  // Handlers for Quick Blog Publish
  const handleQuickPublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPostTitle || !quickPostExcerpt) return;
    setIsPublishingPost(true);
    setPostPublishedSuccess(null);

    try {
      let emailNotice = '';
      if (notifySubscribers) {
        const res = await resendService.sendBlogNewsletter({
          title: quickPostTitle,
          excerpt: quickPostExcerpt,
          category: quickPostCategory,
          author: currentUser.name,
          slug: quickPostTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
        emailNotice = ` y notificado a ${res.count} clientes vía Resend.com Free`;
      }

      setPostPublishedSuccess(`Artículo publicado con éxito${emailNotice}.`);
      setQuickPostTitle('');
      setQuickPostExcerpt('');
      setResendConfig(resendService.getConfig());
      setResendLogs(resendService.getLogs());
    } catch (err: any) {
      setPostPublishedSuccess(`Error: ${err.message}`);
    } finally {
      setIsPublishingPost(false);
    }
  };

  // User Management Handlers
  const handleSwitchUser = (userId: string) => {
    const updated = userService.setCurrentUser(userId);
    setCurrentUser(updated);
  };

  const handleToggleUserActive = (userId: string) => {
    userService.toggleUserStatus(userId);
    setUsers(userService.getUsers());
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    userService.updateUserRole(userId, newRole);
    setUsers(userService.getUsers());
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    userService.addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      title: newUserTitle || 'Miembro del Estudio',
      department: newUserDepartment || 'Consultoría',
      isActive: true,
      phone: '+54 280 400-0000',
    });

    setUsers(userService.getUsers());
    setShowNewUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTitle('');
    setNewUserDepartment('');
  };

  // Task Handler
  const handleToggleTask = async (taskId: string) => {
    await dbRepository.toggleTaskCompletion(taskId);
    await loadAllData();
  };

  const handleCreateQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle) return;

    await dbRepository.createTask({
      title: quickTaskTitle,
      companyName: quickTaskCompany || 'General D&L',
      assignedRole: currentUser.role === 'super_admin' || currentUser.role === 'admin' ? 'socio' : 'consultor',
      dueDate: 'En 48 hs',
      priority: 'urgente',
    });

    setQuickTaskTitle('');
    setQuickTaskCompany('');
    await loadAllData();
  };

  const handleStageChange = async (leadId: string, stage: LeadStage) => {
    await dbRepository.updateLeadStage(leadId, stage);
    await loadAllData();
  };

  return (
    <div className="w-full space-y-8 bg-[#F8FAFC] pb-16">
      {/* Top Executive Header */}
      <div className="w-full bg-white border-b border-slate-200 px-6 sm:px-12 lg:px-20 py-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0078D4] uppercase tracking-wider mb-1.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Panel de Control & Centro de Operaciones</span>
              <span>·</span>
              <span className="text-slate-500">Trelew, Chubut</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Ejecutivo
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Gestión unificada de Pipeline CRM, Control SEO orgánico, envíos transaccionales con <strong>Resend.com (Plan Free)</strong> y matriz de roles de usuarios y clientes.
            </p>
          </div>

          {/* Action Toolbar: View Switcher, Customizer & Role Identity */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher: Widgets vs CRM Integrado */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setDashboardView('widgets')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  dashboardView === 'widgets'
                    ? 'bg-white text-[#0078D4] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Vista Widgets</span>
              </button>
              <button
                type="button"
                onClick={() => setDashboardView('crm')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  dashboardView === 'crm'
                    ? 'bg-white text-[#0078D4] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Gestión CRM</span>
                <span className="ml-0.5 px-1.5 py-0.2 bg-blue-100 text-[#0078D4] rounded-full text-[10px] font-bold">
                  {leads.length}
                </span>
              </button>
            </div>

            {dashboardView === 'widgets' && (
              <button
                type="button"
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-md shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#0078D4]" />
                <span>Personalizar ({widgets.filter((w) => w.enabled).length}/{widgets.length})</span>
              </button>
            )}

            {/* Current User Badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md">
              <div className="w-6 h-6 rounded-full bg-[#0078D4] text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {userService.getRoleLabel(currentUser.role)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget Customizer Drawer / Dropdown */}
        {showCustomizer && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-xs space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0078D4]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Configuración de Widgets en Pantalla
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetWidgets}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar Valores por Defecto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomizer(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium mr-1">Filtrar por:</span>
              {(['all', 'negocio', 'marketing', 'operaciones', 'usuarios'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-[#0078D4] text-white' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'Todos los Widgets' : cat}
                </button>
              ))}
            </div>

            {/* Checkbox grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {widgets
                .filter((w) => selectedCategory === 'all' || w.category === selectedCategory)
                .map((w) => (
                  <label
                    key={w.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      w.enabled ? 'bg-white border-blue-200 text-slate-900' : 'bg-slate-100/60 border-slate-200 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={w.enabled}
                      onChange={() => toggleWidget(w.id)}
                      className="rounded text-[#0078D4] focus:ring-[#0078D4]"
                    />
                    <div className="flex-1">
                      <span className="font-semibold block">{w.title}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">{w.category}</span>
                    </div>
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content: CRM Integrado or Widgets Board */}
      {dashboardView === 'crm' ? (
        <div className="w-full px-6 sm:px-12 lg:px-20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Users className="w-4 h-4 text-[#0078D4]" />
              <span>Módulo CRM Integrado</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-normal">Pipeline de Oportunidades & Gestión de Clientes en Vivo</span>
            </div>
            <button
              type="button"
              onClick={() => setDashboardView('widgets')}
              className="text-xs font-bold text-[#0078D4] hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Volver a Vista Widgets</span>
            </button>
          </div>

          <InternalCRM currentRole={currentUser.role} />
        </div>
      ) : (
        <div className="w-full px-6 sm:px-12 lg:px-20 space-y-6">
          
          {/* ROW 1: CRM Pipeline & Quick Actions (Full width) */}
          {isWidgetVisible('crm_pipeline') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0078D4] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Embudo CRM & Leads Calificados</h3>
                    <p className="text-xs text-slate-500">Pipeline en tiempo real con diagnóstico y presupuestos proyectados</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDashboardView('crm')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Abrir CRM Completo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { id: 'nuevo', label: 'Nuevo Diagnóstico', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
                { id: 'diagnostico', label: 'Evaluación Técnica', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
                { id: 'propuesta', label: 'Propuesta / Modelo', color: 'border-sky-400 bg-sky-50/40 text-sky-800' },
                { id: 'negociacion', label: 'Negociación Socio', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
                { id: 'activo', label: 'Cliente Activo', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
              ].map((stage) => {
                const stageLeads = leads.filter((l) => l.stage === stage.id);
                const totalStageBudget = stageLeads.reduce((acc, curr) => acc + (curr.estimatedMonthlyBudgetUsd || 0), 0);

                return (
                  <div key={stage.id} className="bg-slate-50/80 border border-slate-200 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-white border border-slate-200 text-slate-700">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      Subtotal: <strong className="text-slate-800 font-sans">USD {totalStageBudget.toLocaleString()}</strong>
                    </div>

                    {/* Lead cards within stage */}
                    <div className="space-y-2">
                      {stageLeads.slice(0, 2).map((lead) => (
                        <div key={lead.id} className="bg-white border border-slate-200 rounded-md p-2.5 shadow-xs space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 truncate max-w-[120px]">{lead.companyName}</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-blue-50 text-[#0078D4] rounded">
                              {lead.score}/100
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate">{lead.contactName}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                            <span className="text-slate-500 font-mono">USD {lead.estimatedMonthlyBudgetUsd}/m</span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextStageMap: Record<LeadStage, LeadStage> = {
                                  nuevo: 'diagnostico',
                                  diagnostico: 'propuesta',
                                  propuesta: 'negociacion',
                                  negociacion: 'activo',
                                  activo: 'activo',
                                };
                                handleStageChange(lead.id, nextStageMap[lead.stage]);
                              }}
                              className="text-[#0078D4] hover:underline font-semibold"
                            >
                              Avanzar →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ROW 2: Split Half-Width Widgets (CRM Tasks & Financial KPIs) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Widget: CRM Tasks */}
          {isWidgetVisible('crm_tasks') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#107C41]" />
                    <h3 className="text-sm font-bold text-slate-900">Tareas & Dictámenes Pendientes</h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    {tasks.filter((t) => !t.completed).length} pendientes
                  </span>
                </div>

                {/* Quick Add Task */}
                <form onSubmit={handleCreateQuickTask} className="flex gap-2">
                  <input
                    type="text"
                    value={quickTaskTitle}
                    onChange={(e) => setQuickTaskTitle(e.target.value)}
                    placeholder="Nueva tarea (ej. Auditar Circular de Franquicia art. 1514)..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0078D4]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded transition-colors"
                  >
                    Agregar
                  </button>
                </form>

                {/* Task List */}
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        task.completed 
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                          : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#0078D4]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{task.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            task.priority === 'urgente' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                          <span>{task.companyName}</span>
                          <span>·</span>
                          <span>Vence: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Supervisión: Cr. Carlos Rodrigo Domínguez</span>
                <button type="button" onClick={() => onNavigateTab('crm')} className="text-[#0078D4] hover:underline font-semibold">
                  Gestionar todas en CRM →
                </button>
              </div>
            </div>
          )}

          {/* Widget: Financial KPIs */}
          {isWidgetVisible('financial_kpis') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0078D4]" />
                  <h3 className="text-sm font-bold text-slate-900">Métricas de Cartera & Clientes Activos</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Patagonia Q4-2026
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">MRR Contratos Activos</span>
                  <span className="text-xl font-black text-slate-900 font-mono tabular-nums">USD 14,800</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+18% vs trimestre ant.</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Cartera Auditada</span>
                  <span className="text-xl font-black text-slate-900 font-mono tabular-nums">USD 45M+</span>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">En flujos y modelos</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Horas CFO Fraccional</span>
                  <span className="text-xl font-black text-[#0078D4] font-mono tabular-nums">84 / 100 h</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Capacidad al 84%</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Índice Salud Fiscal</span>
                  <span className="text-xl font-black text-[#107C41] font-mono tabular-nums">96.4%</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Sin contingencias AFIP</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
                <span>Portal de Clientes Activo con 3 empresas integradas</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('portal')}
                  className="text-xs font-bold text-[#0078D4] hover:underline"
                >
                  Ver Portal Clientes →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ROW 3: Resend.com Free Tier Integration Widget (Full width) */}
        {isWidgetVisible('resend_email') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#107C41] flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Integración Resend.com</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      PLAN FREE ACTIVO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Envíos transaccionales, alertas de nuevos leads y difusión de artículos de blog
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResendConfigModal(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-slate-600" />
                  <span>Configurar API Key</span>
                </button>
              </div>
            </div>

            {/* Quota usage gauges for Free Tier (100/day, 3000/month) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Cuota Diaria (Plan Free)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {resendConfig.dailyQuotaUsed} / {resendConfig.dailyQuotaMax}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0078D4] rounded-full transition-all duration-500"
                    style={{ width: `${(resendConfig.dailyQuotaUsed / resendConfig.dailyQuotaMax) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {resendConfig.dailyQuotaMax - resendConfig.dailyQuotaUsed} envíos restantes para hoy
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Cuota Mensual (Plan Free)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {resendConfig.monthlyQuotaUsed} / {resendConfig.monthlyQuotaMax}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#107C41] rounded-full transition-all duration-500"
                    style={{ width: `${(resendConfig.monthlyQuotaUsed / resendConfig.monthlyQuotaMax) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {resendConfig.monthlyQuotaMax - resendConfig.monthlyQuotaUsed} disponibles en el ciclo mensual
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                <span className="text-slate-600 font-medium block">Remitente Configurado</span>
                <span className="font-mono font-bold text-slate-900 block truncate">
                  {resendConfig.senderEmail}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {resendConfig.isVerifiedDomain ? 'Dominio Verificado (DKIM/SPF OK)' : 'Modo sandbox oficial onboarding@resend.dev'}
                </span>
              </div>
            </div>

            {/* Quick Test Email Dispatch Bar */}
            <form onSubmit={handleSendTestEmail} className="p-4 bg-blue-50/40 border border-blue-200 rounded-lg space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Disparador de Prueba Resend.com
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  placeholder="Introduce email de destino (ej. tu_email@gmail.com)..."
                  className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  required
                />
                <button
                  type="submit"
                  disabled={isSendingTestEmail}
                  className="px-4 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTestEmail ? 'Enviando...' : 'Enviar Prueba'}</span>
                </button>
              </div>

              {testEmailSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 font-medium">
                  {testEmailSuccess}
                </div>
              )}
            </form>

            {/* Recent Email Logs Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Últimos Envíos Registrados vía Resend
              </span>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Destinatario</th>
                      <th className="py-2.5 px-3">Asunto</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resendLogs.slice(0, 4).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{log.to.join(', ')}</td>
                        <td className="py-2.5 px-3 text-slate-700 truncate max-w-xs">{log.subject}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                            {log.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Entregado</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ROW 4: Split SEO Health & Google Search Console Queries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Widget: SEO Health */}
          {isWidgetVisible('seo_health') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0078D4]" />
                  <h3 className="text-sm font-bold text-slate-900">Salud SEO & Posicionamiento Patagónico</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('seo')}
                  className="text-xs text-[#0078D4] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Panel SEO</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-black font-mono leading-none">98</span>
                  <span className="text-[9px] font-bold">/ 100</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Auditoría Técnica Impecable</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Meta-etiquetado corporativo, OpenGraph dinámico, tarjetas Twitter y JSON-LD estructurado para <em>AccountingService</em> en Trelew y Chubut.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Indexación Googlebot</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Rastreado
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Sitemap XML & Robots.txt</span>
                  <span className="text-slate-900 font-mono font-medium">/sitemap.xml (OK)</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Estructura Schema.org</span>
                  <span className="text-[#0078D4] font-semibold">FinancialService & LocalBusiness</span>
                </div>
              </div>
            </div>
          )}

          {/* Widget: Google Search Console Queries */}
          {isWidgetVisible('seo_queries') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0078D4]" />
                  <h3 className="text-sm font-bold text-slate-900">Consultas Google Search Console (Chubut)</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Últimos 28 días</span>
              </div>

              <div className="space-y-2">
                {[
                  { query: 'estudio contable trelew', pos: '1.2', clicks: 342, ctr: '14.8%' },
                  { query: 'franquicias ccyc 1514 recupero', pos: '2.1', clicks: 189, ctr: '11.2%' },
                  { query: 'factura e software banco chubut', pos: '1.8', clicks: 154, ctr: '13.5%' },
                  { query: 'cfo fraccional pymes patagonia', pos: '1.4', clicks: 98, ctr: '16.0%' },
                  { query: 'zero human companies contabilidad', pos: '2.4', clicks: 64, ctr: '9.4%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900">{item.query}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Posición media: #{item.pos}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-800">{item.clicks} clics</span>
                      <span className="text-[10px] text-emerald-600 block">{item.ctr} CTR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ROW 5: Blog Publishing & Resend Distribution (Full width) */}
        {isWidgetVisible('blog_publishing') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Publicador de Blog & Difusión Automática</h3>
                  <p className="text-xs text-slate-500">
                    Crea y publica dictámenes con despacho automático a la lista de clientes suscrita por Resend.com
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('blog')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>Ver Blog Público</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Publish Form */}
            <form onSubmit={handleQuickPublishPost} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Título del Artículo</label>
                  <input
                    type="text"
                    value={quickPostTitle}
                    onChange={(e) => setQuickPostTitle(e.target.value)}
                    placeholder="Ej. Claves para liquidar divisas de exportación en Banco del Chubut..."
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0078D4]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Eje / Categoría</label>
                  <select
                    value={quickPostCategory}
                    onChange={(e) => setQuickPostCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  >
                    <option value="Tributario">Tributario</option>
                    <option value="Finanzas & CFO">Finanzas & CFO</option>
                    <option value="Franquicias">Franquicias</option>
                    <option value="Economía del Conocimiento">Economía del Conocimiento</option>
                    <option value="Empresas 100% IA">Empresas 100% IA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Resumen Ejecutivo</label>
                <textarea
                  value={quickPostExcerpt}
                  onChange={(e) => setQuickPostExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Síntesis doctrinal para los clientes del estudio..."
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySubscribers}
                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                    className="rounded text-[#0078D4] focus:ring-[#0078D4]"
                  />
                  <span>Despachar boletín a clientes suscritos vía Resend.com Free Plan</span>
                </label>

                <button
                  type="submit"
                  disabled={isPublishingPost}
                  className="px-5 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPublishingPost ? 'Publicando y Despachando...' : 'Publicar y Difundir'}</span>
                </button>
              </div>

              {postPublishedSuccess && (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200 font-medium">
                  {postPublishedSuccess}
                </div>
              )}
            </form>
          </div>
        )}

        {/* ROW 6: RBAC User Management Widget (Full width) */}
        {isWidgetVisible('user_management') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Control de Usuarios & Matriz de Roles (RBAC)</h3>
                  <p className="text-xs text-slate-500">
                    Administración de socios, consultores staff, auditores externos y accesos al portal de clientes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(true)}
                  className="px-3 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Usuario</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Email / Teléfono</th>
                    <th className="py-3 px-4">Rol en la Plataforma</th>
                    <th className="py-3 px-4">Departamento / Entidad</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const badge = userService.getRoleBadgeColor(user.role);
                    const isCurrent = user.id === currentUser.id;

                    return (
                      <tr key={user.id} className={`hover:bg-slate-50/70 ${isCurrent ? 'bg-blue-50/30' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{user.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{user.title}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono text-slate-700 block">{user.email}</span>
                          <span className="text-[10px] text-slate-400">{user.phone || 'Sin teléfono'}</span>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border} focus:outline-none cursor-pointer`}
                          >
                            <option value="super_admin">Super Admin (Socio)</option>
                            <option value="admin">Administrador (Socio)</option>
                            <option value="consultor_staff">Consultor Staff</option>
                            <option value="auditor_externo">Auditor Externo</option>
                            <option value="cliente">Cliente Portal</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {user.department || user.companyName || 'Estudio Domínguez & Lambrecht'}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleUserActive(user.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.isActive 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {user.isActive ? 'Activo' : 'Suspendido'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          {isCurrent ? (
                            <span className="text-[11px] font-bold text-[#0078D4] px-2 py-1 bg-blue-50 rounded">
                              Sesión Actual
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSwitchUser(user.id)}
                              className="px-2.5 py-1 text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Iniciar como →
                            </button>
                          )}
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

      {/* Modal: Configurar API Key de Resend.com */}
      {showResendConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0078D4]" />
                <h3 className="text-sm font-bold text-slate-900">Configuración de Resend.com</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResendConfigModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResendKey} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                El plan <strong>Free de Resend</strong> permite enviar hasta <strong>100 emails por día (3,000 por mes)</strong> gratis. Introduce tu clave que comienza con <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">re_</code>.
              </p>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">RESEND_API_KEY</label>
                <input
                  type="text"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  placeholder="re_1234567890abcdef..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Email Remitente (Sender)</label>
                <input
                  type="text"
                  defaultValue={resendConfig.senderEmail}
                  className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-600 cursor-not-allowed"
                  disabled
                />
                <span className="text-[10px] text-slate-500 block">
                  En el plan Free sin dominio propio verificado se utiliza el remitente oficial de prueba <em>onboarding@resend.dev</em>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResendConfigModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold rounded shadow-xs"
                >
                  Guardar Clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Nuevo Usuario */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0078D4]" />
                <h3 className="text-sm font-bold text-slate-900">Alta de Nuevo Usuario / Cliente</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewUserModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Nombre Completo</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ej. Cra. Romina Calvo..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Correo Electrónico</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Rol</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  >
                    <option value="super_admin">Super Admin (Socio)</option>
                    <option value="admin">Administrador (Socio)</option>
                    <option value="consultor_staff">Consultor Staff</option>
                    <option value="auditor_externo">Auditor Externo</option>
                    <option value="cliente">Cliente Portal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Cargo / Título</label>
                  <input
                    type="text"
                    value={newUserTitle}
                    onChange={(e) => setNewUserTitle(e.target.value)}
                    placeholder="Ej. Asesor Tributario"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Departamento o Empresa Representada</label>
                <input
                  type="text"
                  value={newUserDepartment}
                  onChange={(e) => setNewUserDepartment(e.target.value)}
                  placeholder="Ej. D&L Trelew o Nombre de Empresa Cliente"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold rounded shadow-xs"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
