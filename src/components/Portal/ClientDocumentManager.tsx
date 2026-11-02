import React, { useState } from 'react';
import {
  FolderLock,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  LayoutGrid,
  List,
  Copy,
  Check
} from 'lucide-react';
import { ClientDocument, DocumentCategory, DocumentStatus, ClientProfile } from '../../types';

interface ClientDocumentManagerProps {
  documents: ClientDocument[];
  profile: ClientProfile;
  onUploadDocument: (doc: Omit<ClientDocument, 'id' | 'uploadDate'>) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
}

const CATEGORY_LABELS: Record<DocumentCategory, { label: string; short: string; badge: string }> = {
  arca_afip: {
    label: 'ARCA (ex-AFIP) · DDJJ & IVA F. 2002',
    short: 'ARCA / AFIP',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  iibb_chubut: {
    label: 'DGR Chubut · IIBB & SIFERE Convenio',
    short: 'DGR Chubut',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  balances_contables: {
    label: 'Balances & Estados Contables Auditados',
    short: 'Balances',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  societario_legal: {
    label: 'Societario · Estatutos & Actas IGJ Chubut',
    short: 'Societario',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  facturacion_comprobantes: {
    label: 'Facturación & Comprobantes SWIFT / VEP',
    short: 'Comprobantes',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  retenciones_percepciones: {
    label: 'Certificados de Retención & Percepción',
    short: 'Retenciones',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  laboral_previsional: {
    label: 'Laboral & Libro de Sueldos Digital F. 931',
    short: 'Sueldos F. 931',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const ClientDocumentManager: React.FC<ClientDocumentManagerProps> = ({
  documents,
  profile,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('facturacion_comprobantes');
  const [uploadPeriod, setUploadPeriod] = useState('10/2026');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadVep, setUploadVep] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<ClientDocument | null>(null);
  const [copiedVep, setCopiedVep] = useState<string | null>(null);

  const handleCopyVep = (vep: string) => {
    navigator.clipboard.writeText(vep);
    setCopiedVep(vep);
    setTimeout(() => setCopiedVep(null), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    try {
      await onUploadDocument({
        clientId: profile.id,
        title: uploadTitle.trim(),
        category: uploadCategory,
        period: uploadPeriod.trim() || 'Período en curso',
        fileType: simulatedFileName.endsWith('.xlsx') ? 'excel' : simulatedFileName.endsWith('.zip') ? 'zip' : 'pdf',
        fileSize: simulatedFileName ? '1.8 MB' : '1.2 MB',
        uploadedBy: `Cliente (${profile.companyName})`,
        uploaderRole: 'cliente',
        status: 'en_revision',
        notes: uploadNotes.trim() || undefined,
        vepNumber: uploadVep.trim() || undefined,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadNotes('');
        setUploadVep('');
        setSimulatedFileName('');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.notes && doc.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.vepNumber && doc.vepNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'auditado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Auditado / OK</span>
          </span>
        );
      case 'en_revision':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>En Revisión D&L</span>
          </span>
        );
      case 'requiere_accion':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Requiere Firma / VEP</span>
          </span>
        );
      case 'archivado':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Archivado</span>
          </span>
        );
    }
  };

  const getFileIcon = (type: ClientDocument['fileType']) => {
    switch (type) {
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'zip':
        return <FileArchive className="w-4 h-4 text-amber-600" />;
      case 'xml':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case 'pdf':
      default:
        return <FileText className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast KPI Metrics Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0078D4] flex items-center justify-center shadow-xs">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Gestión Documental & Archivos Fiscales
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Bóveda Encriptada
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Declaraciones juradas ARCA, constancias DGR Chubut, balances rubricados y comprobantes de pago de {profile.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Documento o Comprobante</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 block">Total Documentos</span>
            <span className="text-xl font-black text-slate-900 font-mono tabular-nums">
              {documents.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              En bóveda digital
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 block">DDJJ ARCA / IVA</span>
            <span className="text-xl font-black text-[#107C41] font-mono tabular-nums">
              100% al Día
            </span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
              F. 2002 & F. 931 OK
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 block">Balances Certificados</span>
            <span className="text-xl font-black text-[#0078D4] font-mono tabular-nums">
              {documents.filter((d) => d.category === 'balances_contables').length}
            </span>
            <span className="text-[10px] text-blue-600 font-medium block mt-0.5">
              Rubricados CPCE Chubut
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 block">En Revisión por D&L</span>
            <span className="text-xl font-black text-amber-700 font-mono tabular-nums">
              {documents.filter((d) => d.status === 'en_revision').length}
            </span>
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">
              Subidos recientemente
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Category Pills & View Mode */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, período, VEP o notas..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0078D4]"
            />
          </div>

          {/* Status selector & View Mode toggle */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0078D4]"
            >
              <option value="all">Todos los estados</option>
              <option value="auditado">Auditados / Conformes</option>
              <option value="en_revision">En Revisión por D&L</option>
              <option value="requiere_accion">Requiere Acción</option>
            </select>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de tabla"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0078D4] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de cuadrícula"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-mono text-slate-400 mr-1 uppercase">Categoría:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0078D4] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todos ({documents.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as DocumentCategory[]).map((cat) => {
            const count = documents.filter((d) => d.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0078D4] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{CATEGORY_LABELS[cat].short}</span>
                {count > 0 && (
                  <span
                    className={`px-1 rounded text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Document View: Table or Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <FolderLock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron documentos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hay archivos que coincidan con los criterios de búsqueda o categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Documento / Archivo</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Período</th>
                  <th className="py-3 px-3">Origen & Fecha</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const cat = CATEGORY_LABELS[doc.category];

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Title & file metadata */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1.5 rounded bg-slate-100 shrink-0">
                            {getFileIcon(doc.fileType)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block leading-snug truncate">
                              {doc.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                              <span className="uppercase">{doc.fileType}</span>
                              <span>·</span>
                              <span>{doc.fileSize}</span>
                              {doc.vepNumber && (
                                <>
                                  <span>·</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyVep(doc.vepNumber!)}
                                    className="text-[#0078D4] hover:underline flex items-center gap-1 font-mono"
                                    title="Copiar número de VEP"
                                  >
                                    <span>{doc.vepNumber}</span>
                                    {copiedVep === doc.vepNumber ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-slate-400" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                            {doc.notes && (
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                                {doc.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${cat.badge}`}>
                          {cat.short}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-3 font-mono font-medium text-slate-800 text-xs">
                        {doc.period}
                      </td>

                      {/* Origin & Date */}
                      <td className="py-3.5 px-3">
                        <span className="text-slate-800 font-medium block">{doc.uploadedBy}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(doc.uploadDate).toLocaleDateString('es-AR')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {getStatusBadge(doc.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 text-slate-600 hover:text-[#0078D4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Previsualizar documento"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => alert(`Descargando copia legal certificada: ${doc.title} (${doc.fileSize})`)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Descargar archivo certificado"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {doc.uploaderRole === 'cliente' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Deseas eliminar el documento "${doc.title}"?`)) {
                                  onDeleteDocument(doc.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Eliminar documento subido"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const cat = CATEGORY_LABELS[doc.category];

            return (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${cat.badge}`}>
                      {cat.short}
                    </span>
                    {getStatusBadge(doc.status)}
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {doc.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        Período: {doc.period} · {doc.fileSize}
                      </span>
                    </div>
                  </div>

                  {doc.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2 italic">
                      {doc.notes}
                    </p>
                  )}

                  {doc.vepNumber && (
                    <div className="flex items-center justify-between text-[11px] bg-blue-50/50 p-2 rounded border border-blue-100 font-mono">
                      <span className="text-slate-500">VEP / Ref:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyVep(doc.vepNumber!)}
                        className="text-[#0078D4] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>{doc.vepNumber}</span>
                        {copiedVep === doc.vepNumber ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                    {new Date(doc.uploadDate).toLocaleDateString('es-AR')}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1 text-slate-700 hover:text-[#0078D4] bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ver</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert(`Descargando copia legal certificada: ${doc.title}`)}
                      className="px-2.5 py-1 text-white bg-[#0078D4] hover:bg-[#106EBE] rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Subir Nuevo Documento o Comprobante */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#0078D4]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Subir Documento o Comprobante al Estudio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Título / Descripción del Archivo *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="ej. Factura de Exportación E Nº 0001-00000042 o Comprobante VEP AFIP"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Categoría Fiscal / Contable *</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  >
                    <option value="facturacion_comprobantes">Facturación & Comprobantes</option>
                    <option value="arca_afip">ARCA / AFIP (DDJJ o VEPs)</option>
                    <option value="iibb_chubut">DGR Chubut (Ingresos Brutos / SIFERE)</option>
                    <option value="balances_contables">Balances & Estados Contables</option>
                    <option value="societario_legal">Societario (Estatutos, Actas IGJ)</option>
                    <option value="retenciones_percepciones">Certificados de Retención</option>
                    <option value="laboral_previsional">Laboral & F. 931</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Período Fiscal Imputado</label>
                  <input
                    type="text"
                    value={uploadPeriod}
                    onChange={(e) => setUploadPeriod(e.target.value)}
                    placeholder="ej. 10/2026 o Ejercicio 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Número de VEP / Referencia Oficial (Opcional)</label>
                <input
                  type="text"
                  value={uploadVep}
                  onChange={(e) => setUploadVep(e.target.value)}
                  placeholder="ej. VEP-992140-ARCA o Nº Transferencia Banco Chubut"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              {/* Simulated File Dropzone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Seleccionar Archivo (PDF, XLSX, ZIP)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-[#0078D4] transition-colors bg-slate-50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-slate-600 font-medium">
                    {simulatedFileName ? (
                      <span className="text-[#0078D4] font-bold">{simulatedFileName}</span>
                    ) : (
                      'Arrastra tu archivo aquí o haz clic en los ejemplos rápidos:'
                    )}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setSimulatedFileName('comprobante_pago_vep_oct2026.pdf')}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 hover:bg-slate-100"
                    >
                      + Adjuntar PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedFileName('extracto_bancario_banco_chubut.xlsx')}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 hover:bg-slate-100"
                    >
                      + Adjuntar Excel
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedFileName('facturas_e_exportacion_lote.zip')}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 hover:bg-slate-100"
                    >
                      + Adjuntar ZIP
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Instrucciones o Mensaje para el Cr. Domínguez</label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Detalla particularidades de la liquidación, cancelaciones parciales o consultas..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Documento ingresado con éxito a la bóveda digital.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading || uploadSuccess}
                  className="px-4 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Guardando en Bóveda...' : 'Confirmar y Enviar al Estudio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Previsualización Formal Certificada */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0078D4]">
                  {getFileIcon(previewDoc.fileType)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0078D4] block">
                    Bóveda Documental Certificada · CPCE Chubut
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    {previewDoc.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Metadata Sheet */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Empresa Titular:</span>
                <span className="font-bold text-slate-900 block truncate">{profile.companyName}</span>
                <span className="text-[10px] font-mono text-slate-500">CUIT: {profile.cuit}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Categoría & Período:</span>
                <span className="font-bold text-slate-900 block">{CATEGORY_LABELS[previewDoc.category].short}</span>
                <span className="text-[10px] font-mono text-slate-500">{previewDoc.period}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Estado de Auditoría:</span>
                <div className="mt-0.5">{getStatusBadge(previewDoc.status)}</div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Subido por:</span>
                <span className="font-semibold text-slate-800 block truncate">{previewDoc.uploadedBy}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(previewDoc.uploadDate).toLocaleString('es-AR')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Formato & Peso:</span>
                <span className="font-mono font-bold text-slate-800 uppercase block">
                  {previewDoc.fileType} · {previewDoc.fileSize}
                </span>
              </div>

              {previewDoc.vepNumber && (
                <div>
                  <span className="text-slate-500 block text-[11px]">VEP / Ref. Transaccional:</span>
                  <span className="font-mono font-bold text-[#0078D4] block">{previewDoc.vepNumber}</span>
                </div>
              )}
            </div>

            {/* Simulated Certified Content Body */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">Dictamen & Constancia del Estudio</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Firma Digital Verificada
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {previewDoc.notes ||
                  'Este documento ha sido procesado y cotejado conforme a las resoluciones generales de ARCA (ex-AFIP) y el Código Fiscal de la Provincia del Chubut. Su constancia original reposa en el expediente tributario digital de la entidad.'}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Responsable: Cr. Carlos Rodrigo Domínguez</span>
                <span>Tº IV Fº 128 CPCE Chubut</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Hash: SHA256-D&L-{(previewDoc.id || 'DOC').toUpperCase()}-2026
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Descarga completada: ${previewDoc.title}`);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Copia Certificada</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
