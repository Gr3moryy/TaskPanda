import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import WorkerRegisterPage from "./pages/WorkerRegisterPage.jsx";
import ClientRegisterPage from "./pages/ClientRegisterPage.jsx";
import ClientDashboardPage from "./pages/ClientDashboardPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/worker-register" element={<WorkerRegisterPage />} />
      <Route path="/client-register" element={<ClientRegisterPage />} />
      <Route path="/dashboard" element={<ClientDashboardPage />} />
      <Route path="/explore" element={<ExplorePage />} />
    </Routes>
  );
}
