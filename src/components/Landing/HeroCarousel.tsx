import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  ArrowRight, 
  Sparkles, 
  LineChart, 
  Building2, 
  Globe, 
  X,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

export interface SlideData {
  id: string;
  badgeCategory: string;
  badgeLocation: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaAction: () => void;
  secondaryCtaText: string;
  secondaryCtaAction: () => void;
  bgImageUrl: string;
  videoType?: 'youtube' | 'html5';
  videoSrc?: string; // YouTube ID or video file URL
  videoTitle?: string;
  accentColor: string; // e.g. '#0078D4', '#107C41', '#5C2D91', '#004B50'
}

interface HeroCarouselProps {
  onSelectTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo') => void;
  onOpenConsultationModal: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectTab, onOpenConsultationModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>('dQw4w9WgXcQ');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [bgVideoPlaying, setBgVideoPlaying] = useState(true);
  const [isBgMuted, setIsBgMuted] = useState(true);

  const SLIDE_DURATION = 7500; // 7.5 seconds per slide
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const slides: SlideData[] = [
    {
      id: 'slide-cfo',
      badgeCategory: 'DIRECCIÓN FINANCIERA & CFO ON-DEMAND',
      badgeLocation: 'Trelew, Chubut · Patagonia Argentina',
      title: 'Consultoría de Negocios Estratégica & Dirección Financiera',
      subtitle: 'Superamos la gestoría administrativa tradicional. Desarrollamos arquitectura contable, fiscal y de dirección financiera moderna para PyMEs patagónicas y empresas en expansión.',
      primaryCtaText: 'Conocer Soluciones & Servicios',
      primaryCtaAction: () => onSelectTab('solutions'),
      secondaryCtaText: 'Ver Exposición (Video)',
      secondaryCtaAction: () => openVideo('dQw4w9WgXcQ', 'Conferencia Ejecutiva: Dirección Financiera & Negocios Estratégicos'),
      bgImageUrl: '/src/assets/images/strategic_financial_boardroom_1793059909387.jpg',
      videoType: 'youtube',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Presentación Ejecutiva Estudio Domínguez & Lambrecht',
      accentColor: '#0078D4',
    },
    {
      id: 'slide-pymes',
      badgeCategory: 'MODELOS TRADICIONALES & COSTOS REALES',
      badgeLocation: 'Puerto Madryn / Trelew · Operaciones Industriales',
      title: 'Costos Marginales, Punto de Equilibrio y Reestructuración PyME',
      subtitle: 'Diagnóstico profundo para empresas laneras, pesqueras, metalmecánicas y cooperativas de la Patagonia. Reestructuración de pasivos y flujos de fondos proyectados a 12 meses.',
      primaryCtaText: 'Simulador de Punto de Equilibrio',
      primaryCtaAction: () => onSelectTab('simulators'),
      secondaryCtaText: 'Diagnóstico de Empresa',
      secondaryCtaAction: () => onSelectTab('diagnostic'),
      bgImageUrl: '/src/assets/images/patagonia_industry_logistics_1793065886236.jpg',
      videoType: 'html5',
      // High quality royalty-free industrial / financial corporate ambient video loop
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-cargo-ship-in-a-port-at-sunset-41484-large.mp4',
      videoTitle: 'Operaciones Logísticas y Portuarias en Patagonia',
      accentColor: '#107C41',
    },
    {
      id: 'slide-franquicias',
      badgeCategory: 'DUE DILIGENCE PRECONTRACTUAL & LEY CCyC 1512-1524',
      badgeLocation: 'Auditoría Legal-Financiera · Expansión de Marcas',
      title: 'Evaluación y Blindaje de Franquicias Comerciales',
      subtitle: 'Auditoría rigurosa de la Circular de Oferta de Franquicia (COF), modelos de recupero de inversión (VAN / TIR) y desarrollo de franquiciabilidad para PyMEs patagónicas.',
      primaryCtaText: 'Simulador de Franquicias (VAN/TIR)',
      primaryCtaAction: () => onSelectTab('simulators'),
      secondaryCtaText: 'Agendar Auditoría Precontractual',
      secondaryCtaAction: () => onOpenConsultationModal(),
      bgImageUrl: '/src/assets/images/hero_patagonia_consultancy_1793059908678.jpg',
      videoType: 'youtube',
      videoSrc: 'dQw4w9WgXcQ',
      videoTitle: 'Análisis de Viabilidad y Due Diligence de Franquicias',
      accentColor: '#8E562E',
    },
    {
      id: 'slide-ia-digital',
      badgeCategory: 'VANGUARDIA GLOBAL & ZERO-HUMAN COMPANIES',
      badgeLocation: 'Exportación de Software · Factura E & Agentes IA',
      title: 'SaaS, Exportación de Servicios y Empresas Autónomas (ZHC)',
      subtitle: 'Estructuración tributaria para cobros en USD/EUR, liquidación de divisas MULC y el primer servicio en Argentina de contabilidad y deducciones para agentes de IA y DAOs.',
      primaryCtaText: 'Explorar Soluciones Digitales & IA',
      primaryCtaAction: () => onSelectTab('solutions'),
      secondaryCtaText: 'Solicitar Asesoría de Vanguardia',
      secondaryCtaAction: () => onOpenConsultationModal(),
      bgImageUrl: '/src/assets/images/digital_ai_fintech_hub_1793065898721.jpg',
      videoType: 'html5',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-keyboard-41348-large.mp4',
      videoTitle: 'Arquitectura Financiera Digital y Agentes Multi-IA',
      accentColor: '#004B50',
    },
  ];

