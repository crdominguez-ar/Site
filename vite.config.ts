import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const currentDir = typeof import.meta.dirname !== 'undefined' 
  ? import.meta.dirname 
  : path.dirname(fileURLToPath(import.meta.url));

function geminiAgentPlugin(): Plugin {
  return {
    name: 'gemini-agent-api',
    configureServer(server) {
      server.middlewares.use('/api/gemini/agent', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const userMsg = parsed.message || '';
            const mode = parsed.mode || 'public';
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                success: false, 
                fallback: true,
                error: 'GEMINI_API_KEY no configurada en el servidor' 
              }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                }
              }
            });

            const systemInstruction = mode === 'arn'
              ? `Eres el Agente de Redes y Negocios (ARN) del Estudio del Cr. Carlos Rodrigo Domínguez (Contador Público y Licenciado en Administración, CPCE Chubut, Argentina). Asistes en la supervisión ejecutiva de clientes, análisis de unit economics (CAC, LTV, Churn, Magic Number), encuadre normativo (FACPCE RT 54, Ley 27.506 de Economía del Conocimiento, Com. BCRA "A" 8481 para exportación de servicios, ARCA/AFIP) y comités financieros. Sé riguroso, analítico, conciso y profesional.`
              : `Eres el Copiloto Financiero de Diagnóstico del Estudio del Cr. Carlos Rodrigo Domínguez (Trelew, Chubut, Patagonia Argentina). Asesoras a fundadores de SaaS, exportadores de servicios tech, PyMEs y franquicias en Argentina y el exterior. Tu objetivo es explicar con claridad técnica y práctica los números y la normativa (BCRA 8481, Factura E, Monotributo vs SAS vs RI, RT 54) y orientar al usuario hacia los 5 servicios canónicos del estudio:
01 · Diagnóstico de Unit Economics
02 · Modelo Financiero & Pricing a 36 meses
03 · Estructuración del Exportador (Factura E y liquidación de divisas BCRA 8481)
04 · CFO Fraccional mensual
05 · Preparación para Inversores & Data Room
Sé claro, empático, altamente competente y ofrece pasos concretos para agendar o simular en la plataforma.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: userMsg,
              config: {
                systemInstruction,
              }
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              text: response.text
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: false, 
              error: err?.message || 'Error al comunicarse con Gemini' 
            }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), geminiAgentPlugin()],
    envPrefix: ['VITE_', 'SUPABASE_'],
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(currentDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

