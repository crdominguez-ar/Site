import { describe, it, expect } from 'vitest';
import { 
  OFFICIAL_SERVICES, 
  TARGET_ARCHETYPES, 
  COMMON_PITFALLS, 
  MACRO_METRICS_2026,
  CONCILIATED_METRICS 
} from '../src/data/verticals';

describe('Official Services and Archetypes Architecture (Slide Deck Validation)', () => {
  it('defines the 5 exact core services (01 to 05)', () => {
    const keys = Object.keys(OFFICIAL_SERVICES);
    expect(keys).toEqual(['01', '02', '03', '04', '05']);

    expect(OFFICIAL_SERVICES['01'].modality).toBe('proyecto');
    expect(OFFICIAL_SERVICES['01'].title).toContain('Unit Economics');

    expect(OFFICIAL_SERVICES['02'].modality).toBe('proyecto');
    expect(OFFICIAL_SERVICES['02'].title).toContain('Modelo Financiero');

    expect(OFFICIAL_SERVICES['03'].modality).toBe('proyecto');
    expect(OFFICIAL_SERVICES['03'].title).toContain('Exportador');
    expect(OFFICIAL_SERVICES['03'].normativeBase).toContain('8481');

    expect(OFFICIAL_SERVICES['04'].modality).toBe('abono_mensual');
    expect(OFFICIAL_SERVICES['04'].title).toContain('CFO Fraccional');

    expect(OFFICIAL_SERVICES['05'].modality).toBe('proyecto');
    expect(OFFICIAL_SERVICES['05'].title).toContain('Inversores');
  });

  it('defines the 5 target archetypes with valid service linkages', () => {
    expect(TARGET_ARCHETYPES.length).toBe(5);
    const ids = TARGET_ARCHETYPES.map(a => a.id);
    expect(ids).toContain('pymes');
    expect(ids).toContain('franquicias');
    expect(ids).toContain('saas_software');
    expect(ids).toContain('exportadores_servicios');
    expect(ids).toContain('nuevas_economias');

    // Every archetype must link only to valid service codes
    TARGET_ARCHETYPES.forEach(arch => {
      arch.linkedServiceCodes.forEach(code => {
        expect(['01', '02', '03', '04', '05']).toContain(code);
      });
    });
  });

  it('defines 6 common pitfalls with problem and solution mappings', () => {
    expect(COMMON_PITFALLS.length).toBe(6);
    COMMON_PITFALLS.forEach(p => {
      expect(p.title).toBeTruthy();
      expect(p.problem.length).toBeGreaterThan(15);
      expect(p.solution.length).toBeGreaterThan(15);
    });
  });

  it('contains 4 macro metrics with valid references for Argentina 2026', () => {
    expect(MACRO_METRICS_2026.length).toBe(4);
    const sbc = MACRO_METRICS_2026.find(m => m.stat.includes('10.493'));
    expect(sbc).toBeDefined();
    expect(sbc?.source).toContain('INDEC');

    const nrr = MACRO_METRICS_2026.find(m => m.stat.includes('103%'));
    expect(nrr).toBeDefined();
  });

  it('includes 6 conciliated accounting metrics from Slide 8', () => {
    expect(CONCILIATED_METRICS.length).toBe(6);
    const codes = CONCILIATED_METRICS.map(m => m.code);
    expect(codes).toContain('MRR / ARR');
    expect(codes).toContain('Churn');
    expect(codes).toContain('NRR');
    expect(codes).toContain('CAC');
    expect(codes).toContain('LTV');
    expect(codes).toContain('Margen de Contribución');
  });
});
