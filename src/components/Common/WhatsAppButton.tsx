import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '5492804567890', // Numero oficial de contacto profesional
  defaultMessage = 'Hola Cr. Domínguez, me comunico desde la plataforma web para realizar una consulta sobre consultoría estratégica.',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickTopics = [
    { label: 'Dirección Financiera & CFO', text: 'Hola Cr. Domínguez, quisiera consultar sobre el servicio de CFO a tiempo parcial y tableros de control financiero.' },
    { label: 'Auditoría de Franquicias', text: 'Hola Carlos, me gustaría evaluar la viabilidad de una franquicia comercial (Ley CCyC 1512-1524).' },
    { label: 'Costos PyME & Diagnóstico', text: 'Hola Cr. Domínguez, necesitamos optimizar costos reales y punto de equilibrio en nuestra empresa.' },
    { label: 'SaaS & Factura E (Divisas)', text: 'Hola Carlos, requiero asesoría tributaria para exportación de software y liquidación de divisas MULC.' },
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || defaultMessage;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none flex flex-col items-end">
      {/* Interactive Flyout Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-800">
          {/* Header WhatsApp Corporate */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm text-white">
                    CD
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-[#128C7E] rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Cr. Carlos Rodrigo Domínguez</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Disponible · Atención Ejecutiva
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/95 mt-2.5 leading-relaxed bg-black/10 px-3 py-2 rounded-lg">
              ¿Tenés dudas financieras, tributarias o sobre franquicias? Escribime directamente para coordinar una reunión ejecutiva.
            </p>
          </div>

          {/* Quick Option Topics */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Seleccionar tema de consulta rápida:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {quickTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(topic.text)}
                  className="text-left text-xs bg-white hover:bg-emerald-50 hover:text-[#128C7E] hover:border-emerald-300 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 transition-all font-medium flex items-center justify-between group"
                >
                  <span>{topic.label}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#128C7E] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Field */}
          <div className="p-3 bg-white flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 text-xs px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:border-[#25D366] focus:bg-white text-slate-800"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#128C7E] text-white rounded-lg transition-colors shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
              title="Enviar por WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        aria-label="Abrir chat de WhatsApp"
      >
        {/* Pulsing beacon behind icon */}
        <span className="absolute -inset-1 bg-[#25D366] rounded-full opacity-40 animate-ping pointer-events-none group-hover:opacity-60" />

        {/* WhatsApp Official SVG Icon */}
        <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M12.031 2C6.516 2 2.023 6.492 2.023 12.008c0 1.945.556 3.766 1.523 5.309L2 22l4.82-1.508c1.488.883 3.23 1.391 5.094 1.391 5.516 0 10.008-4.492 10.008-10.008C22.039 6.492 17.547 2 12.031 2zm5.797 14.18c-.242.684-1.211 1.258-1.992 1.422-.531.109-1.219.195-3.539-.773-2.969-1.242-4.883-4.273-5.031-4.477-.148-.203-1.203-1.602-1.203-3.055 0-1.453.766-2.172 1.039-2.461.273-.289.602-.363.805-.363.203 0 .406.004.586.012.195.008.453-.074.707.539.266.637.906 2.219.984 2.383.078.164.133.359.023.578-.109.219-.164.359-.328.555-.164.195-.344.438-.492.586-.164.164-.336.344-.148.664.188.32.836 1.375 1.797 2.23 1.238 1.102 2.281 1.445 2.602 1.609.32.164.508.137.695-.082.188-.219.805-.938 1.02-1.258.219-.32.438-.266.734-.164.297.102 1.883.887 2.203 1.047.32.164.531.246.609.379.078.133.078.777-.164 1.461z" />
          </svg>
        </div>

        {/* Text Pill */}
        <span className="font-bold text-xs tracking-wide pr-1 hidden sm:inline-block">
          WhatsApp Directo
        </span>

        {/* Online Indicator Dot */}
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 border-2 border-[#25D366]" />
      </button>
    </div>
  );
};
