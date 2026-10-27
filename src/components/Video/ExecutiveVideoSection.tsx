import React, { useState } from 'react';
import { Play, Video, ExternalLink, Settings2, CheckCircle2 } from 'lucide-react';

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
    <section className="w-full bg-slate-900/90 border-y border-slate-800 py-16 lg:py-20 px-6 sm:px-12 lg:px-20 xl:px-24">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#00A4EF] mb-1">
              <Video className="w-4 h-4" />
              <span>Conferencia Ejecutiva & Presentación Institucional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Visión Estratégica: El Rol del CFO y la Contabilidad de Vanguardia
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Exposición técnica del Cr. Carlos Rodrigo Domínguez sobre la reestructuración de costos, blindaje contractual de franquicias y el salto hacia modelos digitales e IA en la Patagonia.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 self-start md:self-auto bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#00A4EF]" />
            <span>Configurar Video YouTube</span>
          </button>
        </div>

        {/* Video Config Drawer */}
        {showSettings && (
          <form onSubmit={handleUpdateVideo} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Pega la URL de YouTube o ID (ej. https://www.youtube.com/watch?v=...)"
              className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-white focus:border-[#0078D4] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold rounded-md whitespace-nowrap transition-colors"
            >
              Actualizar Video
            </button>
          </form>
        )}

        {/* Video Embed Player Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              {!isPlaying ? (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src="/src/assets/images/strategic_financial_boardroom_1793059909387.jpg"
                    alt="Presentación Ejecutiva Estudio Domínguez & Lambrecht"
                    className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0078D4] hover:bg-[#106EBE] text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110 mb-4">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Ver Exposición: Dirección Financiera & Negocios Estratégicos
                    </span>
                    <span className="text-xs text-slate-300 font-mono mt-1">
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
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#00A4EF] block">
              Puntos Clave del Dictamen
            </span>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A4EF] shrink-0" />
                  <span className="text-xs font-bold text-white">Superación del Costeo Tradicional</span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  Cómo evitar que los costos fijos absorban la liquidez de una PyME industrial o cooperativa en períodos de contracción.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A4EF] shrink-0" />
                  <span className="text-xs font-bold text-white">Cláusulas de Alerta en Franquicias</span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  Los 3 errores más comunes que invalidan la Circular de Oferta de Franquicia según los arts. 1512 a 1524 del CCyC.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A4EF] shrink-0" />
                  <span className="text-xs font-bold text-white">El Paradigma ZHC & Agentes IA</span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  Por qué las empresas 100% IA requieren deducibilidad de API y conciliación contable de wallets antes de escalar.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Cr. Carlos Rodrigo Domínguez</span> · Disertante Principal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
