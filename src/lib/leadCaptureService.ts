import { dbRepository } from './supabaseClient';
import { resendService } from './resendService';
import { 
  Lead, 
  CRMContact, 
  BusinessVertical, 
  CompanyDepartment, 
  ContactType,
  LeadStage 
} from '../types';

export interface CaptureOpportunityParams {
  source: 
    | 'Formulario de Asesoría' 
    | 'Diagnóstico Estratégico' 
    | 'Simulador Punto de Equilibrio' 
    | 'Simulador Factura E' 
    | 'Simulador Franquicias CCyC' 
    | 'Simulador ZHC IA' 
    | 'Contacto Rápido';
  opportunityTitle?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  roleTitle?: string;
  contactType?: ContactType;
  department?: CompanyDepartment;
  location?: string;
  cuit?: string;
  vertical: BusinessVertical;
  priority?: 'alta' | 'media' | 'baja';
  stage?: LeadStage;
  estimatedMonthlyBudgetUsd?: number;
  dealValue?: number;
  score?: number;
  revenueRange?: string;
  employeeRange?: string;
  identifiedProblem?: string;
  notes?: string;
  technicalDetails?: Record<string, any>;
}

class LeadCaptureService {
  async captureOpportunityFromForm(params: CaptureOpportunityParams): Promise<{ lead: Lead; contact: CRMContact }> {
    const contacts = await dbRepository.getContacts();

    // 1. Check if contact exists by email or companyName
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanCompany = params.companyName.trim().toLowerCase();
    
    let matchedContact = contacts.find((c) => 
      c.email.trim().toLowerCase() === cleanEmail ||
      c.companyName.trim().toLowerCase() === cleanCompany
    );

    // Format phone / WhatsApp
    let cleanWa = (params.whatsappNumber || params.phone || '').replace(/[^0-9]/g, '');
    if (cleanWa && !cleanWa.startsWith('54') && cleanWa.length >= 8) {
      cleanWa = `549${cleanWa}`;
    }
    if (!cleanWa) {
      cleanWa = '5492804000000';
    }

    const cityLocation = params.location || 'Trelew, Chubut';

    if (matchedContact) {
      // Update existing contact
      const updatedTags = Array.from(new Set([...matchedContact.tags, params.source, cityLocation]));
      matchedContact = await dbRepository.updateContact(matchedContact.id, {
        phone: params.phone || matchedContact.phone,
        whatsappNumber: cleanWa || matchedContact.whatsappNumber,
        location: cityLocation,
        vertical: params.vertical || matchedContact.vertical,
        tags: updatedTags,
        lastContactDate: new Date().toISOString(),
        interactionCount: (matchedContact.interactionCount || 1) + 1,
        notes: matchedContact.notes + `\n[${new Date().toLocaleDateString('es-AR')}] Nueva interacción desde ${params.source}.`,
      });
    } else {
      // Create new contact
      const isEmpresa = params.contactType !== 'individual';
      const newContact = await dbRepository.createContact({
        type: isEmpresa ? 'empresa' : 'individual',
        name: params.contactName,
        companyName: params.companyName,
        cuit: params.cuit,
        roleTitle: params.roleTitle || (isEmpresa ? 'Dirección General / Titular' : 'Profesional Independiente'),
        department: params.department || 'direccion_gerencia',
        email: params.email,
        phone: params.phone || '+54 280 400-0000',
        whatsappNumber: cleanWa,
        location: cityLocation,
        vertical: params.vertical,
        status: 'lead',
        tags: [params.source, cityLocation, isEmpresa ? 'Empresa' : 'Individual', 'Oportunidad Calificada'],
        notes: params.notes || `Contacto registrado automáticamente desde ${params.source}.`,
        employees: isEmpresa ? [
          {
            id: `emp-${Date.now().toString().slice(-4)}-1`,
            name: params.contactName,
            department: params.department || 'direccion_gerencia',
            roleTitle: params.roleTitle || 'Titular / Decisor',
            email: params.email,
            phone: params.phone || '+54 280 400-0000',
            whatsappNumber: cleanWa,
            isPrimaryContact: true,
            notes: 'Contacto principal registrado desde formulario web.'
          }
        ] : undefined,
      });
      matchedContact = newContact;
    }

    // 2. Create Opportunity in CRM Pipeline
    const title = params.opportunityTitle || `${params.source}: ${params.companyName}`;
    const calculatedBudget = params.dealValue || params.estimatedMonthlyBudgetUsd || (params.vertical === 'cfo_estrategico' ? 2500 : 1800);
    const calculatedScore = params.score || 85;

    const createdLead = await dbRepository.createLead({
      contactId: matchedContact.id,
      opportunityTitle: title,
      source: params.source,
      companyName: params.companyName,
      contactName: params.contactName,
      email: params.email,
      phone: params.phone || matchedContact.phone,
      location: cityLocation,
      vertical: params.vertical,
      stage: params.stage || 'nuevo',
      priority: params.priority || 'alta',
      estimatedMonthlyBudgetUsd: calculatedBudget,
      dealValue: params.dealValue,
      revenueRange: params.revenueRange,
      employeeRange: params.employeeRange,
      identifiedProblem: params.identifiedProblem,
      score: calculatedScore,
      notes: params.notes || `Alta automática generada desde ${params.source}. Desafío: ${params.identifiedProblem || 'Evaluación estratégica requerida'}.`,
      diagnosticData: {
        ...(params.technicalDetails || {}),
        source: params.source,
        capturedAt: new Date().toISOString(),
        revenueRange: params.revenueRange,
        employeeRange: params.employeeRange,
      },
    });

    // 3. Link lead back to contact
    await dbRepository.updateContact(matchedContact.id, {
      leadId: createdLead.id,
      stage: createdLead.stage,
      status: 'lead',
    });

    // 4. Create automatic CRM action task for Cr. Carlos Domínguez
    await dbRepository.createTask({
      leadId: createdLead.id,
      companyName: params.companyName,
      title: `Auditar oportunidad: ${title}`,
      dueDate: 'En 48 hs',
      priority: params.priority === 'alta' ? 'urgente' : 'normal',
      assignedRole: 'socio',
      vertical: params.vertical,
    });

    // 5. Dispatch email notification via Resend
    try {
      await resendService.sendLeadNotification(createdLead);
    } catch (e) {
      console.warn('Resend notification logged in fallback simulation mode:', e);
    }

    // 6. Broadcast event for real-time CRM updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cr_opportunity_created', { 
        detail: { lead: createdLead, contact: matchedContact } 
      }));
    }

    return { lead: createdLead, contact: matchedContact };
  }
}

export const leadCaptureService = new LeadCaptureService();
