import { User, UserRole } from '@/types';

// Mock users dictionary
const MOCK_USERS: Record<string, User> = {
  'admin@coiplatform.com': {
    id: 'user-admin-1',
    email: 'admin@coiplatform.com',
    name: 'Admin User',
    role: 'admin',
    avatarInitials: 'AU',
  },
  'admin@ewing.com': {
    id: 'user-admin-2',
    email: 'admin@ewing.com',
    name: 'Admin User',
    role: 'admin',
    avatarInitials: 'AU',
  },
  'jordan@riverside.com': {
    id: 'user-client-1',
    email: 'jordan@riverside.com',
    name: 'Jordan',
    role: 'client',
    businessName: 'Riverside Contractors Inc.',
    avatarInitials: 'JS',
  },
  'client@company.com': {
    id: 'user-client-2',
    email: 'client@company.com',
    name: 'Jordan',
    role: 'client',
    businessName: 'Riverside Contractors Inc.',
    avatarInitials: 'JS',
  },
};

const SESSION_KEY = 'ewing_coi_auth_user';

/**
 * Isolated role detection logic.
 * When integrating Supabase Auth in the future, only this module will change.
 */
export async function getUserRole(email: string, password?: string): Promise<UserRole | null> {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (MOCK_USERS[normalizedEmail]) {
    return MOCK_USERS[normalizedEmail].role;
  }

  // Fallback pattern matching for testing arbitrary emails
  if (normalizedEmail.includes('admin')) {
    return 'admin';
  }
  
  if (normalizedEmail.length > 0) {
    return 'client';
  }

  return null;
}

export async function login(email: string, password?: string): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  let user: User;

  if (MOCK_USERS[normalizedEmail]) {
    user = MOCK_USERS[normalizedEmail];
  } else {
    const role = await getUserRole(email, password);
    if (!role) return null;

    if (role === 'admin') {
      user = {
        id: `admin-${Date.now()}`,
        email: normalizedEmail,
        name: 'Admin User',
        role: 'admin',
        avatarInitials: 'AU',
      };
    } else {
      user = {
        id: `client-${Date.now()}`,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0] || 'Client User',
        role: 'client',
        businessName: 'Client Business Inc.',
        avatarInitials: 'CU',
      };
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    // Set simple cookie for SSR/middleware checks
    document.cookie = `coi_user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
  }

  return user;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = 'coi_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasRole(requiredRole: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === requiredRole;
}
