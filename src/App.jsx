import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import WorkerRegisterPage from "./pages/WorkerRegisterPage.jsx";
import ClientRegisterPage from "./pages/ClientRegisterPage.jsx";
import ClientDashboardPage from "./pages/ClientDashboardPage.jsx";
import ProviderDashboardPage from "./pages/ProviderDashboardPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import ProviderBookingsPage from "./pages/ProviderBookingsPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import ProviderMessagesPage from "./pages/ProviderMessagesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProviderProfilePage from "./pages/ProviderProfilePage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/worker-register" element={<WorkerRegisterPage />} />
        <Route path="/client-register" element={<ClientRegisterPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute>
              <ProviderDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-bookings"
          element={
            <ProtectedRoute>
              <ProviderBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-messages"
          element={
            <ProtectedRoute>
              <ProviderMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-profile"
          element={
            <ProtectedRoute>
              <ProviderProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
