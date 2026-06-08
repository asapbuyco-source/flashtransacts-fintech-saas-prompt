import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Unsubscribe,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserProfile, ensureGoogleUserProfile, getUserById, upsertRecord } from "@/lib/firestoreService";

export type UserRole = "super_admin" | "admin" | "moderator" | "user";
export type UserStatus = "pending" | "active" | "suspended" | "expired";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  subscriptionEnd?: string;
  subscriptionType?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  initializeAuth: () => Unsubscribe;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string; user?: User }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const newUserProfile = (id: string, name: string, email: string, avatar?: string): User => {
  const profile: User = {
    id,
    name,
    email,
    role: "user",
    status: "expired",
    createdAt: new Date().toISOString().split("T")[0],
    subscriptionType: "",
    subscriptionEnd: "",
  };

  if (avatar) {
    profile.avatar = avatar;
  }

  return profile;
};

const friendlyAuthError = (error: unknown) => {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("invalid-credential") || code.includes("user-not-found") || code.includes("wrong-password")) {
    return "Invalid email or password";
  }
  if (code.includes("email-already-in-use")) {
    return "This email is already registered";
  }
  if (code.includes("popup-closed-by-user")) {
    return "Google sign-in was closed before it finished";
  }
  return "Authentication failed. Please try again.";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAuthLoading: true,

      initializeAuth: () =>
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            set({ user: null, isAuthenticated: false, isAuthLoading: false });
            return;
          }

          try {
            const profile = await getUserById(firebaseUser.uid);
            if (profile) {
              set({ user: profile, isAuthenticated: true, isAuthLoading: false });
              return;
            }

            const fallbackProfile = newUserProfile(
              firebaseUser.uid,
              firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              firebaseUser.email || "",
              firebaseUser.photoURL || undefined
            );
            const createdProfile = await ensureGoogleUserProfile(fallbackProfile);
            set({ user: createdProfile, isAuthenticated: true, isAuthLoading: false });
          } catch (error) {
            console.error("Unable to initialize Firebase Auth profile", error);
            set({ user: null, isAuthenticated: false, isAuthLoading: false });
          }
        }),

      login: async (email: string, password: string) => {
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          const profile = await getUserById(credential.user.uid);
          if (!profile) {
            await signOut(auth);
            return { success: false, message: "No Firestore profile exists for this account" };
          }

          set({ user: profile, isAuthenticated: true, isAuthLoading: false });
          return { success: true, message: "Login successful" };
        } catch (error) {
          return { success: false, message: friendlyAuthError(error) };
        }
      },

      loginWithGoogle: async () => {
        try {
          const credential = await signInWithPopup(auth, googleProvider);
          const profile = newUserProfile(
            credential.user.uid,
            credential.user.displayName || credential.user.email?.split("@")[0] || "User",
            credential.user.email || "",
            credential.user.photoURL || undefined
          );
          const user = await ensureGoogleUserProfile(profile);
          set({ user, isAuthenticated: true, isAuthLoading: false });
          return { success: true, message: "Google login successful", user };
        } catch (error) {
          return { success: false, message: friendlyAuthError(error) };
        }
      },

      register: async (name: string, email: string, password: string) => {
        if (password.length < 6) {
          return { success: false, message: "Password must be at least 6 characters" };
        }

        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(credential.user, { displayName: name });
          const newUser = newUserProfile(credential.user.uid, name, email);
          await createUserProfile(newUser);
          set({ user: newUser, isAuthenticated: true, isAuthLoading: false });
          return { success: true, message: "Account created. Contact the admin on WhatsApp to activate a subscription.", user: newUser };
        } catch (error) {
          return { success: false, message: friendlyAuthError(error) };
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false, isAuthLoading: false });
      },

      updateUser: (updates: Partial<User>) => {
        const current = get().user;
        if (current) {
          const nextUser = { ...current, ...updates };
          void upsertRecord("users", nextUser).catch((error) => {
            console.error("Unable to update Firestore user", error);
          });
          set({ user: nextUser });
        }
      },
    }),
    {
      name: "flashtransacts-auth-v2",
      partialize: () => ({}),
    }
  )
);
