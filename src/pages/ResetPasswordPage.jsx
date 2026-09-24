import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../lib/api.js";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [tokenValid, setTokenValid] = useState(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = {
    newPassword: !formData.newPassword
      ? "Password is required"
      : formData.newPassword.length < 8
      ? "Password must be at least 8 characters"
      : !/\d/.test(formData.newPassword)
      ? "Password must contain at least one number"
      : !/[a-z]/.test(formData.newPassword)
      ? "Password must contain at least one lowercase letter"
      : !/[A-Z]/.test(formData.newPassword)
      ? "Password must contain at least one uppercase letter"
      : !/[^a-zA-Z0-9]/.test(formData.newPassword)
      ? "Password must contain at least one special character"
      : "",
    confirmPassword: !formData.confirmPassword
      ? "Please confirm your password"
      : formData.confirmPassword !== formData.newPassword
      ? "Passwords do not match"
      : "",
  };

  const showError = (field) => (touched[field] || error) && errors[field];

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("No reset token provided");
      return;
    }
    const verify = async () => {
      try {
        const data = await api.verifyResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError(err.data?.message || err.data?.errors?.join(", ") || err.message || "Reset link is invalid or has expired");
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setTouched({ newPassword: true, confirmPassword: true });
    if (errors.newPassword || errors.confirmPassword) return;
    setIsSubmitting(true);
    try {
      const data = await api.resetPassword(token, formData.newPassword);
      setMessage(data.message || "Password has been reset successfully");
      setFormData({ newPassword: "", confirmPassword: "" });
      setTouched({});
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.status === 429) {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError(err.data?.message || err.data?.errors?.join(", ") || err.message || "Something went wrong. Please try again.");
      }
      setTokenValid(false);
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
              <h2 className="font-bold text-2xl text-gray-900">Set New Password</h2>
              <p className="text-sm text-gray-600">
                Enter your new password below
              </p>
            </div>

            {tokenValid === false && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
                {error || "Reset link is invalid or has expired"}
              </div>
            )}

            {tokenValid === null && (
              <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-600" role="status">
                Verifying reset link...
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700" role="status">
                {message}
              </div>
            )}

            {tokenValid && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || errors.newPassword || errors.confirmPassword) && (
                  <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
                    {error || errors.newPassword || errors.confirmPassword}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    autoComplete="new-password"
                    required
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("newPassword")}
                    disabled={isSubmitting}
                    className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${
                      showError("newPassword")
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                        : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                    }`}
                  />
                  {showError("newPassword") && (
                    <p className="text-xs text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    disabled={isSubmitting}
                    className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${
                      showError("confirmPassword")
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                        : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                    }`}
                  />
                  {showError("confirmPassword") && (
                    <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg bg-gradient-to-r ${a.button} py-2.5 px-4 font-semibold text-white transition-opacity hover:brightness-110 focus:outline-none focus:ring-2 ${a.buttonHover} focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <div className="text-center text-sm text-gray-600">
              <Link to="/login" className={`font-medium ${a.link}`}>
                Back to Sign in
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}