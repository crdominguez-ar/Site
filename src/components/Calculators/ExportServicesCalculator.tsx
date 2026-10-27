import React, { useState } from 'react';
import { Globe, DollarSign, ShieldAlert, Check, TrendingUp } from 'lucide-react';

export const ExportServicesCalculator: React.FC = () => {
  const [monthlyInvoicedUsd, setMonthlyInvoicedUsd] = useState<number>(6500);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(3.5);
  const [annualFreeQuotaUsd] = useState<number>(24000); // Cupo de exportación de servicios de libre disponibilidad para personas humanas / simplificado
  const [isKnowledgeEconomyEligible, setIsKnowledgeEconomyEligible] = useState<boolean>(true);

  const annualInvoicedUsd = monthlyInvoicedUsd * 12;
  const platformFeesAnnual = (annualInvoicedUsd * platformFeePercent) / 100;
  const netInvoicedAnnual = Math.max(0, annualInvoicedUsd - platformFeesAnnual);

  // Free quota calculation
  const quotaFreeUsd = Math.min(netInvoicedAnnual, annualFreeQuotaUsd);
  const excessSubjectToMulcOrFinancial = Math.max(0, netInvoicedAnnual - annualFreeQuotaUsd);

  // Knowledge economy tax benefits: 60% reduction in corporate income tax and contributions tax credit
  const taxSavingsEstimateUsd = isKnowledgeEconomyEligible ? annualInvoicedUsd * 0.085 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-950 border border-emerald-800/50 rounded-lg text-emerald-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Simulador de Exportación de Servicios & Liquidación de Divisas
          </h3>
          <p className="text-sm text-slate-400">
            Ingeniería tributaria y cambiaria para SaaS, creadores, agencias y consultores tech
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Facturación Mensual en Divisas (Factura E / Exportación)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">USD</span>
              <input
                type="number"
                value={monthlyInvoicedUsd}
                onChange={(e) => setMonthlyInvoicedUsd(Math.max(100, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-12 pr-4 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="6500"
              />
            </div>
            <div className="flex gap-2 mt-1.5">
              {[2500, 6500, 15000, 30000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlyInvoicedUsd(preset)}
                  className="text-xs text-slate-400 hover:text-emerald-400 bg-slate-800/60 px-2 py-0.5 rounded transition-colors"
                >
                  USD {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Comisión Pasarela / Plataforma (Stripe, Lemon Squeezy, Paddle, Wise): <span className="text-emerald-400 font-mono">{platformFeePercent}%</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={platformFeePercent}
              onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="lec"
                checked={isKnowledgeEconomyEligible}
                onChange={(e) => setIsKnowledgeEconomyEligible(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="lec" className="cursor-pointer">
                <span className="text-xs font-semibold text-white block">
                  Elegible para Régimen de Economía del Conocimiento (Ley 27.506)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Software, biotecnología, producción audiovisual o I+D con personal formalizado o certificación de calidad.
                </span>
              </label>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Regla Cambiaria BCRA:</span>
            </div>
            <p>
              Las divisas cobradas por exportación de servicios deben ingresarse dentro de los 5 días hábiles bancarios siguientes a la acreditación en la cuenta del exterior.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Facturación Bruta Anualizada</span>
              <span className="text-lg font-bold text-white font-mono tabular-nums">
                USD {annualInvoicedUsd.toLocaleString('en-US')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Cupo Exento de Liquidación Forzosa</span>
                  <span className="text-[11px] text-emerald-400 font-medium">Disponible en moneda dura en cuenta local</span>
                </div>
                <span className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                  USD {quotaFreeUsd.toLocaleString('en-US')}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Excedente Anual a Liquidar / Estructurar</span>
                  <span className="text-[11px] text-slate-400">Canalizable vía MULC o estructura SAS/LLC</span>
                </div>
                <span className="text-base font-extrabold text-white font-mono tabular-nums">
                  USD {excessSubjectToMulcOrFinancial.toLocaleString('en-US')}
                </span>
              </div>

              {isKnowledgeEconomyEligible && (
                <div className="p-3 bg-slate-900 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Ahorro Impositivo Proyectado (LEC)</span>
                    <span className="text-[11px] text-emerald-400">Bono fiscal contribuciones + rebaja Ganancias</span>
                  </div>
                  <span className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                    + USD {Math.round(taxSavingsEstimateUsd).toLocaleString('en-US')} / año
                  </span>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Recomendación Estratégica D&L</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {excessSubjectToMulcOrFinancial > 0
                  ? 'Tu volumen de facturación supera el cupo simplificado. Conviene estructurar una arquitectura corporativa combinada (SAS local + filial en el exterior) para preservar el valor de tus divisas de forma 100% legal.'
                  : 'Tu facturación se encuentra dentro de los márgenes de exención directa. Puedes ingresar la totalidad de tus cobros a cuentas en dólares en Argentina mediante el régimen de Factura E.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Encuadre: Com. BCRA & Ley 27.506</span>
            <span className="text-emerald-400 font-medium">Asesoría Tributaria Digital D&L</span>
          </div>
        </div>
      </div>
    </div>
  );
};
