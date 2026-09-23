import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import SocialButton from "../components/SocialButton.jsx";
import TermsModal from "../components/TermsModal.jsx";

export default function ClientRegisterPage() {
  console.log("[ClientRegisterPage] MOUNTED");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const errors = {
    fullName: !formData.fullName.trim()
      ? "Full name is required"
      : formData.fullName.trim().length < 2
      ? "Name must be at least 2 characters"
      : "",
    email: !formData.email.trim()
      ? "Email is required"
      : !emailValid(formData.email)
      ? "Please enter a valid email address"
      : "",
    password: !formData.password
      ? "Password is required"
      : formData.password.length < 6
      ? "Password must be at least 6 characters"
      : "",
    confirmPassword: !formData.confirmPassword
      ? "Please confirm your password"
      : formData.confirmPassword !== formData.password
      ? "Passwords do not match"
      : "",
  };

  const showFieldError = (field) => touched[field] && errors[field];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (Object.values(errors).some((err) => err)) return;

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "client",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        login({ email: formData.email, role: "client" }, data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout theme="primary">
      {(a) => (
        <>
        <section className="flex items-center justify-center bg-white px-6 pt-16 pb-6 lg:h-full sm:px-8 md:pt-20">
          <div className="w-full max-w-sm space-y-6">
            <div className="mb-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center rounded-lg border border-primary-200 bg-primary-50 p-2 text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                aria-label="Back to role selection"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-500">Back to role selection</span>
            </div>

            <div className="space-y-1 text-center">
              <h2 className="font-bold text-2xl text-gray-900">
                Create your client account
              </h2>
              <p className="text-sm text-gray-600">
                Sign up to start finding and hiring trusted mechanics, plumbers,
                electricians, and more for your home.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  placeholder="Jane Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("fullName")}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    showFieldError("fullName")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                  }`}
                />
                {showFieldError("fullName") && (
                  <p className="text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
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
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    showFieldError("email")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                  }`}
                />
                {showFieldError("email") && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    showFieldError("password")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                  }`}
                />
                {showFieldError("password") && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    showFieldError("confirmPassword")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-primary-200 bg-primary-50/50 focus:border-primary-500 focus:ring-primary-500/30"
                  }`}
                />
                {showFieldError("confirmPassword") && (
                  <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
                {error}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="font-medium text-primary-600 hover:text-primary-800 underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="font-medium text-primary-600 hover:text-primary-800 underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreedToTerms || isSubmitting}
                className={`w-full rounded-lg bg-gradient-to-r ${a.button} px-4 py-2.5 font-semibold text-white transition-opacity hover:brightness-110 focus:outline-none focus:ring-2 ${a.buttonHover} focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:col-span-2`}
              >
                {isSubmitting ? "Signing up..." : "Next"}
              </button>
            </form>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="h-px flex-1 bg-gray-200"></span>
              <span>Or Sign up with</span>
              <span className="h-px flex-1 bg-gray-200"></span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton provider="google" />
              <SocialButton provider="facebook" />
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className={`font-medium ${a.link}`}>
                Log in here
              </Link>
            </div>
          </div>
        </section>
        <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      </>
      )}
    </Layout>
  );
}
