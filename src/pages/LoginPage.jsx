import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import SocialButton from "../components/SocialButton.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: formData.remember,
        }),
      });
      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Layout theme="primary">
      {(a) => (
        <section className="flex items-center justify-center bg-white px-6 pt-16 pb-6 lg:h-full sm:px-8 md:pt-20">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="font-bold text-2xl text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-600">
                Sign in to continue to your TaskPanda account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email or Username
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  required
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-primary-200 bg-primary-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-primary-200 bg-primary-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember || false}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg bg-gradient-to-r ${a.button} py-2.5 px-4 font-semibold text-white transition-opacity hover:brightness-110 focus:outline-none focus:ring-2 ${a.buttonHover} focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="h-px flex-1 bg-gray-200"></span>
              <span>Or continue with</span>
              <span className="h-px flex-1 bg-gray-200"></span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton provider="google" />
              <SocialButton provider="facebook" />
            </div>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?
              <a href="/register" className={`font-medium ${a.link}`}>
                Register
              </a>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
