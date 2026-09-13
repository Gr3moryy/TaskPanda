import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function FloatingAuthCard({ show, onClose, onLogin, onRegister }) {
  const { isLoggedIn, browseAsGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (show && !isLoggedIn) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [show, isLoggedIn, onClose]);

  if (isLoggedIn || !show) return null;

  const handleGuest = () => {
    browseAsGuest();
    navigate("/dashboard");
  };

  return (
    <div
      data-auth-card
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-2xl">&#128274;</div>
          <h3 className="mt-3 text-lg font-bold text-gray-900">Sign in to continue</h3>
          <p className="mt-1 text-sm text-gray-500">Create an account or log in to book services, message pros, and manage bookings.</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => {
              onLogin();
            }}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Log in
          </button>
          <button
            onClick={() => {
              onRegister();
            }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Register
          </button>
        </div>
        <button
          onClick={handleGuest}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          Continue browsing as guest
        </button>
      </div>
    </div>
  );
}
