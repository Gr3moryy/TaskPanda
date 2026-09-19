import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import WorkerRegisterPage from "./pages/WorkerRegisterPage.jsx";
import WorkerRegisterLocation from "./pages/WorkerRegisterLocation.jsx";
import ClientRegisterPage from "./pages/ClientRegisterPage.jsx";
import ClientRegisterLocation from "./pages/ClientRegisterLocation.jsx";
import ClientDashboardPage from "./pages/ClientDashboardPage.jsx";
import ProviderDashboardPage from "./pages/ProviderDashboardPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import ProviderBookingsPage from "./pages/ProviderBookingsPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import ProviderMessagesPage from "./pages/ProviderMessagesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import ProviderProfilePage from "./pages/ProviderProfilePage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import CareersPage from "./pages/CareersPage.jsx";
import HelpCenterPage from "./pages/HelpCenterPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import VerificationPage from "./pages/VerificationPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Footer from "./components/Footer.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.message || "Unknown error"}
            {"\n\n"}
            {this.state.error?.stack || ""}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 20px", marginTop: "10px" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const authRoutes = ["/login", "/register", "/worker-register", "/worker-register/location", "/client-register", "/client-register/location", "/admin"];

export default function App() {
  const location = useLocation();
  console.log("[App] rendering at:", location.pathname);
  const showFooter = !authRoutes.includes(location.pathname);
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/worker-register" element={<WorkerRegisterPage />} />
        <Route path="/worker-register/location" element={<WorkerRegisterLocation />} />
        <Route path="/client-register" element={<ClientRegisterPage />} />
        <Route path="/client-register/location" element={<ClientRegisterLocation />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ClientDashboardPage />} />
        <Route path="/provider-dashboard" element={<ProviderDashboardPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/provider-bookings" element={<ProviderBookingsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/provider-messages" element={<ProviderMessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/provider-profile" element={<ProviderProfilePage />} />
        <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/careers" element={<CareersPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/profile/verify" element={<VerificationPage />} />
      </Routes>
      </ErrorBoundary>
      {showFooter && <Footer />}
    </AuthProvider>
  );
}
