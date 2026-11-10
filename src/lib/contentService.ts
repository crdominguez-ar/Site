import boardroomImg from '../assets/images/strategic_financial_boardroom_1793059909387.jpg';
import industryImg from '../assets/images/patagonia_industry_logistics_1793065886236.jpg';
import heroPatagoniaImg from '../assets/images/hero_patagonia_consultancy_1793059908678.jpg';
import digitalFintechImg from '../assets/images/digital_ai_fintech_hub_1793065898721.jpg';
import { SocialLinksConfig } from '../types';

export interface SlideContent {
  id: string;
  badgeCategory: string;
  badgeLocation: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaTab: 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'dashboard';
  secondaryCtaText: string;
  secondaryCtaTab: 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'dashboard' | 'video' | 'modal';
  bgImageUrl: string;
  referenceLabel: string;
  videoSrc: string;
  videoTitle: string;
  accentColor: string;
}

export interface KPIItem {
  id: string;
  value: string;
  label: string;
  highlightColor?: string;
}

export interface SiteThemeConfig {
  fontFamily: 'sans' | 'serif' | 'mono' | 'geometric';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  palettePreset: 'patagonia_deep' | 'obsidian_contrast' | 'azure_executive' | 'custom';
  primaryColor: string;
  axesBackground: string;
}

export interface HomeBlockConfig {
  id: 'hero' | 'macro_context' | 'video' | 'axes' | 'pitfalls' | 'modalities' | 'case_studies' | 'profile' | 'diagnostic';
  label: string;
  enabled: boolean;
  order: number;
}

export interface CaseStudyItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  bgColor: string;
  borderColor: string;
  tagColor: string;
  metricColor: string;
  mediaType?: 'none' | 'image' | 'video';
  mediaUrl?: string;
}

export interface HomeSectionHeaders {
  axesBadge: string;
  axesTitle: string;
  axesSubtitle: string;
  caseStudiesBadge: string;
  caseStudiesTitle: string;
  caseStudiesSubtitle: string;
}

export interface StrategicAxisContent {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  keyAspects: string[];
  ctaLabel: string;
  ctaTab: 'simulators' | 'solutions' | 'diagnostic';
  accentColor: string;
  bgColor?: string;
  borderColor?: string;
  tagColor?: string;
  tagBg?: string;
  btnColor?: string;
  mediaType?: 'none' | 'image' | 'video';
  mediaUrl?: string;
  mediaTitle?: string;
}

