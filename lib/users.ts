// Local user store — persists registered users in localStorage
// In production this would be replaced by a real database

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string; // base64 encoded (simple client-side, replace with bcrypt + API in prod)
  college: string;
  role: "user" | "admin";
  createdAt: string;
}

function getStore(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("dv_users") || "[]");
  } catch { return []; }
}

function saveStore(users: StoredUser[]) {
  localStorage.setItem("dv_users", JSON.stringify(users));
}

// Simple hash (not cryptographic — use bcrypt + server in production)
function hashPassword(password: string): string {
  return btoa(encodeURIComponent(password + "_dv_salt_2026"));
}

function checkPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function registerUser(
  fullName: string,
  email: string,
  password: string,
  college: string
): { success: boolean; error?: string } {
  const users = getStore();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { success: false, error: "An account with this email already exists." };

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    fullName,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    college,
    role: "user",
    createdAt: new Date().toISOString()
  };

  saveStore([...users, newUser]);
  return { success: true };
}

export function loginUser(
  email: string,
  password: string,
  role: "user" | "admin"
): { success: boolean; user?: StoredUser; error?: string } {
  // Built-in admin account
  if (
    role === "admin" &&
    email.toLowerCase() === "admin@dataverse.ai" &&
    password === "Admin@123"
  ) {
    return {
      success: true,
      user: {
        id: "admin-001",
        fullName: "Admin",
        email: "admin@dataverse.ai",
        passwordHash: "",
        college: "DataVerse AI",
        role: "admin",
        createdAt: "2026-01-01"
      }
    };
  }

  const users = getStore();
  const user = users.find(u => u.email === email.toLowerCase());

  if (!user) return { success: false, error: "No account found with this email. Please sign up first." };
  if (!checkPassword(password, user.passwordHash)) return { success: false, error: "Incorrect password." };
  if (user.role !== role) return { success: false, error: `This account is registered as a ${user.role}, not ${role}.` };

  return { success: true, user };
}

export function getAllUsers(): StoredUser[] {
  return getStore();
}
