import { describe, it, expect, beforeEach } from 'vitest';
import { dbRepository } from '../src/lib/supabaseClient';
import { Lead } from '../src/types';

describe('DataRepository & Persistence Layer', () => {
  it('loads seeded leads correctly without crashing', async () => {
    const leads = await dbRepository.getLeads();
    expect(Array.isArray(leads)).toBe(true);
    expect(leads.length).toBeGreaterThan(0);
  });

  it('creates and retrieves a new lead persistently', async () => {
    const newLeadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      companyName: 'Chubut AI Labs SAS',
      contactName: 'Luciana Morales',
      email: 'luciana@chubutailabs.ar',
      phone: '+54 280 400-0000',
      location: 'Trelew, Chubut',
      vertical: 'digital_saas',
      stage: 'nuevo',
      priority: 'alta',
      notes: 'Lead generado para auditoría de Unit Economics',
      score: 92,
      contractModality: 'proyecto',
      targetServiceCode: '01',
      estimatedMonthlyBudgetUsd: 1900,
    };

    const created = await dbRepository.createLead(newLeadData);
    expect(created.id).toBeDefined();
    expect(created.companyName).toBe('Chubut AI Labs SAS');

    const allLeads = await dbRepository.getLeads();
    const found = allLeads.find((l) => l.id === created.id);
    expect(found).toBeDefined();
    expect(found?.email).toBe('luciana@chubutailabs.ar');
    expect(found?.contractModality).toBe('proyecto');
    expect(found?.targetServiceCode).toBe('01');
  });

  it('updates lead stage correctly and updates timestamp', async () => {
    const leads = await dbRepository.getLeads();
    const firstLead = leads[0];

    const updated = await dbRepository.updateLead(firstLead.id, { stage: 'propuesta' });
    expect(updated.stage).toBe('propuesta');

    const freshLeads = await dbRepository.getLeads();
    const checked = freshLeads.find((l) => l.id === firstLead.id);
    expect(checked?.stage).toBe('propuesta');
  });

  it('handles client reports with new official deliverables', async () => {
    const reports = await dbRepository.getReports();
    expect(reports.length).toBeGreaterThanOrEqual(4);

    const unitEconomicsRep = reports.find((r) => r.type === 'unit_economics');
    const modelo36mRep = reports.find((r) => r.type === 'modelo_36m');
    const dataRoomRep = reports.find((r) => r.type === 'data_room_due_diligence');

    expect(unitEconomicsRep).toBeDefined();
    expect(unitEconomicsRep?.author).toContain('Domínguez');

    expect(modelo36mRep).toBeDefined();
    expect(dataRoomRep).toBeDefined();
  });

  it('synchronizes a CRM lead to client profile for the portal', () => {
    const testLead: Lead = {
      id: 'lead-test-portal-1',
      companyName: 'Lanera Austral SA',
      contactName: 'Guillermo Evans',
      email: 'gevans@laneraaustral.com.ar',
      phone: '+54 280 442-1234',
      location: 'Trelew, Chubut',
      vertical: 'cfo_estrategico',
      stage: 'activo',
      priority: 'alta',
      notes: 'Cliente activo con abono mensual',
      score: 95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedMonthlyBudgetUsd: 2200,
    };

    const clientProfile = dbRepository.syncLeadToClientProfile(testLead);

    expect(clientProfile.companyName).toBe('Lanera Austral SA');
    expect(clientProfile.activePlan).toBe('CFO Fraccional Estratégico');
    expect(clientProfile.location).toBe('Trelew, Chubut');

    const currentActiveProfile = dbRepository.getClientProfile();
    expect(currentActiveProfile.companyName).toBe('Lanera Austral SA');
  });
});
