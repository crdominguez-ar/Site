import React, { useState } from 'react';
import { 
  Globe, Search, Share2, CheckCircle2, AlertTriangle, 
  Copy, Check, Code2
} from 'lucide-react';

export const SEOControlPanel: React.FC = () => {
  const [metaTitle, setMetaTitle] = useState<string>(
    'Cr Dominguez | Consultoría Estratégica & Dirección Financiera CFO'
  );
  const [metaDescription, setMetaDescription] = useState<string>(
    'Consultoría financiera, tributaria y de negocios estratégica en Trelew, Chubut. Liderado por el Cr. Carlos Rodrigo Domínguez. Costos PyME, SaaS, Franquicias Ley CCyC y Nuevas Economías.'
  );
  const [canonicalUrl, setCanonicalUrl] = useState<string>('https://crdominguez.ar');
  const [keywords, setKeywords] = useState<string>(
    'cr dominguez, estudio contable trelew, carlos rodrigo dominguez, consultoria negocios chubut, cfo fraccional patagonia, franquicias ccyc 1512, factura e exportacion servicios, costos pyme'
  );
  
  const [activePreview, setActivePreview] = useState<'google' | 'social' | 'schema'>('google');
  const [copied, setCopied] = useState<boolean>(false);

  // Validation calculations
  const titleLength = metaTitle.length;
  const isTitleOptimal = titleLength >= 35 && titleLength <= 65;

  const descLength = metaDescription.length;
  const isDescOptimal = descLength >= 120 && descLength <= 165;

  // Key terms check
  const focusTerms = [
    { term: 'Trelew, Chubut', found: metaDescription.toLowerCase().includes('trelew') && metaDescription.toLowerCase().includes('chubut') },
    { term: 'Carlos Rodrigo Domínguez', found: metaDescription.toLowerCase().includes('carlos rodrigo domínguez') || metaTitle.toLowerCase().includes('domínguez') },
    { term: 'CFO Fraccional / Estratégica', found: metaTitle.toLowerCase().includes('estratégica') || metaTitle.toLowerCase().includes('cfo') },
    { term: 'Franquicias Ley CCyC', found: metaDescription.toLowerCase().includes('franquicias') },
    { term: 'Modelos Digitales / IA', found: metaDescription.toLowerCase().includes('ia') || metaDescription.toLowerCase().includes('saas') },
  ];

  const termsPassed = focusTerms.filter((t) => t.found).length;
  const seoScore = Math.round(
    ((isTitleOptimal ? 25 : 15) + (isDescOptimal ? 35 : 20) + (termsPassed / focusTerms.length) * 40)
  );

  const generatedHtmlTags = `<!-- Primarios -->
<title>${metaTitle}</title>
<meta name="description" content="${metaDescription}" />
<meta name="keywords" content="${keywords}" />
<link rel="canonical" href="${canonicalUrl}" />

<!-- OpenGraph / Redes Sociales -->
<meta property="og:type" content="business.business" />
<meta property="og:title" content="${metaTitle}" />
<meta property="og:description" content="${metaDescription}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${canonicalUrl}/hero_patagonia_consultancy.jpg" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${metaTitle}" />
<meta name="twitter:description" content="${metaDescription}" />`;

  const handleCopyTags = () => {
    navigator.clipboard.writeText(generatedHtmlTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0078D4]">
              <Globe className="w-4 h-4" />
              <span>Centro de Control SEO & Metadatos Oficiales</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Control & Auditoría de Posicionamiento Orgánico
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Administra los meta tags, simula el resultado en el buscador de Google, valida las tarjetas de previsualización social (OpenGraph/Twitter) y monitorea el marcado estructurado Schema.org JSON-LD.
            </p>
          </div>

          {/* SEO Score Meter */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center shrink-0 min-w-[160px]">
            <span className="text-[11px] text-slate-500 uppercase font-mono block">
              Puntaje SEO Técnico
            </span>
            <span className={`text-3xl font-black font-mono tabular-nums block mt-1 ${
              seoScore >= 85 ? 'text-[#107C41]' : 'text-amber-700'
            }`}>
              {seoScore}/100
            </span>
            <span className="text-[10px] text-[#0078D4] font-semibold block mt-0.5">
              Optimizado para Google
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActivePreview('google')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activePreview === 'google'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Simulador Google Snippet</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePreview('social')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activePreview === 'social'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Tarjetas Sociales (OpenGraph & X)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePreview('schema')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
              activePreview === 'schema'
                ? 'bg-[#0078D4] text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Marcado Schema.org JSON-LD</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Parámetros de Metadatos
            </h3>
            <span className="text-xs text-[#0078D4] font-mono font-semibold">Edición en Tiempo Real</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Meta Title ({titleLength} caracteres)
              </label>
              <span className={`text-[11px] font-mono font-semibold ${isTitleOptimal ? 'text-[#107C41]' : 'text-amber-700'}`}>
                {isTitleOptimal ? '✓ Longitud óptima (35-65)' : 'Ajustar longitud'}
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Meta Description ({descLength} caracteres)
              </label>
              <span className={`text-[11px] font-mono font-semibold ${isDescOptimal ? 'text-[#107C41]' : 'text-amber-700'}`}>
                {isDescOptimal ? '✓ Longitud óptima (120-165)' : 'Ajustar longitud'}
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              URL Canónica
            </label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-xs text-slate-900 font-mono focus:border-[#0078D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Palabras Clave de Enfoque (Keywords)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:border-[#0078D4] focus:outline-none"
            />
          </div>

          {/* Keyword Checklist */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Términos Estratégicos Detectados:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {focusTerms.map((t, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                  {t.found ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#107C41] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                  <span className={t.found ? 'text-slate-900 font-medium' : 'text-slate-500'}>{t.term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Previews */}
        <div className="lg:col-span-6 space-y-6">
          {activePreview === 'google' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0078D4]" />
                  Simulador de Búsqueda Google (SERP Snippet)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Vista Previa</span>
              </div>

              {/* Realistic Google Search Card */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs space-y-2 text-slate-900">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-[#0078D4] text-white flex items-center justify-center text-[10px] font-bold">
                    D
                  </div>
                  <span className="font-medium text-slate-800">dominguez-lambrecht.com.ar</span>
                  <span className="text-slate-500">› consultoria</span>
                </div>

                <h4 className="text-lg font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {metaTitle}
                </h4>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {metaDescription}
                </p>

                <div className="pt-2 flex items-center gap-3 text-[11px] text-[#1a0dab]">
                  <span className="cursor-pointer hover:underline">Simulador de Costos</span>
                  <span>·</span>
                  <span className="cursor-pointer hover:underline">Evaluación de Franquicias</span>
                  <span>·</span>
                  <span className="cursor-pointer hover:underline">CFO Fraccional</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Google utiliza el meta title y description para generar el resultado de búsqueda. Con la configuración actual, los usuarios que busquen en Trelew y Patagonia encontrarán tu consultoría destacada.
              </p>
            </div>
          )}

          {activePreview === 'social' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#0078D4]" />
                  Tarjeta Social OpenGraph (LinkedIn / X / WhatsApp)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">1200 x 630 Card</span>
              </div>

              {/* Realistic Social Share Card */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-md">
                <div className="aspect-[1.91/1] w-full relative bg-slate-100">
                  <img
                    src="/src/assets/images/hero_patagonia_consultancy_1793059908678.jpg"
                    alt={metaTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="px-2 py-0.5 bg-[#0078D4] text-white text-[10px] font-bold rounded">
                      ESTUDIO DOMÍNGUEZ & LAMBRECHT
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">DOMINGUEZ-LAMBRECHT.COM.AR</span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {metaTitle}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {metaDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePreview === 'schema' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#107C41]" />
                  Marcado Estructurado Schema.org JSON-LD
                </span>
                <span className="text-[11px] text-[#107C41] font-mono font-semibold">Válido para Google Rich Snippets</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto max-h-72">
                <pre>{`{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "Cr Dominguez - Consultoría Estratégica & CFO",
  "founder": {
    "@type": "Person",
    "name": "Carlos Rodrigo Domínguez",
    "jobTitle": "Contador Público"
  },
  "address": {
    "addressLocality": "Trelew",
    "addressRegion": "Chubut",
    "addressCountry": "AR"
  },
  "knowsAbout": [
    "Costos Industriales",
    "Franquicias Ley CCyC",
    "Factura E y Divisas",
    "CFO Fraccional",
    "Empresas 100% IA"
  ]
}`}</pre>
              </div>

              <p className="text-xs text-slate-600">
                Este marcado ya está inyectado directamente en el encabezado <code className="text-[#0078D4]">&lt;head&gt;</code> de la aplicación web para garantizar la indexación como servicio financiero profesional calificado.
              </p>
            </div>
          )}

          {/* HTML Export Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Copiar Metatags Generados
              </span>
              <span className="text-[11px] text-slate-500">
                Para producción o sincronización con Vercel / Cloudflare
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyTags}
              className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar HTML Tags</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
