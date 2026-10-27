import React, { useState, useEffect } from 'react';
import { dbRepository } from '../../lib/supabaseClient';
import { Lead, CRMTask, LeadStage, BusinessVertical, UserRole } from '../../types';
import { BUSINESS_VERTICALS } from '../../data/verticals';
import { 
  Users, CheckSquare, Plus, Search, Filter, 
  ArrowRight, CheckCircle2, Clock, Building, Calendar, 
  ChevronRight, Phone, Mail, MapPin, DollarSign, X
} from 'lucide-react';

interface InternalCRMProps {
  currentRole: UserRole;
}

const STAGES: { id: LeadStage; label: string; countColor: string }[] = [
  { id: 'nuevo', label: 'Nuevo Diagnóstico', countColor: 'text-cyan-400' },
  { id: 'diagnostico', label: 'Evaluación Técnica', countColor: 'text-blue-400' },
  { id: 'propuesta', label: 'Propuesta / Modelo', countColor: 'text-indigo-400' },
  { id: 'negociacion', label: 'Negociación Socio', countColor: 'text-amber-400' },
  { id: 'activo', label: 'Cliente Activo', countColor: 'text-emerald-400' },
];

export const InternalCRM: React.FC<InternalCRMProps> = ({ currentRole }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [selectedVertical, setSelectedVertical] = useState<BusinessVertical | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCompany, setNewTaskCompany] = useState<string>('');
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);

  // New lead modal state
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [newLeadCompany, setNewLeadCompany] = useState<string>('');
  const [newLeadContact, setNewLeadContact] = useState<string>('');
  const [newLeadEmail, setNewLeadEmail] = useState<string>('');
  const [newLeadPhone, setNewLeadPhone] = useState<string>('');
  const [newLeadVertical, setNewLeadVertical] = useState<BusinessVertical>('cfo_estrategico');
  const [newLeadBudget, setNewLeadBudget] = useState<number>(1800);

  const loadData = async () => {
    const l = await dbRepository.getLeads();
    const t = await dbRepository.getTasks();
    setLeads(l);
    setTasks(t);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStageChange = async (leadId: string, nextStage: LeadStage) => {
    await dbRepository.updateLeadStage(leadId, nextStage);
    await loadData();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: nextStage });
    }
  };

  const handleToggleTask = async (taskId: string) => {
    await dbRepository.toggleTask(taskId);
    await loadData();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    await dbRepository.addTask({
      title: newTaskTitle,
      companyName: newTaskCompany || 'General D&L',
      dueDate: 'En 48 horas',
      priority: 'normal',
      completed: false,
      assignedRole: currentRole === 'admin' ? 'socio' : 'consultor',
      vertical: 'cfo_estrategico',
    });

    setNewTaskTitle('');
    setNewTaskCompany('');
    setShowTaskModal(false);
    await loadData();
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadCompany || !newLeadContact) return;

    const created = await dbRepository.createLead({
      companyName: newLeadCompany,
      contactName: newLeadContact,
      email: newLeadEmail || 'contacto@empresa.com',
      phone: newLeadPhone || '+54 280 400-0000',
      location: 'Trelew, Chubut',
      vertical: newLeadVertical,
      stage: 'nuevo',
      priority: 'alta',
      estimatedMonthlyBudgetUsd: newLeadBudget,
      notes: 'Lead creado manualmente desde consola CRM por ' + (currentRole === 'admin' ? 'Cr. Carlos Rodrigo Domínguez' : 'Consultor Staff'),
      score: 85,
    });

    setShowLeadModal(false);
    setNewLeadCompany('');
    setNewLeadContact('');
    setNewLeadEmail('');
    await loadData();
    setSelectedLead(created);
  };

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesVertical = selectedVertical === 'all' || lead.vertical === selectedVertical;
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVertical && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top CRM Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>Módulo Interno</span>
              <span>·</span>
              <span className="text-cyan-400 font-semibold uppercase">
                {currentRole === 'admin' ? 'Socio Director (Cr. Carlos Rodrigo Domínguez)' : 'Consultor Staff'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Pipeline de Clientes & Gestión de Oportunidades
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTaskModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>Nueva Tarea</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLeadModal(true)}
              className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Lead</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium mr-1">Filtrar Vertical:</span>
            <button
              type="button"
              onClick={() => setSelectedVertical('all')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedVertical === 'all'
                  ? 'bg-[#0078D4] text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas ({leads.length})
            </button>
            {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => (
              <button
                key={vKey}
                type="button"
                onClick={() => setSelectedVertical(vKey)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedVertical === vKey
                    ? 'bg-[#0078D4] text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {BUSINESS_VERTICALS[vKey].shortTitle}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por empresa, contacto..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stg) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stg.id);
          const stageTotalBudget = stageLeads.reduce((acc, curr) => acc + curr.estimatedMonthlyBudgetUsd, 0);

          return (
            <div
              key={stg.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-slate-800/80 mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {stg.label}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    USD {stageTotalBudget.toLocaleString()} / mes
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 ${stg.countColor}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3 bg-slate-950 border border-slate-800/90 hover:border-cyan-500/60 rounded-lg cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {lead.companyName}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                        {lead.score}pts
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{lead.contactName}</span>
                      <span className="text-slate-500">{BUSINESS_VERTICALS[lead.vertical].shortTitle}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {lead.notes}
                    </p>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-mono font-medium">
                        USD {lead.estimatedMonthlyBudgetUsd}/m
                      </span>
                      <span className="text-slate-400">{lead.location}</span>
                    </div>

                    {/* Quick Move Trigger */}
                    <div className="pt-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {stg.id !== 'activo' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextIndex = STAGES.findIndex((s) => s.id === stg.id) + 1;
                            if (nextIndex < STAGES.length) {
                              handleStageChange(lead.id, STAGES[nextIndex].id);
                            }
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[10px] rounded transition-colors flex items-center gap-1"
                        >
                          Avanzar
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="p-4 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-400">
                    Sin operaciones en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task & Action Items Drawer / Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tareas Operativas del Estudio (Staff & Socios)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {tasks.filter((t) => !t.completed).length} pendientes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className={`block font-medium ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>{task.companyName}</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-mono">{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Lead Detail Examination */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
                  Ficha de Lead · {BUSINESS_VERTICALS[selectedLead.vertical].shortTitle}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedLead.companyName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Contacto Directo</span>
                  <span className="text-white font-medium block mt-0.5">{selectedLead.contactName}</span>
                  <span className="text-slate-400 text-[11px]">{selectedLead.email}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Presupuesto Estimado</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm block mt-0.5">
                    USD {selectedLead.estimatedMonthlyBudgetUsd} / mes
                  </span>
                  <span className="text-slate-400 text-[11px]">{selectedLead.location}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400 block font-semibold text-[11px]">Notas y Diagnóstico:</span>
                <p className="text-slate-300 leading-relaxed">{selectedLead.notes}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold text-[11px] mb-2">Cambiar Etapa del Pipeline:</span>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStageChange(selectedLead.id, s.id)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        selectedLead.stage === s.id
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTask} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Nueva Tarea Operativa</h3>
              <button type="button" onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Título de la Tarea</label>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="ej. Revisar contrato de franquicia con nuevo cliente"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Empresa / Referencia</label>
              <input
                type="text"
                value={newTaskCompany}
                onChange={(e) => setNewTaskCompany(e.target.value)}
                placeholder="ej. Pesquera San Carlos"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New Lead */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateLead} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Alta Manual de Oportunidad / Lead</h3>
              <button type="button" onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Empresa / Razón Social *</label>
              <input
                type="text"
                required
                value={newLeadCompany}
                onChange={(e) => setNewLeadCompany(e.target.value)}
                placeholder="ej. Trelew Cervecería Patagónica"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contacto Principal *</label>
              <input
                type="text"
                required
                value={newLeadContact}
                onChange={(e) => setNewLeadContact(e.target.value)}
                placeholder="ej. Juan Carlos López"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="juan@empresa.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Teléfono</label>
                <input
                  type="text"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+54 280 4..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Vertical de Negocio</label>
              <select
                value={newLeadVertical}
                onChange={(e) => setNewLeadVertical(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {(Object.keys(BUSINESS_VERTICALS) as BusinessVertical[]).map((vKey) => (
                  <option key={vKey} value={vKey}>
                    {BUSINESS_VERTICALS[vKey].title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLeadModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
              >
                Crear Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
