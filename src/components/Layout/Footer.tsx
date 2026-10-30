import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, MessageSquare, ArrowRight, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { BrandLogo } from '../Common/BrandLogo';
import { contentService, SiteContent } from '../../lib/contentService';

interface FooterProps {
  onNavigate: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());

  useEffect(() => {
    const unsub = contentService.subscribe((updated) => setContent(updated));
    return () => unsub();
  }, []);

  const contact = content.contact;
  const profile = content.profile;

  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappDefaultText)}`;

  return (
    <footer className="w-full bg-slate-900 text-slate-300 text-xs border-t border-slate-800 overflow-x-hidden">
      {/* Top Banner: Direct Executive Action & Fast WhatsApp Connect */}
      <div className="w-full border-b border-slate-800/80 bg-slate-950/60 py-6 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
            <BrandLogo size="md" variant="dark" showSubtitle={true} />
            <span className="hidden lg:inline-block h-6 w-px bg-slate-800 self-center" />
            <span className="text-[11px] text-slate-400 font-mono">
              Sede Central: {contact.address} · {contact.city}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            {/* Direct WhatsApp Call to Action */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] text-white font-bold rounded-lg transition-all shadow-sm cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Directo</span>
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors border border-slate-700 min-h-[44px]"
            >
              <Mail className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>{contact.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Structured Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 sm:pb-12 border-b border-slate-800">
          {/* Col 1: Identidad & Propuesta de Valor */}
          <div className="sm:col-span-2 space-y-3 pr-0 lg:pr-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {profile.founderName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Consultoría de negocios estratégica, dirección financiera (CFO on-demand) y arquitectura tributaria moderna. Superamos la gestoría administrativa tradicional para estructurar negocios sólidos, escalables y con rigor analítico.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-[11px] space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Shield className="w-3.5 h-3.5 text-[#0078D4]" />
                <span>Matrícula Profesional Oficial</span>
              </div>
              <p className="text-slate-400">
                {profile.matricula}. {profile.jurisdiction}.
              </p>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Redes & Canales Digitales
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {content.socialLinks?.linkedin && (
                  <a
                    href={content.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profesional"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#0A66C2] text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 hover:border-[#0A66C2]"
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
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 hover:border-[#FF0000]"
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
                    title="Instagram Oficial"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-600 hover:to-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700"
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
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
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
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#1DB954] text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 hover:border-[#1DB954]"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Ejes de Consultoría */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4]" />
              <span>Soluciones</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              {content.axes.slice(0, 5).map((axis) => (
                <li key={axis.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('solutions')}
                    className="hover:text-white transition-colors text-left truncate max-w-full block"
                  >
                    {axis.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Herramientas & Diagnóstico */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#107C41]" />
              <span>Herramientas</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('simulators')}
                  className="hover:text-white transition-colors text-left"
                >
                  Simulador VAN/TIR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('simulators')}
                  className="hover:text-white transition-colors text-left"
                >
                  Punto de Equilibrio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('diagnostic')}
                  className="hover:text-white transition-colors text-left font-medium text-slate-200"
                >
                  Diagnóstico Estratégico
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="hover:text-white transition-colors text-left"
                >
                  Blog & Podcast Spotify
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="hover:text-white transition-colors text-left"
                >
                  Portal de Clientes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Plataforma & Contacto */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>Gestión & Sede</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors text-left text-slate-200 font-medium"
                >
                  Dashboard, CRM & CMS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('seo')}
                  className="hover:text-white transition-colors text-left"
                >
                  Control & Auditoría SEO
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                <span className="font-semibold text-white block mb-0.5">Sede:</span>
                {contact.address} · {contact.city}
              </li>
              <li className="text-[11px] text-slate-400">
                <span className="font-semibold text-white block mb-0.5">Atención:</span>
                {contact.schedule}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal certifications */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} <strong className="text-slate-300">Cr Dominguez</strong> · Consultoría Estratégica. Todos los derechos reservados.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Dominio Oficial: crdominguez.ar</span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Secreto Profesional (Ley 20.488)</span>
            <span className="hidden sm:inline">·</span>
            <span>Normas CPCE Chubut & FACPCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
