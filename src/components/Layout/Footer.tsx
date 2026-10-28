import React from 'react';
import { MapPin, Mail, Phone, MessageSquare, ArrowRight, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { BrandLogo } from '../Common/BrandLogo';

interface FooterProps {
  onNavigate: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
      {/* Top Banner: Direct Executive Action & Fast WhatsApp Connect */}
      <div className="w-full border-b border-slate-800/80 bg-slate-950/60 py-6 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" variant="dark" showSubtitle={true} />
            <span className="hidden lg:inline-block h-6 w-px bg-slate-800" />
            <span className="hidden lg:inline-block text-[11px] text-slate-400 font-mono">
              Sede Central: Trelew, Chubut · Cobertura Patagonia & Todo el País
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct WhatsApp Call to Action */}
            <a
              href="https://wa.me/5492804567890?text=Hola%20Cr.%20Dom%C3%ADnguez,%20quisiera%20agendar%20una%20consulta%20ejecutiva"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] text-white font-bold rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Directo (+54 9 280)</span>
            </a>

            <a
              href="mailto:crdominguez.ar@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>crdominguez.ar@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Structured Content Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12 border-b border-slate-800">
          {/* Col 1: Identidad & Propuesta de Valor */}
          <div className="lg:col-span-2 space-y-3.5 pr-0 lg:pr-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Cr. Carlos Rodrigo Domínguez
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
                Consejo Profesional de Ciencias Económicas (CPCE) Provincia del Chubut. Sujeto a estrictas normas de confidencialidad y secreto profesional.
              </p>
            </div>
          </div>

          {/* Col 2: Ejes de Consultoría */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4]" />
              <span>Soluciones</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Costos Marginales & PyMEs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Franquicias (Ley CCyC 1512)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-white transition-colors text-left"
                >
                  SaaS & Factura E (Divisas)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-white transition-colors text-left"
                >
                  CFO On-Demand a 12 Meses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Empresas Autónomas IA (ZHC)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Herramientas & Diagnóstico */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>Gestión & Datos</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors text-left text-slate-200 font-medium"
                >
                  Dashboard & CRM
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
                Valle Inferior del Río Chubut (Trelew / Puerto Madryn / Rawson)
              </li>
              <li className="text-[11px] text-slate-400">
                <span className="font-semibold text-white block mb-0.5">Atención:</span>
                Lunes a Viernes · 09:00 a 18:00 hs
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal certifications */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} <strong className="text-slate-300">Cr Dominguez</strong> · Consultoría Estratégica. Todos los derechos reservados.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dominio Oficial: crdominguez.ar</span>
            </span>
            <span>·</span>
            <span>Secreto Profesional (Ley 20.488)</span>
            <span>·</span>
            <span>Normas CPCE Chubut & FACPCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