export interface SiteContent {
  theme: SiteThemeConfig;
  homeBlocks: HomeBlockConfig[];
  homeSectionHeaders: HomeSectionHeaders;
  heroSlides: SlideContent[];
  kpis: KPIItem[];
  videoSection: {
    badge: string;
    title: string;
    subtitle: string;
    youtubeId: string;
    presenterName: string;
    presenterRole: string;
    presenterBio: string;
  };
  axes: StrategicAxisContent[];
  caseStudies: CaseStudyItem[];
  profile: {
    badge: string;
    title: string;
    quote: string;
    manifesto: string;
    matricula: string;
    jurisdiction: string;
    experienceYears: string;
    founderName: string;
  };
  contact: {
    whatsappNumber: string;
    whatsappDefaultText: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    schedule: string;
  };
  socialLinks: SocialLinksConfig;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  theme: {
    fontFamily: 'sans',
    borderRadius: 'lg',
    palettePreset: 'patagonia_deep',
    primaryColor: '#0078D4',
    axesBackground: '#080E18',
  },
  homeBlocks: [
    { id: 'hero', label: 'Carrusel Hero Principal', enabled: true, order: 1 },
    { id: 'macro_context', label: 'Contexto Macroeconómico 2026 (Slide 3)', enabled: true, order: 2 },
    { id: 'axes', label: 'Cinco Servicios Oficiales (01 a 05)', enabled: true, order: 3 },
    { id: 'pitfalls', label: 'Errores Frecuentes vs Solución (Slide 4)', enabled: true, order: 4 },
    { id: 'modalities', label: 'Dos Formas de Contratar (Slide 11)', enabled: true, order: 5 },
    { id: 'case_studies', label: 'Casos de Estudio & Métricas Cuantitativas', enabled: true, order: 6 },
    { id: 'video', label: 'Exposición en Video / Conferencia', enabled: true, order: 7 },
    { id: 'profile', label: 'Perfil de Socio Fundador & Estudio', enabled: true, order: 8 },
    { id: 'diagnostic', label: 'Diagnóstico Empresarial Automatizado', enabled: true, order: 9 },
  ],
  homeSectionHeaders: {
    axesBadge: 'Cinco Servicios para Decidir con Números',
    axesTitle: 'Consultoría Estratégica & Dirección Financiera',
    axesSubtitle: 'Combino la mirada del contador —que el número sea correcto, legal y auditable— con la del administrador —que el número sirva para decidir y crecer.',
    caseStudiesBadge: 'Métricas Reales & Casos Testigo',
    caseStudiesTitle: 'Impacto Cuantitativo en Empresas y Startups',
    caseStudiesSubtitle: 'Base contable conciliada: cada indicador surge de registros verificables, no de meras estimaciones.',
  },
  heroSlides: [
    {
      id: 'slide-cfo',
      badgeCategory: 'CR. CARLOS RODRIGO DOMÍNGUEZ · AUDITORÍA & CFO',
      badgeLocation: 'Trelew, Chubut · Patagonia, Argentina y el exterior',
      title: 'Números confiables para decidir mejor',
      subtitle: 'Combino la mirada del contador —que el número sea correcto, legal y auditable— con la del administrador —que el número sirva para decidir y crecer. Clientes en Patagonia, Argentina y el exterior.',
      primaryCtaText: 'Conocer los 5 Servicios',
      primaryCtaTab: 'solutions',
      secondaryCtaText: 'Empezar con Diagnóstico',
      secondaryCtaTab: 'diagnostic',
      bgImageUrl: boardroomImg,
      referenceLabel: 'Consultoría Estratégica & Dirección Financiera',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Presentación de Servicios · Cr. Carlos Rodrigo Domínguez',
      accentColor: '#1B3636',
    },
    {
      id: 'slide-pymes',
      badgeCategory: 'MODELOS TRADICIONALES & COSTOS REALES',
      badgeLocation: 'Puerto Madryn / Trelew · Operaciones Industriales',
      title: 'Costos Marginales, Punto de Equilibrio y Reestructuración PyME',
      subtitle: 'Diagnóstico financiero riguroso para industrias laneras, pesqueras, metalmecánicas y cooperativas patagónicas. Reestructuración de pasivos y flujos proyectados a 12 meses.',
      primaryCtaText: 'Simulador de Punto de Equilibrio',
      primaryCtaTab: 'simulators',
      secondaryCtaText: 'Diagnóstico de Empresa',
      secondaryCtaTab: 'diagnostic',
      bgImageUrl: industryImg,
      referenceLabel: 'Polo Industrial, Portuario & Logístico Patagónico',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Operaciones Logísticas y Portuarias en Patagonia',
      accentColor: '#107C41',
    },
    {
      id: 'slide-franquicias',
      badgeCategory: 'DUE DILIGENCE PRECONTRACTUAL & LEY CCyC 1512-1524',
      badgeLocation: 'Auditoría Legal-Financiera · Expansión de Marcas',
      title: 'Evaluación y Blindaje de Franquicias Comerciales',
      subtitle: 'Auditoría integral de la Circular de Oferta de Franquicia (COF), modelos de recupero de inversión (VAN / TIR) y dictamen de franquiciabilidad para negocios en expansión.',
      primaryCtaText: 'Simulador de Franquicias (VAN/TIR)',
      primaryCtaTab: 'simulators',
      secondaryCtaText: 'Agendar Auditoría Precontractual',
      secondaryCtaTab: 'modal',
      bgImageUrl: heroPatagoniaImg,
      referenceLabel: 'Auditoría & Expansión de Redes de Franquicias',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Análisis de Viabilidad y Due Diligence de Franquicias',
      accentColor: '#8E562E',
    },
    {
      id: 'slide-ia-digital',
      badgeCategory: 'VANGUARDIA GLOBAL & ZERO-HUMAN COMPANIES',
      badgeLocation: 'Exportación de Software · Factura E & Agentes IA',
      title: 'SaaS, Exportación de Servicios y Empresas Autónomas (ZHC)',
      subtitle: 'Estructuración tributaria para facturación en USD/EUR, liquidación de divisas MULC y encuadre impositivo para agentes autónomos de IA y tesorerías descentralizadas.',
      primaryCtaText: 'Explorar Soluciones Digitales & IA',
      primaryCtaTab: 'solutions',
      secondaryCtaText: 'Solicitar Asesoría de Vanguardia',
      secondaryCtaTab: 'modal',
      bgImageUrl: digitalFintechImg,
      referenceLabel: 'Hub Tecnológico, Finanzas Digitales & Agentes IA',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Arquitectura Financiera Digital y Agentes Multi-IA',
      accentColor: '#004B50',
    },
  ],
  kpis: [
    {
      id: 'kpi-1',
      value: '18+',
      label: 'Años de experiencia financiera y tributaria en Patagonia',
      highlightColor: '#0F172A',
    },
    {
      id: 'kpi-2',
      value: '5',
      label: 'Ejes estratégicos de negocio integrados',
      highlightColor: '#0078D4',
    },
    {
      id: 'kpi-3',
      value: '100%',
      label: 'Blindaje legal Ley CCyC 1512-1524 & AFIP',
      highlightColor: '#0F172A',
    },
    {
      id: 'kpi-4',
      value: 'USD 45M+',
      label: 'En modelos de inversión y flujos auditados',
      highlightColor: '#107C41',
    },
  ],
  videoSection: {
    badge: 'CONFERENCIA & CLASE MAGISTRAL',
    title: 'Exposición Técnica: Arquitectura Financiera & Decisiones Críticas',
    subtitle: 'El Cr. Carlos Rodrigo Domínguez expone las claves para la optimización de flujos de fondos, márgenes de contribución y gestión del riesgo en contextos de alta volatilidad.',
    youtubeId: 'dQw4w9WgXcQ',
    presenterName: 'Cr. Carlos Rodrigo Domínguez',
    presenterRole: 'Director de Consultoría & Ex CFO Corporativo',
    presenterBio: 'Especialista en estructuración financiera, auditoría de franquicias comerciales (Ley CCyC 1512-1524) y diseño de modelos de costos en la Región Patagónica.',
  },
  axes: [
    {
      id: 'axis-1',
      number: '01',
      category: 'Unit Economics & Retención',
      title: 'Diagnóstico de Unit Economics',
      description: 'Cuánto deja cada cliente y cada plan. Tablero de ingresos recurrentes, churn, CAC, LTV y margen por plan + 5 acciones de impacto inmediato.',
      keyAspects: [
        'Tablero de ingresos recurrentes (MRR / ARR)',
        'Cálculo auditado de Churn, CAC y LTV real',
        'Margen de contribución por plan y 5 acciones de mejora',
      ],
      ctaLabel: 'Abrir Simulador Unit Economics',
      ctaTab: 'simulators',
      accentColor: '#0078D4',
      bgColor: '#163333',
      borderColor: '#1F4E4E',
      tagColor: '#38BDF8',
      tagBg: 'bg-teal-950/80 border-teal-800',
      btnColor: 'bg-[#0078D4] hover:bg-[#106EBE] text-white',
      mediaType: 'image',
      mediaUrl: industryImg,
      mediaTitle: 'Diagnóstico de Unit Economics',
    },
    {
      id: 'axis-2',
      number: '02',
      category: 'Pricing & Escenarios 36 Meses',
      title: 'Modelo Financiero y Pricing',
      description: 'Precios, escenarios y punto de equilibrio. Para empresas que cambian su forma de cobrar, migran a cobro por consumo o incorporan IA.',
      keyAspects: [
        'Modelo financiero a 36 meses con matrices de sensibilidad',
        'Punto de equilibrio operativo y escalones de volumen',
        'Cláusulas de indexación inflacionaria ARS / USD',
      ],
      ctaLabel: 'Ver Simulador de Pricing',
      ctaTab: 'simulators',
      accentColor: '#107C41',
      bgColor: '#122D2B',
      borderColor: '#1D5A54',
      tagColor: '#4ADE80',
      tagBg: 'bg-emerald-950/80 border-emerald-800',
      btnColor: 'bg-[#107C41] hover:bg-[#0E6A37] text-white',
      mediaType: 'image',
      mediaUrl: digitalFintechImg,
      mediaTitle: 'Modelo Financiero & Pricing Dinámico',
    },
    {
      id: 'axis-3',
      number: '03',
      category: 'Comercio Exterior & BCRA',
      title: 'Estructuración del Exportador',
      description: 'Figura fiscal, Factura E y cobro de divisas. Para freelancers, desarrolladores y estudios que facturan a México, España, Colombia, EE.UU. y Brasil.',
      keyAspects: [
        'Elección de figura: Monotributo vs. Responsable Inscripto vs. SAS',
        'Factura E y liquidación de divisas según Com. BCRA "A" 8481',
        'Beneficios de la Ley de Economía del Conocimiento (27.506 / 27.570)',
      ],
      ctaLabel: 'Simular Factura E & Divisas',
      ctaTab: 'simulators',
      accentColor: '#D97706',
      bgColor: '#332414',
      borderColor: '#78471F',
      tagColor: '#FBBF24',
      tagBg: 'bg-amber-950/80 border-amber-800',
      btnColor: 'bg-[#D97706] hover:bg-[#B45309] text-white',
      mediaType: 'video',
      mediaUrl: 'dQw4w9WgXcQ',
      mediaTitle: 'Factura E y Cobro de Divisas BCRA',
    },
    {
      id: 'axis-4',
      number: '04',
      category: 'Dirección Financiera Continua',
      title: 'CFO Fraccional',
      description: 'Dirección financiera mensual sin estructura fija. Acompañamiento continuo para startups y PyMEs sin director financiero dedicado.',
      keyAspects: [
        'Reporte mensual de métricas contables conciliadas',
        'Control estricto de flujo de caja y proyección de Cash Runway',
        'Presupuesto maestro a 12 meses y comité financiero con socios',
      ],
      ctaLabel: 'Agendar Reunión Inicial',
      ctaTab: 'diagnostic',
      accentColor: '#4F46E5',
      bgColor: '#1A233A',
      borderColor: '#2F4170',
      tagColor: '#818CF8',
      tagBg: 'bg-indigo-950/80 border-indigo-800',
      btnColor: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white',
      mediaType: 'image',
      mediaUrl: boardroomImg,
      mediaTitle: 'CFO Fraccional & Comité Financiero',
    },
    {
      id: 'axis-5',
      number: '05',
      category: 'Venture Capital & Rondas',
      title: 'Preparación para Inversores',
      description: 'Data room, proyecciones y due diligence. Para startups pre-seed y seed que buscan validar métricas frente a inversores ángeles y fondos.',
      keyAspects: [
        'Data room contable y financiero con trazabilidad auditable',
        'Proyecciones económicas validadas con cohortes de retención',
        'Auditoría y due diligence previa pre-seed / seed',
      ],
      ctaLabel: 'Explorar Data Room & Rondas',
      ctaTab: 'solutions',
      accentColor: '#0F766E',
      bgColor: '#142E2E',
      borderColor: '#1D5A5A',
      tagColor: '#2DD4BF',
      tagBg: 'bg-teal-950/80 border-teal-800',
      btnColor: 'bg-[#0F766E] hover:bg-[#115E59] text-white',
      mediaType: 'image',
      mediaUrl: heroPatagoniaImg,
      mediaTitle: 'Data Room & Preparación para Inversores',
    },
  ],
  caseStudies: [
    {
      id: 'case-1',
      tag: 'SaaS & Software · Patagonia',
      title: 'Optimización de Unit Economics y Reducción de Churn',
      description: 'Reclasificación contable de costos de infraestructura e IA, recálculo de CAC integral y reducción de churn mensual del 4.2% al 1.8%.',
      metric: '108% NRR',
      metricLabel: 'Retención Neta de Ingresos Lograda',
      bgColor: '#163333',
      borderColor: '#1F4E4E',
      tagColor: '#38BDF8',
      metricColor: '#38BDF8',
      mediaType: 'image',
      mediaUrl: digitalFintechImg,
    },
    {
      id: 'case-2',
      tag: 'Exportador de Servicios · Argentina',
      title: 'Estructuración de Factura E y Cobro BCRA Com. A 8481',
      description: 'Encuadre cambiario legal para exportadores de software con facturación en USD, exención de liquidación hasta cupo y blindaje ante ARCA.',
      metric: 'USD 52,000 / año',
      metricLabel: 'Flujo de Divisas Bancarizado Legalmente',
      bgColor: '#122D2B',
      borderColor: '#1D5A54',
      tagColor: '#4ADE80',
      metricColor: '#4ADE80',
      mediaType: 'image',
      mediaUrl: industryImg,
    },
    {
      id: 'case-3',
      tag: 'PyME & Franquicias · Chubut',
      title: 'Auditoría Precontractual y Modelo Económico CCyC 1512',
      description: 'Auditoría de Circular de Oferta (COF), recálculo de Payback real y reestructuración del contrato de franquicia para expansión patagónica.',
      metric: '-22% Costos',
      metricLabel: 'Ahorro Operativo en Apertura',
      bgColor: '#332414',
      borderColor: '#78471F',
      tagColor: '#FBBF24',
      metricColor: '#FBBF24',
      mediaType: 'image',
      mediaUrl: boardroomImg,
    },
  ],
  profile: {
    badge: 'DIRECCIÓN & SOCIO FUNDADOR',
    title: 'Cr. Carlos Rodrigo Domínguez',
    quote: '"Combino la mirada del contador —que el número sea correcto, legal y auditable— con la del administrador —que el número sirva para decidir y crecer."',
    manifesto: 'Socio del Estudio Contable Domínguez & Lambrecht (Trelew). Contador Público y Auditor, Licenciado en Administración. Asesoramos a PyMEs, franquicias, empresas de software y exportadores de servicios en Patagonia, Argentina y el exterior, uniendo rigurosidad contable con estrategia financiera orientada a resultados verificables.',
    matricula: 'Contador Público y Auditor · Licenciado en Administración (CPCE Chubut)',
    jurisdiction: 'Socio de Domínguez & Lambrecht Estudio Contable · Trelew, Chubut',
    experienceYears: 'Clientes en Patagonia, Argentina y el exterior',
    founderName: 'Cr. Carlos Rodrigo Domínguez',
  },
  contact: {
    whatsappNumber: '5492804567890',
    whatsappDefaultText: 'Hola Cr. Domínguez, me comunico desde la plataforma web para coordinar una reunión inicial de diagnóstico.',
    email: 'hola@crdominguez.ar',
    phone: '+54 280 442-8812',
    address: 'Trelew, Chubut · Patagonia, Argentina y el exterior',
    city: 'Trelew, Chubut',
    schedule: 'Lunes a Viernes de 09:00 a 18:00 hs (Atención presencial y remota)',
  },
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/carlos-rodrigo-dominguez',
    youtube: 'https://www.youtube.com/@crdominguez-cfo',
    instagram: 'https://www.instagram.com/crdominguez.ar',
    twitterX: 'https://x.com/crdominguez_ar',
    spotify: 'https://open.spotify.com/show/crdominguez-cfo-podcast',
    whatsapp: '5492804567890',
    facebook: 'https://facebook.com/crdominguez.consultoria',
    github: 'https://github.com/crdominguez-ar',
  },
};

