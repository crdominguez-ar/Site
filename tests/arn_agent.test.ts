import { describe, it, expect } from 'vitest';
import { geminiAgentService } from '../src/lib/geminiAgentService';
import { OFFICIAL_SERVICES } from '../src/data/verticals';
import { CoreServiceCode } from '../src/types';

describe('ARN & Gemini Agent Test Suite', () => {
  it('detecta correctamente el Servicio 03 (Exportador BCRA 8481)', () => {
    const code = geminiAgentService.detectServiceCode('Necesito saber cómo facturar con Factura E y liquidar divisas según Com. BCRA 8481');
    expect(code).toBe('03');
  });

  it('detecta correctamente el Servicio 01 (Unit Economics & CAC/LTV)', () => {
    const code = geminiAgentService.detectServiceCode('Queremos auditar el LTV, CAC y Churn de nuestra plataforma SaaS');
    expect(code).toBe('01');
  });

  it('detecta correctamente el Servicio 02 (Modelo Financiero 36m & Pricing)', () => {
    const code = geminiAgentService.detectServiceCode('Buscamos diseñar un modelo financiero a 36 meses y definir el pricing por consumo');
    expect(code).toBe('02');
  });

  it('detecta correctamente el Servicio 04 (CFO Fraccional)', () => {
    const code = geminiAgentService.detectServiceCode('Necesitamos un CFO fraccional con comités mensuales y control de cash runway');
    expect(code).toBe('04');
  });

  it('detecta correctamente el Servicio 05 (Data Room Inversores)', () => {
    const code = geminiAgentService.detectServiceCode('Estamos armando el data room para una ronda de inversión seed');
    expect(code).toBe('05');
  });

  it('el Agente IA responde con base normativa y sin errores ante consultas de exportación', async () => {
    const res = await geminiAgentService.askAgent({
      message: '¿Cómo me afecta la Comunicación BCRA "A" 8481 para cobrar en dólares?',
      mode: 'public'
    });

    expect(res.success).toBe(true);
    expect(res.text).toBeDefined();
    expect(res.text.length).toBeGreaterThan(50);
    expect(res.text).toContain('8481');
    expect(res.suggestedServiceCode).toBe('03');
  });

  it('el Agente IA en modo ARN genera recomendaciones ejecutivas internas', async () => {
    const res = await geminiAgentService.askAgent({
      message: 'Revisar retención neta y balance de un cliente de software',
      mode: 'arn'
    });

    expect(res.success).toBe(true);
    expect(res.text).toBeDefined();
    expect(res.text).toContain('ARN');
  });

  it('los 5 servicios canónicos están debidamente estructurados para el embudo hacia el ARN', () => {
    const codes: CoreServiceCode[] = ['01', '02', '03', '04', '05'];
    
    codes.forEach((code) => {
      const svc = OFFICIAL_SERVICES[code];
      expect(svc).toBeDefined();
      expect(svc.code).toBe(code);
      expect(svc.title.length).toBeGreaterThan(5);
      expect(svc.deliverable.length).toBeGreaterThan(10);
      expect(svc.normativeBase.length).toBeGreaterThan(5);
      expect(svc.recommendedPriceUsd).toBeGreaterThan(0);
    });
  });
});
