import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import SocialButton from "../components/SocialButton.jsx";
import ProfessionSelector from "../components/ProfessionSelector.jsx";

export default function WorkerRegisterPage() {
  console.log("[WorkerRegisterPage] MOUNTED");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    professions: [],
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");
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
    professions: formData.professions.length === 0
      ? "Select at least one profession"
      : "",
    password: !formData.password
      ? "Password is required"
      : formData.password.length < 6
      ? "Password must be at least 6 characters"
      : "",
    "confirm-password": !formData["confirm-password"]
      ? "Please confirm your password"
      : formData["confirm-password"] !== formData.password
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
      professions: true,
      password: true,
      "confirm-password": true,
    });
    if (Object.values(errors).some((err) => err)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          professions: formData.professions,
          password: formData.password,
          role: "provider",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        login({ email: formData.email, role: "provider" }, data.token);
        navigate("/provider-dashboard");
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
    <Layout theme="green">
      {(a) => (
        <>
        <section className="flex items-center justify-center bg-white px-6 pt-16 pb-6 lg:h-full sm:px-8 md:pt-20">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex items-center gap-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 p-2 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500/40"
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
              </Link>
              <span className="text-sm font-medium text-gray-500">
                Back to role selection
              </span>
            </div>

            <div className="space-y-1 text-center">
              <h2 className="font-bold text-2xl text-green-800">
                Become a TaskPanda Worker
              </h2>
              <p className="text-sm text-gray-500">
                Set up your provider profile, showcase your trade skills, and
                start finding local jobs.
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
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 ${
                    showFieldError("fullName")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-green-200 bg-green-50/50 focus:border-green-500 focus:ring-green-500/30"
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
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 ${
                    showFieldError("email")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-green-200 bg-green-50/50 focus:border-green-500 focus:ring-green-500/30"
                  }`}
                />
                {showFieldError("email") && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="professions" className="block text-sm font-medium text-gray-700">
                  Profession / Trade
                </label>
                <ProfessionSelector
                  value={formData.professions}
                  onChange={(professions) => {
                    setFormData((prev) => ({ ...prev, professions }));
                    setTouched((prev) => ({ ...prev, professions: true }));
                  }}
                  placeholder="e.g. Carpenter, Electrician, Plumber"
                />
                {showFieldError("professions") && (
                  <p className="text-xs text-red-600">{errors.professions}</p>
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
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 ${
                    showFieldError("password")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-green-200 bg-green-50/50 focus:border-green-500 focus:ring-green-500/30"
                  }`}
                />
                {showFieldError("password") && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  autoComplete="new-password"
                  required
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  value={formData["confirm-password"]}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirm-password")}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 ${
                    showFieldError("confirm-password")
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                      : "border-green-200 bg-green-50/50 focus:border-green-500 focus:ring-green-500/30"
                  }`}
                />
                {showFieldError("confirm-password") && (
                  <p className="text-xs text-red-600">{errors["confirm-password"]}</p>
                )}
              </div>

              {(error || errors.professions) && (
                <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
                  {error || errors.professions}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg bg-gradient-to-r ${a.button} py-2.5 px-4 font-semibold text-white transition-opacity hover:brightness-110 focus:outline-none focus:ring-2 ${a.buttonHover} focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
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
              Already have an account?
              <Link to="/login" className={`font-medium ${a.link}`}>
                Log in here
              </Link>
            </div>
          </div>
        </section>
      </>
      )}
    </Layout>
  );
}