import { VerticalMetadata, BusinessVertical, OfficialCoreService, CoreServiceCode, TargetArchetype } from '../types';

export const BUSINESS_VERTICALS: Record<BusinessVertical, VerticalMetadata> = {
  tradicional_pyme: {
    id: 'tradicional_pyme',
    title: 'Modelos Tradicionales & PyMEs Familiares',
    shortTitle: 'Tradicional & PyME',
    tagline: 'Control de costos reales, margen de contribución y punto de equilibrio operativo',
    description: 'Estructuración analítica para PyMEs familiares, cooperativas laneras, pesqueras, metalmecánicas y entidades sin fines de lucro en la Patagonia. Superamos la contabilidad ciega con costeo por absorción y análisis marginal.',
    keyAspects: [
      'Determinación de costos fijos, variables y ocultos de producción',
      'Cálculo de Margen de Contribución Ponderado por línea de producto',
      'Punto de Equilibrio (Break-Even) en unidades y facturación umbral',
      'Protocolo para empresas familiares, gobierno corporativo y cooperativas',
      'Auditoría y optimización de cargas sociales y regímenes de fomento patagónico',
    ],
    deliverables: [
      'Matriz de Costos Industriales y Comerciales',
      'Tablero de Umbral de Rentabilidad y Sensibilidad de Precios',
      'Manual de Procedimientos y Control Interno Familiar',
    ],
    normativeBase: 'Ley General de Sociedades 19.550 · Ley de Cooperativas 20.337 · Récord Fiscal ARCA/AFIP',
  },
  digital_saas: {
    id: 'digital_saas',
    title: 'Modelos Digitales, SaaS & Creadores',
    shortTitle: 'Digital & Exportación SaaS',
    tagline: 'Factura E, liquidación de divisas MULC y encuadre tributario internacional',
    description: 'Ingeniería fiscal y cambiaria para plataformas de software como servicio, agencias tech, dropshipping, marketplaces y creadores de contenido que monetizan en el exterior desde Argentina o estructuras híbridas.',
    keyAspects: [
      'Emisión de Factura E y régimen de exención de liquidación de divisas hasta el tope legal',
      'Gestión cambiaria: ingreso por Mercado Único y Libre de Cambios (MULC) vs dólar financiero legal (MEP / CCL)',
      'Tratamiento de retenciones impositivas de plataformas (Stripe, Lemon Squeezy, Paddle, PayPal)',
      'Optimización del Régimen de Economía del Conocimiento (Ley 27.506 y modif.)',
      'Estructuración de sociedades SAS locales con filiales o subsidiarias LLC / Delaware',
    ],
    deliverables: [
      'Manual de Cumplimiento Cambiario y Liquidación Bancaria (Com. BCRA)',
      'Matriz de Retenciones Internacionales y Créditos de Impuesto Análogo',
      'Simulación Impositiva de Flujos Monetarios Transfronterizos',
    ],
    normativeBase: 'Ley 27.506 Economía del Conocimiento · Com. "A" BCRA Exportación Servicios · RG AFIP Facturación Electrónica',
  },
  franquicias: {
    id: 'franquicias',
    title: 'Evaluación y Desarrollo de Franquicias',
    shortTitle: 'Franquicias (Ley CCyC)',
    tagline: 'Auditoría precontractual de COF y modelos de recupero de inversión (Payback)',
    description: 'Evaluación rigurosa bajo los Artículos 1512 a 1524 del Código Civil y Comercial de la Nación para inversores franquiciados y desarrollo de manuales de franquiciabilidad para PyMEs patagónicas en expansión.',
    keyAspects: [
      'Auditoría de la Circular de Oferta de Franquicia (COF - Art. 1514 inc. a a c)',
      'Verificación legal de los 2 años de balance del negocio franquiciante piloto',
      'Modelización del período de recupero (Payback) y tasa de retorno real',
      'Revisión de cláusulas abusivas de no competencia territorial (Art. 1518 y 1520)',
      'Desarrollo de paquetes de franquiciabilidad para marcas de Chubut',
    ],
    deliverables: [
      'Dictamen Precontractual de Viabilidad Legal-Financiera de Franquicia',
      'Modelo Financiero Dinámico de Sensibilidad de Ventas y Regalías',
      'Estructura de Contrato de Franquicia Comercial según CCyC',
    ],
    normativeBase: 'Código Civil y Comercial de la Nación (Arts. 1512 a 1524: Contrato de Franquicia)',
  },
  cfo_estrategico: {
    id: 'cfo_estrategico',
    title: 'Consultoría Estratégica & CFO a Tiempo Parcial',
    shortTitle: 'CFO Fraccional',
    tagline: 'Tableros de control de cash flow, presupuestos dinámicos a 12 meses y modelos VAN/TIR',
    description: 'La dirección financiera de una gran corporación adaptada a PyMEs consolidadas. Proporcionamos visión estratégica, comités mensuales de finanzas, análisis de inversión de capital y preservación del patrimonio.',
    keyAspects: [
      'Presupuesto económico y financiero móvil a 12 meses con escenarios inflacionarios',
      'Tablero de control mensual de Cash Runway, Capital de Trabajo y Ciclo de Conversión de Efectivo',
      'Evaluación de proyectos de inversión mediante Valor Actual Neto (VAN) y Tasa Interna de Retorno (TIR)',
      'Optimización de estructura de capital y gestión de financiamiento bancario / mercado de capitales (CNV)',
      'Acompañamiento en comités directivos de socios para toma de decisiones de alto impacto',
    ],
    deliverables: [
      'Executive Dashboard de Finanzas y Flujo de Fondos Semanal/Mensual',
      'Modelo de Proyección Económica y Presupuesto Maestro a 12 Meses',
      'Evaluación de Proyectos de Inversión VAN / TIR con Pruebas de Estrés',
    ],
    normativeBase: 'Normas Internacionales de Información Financiera (NIIF/IFRS) · FACPCE RT 54',
  },
  ia_zhc: {
    id: 'ia_zhc',
    title: 'Empresas 100% IA (Zero-Human Companies)',
    shortTitle: 'Vanguardia: ZHC & Agentes IA',
    tagline: 'Diagnóstico normativo, tributario y costos operativos para bucles multi-agente y DAOs',
    description: 'Pioneros en la estructuración de organizaciones autónomas dirigidas por agentes de IA sin intervención humana continua. Resolvemos la tributación de inferencia, tesorerías cripto on-chain y encuadre societario.',
    keyAspects: [
      'Diagnóstico normativo y personería jurídica para entidades ZHC (Zero-Human Companies)',
      'Contabilización y deducción fiscal de costos de API, tokens de inferencia y servidores GPU',
      'Tratamiento contable y tributario de tesorerías multi-sig on-chain en stablecoins (USDC/USDT)',
      'Encuadre frente a regulaciones fiscales de agentes autónomos comerciales y smart contracts',
      'Arquitectura de gobernanza algorítmica y mitigación de responsabilidad civil del sponsor',
    ],
    deliverables: [
      'Dictamen de Viabilidad Jurídico-Tributaria para Organizaciones ZHC',
      'Modelo de Costos Operativos por Bucle de Agente (Tokens vs Salarios)',
      'Procedimiento de Auditoría Contable para Wallets y Smart Contracts',
    ],
    normativeBase: 'Derecho Societario de Nueva Generación · RG AFIP Criptoactivos · Regulación Comparada AI Act & Delaware LLC',
  },
};

