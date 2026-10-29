import { BlogPost, BlogCategory } from '../types';
import { resendService } from './resendService';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Franquicias bajo la lupa del CCyC: Los 6 riesgos de la Circular de Oferta (COF)',
    slug: 'franquicias-ley-ccyc-circular-oferta',
    excerpt: 'Análisis minucioso de los Artículos 1512 a 1524 del Código Civil y Comercial. Cómo auditar los balances de los 2 años previos y blindar el plazo mínimo legal de 4 años para inversores en Patagonia.',
    content: `El contrato de franquicia en Argentina dejó de ser un contrato atípico con la sanción del Código Civil y Comercial de la Nación (Ley 26.994). A partir del Artículo 1512, el legislador estableció salvaguardas claras para nivelar la asimetría informativa entre el franquiciante y el franquiciado.

En nuestra práctica profesional en Chubut, detectamos con frecuencia tres vicios recurrentes:
1. Omisión de la entrega de la Circular de Oferta de Franquicia (COF) con los 30 días de antelación legalmente exigidos.
2. Estados contables incompletos de los 2 años anteriores de unidades similares de la red.
3. Cláusulas abusivas de no competencia que exceden el año posterior a la rescisión o que imponen exclusividades territoriales ambiguas.

Antes de desembolsar el canon de ingreso, es indispensable una auditoría contable y legal para determinar el verdadero plazo de recupero (Payback).`,
    category: 'Franquicias',
    author: 'Cr. Carlos Rodrigo Domínguez',
    date: '24 Oct 2026',
    readTime: '6 min de lectura',
    featuredImage: '/src/assets/images/strategic_financial_boardroom_1793059909387.jpg',
    youtubeVideoId: 'dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/episode/7makk4oTQel546v09Zl9pX?utm_source=generator',
    tags: ['Franquicias', 'Ley CCyC 1514', 'Due Diligence', 'Payback'],
    seoTitle: 'Franquicias en Patagonia: Auditoría Legal y Financiera de COF (CCyC)',
    seoDescription: 'Dictamen profesional sobre Circular de Oferta de Franquicias (Art. 1514 CCyC), plazos mínimos y evaluación de recupero de inversión en Chubut.',
    seoKeywords: ['Franquicias Chubut', 'COF CCyC', 'Carlos Dominguez', 'Payback'],
    isPublished: true,
  },
  {
    id: 'post-2',
    title: 'Factura E y Liquidación de Divisas en Banco del Chubut: Guía para Software y Consultores',
    slug: 'factura-e-liquidacion-divisas-banco-chubut',
    excerpt: 'Paso a paso para exportadores de servicios basados en conocimiento. Cómo aprovechar el cupo legal de libre disponibilidad en dólares y computar el bono de crédito fiscal de la Ley 27.506.',
    content: `Exportar software, diseño o servicios de ingeniería desde la Patagonia ofrece un marco tributario privilegiado si se ejecuta dentro de los plazos normativos del Banco Central de la República Argentina (BCRA).

Puntos críticos que dictaminamos para nuestros clientes:
- Plazo perentorio de 5 días hábiles bancarios desde la acreditación en la cuenta del exterior.
- Emisión formal de Factura Electrónica clase 'E' vinculada a la orden de pago internacional.
- Utilización del régimen de exención simplificada de liquidación forzosa en pesos para personas humanas y pequeñas estructuras societarias.
- Inscripción en el Registro Nacional de Beneficiarios del Régimen de Promoción de la Economía del Conocimiento para acceder al 70% de reducción en contribuciones patronales.`,
    category: 'Economía del Conocimiento',
    author: 'Cr. Carlos Rodrigo Domínguez',
    date: '18 Oct 2026',
    readTime: '5 min de lectura',
    featuredImage: '/src/assets/images/digital_ai_fintech_hub_1793065898721.jpg',
    tags: ['Factura E', 'BCRA', 'MULC', 'Economía del Conocimiento'],
    seoTitle: 'Factura E y Divisas BCRA en Chubut: Consultoría Tributaria Tech',
    seoDescription: 'Guía práctica para exportadores de servicios y SaaS: liquidación de divisas, exenciones normativas y Ley 27.506.',
    seoKeywords: ['Factura E', 'Dólares Exportación', 'Economía del Conocimiento Chubut', 'Trelew'],
    isPublished: true,
  },
  {
    id: 'post-3',
    title: 'Zero-Human Companies (ZHC): El marco tributario para organizaciones operadas por IA',
    slug: 'zero-human-companies-ia-marco-tributario',
    excerpt: '¿Cómo tributa una entidad corporativa cuyos procesos de ventas, facturación y soporte están 100% orquestados por bucles multi-agente? Deducibilidad de inferencia y gobernanza.',
    content: `El advenimiento de empresas donde el 100% de la ejecución operativa está a cargo de agentes autónomos plantea interrogantes contables inéditos en la doctrina argentina.

Aspectos normativos claves:
1. Deducibilidad en el Impuesto a las Ganancias del costo de tokens de LLMs e infraestructura serverless en la nube extranjera.
2. Tratamiento tributario de las reservas de tesorería descentralizada (tokens y stablecoins) conforme a la RG AFIP 4614.
3. Responsabilidad legal de los administradores societarios frente a decisiones contractuales cerradas de forma autónoma por algoritmos.

Desde Trelew, estructuramos el primer marco de gobernanza contable para startups IA que combinan personería SAS con orquestación autónoma.`,
    category: 'Empresas 100% IA',
    author: 'Cr. Carlos Rodrigo Domínguez',
    date: '10 Oct 2026',
    readTime: '8 min de lectura',
    featuredImage: '/src/assets/images/patagonia_industry_logistics_1793065886236.jpg',
    youtubeVideoId: 'dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['ZHC', 'Multi-Agente', 'IA Fiscal', 'Cripto AFIP'],
    seoTitle: 'Encuadre Fiscal de Empresas IA (ZHC) en Argentina',
    seoDescription: 'Doctrina y asesoramiento en deducibilidad de costos de inferencia LLM, tesorería cripto y personería jurídica para firmas autónomas.',
    seoKeywords: ['ZHC', 'Inteligencia Artificial AFIP', 'Cr Dominguez', 'Trelew'],
    isPublished: true,
  },
  {
    id: 'post-4',
    title: 'CFO Fraccional para PyMEs Familiares: Control del Ciclo de Caja y Presupuestos a 12 Meses',
    slug: 'cfo-fraccional-pymes-familiares-patagonia',
    excerpt: 'Por qué una PyME consolidada en Trelew no necesita un director financiero a tiempo completo de USD 6.000/mes, sino una metodología fraccional de alto impacto con modelos VAN y TIR.',
    content: `Las empresas familiares que crecieron al calor del esfuerzo productivo suelen toparse con un techo: la falta de visibilidad en el ciclo de conversión de efectivo.

El modelo de CFO Fraccional implementado por nuestro estudio brinda:
- Un tablero mensual de Cash Flow Runway con proyecciones a 12 meses ajustadas por índices de precios reales.
- Evaluación cuantitativa de proyectos de capital (VAN y TIR) para evitar inversiones que descalcen la tesorería.
- Acompañamiento en reuniones de socios para despersonalizar las decisiones y basarlas en márgenes de contribución marginal.`,
    category: 'Finanzas & CFO',
    author: 'Cr. Carlos Rodrigo Domínguez',
    date: '02 Oct 2026',
    readTime: '7 min de lectura',
    featuredImage: '/src/assets/images/hero_patagonia_consultancy_1793059908678.jpg',
    tags: ['CFO', 'Cash Flow', 'VAN/TIR', 'Empresas Familiares'],
    seoTitle: 'Dirección Financiera y CFO Fraccional para Empresas en Patagonia',
    seoDescription: 'Optimización de flujo de fondos, finanzas estratégicas y presupuestación dinámica a 12 meses para PyMEs de Chubut.',
    seoKeywords: ['CFO Fraccional', 'Finanzas Trelew', 'Carlos Dominguez', 'Cash Flow'],
    isPublished: true,
  },
];

