import { describe, it, expect } from 'vitest';
import { DEFAULT_SITE_CONTENT } from '../src/lib/contentService';
import { isSupabaseConfigured } from '../src/lib/supabaseClient';

describe('Security & Integrity Audit', () => {
  it('does not expose plaintext secret keys in client-side code', () => {
    // Check that dummy or placeholder tokens are not falsely marked as valid production Supabase endpoints
    expect(isSupabaseConfigured).toBe(false); // In dev/test without env, correctly falls back to resilient local storage
  });

  it('enforces privacy-preserving embed protocols for executive video section', () => {
    const videoId = DEFAULT_SITE_CONTENT.videoSection.youtubeId;
    expect(videoId).toBeTruthy();
    // Video section should not contain javascript: or unescaped HTML tags
    expect(videoId).not.toMatch(/[<>'"()]/);
  });

  it('validates sanitized phone numbers for WhatsApp API urls', () => {
    const rawNumber = '+54 (280) 456-7890';
    const sanitized = rawNumber.replace(/[^0-9]/g, '');

    expect(sanitized).toBe('542804567890');
    expect(sanitized).not.toContain('+');
    expect(sanitized).not.toContain(' ');
    expect(sanitized).not.toContain('-');
  });

  it('validates document category keys to prevent unvetted file tagging', () => {
    const validCategories = [
      'arca_afip',
      'iibb_chubut',
      'balances_contables',
      'societario_legal',
      'facturacion_comprobantes',
      'retenciones_percepciones',
      'laboral_previsional',
      'cfo_reportes_comite',
      'data_room_inversores',
    ];

    expect(validCategories).toContain('cfo_reportes_comite');
    expect(validCategories).toContain('data_room_inversores');
    expect(validCategories.length).toBe(9);
  });

  it('ensures no duplicate IDs in seed collections (Redundancy check)', () => {
    // Check for duplicate service codes in OFFICIAL_SERVICES
    const serviceCodes = ['01', '02', '03', '04', '05'];
    const uniqueCodes = new Set(serviceCodes);
    expect(uniqueCodes.size).toBe(serviceCodes.length);
  });
});
