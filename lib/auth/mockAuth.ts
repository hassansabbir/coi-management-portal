/**
 * Auth module — Supabase Auth implementation.
 *
 * This module maintains the same public API as the previous mockAuth.ts
 * so all existing page-level imports continue to work unchanged:
 *   import { login, logout, getCurrentUser, isAuthenticated, hasRole } from '@/lib/auth/mockAuth'
 *
 * Server-side session reads (API routes, Server Components) should use
 * createServerSupabaseClient() from '@/lib/supabase/server' directly.
 */

import { createClient } from '@/lib/supabase/client';
import { User, UserRole } from '@/types';

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
export async function login(email: string, password?: string): Promise<User | null> {
  if (!password) return null;

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.user) {
    return null;
  }

  // Fetch role and profile from user_profiles table
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, business_name, avatar_initials, client_id')
    .eq('id', data.user.id)
    .single();

  const role: UserRole = (profile?.role as UserRole) ?? 'client';

  const user: User = {
    id: data.user.id,
    email: data.user.email ?? '',
    name: data.user.user_metadata?.name ?? email.split('@')[0],
    role,
    businessName: profile?.business_name ?? undefined,
    avatarInitials: profile?.avatar_initials ?? email.slice(0, 2).toUpperCase(),
  };

  // Store a lightweight copy in localStorage for client-side reads
  if (typeof window !== 'undefined') {
    localStorage.setItem('ewing_coi_auth_user', JSON.stringify(user));
  }

  return user;
}

// ─────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();

  if (typeof window !== 'undefined') {
    localStorage.removeItem('ewing_coi_auth_user');
  }
}

// ─────────────────────────────────────────────────────────────
// GET CURRENT USER (client-side, from localStorage cache)
// ─────────────────────────────────────────────────────────────
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('ewing_coi_auth_user');
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasRole(requiredRole: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === requiredRole;
}

export async function getUserRole(email: string): Promise<UserRole | null> {
  const user = getCurrentUser();
  if (user?.email === email.toLowerCase()) return user.role;
  return null;
}
