import React, { useState, useEffect } from 'react';
import { dbRepository } from '../../lib/supabaseClient';
import { ClientProfile, DeliverableReport, AdvisoryTicket, ClientDocument, PortalViewId } from '../../types';
import {
  FileText,
  Download,
  MessageSquare,
  Send,
  ChevronRight,
  Menu,
  LayoutDashboard,
  FolderLock,
  CalendarCheck,
  Building2,
  Upload,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Eye,
  Plus
} from 'lucide-react';
import { ClientPortalSidebar } from './ClientPortalSidebar';
import { ClientDocumentManager } from './ClientDocumentManager';
import { ClientFiscalCalendar } from './ClientFiscalCalendar';
import { ClientCompanyProfile } from './ClientCompanyProfile';

interface ClientPortalProps {
  onNavigateTab?: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onNavigateTab }) => {
  const [profile] = useState<ClientProfile>(dbRepository.getClientProfile());
  const [portalView, setPortalView] = useState<PortalViewId>('resumen');
  const [reports, setReports] = useState<DeliverableReport[]>([]);
  const [tickets, setTickets] = useState<AdvisoryTicket[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dl_portal_sidebar_collapsed') === 'true';
    }
    return false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dl_portal_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  // New ticket form
  const [newSubject, setNewSubject] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newCategory, setNewCategory] = useState<AdvisoryTicket['category']>('tributaria');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<DeliverableReport | null>(null);

  const loadData = async () => {
    const reps = await dbRepository.getReports();
    const tkts = await dbRepository.getTickets();
    const docs = await dbRepository.getClientDocuments(profile.id);
    setReports(reps);
    setTickets(tkts);
    setDocuments(docs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newQuestion) return;

    setIsSubmittingTicket(true);
    try {
      const created = await dbRepository.createTicket({
        clientId: profile.id,
        clientName: profile.companyName,
        subject: newSubject,
        question: newQuestion,
        category: newCategory,
        priority: 'alta',
      });
      setTickets([created, ...tickets]);
      setNewSubject('');
      setNewQuestion('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleUploadDocument = async (docData: Omit<ClientDocument, 'id' | 'uploadDate'>) => {
    await dbRepository.uploadClientDocument(docData);
    await loadData();
  };

  const handleDeleteDocument = async (docId: string) => {
    await dbRepository.deleteClientDocument(docId);
    await loadData();
  };

  const pendingReviewDocs = documents.filter((d) => d.status === 'en_revision');
  const openTickets = tickets.filter((t) => t.status !== 'resuelto');

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Collapsible Left Sidebar */}
      <ClientPortalSidebar
        activeView={portalView}
        onSelectView={(view) => setPortalView(view)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        profile={profile}
        onExitToWebsite={() => onNavigateTab && onNavigateTab('landing')}
        documentsCount={documents.length}
        pendingReviewCount={pendingReviewDocs.length}
        reportsCount={reports.length}
        openTicketsCount={openTickets.length}
      />

      {/* Main Viewport Content Area */}
      <div className="flex-1 min-w-0 flex flex-col pb-16">
        {/* Top Header Bar */}
        <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 shadow-xs sticky top-0 z-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Abrir menú del portal"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0078D4] uppercase tracking-wider mb-1">
                  <FolderLock className="w-3.5 h-3.5" />
                  <span>Portal de Clientes Activos</span>
                  <span>·</span>
                  <span className="text-slate-500">{profile.companyName}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {portalView === 'resumen' && 'Visión General & Resumen de Cuenta'}
                  {portalView === 'documentacion' && 'Bóveda Documental & Archivos Fiscales'}
                  {portalView === 'reportes' && 'Repositorio de Reportes & Dictámenes'}
                  {portalView === 'consultas' && 'Consultas Directas al Cr. Rodrigo Domínguez'}
                  {portalView === 'calendario' && 'Calendario Fiscal & Vencimientos'}
                  {portalView === 'datos_empresa' && 'Datos Societarios & Constancias'}
                </h1>
              </div>
            </div>

            {/* Quick Actions & Client Pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              {portalView !== 'documentacion' && (
                <button
                  type="button"
                  onClick={() => setPortalView('documentacion')}
                  className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Documento</span>
                </button>
              )}

              {portalView !== 'consultas' && (
                <button
                  type="button"
                  onClick={() => setPortalView('consultas')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0078D4]" />
                  <span>Nueva Consulta</span>
                </button>
              )}

              {/* Client Pill */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#0078D4] text-white flex items-center justify-center font-bold text-[10px]">
                  {profile.companyName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[140px]">
                    {profile.companyName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    CUIT: {profile.cuit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Viewport Content Router */}
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6">
          {portalView === 'documentacion' ? (
            <ClientDocumentManager
              documents={documents}
              profile={profile}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          ) : portalView === 'calendario' ? (
            <ClientFiscalCalendar
              profile={profile}
              onNavigateView={(v) => setPortalView(v)}
            />
          ) : portalView === 'datos_empresa' ? (
            <ClientCompanyProfile
              profile={profile}
              onNavigateView={(v) => setPortalView(v)}
            />
          ) : portalView === 'reportes' ? (
            /* Standalone Reports Repository */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Repositorio de Reportes & Dictámenes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informes de franquicias, VAN/TIR, punto de equilibrio y compliance ZHC auditados por el estudio
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {reports.length} documentos auditados
                </span>
              </div>

              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-xs transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-[#0078D4] rounded-lg shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {report.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>{report.date}</span>
                            <span>·</span>
                            <span>{report.version}</span>
                            <span>·</span>
                            <span className="text-[#107C41] font-medium">Auditado por {report.author}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>Ver Métricas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2 pl-9">
                      {report.summary}
                    </p>

                    {/* Key Metrics Strip */}
                    <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-4 pl-9">
                      {report.keyMetrics.map((km, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="text-slate-500 block text-[11px]">{km.label}:</span>
                          <span className="text-slate-900 font-mono font-semibold tabular-nums">{km.value}</span>
                        </div>
                      ))}
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">{report.fileSize}</span>
                        <button
                          type="button"
                          onClick={() => alert(`Descargando copia certificada: ${report.title}`)}
                          className="text-xs text-[#0078D4] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : portalView === 'consultas' ? (
            /* Standalone Consultations & Tickets View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="p-2 bg-blue-50 text-[#0078D4] rounded-lg">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Nueva Consulta Estratégica
                      </h3>
                      <p className="text-xs text-slate-500">
                        Canal directo con el Cr. Carlos Rodrigo Domínguez
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Asunto de la Consulta *
                      </label>
                      <input
                        type="text"
                        required
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="ej. Consulta sobre liquidación de divisas y Factura E"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Área Estratégica *
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                      >
                        <option value="tributaria">Planificación Tributaria / Ganancias / IVA</option>
                        <option value="divisas_mulc">Liquidación de Divisas / MULC / BCRA</option>
                        <option value="cfo_flujos">CFO Fraccional / Presupuestos & Cash Flow</option>
                        <option value="franquicia_legal">Auditoría Precontractual Franquicias CCyC</option>
                        <option value="estructuracion">Empresas 100% IA / ZHC / Criptoactivos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Detalle o Pregunta Específica *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Describe la operación, montos involucrados o normativa que requieres dictaminar..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingTicket}
                      className="w-full py-2.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingTicket ? 'Enviando al Estudio...' : 'Enviar Consulta Prioritaria'}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Ticket History */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Historial de Dictámenes & Respuestas ({tickets.length})
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {tickets.filter((t) => t.status === 'resuelto').length} Resueltos
                  </span>
                </div>

                <div className="space-y-3">
                  {tickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{tkt.subject}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                          tkt.status === 'resuelto'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {tkt.status === 'resuelto' ? 'Resuelto' : 'En Análisis'}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        <strong>Pregunta:</strong> {tkt.question}
                      </p>

                      {tkt.resolution && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mt-2 text-[11px] text-slate-800 leading-relaxed space-y-1">
                          <strong className="text-[#0078D4] block">Dictamen de {tkt.advisorName}:</strong>
                          <p>{tkt.resolution}</p>
                          {tkt.resolvedAt && (
                            <span className="text-[10px] text-slate-400 font-mono block pt-1">
                              Resuelto el {new Date(tkt.resolvedAt).toLocaleDateString('es-AR')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* RESUMEN / VISIÓN GENERAL (Default view) */
            <div className="space-y-6">
              {/* Account Header Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                      <span>CUIT: {profile.cuit}</span>
                      <span>·</span>
                      <span>{profile.legalEntity}</span>
                      <span>·</span>
                      <span className="text-[#0078D4] font-semibold">{profile.location}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {profile.companyName}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Plan Activo: <strong className="text-slate-800">{profile.activePlan}</strong> · Supervisado por Cr. Carlos Rodrigo Domínguez
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Salud Fiscal y Contable</span>
                      <span className="text-2xl font-black text-[#107C41] font-mono tabular-nums">
                        {profile.fiscalHealthScore}%
                      </span>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden md:block" />
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Horas CFO Consumidas</span>
                      <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                        {profile.cfoHoursUsed} / {profile.cfoHoursAllocated} h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Executive KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Cash Flow Runway</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {profile.runwayMonths} <span className="text-xs font-normal text-slate-500">meses</span>
                    </span>
                    <span className="text-[11px] text-[#107C41] font-semibold block mt-1">Óptimo para reinversión</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Facturación Mensual Recurrente</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      USD {profile.monthlyRevenueUsd.toLocaleString('en-US')}
                    </span>
                    <span className="text-[11px] text-[#0078D4] font-semibold block mt-1">Liquidación Factura E al día</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Margen Bruto de Contribución</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {profile.grossMarginPercent}%
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">+4.2% vs Q3</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Próximo Vencimiento Impositivo</span>
                    <span className="text-xs font-bold text-amber-700 block mt-1">
                      {profile.nextFiscalDeadline}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Liquidación preparada por D&L</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Hub Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Hub Card 1: Bóveda Documental */}
                <div
                  onClick={() => setPortalView('documentacion')}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0078D4] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FolderLock className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-[#0078D4]">
                      {documents.length} Archivos
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors flex items-center justify-between">
                      <span>Bóveda Documental</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0078D4]" />
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      DDJJ ARCA, F. 2002, balances y retenciones
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-1 rounded border border-emerald-200/60">
                    {pendingReviewDocs.length > 0 ? `${pendingReviewDocs.length} en revisión` : '100% al día'}
                  </div>
                </div>

                {/* Hub Card 2: Reportes & Dictámenes */}
                <div
                  onClick={() => setPortalView('reportes')}
                  className="bg-white border border-slate-200 hover:border-emerald-400 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#107C41] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      {reports.length} Informes
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors flex items-center justify-between">
                      <span>Dictámenes Entregables</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0078D4]" />
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Modelos financieros, VAN/TIR y franquicias
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    Firmados CPCE Chubut
                  </div>
                </div>

                {/* Hub Card 3: Consultas Directas */}
                <div
                  onClick={() => setPortalView('consultas')}
                  className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800">
                      {openTickets.length > 0 ? `${openTickets.length} Pendiente` : 'Al Día'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors flex items-center justify-between">
                      <span>Mesa de Consultas</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0078D4]" />
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Asesoría prioritaria con Cr. Domínguez
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded border border-indigo-200/60">
                    Respuesta en &lt; 24 hs
                  </div>
                </div>

                {/* Hub Card 4: Calendario Fiscal */}
                <div
                  onClick={() => setPortalView('calendario')}
                  className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-4.5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                      Próximo: 14 Nov
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] transition-colors flex items-center justify-between">
                      <span>Calendario Fiscal</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0078D4]" />
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Vencimientos según CUIT {profile.cuit.slice(-1)}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60">
                    F. 931 & Anticipo Ganancias
                  </div>
                </div>
              </div>

              {/* Latest Documents Strip (Quick Access) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FolderLock className="w-4 h-4 text-[#0078D4]" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Últimos Documentos & Constancias en Bóveda
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPortalView('documentacion')}
                    className="text-xs font-bold text-[#0078D4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver todos los {documents.length} archivos →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setPortalView('documentacion')}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors cursor-pointer space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500 uppercase">{doc.fileType} · {doc.period}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Auditado</span>
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{doc.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{doc.notes || 'Documento oficial procesado.'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Layout: Deliverables Repository & Advisory Tickets Snippet */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Deliverables Repository */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Últimos Dictámenes Formales
                      </h3>
                      <p className="text-xs text-slate-600">
                        Informes de franquicias, VAN/TIR y compliance
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPortalView('reportes')}
                      className="text-xs font-bold text-[#0078D4] hover:underline"
                    >
                      Ver todos →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reports.slice(0, 2).map((report) => (
                      <div
                        key={report.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-2xs transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div className="flex items-start gap-2.5">
                            <div className="p-1.5 bg-blue-50 text-[#0078D4] rounded-lg shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                {report.title}
                              </h4>
                              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                {report.date} · {report.version}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded transition-colors"
                          >
                            Métricas
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 pl-8">
                          {report.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Quick Ticket Creator */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <MessageSquare className="w-4 h-4 text-[#0078D4]" />
                      <h3 className="font-bold text-slate-900">Consulta Rápida al Cr. Domínguez</h3>
                    </div>

                    <form onSubmit={handleCreateTicket} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="Asunto (ej. Duda liquidación Factura E)..."
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={2}
                          required
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Escribe tu consulta específica..."
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingTicket}
                        className="w-full py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSubmittingTicket ? 'Enviando...' : 'Despachar Consulta'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Drawer for detailed report examination */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#0078D4] font-mono font-semibold">
                  Auditoría Formal Certificada
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedReport.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 py-2">
              {selectedReport.keyMetrics.map((km, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">{km.label}</span>
                  <span className="text-base font-bold text-slate-900 font-mono">{km.value}</span>
                  {km.variance && (
                    <span className="text-[10px] text-[#107C41] font-semibold block mt-0.5">{km.variance}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="block text-slate-800 font-medium">Dictaminado por: {selectedReport.author}</span>
                <span className="text-[11px]">Matrícula CPCE Chubut</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(`Descarga completada para ${selectedReport.title}`);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