/**
 * 5 SERVICIOS NÚCLEO ESTRUCTURADOS (Fuente: Presentación Oficial Cr. Carlos Rodrigo Domínguez)
 * Servicios para decidir con números: con entregables, plazos y modalidades de contratación definidas.
 */
export const OFFICIAL_SERVICES: Record<CoreServiceCode, OfficialCoreService> = {
  '01': {
    code: '01',
    title: 'Diagnóstico de Unit Economics',
    shortTitle: 'Unit Economics',
    tagline: 'Cuánto deja cada cliente y cada plan',
    targetAudience: 'Software factories, SaaS PyME, negocios por abono o suscripción recurrente.',
    targetArchetypes: ['saas_software', 'exportadores_servicios', 'pymes'],
    deliverable: 'Tablero de ingresos recurrentes, churn, CAC, LTV y margen por plan + 5 acciones priorizadas de impacto.',
    modality: 'proyecto',
    modalityLabel: 'Por Proyecto',
    durationOrCadence: '2 a 3 semanas',
    keyMetricsCovered: ['MRR / ARR', 'Churn mensual y anual', 'CAC (Costo de Adquisición)', 'LTV (Lifetime Value)', 'Margen de Contribución por Plan'],
    normativeBase: 'Normas Contables Profesionales FACPCE · Registros Contables Auditables',
    recommendedPriceUsd: 1400,
  },
  '02': {
    code: '02',
    title: 'Modelo Financiero y Pricing',
    shortTitle: 'Modelo & Pricing 36m',
    tagline: 'Precios, escenarios y punto de equilibrio',
    targetAudience: 'Empresas que cambian su forma de cobrar, migran a cobro por consumo o suman Inteligencia Artificial.',
    targetArchetypes: ['saas_software', 'pymes', 'nuevas_economias'],
    deliverable: 'Modelo dinámico a 36 meses con matrices de sensibilidad, escenarios (conservador, base, expansión), punto de equilibrio e indexación inflacionaria ARS/USD.',
    modality: 'proyecto',
    modalityLabel: 'Por Proyecto',
    durationOrCadence: '3 a 4 semanas',
    keyMetricsCovered: ['Punto de Equilibrio (Break-Even)', 'Indexación ARS/USD', 'Sensibilidad de Precios', 'Curvas de Costos de Nube e IA'],
    normativeBase: 'Matemática Financiera · Normas FACPCE RT 54 · Modelación Económica',
    recommendedPriceUsd: 1900,
  },
  '03': {
    code: '03',
    title: 'Estructuración del Exportador',
    shortTitle: 'Estructuración Exportador',
    tagline: 'Figura fiscal, Factura E y cobro de divisas',
    targetAudience: 'Freelancers, desarrolladores, agencias y estudios que facturan a México, España, Colombia, EE.UU., Brasil y más.',
    targetArchetypes: ['exportadores_servicios', 'saas_software'],
    deliverable: 'Informe integral de encuadre tributario y cambiario: elección de figura (Monotributo vs. RI vs. SAS), exención de IVA en exportación con recupero de créditos fiscales, Convenio Multilateral IIBB, emisión de Factura E, liquidación de divisas según Com. BCRA "A" 8481 y acceso a la Ley de Economía del Conocimiento.',
    modality: 'proyecto',
    modalityLabel: 'Proyecto + Abono de Cumplimiento',
    durationOrCadence: 'Proyecto inicial + Acompañamiento mensual',
    keyMetricsCovered: ['Tope legal de divisas libre disponibilidad', 'Tasa efectiva tributaria', 'Brecha cambiaria legal (MEP/CCL)', 'Retenciones de pasarelas internacionales'],
    normativeBase: 'Com. BCRA "A" 8481 (14/09/2026) · Leyes 27.506 y 27.570 (Economía del Conocimiento) · RG AFIP/ARCA Factura E',
    recommendedPriceUsd: 1200,
  },
  '04': {
    code: '04',
    title: 'CFO Fraccional',
    shortTitle: 'CFO Fraccional',
    tagline: 'Dirección financiera mensual sin estructura fija',
    targetAudience: 'Startups y PyMEs sin director financiero dedicado a tiempo completo que requieren visión estratégica continua.',
    targetArchetypes: ['pymes', 'saas_software', 'franquicias', 'nuevas_economias'],
    deliverable: 'Acompañamiento continuo: Reporte mensual de métricas contables conciliadas, gestión y proyección de flujo de caja (Cash Runway), presupuesto maestro móvil a 12 meses, cumplimiento normativo fiscal y comité financiero mensual con los socios.',
    modality: 'abono_mensual',
    modalityLabel: 'Abono Mensual Recurrente',
    durationOrCadence: 'Acompañamiento mensual continuo',
    keyMetricsCovered: ['Cash Runway (Meses de Caja)', 'Capital de Trabajo', 'EBITDA Operativo', 'Ciclo de Conversión de Efectivo', 'Variación Presupuestaria'],
    normativeBase: 'NIIF / IFRS · FACPCE RT 54 · Gobierno Corporativo y Finanzas de Estudio',
    recommendedPriceUsd: 1800,
  },
  '05': {
    code: '05',
    title: 'Preparación para Inversores',
    shortTitle: 'Data Room Inversores',
    tagline: 'Data room, proyecciones y due diligence',
    targetAudience: 'Startups en etapas pre-seed y seed que buscan capitalizar rondas con fondos de venture capital o inversores ángeles.',
    targetArchetypes: ['saas_software', 'nuevas_economias'],
    deliverable: 'Data Room financiero estructurado, estados y proyecciones a 3-5 años, métricas auditables conciliadas (MRR, NRR, CAC/LTV) y preparación documental exhaustiva para la due diligence previa.',
    modality: 'proyecto',
    modalityLabel: 'Por Proyecto',
    durationOrCadence: '4 a 6 semanas',
    keyMetricsCovered: ['Valuación Pre/Post-Money', 'Cap Table y dilución', 'Burn Rate bruto y neto', 'NRR (103%+)', 'Unit Economics auditados'],
    normativeBase: 'Estándares Internacionales de Venture Capital (ARCAP/LAVCA) · Auditoría Contable Independiente',
    recommendedPriceUsd: 2800,
  },
};

