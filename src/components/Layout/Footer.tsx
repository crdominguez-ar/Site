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
