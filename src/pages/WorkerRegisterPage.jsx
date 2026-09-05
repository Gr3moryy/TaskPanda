import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import SocialButton from "../components/SocialButton.jsx";

export default function WorkerRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    "confirm-password": "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData["confirm-password"]) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "provider",
        }),
      });
      if (response.ok) {
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout theme="green">
      {(a) => (
        <section className="flex items-center justify-center bg-white px-6 pt-16 pb-6 lg:h-full sm:px-8 md:pt-20">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex items-center gap-2">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 p-2 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                aria-label="Back to role selection"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
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
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
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
                  className="block w-full rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
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
                  className="block w-full rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
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
                  className="block w-full rounded-lg border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
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
              <a href="/login" className={`font-medium ${a.link}`}>
                Log in here
              </a>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
