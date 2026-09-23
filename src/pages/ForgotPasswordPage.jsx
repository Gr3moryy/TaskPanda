import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const errors = {
    email: !formData.email.trim()
      ? "Email is required"
      : !emailValid(formData.email)
      ? "Please enter a valid email address"
      : "",
  };

  const showError = (field) => (touched[field] || error) && errors[field];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setTouched({ email: true });
    if (errors.email) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessage(data.message || "If an account with that email exists, a password reset link has been sent");
        setFormData({ email: "" });
        setTouched({});
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout theme="primary">
      {(a) => (
        <section className="flex items-center justify-center bg-white px-6 pt-16 pb-6 lg:h-full sm:px-8 md:pt-20">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="font-bold text-2xl text-gray-900">Forgot Password?</h2>
              <p className="text-sm text-gray-600">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || errors.email) && (
                <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
                  {error || errors.email}
                </div>
              )}
              {message && (
                <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700" role="status">
                  {message}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  disabled={isSubmitting}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${
                    showError("email")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                  }`}
                />
                {showError("email") && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg bg-gradient-to-r ${a.button} py-2.5 px-4 font-semibold text-white transition-opacity hover:brightness-110 focus:outline-none focus:ring-2 ${a.buttonHover} focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Remembered your password?
              <Link to="/login" className={`font-medium ${a.link}`}>
                {" "}Sign in
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}