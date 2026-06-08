import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PendingApproval from "@/pages/PendingApproval";
import Dashboard from "@/pages/Dashboard";
import Notifications from "@/pages/Notifications";
import Templates from "@/pages/Templates";
import EmailLogs from "@/pages/EmailLogs";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import AdminPanel from "@/pages/AdminPanel";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

function App() {
  const user = useAuthStore((state) => state.user);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const loadFromFirestore = useAppStore((state) => state.loadFromFirestore);
  const clearFirestoreData = useAppStore((state) => state.clearFirestoreData);

  useEffect(() => {
    return initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      void loadFromFirestore(user);
      return;
    }

    clearFirestoreData();
  }, [clearFirestoreData, loadFromFirestore, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />
        <Route
          path="/pending"
          element={
            <>
              <Navbar />
              <PendingApproval />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          }
        />
        <Route
          path="/templates"
          element={
            <DashboardLayout>
              <Templates />
            </DashboardLayout>
          }
        />
        <Route
          path="/email-logs"
          element={
            <DashboardLayout>
              <EmailLogs />
            </DashboardLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
