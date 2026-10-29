import React, { useState, useEffect } from 'react';
import { Play, Video, Settings2, CheckCircle2 } from 'lucide-react';
import boardroomImg from '../../assets/images/strategic_financial_boardroom_1793059909387.jpg';
import { contentService, SiteContent } from '../../lib/contentService';

export const ExecutiveVideoSection: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());
  const [customInput, setCustomInput] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = contentService.subscribe((updated) => setContent(updated));
    return () => unsub();
  }, []);

  const videoData = content.videoSection;

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
    
    contentService.updateSection('videoSection', {
      ...videoData,
      youtubeId: extracted,
    });
    setCustomInput('');
    setShowSettings(false);
    setIsPlaying(true);
  };

  return (
    <section className="w-full bg-slate-50/70 border-y border-slate-200/80 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20 overflow-hidden">
      <div className="w-full space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4] mb-1">
              <Video className="w-4 h-4 shrink-0" />
              <span>{videoData.badge}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {videoData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              {videoData.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-start md:self-auto bg-white px-3 py-1.5 rounded-md border border-slate-300 hover:border-slate-400 transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#0078D4]" />
            <span>Editar Video</span>
          </button>
        </div>

        {/* Video Config Drawer */}
        {showSettings && (
          <form onSubmit={handleUpdateVideo} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
            <div className="w-full sm:flex-1">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Pega el link o ID de YouTube:
              </label>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o código de video"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#0078D4] focus:bg-white text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 mt-4 sm:mt-4 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              Guardar y Reproducir
            </button>
          </form>
        )}

        {/* Video Embed Player Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-8 w-full">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200/90 bg-white shadow-md">
              {!isPlaying ? (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src={boardroomImg}
                    alt={`Presentación Ejecutiva · ${videoData.presenterName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#0078D4] hover:bg-[#106EBE] text-white flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110 mb-3 ring-4 ring-white/40">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
                    </div>
                    <span className="text-sm sm:text-lg font-bold text-white tracking-tight drop-shadow-sm max-w-md">
                      {videoData.title}
                    </span>
                    <span className="text-xs text-slate-200 font-mono mt-1 hidden sm:inline-block">
                      Disertante: {videoData.presenterName}
                    </span>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoData.youtubeId}?autoplay=1&rel=0`}
                  title={videoData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>

          {/* Right Column: Key Takeaways */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <span className="text-xs font-mono font-bold text-[#0078D4] uppercase tracking-wider block">
                Disertante Principal
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {videoData.presenterName}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {videoData.presenterBio}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0078D4] shrink-0 mt-0.5" />
                  <span>Costos marginales y absorción de capacidad ociosa</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0078D4] shrink-0 mt-0.5" />
                  <span>Due Diligence de Franquicias según Ley CCyC 1512</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0078D4] shrink-0 mt-0.5" />
                  <span>Factura E, liquidación de divisas y nuevas economías</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
