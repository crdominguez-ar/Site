import React, { useState, useEffect } from 'react';
import { MapPin, Shield, CheckCircle } from 'lucide-react';
import carlosPortrait from '../../assets/images/carlos_dominguez_portrait_1793059909952.jpg';
import { contentService, SiteContent } from '../../lib/contentService';

export const PartnerProfile: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());

  useEffect(() => {
    const unsub = contentService.subscribe((updated) => setContent(updated));
    return () => unsub();
  }, []);

  const profile = content.profile;

  return (
    <div id="estudio" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Portrait */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-xl overflow-hidden border border-slate-200/90 shadow-sm mb-4 group bg-white">
            <img
              src={carlosPortrait}
              alt={profile.founderName}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {profile.founderName}
          </h3>
          <p className="text-xs text-[#0078D4] font-mono mt-0.5 font-semibold">
            {profile.matricula}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Trelew, Chubut, Patagonia Argentina</span>
          </div>
        </div>

        {/* Right: Editorial Bio and Strategic Manifest */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <div className="text-xs uppercase tracking-wider text-[#0078D4] font-semibold font-mono">
            {profile.badge}
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
            {profile.quote}
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
            {profile.manifesto}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
            <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200/90 rounded-lg shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block mb-1">
                Rigor Normativo & Jurídico
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Especialista en estructuración societaria, régimen de franquicias (Código Civil y Comercial art. 1512-1524) y defensas técnicas ante organismos tributarios.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-blue-50/40 border border-blue-200/80 rounded-lg shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block mb-1">
                CFO & Modelado Financiero
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dirección financiera basada en datos: flujos de fondos descontados (VAN/TIR), margen de contribución, preservación de caja y presupuestos dinámicos a 12 meses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
