import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function VerificationPage() {
  const navigate = useNavigate();
  const { verify } = useAuth();
  const [formData, setFormData] = useState({
    validId: "",
    certificate: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.validId.trim()) {
      setError("A valid ID is required for verification");
      return;
    }

    verify();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <Header showNav activeTab="Profile" />

      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
          Back to Profile
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl">
            🪪
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Identity Verification</h1>
          <p className="mt-2 text-sm text-gray-500">
            Submit a valid ID to unlock all features on TaskPanda
          </p>
        </div>

        {submitted && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center animate-fade-in">
            <span className="text-lg">✅</span>
            <p className="mt-1 text-sm font-medium text-green-800">Verification submitted! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Valid ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="validId"
              value={formData.validId}
              onChange={handleChange}
              required
              placeholder="e.g. PhilSys ID, Passport, Driver's License"
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              A valid government-issued ID is required
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trade Certificate <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              name="certificate"
              value={formData.certificate}
              onChange={handleChange}
              placeholder="e.g. TESDA NC II, Diploma URL"
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              Provide your trade certification if available
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Submit Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
