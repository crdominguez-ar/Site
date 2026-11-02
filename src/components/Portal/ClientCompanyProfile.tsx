import React from 'react';
import {
  Building2,
  Download,
  ShieldCheck,
  FileText,
  UserCheck,
  CreditCard,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';
import { ClientProfile, PortalViewId } from '../../types';

interface ClientCompanyProfileProps {
  profile: ClientProfile;
  onNavigateView: (view: PortalViewId) => void;
}

export const ClientCompanyProfile: React.FC<ClientCompanyProfileProps> = ({
  profile,
  onNavigateView,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0078D4] flex items-center justify-center font-black text-base shadow-xs">
              {profile.companyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {profile.companyName}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-[#0078D4]">
                  {profile.legalEntity}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                CUIT: {profile.cuit} · Domicilio Fiscal: {profile.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cliente Activo Verificado</span>
            </span>
          </div>
        </div>

        {/* Core Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Tipo Societario</span>
            <span className="font-bold text-slate-900 text-sm block">{profile.legalEntity}</span>
            <span className="text-[11px] text-slate-500">Inscripta en IGJ Chubut</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Plan de Abono Vigente</span>
            <span className="font-bold text-[#0078D4] text-sm block truncate">{profile.activePlan}</span>
            <span className="text-[11px] text-slate-500">Supervisado por Socio Principal</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Índice Salud Fiscal</span>
            <span className="font-bold text-emerald-700 font-mono text-sm block">{profile.fiscalHealthScore}%</span>
            <span className="text-[11px] text-emerald-600 font-medium">Sin contingencias tributarias</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Horas CFO Fraccional</span>
            <span className="font-bold text-slate-900 font-mono text-sm block">
              {profile.cfoHoursUsed} / {profile.cfoHoursAllocated} h
            </span>
            <span className="text-[11px] text-slate-500">Consumidas este mes</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Tax Certificates & Legal Signatories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Constancias Impositivas Oficiales */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0078D4]" />
              <h3 className="text-sm font-bold text-slate-900">
                Constancias Impositivas & Registraciones
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Vigentes
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Constancia de CUIT Oficial ARCA</span>
                <span className="text-[11px] text-slate-500 font-mono">IVA Responsable Inscripto · Ganancias Sociedades</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView('documentacion')}
                className="px-2.5 py-1 text-slate-700 hover:text-[#0078D4] bg-white border border-slate-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Bóveda</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Inscripción DGR Chubut (Ingresos Brutos)</span>
                <span className="text-[11px] text-slate-500 font-mono">Nº Inscripción Provincial: 04-71894520</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView('documentacion')}
                className="px-2.5 py-1 text-slate-700 hover:text-[#0078D4] bg-white border border-slate-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Bóveda</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Certificado de No Retención RG 830</span>
                <span className="text-[11px] text-slate-500 font-mono">Válido para retenciones comerciales hasta 31/12/2026</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView('documentacion')}
                className="px-2.5 py-1 text-slate-700 hover:text-[#0078D4] bg-white border border-slate-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Bóveda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card: Representantes Legales & Banco */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#0078D4]" />
              <h3 className="text-sm font-bold text-slate-900">
                Gobernanza & Representación Legal
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Autoridades SAS</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Lic. Lucía Fernández</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0078D4]">
                  Administradora Titular
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Representación legal y uso de la firma social según Acta de Directorio Nº 08.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> lucia@patagoniadata.io
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> +54 9 280 465-9011
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">Cuenta Corriente Operativa</span>
              <p className="text-slate-600 text-[11px]">
                Banco del Chubut S.A. · Sucursal Trelew Centro
              </p>
              <span className="text-[10px] text-slate-500 font-mono block">
                CBU: 0830001001000048192019 · Alias: PATAGONIA.CLOUD.SAS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
