import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Download,
  Sliders,
  ShieldAlert,
  Percent,
  Sparkles
} from 'lucide-react';

interface ScenarioParams {
  startingCash: number;
  monthlyRevenue: number;
  payrollAndTaxes: number;
  fixedRentAndServices: number;
  variableDirectCosts: number;
  taxesEstimatedMonthly: number;
  scenarioType: 'base' | 'conservative' | 'growth';
}

export const CashFlowRunwayTool: React.FC = () => {
  const [params, setParams] = useState<ScenarioParams>({
    startingCash: 18500000, // $18.5M ARS en caja/bancos
    monthlyRevenue: 12000000, // $12M ARS ventas mensuales
    payrollAndTaxes: 5800000, // $5.8M nómina + 931
    fixedRentAndServices: 1900000, // $1.9M alquileres + servicios
    variableDirectCosts: 2400000, // $2.4M costos directos
    taxesEstimatedMonthly: 1200000, // $1.2M IIBB + IVA neto
    scenarioType: 'base'
  });

  const [activeTab, setActiveTab] = useState<'projections' | 'breakdown' | 'advisory'>('projections');

  // Scenario multipliers
  const scenarioMultiplier = useMemo(() => {
    switch (params.scenarioType) {
      case 'conservative':
        return { revenue: 0.85, costs: 1.12 }; // -15% ingresos, +12% costos
      case 'growth':
        return { revenue: 1.25, costs: 1.05 }; // +25% ingresos, +5% costos
      case 'base':
      default:
        return { revenue: 1.0, costs: 1.0 };
    }
  }, [params.scenarioType]);

  const effectiveRevenue = params.monthlyRevenue * scenarioMultiplier.revenue;
  const effectiveTotalExpenses = 
    (params.payrollAndTaxes + params.fixedRentAndServices + params.taxesEstimatedMonthly) +
    (params.variableDirectCosts * scenarioMultiplier.costs);

  const netMonthlyCashFlow = effectiveRevenue - effectiveTotalExpenses;
  const isBurningCash = netMonthlyCashFlow < 0;
  const burnRate = isBurningCash ? Math.abs(netMonthlyCashFlow) : 0;

  // Runway in months
  const runwayMonths = useMemo(() => {
    if (!isBurningCash) return 999; // Autofinanciado
    if (burnRate <= 0) return 999;
    const months = params.startingCash / burnRate;
    return Math.max(0, Math.round(months * 10) / 10);
  }, [params.startingCash, burnRate, isBurningCash]);

  // Break-even revenue (Punto de Equilibrio mensual)
  const fixedCosts = params.payrollAndTaxes + params.fixedRentAndServices + params.taxesEstimatedMonthly;
  const variableMarginRatio = params.monthlyRevenue > 0 
    ? Math.max(0.05, 1 - (params.variableDirectCosts / params.monthlyRevenue))
    : 0.6;
  const breakEvenRevenue = fixedCosts / variableMarginRatio;

  // 6-month projected projection table
  const projectedMonths = useMemo(() => {
    const list = [];
    const monthNames = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'];
    let runningCash = params.startingCash;

    for (let i = 0; i < 6; i++) {
      // simulate inflation adjustments slightly for future months if conservative
      const infl = params.scenarioType === 'conservative' ? 1 + (i * 0.02) : 1;
      const monthRev = effectiveRevenue;
      const monthExp = effectiveTotalExpenses * infl;
      const net = monthRev - monthExp;
      runningCash += net;

      list.push({
        month: monthNames[i],
        revenue: Math.round(monthRev),
        expenses: Math.round(monthExp),
        net: Math.round(net),
        endingCash: Math.round(runningCash)
      });
    }
    return list;
  }, [params.startingCash, effectiveRevenue, effectiveTotalExpenses, params.scenarioType]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleReset = () => {
    setParams({
      startingCash: 18500000,
      monthlyRevenue: 12000000,
      payrollAndTaxes: 5800000,
      fixedRentAndServices: 1900000,
      variableDirectCosts: 2400000,
      taxesEstimatedMonthly: 1200000,
      scenarioType: 'base'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                CFO Estratégico & Finanzas Corporativas
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Proyector de Cash Flow, Burn Rate & Runway PyME
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Simulador financiero para proyectar liquidez, meses de supervivencia y punto de equilibrio en escenarios de volatilidad patagónica.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Base
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Dictamen CFO
            </button>
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Liquidez Disponible en Caja</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {formatCurrency(params.startingCash)}
            </div>
            <span className="text-[11px] text-slate-400">Bancos + FCI + Tesorería</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Resultado Neto Mensual</span>
            <div className={`text-xl font-bold font-mono mt-1 ${netMonthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {netMonthlyCashFlow >= 0 ? '+' : ''}{formatCurrency(netMonthlyCashFlow)}
            </div>
            <span className="text-[11px] text-slate-400">
              {netMonthlyCashFlow >= 0 ? 'Superávit operativo' : 'Quema de caja neta (Burn Rate)'}
            </span>
          </div>

          <div className={`p-4 rounded-xl border ${
            runwayMonths < 3 
              ? 'bg-rose-50 border-rose-200' 
              : runwayMonths < 6 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <span className="text-xs font-medium text-slate-700">Autonomía Financiera (Runway)</span>
            <div className={`text-xl font-bold font-mono mt-1 ${
              runwayMonths < 3 ? 'text-rose-700' : runwayMonths < 6 ? 'text-amber-800' : 'text-emerald-800'
            }`}>
              {runwayMonths >= 999 ? 'Flujo Positivo (+∞)' : `${runwayMonths} meses`}
            </div>
            <span className="text-[11px] text-slate-500">
              {runwayMonths >= 999 ? 'No consume capital' : 'Meses de supervivencia con caja actual'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Punto de Equilibrio (Break-even)</span>
            <div className="text-xl font-bold font-mono text-blue-900 mt-1">
              {formatCurrency(breakEvenRevenue)}
            </div>
            <span className="text-[11px] text-slate-400">Ventas mínimas para cubrir estructura</span>
          </div>
        </div>
      </div>

      {/* Simulator Inputs & Scenario Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Variables del Negocio
            </h2>

            {/* Scenario toggle */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[10px] font-medium">
              <button
                onClick={() => setParams({ ...params, scenarioType: 'conservative' })}
                className={`px-2 py-1 rounded transition-colors ${params.scenarioType === 'conservative' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Defensivo
              </button>
              <button
                onClick={() => setParams({ ...params, scenarioType: 'base' })}
                className={`px-2 py-1 rounded transition-colors ${params.scenarioType === 'base' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Base
              </button>
              <button
                onClick={() => setParams({ ...params, scenarioType: 'growth' })}
                className={`px-2 py-1 rounded transition-colors ${params.scenarioType === 'growth' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Expansión
              </button>
            </div>
          </div>

          {/* Input fields */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Caja y Disponibilidades Iniciales</span>
                <span className="font-mono font-medium">{formatCurrency(params.startingCash)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="80000000"
                step="500000"
                value={params.startingCash}
                onChange={(e) => setParams({ ...params, startingCash: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Ventas Mensuales Facturadas</span>
                <span className="font-mono font-medium">{formatCurrency(params.monthlyRevenue)}</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="50000000"
                step="500000"
                value={params.monthlyRevenue}
                onChange={(e) => setParams({ ...params, monthlyRevenue: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Nómina Salarial & Cargas F. 931</span>
                <span className="font-mono font-medium">{formatCurrency(params.payrollAndTaxes)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="30000000"
                step="250000"
                value={params.payrollAndTaxes}
                onChange={(e) => setParams({ ...params, payrollAndTaxes: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Costos Directos / Variables</span>
                <span className="font-mono font-medium">{formatCurrency(params.variableDirectCosts)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="25000000"
                step="250000"
                value={params.variableDirectCosts}
                onChange={(e) => setParams({ ...params, variableDirectCosts: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Alquileres, Servicios & Fijos</span>
                <span className="font-mono font-medium">{formatCurrency(params.fixedRentAndServices)}</span>
              </div>
              <input
                type="range"
                min="300000"
                max="10000000"
                step="100000"
                value={params.fixedRentAndServices}
                onChange={(e) => setParams({ ...params, fixedRentAndServices: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Presión Tributaria Mensual (IVA + IIBB)</span>
                <span className="font-mono font-medium">{formatCurrency(params.taxesEstimatedMonthly)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="8000000"
                step="100000"
                value={params.taxesEstimatedMonthly}
                onChange={(e) => setParams({ ...params, taxesEstimatedMonthly: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Projection Visualizer & Strategic Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('projections')}
              className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                activeTab === 'projections' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Proyección Semestral de Caja
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                activeTab === 'breakdown' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Composición de Costos
            </button>
            <button
              onClick={() => setActiveTab('advisory')}
              className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                activeTab === 'advisory' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diagnóstico & Acciones CFO
            </button>
          </div>

          {/* Tab 1: Projections Table */}
          {activeTab === 'projections' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                  Flujo de Fondos Proyectado (Próximos 6 Meses)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Escenario: {params.scenarioType.toUpperCase()}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Periodo</th>
                      <th className="py-3 px-4 text-right">Ingresos Cobrados</th>
                      <th className="py-3 px-4 text-right">Egresos Totales</th>
                      <th className="py-3 px-4 text-right">Flujo Neto</th>
                      <th className="py-3 px-4 text-right">Saldo Final Proyectado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {projectedMonths.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-sans font-medium text-slate-800">{m.month}</td>
                        <td className="py-3 px-4 text-right text-emerald-600">{formatCurrency(m.revenue)}</td>
                        <td className="py-3 px-4 text-right text-rose-600">{formatCurrency(m.expenses)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${m.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {m.net >= 0 ? '+' : ''}{formatCurrency(m.net)}
                        </td>
                        <td className={`py-3 px-4 text-right font-bold ${m.endingCash >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                          {formatCurrency(m.endingCash)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Breakdown */}
          {activeTab === 'breakdown' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Estructura del Gasto Mensual
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Cargas Laborales & Sueldos (F. 931)</span>
                    <span className="font-mono font-medium">
                      {Math.round((params.payrollAndTaxes / effectiveTotalExpenses) * 100)}% ({formatCurrency(params.payrollAndTaxes)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (params.payrollAndTaxes / effectiveTotalExpenses) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Costos Directos y Operativos Variables</span>
                    <span className="font-mono font-medium">
                      {Math.round(((params.variableDirectCosts * scenarioMultiplier.costs) / effectiveTotalExpenses) * 100)}% ({formatCurrency(params.variableDirectCosts * scenarioMultiplier.costs)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, ((params.variableDirectCosts * scenarioMultiplier.costs) / effectiveTotalExpenses) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Gastos Fijos, Alquileres & Licencias</span>
                    <span className="font-mono font-medium">
                      {Math.round((params.fixedRentAndServices / effectiveTotalExpenses) * 100)}% ({formatCurrency(params.fixedRentAndServices)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (params.fixedRentAndServices / effectiveTotalExpenses) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Presión Impositiva Directa Estimada</span>
                    <span className="font-mono font-medium">
                      {Math.round((params.taxesEstimatedMonthly / effectiveTotalExpenses) * 100)}% ({formatCurrency(params.taxesEstimatedMonthly)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (params.taxesEstimatedMonthly / effectiveTotalExpenses) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: CFO Strategic Advisory */}
          {activeTab === 'advisory' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Recomendaciones del Dictamen Contable y Financiero
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                {runwayMonths < 4 ? (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-rose-900">Alerta de Liquidez Crítica</p>
                      <p className="text-rose-800 mt-1">
                        El Runway actual es menor a 4 meses. Se recomienda auditar plazos medios de cobranza (DSO), renegociar con proveedores estratégicos y evaluar planes de facilidades fiscales en ARCA para proteger la nómina laboral.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">Salud Financiera Estable</p>
                      <p className="text-emerald-800 mt-1">
                        La empresa posee más de 6 meses de autonomía operativa. Se sugiere estructurar colocaciones de excedentes en cuentas remuneradas o bonos soberanos cortos para mitigar la erosión inflacionaria.
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="font-semibold text-slate-900">Punto de Equilibrio Operativo</p>
                  <p className="text-slate-600 mt-1">
                    Para no comprometer capital de trabajo propio, la facturación mensual mínima requerida es de{' '}
                    <strong className="text-slate-900 font-mono">{formatCurrency(breakEvenRevenue)}</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
