import React, { useState } from 'react';
import { BreakEvenCalculator } from './BreakEvenCalculator';
import { FranchiseEvaluationCalculator } from './FranchiseEvaluationCalculator';
import { ExportServicesCalculator } from './ExportServicesCalculator';
import { ZhcSimulationCalculator } from './ZhcSimulationCalculator';
import { Building2, Scale, Globe, Cpu } from 'lucide-react';

export const CalculatorsSuite: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<'breakeven' | 'franchise' | 'export' | 'zhc'>('breakeven');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
            Modelos Cuantitativos & Simuladores Financieros
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Simuladores Interactivos de Viabilidad Económica
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Herramientas financieras y jurídicas en tiempo real desarrolladas por Estudio Domínguez & Lambrecht para evaluar proyectos, costos marginales, recupero de franquicias y estructuras 100% IA.
          </p>
        </div>

        {/* Tab Controls (clean segmented control) */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveCalculator('breakeven')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeCalculator === 'breakeven'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Punto de Equilibrio & PyMEs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCalculator('franchise')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeCalculator === 'franchise'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Franquicias (Ley CCyC 1512-1524)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCalculator('export')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeCalculator === 'export'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Exportación de Servicios & Divisas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCalculator('zhc')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeCalculator === 'zhc'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Empresas 100% IA (ZHC)</span>
          </button>
        </div>
      </div>

      {/* Render Active Calculator */}
      <div>
        {activeCalculator === 'breakeven' && <BreakEvenCalculator />}
        {activeCalculator === 'franchise' && <FranchiseEvaluationCalculator />}
        {activeCalculator === 'export' && <ExportServicesCalculator />}
        {activeCalculator === 'zhc' && <ZhcSimulationCalculator />}
      </div>
    </div>
  );
};