/**
 * 5 ARQUETIPOS DE CLIENTES ACOMPAÑADOS (Slide 5: "A quién acompaño")
 */
export const TARGET_ARCHETYPES: TargetArchetype[] = [
  {
    id: 'pymes',
    name: 'PyMEs',
    tagline: 'Costos, márgenes, presupuesto y tablero de gestión',
    description: 'Empresas comerciales, de servicios e industriales que necesitan ordenar costos reales, controlar desvíos y ganar previsibilidad.',
    typicalNeeds: ['Costeo por absorción vs. marginal', 'Punto de equilibrio operativo', 'Presupuesto dinámico', 'Tablero mensual de control'],
    linkedServiceCodes: ['01', '02', '04'],
  },
  {
    id: 'franquicias',
    name: 'Franquicias',
    tagline: 'Modelo económico del franquiciante y del franquiciado (CCyC art. 1512)',
    description: 'Marcas que se expanden bajo sistema de franquicia o inversores que evalúan la compra de una franquicia en Patagonia y Argentina.',
    typicalNeeds: ['Auditoría de Circular de Oferta (COF)', 'Regalías y canon de publicidad', 'Período de recupero (Payback)', 'Contratos bajo Arts. 1512 a 1524 CCyC'],
    linkedServiceCodes: ['02', '04'],
  },
  {
    id: 'saas_software',
    name: 'SaaS y Software',
    tagline: 'Métricas recurrentes, pricing y preparación para inversores',
    description: 'Empresas de software, productos B2B/B2C con suscripción mensual y modelos de facturación por consumo.',
    typicalNeeds: ['MRR / ARR y NRR', 'Churn de clientes y de ingresos', 'Pricing por consumo / valor', 'Data Room pre-seed / seed'],
    linkedServiceCodes: ['01', '02', '04', '05'],
  },
  {
    id: 'exportadores_servicios',
    name: 'Exportadores de Servicios',
    tagline: 'Freelancers y estudios que facturan a México, España, Colombia, EE.UU. y Brasil',
    description: 'Profesionales del conocimiento que monetizan hacia el exterior y necesitan cobrar divisas cumpliendo la normativa cambiaria.',
    typicalNeeds: ['Factura E de exportación', 'Liquidación de divisas Com. BCRA "A" 8481', 'Monotributo vs. Responsable Inscripto vs. SAS', 'Régimen de Economía del Conocimiento'],
    linkedServiceCodes: ['03', '01'],
  },
  {
    id: 'nuevas_economias',
    name: 'Nuevas Economías',
    tagline: 'Emprendimientos digitales, plataformas y modelos con Inteligencia Artificial',
    description: 'Negocios nativos digitales, modelos de suscripción asistidos por IA y plataformas que escalan sin estructura física tradicional.',
    typicalNeeds: ['Costeo de APIs y tokens de IA', 'Márgenes de contribución con costos de cómputo', 'Estructuras societarias ágiles', 'Proyecciones para aceleradoras'],
    linkedServiceCodes: ['01', '02', '05'],
  },
];

