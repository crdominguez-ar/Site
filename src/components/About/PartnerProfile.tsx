import React from 'react';
import { MapPin } from 'lucide-react';

export const PartnerProfile: React.FC = () => {
  return (
    <div id="estudio" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Portrait */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-md mb-4 group bg-white">
            <img
              src="/src/assets/images/carlos_dominguez_portrait_1793059909952.jpg"
              alt="Cr. Carlos Rodrigo Domínguez"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cr. Carlos Rodrigo Domínguez
          </h3>
          <p className="text-xs text-[#0078D4] font-mono mt-0.5 font-semibold">
            Socio Director · Matrícula Profesional CPCE Chubut
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Trelew, Chubut, Patagonia Argentina</span>
          </div>
        </div>

        {/* Right: Editorial Bio and Strategic Manifest */}
        <div className="lg:col-span-8 space-y-5">
          <div className="text-xs uppercase tracking-wider text-[#0078D4] font-semibold font-mono">
            Manifiesto & Liderazgo
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
            "La contabilidad que genera valor estratégico, no meras declaraciones juradas a mes vencido."
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            En un entorno macroeconómico dinámico y en plena revolución de modelos autónomos de inteligencia artificial, el rol del contador y director financiero debe elevarse. En <strong className="text-slate-900 font-semibold">Estudio Contable Domínguez & Lambrecht</strong> no operamos como una gestoría administrativa tradicional: actuamos como socios estratégicos de las empresas que impulsan el desarrollo de la Patagonia y el ecosistema global.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-xs font-bold text-slate-900 block mb-1">
                Rigor Normativo & Jurídico
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Especialista en estructuración societaria, régimen de franquicias (Código Civil y Comercial art. 1512-1524) y defensas técnicas ante organismos tributarios.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-xs font-bold text-slate-900 block mb-1">
                CFO & Modelado Financiero
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dirección financiera basada en datos: flujos de fondos descontados (VAN/TIR), margen de contribución, preservación de caja y presupuestos dinámicos a 12 meses.
              </p>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200">
            <span>Sede Central: Trelew, Chubut</span>
            <span>·</span>
            <span>Atención Directa: crdominguez.ar@gmail.com</span>
            <span>·</span>
            <span className="text-[#0078D4] font-semibold">Consultoría Presencial & Remota Latam</span>
          </div>
        </div>
      </div>
    </div>
  );
};
