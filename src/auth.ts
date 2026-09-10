import { ArtisanProfile } from './types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  artisan: ArtisanProfile;
  createdAt: string;
}

const USERS_KEY = 'kalaakar_auth_users';
const SESSION_KEY = 'kalaakar_auth_session';

const DEMO_EMAIL = 'demo@kalaakar.ai';
const DEMO_PASSWORD = 'Kalaakar@123';

const readUsers = (): AuthUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: AuthUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const hashPassword = async (password: string): Promise<string> => {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  const id = getCurrentUserId();
  if (!id) return null;
  return readUsers().find((user) => user.id === id) || null;
};

export const ensureDemoUser = async (defaultArtisan: ArtisanProfile): Promise<AuthUser> => {
  const users = readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === DEMO_EMAIL);
  if (existing) return existing;

  const demo: AuthUser = {
    id: 'user-demo',
    name: defaultArtisan.name,
    email: DEMO_EMAIL,
    passwordHash: await hashPassword(DEMO_PASSWORD),
    artisan: defaultArtisan,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, demo]);
  return demo;
};

export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  const user = readUsers().find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    throw new Error('No account found with this email.');
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    throw new Error('Incorrect password.');
  }

  localStorage.setItem(SESSION_KEY, user.id);
  return user;
};

export const signUp = async ({
  name,
  email,
  password,
  artisan,
}: {
  name: string;
  email: string;
  password: string;
  artisan: ArtisanProfile;
}): Promise<AuthUser> => {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    artisan,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
};

export const updateCurrentUser = (updates: Partial<AuthUser>): AuthUser | null => {
  const id = getCurrentUserId();
  if (!id) return null;

  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  const updated = { ...users[index], ...updates };
  users[index] = updated;
  writeUsers(users);
  return updated;
};

export const signOut = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getUserProductsKey = (userId: string) => `kalaakar_products_${userId}`;

export const getLegacyProductsKey = () => 'kalaakar_products';

export const demoCredentials = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
};
