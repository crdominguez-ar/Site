/**
 * Gemini Agent Service for Cr. Carlos Rodrigo Domínguez
 * Integrates with @google/genai backend route (/api/gemini/agent)
 * Provides dual mode:
 * 1. 'public': Diagnóstico financiero preliminar y orientación a los 5 servicios canónicos
 * 2. 'arn': Asistente ejecutivo para análisis de cartera, unit economics y supervisor normativo
 */

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionTab?: string; serviceCode?: string; prompt?: string }[];
  metadata?: {
    serviceCode?: string;
    normativeRef?: string;
    metricCalculated?: string;
  };
}

export interface AgentQueryPayload {
  message: string;
  mode: 'public' | 'arn';
  history?: { role: 'user' | 'model'; text: string }[];
  clientContext?: {
    companyName?: string;
    vertical?: string;
    annualBilling?: string;
    currentStage?: string;
  };
}

export interface AgentQueryResponse {
  success: boolean;
  text: string;
  source: 'gemini' | 'knowledge_base';
  suggestedServiceCode?: '01' | '02' | '03' | '04' | '05';
  error?: string;
}

const EXPERT_KNOWLEDGE_BASE: { keywords: string[]; serviceCode: '01' | '02' | '03' | '04' | '05'; title: string; answer: string }[] = [
  {
    keywords: ['bcra', '8481', 'comunicacion', 'dolar', 'divisas', 'exterior', 'exportar', 'factura e', 'cobro'],
    serviceCode: '03',
    title: 'Estructuración del Exportador & Com. BCRA "A" 8481',
    answer: `Conforme a la **Comunicación BCRA "A" 8481** (vigente 14/09/2026) y el régimen de Economía del Conocimiento:

1. **Factura E y Disponibilidad de Divisas**: Las personas humanas y jurídicas que exportan servicios de tecnología, desarrollo o consultoría pueden ingresar divisas a cuentas locales en moneda extranjera dentro del cupo anual exento de liquidación obligatoria en el MULC.
2. **Plazos de Liquidación**: El ingreso formal al sistema financiero local debe gestionarse dentro de los plazos reglamentarios (hasta 5 días hábiles desde la percepción en cuentas bancarias del exterior).
3. **Optimización Fiscal**: La exportación de servicios está exenta de IVA, permitiendo la solicitud del recupero de créditos fiscales vinculados mediante el régimen especial de ARCA.
4. **Recomendación Operativa**: Evaluamos si tu esquema actual de facturación (Monotributo tech vs. Responsable Inscripto vs. SAS) minimiza la alícuota efectiva y blinda tus cobros internacionales.

**Servicio Oficial Vinculado**: Servicio 03 · Estructuración del Exportador.`
  },
  {
    keywords: ['unit economics', 'cac', 'ltv', 'churn', 'mrr', 'arr', 'rentabilidad', 'margen', 'suscripcion'],
    serviceCode: '01',
    title: 'Diagnóstico de Unit Economics & Métricas Recurrentes',
    answer: `El análisis de **Unit Economics** determina si cada nuevo cliente incorporado crea valor real o acelera la quema de capital:

- **Relación LTV / CAC**: El benchmark saludable exige un ratio mínimo de 3:1. Un valor inferior a 2:1 indica costos excesivos de comercialización o un churn elevado.
- **Payback del CAC**: Tiempo que tarda el cliente en devolver el costo invertido para adquirirlo (ideal < 12 meses en SaaS B2B).
- **Margen de Contribución Real**: Se depuran los ingresos recurrentes (MRR) restando comisiones de pasarelas (Stripe, Lemon Squeezy), costos de servidores e inferencia de tokens de IA.
- **Magic Number**: Eficiencia del gasto en ventas y marketing respecto al nuevo ARR generado.

**Servicio Oficial Vinculado**: Servicio 01 · Diagnóstico de Unit Economics (entregable en 2 a 3 semanas con 5 acciones priorizadas).`
  },
  {
    keywords: ['pricing', 'modelo financiero', '36 meses', 'escenarios', 'punto de equilibrio', 'sensibilidad', 'inflacion'],
    serviceCode: '02',
    title: 'Modelo Financiero Dinámico & Estrategia de Pricing',
    answer: `La transición hacia esquemas de facturación por consumo, suscripciones o incorporación de Inteligencia Artificial exige un **Modelo Financiero a 36 meses**:

- **Tres Escenarios de Estrés**: Construimos proyecciones en escenario conservador, base y de expansión agresiva con indexación bimonetaria (ARS/USD).
- **Punto de Equilibrio (Break-Even)**: Cálculo exacto de las unidades y facturación umbral que cubren costos fijos de nómina, infraestructura cloud y amortizaciones.
- **Costeo de Inferencia y APIs**: Proyección del costo marginal de cómputo por usuario para evitar que el crecimiento de volumen destruya el margen bruto.

**Servicio Oficial Vinculado**: Servicio 02 · Modelo Financiero y Pricing (3 a 4 semanas de desarrollo analítico).`
  },
  {
    keywords: ['cfo', 'fraccional', 'direccion', 'runway', 'flujo', 'caja', 'comite', 'abono'],
    serviceCode: '04',
    title: 'Dirección Financiera Mensual (CFO Fraccional)',
    answer: `El servicio de **CFO Fraccional** otorga la dirección financiera estratégica de una gran corporación adaptada al tamaño y dinámica de una PyME o empresa tecnológica:

- **Cash Runway Móvil**: Medición estricta de meses de caja remanentes frente al Burn Rate mensual para anticipar necesidades de financiamiento.
- **Comité Financiero Mensual**: Reunión ejecutiva periódica con los socios fundadores para revisar variaciones presupuestarias, métricas conciliadas y decisiones tributarias.
- **Control de Capital de Trabajo**: Optimización del ciclo de conversión de efectivo (días de cobro vs. días de pago a proveedores clave).

**Servicio Oficial Vinculado**: Servicio 04 · CFO Fraccional (Abono mensual continuo).`
  },
  {
    keywords: ['inversores', 'data room', 'ronda', 'seed', 'pre-seed', 'due diligence', 'valuacion', 'cap table'],
    serviceCode: '05',
    title: 'Preparación para Inversores & Data Room Contable',
    answer: `Para levantar capital con fondos de Venture Capital (ARCAP/LAVCA) o ángeles, la contabilidad tradicional es insuficiente:

- **Data Room Financiero Estructurado**: Bóveda documental con estados contables auditables, proyecciones a 3-5 años y apertura de cap table.
- **Métricas Conciliadas**: Comprobación rigurosa de MRR, Net Revenue Retention (NRR > 103%) y cohortes de retención libres de inconsistencias.
- **Due Diligence Previa**: Detección y saneamiento anticipado de pasivos contingentes laborales, tributarios o societarios.

**Servicio Oficial Vinculado**: Servicio 05 · Preparación para Inversores (Data Room y Due Diligence en 4 a 6 semanas).`
  }
];

