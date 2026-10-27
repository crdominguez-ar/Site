import React from 'react';
import { MapPin, Mail, Phone, Scale } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#020617] border-t border-slate-800 text-slate-400 text-xs">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Wordmark & Firm Identity */}
          <div className="space-y-3">
            <span className="text-base font-bold text-white tracking-tight block">
              Domínguez & Lambrecht
            </span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Consultoría contable, tributaria y de negocios estratégica. Dirección financiera (CFO), evaluación de franquicias y nuevas economías.
            </p>
            <div className="text-[11px] text-slate-400">
              Liderado por el Cr. Carlos Rodrigo Domínguez
              <br />
              Matrícula Profesional CPCE Provincia del Chubut
            </div>
          </div>

          {/* Col 2: Navigation Mirror */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Inicio & Video Conferencia
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#00A4EF] transition-colors font-semibold text-white"
                >
                  Soluciones & Servicios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('simulators')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Simuladores Financieros (VAN/TIR, Punto de Equilibrio)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('diagnostic')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Diagnóstico Estratégico Interactivo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Blog & Podcast Spotify
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Portal de Clientes & Reportes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('crm')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Consola Interna & Pipeline CRM
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('seo')}
                  className="hover:text-[#00A4EF] transition-colors"
                >
                  Control SEO & Metadatos
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Verticals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Áreas de Práctica
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>01. PyMEs Tradicionales, Costos Reales & Cooperativas</li>
              <li>02. Modelos Digitales, SaaS & Factura E (Divisas MULC)</li>
              <li>03. Franquicias Comerciales (Ley CCyC art. 1512-1524)</li>
              <li>04. CFO a Tiempo Parcial & Tableros de Control a 12 Meses</li>
              <li>05. Empresas 100% IA (ZHC) & Tesorerías Cripto On-Chain</li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Sede & Contacto
            </h4>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Trelew, Chubut, Patagonia Argentina</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href="mailto:crdominguez.ar@gmail.com" className="hover:text-cyan-400 transition-colors">
                crdominguez.ar@gmail.com
              </a>
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              Atención presencial en el Valle Inferior del Río Chubut y asesoría remota para todo el país y exterior.
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <span>
            © {new Date().getFullYear()} Estudio Contable Domínguez & Lambrecht. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-4">
            <span>Privacidad y Secreto Profesional</span>
            <span>·</span>
            <span>Normas CPCE Chubut & FACPCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
