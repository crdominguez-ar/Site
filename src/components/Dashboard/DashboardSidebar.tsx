import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  TrendingUp,
  Calculator,
  Globe,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Mail,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { SystemUser } from '../../types';

export type DashboardViewId = 
  | 'widgets' 
  | 'crm' 
  | 'tax_calendar' 
  | 'cash_flow' 
  | 'fee_pricing' 
  | 'cms' 
  | 'seo' 
  | 'users' 
  | 'email';

interface NavItem {
  id: DashboardViewId;
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

interface DashboardSidebarProps {
  activeView: DashboardViewId;
  onSelectView: (view: DashboardViewId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: SystemUser | null;
  onExitToWebsite: () => void;
  urgentTaxCount?: number;
  openLeadsCount?: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  currentUser,
  onExitToWebsite,
  urgentTaxCount = 2,
  openLeadsCount = 4
}) => {
  const sections: NavSection[] = [
    {
      title: 'Gestión Principal',
      items: [
        {
          id: 'widgets',
          label: 'Visión General',
          shortLabel: 'Resumen',
          icon: LayoutDashboard,
        },
        {
          id: 'crm',
          label: 'ARN · Redes & Negocios',
          shortLabel: 'ARN',
          icon: Users,
          badge: openLeadsCount > 0 ? `${openLeadsCount}` : undefined,
          badgeType: 'info'
        }
      ]
    },
    {
      title: 'Suite Contable & Fiscal',
      items: [
        {
          id: 'tax_calendar',
          label: 'Calendario Fiscal ARCA',
          shortLabel: 'Vencimientos',
          icon: CalendarCheck,
          badge: urgentTaxCount > 0 ? `${urgentTaxCount}` : undefined,
          badgeType: 'warning'
        },
        {
          id: 'cash_flow',
          label: 'Cash Flow & Runway PyME',
          shortLabel: 'Cash Flow',
          icon: TrendingUp,
        },
        {
          id: 'fee_pricing',
          label: 'Cotizador de Servicios & Horas',
          shortLabel: 'Cotizador',
          icon: Calculator,
        }
      ]
    },
    {
      title: 'Presencia & Contenidos',
      items: [
        {
          id: 'cms',
          label: 'Control Web & CMS',
          shortLabel: 'CMS',
          icon: Globe,
        },
        {
          id: 'seo',
          label: 'Salud SEO & Posicionamiento',
          shortLabel: 'SEO',
          icon: Search,
        }
      ]
    },
    {
      title: 'Administración & Control',
      items: [
        {
          id: 'users',
          label: 'Gestión de Usuarios (RBAC)',
          shortLabel: 'Usuarios',
          icon: ShieldCheck,
        },
        {
          id: 'email',
          label: 'Comunicaciones Resend',
          shortLabel: 'Email',
          icon: Mail,
        }
      ]
    }
  ];

  const handleItemClick = (id: DashboardViewId) => {
    onSelectView(id);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
            CD
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h2 className="text-sm font-semibold tracking-tight text-white truncate">
                Cr. Domínguez & Asoc.
              </h2>
              <p className="text-[11px] text-slate-400 font-normal truncate">
                Centro de Control Ejecutivo
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
          aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Close button (mobile only) */}
        <button
          onClick={onCloseMobile}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed ? (
              <h3 className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
                {section.title}
              </h3>
            ) : (
              <div className="h-2" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    
                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.badgeType === 'warning' 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
        {/* Exit to Public Web */}
        <button
          onClick={onExitToWebsite}
          title={isCollapsed ? 'Ver Sitio Web Público' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          {!isCollapsed && (
            <span className="truncate">Volver a Sitio Web</span>
          )}
        </button>

        {/* Current User Card */}
        {currentUser && (
          <div className={`flex items-center gap-2.5 pt-2 border-t border-slate-800/80 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
            <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!isCollapsed && (
              <div className="truncate flex-1">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate capitalize font-mono">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 h-full ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/70 z-40 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 z-50 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
