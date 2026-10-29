import React, { useState, useEffect } from 'react';
import { BlogPost, BlogCategory } from '../../types';
import { blogService } from '../../lib/blogService';
import { 
  X, Video, Image as ImageIcon, Send, Sparkles, CheckCircle2, 
  AlertCircle, Globe, Search, Tag, FileText, Check, Loader2,
  Headphones, RefreshCw, Eye, ExternalLink, HelpCircle
} from 'lucide-react';

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: BlogPost | null;
  onSaved?: (post: BlogPost) => void;
}

const PRESET_IMAGES = [
  {
    id: 'boardroom',
    label: 'Sala de Directorio & Finanzas',
    url: '/src/assets/images/strategic_financial_boardroom_1793059909387.jpg',
  },
  {
    id: 'tech_hub',
    label: 'Tecnología, IA & Fintech Hub',
    url: '/src/assets/images/digital_ai_fintech_hub_1793065898721.jpg',
  },
  {
    id: 'patagonia_industry',
    label: 'Industria & Logística Patagónica',
    url: '/src/assets/images/patagonia_industry_logistics_1793065886236.jpg',
  },
  {
    id: 'consultancy',
    label: 'Consultoría & Estrategia Corporativa',
    url: '/src/assets/images/hero_patagonia_consultancy_1793059908678.jpg',
  },
];

const CATEGORIES: BlogCategory[] = [
  'Tributario',
  'Finanzas & CFO',
  'Franquicias',
  'Economía del Conocimiento',
  'Empresas 100% IA',
];

