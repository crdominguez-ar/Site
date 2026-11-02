import React from 'react';
import {
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Building,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ClientProfile, PortalViewId } from '../../types';

interface ClientFiscalCalendarProps {
  profile: ClientProfile;
  onNavigateView: (view: PortalViewId) => void;
}

interface ClientTaxItem {
  id: string;
  taxName: string;
  agency: 'ARCA' | 'DGR Chubut' | 'Convenio Multilateral' | 'Municipal';
  formCode: string;
  period: string;
  dueDate: string;
  urgency: 'critico' | 'proximo' | 'al_dia';
  status: 'liquidado_estudio' | 'vep_emitido' | 'presentado_pagado';
  estimatedAmount?: string;
  vepCode?: string;
  cuitTerm: string;
}

export const ClientFiscalCalendar: React.FC<ClientFiscalCalendarProps> = ({
  profile,
  onNavigateView,
}) => {
  // Extract last digit of CUIT: '30-71894520-4' -> '4'
  const lastDigit = profile.cuit.slice(-1);

  const obligations: ClientTaxItem[] = [
    {
      id: 'tax-1',
      taxName: 'Impuesto al Valor Agregado (IVA)',
      agency: 'ARCA',
      formCode: 'F. 2002',
      period: 'Octubre 2026',
      dueDate: '18 Nov 2026',
      urgency: 'proximo',
      status: 'liquidado_estudio',
      estimatedAmount: 'Saldo Técnico a Favor ($142.300)',
      vepCode: 'VEP-2026-IVA-004',
      cuitTerm: 'Terminación 4-5',
    },
    {
      id: 'tax-2',
      taxName: 'Libro de Sueldos Digital & Seguridad Social',
      agency: 'ARCA',
      formCode: 'F. 931',
      period: 'Octubre 2026',
      dueDate: '14 Nov 2026',
      urgency: 'critico',
      status: 'vep_emitido',
      estimatedAmount: '$ 1.480.200 (Aportes & Contribuciones)',
      vepCode: 'VEP-992140-931',
      cuitTerm: 'Terminación 4-5',
    },
    {
      id: 'tax-3',
      taxName: 'Ingresos Brutos Chubut Régimen General',
      agency: 'DGR Chubut',
      formCode: 'DJ Mensual',
      period: 'Octubre 2026',
      dueDate: '19 Nov 2026',
      urgency: 'proximo',
      status: 'liquidado_estudio',
      estimatedAmount: '$ 284.000',
      vepCode: 'DGR-CH-77812',
      cuitTerm: 'Terminación 4-5',
    },
    {
      id: 'tax-4',
      taxName: 'Convenio Multilateral SIFERE',
      agency: 'Convenio Multilateral',
      formCode: 'CM 03',
      period: 'Octubre 2026',
      dueDate: '17 Nov 2026',
      urgency: 'proximo',
      status: 'liquidado_estudio',
      estimatedAmount: 'Alícuota Bonificada ZHC',
      cuitTerm: 'Terminación 3-5',
    },
    {
      id: 'tax-5',
      taxName: 'Anticipo 05 Impuesto a las Ganancias SAS',
      agency: 'ARCA',
      formCode: 'F. 713',
      period: 'Período 2026',
      dueDate: '14 Nov 2026',
      urgency: 'critico',
      status: 'vep_emitido',
      estimatedAmount: '$ 890.000',
      vepCode: 'VEP-GAN-05-2026',
      cuitTerm: 'Terminación 4-5',
    },
    {
      id: 'tax-6',
      taxName: 'Tasa de Inspección, Seguridad e Higiene Trelew',
      agency: 'Municipal',
      formCode: 'TISH',
      period: '10/2026',
      dueDate: '25 Nov 2026',
      urgency: 'al_dia',
      status: 'presentado_pagado',
      estimatedAmount: '$ 45.000 (Pagado)',
      cuitTerm: 'General',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Calendario Fiscal Personalizado
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-[#0078D4]">
                  CUIT Term. {lastDigit}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Vencimientos calculados según terminación de CUIT ({profile.cuit}) para {profile.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateView('documentacion')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>Ver DDJJ en Documentación</span>
            </button>
          </div>
        </div>

        {/* Notice alert */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#0078D4] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Supervisión Integral por Cr. Carlos Rodrigo Domínguez:</strong> Todas las liquidaciones de IVA y Cargas Sociales son confeccionadas por el estudio. Cuando un VEP es emitido, puedes consultar su código o descargar la declaración jurada desde la pestaña <strong>Gestión Documental</strong>.
          </div>
        </div>
      </div>

      {/* Obligations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {obligations.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.agency}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#0078D4]">
                    {item.formCode}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.urgency === 'critico'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : item.urgency === 'proximo'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.urgency === 'critico' ? 'Vence en < 48 hs' : item.urgency === 'proximo' ? 'Próximo' : 'Al Día'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.taxName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
                  <span>Período: {item.period}</span>
                  <span>·</span>
                  <span className="text-slate-700 font-semibold">{item.cuitTerm}</span>
                </div>
              </div>

              {item.estimatedAmount && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                  <span className="text-slate-500">Monto / Liquidación:</span>
                  <span className="font-mono font-bold text-slate-900">{item.estimatedAmount}</span>
                </div>
              )}

              {item.vepCode && (
                <div className="p-2 bg-blue-50/50 border border-blue-200/60 rounded text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Código VEP:</span>
                  <span className="font-bold text-[#0078D4]">{item.vepCode}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Fecha de Vencimiento</span>
                <span className="font-bold text-slate-900 font-mono">{item.dueDate}</span>
              </div>

              <button
                type="button"
                onClick={() => onNavigateView('documentacion')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-[#0078D4] text-slate-700 hover:text-white border border-slate-200 hover:border-transparent rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Comprobante</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
