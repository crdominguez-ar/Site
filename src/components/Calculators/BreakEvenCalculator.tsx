import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { LeadCaptureModal } from '../Common/LeadCaptureModal';

export const BreakEvenCalculator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fixedCosts, setFixedCosts] = useState<number>(15000000); // 15 millones ARS o equivalente
  const [unitPrice, setUnitPrice] = useState<number>(45000);
  const [unitVariableCost, setUnitVariableCost] = useState<number>(22000);
  const [estimatedSales, setEstimatedSales] = useState<number>(850);

  const unitContribution = Math.max(0, unitPrice - unitVariableCost);
  const contributionRatio = unitPrice > 0 ? (unitContribution / unitPrice) * 100 : 0;
  
  // Break-even in units = Fixed Costs / Unit Contribution
  const breakEvenUnits = unitContribution > 0 ? Math.ceil(fixedCosts / unitContribution) : 0;
  // Break-even in revenue = Break-even units * Unit price
  const breakEvenRevenue = breakEvenUnits * unitPrice;
  
  // Current operating profit = (Sales * Unit Contribution) - Fixed Costs
  const currentRevenue = estimatedSales * unitPrice;
  const currentTotalVariable = estimatedSales * unitVariableCost;
  const currentTotalContribution = estimatedSales * unitContribution;
  const operatingProfit = currentTotalContribution - fixedCosts;
  const isProfitable = operatingProfit >= 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[#0078D4]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Calculador de Punto de Equilibrio & Margen de Contribución
          </h3>
          <p className="text-sm text-slate-600">
            Diseñado para PyMEs industriales, comerciales y cooperativas de la Patagonia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Costos Fijos Totales del Período (Alquiler, sueldos estructura, seguros, servicios)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
              <input
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-4 py-2 text-slate-900 font-mono focus:border-[#0078D4] focus:outline-none transition-colors"
                placeholder="15000000"
              />
            </div>
            <div className="flex gap-2 mt-1.5">
              {[5000000, 15000000, 30000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFixedCosts(preset)}
                  className="text-xs text-slate-600 hover:text-[#0078D4] bg-slate-100 px-2 py-0.5 rounded transition-colors"
                >
                  ${(preset / 1000000).toFixed(0)}M
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Precio de Venta Promedio (Neto IVA)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-4 py-2 text-slate-900 font-mono focus:border-[#0078D4] focus:outline-none transition-colors"
                  placeholder="45000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Costo Variable Unitario (Materia prima + comisiones)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={unitVariableCost}
                  onChange={(e) => setUnitVariableCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-4 py-2 text-slate-900 font-mono focus:border-[#0078D4] focus:outline-none transition-colors"
                  placeholder="22000"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Unidades Estimadas a Producir/Vender: <span className="text-[#0078D4] font-mono font-bold">{estimatedSales} u.</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {estimatedSales >= breakEvenUnits ? 'Supera umbral' : 'Zona de pérdida'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(2000, breakEvenUnits * 2)}
              step="25"
              value={estimatedSales}
              onChange={(e) => setEstimatedSales(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0078D4]"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Margen de Contribución Unitario</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(unitContribution)} ({contributionRatio.toFixed(1)}%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-xs text-slate-500 block mb-1">Punto de Equilibrio (U)</span>
                <span className="text-xl font-extrabold text-[#0078D4] font-mono tabular-nums">
                  {breakEvenUnits.toLocaleString('es-AR')} <span className="text-xs text-slate-500 font-normal">unidades</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Para cubrir el 100% de costos fijos</span>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-xs text-slate-500 block mb-1">Facturación Umbral</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(breakEvenRevenue)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Ventas mínimas mensuales</span>
              </div>
            </div>

            {/* Operating result preview */}
            <div className={`p-4 rounded-lg border ${isProfitable ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isProfitable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isProfitable ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {isProfitable ? 'Resultado Operativo Positivo' : 'Déficit Operativo Actual'}
                  </span>
                </div>
                <span className={`text-base font-extrabold font-mono tabular-nums ${isProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatCurrency(operatingProfit)}
                </span>
              </div>
              <p className={`text-xs mt-2 ${isProfitable ? 'text-emerald-800' : 'text-rose-800'}`}>
                Con {estimatedSales} unidades vendidas generas {formatCurrency(currentRevenue)} de ventas brutas y absorbes {formatCurrency(currentTotalVariable)} en costos variables directos.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 px-4 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              <CheckCircle2 className="w-4 h-4" />
              Solicitar Dictamen Oficial de Punto de Equilibrio
            </button>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Metodología: Costeo Marginal D&L</span>
              <span className="text-[#0078D4] font-medium">Validado por Cr. Rodrigo Domínguez</span>
            </div>
          </div>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="Simulador Punto de Equilibrio"
        vertical="cfo_estrategico"
        defaultOpportunityTitle="Auditoría de Punto de Equilibrio & Estructura de Costos"
        identifiedProblemDefault={`Punto de Equilibrio: ${breakEvenUnits} unidades (${formatCurrency(breakEvenRevenue)}). Resultado operativo simulado: ${formatCurrency(operatingProfit)}.`}
        calculatedMetrics={{
          fixedCosts,
          unitPrice,
          unitVariableCost,
          estimatedSales,
          breakEvenUnits,
          breakEvenRevenue,
          operatingProfit,
          contributionRatio,
        }}
      />
    </div>
  );
};
