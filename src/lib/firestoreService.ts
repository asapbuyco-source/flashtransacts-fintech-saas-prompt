import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/store/authStore";
import type { EmailLog, Notification, PlatformSettings, SubscriptionRequest, Template } from "@/store/appStore";

type CollectionName = "users" | "notifications" | "templates" | "emailLogs" | "subscriptionRequests";

type FirestoreRecord = {
  id: string;
};

export type FirestoreSnapshot = {
  users: User[];
  notifications: Notification[];
  templates: Template[];
  emailLogs: EmailLog[];
  subscriptionRequests: SubscriptionRequest[];
  platformSettings: PlatformSettings | null;
};

const defaultPlatformSettings: PlatformSettings = {
  adminWhatsApp: "",
  currencyLabel: "CFA",
};

export function isAdminUser(user: User | null | undefined) {
  return user?.role === "admin" || user?.role === "super_admin";
}

async function listCollection<T extends FirestoreRecord>(name: CollectionName) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

async function listOwnedCollection<T extends FirestoreRecord>(name: CollectionName, ownerField: string, ownerId: string) {
  const snapshot = await getDocs(query(collection(db, name), where(ownerField, "==", ownerId)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

export async function upsertRecord<T extends FirestoreRecord>(name: CollectionName, item: T) {
  await setDoc(doc(db, name, item.id), item, { merge: true });
}

export async function patchRecord<T extends object>(name: CollectionName, id: string, updates: T) {
  await updateDoc(doc(db, name, id), updates);
}

export async function removeRecord(name: CollectionName, id: string) {
  await deleteDoc(doc(db, name, id));
}

export async function getUserById(id: string) {
  const snapshot = await getDoc(doc(db, "users", id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as User) : null;
}

export async function createUserProfile(user: User) {
  await setDoc(doc(db, "users", user.id), user);
}

export async function ensureGoogleUserProfile(user: User) {
  const existing = await getUserById(user.id);
  if (existing) {
    return existing;
  }

  await createUserProfile(user);
  return user;
}

export async function savePlatformSettings(settings: PlatformSettings) {
  await setDoc(doc(db, "platformSettings", "global"), settings, { merge: true });
}

async function getPlatformSettings() {
  const snapshot = await getDoc(doc(db, "platformSettings", "global"));
  return snapshot.exists() ? (snapshot.data() as PlatformSettings) : defaultPlatformSettings;
}

export async function loadFirestoreSnapshot(user: User) {
  const isAdmin = isAdminUser(user);

  const [users, notifications, templates, emailLogs, subscriptionRequests, platformSettings] = await Promise.all([
    isAdmin ? listCollection<User>("users") : Promise.resolve([user]),
    isAdmin
      ? listCollection<Notification>("notifications")
      : listOwnedCollection<Notification>("notifications", "createdBy", user.id),
    listCollection<Template>("templates"),
    isAdmin
      ? listCollection<EmailLog>("emailLogs")
      : listOwnedCollection<EmailLog>("emailLogs", "createdBy", user.id),
    isAdmin
      ? listCollection<SubscriptionRequest>("subscriptionRequests")
      : listOwnedCollection<SubscriptionRequest>("subscriptionRequests", "userId", user.id),
    getPlatformSettings(),
  ]);

  return {
    users,
    notifications,
    templates,
    emailLogs,
    subscriptionRequests,
    platformSettings,
  };
}
