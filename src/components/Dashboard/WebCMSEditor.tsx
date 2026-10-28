import React, { useState, useEffect } from 'react';
import { 
  SiteContent, 
  contentService, 
  DEFAULT_SITE_CONTENT,
  SlideContent 
} from '../../lib/contentService';
import { 
  Save, 
  RotateCcw, 
  Sliders, 
  FileText, 
  Video, 
  BarChart3, 
  User, 
  PhoneCall, 
  CheckCircle2, 
  ExternalLink, 
  Image as ImageIcon,
  Sparkles,
  Eye,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface WebCMSEditorProps {
  onPreviewSite?: () => void;
}

export const WebCMSEditor: React.FC<WebCMSEditorProps> = ({ onPreviewSite }) => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());
  const [activeTab, setActiveTab] = useState<'hero' | 'axes' | 'video' | 'kpis' | 'profile' | 'contact'>('hero');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = contentService.subscribe((updated) => setContent(updated));
    return () => unsub();
  }, []);

  const handleSave = () => {
    contentService.saveContent(content);
    setSaveStatus('¡Cambios guardados con éxito! El sitio web ya refleja tus modificaciones.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas restablecer los textos e imágenes originales de la web?')) {
      const reset = contentService.resetToDefaults();
      setContent(reset);
      setSaveStatus('Se restablecieron los contenidos por defecto.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Preset curated high-resolution images for fast selection
  const imagePresets = [
    { label: 'Sala de Directorio (Local)', url: DEFAULT_SITE_CONTENT.heroSlides[0].bgImageUrl },
    { label: 'Polo Industrial Patagónico (Local)', url: DEFAULT_SITE_CONTENT.heroSlides[1].bgImageUrl },
    { label: 'Consultoría & Franquicias (Local)', url: DEFAULT_SITE_CONTENT.heroSlides[2].bgImageUrl },
    { label: 'Hub Fintech & IA (Local)', url: DEFAULT_SITE_CONTENT.heroSlides[3].bgImageUrl },
    { label: 'Rascacielos Corporativo & Finanzas', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80' },
    { label: 'Reunión Ejecutiva de Socios', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1800&q=80' },
    { label: 'Puerto & Logística de Cargas', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=80' },
    { label: 'Tecnología & Datos Financieros', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80' },
  ];

  const updateSlideField = (field: keyof SlideContent, value: any) => {
    const newSlides = [...content.heroSlides];
    newSlides[activeSlideIndex] = {
      ...newSlides[activeSlideIndex],
      [field]: value,
    };
    setContent({ ...content, heroSlides: newSlides });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-1">
            <Sliders className="w-4 h-4" />
            <span>Gestor de Contenido Web · CMS Integral</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Control de Secciones, Imágenes y Textos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Modifica en tiempo real los sliders, títulos, servicios, videos y datos de contacto de toda la plataforma sin tocar código.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Volver a los contenidos iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          {onPreviewSite && (
            <button
              type="button"
              onClick={onPreviewSite}
              className="px-3.5 py-2 text-xs font-semibold text-[#0078D4] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Web en Vivo</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Navigation Tabs for CMS Sections */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'hero'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hero & Sliders ({content.heroSlides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('axes')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'axes'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5 Ejes Estratégicos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'video'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video de YouTube</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'kpis'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Indicadores KPI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'profile'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil & Manifiesto</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'contact'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Contacto & WhatsApp</span>
        </button>
      </div>

      {/* TAB 1: HERO & SLIDERS EDITOR */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Slide selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {content.heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeSlideIndex === idx
                    ? 'bg-[#0078D4] text-white border-[#0078D4] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slide.accentColor }} />
                <span>Slide 0{idx + 1}: {slide.badgeCategory.split('&')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Slide Form & Live Visual Card */}
          {content.heroSlides[activeSlideIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Column */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Editando Slide 0{activeSlideIndex + 1}: {content.heroSlides[activeSlideIndex].title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">ID: {content.heroSlides[activeSlideIndex].id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Categoría / Eje (Eyebrow Badge)
                    </label>
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].badgeCategory}
                      onChange={(e) => updateSlideField('badgeCategory', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ubicación / Cobertura
                    </label>
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].badgeLocation}
                      onChange={(e) => updateSlideField('badgeLocation', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal del Slide (H1)
                  </label>
                  <input
                    type="text"
                    value={content.heroSlides[activeSlideIndex].title}
                    onChange={(e) => updateSlideField('title', e.target.value)}
                    className="w-full text-sm font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bajada / Subtítulo Explicativo
                  </label>
                  <textarea
                    rows={3}
                    value={content.heroSlides[activeSlideIndex].subtitle}
                    onChange={(e) => updateSlideField('subtitle', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Texto Botón Principal (CTA)
                    </label>
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].primaryCtaText}
                      onChange={(e) => updateSlideField('primaryCtaText', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Texto Botón Secundario
                    </label>
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].secondaryCtaText}
                      onChange={(e) => updateSlideField('secondaryCtaText', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] text-slate-900"
                    />
                  </div>
                </div>

                {/* Background Image Selection */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Imagen de Fondo de Referencia
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].bgImageUrl}
                      onChange={(e) => updateSlideField('bgImageUrl', e.target.value)}
                      placeholder="URL de la imagen (o selecciona un preset abajo)..."
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block mb-1.5">
                      Presets recomendados en alta definición:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {imagePresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => updateSlideField('bgImageUrl', preset.url)}
                          className="text-left text-[11px] p-2 rounded border border-slate-200 hover:border-[#0078D4] bg-slate-50 hover:bg-blue-50 transition-colors truncate font-medium text-slate-700"
                          title={preset.label}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Etiqueta de la Foto (Insignia de Referencia)
                    </label>
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].referenceLabel}
                      onChange={(e) => updateSlideField('referenceLabel', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] text-slate-900"
                    />
                  </div>
                </div>

                {/* Color & Video */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Color de Acento del Slide
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.heroSlides[activeSlideIndex].accentColor}
                        onChange={(e) => updateSlideField('accentColor', e.target.value)}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={content.heroSlides[activeSlideIndex].accentColor}
                        onChange={(e) => updateSlideField('accentColor', e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ID de Video de YouTube
                    </label>
                    <input
                      type="text"
                      value={content.heroSlides[activeSlideIndex].videoSrc}
                      onChange={(e) => updateSlideField('videoSrc', e.target.value)}
                      placeholder="Ej. dQw4w9WgXcQ"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0078D4] font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-lg border border-slate-800">
                  <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">Previsualización en Vivo</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={content.heroSlides[activeSlideIndex].bgImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent p-5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white inline-block"
                          style={{ backgroundColor: content.heroSlides[activeSlideIndex].accentColor }}
                        >
                          {content.heroSlides[activeSlideIndex].badgeCategory}
                        </span>
                        <h4 className="text-base font-extrabold text-white leading-tight mt-1 line-clamp-2">
                          {content.heroSlides[activeSlideIndex].title}
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {content.heroSlides[activeSlideIndex].subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <span 
                          className="px-3 py-1 rounded text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: content.heroSlides[activeSlideIndex].accentColor }}
                        >
                          {content.heroSlides[activeSlideIndex].primaryCtaText}
                        </span>
                        <span className="px-3 py-1 rounded text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                          {content.heroSlides[activeSlideIndex].secondaryCtaText}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-[10px] text-white font-mono flex items-center gap-1 backdrop-blur-xs">
                      <ImageIcon className="w-3 h-3 text-sky-400" />
                      <span>{content.heroSlides[activeSlideIndex].referenceLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-600">
                  <span className="font-bold text-slate-800 block">💡 Consejo de diseño:</span>
                  <p>
                    Puedes usar tanto las fotos de referencia locales de la firma como URLs directas de Unsplash o cualquier servidor de imágenes corporativas. Las proporciones panorámicas (16:9) se adaptan de forma óptima en móviles y monitores ultrawide.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EJES ESTRATÉGICOS EDITOR */}
      {activeTab === 'axes' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
            Aquí puedes personalizar la redacción de los 5 pilares de asesoría que se muestran en la sección principal y en el explorador de soluciones.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.axes.map((axis, aIdx) => (
              <div key={axis.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-500">Eje {axis.number}</span>
                  <input
                    type="color"
                    value={axis.accentColor}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[aIdx].accentColor = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-6 h-6 rounded cursor-pointer border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Categoría</label>
                  <input
                    type="text"
                    value={axis.category}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[aIdx].category = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Título del Eje</label>
                  <input
                    type="text"
                    value={axis.title}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[aIdx].title = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-full text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Descripción</label>
                  <textarea
                    rows={3}
                    value={axis.description}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[aIdx].description = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Etiqueta Botón</label>
                  <input
                    type="text"
                    value={axis.ctaLabel}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[aIdx].ctaLabel = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO YOUTUBE EDITOR */}
      {activeTab === 'video' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-4xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Configuración de la Sección de Video Conferencia</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ID o URL de YouTube
              </label>
              <input
                type="text"
                value={content.videoSection.youtubeId}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  if (val.includes('youtube.com/watch?v=')) val = val.split('v=')[1]?.split('&')[0] || val;
                  if (val.includes('youtu.be/')) val = val.split('youtu.be/')[1]?.split('?')[0] || val;
                  setContent({
                    ...content,
                    videoSection: { ...content.videoSection, youtubeId: val },
                  });
                }}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                ID actual: <strong>{content.videoSection.youtubeId}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disertante / Autor
              </label>
              <input
                type="text"
                value={content.videoSection.presenterName}
                onChange={(e) =>
                  setContent({
                    ...content,
                    videoSection: { ...content.videoSection, presenterName: e.target.value },
                  })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título de la Exposición
            </label>
            <input
              type="text"
              value={content.videoSection.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  videoSection: { ...content.videoSection, title: e.target.value },
                })
              }
              className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sinopsis del Video
            </label>
            <textarea
              rows={3}
              value={content.videoSection.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  videoSection: { ...content.videoSection, subtitle: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          {/* Video Preview */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-700 block mb-2">Previsualización del Reproductor:</span>
            <div className="aspect-video w-full max-w-xl rounded-xl overflow-hidden border border-slate-300 bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${content.videoSection.youtubeId}`}
                title="Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INDICADORES KPI */}
      {activeTab === 'kpis' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Franja de Métricas y KPIs de la Portada</h3>
          <p className="text-xs text-slate-600">
            Edita las 4 cifras destacadas que se muestran debajo del carrusel principal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {content.kpis.map((kpi, kIdx) => (
              <div key={kpi.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 block">Métrica #{kIdx + 1}</span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Valor Destacado</label>
                  <input
                    type="text"
                    value={kpi.value}
                    onChange={(e) => {
                      const updated = [...content.kpis];
                      updated[kIdx].value = e.target.value;
                      setContent({ ...content, kpis: updated });
                    }}
                    className="w-full text-base font-black px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Descripción</label>
                  <textarea
                    rows={2}
                    value={kpi.label}
                    onChange={(e) => {
                      const updated = [...content.kpis];
                      updated[kIdx].label = e.target.value;
                      setContent({ ...content, kpis: updated });
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PERFIL Y MANIFIESTO */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Perfil Directivo & Manifiesto Profesional</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Titular</label>
            <input
              type="text"
              value={content.profile.founderName}
              onChange={(e) =>
                setContent({ ...content, profile: { ...content.profile, founderName: e.target.value } })
              }
              className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cita / Frase de Cabecera</label>
            <input
              type="text"
              value={content.profile.quote}
              onChange={(e) =>
                setContent({ ...content, profile: { ...content.profile, quote: e.target.value } })
              }
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Manifiesto Estratégico</label>
            <textarea
              rows={4}
              value={content.profile.manifesto}
              onChange={(e) =>
                setContent({ ...content, profile: { ...content.profile, manifesto: e.target.value } })
              }
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Matrícula & Consejo</label>
              <input
                type="text"
                value={content.profile.matricula}
                onChange={(e) =>
                  setContent({ ...content, profile: { ...content.profile, matricula: e.target.value } })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marco Normativo</label>
              <input
                type="text"
                value={content.profile.jurisdiction}
                onChange={(e) =>
                  setContent({ ...content, profile: { ...content.profile, jurisdiction: e.target.value } })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CONTACTO & WHATSAPP */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Datos de Contacto, WhatsApp y Sede</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp (con código de país, sin espacios)
              </label>
              <input
                type="text"
                value={content.contact.whatsappNumber}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, whatsappNumber: e.target.value },
                  })
                }
                placeholder="5492804567890"
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Oficial de Contacto
              </label>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value },
                  })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mensaje Predefinido de WhatsApp
            </label>
            <textarea
              rows={2}
              value={content.contact.whatsappDefaultText}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, whatsappDefaultText: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ubicación / Sede
              </label>
              <input
                type="text"
                value={content.contact.address}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, address: e.target.value },
                  })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Horario de Atención
              </label>
              <input
                type="text"
                value={content.contact.schedule}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, schedule: e.target.value },
                  })
                }
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