/**
 * 6 ERRORES FRECUENTES QUE CUESTAN RENTABILIDAD (Slide 4: "Errores frecuentes que cuestan rentabilidad")
 */
export const COMMON_PITFALLS = [
  {
    title: 'Precio por intuición',
    problem: 'Sin costos completos, sin escalones de volumen ni indexación previsible en pesos.',
    solution: 'Modelo de pricing con márgenes reales de contribución y cláusulas automáticas de ajuste.',
  },
  {
    title: 'Mirar solo la facturación',
    problem: 'Se ignora la baja de clientes (churn) y la retención neta de ingresos (NRR). Facturar más no es ganar más.',
    solution: 'Tablero de Unit Economics que mide retención neta y margen por cohorte.',
  },
  {
    title: 'CAC y márgenes mal medidos',
    problem: 'Costo de adquisición sin computar sueldos comerciales, pasarelas de pago ni comisiones de plataforma.',
    solution: 'Cálculo auditado del CAC integral y relación LTV/CAC saludable (mínimo 3:1).',
  },
  {
    title: 'Figura fiscal inadecuada',
    problem: 'Monotributo excedido, encuadre erróneo en Responsable Inscripto o pérdida de créditos de IVA e Ingresos Brutos.',
    solution: 'Planificación fiscal estratégica evaluando Monotributo, SAS o RI según escala y Convenio Multilateral.',
  },
  {
    title: 'Cobros del exterior sin plan',
    problem: 'Inseguridad cambiaria, bloqueo de transferencias, Factura E incorrecta o liquidación forzosa.',
    solution: 'Estructuración según Com. BCRA "A" 8481 y régimen de Economía del Conocimiento.',
  },
  {
    title: 'Contratos incompletos',
    problem: 'Falta de términos de baja, omisión del botón de arrepentimiento (Defensa del Consumidor) y cláusulas de jurisdicción riesgosas.',
    solution: 'Revisión contractual contable-legal alineada a la Ley 25.326 y Código Civil y Comercial.',
  },
];

