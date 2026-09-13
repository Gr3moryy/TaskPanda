import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import FloatingAuthCard from "./FloatingAuthCard.jsx";

export default function GuestGuard({ children }) {
  const { isLoggedIn, isGuest } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn || isGuest) {
      setShowAuth(false);
      return;
    }

    function handleClick(e) {
      if (isLoggedIn || isGuest) return;

      const target = e.target;

      if (target.closest("header")) return;

      if (target.closest("[data-auth-card]")) return;

      if (!target.closest("[data-auth-action]")) return;

      e.preventDefault();
      e.stopPropagation();
      setShowAuth(true);
    }

    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [isLoggedIn, isGuest]);

  const handleLogin = () => {
    setShowAuth(false);
    navigate("/login");
  };

  const handleRegister = () => {
    setShowAuth(false);
    navigate("/register");
  };

  return (
    <>
      {children}
      <FloatingAuthCard
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  );
}
