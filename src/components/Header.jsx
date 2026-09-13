import { useState } from "react";

export default function Header({ logoColor = "text-primary-700", showNav = false, activeTab = "Home" }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", icon: "🏠", path: "/dashboard" },
    { label: "Explore", icon: "🔍", path: "/explore" },
    { label: "Bookings", icon: "📋", path: "/bookings" },
    { label: "Messages", icon: "💬", path: "/messages" },
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
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === link.label
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {showNav && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mr-1 inline-flex items-center justify-center rounded-lg p-2 text-gray-600 md:hidden hover:bg-gray-100"
              aria-label="Toggle navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                {mobileOpen ? (
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M3 6a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6zm0 6a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                )}
              </svg>
            </button>
          )}
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
      {mobileOpen && showNav && (
        <div className="absolute inset-x-0 top-16 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  activeTab === link.label
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