const STORAGE_KEY = 'cr_blog_posts';

export class BlogService {
  getPosts(): BlogPost[] {
    if (typeof window === 'undefined') return INITIAL_BLOG_POSTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading blog posts from storage, fallback to defaults:', e);
    }
    return INITIAL_BLOG_POSTS;
  }

  getPostById(id: string): BlogPost | undefined {
    return this.getPosts().find((p) => p.id === id);
  }

  getPostBySlug(slug: string): BlogPost | undefined {
    return this.getPosts().find((p) => p.slug === slug);
  }

  extractYouTubeId(urlOrId?: string): string | undefined {
    if (!urlOrId) return undefined;
    const trimmed = urlOrId.trim();
    if (!trimmed) return undefined;

    // Check if it's already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Match youtube patterns
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      return match[1];
    }

    return undefined;
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  calculateReadTime(content: string): string {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(2, Math.ceil(wordCount / 180));
    return `${minutes} min de lectura`;
  }

  async savePost(
    params: {
      id?: string;
      title: string;
      slug?: string;
      excerpt?: string;
      content: string;
      category: BlogCategory;
      author?: string;
      featuredImage?: string;
      youtubeVideoUrl?: string;
      spotifyEmbedUrl?: string;
      tags?: string[];
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string[];
      notifySubscribers?: boolean;
    }
  ): Promise<{ post: BlogPost; emailResult?: any }> {
    const currentPosts = this.getPosts();
    const cleanTitle = params.title.trim();
    const cleanContent = params.content.trim();
    const autoSlug = params.slug?.trim() || this.generateSlug(cleanTitle);
    const autoExcerpt = params.excerpt?.trim() || cleanContent.slice(0, 160) + '...';
    const ytId = this.extractYouTubeId(params.youtubeVideoUrl);
    const readTime = this.calculateReadTime(cleanContent);
    const image = params.featuredImage || '/src/assets/images/strategic_financial_boardroom_1793059909387.jpg';
    const author = params.author || 'Cr. Carlos Rodrigo Domínguez';

    const tagsArray = params.tags && params.tags.length > 0 
      ? params.tags 
      : ['Patagonia', params.category, 'Estrategia', 'AFIP'];

    let savedPost: BlogPost;

    if (params.id) {
      // Edit existing post
      const existingIndex = currentPosts.findIndex((p) => p.id === params.id);
      if (existingIndex >= 0) {
        savedPost = {
          ...currentPosts[existingIndex],
          title: cleanTitle,
          slug: autoSlug,
          excerpt: autoExcerpt,
          content: cleanContent,
          category: params.category,
          author,
          readTime,
          featuredImage: image,
          youtubeVideoId: ytId,
          videoUrl: params.youtubeVideoUrl,
          spotifyEmbedUrl: params.spotifyEmbedUrl,
          tags: tagsArray,
          seoTitle: params.seoTitle || cleanTitle,
          seoDescription: params.seoDescription || autoExcerpt,
          seoKeywords: params.seoKeywords || tagsArray,
          updatedAt: new Date().toISOString(),
          isPublished: true,
        };
        currentPosts[existingIndex] = savedPost;
      } else {
        throw new Error(`Artículo no encontrado con ID ${params.id}`);
      }
    } else {
      // New post
      savedPost = {
        id: `post-${Date.now()}`,
        title: cleanTitle,
        slug: autoSlug,
        excerpt: autoExcerpt,
        content: cleanContent,
        category: params.category,
        author,
        date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime,
        featuredImage: image,
        youtubeVideoId: ytId,
        videoUrl: params.youtubeVideoUrl,
        spotifyEmbedUrl: params.spotifyEmbedUrl,
        tags: tagsArray,
        seoTitle: params.seoTitle || cleanTitle,
        seoDescription: params.seoDescription || autoExcerpt,
        seoKeywords: params.seoKeywords || tagsArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
      };
      currentPosts.unshift(savedPost);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPosts));
      window.dispatchEvent(new CustomEvent('cr_blog_updated', { detail: { post: savedPost } }));
    }

    let emailResult: any = null;
    if (params.notifySubscribers) {
      try {
        emailResult = await resendService.sendBlogNewsletter({
          title: savedPost.title,
          excerpt: savedPost.excerpt,
          category: savedPost.category,
          author: savedPost.author,
          slug: savedPost.slug,
        });
      } catch (e) {
        console.warn('Newsletter delivery note:', e);
      }
    }

    return { post: savedPost, emailResult };
  }

  deletePost(id: string): boolean {
    const currentPosts = this.getPosts();
    const filtered = currentPosts.filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('cr_blog_updated', { detail: { deletedId: id } }));
    }
    return true;
  }
}

export const blogService = new BlogService();
