import React, { useState } from 'react';
import { Play, Video, Settings2, CheckCircle2 } from 'lucide-react';

export const ExecutiveVideoSection: React.FC = () => {
  // Default high-caliber business/finance overview video, with user-customizable ID
  const [videoId, setVideoId] = useState<string>('dQw4w9WgXcQ'); // Default placeholder that can be customized
  const [customInput, setCustomInput] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleUpdateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput) return;
    
    // Extract video ID from full URL if provided
    let extracted = customInput.trim();
    if (extracted.includes('youtube.com/watch?v=')) {
      extracted = extracted.split('v=')[1]?.split('&')[0] || extracted;
    } else if (extracted.includes('youtu.be/')) {
      extracted = extracted.split('youtu.be/')[1]?.split('?')[0] || extracted;
    }
    
    setVideoId(extracted);
    setCustomInput('');
    setShowSettings(false);
    setIsPlaying(true);
  };

  return (
    <section className="w-full bg-slate-50/70 border-y border-slate-200/80 py-16 lg:py-20 px-6 sm:px-12 lg:px-20 xl:px-24">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4] mb-1">
              <Video className="w-4 h-4" />
              <span>Conferencia Ejecutiva & Presentación Institucional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Visión Estratégica: El Rol del CFO y la Contabilidad de Vanguardia
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Exposición técnica del Cr. Carlos Rodrigo Domínguez sobre la reestructuración de costos, blindaje contractual de franquicias y el salto hacia modelos digitales e IA en la Patagonia.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-start md:self-auto bg-white px-3 py-1.5 rounded-md border border-slate-300 hover:border-slate-400 transition-colors shadow-sm"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#0078D4]" />
            <span>Configurar Video YouTube</span>
          </button>
        </div>

        {/* Video Config Drawer */}
        {showSettings && (
          <form onSubmit={handleUpdateVideo} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Pega la URL de YouTube o ID (ej. https://www.youtube.com/watch?v=...)"
              className="w-full sm:flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0078D4] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-md whitespace-nowrap transition-colors shadow-sm"
            >
              Actualizar Video
            </button>
          </form>
        )}

        {/* Video Embed Player Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
              {!isPlaying ? (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src="/src/assets/images/strategic_financial_boardroom_1793059909387.jpg"
                    alt="Presentación Ejecutiva Estudio Domínguez & Lambrecht"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0078D4] hover:bg-[#106EBE] text-white flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110 mb-4 ring-4 ring-white/40">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm">
                      Ver Exposición: Dirección Financiera & Negocios Estratégicos
                    </span>
                    <span className="text-xs text-slate-200 font-mono mt-1 drop-shadow-sm">
                      Duración: 14 min · Conferencia Trelew Tech Hub
                    </span>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="Conferencia Ejecutiva Cr. Carlos Rodrigo Domínguez"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>

          {/* Right Column: Key Takeaway Notes */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4] block">
              Puntos Clave del Dictamen
            </span>

            <div className="space-y-3">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0078D4] shrink-0" />
                  <span className="text-xs font-bold text-slate-900">Superación del Costeo Tradicional</span>
                </div>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  Cómo evitar que los costos fijos absorban la liquidez de una PyME industrial o cooperativa en períodos de contracción.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0078D4] shrink-0" />
                  <span className="text-xs font-bold text-slate-900">Cláusulas de Alerta en Franquicias</span>
                </div>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  Los 3 errores más comunes que invalidan la Circular de Oferta de Franquicia según los arts. 1512 a 1524 del CCyC.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0078D4] shrink-0" />
                  <span className="text-xs font-bold text-slate-900">El Paradigma ZHC & Agentes IA</span>
                </div>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  Por qué las empresas 100% IA requieren deducibilidad de API y conciliación contable de wallets antes de escalar.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Cr. Carlos Rodrigo Domínguez</span> · Disertante Principal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
