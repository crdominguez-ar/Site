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
  id: 'hero' | 'video' | 'axes' | 'case_studies' | 'profile' | 'diagnostic';
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
    { id: 'video', label: 'Exposición en Video / Conferencia', enabled: true, order: 2 },
    { id: 'axes', label: 'Cinco Ejes Estratégicos (Bento Blocks)', enabled: true, order: 3 },
    { id: 'case_studies', label: 'Casos de Estudio & Métricas Cuantitativas', enabled: true, order: 4 },
    { id: 'profile', label: 'Perfil de Socio Fundador & Estudio', enabled: true, order: 5 },
    { id: 'diagnostic', label: 'Diagnóstico Empresarial Automatizado', enabled: true, order: 6 },
  ],
  homeSectionHeaders: {
    axesBadge: 'Cinco Divisiones Especializadas',
    axesTitle: 'Arquitectura de Soluciones Estratégicas',
    axesSubtitle: 'Diseño en bloques modulares con metodologías financieras, tributarias y normativas ejecutadas con máxima precisión analítica.',
    caseStudiesBadge: 'Resultados Comprobados & Auditorías Reales',
    caseStudiesTitle: 'Impacto Cuantitativo en Empresas Patagónicas',
    caseStudiesSubtitle: 'Métricas auditadas con respaldo normativo, reestructuración financiera y optimización fiscal demostrable.',
  },
  heroSlides: [
    {
      id: 'slide-cfo',
      badgeCategory: 'DIRECCIÓN FINANCIERA & CFO ON-DEMAND',
      badgeLocation: 'Trelew, Chubut · Patagonia Argentina',
      title: 'Consultoría Estratégica de Negocios & Dirección Financiera',
      subtitle: 'Superamos la gestoría administrativa tradicional. Desarrollamos arquitectura contable, fiscal y de dirección financiera ejecutiva para empresas patagónicas y proyectos de alto crecimiento.',
      primaryCtaText: 'Conocer Soluciones & Servicios',
      primaryCtaTab: 'solutions',
      secondaryCtaText: 'Ver Exposición (Video)',
      secondaryCtaTab: 'video',
      bgImageUrl: boardroomImg,
      referenceLabel: 'Sala de Directorio & Planificación Financiera',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Presentación Ejecutiva · Cr Dominguez',
      accentColor: '#0078D4',
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
      category: 'Costeo Marginal & Operativo',
      title: 'Modelos Tradicionales & PyMEs Patagónicas',
      description: 'Ingeniería de costos, determinación del punto de equilibrio real y reestructuración de pasivos para industrias productivas, pesqueras, laneras y de servicios.',
      keyAspects: [
        'Cálculo de margen de contribución por línea de producción',
        'Modelos de absorción de costos fijos y estacionalidad',
        'Flujos de caja proyectados a 12 meses con escenarios de estrés',
      ],
      ctaLabel: 'Abrir Simulador de Equilibrio',
      ctaTab: 'simulators',
      accentColor: '#0078D4',
      bgColor: '#0D223F',
      borderColor: '#1E3A8A',
      tagColor: '#38BDF8',
      tagBg: 'bg-blue-950/80 border-blue-800',
      btnColor: 'bg-[#0078D4] hover:bg-[#106EBE] text-white',
      mediaType: 'image',
      mediaUrl: industryImg,
      mediaTitle: 'Auditoría Industrial & Costos',
    },
    {
      id: 'axis-2',
      number: '02',
      category: 'Economía del Conocimiento',
      title: 'SaaS, Creadores & Exportación de Servicios',
      description: 'Estructuración fiscal para profesionales, agencias y startups exportadoras de software. Gestión de Factura E, divisas MULC y beneficios tributarios.',
      keyAspects: [
        'Régimen de ingreso y liquidación de divisas de exportación',
        'Tratamiento de retenciones impositivas internacionales',
        'Contabilidad de activos digitales y suscripciones recurrentes',
      ],
      ctaLabel: 'Ver Soluciones Digitales',
      ctaTab: 'solutions',
      accentColor: '#107C41',
      bgColor: '#0A3324',
      borderColor: '#065F46',
      tagColor: '#4ADE80',
      tagBg: 'bg-emerald-950/80 border-emerald-800',
      btnColor: 'bg-[#107C41] hover:bg-[#0E6A37] text-white',
      mediaType: 'image',
      mediaUrl: digitalFintechImg,
      mediaTitle: 'Economía del Conocimiento & Fintech',
    },
    {
      id: 'axis-3',
      number: '03',
      category: 'Ley CCyC 1512-1524',
      title: 'Evaluación y Blindaje de Franquicias',
      description: 'Auditoría rigurosa precontractual de la Circular de Oferta de Franquicia (COF). Análisis cuantitativo de VAN / TIR y dictámenes de viabilidad para franquiciados y franquiciantes.',
      keyAspects: [
        'Revisión de 10 obligaciones legales inderogables del CCyC',
        'Cálculo del Payback y tasa interna de retorno corregida',
        'Análisis de territorio exclusivo y cláusulas de provisión',
      ],
      ctaLabel: 'Simular VAN / TIR Franquicias',
      ctaTab: 'simulators',
      accentColor: '#8E562E',
      bgColor: '#3D1E0C',
      borderColor: '#92400E',
      tagColor: '#FBBF24',
      tagBg: 'bg-amber-950/80 border-amber-800',
      btnColor: 'bg-[#D97706] hover:bg-[#B45309] text-white',
      mediaType: 'video',
      mediaUrl: 'dQw4w9WgXcQ',
      mediaTitle: 'Exposición Técnica: Ley CCyC 1512',
    },
    {
      id: 'axis-4',
      number: '04',
      category: 'Dirección Financiera On-Demand',
      title: 'CFO a Tiempo Parcial & Tableros de Control',
      description: 'Acompañamiento directivo para empresas en fase de crecimiento o reorganización. Tableros ejecutivos en tiempo real y gobernanza corporativa.',
      keyAspects: [
        'Comité financiero mensual con socios y directores',
        'Supervisión de tesorería, endeudamiento bancario y WACC',
        'Modelado de sensibilidad ante shocks cambiarios o inflacionarios',
      ],
      ctaLabel: 'Solicitar Diagnóstico',
      ctaTab: 'diagnostic',
      accentColor: '#0078D4',
      bgColor: '#191D45',
      borderColor: '#3730A3',
      tagColor: '#818CF8',
      tagBg: 'bg-indigo-950/80 border-indigo-800',
      btnColor: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white',
      mediaType: 'image',
      mediaUrl: boardroomImg,
      mediaTitle: 'Directorio Ejecutivo & CFO',
    },
    {
      id: 'axis-5',
      number: '05',
      category: 'Vanguardia Global & ZHC',
      title: 'Empresas Autónomas IA & Criptoactivos',
      description: 'Pioneros en Argentina en el encuadre tributario, deducción de costos de inferencia LLM y contabilidad de tesorerías on-chain para organizaciones descentralizadas.',
      keyAspects: [
        'Deducibilidad de costos de API (OpenAI, Anthropic, infraestructura)',
        'Conciliación de wallets corporativas y smart contracts',
        'Modelado tributario de personas jurídicas con agentes autónomos',
      ],
      ctaLabel: 'Explorar Arquitectura IA',
      ctaTab: 'solutions',
      accentColor: '#004B50',
      bgColor: '#291048',
      borderColor: '#6B21A8',
      tagColor: '#C084FC',
      tagBg: 'bg-purple-950/80 border-purple-800',
      btnColor: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
      mediaType: 'image',
      mediaUrl: heroPatagoniaImg,
      mediaTitle: 'Modelos Digitales Avanzados',
    },
  ],
  caseStudies: [
    {
      id: 'case-1',
      tag: 'Industrial · Trelew',
      title: 'Costos Ocultos y Punto de Equilibrio Marginal',
      description: 'Reclasificación analítica de costos fijos y absorción industrial que incrementó el margen de contribución en 6 meses de intervención.',
      metric: '+18.4%',
      metricLabel: 'Margen Operativo Neto Certificado',
      bgColor: '#0D223F',
      borderColor: '#1E3A8A',
      tagColor: '#38BDF8',
      metricColor: '#38BDF8',
      mediaType: 'image',
      mediaUrl: industryImg,
    },
    {
      id: 'case-2',
      tag: 'SaaS Tech · Puerto Madryn',
      title: 'Factura E & Economía del Conocimiento',
      description: 'Encuadre fiscal integral con cupo legal de divisas, bono fiscal para contribuciones patronales y deducción de retenciones transfronterizas.',
      metric: 'USD 48,000 / año',
      metricLabel: 'Optimización Fiscal y Cambiaria',
      bgColor: '#0A3324',
      borderColor: '#065F46',
      tagColor: '#4ADE80',
      metricColor: '#4ADE80',
      mediaType: 'image',
      mediaUrl: digitalFintechImg,
    },
    {
      id: 'case-3',
      tag: 'Red Comercial · Valle Chubut',
      title: 'Auditoría Precontractual de Franquicia (CCyC)',
      description: 'Identificación de cláusulas abusivas de exclusividad, recálculo de Payback real y renegociando el canon inicial un 25%.',
      metric: '-25% Reducción',
      metricLabel: 'Canon Inicial Directo Ahorrado',
      bgColor: '#3D1E0C',
      borderColor: '#92400E',
      tagColor: '#FBBF24',
      metricColor: '#FBBF24',
      mediaType: 'image',
      mediaUrl: boardroomImg,
    },
  ],
  profile: {
    badge: 'MANIFIESTO & LIDERAZGO PROFESIONAL',
    title: 'Cr. Carlos Rodrigo Domínguez',
    quote: '"La contabilidad que genera valor estratégico, no meras declaraciones juradas a mes vencido."',
    manifesto: 'En un entorno macroeconómico dinámico y en plena revolución de modelos autónomos de inteligencia artificial, el rol del contador y director financiero debe elevarse. En Cr Dominguez · Consultoría Estratégica no operamos como una gestoría administrativa tradicional: actuamos como socios estratégicos de las empresas que impulsan el desarrollo de la Patagonia y el ecosistema global.',
    matricula: 'Matrícula Profesional Oficial CPCE Provincia del Chubut',
    jurisdiction: 'Sujeto a normas de secreto profesional (Ley 20.488) y código de ética FACPCE',
    experienceYears: '18+ años de trayectoria directiva y pericial',
    founderName: 'Cr. Carlos Rodrigo Domínguez',
  },
  contact: {
    whatsappNumber: '5492804567890',
    whatsappDefaultText: 'Hola Cr. Domínguez, me comunico desde la plataforma web para realizar una consulta profesional sobre consultoría estratégica.',
    email: 'carlos@crdominguez.ar',
    phone: '+54 280 442-8812',
    address: 'Trelew, Valle Inferior del Río Chubut',
    city: 'Patagonia Argentina',
    schedule: 'Lunes a Viernes de 09:00 a 18:00 hs',
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

const STORAGE_KEY = 'cr_site_content_v1';
const UPDATE_EVENT = 'cr_content_updated';

class ContentService {
  getContent(): SiteContent {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
        return DEFAULT_SITE_CONTENT;
      }
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        theme: { ...DEFAULT_SITE_CONTENT.theme, ...(parsed.theme || {}) },
        socialLinks: { ...DEFAULT_SITE_CONTENT.socialLinks, ...(parsed.socialLinks || {}) },
        contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
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
