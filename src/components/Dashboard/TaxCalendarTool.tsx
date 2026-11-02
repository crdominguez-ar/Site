import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Share2,
  Plus,
  Trash2,
  Building,
  FileText,
  Calendar,
  ChevronDown
} from 'lucide-react';

export interface TaxObligation {
  id: string;
  name: string;
  agency: 'ARCA (AFIP)' | 'DGR Chubut' | 'Convenio Multilateral' | 'Municipalidad Trelew/Rawson';
  period: string;
  category: 'impositivo' | 'laboral' | 'previsional' | 'municipal';
  cuitGroup: '0-1' | '2-3' | '4-5' | '6-7' | '8-9' | '0-2' | '3-5' | '6-9' | 'todos';
  dueDate: string; // YYYY-MM-DD
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  amountEstimate?: number;
}

const INITIAL_OBLIGATIONS: TaxObligation[] = [
  {
    id: 'tax_1',
    name: 'IVA Mensual - Declaración Jurada F. 2002',
    agency: 'ARCA (AFIP)',
    period: 'Marzo 2026',
    category: 'impositivo',
    cuitGroup: '0-1',
    dueDate: '2026-04-18',
    status: 'in_progress',
    notes: 'Verificar retenciones bancarias y crédito fiscal compras'
  },
  {
    id: 'tax_2',
    name: 'IVA Mensual - Declaración Jurada F. 2002',
    agency: 'ARCA (AFIP)',
    period: 'Marzo 2026',
    category: 'impositivo',
    cuitGroup: '2-3',
    dueDate: '2026-04-19',
    status: 'pending',
  },
  {
    id: 'tax_3',
    name: 'Cargas Sociales F. 931 - Libro de Sueldos Digital',
    agency: 'ARCA (AFIP)',
    period: 'Marzo 2026',
    category: 'laboral',
    cuitGroup: '0-1',
    dueDate: '2026-04-11',
    status: 'completed',
    notes: 'Nómina validada con sindicatos patagónicos'
  },
  {
    id: 'tax_4',
    name: 'Cargas Sociales F. 931 - Libro de Sueldos Digital',
    agency: 'ARCA (AFIP)',
    period: 'Marzo 2026',
    category: 'laboral',
    cuitGroup: '2-3',
    dueDate: '2026-04-12',
    status: 'in_progress',
  },
  {
    id: 'tax_5',
    name: 'Ingresos Brutos DGR Chubut - Anticipo Mensual',
    agency: 'DGR Chubut',
    period: 'Marzo 2026',
    category: 'impositivo',
    cuitGroup: 'todos',
    dueDate: '2026-04-15',
    status: 'pending',
    notes: 'Alícuota sector servicios 3.5% / comercio 2.5%'
  },
  {
    id: 'tax_6',
    name: 'Convenio Multilateral SIFERE - Anticipo 03/2026',
    agency: 'Convenio Multilateral',
    period: 'Marzo 2026',
    category: 'impositivo',
    cuitGroup: '0-2',
    dueDate: '2026-04-14',
    status: 'pending',
  },
  {
    id: 'tax_7',
    name: 'Monotributo - Cuota Impositiva y Previsional',
    agency: 'ARCA (AFIP)',
    period: 'Abril 2026',
    category: 'impositivo',
    cuitGroup: 'todos',
    dueDate: '2026-04-20',
    status: 'pending',
    notes: 'Débito automático cuenta corriente'
  },
  {
    id: 'tax_8',
    name: 'Tasa Inspección e Higiene Municipal (Trelew/Madryn)',
    agency: 'Municipalidad Trelew/Rawson',
    period: 'Marzo 2026',
    category: 'municipal',
    cuitGroup: 'todos',
    dueDate: '2026-04-22',
    status: 'pending',
  },
  {
    id: 'tax_9',
    name: 'SICORE - Pago a Cuenta e Informe Retenciones',
    agency: 'ARCA (AFIP)',
    period: '1° Quincena Abril 2026',
    category: 'impositivo',
    cuitGroup: 'todos',
    dueDate: '2026-04-21',
    status: 'pending',
  }
];

