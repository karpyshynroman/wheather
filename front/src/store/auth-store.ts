import { create } from 'zustand';
import type { AuthSession, AuthUser } from '../lib/auth-types';

const STORAGE_KEY = 'weather-auth-session';

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  markHydrated: () => void;
}

function readSession(): Pick<AuthStore, 'token' | 'user'> {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.accessToken || !parsed.user?.email || !parsed.user?.id) {
      return { token: null, user: null };
    }

    return { token: parsed.accessToken, user: parsed.user };
  } catch {
    return { token: null, user: null };
  }
}

function persistSession(token: string | null, user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!token || !user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: token,
        user,
      }),
    );
  } catch {
    // Ignore storage errors.
  }
}

const initialSession = readSession();

export const useAuthStore = create<AuthStore>((set) => ({
  token: initialSession.token,
  user: initialSession.user,
  hydrated: false,
  setSession: (session) => {
    persistSession(session.accessToken, session.user);
    set({ token: session.accessToken, user: session.user });
  },
  clearSession: () => {
    persistSession(null, null);
    set({ token: null, user: null });
  },
  markHydrated: () => set({ hydrated: true }),
}));
