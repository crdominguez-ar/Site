import React, { useState } from 'react';
import { Scale, CheckCircle2, XCircle, ArrowUpRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface LegalCheckItem {
  id: string;
  article: string;
  label: string;
  description: string;
  mandatory: boolean;
}

const CCYC_CHECKLIST: LegalCheckItem[] = [
  {
    id: 'cof_antelacion',
    article: 'Art. 1514 inc. a',
    label: 'Entrega previa de la COF (30 días)',
    description: 'El franquiciante debió entregar la Circular de Oferta con no menos de 30 días de anticipación a la firma.',
    mandatory: true,
  },
  {
    id: 'balances_previos',
    article: 'Art. 1514 inc. a',
    label: 'Balances auditados de los 2 años anteriores',
    description: 'Información económica y financiera de al menos 2 años de operaciones de unidades similares de la red.',
    mandatory: true,
  },
  {
    id: 'know_how_probado',
    article: 'Art. 1512 & 1513',
    label: 'Know-how probado, sustancial y documentado',
    description: 'Transmisión de manuales operativos tangibles y asistencia técnica efectiva y permanente.',
    mandatory: true,
  },
  {
    id: 'territorio_exclusividad',
    article: 'Art. 1516',
    label: 'Zona de exclusividad territorial delimitada',
    description: 'Definición precisa de la zona geográfica asignada sin superposiciones de otros locales de la marca.',
    mandatory: false,
  },
  {
    id: 'plazo_minimo',
    article: 'Art. 1516',
    label: 'Plazo legal mínimo (4 años)',
    description: 'El contrato no puede tener una duración inferior a 4 años, salvo ferias o eventos temporales.',
    mandatory: true,
  },
  {
    id: 'no_competencia_acotada',
    article: 'Art. 1518',
    label: 'Cláusula de no competencia acotada a 1 año',
    description: 'La restricción poscontractual no puede superar 1 año ni extenderse fuera de la zona de influencia.',
    mandatory: true,
  },
];

export const FranchiseEvaluationCalculator: React.FC = () => {
  const [initialInvestmentUsd, setInitialInvestmentUsd] = useState<number>(45000);
  const [monthlyExpectedRevenueUsd, setMonthlyExpectedRevenueUsd] = useState<number>(18000);
  const [netMarginPercent, setNetMarginPercent] = useState<number>(18);
  const [monthlyRoyaltyPercent, setMonthlyRoyaltyPercent] = useState<number>(5);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    cof_antelacion: true,
    know_how_probado: true,
    plazo_minimo: true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculations
  const royaltyAmount = (monthlyExpectedRevenueUsd * monthlyRoyaltyPercent) / 100;
  const grossMonthlyProfit = (monthlyExpectedRevenueUsd * netMarginPercent) / 100;
  const netMonthlyCashFlow = Math.max(0, grossMonthlyProfit - royaltyAmount);
  
  // Payback in months
  const paybackMonths = netMonthlyCashFlow > 0 ? (initialInvestmentUsd / netMonthlyCashFlow) : 999;
  const annualRoi = initialInvestmentUsd > 0 ? ((netMonthlyCashFlow * 12) / initialInvestmentUsd) * 100 : 0;

  // Legal Score
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const legalComplianceScore = Math.round((checkedCount / CCYC_CHECKLIST.length) * 100);

  const isLegalSafe = legalComplianceScore >= 80 && checkedItems['balances_previos'] && checkedItems['cof_antelacion'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-950 border border-blue-800/50 rounded-lg text-blue-400">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Evaluador Precontractual de Franquicias (Ley CCyC 1512-1524)
          </h3>
          <p className="text-sm text-slate-400">
            Auditoría de cumplimiento legal argentino y modelo dinámico de recupero (Payback)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Financial inputs and checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Inversión Inicial Total (Fee + Obra + Stock)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">USD</span>
                <input
                  type="number"
                  value={initialInvestmentUsd}
                  onChange={(e) => setInitialInvestmentUsd(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-12 pr-4 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Facturación Mensual Estimada
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">USD</span>
                <input
                  type="number"
                  value={monthlyExpectedRevenueUsd}
                  onChange={(e) => setMonthlyExpectedRevenueUsd(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-12 pr-4 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Margen Neto Operativo antes de Canon ({netMarginPercent}%)
              </label>
              <input
                type="range"
                min="5"
                max="40"
                value={netMarginPercent}
                onChange={(e) => setNetMarginPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Canon Periódico / Regalías ({monthlyRoyaltyPercent}%)
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={monthlyRoyaltyPercent}
                onChange={(e) => setMonthlyRoyaltyPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>
          </div>

          {/* Legal Checklist CCyC */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Auditoría de Requisitos Ley CCyC art. 1512 a 1524</span>
              <span className="font-mono text-cyan-400">{checkedCount} de {CCYC_CHECKLIST.length} cumplidos</span>
            </h4>

            <div className="space-y-2.5">
              {CCYC_CHECKLIST.map((item) => {
                const checked = Boolean(checkedItems[item.id]);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                      checked
                        ? 'bg-slate-950/80 border-cyan-800/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-2 font-medium">
                        <span className={checked ? 'text-white' : 'text-slate-300'}>{item.label}</span>
                        <span className="text-[10px] text-cyan-400/90 font-mono">[{item.article}]</span>
                      </div>
                      <p className="text-slate-400 mt-0.5 text-[11px]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Results and Audit Opinion */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Cumplimiento Normativo CCyC</span>
              <span className="text-lg font-bold font-mono tabular-nums text-white">
                {legalComplianceScore}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Flujo de Caja Neto Mensual</span>
                  <span className="text-sm font-semibold text-slate-300">Margen neto menos royalties</span>
                </div>
                <span className="text-lg font-extrabold text-cyan-400 font-mono tabular-nums">
                  USD {Math.round(netMonthlyCashFlow).toLocaleString('en-US')}
                </span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Período de Recupero (Payback)</span>
                  <span className="text-sm font-semibold text-slate-300">Tiempo estimado de repago</span>
                </div>
                <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                  {paybackMonths < 999 ? `${paybackMonths.toFixed(1)} meses` : 'No recuperable'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Retorno Anual de Inversión (ROI)</span>
                  <span className="text-sm font-semibold text-slate-300">Rendimiento anual proyectado</span>
                </div>
                <span className="text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                  {annualRoi.toFixed(1)}% anual
                </span>
              </div>
            </div>

            {/* Diagnostic recommendation */}
            <div className={`p-4 rounded-lg border ${isLegalSafe ? 'bg-emerald-950/30 border-emerald-800/50' : 'bg-amber-950/30 border-amber-800/50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isLegalSafe ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs font-semibold text-slate-200">
                  {isLegalSafe ? 'Estructura Precontractual Sólida' : 'Observaciones Críticas Detectadas'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isLegalSafe
                  ? 'El contrato presenta solvencia con respecto a los requisitos de la Ley CCyC y el payback estimado se sitúa en un rango comercialmente viable para la Patagonia.'
                  : 'Faltan requisitos esenciales de la Circular de Oferta (COF art. 1514) o balances auditados de los últimos 2 años. Se recomienda solicitar auditoría formal antes de desembolsar el canon inicial.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Área: Derecho & Finanzas Corporativas</span>
            <span className="text-cyan-400 font-medium">Estudio Domínguez & Lambrecht</span>
          </div>
        </div>
      </div>
    </div>
  );
};
