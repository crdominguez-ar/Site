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

          {/* Social Media & Channels (CMS Controlled) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4 pt-3 border-t border-slate-200/90 w-full max-w-[280px]">
            {content.socialLinks?.linkedin && (
              <a
                href={content.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profesional"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0A66C2] text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </a>
            )}

            {content.socialLinks?.youtube && (
              <a
                href={content.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="Canal de YouTube"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#FF0000] text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}

            {content.socialLinks?.instagram && (
              <a
                href={content.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-gradient-to-tr hover:from-amber-600 hover:to-pink-600 text-slate-700 hover:text-white flex items-center justify-center transition-all border border-slate-200 shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}

            {content.socialLinks?.twitterX && (
              <a
                href={content.socialLinks.twitterX}
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-black text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}

            {content.socialLinks?.spotify && (
              <a
                href={content.socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                title="Podcast en Spotify"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#1DB954] text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </a>
            )}
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
