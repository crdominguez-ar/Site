import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  FileText,
  MessageSquare,
  CalendarCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Phone,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { ClientProfile, PortalViewId } from '../../types';

interface NavItem {
  id: PortalViewId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'warning' | 'info' | 'success';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface ClientPortalSidebarProps {
  activeView: PortalViewId;
  onSelectView: (view: PortalViewId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  profile: ClientProfile;
  onExitToWebsite: () => void;
  documentsCount?: number;
  pendingReviewCount?: number;
  reportsCount?: number;
  openTicketsCount?: number;
}

export const ClientPortalSidebar: React.FC<ClientPortalSidebarProps> = ({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  profile,
  onExitToWebsite,
  documentsCount = 7,
  pendingReviewCount = 1,
  reportsCount = 4,
  openTicketsCount = 1,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Portal Principal',
      items: [
        {
          id: 'resumen',
          label: 'Visión General & Cuenta',
          shortLabel: 'Resumen',
          icon: LayoutDashboard,
        },
        {
          id: 'documentacion',
          label: 'Gestión Documental & Archivos',
          shortLabel: 'Documentos',
          icon: FolderLock,
          badge: pendingReviewCount > 0 ? `${pendingReviewCount} rev.` : `${documentsCount}`,
          badgeType: pendingReviewCount > 0 ? 'warning' : 'info',
        },
      ],
    },
    {
      title: 'Dictámenes & Asesoría',
      items: [
        {
          id: 'reportes',
          label: 'Reportes & Dictámenes',
          shortLabel: 'Reportes',
          icon: FileText,
          badge: reportsCount > 0 ? `${reportsCount}` : undefined,
          badgeType: 'success',
        },
        {
          id: 'consultas',
          label: 'Consultas & Tickets Directos',
          shortLabel: 'Tickets',
          icon: MessageSquare,
          badge: openTicketsCount > 0 ? `${openTicketsCount} activo` : undefined,
          badgeType: 'info',
        },
      ],
    },
    {
      title: 'Fiscal & Corporativo',
      items: [
        {
          id: 'calendario',
          label: 'Calendario Fiscal de la Empresa',
          shortLabel: 'Calendario',
          icon: CalendarCheck,
          badge: 'ARCA',
          badgeType: 'info',
        },
        {
          id: 'datos_empresa',
          label: 'Datos Societarios & Constancias',
          shortLabel: 'Empresa',
          icon: Building2,
        },
      ],
    },
  ];

  const handleNavClick = (viewId: PortalViewId) => {
    onSelectView(viewId);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const getBadgeStyle = (type?: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'info':
      default:
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    }
  };

  return (
    <>
      {/* Mobile Off-Canvas Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0B1528] text-slate-200 border-r border-slate-800/80 transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        {/* Header Branding & Collapse Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#0078D4] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                CD
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black tracking-tight text-white truncate">
                  PORTAL CLIENTES
                </span>
                <span className="text-[10px] text-blue-400 font-mono truncate">
                  Cr. Domínguez & Asoc.
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#0078D4] text-white flex items-center justify-center font-black text-xs shadow-xs">
              CD
            </div>
          )}

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Client Active Identity Card */}
        <div className="px-3 py-3 border-b border-slate-800/60 shrink-0">
          {!isCollapsed ? (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center justify-center font-black text-xs shrink-0">
                  {profile.companyName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {profile.companyName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    CUIT: {profile.cuit}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                <span className="text-slate-400 font-mono">{profile.legalEntity}</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {profile.fiscalHealthScore}% Salud Fiscal
                </span>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 mx-auto rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center justify-center font-black text-xs cursor-pointer"
              title={`${profile.companyName} (CUIT: ${profile.cuit})`}
            >
              {profile.companyName.charAt(0)}
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeView === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group relative ${
                        isActive
                          ? 'bg-[#0078D4] text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-white group-hover:scale-105'
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : getBadgeStyle(item.badgeType)
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                          {item.label}
                          {item.badge && ` (${item.badge})`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Assigned Senior Accountant Card */}
        {!isCollapsed && (
          <div className="p-3 mx-2 mb-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <div>
                <span className="text-[11px] font-bold text-white block leading-tight">
                  Cr. Carlos Rodrigo Domínguez
                </span>
                <span className="text-[9px] text-slate-400 font-mono block">
                  Mat. CPCE Chubut Tº IV Fº 128
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/5492804589728?text=Hola%20Cr.%20Dom%C3%ADnguez,%20te%20escribo%20desde%20el%20Portal%20Clientes."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Directo Estudio</span>
            </a>
          </div>
        )}

        {/* Footer: Exit back to public site */}
        <div className="p-3 border-t border-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={onExitToWebsite}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Volver a la Web Principal"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span>Volver al Sitio Web</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
