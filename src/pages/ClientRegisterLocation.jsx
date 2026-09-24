import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import SocialButton from "../components/SocialButton.jsx";
import TermsModal from "../components/TermsModal.jsx";
import PHLocationPicker from "../components/PHLocationPicker.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../lib/api.js";

export default function ClientRegisterLocation() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    provinceCode: "",
    cityCode: "",
    province: "",
    city: "",
    barangay: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (!formData.provinceCode || !formData.cityCode || !formData.barangayCode) {
      setError("Please select your complete location.");
      return;
    }

    const step1Raw = sessionStorage.getItem("clientStep1");
    if (!step1Raw) {
      setError("Session expired. Please start registration again.");
      return;
    }

    const step1 = JSON.parse(step1Raw);
    const payload = {
      ...step1,
      province: formData.province,
      city: formData.city,
      barangay: formData.barangay,
      barangayCode: formData.barangayCode,
      address: formData.address,
      role: "client",
    };

    setIsSubmitting(true);
    try {
      const data = await api.registerComplete(payload);
      console.log("Register response:", data);
      sessionStorage.removeItem("clientStep1");
      login({ email: formData.email || step1.email, role: "client" }, data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.data?.message || err.data?.errors?.join(", ") || err.message || "Registration failed. Please try again.");
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
            <div className="flex items-center gap-2">
              <Link
                to="/client-register"
                className="inline-flex items-center justify-center rounded-lg border border-primary-200 bg-primary-50 p-2 text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                aria-label="Back to step 1"
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
              </Link>
              <span className="text-sm font-medium text-gray-500">
                Back to step 1
              </span>
            </div>

            <div className="space-y-1 text-center">
              <h2 className="font-bold text-2xl text-gray-900">
                Where Are You Located?
              </h2>
              <p className="text-sm text-gray-500">
                Tell us your address so we can match you with nearby providers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <PHLocationPicker
                formData={formData}
                setFormData={setFormData}
                accent="primary"
              />

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Block, Lot, Unit (optional)"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="block w-full rounded-lg border border-primary-200 bg-primary-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400/70 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms2"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="agreeTerms2" className="text-sm text-gray-600">
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
                disabled={!agreedToTerms}
                className={`w-full rounded-lg bg-gradient-to-r ${a.button} py-2.5 px-4 font-semibold text-white transition-opacity hover:brightness-110 focus:outline-none focus:ring-2 ${a.buttonHover} focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Complete Sign up
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