  // Auto slide effect
  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const openVideo = (videoId: string, title: string) => {
    setActiveVideoId(videoId);
    setActiveVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  const activeSlideData = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden bg-white border-b border-slate-200 select-none">
      {/* Main Full-Width Slider Container */}
      <div 
        className="relative w-full min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-between"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Visual Layer for Each Slide */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Optional Background Video if HTML5 video is provided & playing */}
              {slide.videoType === 'html5' && slide.videoSrc && bgVideoPlaying ? (
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    ref={isActive ? videoRef : null}
                    autoPlay
                    loop
                    muted={isBgMuted}
                    playsInline
                    className="w-full h-full object-cover object-center filter saturate-105"
                  >
                    <source src={slide.videoSrc} type="video/mp4" />
                    {/* Fallback image */}
                    <img
                      src={slide.bgImageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </video>
                </div>
              ) : (
                /* High-Resolution crisp corporate image */
                <img
                  src={slide.bgImageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-[8000ms] ease-out group-hover:scale-105"
                />
              )}

              {/* Luminous daylight enterprise overlay scrims */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/75" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
            </div>
          );
        })}

        {/* Top Control Bar: Slide Category Indicator & Video Controls */}
        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-20 xl:px-24 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider bg-white/90 border border-slate-200 text-slate-800 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSlideData.accentColor }} />
              SLIDE 0{currentSlide + 1} / 0{slides.length}
            </span>
            <span className="hidden md:inline-block text-xs font-semibold text-slate-500 font-mono">
              {activeSlideData.badgeLocation}
            </span>
          </div>

          {/* Quick Action Badges: Play/Pause Autoplay & Video Toggle */}
          <div className="flex items-center gap-2">
            {activeSlideData.videoSrc && (
              <button
                type="button"
                onClick={() => openVideo(activeSlideData.videoSrc || 'dQw4w9WgXcQ', activeSlideData.videoTitle || activeSlideData.title)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0078D4]/10 hover:bg-[#0078D4]/20 text-[#0078D4] border border-[#0078D4]/30 transition-colors shadow-sm cursor-pointer"
                title="Abrir reproductor de video"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Video Relacionado</span>
                <span className="sm:hidden">Video</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors"
              title={isAutoPlaying ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-700" />}
            </button>
          </div>
        </div>

        {/* Content Section (Full-Width Edge-to-Edge Padding with Crisp Typography) */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-10 lg:py-16 max-w-5xl space-y-5">
          {/* Eyebrow badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
            <span 
              className="px-2.5 py-1 rounded text-white font-bold text-[11px]"
              style={{ backgroundColor: activeSlideData.accentColor }}
            >
              {activeSlideData.badgeCategory}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 font-medium">Cr. Carlos Rodrigo Domínguez</span>
          </div>

          {/* Slide Heading with smooth key animation */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] text-balance transition-all duration-300">
            {activeSlideData.title}
          </h1>

          {/* Slide Subtitle */}
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl font-normal transition-all duration-300">
            {activeSlideData.subtitle}
          </p>

          {/* CTA Button Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4">
            <button
              type="button"
              onClick={activeSlideData.primaryCtaAction}
              className="px-6 py-3.5 text-white font-bold text-xs sm:text-sm rounded-md transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-[0.99]"
              style={{ backgroundColor: activeSlideData.accentColor }}
            >
              <span>{activeSlideData.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={activeSlideData.secondaryCtaAction}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-semibold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {activeSlideData.secondaryCtaText.includes('Video') && (
                <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
              )}
              <span>{activeSlideData.secondaryCtaText}</span>
            </button>

            {/* Direct video modal trigger button if available */}
            {activeSlideData.videoSrc && !activeSlideData.secondaryCtaText.includes('Video') && (
              <button
                type="button"
                onClick={() => openVideo(activeSlideData.videoSrc || 'dQw4w9WgXcQ', activeSlideData.videoTitle || activeSlideData.title)}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2 border border-slate-200 shadow-sm cursor-pointer"
                title="Reproducir video explicativo"
              >
                <Video className="w-4 h-4 text-[#0078D4]" />
                <span className="hidden sm:inline">Exposición Técnica</span>
              </button>
            )}
          </div>
        </div>

        {/* Carousel Navigation Bar (Indicators + Prev/Next Controls) */}
        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-20 xl:px-24 py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Slide Indicators with Progress bars */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {slides.map((slide, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group text-left transition-all py-1.5 px-2.5 rounded-md flex items-center gap-2 border ${
                    isCurrent 
                      ? 'bg-slate-100 border-slate-300 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-slate-50'
                  }`}
                  aria-label={`Ir al slide ${idx + 1}: ${slide.title}`}
                >
                  <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    0{idx + 1}
                  </span>
                  
                  {/* Visual Indicator pill */}
                  <div className="w-12 sm:w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
                    {isCurrent && isAutoPlaying ? (
                      <div 
                        className="h-full rounded-full transition-all duration-100"
                        style={{
                          backgroundColor: slide.accentColor,
                          animation: `progressBar ${SLIDE_DURATION}ms linear forwards`
                        }}
                      />
                    ) : (
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: isCurrent ? slide.accentColor : 'transparent',
                          width: isCurrent ? '100%' : '0%' 
                        }}
                      />
                    )}
                  </div>

                  <span className="hidden xl:inline text-[11px] font-semibold text-slate-600 truncate max-w-[130px]">
                    {slide.badgeCategory.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={prevSlide}
              className="p-2.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-colors shadow-sm cursor-pointer"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="p-2.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-colors shadow-sm cursor-pointer"
              aria-label="Slide siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Column KPI Strip embedded at the bottom of the hero block */}
        <div className="relative z-10 w-full border-t border-slate-200 bg-white">
          <div className="w-full px-6 sm:px-12 lg:px-20 xl:px-24 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="py-5 sm:pr-8">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums block">
                18+
              </span>
              <span className="text-xs text-slate-600 mt-1 block font-medium">
                Años de experiencia financiera y tributaria en Patagonia
              </span>
            </div>

            <div className="py-5 sm:px-8">
              <span className="text-2xl sm:text-3xl font-black text-[#0078D4] font-mono tabular-nums block">
                5
              </span>
              <span className="text-xs text-slate-600 mt-1 block font-medium">
                Ejes estratégicos de negocio integrados
              </span>
            </div>

            <div className="py-5 sm:px-8">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums block">
                100%
              </span>
              <span className="text-xs text-slate-600 mt-1 block font-medium">
                Blindaje legal Ley CCyC 1512-1524 & AFIP
              </span>
            </div>

            <div className="py-5 sm:pl-8">
              <span className="text-2xl sm:text-3xl font-black text-[#107C41] font-mono tabular-nums block">
                USD 45M+
              </span>
              <span className="text-xs text-slate-600 mt-1 block font-medium">
                En modelos de inversión y flujos auditados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#0078D4]" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {activeVideoTitle || 'Exposición Ejecutiva · Estudio Domínguez & Lambrecht'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-slate-950">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title={activeVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <span>
                Disertante: <strong className="text-slate-900">Cr. Carlos Rodrigo Domínguez</strong> · Consultoría Estratégica
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    onOpenConsultationModal();
                  }}
                  className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold rounded text-xs transition-colors shadow-sm"
                >
                  Solicitar Consulta sobre el Tema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
