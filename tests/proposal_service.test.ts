import { describe, it, expect } from 'vitest';
import { proposalService, ACCOUNTING_SERVICES_CATALOG } from '../src/lib/proposalService';
import { ProposalLineItem } from '../src/types';

describe('Proposal Engine & Accounting Catalog', () => {
  it('includes all 5 official brand core services in catalog', () => {
    const core01 = ACCOUNTING_SERVICES_CATALOG.find(s => s.id === 'srv-01-core');
    const core02 = ACCOUNTING_SERVICES_CATALOG.find(s => s.id === 'srv-02-core');
    const core03 = ACCOUNTING_SERVICES_CATALOG.find(s => s.id === 'srv-03-core');
    const core04 = ACCOUNTING_SERVICES_CATALOG.find(s => s.id === 'srv-04-core');
    const core05 = ACCOUNTING_SERVICES_CATALOG.find(s => s.id === 'srv-05-core');

    expect(core01).toBeDefined();
    expect(core01?.code).toBe('01-UNIT-ECON');
    expect(core01?.deliverables.length).toBeGreaterThanOrEqual(4);

    expect(core02).toBeDefined();
    expect(core02?.code).toBe('02-MODEL-36M');

    expect(core03).toBeDefined();
    expect(core03?.code).toBe('03-EXP-DIVISAS');
    expect(core03?.normativeFramework).toContain('8481');

    expect(core04).toBeDefined();
    expect(core04?.code).toBe('04-CFO-FRAC');

    expect(core05).toBeDefined();
    expect(core05?.code).toBe('05-INVEST-ROOM');
  });

  it('calculates totals correctly with subtotal, discount and tax', () => {
    const sampleItems: ProposalLineItem[] = [
      {
        id: 'item-1',
        serviceName: 'Diagnóstico Unit Economics',
        description: 'Auditoría recurrencia',
        hoursEstimated: 20,
        hourlyRate: 50000,
        subtotal: 1000000,
      },
      {
        id: 'item-2',
        serviceName: 'Modelo 36 Meses',
        description: 'Sensibilidad y pricing',
        hoursEstimated: 10,
        hourlyRate: 60000,
        subtotal: 600000,
      },
    ];

    // Total subtotal = 1,600,000. 10% discount = 160,000. Taxable = 1,440,000. 21% IVA = 302,400. Total = 1,742,400.
    const totals = proposalService.calculateTotals(sampleItems, 10, 21);

    expect(totals.totalHours).toBe(30);
    expect(totals.subtotal).toBe(1600000);
    expect(totals.discountAmount).toBe(160000);
    expect(totals.taxAmount).toBe(302400);
    expect(totals.totalAmount).toBe(1742400);
  });

  it('formats clean WhatsApp proposal message with bullet points and zero undefined fields', () => {
    const mockProposal: any = {
      recipientName: 'Carlos Gómez',
      companyName: 'Andes Cloud Tech',
      proposalNumber: 'PROP-2026-0042',
      version: 1,
      items: [
        { serviceName: '01. Diagnóstico de Unit Economics', hoursEstimated: 25, subtotal: 1250000 }
      ],
      totalHours: 25,
      currency: 'ARS',
      totalAmount: 1250000,
      paymentTerms: '50% anticipo y 50% contra entrega',
      validityDays: 30,
    };

    const waText = proposalService.generateWhatsAppProposalMessage(mockProposal);

    expect(waText).toContain('Andes Cloud Tech');
    expect(waText).toContain('PROP-2026-0042');
    expect(waText).toContain('Diagnóstico de Unit Economics');
    expect(waText).not.toContain('undefined');
    expect(waText).not.toContain('null');
  });
});
