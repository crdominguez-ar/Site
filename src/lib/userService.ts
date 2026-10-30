/**
 * User & Role Management Service (RBAC)
 * Cr Dominguez · Consultoría Estratégica & CFO
 */

import { SystemUser, UserRole } from '../types';

const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr-001',
    name: 'Cr. Carlos Rodrigo Domínguez',
    email: 'carlos@crdominguez.ar',
    role: 'super_admin',
    title: 'Director de Consultoría & CFO',
    department: 'Dirección General & Estrategia',
    phone: '+54 9 280 442-1980',
    isActive: true,
    lastLogin: 'Hace 5 min',
    avatarUrl: '/src/assets/images/carlos_dominguez_portrait_1793059909952.jpg',
  },
  {
    id: 'usr-002',
    name: 'Administración & Auditoría Contable',
    email: 'administracion@crdominguez.ar',
    role: 'admin',
    title: 'Coordinación Administrativa & Compliance Fiscal',
    department: 'Compliance Fiscal & Sociedades',
    phone: '+54 9 280 455-8812',
    isActive: true,
    lastLogin: 'Hoy 09:30',
  },
  {
    id: 'usr-003',
    name: 'Lic. Lucas Benítez',
    email: 'lucas.benitez@crdominguez.ar',
    role: 'consultor_staff',
    title: 'Consultor Senior de Costos & Finanzas PyME',
    department: 'Modelado Financiero & Flujos',
    phone: '+54 9 280 433-2210',
    isActive: true,
    lastLogin: 'Ayer 18:15',
  },
  {
    id: 'usr-004',
    name: 'Dr. Javier Peñaloza',
    email: 'j.penaloza@estudiolegalpatagonia.com.ar',
    role: 'auditor_externo',
    title: 'Auditor Legal Especialista en Franquicias CCyC',
    department: 'Auditoría Jurídica Externa',
    phone: '+54 9 280 477-9900',
    isActive: true,
    lastLogin: 'Hace 3 días',
  },
  {
    id: 'usr-005',
    name: 'Lucía Fernández (Patagonia Cloud SAS)',
    email: 'lucia@patagoniadata.io',
    role: 'cliente',
    title: 'CEO & Founder',
    clientId: 'cli-001',
    companyName: 'Patagonia Cloud Software SAS',
    department: 'Dirección Ejecutiva Cliente',
    phone: '+54 9 280 465-9011',
    isActive: true,
    lastLogin: 'Hoy 11:20',
  },
  {
    id: 'usr-006',
    name: 'Ing. Marcos Vallejos (Coop. Lanera)',
    email: 'm.vallejos@lanapatagonica.com.ar',
    role: 'cliente',
    title: 'Gerente de Planta Industrial',
    clientId: 'cli-002',
    companyName: 'Cooperativa Lanera Patagónica',
    department: 'Gerencia General Cliente',
    phone: '+54 280 442-8812',
    isActive: true,
    lastLogin: 'Hace 2 días',
  },
  {
    id: 'usr-007',
    name: 'Nicolás Braun (AeroDrone ZHC)',
    email: 'governance@aerodrone.ai',
    role: 'cliente',
    title: 'Gobernanza de Agentes IA',
    clientId: 'cli-003',
    companyName: 'AeroDrone Logistics ZHC',
    department: 'Tesorería On-Chain Cliente',
    phone: '+54 9 11 5092-4411',
    isActive: true,
    lastLogin: 'Hace 6 horas',
  },
];

class UserService {
  private usersKey = 'dl_system_users';
  private currentUserIdKey = 'dl_current_user_id';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(this.currentUserIdKey)) {
      localStorage.setItem(this.currentUserIdKey, INITIAL_USERS[0].id);
    }
  }

  getUsers(): SystemUser[] {
    if (typeof window === 'undefined') return INITIAL_USERS;
    try {
      const local = localStorage.getItem(this.usersKey);
      return local ? JSON.parse(local) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  getCurrentUser(): SystemUser {
    const users = this.getUsers();
    if (typeof window === 'undefined') return users[0];
    try {
      const currentId = localStorage.getItem(this.currentUserIdKey);
      const found = users.find((u) => u.id === currentId);
      return found || users[0];
    } catch {
      return users[0];
    }
  }

  setCurrentUser(userId: string): SystemUser {
    const users = this.getUsers();
    const found = users.find((u) => u.id === userId);
    if (found && typeof window !== 'undefined') {
      localStorage.setItem(this.currentUserIdKey, found.id);
      return found;
    }
    return users[0];
  }

  setCurrentRole(role: UserRole): SystemUser {
    const users = this.getUsers();
    // Normalize legacy roles
    const normalizedRole = role === 'consultant' ? 'consultor_staff' : role === 'client' ? 'cliente' : role;
    const matching = users.find((u) => u.role === normalizedRole);
    if (matching) {
      return this.setCurrentUser(matching.id);
    }
    return this.getCurrentUser();
  }

  updateUserRole(userId: string, newRole: UserRole): void {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.usersKey, JSON.stringify(updated));
    }
  }

  toggleUserStatus(userId: string): void {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u));
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.usersKey, JSON.stringify(updated));
    }
  }

  addUser(userData: Omit<SystemUser, 'id' | 'lastLogin'>): SystemUser {
    const newUser: SystemUser = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      lastLogin: 'Recién creado',
    };
    const users = this.getUsers();
    const updated = [...users, newUser];
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.usersKey, JSON.stringify(updated));
    }
    return newUser;
  }

  // Permissions helper
  canAccessCRM(role: UserRole): boolean {
    return ['super_admin', 'admin', 'consultor_staff', 'consultant'].includes(role);
  }

  canAccessSEO(role: UserRole): boolean {
    return ['super_admin', 'admin'].includes(role);
  }

  canManageUsers(role: UserRole): boolean {
    return ['super_admin', 'admin'].includes(role);
  }

  canSendResendEmails(role: UserRole): boolean {
    return ['super_admin', 'admin', 'consultor_staff', 'consultant'].includes(role);
  }

  canPublishBlog(role: UserRole): boolean {
    return ['super_admin', 'admin', 'consultor_staff', 'consultant'].includes(role);
  }

  canEditFinancials(role: UserRole): boolean {
    return ['super_admin', 'admin'].includes(role);
  }

  isInternalStaff(role: UserRole): boolean {
    return ['super_admin', 'admin', 'consultor_staff', 'auditor_externo', 'consultant'].includes(role);
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'super_admin':
        return 'Super Admin (Socio Titular)';
      case 'admin':
        return 'Administrador (Socio)';
      case 'consultor_staff':
      case 'consultant':
        return 'Consultor Staff Senior';
      case 'auditor_externo':
        return 'Auditor Externo';
      case 'cliente':
      case 'client':
        return 'Cliente Portal';
      default:
        return 'Usuario';
    }
  }

  getRoleBadgeColor(role: UserRole): { bg: string; text: string; border: string } {
    switch (role) {
      case 'super_admin':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'admin':
        return { bg: 'bg-[#0078D4]/10', text: 'text-[#0078D4]', border: 'border-[#0078D4]/30' };
      case 'consultor_staff':
      case 'consultant':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'auditor_externo':
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
      case 'cliente':
      case 'client':
        return { bg: 'bg-emerald-50', text: 'text-[#107C41]', border: 'border-emerald-200' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
  }
}

export const userService = new UserService();