export const BlogEditorModal: React.FC<BlogEditorModalProps> = ({
  isOpen,
  onClose,
  postToEdit,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'seo' | 'preview'>('content');

  // Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Tributario');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Cr. Carlos Rodrigo Domínguez');
  
  // Media fields
  const [featuredImage, setFeaturedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState('');

  // SEO fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Patagonia', 'Estrategia']);

  // Notifications & Submission
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize or reset when opening/editing
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setSlug(postToEdit.slug);
      setCategory(postToEdit.category);
      setExcerpt(postToEdit.excerpt);
      setContent(postToEdit.content);
      setAuthor(postToEdit.author);
      setFeaturedImage(postToEdit.featuredImage);
      setCustomImageUrl(postToEdit.featuredImage.startsWith('http') ? postToEdit.featuredImage : '');
      setYoutubeVideoUrl(postToEdit.videoUrl || (postToEdit.youtubeVideoId ? `https://www.youtube.com/watch?v=export${postToEdit.youtubeVideoId}` : ''));
      setSpotifyEmbedUrl(postToEdit.spotifyEmbedUrl || '');
      setTags(postToEdit.tags || []);
      setSeoTitle(postToEdit.seoTitle || postToEdit.title);
      setSeoDescription(postToEdit.seoDescription || postToEdit.excerpt);
    } else {
      setTitle('');
      setSlug('');
      setCategory('Tributario');
      setExcerpt('');
      setContent('');
      setAuthor('Cr. Carlos Rodrigo Domínguez');
      setFeaturedImage(PRESET_IMAGES[0].url);
      setCustomImageUrl('');
      setYoutubeVideoUrl('');
      setSpotifyEmbedUrl('');
      setTags(['Patagonia', 'Finanzas', 'AFIP', 'Estrategia']);
      setSeoTitle('');
      setSeoDescription('');
    }
    setActiveTab('content');
    setFeedback(null);
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug when title changes if slug is empty or matches previous auto
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!postToEdit) {
      setSlug(blogService.generateSlug(val));
      if (!seoTitle) {
        setSeoTitle(val);
      }
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleInsertFormat = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}Texto aquí${suffix}\n`);
  };

  const detectedYouTubeId = blogService.extractYouTubeId(youtubeVideoUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setActiveTab('content');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const finalImage = customImageUrl.trim() || featuredImage;
      const result = await blogService.savePost({
        id: postToEdit?.id,
        title,
        slug: slug.trim() || blogService.generateSlug(title),
        excerpt: excerpt.trim() || content.trim().slice(0, 160) + '...',
        content,
        category,
        author,
        featuredImage: finalImage,
        youtubeVideoUrl: youtubeVideoUrl.trim(),
        spotifyEmbedUrl: spotifyEmbedUrl.trim(),
        tags: tags.length > 0 ? tags : [category, 'Patagonia'],
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || (excerpt.trim() || content.trim().slice(0, 155)),
        seoKeywords: tags,
        notifySubscribers: notifySubscribers && !postToEdit, // only send on new posts
      });

      setFeedback(
        postToEdit 
          ? '¡Artículo y metadatos SEO actualizados con éxito!' 
          : `¡Artículo publicado con éxito!${result.emailResult ? ' Se despachó newsletter por Resend.' : ''}`
      );

      if (onSaved) {
        onSaved(result.post);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setFeedback(`Error: ${err.message || 'No se pudo guardar el artículo'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto relative my-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4]">
              <Sparkles className="w-4 h-4" />
              <span>Redacción Editorial & Content Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {postToEdit ? 'Editar Artículo & Dictamen Técnico' : 'Redactar Nuevo Artículo para el Blog'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configura título, cuerpo, multimedia (foto y video de YouTube) y etiquetas SEO para Google.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-blue-50 text-[#0078D4] border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Título & Cuerpo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'media'
                ? 'bg-blue-50 text-[#0078D4] border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>2. Foto & Video</span>
            {detectedYouTubeId && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-blue-50 text-[#0078D4] border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. SEO & Etiquetas</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px]">
              {tags.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-blue-50 text-[#0078D4] border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>4. Vista Previa</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TAB 1: Content & Structure */}
          {activeTab === 'content' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Título del Artículo *
                  </label>
                  <span className={`text-[11px] font-mono ${title.length > 70 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {title.length} caracteres
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ej. Franquicias bajo la lupa del CCyC: Los 6 riesgos de la Circular de Oferta"
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#0078D4] focus:outline-none"
                />
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Categoría / Eje Temático *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Firma del Autor
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Cr. Carlos Rodrigo Domínguez"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Resumen Ejecutivo / Bajada (Aparece en la tarjeta del blog)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Síntesis de 2 a 3 líneas del dictamen o análisis para captar el interés de decisores empresariales..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Content Body with quick formatting bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Cuerpo del Artículo / Dictamen Completo *
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('**', '**')}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                      title="Negrita"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('### ')}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                      title="Subtítulo H3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('- ')}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono"
                      title="Lista con viñetas"
                    >
                      • Lista
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('> ')}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono"
                      title="Cita destacada"
                    >
                      " Cita
                    </button>
                  </div>
                </div>

                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={9}
                  placeholder="Redacta los argumentos, análisis normativo (CCyC, AFIP, BCRA) y recomendaciones estratégicas de Cr Dominguez..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none leading-relaxed font-sans"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Tip: Separa los párrafos con saltos de línea dobles para una lectura óptima.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Media (Photo & Video) */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Photo Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4 text-[#0078D4]" />
                  <span>Foto de Portada / Imagen Destacada</span>
                </div>

                {/* Presets Grid */}
                <div>
                  <span className="text-[11px] text-slate-600 block mb-2 font-medium">
                    Seleccionar imagen oficial del estudio:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setFeaturedImage(preset.url);
                          setCustomImageUrl('');
                        }}
                        className={`group rounded-lg overflow-hidden border text-left transition-all relative ${
                          featuredImage === preset.url && !customImageUrl
                            ? 'ring-2 ring-[#0078D4] border-[#0078D4] shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-video w-full overflow-hidden bg-slate-200">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-1.5 bg-white text-[10px] font-bold text-slate-700 truncate">
                          {preset.label}
                        </div>
                        {featuredImage === preset.url && !customImageUrl && (
                          <div className="absolute top-1 right-1 bg-[#0078D4] text-white p-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Option */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    O ingresar URL de imagen externa personalizada:
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... o https://tu-empresa.com/foto.jpg"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Video Section */}
              <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Vincular Video (YouTube / Entrevista / Conferencia)</span>
                  </div>
                  {detectedYouTubeId && (
                    <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-red-600" />
                      ID detectado: {detectedYouTubeId}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enlace de YouTube o ID del Video:
                  </label>
                  <input
                    type="text"
                    value={youtubeVideoUrl}
                    onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                    placeholder="ej. https://www.youtube.com/watch?v=dQw4w9WgXcQ o https://youtu.be/..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-red-600 focus:outline-none font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    El video se incrustará con reproductor responsive optimizado dentro del artículo del blog.
                  </span>
                </div>

                {/* Live YouTube Preview */}
                {detectedYouTubeId && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Vista previa del reproductor:
                    </span>
                    <div className="aspect-video max-w-md w-full rounded-lg overflow-hidden border border-slate-300 bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${detectedYouTubeId}?rel=0`}
                        title="Vista previa de YouTube"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Spotify Podcast Section */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Headphones className="w-4 h-4 text-emerald-600" />
                  <span>Podcast / Audio en Spotify (Opcional)</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enlace de Episodio de Spotify Embed:
                  </label>
                  <input
                    type="url"
                    value={spotifyEmbedUrl}
                    onChange={(e) => setSpotifyEmbedUrl(e.target.value)}
                    placeholder="https://open.spotify.com/embed/episode/..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEO & Tags */}
          {activeTab === 'seo' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Slug URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Slug / URL Amigable del Artículo *
                  </label>
                  <button
                    type="button"
                    onClick={() => setSlug(blogService.generateSlug(title))}
                    className="text-[11px] text-[#0078D4] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerar desde título
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">
                    crdominguez.ar/blog/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(blogService.generateSlug(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-44 pr-3 py-2 text-xs font-mono text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>
              </div>

              {/* SEO Title & Description */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Meta Título SEO (Google Search Title)
                    </label>
                    <span className={`text-[11px] font-mono ${seoTitle.length > 60 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {seoTitle.length} / 60 caracteres (Recomendado: 45-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Título optimizado para motores de búsqueda'}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Meta Descripción SEO (Snippet de Google)
                    </label>
                    <span className={`text-[11px] font-mono ${seoDescription.length > 160 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {seoDescription.length} / 160 caracteres (Recomendado: 120-160)
                    </span>
                  </div>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={2}
                    placeholder="Descripción precisa que motive el clic de empresarios en Google..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Tags / SEO Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Etiquetas & Palabras Clave (SEO Tags)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Escribe una etiqueta y presiona Enter (ej. Factura E, CCyC, Patagonia, AFIP)"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
                  >
                    + Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono font-medium text-slate-700 shadow-2xs"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No hay etiquetas asignadas aún.</span>
                  )}
                </div>
              </div>

              {/* Google SERP Preview Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#0078D4]" />
                  <span>Vista Previa en Resultados de Búsqueda de Google (SERP)</span>
                </span>
                
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    https://crdominguez.ar › blog › {slug || 'articulo'}
                  </div>
                  <h4 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer leading-tight">
                    {seoTitle || title || 'Título de muestra para Google'}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {seoDescription || excerpt || content.slice(0, 150) || 'Descripción de muestra que aparecerá indexada en los resultados orgánicos de Google...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Live Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Header Image */}
                <div className="relative aspect-video max-h-72 w-full overflow-hidden bg-slate-100">
                  <img
                    src={customImageUrl.trim() || featuredImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white/95 text-[#0078D4] text-xs font-mono font-bold rounded shadow-sm">
                      {category}
                    </span>
                    {detectedYouTubeId && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        Video
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-[#0078D4] font-semibold uppercase">
                      Por {author} · {new Date().toLocaleDateString('es-AR')}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1 leading-tight">
                      {title || 'Título del Artículo en Formato Borrador'}
                    </h2>
                    {excerpt && (
                      <p className="text-sm text-slate-600 italic mt-2 border-l-2 border-[#0078D4] pl-3 py-0.5">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {detectedYouTubeId && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${detectedYouTubeId}?rel=0`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-100">
                    {content || 'El contenido completo del dictamen se mostrará aquí...'}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              feedback.startsWith('Error') 
                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {feedback.startsWith('Error') ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              )}
              <span>{feedback}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {!postToEdit && (
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifySubscribers}
                  onChange={(e) => setNotifySubscribers(e.target.checked)}
                  className="rounded border-slate-300 text-[#0078D4] focus:ring-[#0078D4]"
                />
                <span className="font-medium">
                  Difundir automáticamente por Email a clientes suscriptos (Resend Free)
                </span>
              </label>
            )}

            <div className="flex items-center justify-end gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#106EBE] disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando y Publicando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{postToEdit ? 'Actualizar Artículo' : 'Publicar en el Blog'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
