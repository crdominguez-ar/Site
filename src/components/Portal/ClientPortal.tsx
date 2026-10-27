import React, { useState, useEffect } from 'react';
import { dbRepository } from '../../lib/supabaseClient';
import { ClientProfile, DeliverableReport, AdvisoryTicket } from '../../types';
import { FileText, Download, MessageSquare, Send, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const [profile] = useState<ClientProfile>(dbRepository.getClientProfile());
  const [reports, setReports] = useState<DeliverableReport[]>([]);
  const [tickets, setTickets] = useState<AdvisoryTicket[]>([]);
  
  // New ticket form
  const [newSubject, setNewSubject] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newCategory, setNewCategory] = useState<AdvisoryTicket['category']>('tributaria');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<DeliverableReport | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const reps = await dbRepository.getReports();
      const tkts = await dbRepository.getTickets();
      setReports(reps);
      setTickets(tkts);
    };
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

  return (
    <div className="space-y-8">
      {/* Top Banner with Client Account Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
              <span>CUIT: {profile.cuit}</span>
              <span>·</span>
              <span>{profile.legalEntity}</span>
              <span>·</span>
              <span className="text-cyan-400">{profile.location}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {profile.companyName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Plan Activo: <strong className="text-slate-200">{profile.activePlan}</strong> · Supervisado por Cr. Carlos Rodrigo Domínguez
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Salud Fiscal y Contable</span>
              <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                {profile.fiscalHealthScore}%
              </span>
            </div>
            <div className="h-10 w-px bg-slate-800 hidden md:block" />
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Horas CFO Consumidas</span>
              <span className="text-base font-bold text-white font-mono tabular-nums">
                {profile.cfoHoursUsed} / {profile.cfoHoursAllocated} h
              </span>
            </div>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Cash Flow Runway</span>
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {profile.runwayMonths} <span className="text-xs font-normal text-slate-400">meses</span>
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1">Óptimo para reinversión</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Facturación Mensual Recurrente</span>
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              USD {profile.monthlyRevenueUsd.toLocaleString('en-US')}
            </span>
            <span className="text-[11px] text-cyan-400 block mt-1">Liquidación Factura E al día</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Margen Bruto de Contribución</span>
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {profile.grossMarginPercent}%
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">+4.2% vs Q3</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Próximo Vencimiento Impositivo</span>
            <span className="text-xs font-bold text-amber-400 block mt-1">
              {profile.nextFiscalDeadline}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Liquidación preparada por D&L</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Deliverables Repository & Advisory Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Deliverables & Reports Repository */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Repositorio de Reportes & Dictámenes
              </h3>
              <p className="text-xs text-slate-400">
                Informes de franquicias, VAN/TIR, punto de equilibrio y compliance ZHC
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {reports.length} documentos auditados
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800 text-cyan-400 rounded-lg shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {report.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{report.date}</span>
                        <span>·</span>
                        <span>{report.version}</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-medium">Auditado por {report.author}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Ver Métricas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-2 pl-9">
                  {report.summary}
                </p>

                {/* Key Metrics Strip */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap gap-4 pl-9">
                  {report.keyMetrics.map((km, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="text-slate-400 block text-[11px]">{km.label}:</span>
                      <span className="text-white font-mono font-semibold tabular-nums">{km.value}</span>
                    </div>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">{report.fileSize}</span>
                    <button
                      type="button"
                      onClick={() => alert(`Descargando copia certificada: ${report.title}`)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Direct Strategic Consultations & Tickets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Consultas Directas al Cr. Rodrigo Domínguez
                </h3>
                <p className="text-xs text-slate-400">
                  Canal prioritario de dirección financiera y tributaria
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Asunto de la Consulta
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="ej. Consulta sobre liquidación de divisas y Factura E"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Área Estratégica
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="tributaria">Planificación Tributaria / Ganancias / IVA</option>
                  <option value="divisas_mulc">Liquidación de Divisas / MULC / BCRA</option>
                  <option value="cfo_flujos">CFO Fraccional / Presupuestos & Cash Flow</option>
                  <option value="franquicia_legal">Auditoría Precontractual Franquicias CCyC</option>
                  <option value="estructuracion">Empresas 100% IA / ZHC / Criptoactivos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detalle o Pregunta Específica
                </label>
                <textarea
                  rows={3}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Describe la operación, montos involucrados o normativa que requieres dictaminar..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Consulta Prioritaria</span>
              </button>
            </form>
          </div>

          {/* Ticket History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Historial de Dictámenes & Consultas
            </h4>

            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{tkt.subject}</span>
                  <span className={`text-[11px] font-mono font-medium ${
                    tkt.status === 'resuelto' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {tkt.status === 'resuelto' ? 'Resuelto' : 'En Análisis'}
                  </span>
                </div>
                
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  <strong>Pregunta:</strong> {tkt.question}
                </p>

                {tkt.resolution && (
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg mt-2 text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-cyan-400 block mb-0.5">Dictamen de {tkt.advisorName}:</strong>
                    {tkt.resolution}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal / Drawer for detailed report examination */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
                  Auditoría Formal Certificada
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedReport.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 py-2">
              {selectedReport.keyMetrics.map((km, i) => (
                <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">{km.label}</span>
                  <span className="text-base font-bold text-white font-mono">{km.value}</span>
                  {km.variance && (
                    <span className="text-[10px] text-emerald-400 block mt-0.5">{km.variance}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between">
              <div>
                <span className="block text-slate-300 font-medium">Dictaminado por: {selectedReport.author}</span>
                <span className="text-[11px]">Matrícula CPCE Chubut</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(`Descarga completada para ${selectedReport.title}`);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar PDF Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
