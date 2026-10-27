import React, { useState } from 'react';
import { Cpu, Zap, Coins, FileCheck, Layers } from 'lucide-react';

export const ZhcSimulationCalculator: React.FC = () => {
  const [agentLoopsCount, setAgentLoopsCount] = useState<number>(4);
  const [tokensPerMonthMillions, setTokensPerMonthMillions] = useState<number>(120);
  const [costPerMillionTokens, setCostPerMillionTokens] = useState<number>(1.5);
  const [humanFteReplaced, setHumanFteReplaced] = useState<number>(5);
  const [humanMonthlySalaryUsd, setHumanMonthlySalaryUsd] = useState<number>(1600);

  // Costs
  const monthlyInferenceCostUsd = tokensPerMonthMillions * costPerMillionTokens;
  const infrastructureCloudCostUsd = agentLoopsCount * 85; // Serverless orchestrator / memory vector DB
  const totalZhcMonthlyCostUsd = monthlyInferenceCostUsd + infrastructureCloudCostUsd;

  // Traditional Payroll (Salary + 42% employer burdens, SAC provision, vacations)
  const traditionalMonthlyCostUsd = humanFteReplaced * (humanMonthlySalaryUsd * 1.42);
  const monthlySavingsUsd = Math.max(0, traditionalMonthlyCostUsd - totalZhcMonthlyCostUsd);
  const annualSavingsUsd = monthlySavingsUsd * 12;
  const efficiencyRatio = traditionalMonthlyCostUsd > 0 ? ((monthlySavingsUsd / traditionalMonthlyCostUsd) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-950 border border-indigo-800/50 rounded-lg text-indigo-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Simulador de Viabilidad Operativa & Tributaria ZHC (Zero-Human Company)
          </h3>
          <p className="text-sm text-slate-400">
            Modelado de costos de inferencia multi-agente vs nómina tradicional y auditoría de tesorería
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Bucles Multi-Agente Activos ({agentLoopsCount})
              </label>
              <input
                type="range"
                min="1"
                max="16"
                value={agentLoopsCount}
                onChange={(e) => setAgentLoopsCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Agentes autónomos (ventas, soporte, backoffice, coding)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Consumo Mensual de Tokens ({tokensPerMonthMillions}M)
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={tokensPerMonthMillions}
                onChange={(e) => setTokensPerMonthMillions(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Millones de tokens procesados (prompt + completion)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Costo Promedio / Millón Tokens
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.1"
                  value={costPerMillionTokens}
                  onChange={(e) => setCostPerMillionTokens(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Personal Humano Equivalente ({humanFteReplaced} FTEs)
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={humanFteReplaced}
                onChange={(e) => setHumanFteReplaced(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Salario Bruto Tradicional Promedio (USD / mes por empleado)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">USD</span>
              <input
                type="number"
                value={humanMonthlySalaryUsd}
                onChange={(e) => setHumanMonthlySalaryUsd(Math.max(300, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-12 pr-4 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Aspectos Tributarios ZHC que dictamina D&L:
            </span>
            <ul className="text-slate-400 space-y-1 list-disc list-inside">
              <li>Deducibilidad de facturas de OpenAI/Anthropic/Google Cloud en Ganancias.</li>
              <li>Conciliación de transacciones on-chain y smart contracts con balance legal.</li>
              <li>Personería jurídica societaria de transición (SAS con gobierno automatizado).</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Eficiencia Operativa Relativa</span>
              <span className="text-lg font-bold text-indigo-400 font-mono tabular-nums">
                +{efficiencyRatio.toFixed(1)}% de ahorro
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block mb-1">Costo ZHC Mensual (IA)</span>
                <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                  USD {Math.round(totalZhcMonthlyCostUsd).toLocaleString('en-US')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tokens + Infraestructura</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block mb-1">Costo Nómina Tradicional</span>
                <span className="text-lg font-extrabold text-slate-300 font-mono tabular-nums">
                  USD {Math.round(traditionalMonthlyCostUsd).toLocaleString('en-US')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Incluye 42% cargas sociales</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">Ahorro Neto Anualizado</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                  + USD {Math.round(annualSavingsUsd).toLocaleString('en-US')} / año
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Una empresa ZHC con {agentLoopsCount} bucles autónomos reduce costos fijos de estructura un {efficiencyRatio.toFixed(0)}%, pero requiere blindaje legal para evitar contingencias fiscales por falta de sustancia laboral tradicional.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Vanguardia: ZHC & Governança Cripto</span>
            <span className="text-indigo-400 font-medium">Asesoría Cr. Carlos Rodrigo Domínguez</span>
          </div>
        </div>
      </div>
    </div>
  );
};
