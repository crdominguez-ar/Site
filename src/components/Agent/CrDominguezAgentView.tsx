import React, { useState, useRef, useEffect } from 'react';
import { 
  geminiAgentService, 
  AgentChatMessage 
} from '../../lib/geminiAgentService';
import { CoreServiceCode } from '../../types';
import { OFFICIAL_SERVICES } from '../../data/verticals';
import { 
  Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, 
  LineChart, Calculator, FileText, Calendar, Building2, 
  RefreshCw, CheckCircle2, AlertCircle, Compass, Zap
} from 'lucide-react';

interface CrDominguezAgentViewProps {
  onNavigateTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'arn' | 'crm' | 'seo' | 'dashboard' | 'agent') => void;
  onOpenConsultationModal: () => void;
  onSelectService?: (code: CoreServiceCode) => void;
  initialMode?: 'public' | 'arn';
}

const QUICK_PROMPTS = [
  {
    label: 'Exportación Tech Com. BCRA "A" 8481',
    prompt: '¿Cómo funciona la Comunicación BCRA "A" 8481 para cobrar servicios de software y diseño al exterior en dólares de libre disponibilidad sin liquidar forzosamente al tipo de cambio oficial?'
  },
  {
    label: 'Auditoría de Unit Economics (CAC & LTV)',
    prompt: '¿Cómo evalúa el Estudio de Carlos Rodrigo Domínguez los Unit Economics (CAC, LTV, Churn y Magic Number) en un modelo de suscripción recurrente?'
  },
  {
    label: 'Monotributo vs. SAS vs. Resp. Inscripto',
    prompt: 'Tengo un negocio digital que factura a clientes de Argentina y el exterior. ¿Cuáles son los criterios para decidir entre Monotributo, SAS o Responsable Inscripto?'
  },
  {
    label: 'Modelo Financiero 36m & Costos de IA',
    prompt: 'Estamos integrando Inteligencia Artificial en nuestro software. ¿Cómo modelar la estructura de costos de APIs de inferencia frente al pricing de suscripción?'
  },
  {
    label: 'Data Room para Inversores & RT 54',
    prompt: '¿Qué requerimientos contables y de auditoría bajo normas FACPCE RT 54 son indispensables para un Data Room de ronda de inversión pre-seed/seed?'
  }
];