const STORAGE_KEY = 'cr_site_content_v4';
const LEGACY_KEYS = ['cr_site_content_v3', 'cr_site_content_v2', 'cr_site_content'];
const UPDATE_EVENT = 'cr_content_updated';

class ContentService {
  getContent(): SiteContent {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
    try {
      LEGACY_KEYS.forEach((oldKey) => {
        try { localStorage.removeItem(oldKey); } catch {}
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
        return DEFAULT_SITE_CONTENT;
      }
      const parsed = JSON.parse(stored);
      const contactMerged = { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) };
      
      // Sanitización estricta de correo institucional
      if (!contactMerged.email || contactMerged.email.includes('gmail.com') || contactMerged.email === 'carlos@crdominguez.ar') {
        contactMerged.email = 'hola@crdominguez.ar';
      }

      return {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        theme: { ...DEFAULT_SITE_CONTENT.theme, ...(parsed.theme || {}) },
        socialLinks: { ...DEFAULT_SITE_CONTENT.socialLinks, ...(parsed.socialLinks || {}) },
        contact: contactMerged,
        homeBlocks: parsed.homeBlocks && parsed.homeBlocks.length ? parsed.homeBlocks : DEFAULT_SITE_CONTENT.homeBlocks,
        homeSectionHeaders: { ...DEFAULT_SITE_CONTENT.homeSectionHeaders, ...(parsed.homeSectionHeaders || {}) },
        caseStudies: parsed.caseStudies && parsed.caseStudies.length 
          ? parsed.caseStudies.map((c: any, idx: number) => ({ ...DEFAULT_SITE_CONTENT.caseStudies[idx], ...c }))
          : DEFAULT_SITE_CONTENT.caseStudies,
        axes: parsed.axes && parsed.axes.length 
          ? parsed.axes.map((a: any, idx: number) => ({ ...DEFAULT_SITE_CONTENT.axes[idx], ...a }))
          : DEFAULT_SITE_CONTENT.axes,
      };
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  }

  saveContent(content: SiteContent): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: content }));
    } catch (e) {
      console.error('Error saving content:', e);
    }
  }

  updateSection<K extends keyof SiteContent>(section: K, data: SiteContent[K]): void {
    const current = this.getContent();
    current[section] = data;
    this.saveContent(current);
  }

  updateHeroSlide(index: number, updatedSlide: Partial<SlideContent>): void {
    const current = this.getContent();
    if (current.heroSlides[index]) {
      current.heroSlides[index] = { ...current.heroSlides[index], ...updatedSlide };
      this.saveContent(current);
    }
  }

  resetToDefaults(): SiteContent {
    this.saveContent(DEFAULT_SITE_CONTENT);
    return DEFAULT_SITE_CONTENT;
  }

  subscribe(listener: (content: SiteContent) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      listener(customEvent.detail || this.getContent());
    };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }
}

export const contentService = new ContentService();