export const geminiAgentService = {
  /**
   * Consulta al Agente IA (Carlos Rodrigo Domínguez Copilot)
   */
  async askAgent(payload: AgentQueryPayload): Promise<AgentQueryResponse> {
    const { message, mode, history = [], clientContext } = payload;

    // 1. Intentar llamar al backend proxy con Gemini 3.8 Flash
    try {
      const response = await fetch('/api/gemini/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          mode,
          history,
          clientContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          // Detectar servicio sugerido
          const matchedService = this.detectServiceCode(data.text + ' ' + message);
          return {
            success: true,
            text: data.text,
            source: 'gemini',
            suggestedServiceCode: matchedService
          };
        }
      }
    } catch {
      // Si la llamada fetch falla (ej. sin conexión a la ruta proxy en local o timeout), recurrir a la base de conocimiento experta
    }

    // 2. Base de conocimiento experta local (Fallback de alta fidelidad profesional)
    const lowerMessage = message.toLowerCase();
    const match = EXPERT_KNOWLEDGE_BASE.find(item => 
      item.keywords.some(kw => lowerMessage.includes(kw))
    );

    if (match) {
      return {
        success: true,
        text: match.answer,
        source: 'knowledge_base',
        suggestedServiceCode: match.serviceCode
      };
    }

    // Respuesta general estructurada por defecto
    const defaultResponse = mode === 'arn'
      ? `**Diagnóstico Interno ARN - Cr. Carlos Rodrigo Domínguez**:
Para el caso planteado ("${message}"), el protocolo de supervisión ejecutiva recomienda:
1. Conciliar los registros contables primarios con el extracto bancario y facturación emitida en ARCA.
2. Determinar la tasa de retención efectiva y el margen de contribución real.
3. Vincular este análisis a una de nuestras cinco intervenciones canónicas:
   - **Servicio 01**: Unit Economics (CAC, LTV, Churn).
   - **Servicio 02**: Modelo Financiero 36m y Sensibilidad de Precios.
   - **Servicio 03**: Exportador de Servicios & Com. BCRA "A" 8481.
   - **Servicio 04**: CFO Fraccional & Runway.
   - **Servicio 05**: Data Room Inversores.

¿Deseas generar una tarea automática en el ARN o agendar un comité de revisión de socios?`
      : `**Consulta Profesional - Estudio Cr. Carlos Rodrigo Domínguez**:
Agradezco tu consulta sobre "${message}". Como Contador Público y Licenciado en Administración (CPCE Chubut), mi enfoque combina la precisión técnico-legal con la visión de crecimiento del negocio.

Para darte un dictamen exacto, te invito a:
1. Realizar el **Diagnóstico Estratégico sin cargo** en nuestra plataforma.
2. Explorar los **Simuladores Interactivos** (Unit Economics y BCRA 8481).
3. Agendar una **Reunión Inicial de Diagnóstico** donde revisaremos tus números específicos y objetivos.

Puedes seleccionar cualquiera de las opciones directas abajo para comenzar.`;

    return {
      success: true,
      text: defaultResponse,
      source: 'knowledge_base',
      suggestedServiceCode: this.detectServiceCode(message) || '01'
    };
  },

  /**
   * Identifica el servicio oficial más relevante para una consulta
   */
  detectServiceCode(text: string): '01' | '02' | '03' | '04' | '05' | undefined {
    const t = text.toLowerCase();
    if (t.includes('8481') || t.includes('factura e') || t.includes('divisas') || t.includes('exportador') || t.includes('mulc')) {
      return '03';
    }
    if (t.includes('unit economics') || t.includes('cac') || t.includes('ltv') || t.includes('churn') || t.includes('mrr')) {
      return '01';
    }
    if (t.includes('pricing') || t.includes('36 meses') || t.includes('modelo financiero') || t.includes('punto de equilibrio')) {
      return '02';
    }
    if (t.includes('cfo') || t.includes('runway') || t.includes('abono') || t.includes('flujo de fondos')) {
      return '04';
    }
    if (t.includes('inversor') || t.includes('data room') || t.includes('ronda') || t.includes('due diligence')) {
      return '05';
    }
    return undefined;
  }
};
