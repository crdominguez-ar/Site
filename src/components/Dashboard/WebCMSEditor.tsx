import React, { useState, useEffect } from 'react';
import { 
  SiteContent, 
  contentService, 
  DEFAULT_SITE_CONTENT,
  SlideContent,
  HomeBlockConfig,
  StrategicAxisContent,
  CaseStudyItem
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
  Eye,
  EyeOff,
  Layers,
  Palette,
  Type,
  Briefcase,
  MoveUp,
  MoveDown,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';

interface WebCMSEditorProps {
  onPreviewSite?: () => void;
}

export const WebCMSEditor: React.FC<WebCMSEditorProps> = ({ onPreviewSite }) => {
  const [content, setContent] = useState<SiteContent>(() => contentService.getContent());
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'hero' | 'axes' | 'case_studies' | 'video' | 'kpis' | 'profile' | 'contact'>('blocks');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeAxisIndex, setActiveAxisIndex] = useState<number>(0);
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
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
    if (window.confirm('¿Seguro que deseas restablecer los textos, bloques y estilos originales de la web?')) {
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

  // Reorder home blocks
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const sorted = [...(content.homeBlocks || [])].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap orders
    const currentOrder = sorted[index].order;
    const targetOrder = sorted[targetIndex].order;
    sorted[index].order = targetOrder;
    sorted[targetIndex].order = currentOrder;

    setContent({ ...content, homeBlocks: [...sorted] });
  };

  const toggleBlock = (id: string) => {
    const updated = (content.homeBlocks || []).map((b) => 
      b.id === id ? { ...b, enabled: !b.enabled } : b
    );
    setContent({ ...content, homeBlocks: updated });
  };

  // Color preset applicator
  const applyPalettePreset = (preset: 'patagonia_deep' | 'obsidian_contrast' | 'azure_executive') => {
    if (preset === 'patagonia_deep') {
      setContent({
        ...content,
        theme: {
          ...content.theme,
          palettePreset: 'patagonia_deep',
          primaryColor: '#0078D4',
          axesBackground: '#080E18',
        },
        axes: (content.axes || []).map((ax, i) => {
          const colors = [
            { bg: '#0D223F', border: '#1D4ED8', tagColor: '#38BDF8', btnColor: '#0078D4' },
            { bg: '#0A3324', border: '#047857', tagColor: '#4ADE80', btnColor: '#107C41' },
            { bg: '#3D1E0C', border: '#B45309', tagColor: '#FBBF24', btnColor: '#D97706' },
            { bg: '#191D45', border: '#4338CA', tagColor: '#818CF8', btnColor: '#4F46E5' },
            { bg: '#291048', border: '#7E22CE', tagColor: '#C084FC', btnColor: '#7C3AED' },
          ];
          const c = colors[i % colors.length];
          return { ...ax, bgColor: c.bg, borderColor: c.border, tagColor: c.tagColor, btnColor: c.btnColor };
        }),
      });
    } else if (preset === 'obsidian_contrast') {
      setContent({
        ...content,
        theme: {
          ...content.theme,
          palettePreset: 'obsidian_contrast',
          primaryColor: '#2563EB',
          axesBackground: '#000000',
        },
        axes: (content.axes || []).map((ax, i) => {
          const colors = [
            { bg: '#111827', border: '#374151', tagColor: '#60A5FA', btnColor: '#2563EB' },
            { bg: '#064E3B', border: '#059669', tagColor: '#34D399', btnColor: '#059669' },
            { bg: '#78350F', border: '#D97706', tagColor: '#FCD34D', btnColor: '#D97706' },
            { bg: '#312E81', border: '#6366F1', tagColor: '#A5B4FC', btnColor: '#6366F1' },
            { bg: '#581C87', border: '#9333EA', tagColor: '#E9D5FF', btnColor: '#9333EA' },
          ];
          const c = colors[i % colors.length];
          return { ...ax, bgColor: c.bg, borderColor: c.border, tagColor: c.tagColor, btnColor: c.btnColor };
        }),
      });
    } else if (preset === 'azure_executive') {
      setContent({
        ...content,
        theme: {
          ...content.theme,
          palettePreset: 'azure_executive',
          primaryColor: '#0284C7',
          axesBackground: '#0F172A',
        },
        axes: (content.axes || []).map((ax, i) => {
          const colors = [
            { bg: '#0369A1', border: '#38BDF8', tagColor: '#BAE6FD', btnColor: '#0284C7' },
            { bg: '#0F766E', border: '#2DD4BF', tagColor: '#CCFBF1', btnColor: '#0D9488' },
            { bg: '#B45309', border: '#FBBF24', tagColor: '#FEF3C7', btnColor: '#D97706' },
            { bg: '#1D4ED8', border: '#60A5FA', tagColor: '#DBEAFE', btnColor: '#2563EB' },
            { bg: '#6D28D9', border: '#A78BFA', tagColor: '#EDE9FE', btnColor: '#7C3AED' },
          ];
          const c = colors[i % colors.length];
          return { ...ax, bgColor: c.bg, borderColor: c.border, tagColor: c.tagColor, btnColor: c.btnColor };
        }),
      });
    }
  };

  const sortedHomeBlocks = [...(content.homeBlocks || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4] mb-1">
            <Sliders className="w-4 h-4" />
            <span>Gestor de Contenido & Diseño Web · CMS Integral</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Control de Secciones, Bloques, Colores y Textos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Administra el orden de los bloques del Home, paletas cromáticas plenas, tipografías, botones y contenidos en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Volver a los contenidos y diseños iniciales"
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
          onClick={() => setActiveTab('blocks')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'blocks'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Estructura & Bloques ({sortedHomeBlocks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('styles')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'styles'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Estilos & Paletas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'hero'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Sliders className="w-4 h-4" />
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
          <span>5 Ejes Bento Blocks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('case_studies')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
            activeTab === 'case_studies'
              ? 'border-[#0078D4] text-[#0078D4] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Casos de Estudio ({content.caseStudies?.length || 0})</span>
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
          <span>Métricas KPI</span>
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

      {/* TAB 1: ESTRUCTURA & BLOQUES DEL HOME */}
      {activeTab === 'blocks' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Arquitectura de Bloques del Home</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Reordena las secciones de la página de inicio o desactiva temporalmente las que no desees mostrar.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-[#0078D4] border border-blue-200 text-xs font-mono font-bold rounded-md">
                {sortedHomeBlocks.filter(b => b.enabled).length} de {sortedHomeBlocks.length} activos
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {sortedHomeBlocks.map((block, idx) => (
              <div 
                key={block.id}
                className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                  block.enabled 
                    ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300' 
                    : 'bg-slate-100/50 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{block.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-600 uppercase font-semibold">
                        id: {block.id}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {block.id === 'hero' && 'Carrusel de cabecera con imágenes, sliders, títulos y llamadas de acción.'}
                      {block.id === 'video' && 'Reproductor interactivo de YouTube con disertación ejecutiva.'}
                      {block.id === 'axes' && 'Cuadrícula Bento con los 5 ejes estratégicos y fondos plenos con alto contraste.'}
                      {block.id === 'case_studies' && 'Casos de estudio reales con KPIs auditados de empresas patagónicas.'}
                      {block.id === 'profile' && 'Presentación institucional del Socio Fundador y marco normativo.'}
                      {block.id === 'diagnostic' && 'Herramienta interactiva de diagnóstico empresarial en 4 etapas.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Move Up Button */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, 'up')}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer"
                    title="Mover hacia arriba"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>

                  {/* Move Down Button */}
                  <button
                    type="button"
                    disabled={idx === sortedHomeBlocks.length - 1}
                    onClick={() => moveBlock(idx, 'down')}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer"
                    title="Mover hacia abajo"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => toggleBlock(block.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      block.enabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {block.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Oculto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ESTILOS, PALETAS & TIPOGRAFÍAS */}
      {activeTab === 'styles' && (
        <div className="space-y-6">
          {/* Typography Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4]">
              <Type className="w-4 h-4" />
              <span>Familia Tipográfica del Home</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Tipografía & Contraste Visual</h3>
            <p className="text-xs text-slate-600">
              Selecciona el tono tipográfico para los títulos, bloques y contenidos del sitio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {[
                { id: 'sans', label: 'Inter Sans', desc: 'Moderna, técnica y ultra legible', sample: 'Cr Dominguez' },
                { id: 'serif', label: 'Editorial Serif', desc: 'Fiduciaria, formal y fidedigna', sample: 'Cr Dominguez' },
                { id: 'mono', label: 'Technical Mono', desc: 'Analítica, de ingeniería y financiera', sample: 'Cr Dominguez' },
                { id: 'geometric', label: 'Sans Geométrica', desc: 'Bloque sólido, contundente y audaz', sample: 'Cr Dominguez' },
              ].map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setContent({ ...content, theme: { ...content.theme, fontFamily: font.id as any } })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    content.theme?.fontFamily === font.id
                      ? 'border-[#0078D4] bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`text-xl font-bold block mb-1 text-slate-900 ${
                    font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'
                  }`}>
                    {font.sample}
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">{font.label}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{font.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius Control */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4]">
              <Layers className="w-4 h-4" />
              <span>Radio de Bordes de Tarjetas & Botones</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Tratamiento de Bordes en Bloques</h3>
            <p className="text-xs text-slate-600">
              Controla si las tarjetas tienen esquinas completamente rectas estilo Bauhaus o sutilmente redondeadas.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {[
                { id: 'none', label: '0px Recto / Sharp', style: 'rounded-none' },
                { id: 'sm', label: '2px Sutil', style: 'rounded-sm' },
                { id: 'md', label: '6px Estándar', style: 'rounded-md' },
                { id: 'lg', label: '8px Suave (Default)', style: 'rounded-lg' },
                { id: 'xl', label: '12px Curvo', style: 'rounded-xl' },
              ].map((rad) => (
                <button
                  key={rad.id}
                  type="button"
                  onClick={() => setContent({ ...content, theme: { ...content.theme, borderRadius: rad.id as any } })}
                  className={`p-3.5 border text-center transition-all cursor-pointer ${rad.style} ${
                    content.theme?.borderRadius === rad.id
                      ? 'border-[#0078D4] bg-blue-50 text-[#0078D4] font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 border-2 border-current mx-auto mb-2 ${rad.style}`} />
                  <span className="text-xs block">{rad.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0078D4]">
              <Palette className="w-4 h-4" />
              <span>Paletas Cromáticas de Bloques Sólidos (Fondos Plenos)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Configuración Cromática de Bloques</h3>
            <p className="text-xs text-slate-600">
              Aplica esquemas prediseñados con fondos plenos y alto contraste, o personaliza colores exactos con selector HEX.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => applyPalettePreset('patagonia_deep')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  content.theme?.palettePreset === 'patagonia_deep'
                    ? 'border-[#0078D4] bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="w-5 h-5 rounded-md bg-[#0D223F] border border-blue-800" />
                  <span className="w-5 h-5 rounded-md bg-[#0A3324] border border-emerald-800" />
                  <span className="w-5 h-5 rounded-md bg-[#3D1E0C] border border-amber-800" />
                  <span className="w-5 h-5 rounded-md bg-[#191D45] border border-indigo-800" />
                  <span className="w-5 h-5 rounded-md bg-[#291048] border border-purple-800" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Patagonia Deep (Predeterminada)</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Azul petróleo, esmeralda, ámbar y amatista con fondos oscuros sólidos.</span>
              </button>

              <button
                type="button"
                onClick={() => applyPalettePreset('obsidian_contrast')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  content.theme?.palettePreset === 'obsidian_contrast'
                    ? 'border-[#0078D4] bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="w-5 h-5 rounded-md bg-[#111827] border border-slate-700" />
                  <span className="w-5 h-5 rounded-md bg-[#064E3B] border border-emerald-700" />
                  <span className="w-5 h-5 rounded-md bg-[#78350F] border border-amber-700" />
                  <span className="w-5 h-5 rounded-md bg-[#312E81] border border-indigo-700" />
                  <span className="w-5 h-5 rounded-md bg-[#581C87] border border-purple-700" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Obsidiana & Contraste Máximo</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Fondo negro absoluto #000000 con acentos de neón saturados.</span>
              </button>

              <button
                type="button"
                onClick={() => applyPalettePreset('azure_executive')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  content.theme?.palettePreset === 'azure_executive'
                    ? 'border-[#0078D4] bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="w-5 h-5 rounded-md bg-[#0369A1] border border-sky-600" />
                  <span className="w-5 h-5 rounded-md bg-[#0F766E] border border-teal-600" />
                  <span className="w-5 h-5 rounded-md bg-[#B45309] border border-amber-600" />
                  <span className="w-5 h-5 rounded-md bg-[#1D4ED8] border border-blue-600" />
                  <span className="w-5 h-5 rounded-md bg-[#6D28D9] border border-purple-600" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Azure Ejecutivo Fiduciario</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Tonos zafiro y cian corporativo con fondos pizarra #0F172A.</span>
              </button>
            </div>

            {/* Custom Color Overrides */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Color de Fondo Sección Bento Ejes
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme?.axesBackground || '#080E18'}
                    onChange={(e) => setContent({ ...content, theme: { ...content.theme, axesBackground: e.target.value } })}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={content.theme?.axesBackground || '#080E18'}
                    onChange={(e) => setContent({ ...content, theme: { ...content.theme, axesBackground: e.target.value } })}
                    className="text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 w-32"
                  />
                  <span className="text-xs text-slate-500">Color de lienzo general de los 5 ejes</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Color Primario de Marca
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content.theme?.primaryColor || '#0078D4'}
                    onChange={(e) => setContent({ ...content, theme: { ...content.theme, primaryColor: e.target.value } })}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={content.theme?.primaryColor || '#0078D4'}
                    onChange={(e) => setContent({ ...content, theme: { ...content.theme, primaryColor: e.target.value } })}
                    className="text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 w-32"
                  />
                  <span className="text-xs text-slate-500">Color institucional para botones y enlaces</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HERO & SLIDERS */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Carousel Slide Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {content.heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSlideIndex === idx
                    ? 'bg-[#0078D4] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Slide #{idx + 1}</span>
                <span className="text-[10px] font-normal opacity-80 truncate max-w-[120px]">
                  {slide.badgeCategory.split('&')[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Edición de Contenido · Slide #{activeSlideIndex + 1}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría / Badge
                  </label>
                  <input
                    type="text"
                    value={content.heroSlides[activeSlideIndex]?.badgeCategory || ''}
                    onChange={(e) => updateSlideField('badgeCategory', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ubicación / Cobertura
                  </label>
                  <input
                    type="text"
                    value={content.heroSlides[activeSlideIndex]?.badgeLocation || ''}
                    onChange={(e) => updateSlideField('badgeLocation', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Principal del Slide
                </label>
                <textarea
                  rows={2}
                  value={content.heroSlides[activeSlideIndex]?.title || ''}
                  onChange={(e) => updateSlideField('title', e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtítulo / Bajada Descriptiva
                </label>
                <textarea
                  rows={3}
                  value={content.heroSlides[activeSlideIndex]?.subtitle || ''}
                  onChange={(e) => updateSlideField('subtitle', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Botones CTA */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Botón Primario (Texto)
                  </label>
                  <input
                    type="text"
                    value={content.heroSlides[activeSlideIndex]?.primaryCtaText || ''}
                    onChange={(e) => updateSlideField('primaryCtaText', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Botón Secundario (Texto)
                  </label>
                  <input
                    type="text"
                    value={content.heroSlides[activeSlideIndex]?.secondaryCtaText || ''}
                    onChange={(e) => updateSlideField('secondaryCtaText', e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Slide Background Image Picker & Presets */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Imagen de Fondo del Slide
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  URL Directa de la Imagen
                </label>
                <input
                  type="text"
                  value={content.heroSlides[activeSlideIndex]?.bgImageUrl || ''}
                  onChange={(e) => updateSlideField('bgImageUrl', e.target.value)}
                  placeholder="https://... o ruta local"
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pie de Referencia de Imagen
                </label>
                <input
                  type="text"
                  value={content.heroSlides[activeSlideIndex]?.referenceLabel || ''}
                  onChange={(e) => updateSlideField('referenceLabel', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Preview Box */}
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 relative group bg-slate-900">
                <img
                  src={content.heroSlides[activeSlideIndex]?.bgImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-mono text-white/90 truncate">
                    {content.heroSlides[activeSlideIndex]?.referenceLabel || 'Sin descripción'}
                  </span>
                </div>
              </div>

              {/* Image Presets */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Seleccionar de la Galería de Presets:
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {imagePresets.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        updateSlideField('bgImageUrl', preset.url);
                        updateSlideField('referenceLabel', preset.label);
                      }}
                      className="p-1.5 border border-slate-200 hover:border-[#0078D4] rounded-lg text-left transition-all group bg-slate-50 cursor-pointer"
                    >
                      <div className="aspect-video w-full rounded overflow-hidden mb-1 bg-slate-200">
                        <img src={preset.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[10px] font-medium text-slate-700 line-clamp-1 block">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 5 EJES BENTO BLOCKS */}
      {activeTab === 'axes' && (
        <div className="space-y-6">
          {/* Section Headers Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Encabezado de la Sección de Ejes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Etiqueta Superior (Badge)</label>
                <input
                  type="text"
                  value={content.homeSectionHeaders?.axesBadge || 'Cinco Divisiones Especializadas'}
                  onChange={(e) => setContent({
                    ...content,
                    homeSectionHeaders: { ...content.homeSectionHeaders, axesBadge: e.target.value }
                  })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Sección</label>
                <input
                  type="text"
                  value={content.homeSectionHeaders?.axesTitle || 'Arquitectura de Soluciones Estratégicas'}
                  onChange={(e) => setContent({
                    ...content,
                    homeSectionHeaders: { ...content.homeSectionHeaders, axesTitle: e.target.value }
                  })}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bajada Descriptiva</label>
              <textarea
                rows={2}
                value={content.homeSectionHeaders?.axesSubtitle || ''}
                onChange={(e) => setContent({
                  ...content,
                  homeSectionHeaders: { ...content.homeSectionHeaders, axesSubtitle: e.target.value }
                })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Sub-selector for individual axis */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(content.axes || []).map((axis, idx) => (
              <button
                key={axis.id}
                type="button"
                onClick={() => setActiveAxisIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeAxisIndex === idx
                    ? 'bg-[#0078D4] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{axis.number}</span>
                <span className="truncate max-w-[130px] font-normal">{axis.category}</span>
              </button>
            ))}
          </div>

          {/* Active Axis Editor */}
          {content.axes?.[activeAxisIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form on left */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Detalles del Eje #{content.axes[activeAxisIndex].number} · {content.axes[activeAxisIndex].category}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Eje</label>
                    <input
                      type="text"
                      value={content.axes[activeAxisIndex].number}
                      onChange={(e) => {
                        const updated = [...content.axes];
                        updated[activeAxisIndex].number = e.target.value;
                        setContent({ ...content, axes: updated });
                      }}
                      className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                    <input
                      type="text"
                      value={content.axes[activeAxisIndex].category}
                      onChange={(e) => {
                        const updated = [...content.axes];
                        updated[activeAxisIndex].category = e.target.value;
                        setContent({ ...content, axes: updated });
                      }}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Solución</label>
                  <input
                    type="text"
                    value={content.axes[activeAxisIndex].title}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[activeAxisIndex].title = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    value={content.axes[activeAxisIndex].description}
                    onChange={(e) => {
                      const updated = [...content.axes];
                      updated[activeAxisIndex].description = e.target.value;
                      setContent({ ...content, axes: updated });
                    }}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                {/* Key aspects bullets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700">Aspectos Clave (Viñetas)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...content.axes];
                        updated[activeAxisIndex].keyAspects = [...(updated[activeAxisIndex].keyAspects || []), 'Nuevo aspecto clave'];
                        setContent({ ...content, axes: updated });
                      }}
                      className="text-[11px] font-bold text-[#0078D4] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar aspecto</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(content.axes[activeAxisIndex].keyAspects || []).map((asp, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-xs">■</span>
                        <input
                          type="text"
                          value={asp}
                          onChange={(e) => {
                            const updated = [...content.axes];
                            const aspects = [...updated[activeAxisIndex].keyAspects];
                            aspects[aIdx] = e.target.value;
                            updated[activeAxisIndex].keyAspects = aspects;
                            setContent({ ...content, axes: updated });
                          }}
                          className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...content.axes];
                            updated[activeAxisIndex].keyAspects = updated[activeAxisIndex].keyAspects.filter((_, i) => i !== aIdx);
                            setContent({ ...content, axes: updated });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                          title="Eliminar aspecto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button Settings */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Texto del Botón CTA</label>
                    <input
                      type="text"
                      value={content.axes[activeAxisIndex].ctaLabel}
                      onChange={(e) => {
                        const updated = [...content.axes];
                        updated[activeAxisIndex].ctaLabel = e.target.value;
                        setContent({ ...content, axes: updated });
                      }}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Destino del Clic</label>
                    <select
                      value={content.axes[activeAxisIndex].ctaTab}
                      onChange={(e) => {
                        const updated = [...content.axes];
                        updated[activeAxisIndex].ctaTab = e.target.value as any;
                        setContent({ ...content, axes: updated });
                      }}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="solutions">Soluciones y Servicios</option>
                      <option value="simulators">Simuladores Financieros</option>
                      <option value="diagnostic">Diagnóstico Empresarial</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Color Customizer on right */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Colores del Bloque Bento Sólido
                </h3>
                <p className="text-xs text-slate-500">
                  Define el color pleno de fondo, bordes, etiquetas y botón para este eje específico.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color de Fondo Pleno (Solid)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.axes[activeAxisIndex].bgColor || '#0D223F'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].bgColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={content.axes[activeAxisIndex].bgColor || '#0D223F'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].bgColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color de Borde de la Tarjeta</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.axes[activeAxisIndex].borderColor || '#1D4ED8'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].borderColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={content.axes[activeAxisIndex].borderColor || '#1D4ED8'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].borderColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color de Etiqueta & Resaltado</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.axes[activeAxisIndex].tagColor || '#38BDF8'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].tagColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={content.axes[activeAxisIndex].tagColor || '#38BDF8'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].tagColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color del Botón de Acción</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.axes[activeAxisIndex].btnColor || '#0078D4'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].btnColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={content.axes[activeAxisIndex].btnColor || '#0078D4'}
                        onChange={(e) => {
                          const updated = [...content.axes];
                          updated[activeAxisIndex].btnColor = e.target.value;
                          setContent({ ...content, axes: updated });
                        }}
                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Card Preview */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono block mb-2">Previsualización del Bloque:</span>
                  <div 
                    style={{
                      backgroundColor: content.axes[activeAxisIndex].bgColor || '#0D223F',
                      borderColor: content.axes[activeAxisIndex].borderColor || '#1D4ED8'
                    }}
                    className="p-4 rounded-xl border text-white space-y-2 shadow-inner"
                  >
                    <span 
                      style={{ color: content.axes[activeAxisIndex].tagColor || '#38BDF8' }}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider block"
                    >
                      {content.axes[activeAxisIndex].number} · {content.axes[activeAxisIndex].category}
                    </span>
                    <h5 className="text-sm font-bold leading-tight">
                      {content.axes[activeAxisIndex].title}
                    </h5>
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {content.axes[activeAxisIndex].description}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <span 
                        style={{ backgroundColor: content.axes[activeAxisIndex].btnColor || '#0078D4' }}
                        className="px-2.5 py-1 text-[10px] font-bold rounded text-white"
                      >
                        {content.axes[activeAxisIndex].ctaLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CASOS DE ESTUDIO */}
      {activeTab === 'case_studies' && (
        <div className="space-y-6">
          {/* Header config */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Encabezado de Casos de Estudio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Etiqueta Superior (Badge)</label>
                <input
                  type="text"
                  value={content.homeSectionHeaders?.caseStudiesBadge || 'Resultados Comprobados & Auditorías Reales'}
                  onChange={(e) => setContent({
                    ...content,
                    homeSectionHeaders: { ...content.homeSectionHeaders, caseStudiesBadge: e.target.value }
                  })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Sección</label>
                <input
                  type="text"
                  value={content.homeSectionHeaders?.caseStudiesTitle || 'Impacto Cuantitativo en Empresas Patagónicas'}
                  onChange={(e) => setContent({
                    ...content,
                    homeSectionHeaders: { ...content.homeSectionHeaders, caseStudiesTitle: e.target.value }
                  })}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bajada Descriptiva</label>
              <textarea
                rows={2}
                value={content.homeSectionHeaders?.caseStudiesSubtitle || ''}
                onChange={(e) => setContent({
                  ...content,
                  homeSectionHeaders: { ...content.homeSectionHeaders, caseStudiesSubtitle: e.target.value }
                })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Sub-selector for cases */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(content.caseStudies || []).map((study, idx) => (
              <button
                key={study.id}
                type="button"
                onClick={() => setActiveCaseIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeCaseIndex === idx
                    ? 'bg-[#0078D4] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Caso #{idx + 1}</span>
                <span className="truncate max-w-[130px] font-normal">{study.tag}</span>
              </button>
            ))}
          </div>

          {/* Active Case Editor */}
          {content.caseStudies?.[activeCaseIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Edición de Caso de Estudio #{activeCaseIndex + 1}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Etiqueta de Sector & Región</label>
                  <input
                    type="text"
                    value={content.caseStudies[activeCaseIndex].tag}
                    onChange={(e) => {
                      const updated = [...content.caseStudies];
                      updated[activeCaseIndex].tag = e.target.value;
                      setContent({ ...content, caseStudies: updated });
                    }}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Caso</label>
                  <input
                    type="text"
                    value={content.caseStudies[activeCaseIndex].title}
                    onChange={(e) => {
                      const updated = [...content.caseStudies];
                      updated[activeCaseIndex].title = e.target.value;
                      setContent({ ...content, caseStudies: updated });
                    }}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Desafío e Impacto</label>
                  <textarea
                    rows={3}
                    value={content.caseStudies[activeCaseIndex].description}
                    onChange={(e) => {
                      const updated = [...content.caseStudies];
                      updated[activeCaseIndex].description = e.target.value;
                      setContent({ ...content, caseStudies: updated });
                    }}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Métrica Auditada Cuantitativa</label>
                    <input
                      type="text"
                      value={content.caseStudies[activeCaseIndex].metric}
                      onChange={(e) => {
                        const updated = [...content.caseStudies];
                        updated[activeCaseIndex].metric = e.target.value;
                        setContent({ ...content, caseStudies: updated });
                      }}
                      className="w-full text-sm font-black font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Etiqueta de la Métrica</label>
                    <input
                      type="text"
                      value={content.caseStudies[activeCaseIndex].metricLabel}
                      onChange={(e) => {
                        const updated = [...content.caseStudies];
                        updated[activeCaseIndex].metricLabel = e.target.value;
                        setContent({ ...content, caseStudies: updated });
                      }}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Color Customizer on right */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Colores del Bloque de Caso
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color de Fondo Pleno</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.caseStudies[activeCaseIndex].bgColor || '#0D223F'}
                        onChange={(e) => {
                          const updated = [...content.caseStudies];
                          updated[activeCaseIndex].bgColor = e.target.value;
                          setContent({ ...content, caseStudies: updated });
                        }}
                        className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={content.caseStudies[activeCaseIndex].bgColor || '#0D223F'}
                        onChange={(e) => {
                          const updated = [...content.caseStudies];
                          updated[activeCaseIndex].bgColor = e.target.value;
                          setContent({ ...content, caseStudies: updated });
                        }}
                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color de Resalte Métrica & Tag</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.caseStudies[activeCaseIndex].metricColor || '#38BDF8'}
                        onChange={(e) => {
                          const updated = [...content.caseStudies];
                          updated[activeCaseIndex].metricColor = e.target.value;
                          updated[activeCaseIndex].tagColor = e.target.value;
                          setContent({ ...content, caseStudies: updated });
                        }}
                        className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={content.caseStudies[activeCaseIndex].metricColor || '#38BDF8'}
                        onChange={(e) => {
                          const updated = [...content.caseStudies];
                          updated[activeCaseIndex].metricColor = e.target.value;
                          updated[activeCaseIndex].tagColor = e.target.value;
                          setContent({ ...content, caseStudies: updated });
                        }}
                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono block mb-2">Previsualización de Tarjeta:</span>
                  <div 
                    style={{
                      backgroundColor: content.caseStudies[activeCaseIndex].bgColor || '#0D223F',
                      borderColor: content.caseStudies[activeCaseIndex].borderColor || '#1D4ED8'
                    }}
                    className="p-4 rounded-xl border text-white space-y-3 shadow-inner"
                  >
                    <span 
                      style={{ color: content.caseStudies[activeCaseIndex].tagColor || '#38BDF8' }}
                      className="px-2 py-0.5 bg-black/40 rounded text-[10px] font-mono font-bold uppercase tracking-wider inline-block"
                    >
                      {content.caseStudies[activeCaseIndex].tag}
                    </span>
                    <h5 className="text-sm font-bold leading-tight">
                      {content.caseStudies[activeCaseIndex].title}
                    </h5>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">
                        {content.caseStudies[activeCaseIndex].metricLabel}
                      </span>
                      <div 
                        style={{ color: content.caseStudies[activeCaseIndex].metricColor || '#38BDF8' }}
                        className="text-xl font-black font-mono"
                      >
                        {content.caseStudies[activeCaseIndex].metric}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: VIDEO YOUTUBE EDITOR */}
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

      {/* TAB 7: INDICADORES KPI */}
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

      {/* TAB 8: PERFIL Y MANIFIESTO */}
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

      {/* TAB 9: CONTACTO & WHATSAPP */}
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
