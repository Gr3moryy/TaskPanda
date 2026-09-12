import { useState } from "react";

export default function Header({ logoColor = "text-primary-700", showNav = false }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Home", icon: "🏠", path: "/dashboard" },
    { label: "Explore", icon: "🔍", path: "/dashboard" },
    { label: "Bookings", icon: "📋", path: "/dashboard" },
    { label: "Messages", icon: "💬", path: "/dashboard" },
    { label: "Profile", icon: "👤", path: "/dashboard" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a href="/" className={`text-2xl font-extrabold tracking-tight ${logoColor}`}>
            <span className="text-black">Task</span>Panda
          </a>
          {showNav && (
            <span className="hidden rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 sm:inline-flex">
              📍 Dagupan City, Pangasinan
            </span>
          )}
        </div>

        {showNav && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {showNav && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm"
              >
                <span className="hidden text-gray-600 sm:inline">Good morning, Miguel!</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  M
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                    Dashboard
                  </a>
                  <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
