import React, { useState } from 'react';
import { 
  LineChart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  DollarSign, 
  Users, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Percent,
  Layers,
  Sparkles
} from 'lucide-react';

export const UnitEconomicsCalculator: React.FC = () => {
  // Inputs
  const [activeCustomers, setActiveCustomers] = useState<number>(45);
  const [newCustomersMonthly, setNewCustomersMonthly] = useState<number>(8);
  const [churnedCustomersMonthly, setChurnedCustomersMonthly] = useState<number>(2);
  const [arpuMonthly, setArpuMonthly] = useState<number>(450); // USD
  const [variableCostPerCustomer, setVariableCostPerCustomer] = useState<number>(95); // Nube, IA, pasarelas
  const [marketingAndSalesExpense, setMarketingAndSalesExpense] = useState<number>(3600); // USD
  const [expansionRevenuePercent, setExpansionRevenuePercent] = useState<number>(5); // Upgrades/upsells %

  // Calculations
  const mrr = activeCustomers * arpuMonthly;
  const arr = mrr * 12;

  // Churn %
  const monthlyChurnRate = activeCustomers > 0 ? (churnedCustomersMonthly / activeCustomers) : 0.05;
  const annualChurnRate = 1 - Math.pow(1 - monthlyChurnRate, 12);

  // Unit Margin
  const grossProfitPerCustomer = Math.max(0, arpuMonthly - variableCostPerCustomer);
  const contributionMarginPercent = arpuMonthly > 0 ? (grossProfitPerCustomer / arpuMonthly) * 100 : 0;

  // CAC
  const cac = newCustomersMonthly > 0 ? (marketingAndSalesExpense / newCustomersMonthly) : 0;

  // LTV = (ARPU * Gross Margin %) / Churn Rate
  const ltv = monthlyChurnRate > 0 
    ? (arpuMonthly * (contributionMarginPercent / 100)) / monthlyChurnRate 
    : 0;

  // LTV / CAC Ratio
  const ltvCacRatio = cac > 0 ? (ltv / cac) : 0;

  // CAC Payback (meses) = CAC / (ARPU * Gross Margin %)
  const cacPaybackMonths = grossProfitPerCustomer > 0 ? (cac / grossProfitPerCustomer) : 0;

  // Net Revenue Retention (NRR): (Starting MRR - Churn MRR + Expansion MRR) / Starting MRR
  // Expansion MRR = Starting MRR * expansion %
  // Churned MRR = churnedCustomers * ARPU
  const churnedMrr = churnedCustomersMonthly * arpuMonthly;
  const expansionMrr = mrr * (expansionRevenuePercent / 100);
  const nrrPercent = mrr > 0 ? Math.round(((mrr - churnedMrr + expansionMrr) / mrr) * 100) : 100;

  // Health Score & Actions
  const isHealthyLtvCac = ltvCacRatio >= 3.0;
  const isHealthyPayback = cacPaybackMonths <= 12;
  const isHealthyNrr = nrrPercent >= 103;

  return (
    <div className="space-y-6">
      {/* Top Banner & Methodological Notice */}
      <div className="bg-[#1B3636] text-white rounded-xl p-6 border border-[#2B5454] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal-300 mb-1">
              <span>Servicio 01 · Cr. Carlos Rodrigo Domínguez</span>
              <span>·</span>
              <span>Base Contable Conciliada</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Diagnóstico de Unit Economics & Retención Neta (NRR)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Mide con rigor cuánto deja cada cliente y cada plan. Cada indicador surge de registros verificables (ingresos facturados, costos directos de nube/IA y gastos comerciales auditados), no de estimaciones superficiales.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/30 border border-teal-500/30 px-3.5 py-2 rounded-lg self-start md:self-auto shrink-0 font-mono text-xs text-teal-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Benchmark NRR 103% (SaaS 2026)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>Parámetros Operativos del Modelo</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Valores Mensuales</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Clientes Activos Iniciales:</span>
                <span className="font-mono text-slate-900 font-bold tabular-nums">{activeCustomers} empresas</span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={activeCustomers}
                onChange={(e) => setActiveCustomers(Number(e.target.value))}
                className="w-full accent-[#0078D4] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nuevos Clientes / Mes:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCustomersMonthly}
                    onChange={(e) => setNewCustomersMonthly(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Clientes Perdidos (Churn) / Mes:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={churnedCustomersMonthly}
                    onChange={(e) => setChurnedCustomersMonthly(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0078D4]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Ingreso Promedio Mensual por Cliente (ARPU USD):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">USD</span>
                <input
                  type="number"
                  min="20"
                  max="10000"
                  step="25"
                  value={arpuMonthly}
                  onChange={(e) => setArpuMonthly(Math.max(20, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0078D4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Costo Variable Unitario (Nube, IA/Tokens, Pasarela):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">USD</span>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  step="5"
                  value={variableCostPerCustomer}
                  onChange={(e) => setVariableCostPerCustomer(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0078D4]"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Margen de contribución directo: USD {grossProfitPerCustomer.toFixed(0)} ({contributionMarginPercent.toFixed(1)}%)
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Inversión Mensual Comercial & Marketing (Gasto Total):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">USD</span>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  step="200"
                  value={marketingAndSalesExpense}
                  onChange={(e) => setMarketingAndSalesExpense(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0078D4]"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Incluye salarios comerciales, comisiones y pauta publicitaria.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Expansión / Upgrades en Clientes Actuales:</span>
                <span className="font-mono text-emerald-700 font-bold tabular-nums">+{expansionRevenuePercent}% / mes</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={expansionRevenuePercent}
                onChange={(e) => setExpansionRevenuePercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Calculated Results & Diagnostic Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Financial KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* KPI 1: MRR & ARR */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                MRR / ARR Proyectado
              </span>
              <div className="text-lg font-black text-slate-900 font-mono tabular-nums mt-0.5">
                USD {mrr.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                ARR: USD {arr.toLocaleString()}
              </span>
            </div>

            {/* KPI 2: NRR */}
            <div className={`border rounded-xl p-3.5 shadow-2xs ${
              isHealthyNrr ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                Retención Neta (NRR)
              </span>
              <div className={`text-lg font-black font-mono tabular-nums mt-0.5 ${
                isHealthyNrr ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {nrrPercent}%
              </div>
              <span className="text-[10px] text-slate-500 block">
                {isHealthyNrr ? '✓ Supera benchmark (103%)' : '⚠ Churn supera expansión'}
              </span>
            </div>

            {/* KPI 3: Churn Rate */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Tasa de Churn Mensual
              </span>
              <div className="text-lg font-black text-rose-700 font-mono tabular-nums mt-0.5">
                {(monthlyChurnRate * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                Anual: {(annualChurnRate * 100).toFixed(0)}% de cartera
              </span>
            </div>

            {/* KPI 4: CAC */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                CAC (Costo Adquisición)
              </span>
              <div className="text-lg font-black text-slate-900 font-mono tabular-nums mt-0.5">
                USD {cac.toFixed(0)}
              </div>
              <span className="text-[10px] text-slate-500 block">
                Por nuevo cliente cerrado
              </span>
            </div>

            {/* KPI 5: LTV */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                LTV (Valor de Vida)
              </span>
              <div className="text-lg font-black text-[#0078D4] font-mono tabular-nums mt-0.5">
                USD {ltv.toFixed(0)}
              </div>
              <span className="text-[10px] text-slate-500 block">
                Margen acumulado / cliente
              </span>
            </div>

            {/* KPI 6: LTV / CAC */}
            <div className={`border rounded-xl p-3.5 shadow-2xs ${
              isHealthyLtvCac ? 'bg-blue-50/50 border-blue-200' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                Ratio LTV / CAC
              </span>
              <div className={`text-lg font-black font-mono tabular-nums mt-0.5 ${
                isHealthyLtvCac ? 'text-[#0078D4]' : 'text-rose-700'
              }`}>
                {ltvCacRatio.toFixed(1)}x
              </div>
              <span className="text-[10px] text-slate-500 block">
                {isHealthyLtvCac ? '✓ Eficiencia comercial alta (≥3x)' : '⚠ Desbalance de adquisición'}
              </span>
            </div>
          </div>

          {/* Payback Bar and Diagnostics */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Tiempo de Recupero del CAC (Payback Period):</span>
              </div>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {cacPaybackMonths.toFixed(1)} meses
              </span>
            </div>

            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isHealthyPayback ? 'bg-[#107C41]' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (cacPaybackMonths / 24) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0m (Instantáneo)</span>
              <span>12m (Umbral Saludable)</span>
              <span>24m+ (Riesgoso para Caja)</span>
            </div>
          </div>

          {/* 5 Acciones Priorizadas del Diagnóstico Oficial */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#107C41]" />
              <span>5 Acciones Recomendadas por el Cr. Carlos Rodrigo Domínguez</span>
            </h5>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg flex items-start gap-2">
                <span className="font-mono font-bold text-[#0078D4] text-[11px] shrink-0">01.</span>
                <p className="text-slate-700 leading-snug">
                  <strong>Auditoría de Costos Ocultos de Servidores e IA:</strong> Separar costos de inferencia y computación para reflejar el margen de contribución real por plan sin distorsiones contables.
                </p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg flex items-start gap-2">
                <span className="font-mono font-bold text-[#0078D4] text-[11px] shrink-0">02.</span>
                <p className="text-slate-700 leading-snug">
                  <strong>Estrategia Anti-Churn Temprana:</strong> Si el churn supera el 3% mensual, implementar protocolo de retención antes del mes 3 (período crítico de abandono en negocios por suscripción).
                </p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg flex items-start gap-2">
                <span className="font-mono font-bold text-[#0078D4] text-[11px] shrink-0">03.</span>
                <p className="text-slate-700 leading-snug">
                  <strong>Alineación del CAC con Canales de Venta:</strong> Imputar sueldos comerciales y comisiones de pasarela (Stripe, Lemon, MercadoPago) para no sobrestimar la rentabilidad inicial.
                </p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg flex items-start gap-2">
                <span className="font-mono font-bold text-[#0078D4] text-[11px] shrink-0">04.</span>
                <p className="text-slate-700 leading-snug">
                  <strong>Escalones de Pricing & Indexación:</strong> Establecer cláusulas de ajuste inflacionario en contratos en pesos o migrar a tarifas en moneda dura (USD) para blindar el margen.
                </p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg flex items-start gap-2">
                <span className="font-mono font-bold text-[#0078D4] text-[11px] shrink-0">05.</span>
                <p className="text-slate-700 leading-snug">
                  <strong>Estructuración Formal para Rondas:</strong> Si el ratio LTV/CAC es mayor a 3x y el NRR supera 103%, preparar el Data Room contable para inversores ángeles y fondos de Venture Capital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
