import { useState, useRef } from "react";
import Header from "./Header.jsx";
import { categories as dashboardCategories } from "./ClientDashboard.jsx";

const catPills = [
  { name: "All Services" },
  ...dashboardCategories.slice(1).map((c) => ({ name: c.name })),
];

const filterCategories = [...dashboardCategories.slice(1)].sort((a, b) => a.name.localeCompare(b.name));

const providers = [
  {
    name: "Sweetie Palm",
    trade: "Carpentry",
    cred: "TESDA NC II Carpentry",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 4.8,
    reviews: 12,
    color: "bg-emerald-100 text-emerald-700",
    banner: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Pedro Cruz",
    trade: "Plumbing",
    cred: "TESDA NC II Plumbing",
    bio: "Experienced plumber with 10+ years serving Dagupan households for all pipe and water needs.",
    rating: 4.6,
    reviews: 28,
    color: "bg-blue-100 text-blue-700",
    banner: "from-blue-400 to-blue-600",
  },
  {
    name: "Maria Santos",
    trade: "Electrical",
    cred: "TESDA NC II Electrical",
    bio: "Certified electrician specializing in residential wiring, panel upgrades, and circuit troubleshooting.",
    rating: 4.9,
    reviews: 35,
    color: "bg-amber-100 text-amber-700",
    banner: "from-amber-400 to-amber-600",
  },
  {
    name: "Juan Dela Cruz",
    trade: "AC Repair",
    cred: "TESDA NC II AC Technician",
    bio: "AC maintenance and repair specialist. Quick response and honest pricing for all brands.",
    rating: 4.5,
    reviews: 19,
    color: "bg-cyan-100 text-cyan-700",
    banner: "from-cyan-400 to-cyan-600",
  },
  {
    name: "Ana Reyes",
    trade: "Painting",
    cred: "Professional Painter",
    bio: "Interior and exterior painting services. Clean finish, on-time delivery, competitive rates.",
    rating: 4.7,
    reviews: 14,
    color: "bg-rose-100 text-rose-700",
    banner: "from-rose-400 to-rose-600",
  },
  {
    name: "Ricky Padilla",
    trade: "Landscaping",
    cred: "Licensed Landscaper",
    bio: "Lawn care, garden design, tree trimming, and hardscaping for homes and businesses.",
    rating: 4.3,
    reviews: 9,
    color: "bg-green-100 text-green-700",
    banner: "from-green-400 to-green-600",
  },
];

function StarIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

function CheckBox({ label, count, defaultChecked = false }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">[{count}]</span>
      )}
    </label>
  );
}

export default function Explore() {
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [activePill, setActivePill] = useState("Carpentry");
  const [showAllCats, setShowAllCats] = useState(false);
  const pillRef = useRef(null);
  const visibleCats = showAllCats ? filterCategories : filterCategories.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header showNav activeTab="Explore" />

      {/* Hero Search Section */}
      <div className="relative mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-slate-700 to-slate-800 px-6 py-10 sm:px-10 sm:py-12">
          {/* Decorative background elements */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/5" />

          {/* Panda mascot peeking out */}
          <div className="pointer-events-none absolute -bottom-4 -right-2 hidden h-48 w-40 overflow-hidden sm:block md:right-8">
            <img
              src="/assets/Panda Cropped.png"
              alt="TaskPanda mascot"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Discover Local Professionals
            </h1>
            <p className="mt-3 text-base leading-relaxed text-teal-100/80">
              Find trusted experts for carpentry, plumbing, cleaning, and
              more.
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex items-center overflow-hidden rounded-xl bg-white shadow-lg">
              <input
                type="text"
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                placeholder="What services do you need?"
                className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
              <div className="h-8 w-px bg-gray-200" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Dagupan City"
                className="w-36 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none sm:w-44"
              />
              <button className="shrink-0 bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mx-auto mt-4 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">
          <button
            onClick={() => pillRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
            className="z-10 mr-1 hidden shrink-0 rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 lg:block"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M10 4L4 12l6 8V4z" />
              <rect x="10" y="11" width="12" height="2" />
            </svg>
          </button>
          <div
            ref={pillRef}
            className="flex flex-1 gap-2 overflow-x-auto pb-1 pt-2 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {catPills.map((pill) => (
              <button
                key={pill.name}
                onClick={() => setActivePill(pill.name)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  activePill === pill.name
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {pill.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => pillRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
            className="z-10 ml-1 hidden shrink-0 rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 lg:block"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M14 4l6 8-6 8V4z" />
              <rect x="2" y="11" width="12" height="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-6 flex max-w-5xl gap-6 px-4 pb-10 sm:px-6 lg:px-8">
        {/* Left Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Browse Filters
              </h2>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                Reset All
              </button>
            </div>

            {/* Verification */}
            <div className="mb-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Verification
              </h3>
              <div className="space-y-2.5">
                <CheckBox label="TESDA CERTIFIED ONLY" />
                <CheckBox label="ID VERIFIED PROFESSIONALS" />
              </div>
            </div>

            {/* Service Category */}
            <div className="mb-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Service Category
              </h3>
              <div className="space-y-2.5">
                {visibleCats.map((cat) => (
                  <CheckBox
                    key={cat.name}
                    label={cat.name}
                    count={cat.count}
                  />
                ))}
              </div>
              {filterCategories.length >= 4 && (
                <button
                  onClick={() => setShowAllCats(!showAllCats)}
                  className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  {showAllCats ? "Show less" : `Show all ${filterCategories.length}`}
                </button>
              )}
            </div>

            {/* Availability */}
            <div className="mb-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Availability
              </h3>
              <div className="space-y-2.5">
                <CheckBox label="Available Today" />
                <CheckBox label="Available Tomorrow" />
                <CheckBox label="This week" />
                <CheckBox label="Weekends only" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Rating
              </h3>
              <div className="space-y-2.5">
                <CheckBox label="5 stars & up" count={42} />
                <CheckBox label="4 stars & up" count={128} />
                <CheckBox label="3 stars & up" />
                <CheckBox label="2 stars & up" />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Area */}
        <div className="flex-1 lg:min-w-0">
          {/* Results Header */}
          <div className="mb-4">
            <p className="text-lg font-bold text-gray-900">
              150 Professionals Found
            </p>
            <p className="text-sm text-gray-500">
              Showing top results for &apos;Carpentry&apos; in Dagupan City
            </p>
          </div>

          {/* Provider Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Banner */}
                <div className={`relative h-28 bg-gradient-to-r ${provider.banner}`}>
                  {/* Overlapping profile picture */}
                  <div className="absolute -bottom-6 left-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-lg font-bold ${provider.color}`}>
                      {provider.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-4 pb-4 pt-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-gray-500">{provider.trade}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                      {provider.cred}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {provider.bio}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <StarIcon filled />
                      <span className="text-sm font-semibold text-gray-800">
                        {provider.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({provider.reviews})
                      </span>
                    </div>
                    <button className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
