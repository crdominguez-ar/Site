import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  ArrowRight, 
  X,
  Image as ImageIcon,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { contentService, SiteContent, SlideContent } from '../../lib/contentService';

interface HeroCarouselProps {
  onSelectTab: (tab: 'landing' | 'solutions' | 'simulators' | 'diagnostic' | 'blog' | 'portal' | 'crm' | 'seo' | 'dashboard') => void;
  onOpenConsultationModal: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectTab, onOpenConsultationModal }) => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>('dQw4w9WgXcQ');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  const SLIDE_DURATION = 8000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to live CMS updates
  useEffect(() => {
    const unsub = contentService.subscribe((updated) => {
      setContent(updated);
      if (currentSlide >= updated.heroSlides.length) {
        setCurrentSlide(0);
      }
    });
    return () => unsub();
  }, [currentSlide]);

  const slides = content.heroSlides;

  // Auto slide effect
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) {
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

  const activeSlideData: SlideContent = slides[currentSlide] || slides[0];

  const handleCtaClick = (tab: SlideContent['primaryCtaTab'] | SlideContent['secondaryCtaTab']) => {
    if (tab === 'modal') {
      onOpenConsultationModal();
    } else if (tab === 'video') {
      openVideo(activeSlideData.videoSrc || 'dQw4w9WgXcQ', activeSlideData.videoTitle || activeSlideData.title);
    } else {
      onSelectTab(tab);
    }
  };

  if (!activeSlideData) return null;

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border-b border-slate-200 select-none">
      {/* Main Full-Width Slider Container */}
      <div 
        className="relative w-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[660px] flex flex-col justify-between"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Visual Layer for Each Slide - Vivid, clearly visible imagery */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* High-Resolution crisp corporate reference image */}
              <img
                src={slide.bgImageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-[8000ms] ease-out"
                loading="eager"
              />

              {/* Luminous balanced overlay scrim: keeps text legible on the left while revealing the reference image on center/right */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40 md:via-white/75 md:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />

              {/* Reference image badge overlay (Bottom-Right on tablets/desktops) */}
              <div className="absolute bottom-20 md:bottom-28 right-4 sm:right-8 lg:right-16 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-lg text-[11px] font-mono transition-all">
                <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="font-semibold truncate max-w-[240px]">{slide.referenceLabel}</span>
                <button
                  type="button"
                  onClick={() => setShowFullImageModal(true)}
                  className="ml-1 text-sky-300 hover:text-white underline text-[10px] cursor-pointer"
                  title="Ver imagen de referencia completa"
                >
                  Ampliar
                </button>
              </div>
            </div>
          );
        })}

        {/* Top Control Bar: Slide Category Indicator & Video Controls */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-16 xl:px-20 pt-4 sm:pt-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider bg-white/95 border border-slate-200 text-slate-800 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: activeSlideData.accentColor }} />
              SLIDE 0{currentSlide + 1} / 0{slides.length}
            </span>
            <span className="hidden md:inline-block text-xs font-semibold text-slate-600 font-mono bg-white/80 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[200px] lg:max-w-none">
              {activeSlideData.badgeLocation}
            </span>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowFullImageModal(true)}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
              title="Ver imagen de referencia completa"
            >
              <Eye className="w-3.5 h-3.5 text-[#0078D4]" />
              <span className="hidden sm:inline">Foto Referencia</span>
              <span className="sm:hidden">Foto</span>
            </button>

            {activeSlideData.videoSrc && (
              <button
                type="button"
                onClick={() => openVideo(activeSlideData.videoSrc || 'dQw4w9WgXcQ', activeSlideData.videoTitle || activeSlideData.title)}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#0078D4]/10 hover:bg-[#0078D4]/20 text-[#0078D4] border border-[#0078D4]/30 transition-colors shadow-sm cursor-pointer"
                title="Abrir reproductor de video"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Video</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-full bg-white/95 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-700" />}
            </button>
          </div>
        </div>

        {/* Content Section (Full-Width Responsive Edge-to-Edge) */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-6 sm:py-10 lg:py-14 max-w-4xl space-y-3 sm:space-y-4 lg:space-y-5">
          {/* Eyebrow badge */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
            <span 
              className="px-2.5 py-1 rounded text-white font-bold text-[10px] sm:text-[11px] shadow-xs"
              style={{ backgroundColor: activeSlideData.accentColor }}
            >
              {activeSlideData.badgeCategory}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-800 font-semibold bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              {content.profile.founderName}
            </span>
          </div>

          {/* Slide Heading - Smooth responsive typography */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] text-balance">
            {activeSlideData.title}
          </h1>

          {/* Slide Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-slate-800 leading-relaxed max-w-2xl font-normal bg-white/50 backdrop-blur-xs p-1.5 rounded">
            {activeSlideData.subtitle}
          </p>

          {/* CTA Button Actions - Stacks cleanly on small mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2 sm:pt-3">
            <button
              type="button"
              onClick={() => handleCtaClick(activeSlideData.primaryCtaTab)}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-white font-bold text-xs sm:text-sm rounded-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] min-h-[44px]"
              style={{ backgroundColor: activeSlideData.accentColor }}
            >
              <span>{activeSlideData.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCtaClick(activeSlideData.secondaryCtaTab)}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-semibold text-xs sm:text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer min-h-[44px]"
            >
              {activeSlideData.secondaryCtaText.includes('Video') && (
                <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
              )}
              <span>{activeSlideData.secondaryCtaText}</span>
            </button>
          </div>
        </div>

        {/* Carousel Navigation Bar (Indicators + Prev/Next Controls) */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-3 sm:py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Slide Indicators with Progress bars */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {slides.map((slide, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group text-left transition-all py-1.5 px-2 sm:px-2.5 rounded-md flex items-center gap-1.5 sm:gap-2 border cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent 
                      ? 'bg-slate-100 border-slate-300 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-slate-50'
                  }`}
                  aria-label={`Ir al slide ${idx + 1}: ${slide.title}`}
                >
                  <span className={`text-[11px] sm:text-xs font-mono font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    0{idx + 1}
                  </span>
                  
                  {/* Visual Indicator pill */}
                  <div className="w-8 sm:w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
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

                  <span className="hidden lg:inline text-[11px] font-semibold text-slate-600 truncate max-w-[120px]">
                    {slide.badgeCategory.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={prevSlide}
              className="p-2 sm:p-2.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-colors shadow-sm cursor-pointer"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="p-2 sm:p-2.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-colors shadow-sm cursor-pointer"
              aria-label="Slide siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Column KPI Strip embedded at the bottom of the hero block */}
        <div className="relative z-10 w-full border-t border-slate-200 bg-white">
          <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {content.kpis.map((kpi, kIdx) => (
              <div 
                key={kpi.id} 
                className={`py-4 sm:py-5 ${
                  kIdx === 0 ? 'sm:pr-6' : kIdx === content.kpis.length - 1 ? 'sm:pl-6' : 'sm:px-6'
                }`}
              >
                <span 
                  className="text-xl sm:text-2xl lg:text-3xl font-black font-mono tabular-nums block"
                  style={{ color: kpi.highlightColor || '#0F172A' }}
                >
                  {kpi.value}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 mt-1 block font-medium leading-tight">
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Reference Image Modal */}
      {showFullImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate pr-2">
                <ImageIcon className="w-5 h-5 text-[#38BDF8] shrink-0" />
                <h3 className="text-xs sm:text-base font-bold text-white truncate">
                  {activeSlideData.referenceLabel} · Imagen de Referencia
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFullImageModal(false)}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full max-h-[75vh] flex items-center justify-center bg-black overflow-hidden p-2">
              <img
                src={activeSlideData.bgImageUrl}
                alt={activeSlideData.referenceLabel}
                className="w-full h-auto max-h-[72vh] object-contain rounded"
              />
            </div>
            <div className="px-4 sm:px-6 py-3 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Eje: <strong className="text-white">{activeSlideData.badgeCategory}</strong></span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Cr Dominguez · Consultoría Estratégica & CFO
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate pr-2">
                <Video className="w-5 h-5 text-[#0078D4] shrink-0" />
                <h3 className="text-xs sm:text-base font-bold text-slate-900 truncate">
                  {activeVideoTitle || 'Exposición Ejecutiva · Cr Dominguez'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
            <div className="px-4 sm:px-6 py-3 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <span>
                Disertante: <strong className="text-slate-900">{content.profile.founderName}</strong> · Consultoría Estratégica
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onOpenConsultationModal();
                }}
                className="px-3.5 py-1.5 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold rounded text-xs transition-colors shadow-sm cursor-pointer"
              >
                Solicitar Consulta sobre el Tema
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
