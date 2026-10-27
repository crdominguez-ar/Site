import React from 'react';
import { Award, Briefcase, MapPin, Scale, ChevronRight } from 'lucide-react';

export const PartnerProfile: React.FC = () => {
  return (
    <section id="estudio" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Portrait */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl mb-4 group">
            <img
              src="/src/assets/images/carlos_dominguez_portrait_1793059909952.jpg"
              alt="Cr. Carlos Rodrigo Domínguez"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Cr. Carlos Rodrigo Domínguez
          </h3>
          <p className="text-xs text-cyan-400 font-mono mt-0.5">
            Socio Director · Matrícula Profesional CPCE Chubut
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Trelew, Chubut, Patagonia Argentina</span>
          </div>
        </div>

        {/* Right: Editorial Bio and Strategic Manifest */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
            Manifiesto & Liderazgo
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
            "La contabilidad que genera valor estratégico, no meras declaraciones juradas a mes vencido."
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            En un entorno macroeconómico dinámico y en plena revolución de modelos autónomos de inteligencia artificial, el rol del contador y director financiero debe elevarse. En <strong>Estudio Contable Domínguez & Lambrecht</strong> no operamos como una gestoría administrativa tradicional: actuamos como socios estratégicos de las empresas que impulsan el desarrollo de la Patagonia y el ecosistema global.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-xs font-bold text-white block mb-1">
                Rigor Normativo & Jurídico
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Especialista en estructuración societaria, régimen de franquicias (Código Civil y Comercial art. 1512-1524) y defensas técnicas ante organismos tributarios.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-xs font-bold text-white block mb-1">
                CFO & Modelado Financiero
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dirección financiera basada en datos: flujos de fondos descontados (VAN/TIR), margen de contribución, preservación de caja y presupuestos dinámicos a 12 meses.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
            <span>Sede Central: Trelew, Chubut</span>
            <span>·</span>
            <span>Atención Directa: crdominguez.ar@gmail.com</span>
            <span>·</span>
            <span className="text-cyan-400 font-medium">Consultoría Presencial & Remota Latam</span>
          </div>
        </div>
      </div>
    </section>
  );
};
