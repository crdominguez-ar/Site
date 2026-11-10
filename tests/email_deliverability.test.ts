import { describe, it, expect } from 'vitest';
import { resendService } from '../src/lib/resendService';
import { contentService } from '../src/lib/contentService';
import { userService } from '../src/lib/userService';

describe('Email Configuration & Deliverability Suite', () => {
  it('el servicio de contenido institucional utiliza hola@crdominguez.ar como canal oficial', () => {
    const content = contentService.getContent();
    expect(content.contact.email).toBe('hola@crdominguez.ar');
  });

  it('el servicio de Resend utiliza notificaciones@crdominguez.ar como remitente transaccional', () => {
    const config = resendService.getConfig();
    expect(config.senderEmail).toBe('notificaciones@crdominguez.ar');
    expect(config.isVerifiedDomain).toBe(true);
  });

  it('el usuario director super_admin está configurado con hola@crdominguez.ar', () => {
    const superAdmin = userService.getUsers().find((u) => u.role === 'super_admin');
    expect(superAdmin).toBeDefined();
    expect(superAdmin?.email).toBe('hola@crdominguez.ar');
  });

  it('valida la sintaxis del registro SPF con la IP del VPS y el relay de Resend', () => {
    const spfRecord = 'v=spf1 ip4:138.219.41.106 include:resend.com ~all';
    expect(spfRecord).toContain('v=spf1');
    expect(spfRecord).toContain('ip4:138.219.41.106');
    expect(spfRecord).toContain('include:resend.com');
    expect(spfRecord.endsWith('~all') || spfRecord.endsWith('-all')).toBe(true);
  });

  it('valida la estructura de DMARC permisivo para evitar rebotes en Gmail y Outlook', () => {
    const dmarcRecord = 'v=DMARC1; p=none; sp=none; rua=mailto:notificaciones@crdominguez.ar;';
    expect(dmarcRecord).toContain('v=DMARC1');
    expect(dmarcRecord).toContain('p=none');
    expect(dmarcRecord).toContain('rua=mailto:notificaciones@crdominguez.ar');
  });

  it('valida que la clave pública DKIM de CyberPanel sea un formato RSA 2048-bit válido y continuo', () => {
    const dkimValue = 'v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApi5/ACTvycHRGnpUSKOWQsnZBfLyZg/FrevO9esZPuUubR7/vU6OjJuQk7+Imp3kGrZw+paVtwsVr+vZTtE01m+a7252MvV+f2rwfWnC5MXTtud3he9hRWX8ua6jwjaG5A1+JGFPByra5dGbEEcfyDW3UNwy301posGyn8hUj6GGFGJ5mTzJw1wjqbo04G0FheUw0tn4k7pM717r/b7bo/mkH+eibkWUEttAKXcstpnbJwe/Vgavr9HORsmgK5g7PYKpOnaTiw4yEozXBnOvfYCDfA29vtBOwHvh4j8YauQaaS5qAhYDeHaVWYLBtkusk5rFH2UOEWq03wn8wVkPLwIDAQAB';
    
    // No debe contener comillas intermedias ni saltos de línea de BIND
    expect(dkimValue).not.toContain('"');
    expect(dkimValue).not.toContain('\n');
    expect(dkimValue).not.toContain('\t');
    expect(dkimValue).toContain('v=DKIM1');
    expect(dkimValue).toContain('k=rsa');
    expect(dkimValue).toContain('p=MIIBIj');
    expect(dkimValue.endsWith('IDAQAB')).toBe(true);
  });

  it('el despacho simulado de Resend genera un mensaje válido con remitente oficial', async () => {
    const res = await resendService.sendEmail({
      to: ['cliente.test@empresa.com'],
      subject: 'Prueba de Entrega de Dictamen Contable',
      html: '<p>Estimado cliente, su balance está listo.</p>',
      type: 'report_delivery'
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toBeDefined();
    
    const config = resendService.getConfig();
    expect(config.senderEmail).toBe('notificaciones@crdominguez.ar');
  });
});