export const CrDominguezAgentView: React.FC<CrDominguezAgentViewProps> = ({
  onNavigateTab,
  onOpenConsultationModal,
  onSelectService,
  initialMode = 'public'
}) => {
  const [mode, setMode] = useState<'public' | 'arn'>(initialMode);
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: mode === 'arn'
        ? `Bienvenido al núcleo agéntico del **ARN (Agente de Redes y Negocios)** del Estudio Cr. Carlos Rodrigo Domínguez.\n\nPuedo asistirte en la supervisión de clientes, análisis de unit economics, evaluación de riesgos cambiarios (Com. BCRA "A" 8481), revisión de vencimientos ARCA y generación de minutas de auditoría.\n\n¿Qué caso o métrica deseas examinar?`
        : `Hola. Soy el **Copiloto Financiero & Normativo** del Estudio del Cr. Carlos Rodrigo Domínguez (Contador Público y Licenciado en Administración, CPCE Chubut).\n\nCombino la rigurosidad contable —que el número sea legal, exacto y auditable— con la perspectiva estratégica —que sirva para tomar decisiones y escalar.\n\nPuedes consultarme sobre encuadre cambiario (BCRA 8481), Unit Economics (CAC/LTV), modelos de pricing o nuestros 5 servicios canónicos. ¿Por dónde empezamos?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Diagnóstico sin Cargo', actionTab: 'diagnostic' },
        { label: 'Simulador Unit Economics', actionTab: 'simulators' },
        { label: 'Ver 5 Servicios Oficiales', actionTab: 'solutions' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const userMessage: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const historyPayload = messages
        .filter((m) => m.sender !== 'system')
        .slice(-6)
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.text
        }));

      const res = await geminiAgentService.askAgent({
        message: query,
        mode,
        history: historyPayload
      });

      const matchedCode = res.suggestedServiceCode;
      const actions: { label: string; actionTab?: string; serviceCode?: string; prompt?: string }[] = [];

      if (matchedCode) {
        actions.push({
          label: `Ver Servicio Oficial ${matchedCode}: ${OFFICIAL_SERVICES[matchedCode].shortTitle}`,
          actionTab: 'solutions',
          serviceCode: matchedCode
        });
      }

      actions.push({
        label: 'Agendar Consulta Inicial',
        actionTab: 'modal'
      });

      if (matchedCode === '01' || matchedCode === '02') {
        actions.push({
          label: 'Abrir Simuladores Financieros',
          actionTab: 'simulators'
        });
      }

      const agentMessage: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: actions,
        metadata: {
          serviceCode: matchedCode,
          normativeRef: res.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Base Normativa CPCE / BCRA'
        }
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch {
      const errorMessage: AgentChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: 'Ocurrió un error al procesar la respuesta. Por favor intenta de nuevo o solicita una reunión inicial directa con el Cr. Carlos Rodrigo Domínguez.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { label: string; actionTab?: string; serviceCode?: string }) => {
    if (action.actionTab === 'modal') {
      onOpenConsultationModal();
    } else if (action.actionTab === 'solutions') {
      if (action.serviceCode && onSelectService) {
        onSelectService(action.serviceCode as CoreServiceCode);
      }
      onNavigateTab('solutions');
    } else if (action.actionTab) {
      onNavigateTab(action.actionTab as any);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Executive Header */}
      <div className="bg-[#0B1522] border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#38BDF8]">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Agente de Inteligencia Estratégica</span>
              <span>·</span>
              <span>Cr. Carlos Rodrigo Domínguez</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Copiloto Financiero & Normativo
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Asistencia analítica continua impulsada por IA (@google/genai) y fundamentada en normas contables profesionales (FACPCE RT 54), régimen cambiario BCRA (Com. &quot;A&quot; 8481) y unit economics empresariales.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="p-1 bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-1 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setMode('public')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'public'
                  ? 'bg-[#0078D4] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Copiloto Público
            </button>
            <button
              type="button"
              onClick={() => setMode('arn')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'arn'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Núcleo ARN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Ambient Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Suggested Quick Prompts Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-1">
          Consultas Frecuentes & Diagnósticos Directos:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.prompt)}
              disabled={isTyping}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#0078D4] rounded-xl text-left transition-all group cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-3.5 h-3.5 text-[#0078D4] shrink-0 group-hover:rotate-45 transition-transform" />
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#0078D4] truncate block">
                  {qp.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {qp.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Console */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Chat Header Status Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Sesión Activa con el Agente</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono text-[11px]">
              {mode === 'public' ? 'Orientación a Clientes' : 'Supervisión ARN'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px] font-mono">
            <span className="hidden sm:inline">CPCE Chubut · FACPCE RT 54</span>
            <button
              type="button"
              onClick={() => setMessages([messages[0]])}
              className="hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reiniciar conversación"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAgent = msg.sender === 'agent';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAgent ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    isAgent
                      ? 'bg-[#1B3636] text-teal-300'
                      : 'bg-[#0078D4] text-white'
                  }`}
                >
                  {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isAgent
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                        : 'bg-[#0078D4] text-white shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Metadata and Actions */}
                  {isAgent && (
                    <div className="space-y-2 pt-1">
                      {msg.metadata?.normativeRef && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Fuente: {msg.metadata.normativeRef}</span>
                        </div>
                      )}

                      {/* Suggested Action Buttons */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {msg.suggestedActions.map((action, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleActionClick(action)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 hover:border-[#0078D4] text-slate-800 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-3 h-3 text-[#0078D4]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1B3636] text-teal-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-150" />
                <span>Analizando contexto con normativas argentinas...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu consulta sobre Unit Economics, Com. BCRA 8481, contratos o costos..."
              disabled={isTyping}
              className="flex-1 bg-white border border-slate-300 focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Consultar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 px-1">
            <span>Consultas confidenciales protegidas por secreto profesional contable.</span>
            <span>Estudio Cr. Carlos Rodrigo Domínguez</span>
          </div>
        </div>
      </div>
    </div>
  );
};
