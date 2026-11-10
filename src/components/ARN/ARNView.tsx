import React, { useState } from 'react';
import { UserRole } from '../../types';
import { InternalCRM } from '../CRM/InternalCRM';
import { 
  Cpu, Users, Sparkles, TrendingUp, ShieldCheck, 
  Bot, AlertTriangle, ArrowRight, Compass, LineChart,
  CalendarCheck, FolderLock, Target
} from 'lucide-react';

interface ARNViewProps {
  currentRole: UserRole;
  initialSubTab?: 'pipeline' | 'contacts' | 'calendar' | 'tasks';
  onNavigateTab?: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'arn' | 'crm' | 'seo' | 'dashboard' | 'agent') => void;
  onOpenConsultationModal?: () => void;
}

export const ARNView: React.FC<ARNViewProps> = ({
  currentRole,
  initialSubTab = 'pipeline',
  onNavigateTab,
  onOpenConsultationModal
}) => {
  const [showAgentQuickModal, setShowAgentQuickModal] = useState(false);

  return (
    <div className="w-full space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-full">
      {/* ARN Executive Brand & Supervisory Bar */}
      <div className="bg-[#0A121E] text-white border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ARN · Agente de Redes y Negocios</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Dirección y Supervisión Agéntica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cockpit de Negocios & Redes Profesionales
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Superando el CRM pasivo tradicional: el ARN centraliza el radar de oportunidades comerciales, alertas automáticas de vencimiento cambiario (Com. BCRA &quot;A&quot; 8481) y sincronización con el Portal Clientes.
            </p>
          </div>

          {/* Direct Supervisory Triggers */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('agent')}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Consultar Agente IA</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('portal')}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FolderLock className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal Clientes</span>
            </button>
          </div>
        </div>

        {/* Ambient Subtle Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Embedded Core CRM Engine with Enhanced ARN Integration */}
      <div className="w-full">
        <InternalCRM
          currentRole={currentRole}
          initialSubTab={initialSubTab}
          onNavigateTab={onNavigateTab as any}
        />
      </div>
    </div>
  );
};
