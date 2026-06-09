import { create } from "zustand";
import { persist } from "zustand/middleware";
import { activityLogs } from "@/lib/data";
import type { User, UserStatus } from "@/store/authStore";
import {
  loadFirestoreSnapshot,
  patchRecord,
  removeRecord,
  savePlatformSettings,
  upsertRecord,
} from "@/lib/firestoreService";

export interface Notification {
  id: string;
  recipient: string;
  recipientName: string;
  amount: string;
  currency: string;
  type: string;
  status: "draft" | "pending" | "delivered" | "failed";
  date: string;
  brand: string;
  reference?: string;
  description?: string;
  transactionId?: string;
  notes?: string;
  metadata?: Record<string, string>;
  createdBy?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  brand: string;
  status: "active" | "draft" | "archived";
  usage: number;
  content?: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: "delivered" | "pending" | "failed";
  timestamp: string;
  opened: boolean;
  clicked: boolean;
  notificationId?: string;
  brand?: string;
  amount?: string;
  metadata?: Record<string, string>;
  createdBy?: string;
}

export interface PlatformSettings {
  adminWhatsApp: string;
  currencyLabel: string;
}

export interface SubscriptionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  price: string;
  status: "open" | "completed";
  createdAt: string;
}

interface AppState {
  notifications: Notification[];
  templates: Template[];
  emailLogs: EmailLog[];
  users: User[];
  activities: typeof activityLogs;
  platformSettings: PlatformSettings;
  subscriptionRequests: SubscriptionRequest[];
  isFirestoreLoading: boolean;
  firestoreError: string | null;
  loadFromFirestore: (user: User) => Promise<void>;
  clearFirestoreData: () => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  addEmailLog: (log: EmailLog) => void;
  updateEmailLog: (id: string, updates: Partial<EmailLog>) => void;
  addUser: (user: User) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  updateUserSubscription: (id: string, updates: Pick<User, "status" | "subscriptionEnd" | "subscriptionType">) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  addSubscriptionRequest: (request: SubscriptionRequest) => void;
  completeSubscriptionRequest: (id: string) => void;
}

const defaultPlatformSettings = {
  adminWhatsApp: "237690000000",
  currencyLabel: "CFA",
};

const reportFirestoreError = (error: unknown) => {
  console.error("Firestore operation failed", error);
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      notifications: [],
      templates: [],
      emailLogs: [],
      users: [],
      activities: activityLogs,
      platformSettings: defaultPlatformSettings,
      subscriptionRequests: [],
      isFirestoreLoading: false,
      firestoreError: null,

      loadFromFirestore: async (user) => {
        set({ isFirestoreLoading: true, firestoreError: null });
        try {
          const snapshot = await loadFirestoreSnapshot(user);

          set({
            users: snapshot.users,
            notifications: snapshot.notifications,
            templates: snapshot.templates,
            emailLogs: snapshot.emailLogs,
            subscriptionRequests: snapshot.subscriptionRequests,
            platformSettings: snapshot.platformSettings || defaultPlatformSettings,
            isFirestoreLoading: false,
          });
        } catch (error) {
          set({
            isFirestoreLoading: false,
            firestoreError: error instanceof Error ? error.message : "Unable to load Firestore data",
          });
          reportFirestoreError(error);
        }
      },

      clearFirestoreData: () => {
        set({
          notifications: [],
          templates: [],
          emailLogs: [],
          users: [],
          subscriptionRequests: [],
          platformSettings: defaultPlatformSettings,
          firestoreError: null,
          isFirestoreLoading: false,
        });
      },

      addNotification: (notification) => {
        void upsertRecord("notifications", notification).catch(reportFirestoreError);
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      updateNotification: (id, updates) => {
        void patchRecord("notifications", id, updates).catch(reportFirestoreError);
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        }));
      },

      addTemplate: (template) => {
        void upsertRecord("templates", template).catch(reportFirestoreError);
        set((state) => ({
          templates: [template, ...state.templates],
        }));
      },

      updateTemplate: (id, updates) => {
        void patchRecord("templates", id, updates).catch(reportFirestoreError);
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        void removeRecord("templates", id).catch(reportFirestoreError);
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },

      addEmailLog: (log) => {
        void upsertRecord("emailLogs", log).catch(reportFirestoreError);
        set((state) => ({
          emailLogs: [log, ...state.emailLogs],
        }));
      },

      updateEmailLog: (id, updates) => {
        void patchRecord("emailLogs", id, updates).catch(reportFirestoreError);
        set((state) => ({
          emailLogs: state.emailLogs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          ),
        }));
      },

      addUser: (user) => {
        void upsertRecord("users", user).catch(reportFirestoreError);
        set((state) => ({
          users: state.users.some((u) => u.email === user.email) ? state.users : [user, ...state.users],
        }));
      },

      updateUserStatus: (id, status) => {
        void patchRecord("users", id, { status }).catch(reportFirestoreError);
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status } : u
          ),
        }));
      },

      updateUserSubscription: (id, updates) => {
        void patchRecord("users", id, updates).catch(reportFirestoreError);
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        }));
      },

      updatePlatformSettings: (settings) => {
        const platformSettings = { ...get().platformSettings, ...settings };
        void savePlatformSettings(platformSettings).catch(reportFirestoreError);
        set({ platformSettings });
      },

      addSubscriptionRequest: (request) => {
        void upsertRecord("subscriptionRequests", request).catch(reportFirestoreError);
        set((state) => ({
          subscriptionRequests: state.subscriptionRequests.some(
            (item) => item.userId === request.userId && item.plan === request.plan && item.status === "open"
          )
            ? state.subscriptionRequests
            : [request, ...state.subscriptionRequests],
        }));
      },

      completeSubscriptionRequest: (id) => {
        void patchRecord("subscriptionRequests", id, { status: "completed" }).catch(reportFirestoreError);
        set((state) => ({
          subscriptionRequests: state.subscriptionRequests.map((request) =>
            request.id === id ? { ...request, status: "completed" } : request
          ),
        }));
      },
    }),
    {
      name: "flashtransacts-app-v2",
      partialize: () => ({}),
    }
  )
);
