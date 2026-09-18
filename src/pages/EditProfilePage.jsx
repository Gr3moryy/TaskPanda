import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "Miguel",
    username: "miguel",
    email: "miguel@example.com",
    phone: "+63 912 345 6789",
    location: "Dagupan City, Pangasinan",
    bio: "Homeowner based in Dagupan. Looking for reliable local tradespeople for home repairs and maintenance.",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/profile");
    }, 1500);
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

        {/* User Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 ring-4 ring-primary-50">
            {form.fullName.charAt(0)}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500">Update your personal information</p>
        </div>

        {saved && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center animate-fade-in">
            <span className="text-lg">✅</span>
            <p className="mt-1 text-sm font-medium text-green-800">Profile saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
