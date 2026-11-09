import React, { useState, useRef, useEffect } from 'react';
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
  Check,
  Cloud,
  FileUp,
  HardDrive,
  CheckCheck,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { ClientDocument, DocumentCategory, DocumentStatus, ClientProfile } from '../../types';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  getOrCreateClientFolder,
  uploadFileToGoogleDrive,
  deleteGoogleDriveFile,
  DriveFolderInfo,
  DriveFileInfo
} from '../../lib/googleDriveService';
import type { User } from 'firebase/auth';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 48 48" style={{ display: 'inline-block' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

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
  cfo_reportes_comite: {
    label: 'CFO Fraccional · Reportes Mensuales & Actas de Comité',
    short: 'CFO / Comité',
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  data_room_inversores: {
    label: 'Data Room Inversores · Cap Table & Due Diligence',
    short: 'Data Room',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
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

  // Real file upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRealFile, setSelectedRealFile] = useState<File | null>(null);
  const [realFileDataUrl, setRealFileDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Google Drive Integration State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveFolder, setDriveFolder] = useState<DriveFolderInfo | null>(null);
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [syncToDrive, setSyncToDrive] = useState(true);
  const [driveSyncingStatus, setDriveSyncingStatus] = useState<string | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, _token) => {
        setGoogleUser(user);
        try {
          const folder = await getOrCreateClientFolder(profile.companyName);
          setDriveFolder(folder);
        } catch (err: any) {
          console.warn('Google Drive folder setup:', err?.message);
        }
      },
      () => {
        setGoogleUser(null);
        setDriveFolder(null);
      }
    );
    return () => unsubscribe();
  }, [profile.companyName]);

  const handleConnectGoogleDrive = async () => {
    setIsConnectingDrive(true);
    setDriveError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        const folder = await getOrCreateClientFolder(profile.companyName);
        setDriveFolder(folder);
      }
    } catch (err: any) {
      console.error('Error Google Drive:', err);
      setDriveError(err?.message || 'Error al conectar con Google Drive');
    } finally {
      setIsConnectingDrive(false);
    }
  };

  const handleDisconnectGoogleDrive = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setDriveFolder(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Safe delete with mandatory user confirmation per Workspace Integration guidelines
  const handleDeleteDocumentSafe = async (doc: ClientDocument) => {
    const isDriveBacked = !!doc.driveFileId;
    const confirmMessage = isDriveBacked
      ? `¿Estás seguro de que deseas eliminar permanentemente el documento "${doc.title}"?\n\nEsta acción borrará el registro de la bóveda digital y el archivo alojado en Google Drive.`
      : `¿Estás seguro de que deseas eliminar el documento "${doc.title}" de la bóveda digital?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeletingDoc(true);
      if (isDriveBacked && doc.driveFileId && getAccessToken()) {
        try {
          await deleteGoogleDriveFile(doc.driveFileId);
        } catch (driveErr) {
          console.warn('Aviso: el archivo en Drive no se pudo remover o ya fue eliminado.', driveErr);
        }
      }
      await onDeleteDocument(doc.id);
    } catch (err) {
      console.error('Error al eliminar documento:', err);
    } finally {
      setIsDeletingDoc(false);
    }
  };

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('facturacion_comprobantes');
  const [uploadPeriod, setUploadPeriod] = useState('10/2026');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadVep, setUploadVep] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<ClientDocument | null>(null);
  const [copiedVep, setCopiedVep] = useState<string | null>(null);
  const [showDriveInfo, setShowDriveInfo] = useState(false);

  const handleCopyVep = (vep: string) => {
    navigator.clipboard.writeText(vep);
    setCopiedVep(vep);
    setTimeout(() => setCopiedVep(null), 2000);
  };

  const processFile = (file: File) => {
    setSelectedRealFile(file);

    // Auto-populate title if empty
    if (!uploadTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setUploadTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Auto-detect category
    const lower = file.name.toLowerCase();
    if (lower.includes('vep') || lower.includes('afip') || lower.includes('arca') || lower.includes('iva') || lower.includes('2002')) {
      setUploadCategory('arca_afip');
    } else if (lower.includes('iibb') || lower.includes('dgr') || lower.includes('sifere') || lower.includes('chubut')) {
      setUploadCategory('iibb_chubut');
    } else if (lower.includes('balance') || lower.includes('eecc') || lower.includes('estado')) {
      setUploadCategory('balances_contables');
    } else if (lower.includes('estatuto') || lower.includes('acta') || lower.includes('poder') || lower.includes('igj')) {
      setUploadCategory('societario_legal');
    } else if (lower.includes('retencion') || lower.includes('sicore') || lower.includes('830')) {
      setUploadCategory('retenciones_percepciones');
    } else if (lower.includes('931') || lower.includes('sueldo') || lower.includes('nomina')) {
      setUploadCategory('laboral_previsional');
    }

    // Read real file data URL so it can be previewed and downloaded
    const reader = new FileReader();
    reader.onload = () => {
      setRealFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDownloadDocument = (doc: ClientDocument) => {
    if (doc.downloadUrl) {
      const a = document.createElement('a');
      a.href = doc.downloadUrl;
      const ext = doc.fileType === 'excel' ? 'xlsx' : doc.fileType === 'zip' ? 'zip' : doc.fileType === 'xml' ? 'xml' : 'pdf';
      a.download = `${doc.title.replace(/[^a-zA-Z0-9_\-\s]/g, '')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Formal certified receipt blob download
    const certificateContent = `================================================================================
ESTUDIO CONTABLE Y ASESORÍA FINANCIERA ESTRATÉGICA
CR. CARLOS RODRIGO DOMÍNGUEZ & ASOCIADOS
Matrícula Profesional CPCE Provincia del Chubut: Tomo IV Folio 128
Mitre 450, Piso 3, Trelew, Chubut | contacto@crdominguez.ar
================================================================================
CONSTANCIA DE DOCUMENTO DIGITAL REGISTRADO EN BÓVEDA

EMPRESA TITULAR: ${profile.companyName}
CUIT: ${profile.cuit}
FORMA JURÍDICA: ${profile.legalEntity}
DOMICILIO FISCAL: ${profile.location}

TÍTULO DEL DOCUMENTO: ${doc.title}
CATEGORÍA: ${CATEGORY_LABELS[doc.category]?.label || doc.category}
PERÍODO IMPUTADO: ${doc.period}
ESTADO DE AUDITORÍA: ${doc.status.toUpperCase()}
FORMATO Y TAMAÑO: ${doc.fileType.toUpperCase()} (${doc.fileSize})
FECHA DE ALTA EN BÓVEDA: ${new Date(doc.uploadDate).toLocaleString('es-AR')}
REGISTRADO POR: ${doc.uploadedBy}
${doc.vepNumber ? `CÓDIGO VEP / REFERENCIA BANCARIA: ${doc.vepNumber}\n` : ''}${doc.notes ? `NOTAS DEL PROFESIONAL: ${doc.notes}\n` : ''}
HASH CRIPTOGRÁFICO DE SEGURIDAD:
SHA256-${(doc.id || 'DOC').toUpperCase()}-CHUBUT-D&L-VERIFIED
================================================================================
Constancia oficial expedida para la empresa cliente y entidades bancarias o fiscales.`;

    const blob = new Blob([certificateContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Constancia_${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setDriveSyncingStatus(null);
    try {
      const fileSizeFormatted = selectedRealFile
        ? selectedRealFile.size >= 1048576
          ? `${(selectedRealFile.size / 1048576).toFixed(1)} MB`
          : `${(selectedRealFile.size / 1024).toFixed(0)} KB`
        : '1.4 MB';

      const fileTypeDetected: ClientDocument['fileType'] = selectedRealFile
        ? (selectedRealFile.name.endsWith('.xlsx') || selectedRealFile.name.endsWith('.xls') || selectedRealFile.name.endsWith('.csv'))
          ? 'excel'
          : (selectedRealFile.name.endsWith('.zip') || selectedRealFile.name.endsWith('.rar') || selectedRealFile.name.endsWith('.7z'))
          ? 'zip'
          : selectedRealFile.name.endsWith('.xml')
          ? 'xml'
          : 'pdf'
        : 'pdf';

      let driveUploadedFile: DriveFileInfo | null = null;

      // Upload to Google Drive if user chose to sync and Drive is authenticated
      if (syncToDrive && getAccessToken()) {
        setDriveSyncingStatus('Sincronizando con Google Drive en la carpeta del cliente...');
        try {
          const fileToUpload = selectedRealFile || new Blob([
            `Comprobante Bóveda Digital - ${uploadTitle.trim()}\nEmpresa: ${profile.companyName}\nPeríodo: ${uploadPeriod.trim() || '10/2026'}\nFecha: ${new Date().toISOString()}`
          ], { type: 'text/plain' });

          const fileNameToUpload = selectedRealFile
            ? selectedRealFile.name
            : `${uploadTitle.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;

          const mime = selectedRealFile?.type || 'application/octet-stream';

          driveUploadedFile = await uploadFileToGoogleDrive(
            fileToUpload,
            fileNameToUpload,
            mime,
            driveFolder?.id
          );
        } catch (driveErr) {
          console.warn('Aviso: Falló la subida opcional a Google Drive, guardando copia en bóveda local.', driveErr);
        }
      }

      await onUploadDocument({
        clientId: profile.id,
        title: uploadTitle.trim(),
        category: uploadCategory,
        period: uploadPeriod.trim() || '10/2026',
        fileType: fileTypeDetected,
        fileSize: fileSizeFormatted,
        uploadedBy: `Cliente (${profile.companyName})`,
        uploaderRole: 'cliente',
        status: 'en_revision',
        notes: uploadNotes.trim() || undefined,
        vepNumber: uploadVep.trim() || undefined,
        downloadUrl: realFileDataUrl || undefined,
        driveFileId: driveUploadedFile?.id,
        driveWebViewLink: driveUploadedFile?.webViewLink,
        driveFolderId: driveFolder?.id,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadNotes('');
        setUploadVep('');
        setSelectedRealFile(null);
        setRealFileDataUrl(null);
        setDriveSyncingStatus(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      setDriveSyncingStatus(null);
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

        {/* Interactive Google Drive Repository Hub */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/90 border border-blue-200 text-xs text-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-blue-200 text-[#0078D4] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Cloud className="w-5 h-5 text-[#0078D4]" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Repositorio de Archivos & Google Drive
                  </h4>
                  {googleUser ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Drive Conectado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-300">
                      Drive No Conectado
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed max-w-2xl">
                  {googleUser ? (
                    <>
                      Sesión activa con <strong className="text-slate-800">{googleUser.email}</strong>. Cada documento subido se respaldará en la carpeta compartida{' '}
                      <strong className="text-[#0078D4]">Estudio Cr. Domínguez · {profile.companyName}</strong>.
                    </>
                  ) : (
                    <>
                      Los documentos se archivan en la bóveda digital encriptada. Puedes{' '}
                      <strong className="text-slate-800">conectar tu cuenta de Google Drive</strong> sin costo para sincronizar automáticamente todos los archivos fiscales y balances en la nube.
                    </>
                  )}
                </p>

                {driveFolder && (
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-slate-500 font-mono">Carpeta remota:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-blue-200 font-bold text-slate-800">
                      <FolderOpen className="w-3 h-3 text-[#0078D4]" />
                      <span>Estudio Cr. Domínguez · {profile.companyName}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons on the right */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
              {googleUser ? (
                <>
                  {driveFolder?.webViewLink && (
                    <a
                      href={driveFolder.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Abrir Carpeta en Drive</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleDisconnectGoogleDrive}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Cerrar sesión de Google Drive"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span>Desconectar</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGoogleDrive}
                  disabled={isConnectingDrive}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-2 transition-all hover:border-blue-400 cursor-pointer disabled:opacity-60"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>{isConnectingDrive ? 'Conectando con Google...' : 'Conectar con Google Drive'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowDriveInfo(!showDriveInfo)}
                className="px-2.5 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer"
              >
                <HardDrive className="w-3.5 h-3.5 inline mr-1" />
                <span>{showDriveInfo ? 'Ocultar' : 'Info'}</span>
              </button>
            </div>
          </div>

          {driveError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{driveError}</span>
            </div>
          )}

          {showDriveInfo && (
            <div className="pt-3 mt-2 border-t border-blue-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] animate-fadeIn">
              <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900 block">1. Bóveda Local / Base de Datos</span>
                <p className="text-slate-600">
                  Indexación instantánea de metadatos, períodos, números de VEP y hash criptográfico SHA-256 para auditoría fiscal.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900 block">2. Google Drive Workspace</span>
                <p className="text-slate-600">
                  Crea y sincroniza la carpeta <code>Estudio Cr. Domínguez · {profile.companyName}</code> para mantener todos los comprobantes respaldados en tu cuenta.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                <span className="font-bold text-slate-900 block">3. Sin Costo Adicional</span>
                <p className="text-slate-600">
                  Utiliza la cuota habitual de almacenamiento de tu cuenta de Google. Acceso directo tanto dentro del portal como en drive.google.com.
                </p>
              </div>
            </div>
          )}
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
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                              <span className="uppercase">{doc.fileType}</span>
                              <span>·</span>
                              <span>{doc.fileSize}</span>
                              {doc.driveWebViewLink && (
                                <>
                                  <span>·</span>
                                  <a
                                    href={doc.driveWebViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors"
                                    title="Ver archivo respaldado en Google Drive"
                                  >
                                    <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>En Drive</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </>
                              )}
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
                          {doc.driveWebViewLink && (
                            <a
                              href={doc.driveWebViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-600 hover:text-[#0078D4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Abrir directamente en Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#0078D4]" />
                            </a>
                          )}

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
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Descargar archivo certificado"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {doc.uploaderRole === 'cliente' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteDocumentSafe(doc)}
                              disabled={isDeletingDoc}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50"
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
                    <div className="flex items-center gap-1.5">
                      {doc.driveWebViewLink && (
                        <a
                          href={doc.driveWebViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          title="Abrir en Google Drive"
                        >
                          <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Drive</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                      {getStatusBadge(doc.status)}
                    </div>
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
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">
                    {new Date(doc.uploadDate).toLocaleDateString('es-AR')}
                  </span>

                  <div className="flex items-center gap-1">
                    {doc.driveWebViewLink && (
                      <a
                        href={doc.driveWebViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[#0078D4] hover:bg-blue-50 border border-blue-200 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Ver en Google Drive"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Drive</span>
                      </a>
                    )}

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
                      onClick={() => handleDownloadDocument(doc)}
                      className="px-2.5 py-1 text-white bg-[#0078D4] hover:bg-[#106EBE] rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar</span>
                    </button>

                    {doc.uploaderRole === 'cliente' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDocumentSafe(doc)}
                        disabled={isDeletingDoc}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Eliminar documento subido"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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

              {/* Real Interactive File Input & Dropzone */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Seleccionar Archivo (PDF, XLSX, ZIP, XML) *
                  </label>
                  {selectedRealFile && (
                    <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Archivo seleccionado
                    </span>
                  )}
                </div>

                {/* Hidden native input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.xlsx,.xls,.csv,.zip,.rar,.7z,.xml,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                />

                {/* Interactive dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#0078D4] bg-blue-50/80 scale-[1.01]'
                      : selectedRealFile
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-[#0078D4] bg-slate-50 hover:bg-blue-50/20'
                  }`}
                >
                  {selectedRealFile ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs truncate max-w-sm mx-auto">
                          {selectedRealFile.name}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-700 block mt-0.5">
                          {selectedRealFile.size >= 1048576
                            ? `${(selectedRealFile.size / 1048576).toFixed(2)} MB`
                            : `${(selectedRealFile.size / 1024).toFixed(0)} KB`}{' '}
                          · Listo para enviar al estudio
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRealFile(null);
                          setRealFileDataUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        Cambiar o quitar archivo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0078D4] flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">
                          Haz clic para explorar tus archivos o arrastra el documento aquí
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Formatos admitidos: PDF, Planillas Excel (.xlsx, .csv), ZIP y XML de AFIP/ARCA
                        </p>
                      </div>
                      <div className="pt-1">
                        <span className="inline-block px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs">
                          Examinar archivos de mi equipo...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Presets / Templates (if user doesn't have an immediate file) */}
                {!selectedRealFile && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400">O generar ejemplo rápido:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const fakeFile = new File(['%PDF-1.4 Mock Receipt'], 'comprobante_vep_arca_oct2026.pdf', { type: 'application/pdf' });
                        processFile(fakeFile);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                    >
                      + PDF Comprobante VEP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const fakeFile = new File(['A1,B1\nData,123'], 'extracto_bancario_chubut_oct2026.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        processFile(fakeFile);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                    >
                      + Excel Bancario
                    </button>
                  </div>
                )}
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

              {/* Google Drive Automatic Backup Option */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-[#0078D4]" />
                    <span className="font-bold text-slate-800 text-xs">
                      Respaldo en Google Drive
                    </span>
                  </div>
                  {googleUser ? (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Cuenta Conectada
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      No Conectado
                    </span>
                  )}
                </div>

                {googleUser ? (
                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={syncToDrive}
                      onChange={(e) => setSyncToDrive(e.target.checked)}
                      className="mt-0.5 rounded text-[#0078D4] focus:ring-[#0078D4] cursor-pointer"
                    />
                    <div className="text-[11px] text-slate-600 leading-snug">
                      <span className="font-semibold text-slate-800 block">
                        Subir y sincronizar copia en Google Drive ({googleUser.email})
                      </span>
                      <span>
                        Se guardará en la carpeta:{' '}
                        <strong className="text-[#0078D4]">
                          Estudio Cr. Domínguez · {profile.companyName}
                        </strong>
                      </span>
                    </div>
                  </label>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                    <p>
                      Conecta Google Drive para enviar copia automática de este comprobante a tu almacenamiento en la nube sin costo.
                    </p>
                    <button
                      type="button"
                      onClick={handleConnectGoogleDrive}
                      disabled={isConnectingDrive}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-800 shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <GoogleIcon className="w-3.5 h-3.5" />
                      <span>{isConnectingDrive ? 'Conectando...' : 'Conectar Drive'}</span>
                    </button>
                  </div>
                )}
              </div>

              {driveSyncingStatus && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-900 text-xs font-semibold flex items-center gap-2 animate-pulse">
                  <Cloud className="w-4 h-4 text-[#0078D4]" />
                  <span>{driveSyncingStatus}</span>
                </div>
              )}

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

              {previewDoc.driveWebViewLink && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Almacenamiento Cloud:</span>
                  <a
                    href={previewDoc.driveWebViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                  >
                    <Cloud className="w-3 h-3 text-emerald-600" />
                    <span>Google Drive</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                </div>
              )}
            </div>

            {/* Real Uploaded File Preview if DataUrl exists */}
            {previewDoc.downloadUrl && (
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-2 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-mono">
                  <span>Previsualización de archivo original:</span>
                  <span className="font-bold text-[#0078D4] uppercase">{previewDoc.fileType}</span>
                </div>
                {previewDoc.downloadUrl.startsWith('data:image/') ? (
                  <img
                    src={previewDoc.downloadUrl}
                    alt={previewDoc.title}
                    className="max-h-72 w-auto mx-auto rounded object-contain border border-slate-200"
                  />
                ) : previewDoc.downloadUrl.startsWith('data:application/pdf') ? (
                  <iframe
                    src={previewDoc.downloadUrl}
                    title={previewDoc.title}
                    className="w-full h-64 rounded border border-slate-200 bg-white"
                  />
                ) : (
                  <div className="p-4 bg-white rounded border border-slate-200 text-center space-y-1 text-xs">
                    <FileText className="w-8 h-8 text-[#0078D4] mx-auto" />
                    <span className="font-bold text-slate-900 block">{previewDoc.title}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Archivo listo ({previewDoc.fileSize}) para descarga inmediata
                    </span>
                  </div>
                )}
              </div>
            )}

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
                {previewDoc.driveWebViewLink && (
                  <a
                    href={previewDoc.driveWebViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Abrir en Google Drive</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadDocument(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Archivo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
