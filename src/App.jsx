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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/worker-register" element={<WorkerRegisterPage />} />
      <Route path="/client-register" element={<ClientRegisterPage />} />
      <Route path="/dashboard" element={<ClientDashboardPage />} />
      <Route path="/provider-dashboard" element={<ProviderDashboardPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/provider-bookings" element={<ProviderBookingsPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/provider-messages" element={<ProviderMessagesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/provider-profile" element={<ProviderProfilePage />} />
      <Route path="/explore" element={<ExplorePage />} />
    </Routes>
  );
}