export const TaxCalendarTool: React.FC = () => {
  const [obligations, setObligations] = useState<TaxObligation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dl_tax_calendar_obligations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_OBLIGATIONS;
  });

  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [cuitFilter, setCuitFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form state
  const [newObligation, setNewObligation] = useState<Partial<TaxObligation>>({
    name: '',
    agency: 'ARCA (AFIP)',
    period: 'Abril 2026',
    category: 'impositivo',
    cuitGroup: 'todos',
    dueDate: '2026-04-20',
    status: 'pending',
    notes: ''
  });

  const saveObligations = (items: TaxObligation[]) => {
    setObligations(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dl_tax_calendar_obligations', JSON.stringify(items));
    }
  };

  const handleStatusChange = (id: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const updated = obligations.map(item => item.id === id ? { ...item, status: newStatus } : item);
    saveObligations(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Deseas eliminar este vencimiento impositivo del calendario?')) {
      const updated = obligations.filter(item => item.id !== id);
      saveObligations(updated);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObligation.name || !newObligation.dueDate) return;

    const newItem: TaxObligation = {
      id: `tax_${Date.now()}`,
      name: newObligation.name,
      agency: (newObligation.agency as any) || 'ARCA (AFIP)',
      period: newObligation.period || 'Abril 2026',
      category: (newObligation.category as any) || 'impositivo',
      cuitGroup: (newObligation.cuitGroup as any) || 'todos',
      dueDate: newObligation.dueDate,
      status: (newObligation.status as any) || 'pending',
      notes: newObligation.notes || ''
    };

    saveObligations([newItem, ...obligations]);
    setShowAddModal(false);
    setNewObligation({
      name: '',
      agency: 'ARCA (AFIP)',
      period: 'Abril 2026',
      category: 'impositivo',
      cuitGroup: 'todos',
      dueDate: '2026-04-20',
      status: 'pending',
      notes: ''
    });
  };

  // Helper to calculate days remaining
  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr + 'T00:00:00');
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtering
  const filteredObligations = obligations.filter(item => {
    if (selectedAgency !== 'all' && item.agency !== selectedAgency) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(q) || 
                    item.agency.toLowerCase().includes(q) || 
                    (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (cuitFilter) {
      const lastDigit = cuitFilter.slice(-1);
      if (item.cuitGroup !== 'todos') {
        const parts = item.cuitGroup.split('-');
        if (parts.length === 2) {
          const num = parseInt(lastDigit, 10);
          const min = parseInt(parts[0], 10);
          const max = parseInt(parts[1], 10);
          if (!isNaN(num) && (num < min || num > max)) return false;
        }
      }
    }
    return true;
  });

  const pendingCount = obligations.filter(o => o.status === 'pending').length;
  const inProgressCount = obligations.filter(o => o.status === 'in_progress').length;
  const completedCount = obligations.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <CalendarCheck className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                Módulo Fiscal & Tributario
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Calendario de Vencimientos ARCA & DGR Chubut
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Control preventivo de declaraciones juradas, cargas sociales y anticipos impositivos para clientes del estudio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Nuevo Vencimiento
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              title="Imprimir cronograma fiscal"
            >
              <Download className="w-4 h-4" />
              Exportar Agenda
            </button>
          </div>
        </div>

        {/* Quick Summary Stat Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Total Obligaciones</p>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1">{obligations.length}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">Pendientes de Liquidar</p>
            <p className="text-xl font-bold font-mono text-amber-900 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">En Liquidación</p>
            <p className="text-xl font-bold font-mono text-blue-900 mt-1">{inProgressCount}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <p className="text-xs text-emerald-700 font-medium">Presentadas y Al Día</p>
            <p className="text-xl font-bold font-mono text-emerald-900 mt-1">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full flex flex-wrap gap-2 items-center">
          {/* Search query */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar impuesto, régimen o nota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* CUIT filter */}
          <div className="w-44">
            <input
              type="text"
              placeholder="Filtrar CUIT (ej: 30-71...)"
              value={cuitFilter}
              onChange={(e) => setCuitFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Agency Selector */}
          <select
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">Todos los Organismos</option>
            <option value="ARCA (AFIP)">ARCA (Nacional)</option>
            <option value="DGR Chubut">DGR Chubut (Provincial)</option>
            <option value="Convenio Multilateral">Convenio Multilateral</option>
            <option value="Municipalidad Trelew/Rawson">Tasas Municipales</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Liquidación</option>
            <option value="completed">Completados</option>
          </select>
        </div>
      </div>

      {/* Obligations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Obligación & Régimen</th>
                <th className="py-3 px-4">Organismo</th>
                <th className="py-3 px-4">Terminación CUIT</th>
                <th className="py-3 px-4">Fecha Vencimiento</th>
                <th className="py-3 px-4">Plazo Restante</th>
                <th className="py-3 px-4">Estado Liquidación</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredObligations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron vencimientos para los criterios de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                filteredObligations.map((item) => {
                  const daysLeft = getDaysDiff(item.dueDate);
                  const isPast = daysLeft < 0;
                  const isUrgent = daysLeft >= 0 && daysLeft <= 3 && item.status !== 'completed';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div>{item.name}</div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {item.agency}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {item.cuitGroup === 'todos' ? 'Todos los CUIT' : `Dígito: ${item.cuitGroup}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {item.dueDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {item.status === 'completed' ? (
                          <span className="text-emerald-600 font-medium">Presentado</span>
                        ) : isPast ? (
                          <span className="text-rose-600 font-bold">Vencido hace {Math.abs(daysLeft)}d</span>
                        ) : isUrgent ? (
                          <span className="text-amber-600 font-bold animate-pulse">Vence en {daysLeft} días</span>
                        ) : (
                          <span className="text-slate-500">En {daysLeft} días</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className={`text-xs px-2.5 py-1 rounded font-medium border focus:outline-none cursor-pointer ${
                            item.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En Liquidación</option>
                          <option value="completed">Presentado</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Eliminar vencimiento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900">
              Registrar Nuevo Vencimiento Impositivo
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Agregue una obligación fiscal o municipal al cronograma de control.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre de la Obligación o Impuesto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Libro de Sueldos Digital / Anticipo IIBB"
                  value={newObligation.name}
                  onChange={(e) => setNewObligation({ ...newObligation, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Organismo Recaudador
                  </label>
                  <select
                    value={newObligation.agency}
                    onChange={(e) => setNewObligation({ ...newObligation, agency: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="ARCA (AFIP)">ARCA (AFIP)</option>
                    <option value="DGR Chubut">DGR Chubut</option>
                    <option value="Convenio Multilateral">Convenio Multilateral</option>
                    <option value="Municipalidad Trelew/Rawson">Municipalidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Terminación CUIT
                  </label>
                  <select
                    value={newObligation.cuitGroup}
                    onChange={(e) => setNewObligation({ ...newObligation, cuitGroup: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="todos">Todos los CUIT</option>
                    <option value="0-1">0-1</option>
                    <option value="2-3">2-3</option>
                    <option value="4-5">4-5</option>
                    <option value="6-7">6-7</option>
                    <option value="8-9">8-9</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    required
                    value={newObligation.dueDate}
                    onChange={(e) => setNewObligation({ ...newObligation, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Período Fiscal
                  </label>
                  <input
                    type="text"
                    value={newObligation.period}
                    onChange={(e) => setNewObligation({ ...newObligation, period: e.target.value })}
                    placeholder="Ej: Abril 2026"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Notas de Trabajo / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={newObligation.notes}
                  onChange={(e) => setNewObligation({ ...newObligation, notes: e.target.value })}
                  placeholder="Detalles sobre retenciones, claves o clientes alcanzados..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar Vencimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