/**
 * DATOS MACROECONÓMICOS DE ARGENTINA 2026 (Slide 3: "La economía digital ya es un motor exportador")
 */
export const MACRO_METRICS_2026 = [
  {
    stat: 'USD 10.493 M',
    label: 'Exportaciones récord de servicios basados en el conocimiento',
    growth: '+10,2% interanual (2T 2026)',
    source: 'INDEC / BCRA - Argencon',
  },
  {
    stat: '+USD 400 M',
    label: 'En rondas de startups argentinas anunciadas en 2026',
    growth: 'vs. USD 270 M en todo 2025',
    source: 'ARCAP / EY vía iProfesional',
  },
  {
    stat: '35% → 42%',
    label: 'Empresas de software que cobran por consumo',
    growth: '4T 2025 → 2T 2026',
    source: 'ICONIQ vía Adlega',
  },
  {
    stat: '103%',
    label: 'Retención Neta de Ingresos (NRR) mediana en SaaS privadas',
    growth: 'Retener vale tanto como vender',
    source: 'SaaS Capital 2026',
  },
];

/**
 * MÉTRICAS CLAVE CON BASE CONTABLE CONCILIADA (Slide 8: "Las métricas que medimos juntos")
 */
export const CONCILIATED_METRICS = [
  { code: 'MRR / ARR', name: 'Ingreso Recurrente Mensual / Anual', desc: 'Monto mensual previsible de abonos y suscripciones activas.' },
  { code: 'Churn', name: 'Tasa de Cancelación / Deserción', desc: 'Clientes o ingresos perdidos dividido la base inicial del período.' },
  { code: 'NRR', name: 'Retención Neta de Ingresos', desc: 'Mide la expansión de clientes existentes superando las cancelaciones (benchmark 103%+).' },
  { code: 'CAC', name: 'Costo de Adquisición de Clientes', desc: 'Gasto total de marketing y salarios comerciales dividido nuevos clientes.' },
  { code: 'LTV', name: 'Valor del Tiempo de Vida del Cliente', desc: 'Ingreso mensual promedio por margen bruto dividido churn mensual.' },
  { code: 'Margen de Contribución', name: 'Margen Contributivo Real', desc: 'Ingresos menos costos directos variables (nube, IA, pasarelas de cobro, soporte).' },
];

