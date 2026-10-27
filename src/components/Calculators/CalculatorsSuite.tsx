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
      {/* Header with Microsoft Enterprise Light Styling */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0078D4] font-mono mb-1">
            <span>Herramientas Analíticas</span>
            <span>·</span>
            <span>Estudio Domínguez & Lambrecht</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Simuladores Interactivos de Viabilidad Económica
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Modelos cuantitativos de precisión financiera y jurídica en tiempo real para estimar costos marginales, recupero de franquicias comerciales, liquidación de divisas e impacto operativo de agentes IA.
          </p>
        </div>

        {/* Microsoft Fluent Segmented Pivot Bar */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveCalculator('breakeven')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activeCalculator === 'breakeven'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Punto de Equilibrio & PyMEs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCalculator('franchise')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activeCalculator === 'franchise'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Franquicias (Ley CCyC 1512-1524)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCalculator('export')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activeCalculator === 'export'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Exportación de Servicios & Divisas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCalculator('zhc')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activeCalculator === 'zhc'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
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
