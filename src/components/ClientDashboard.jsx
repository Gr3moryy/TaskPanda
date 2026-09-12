import { useState, useRef } from "react";
import Header from "./Header.jsx";

const categories = [
  { name: "All Services", icon: "🏠" },
  { name: "AC Cleaning", icon: "❄️" },
  { name: "Carpentry", icon: "🪵" },
  { name: "Electrical", icon: "⚡" },
  { name: "Plumbing", icon: "🔧" },
  { name: "Painting", icon: "🎨" },
  { name: "Cleaning", icon: "🧹" },
  { name: "Deep Cleaning", icon: "🧽" },
  { name: "Furniture Assembly", icon: "🪑" },
  { name: "Appliance Installation", icon: "🥤" },
  { name: "Lawn Care", icon: "🌱" },
  { name: "Roof Repair", icon: "🏠" },
  { name: "Handyman", icon: "🔨" },
  { name: "Water Heater", icon: "🌡️" },
  { name: "Drain Cleaning", icon: "🚿" },
  { name: "Door Repair", icon: "🚪" },
  { name: "Ceiling Fan", icon: "💡" },
  { name: "Pest Control", icon: "🐜" },
];

const favourites = [
  {
    name: "Johhny Cruz",
    cred: "TESDA NC II Carpenter",
    rating: 4.8,
    reviews: 24,
    lastHired: "Last hired 6 months ago",
    price: "P500",
  },
  {
    name: "Maria Santos",
    cred: "TESDA NC II Electrician",
    rating: 4.6,
    reviews: 18,
    lastHired: "Last hired 3 months ago",
    price: "P450",
  },
];

const bookings = [
  {
    id: 1,
    status: "Pending Request",
    worker: "Johhny Cruz",
    cred: "TESDA NC II Carpenter",
    task: "Desktop Table Repair",
    date: "Sep 9, 2026 - 09:00 AM",
    price: "P500",
  },
  {
    id: 2,
    status: "Confirmed",
    worker: "Maria Santos",
    cred: "TESDA NC II Electrician",
    task: "Circuit Breaker Replacement",
    date: "Sep 10, 2026 - 02:00 PM",
    price: "P800",
  },
];

function StatusBadge({ status }) {
  const colors = {
    "Pending Request": "bg-amber-100 text-amber-700 border-amber-200",
    Confirmed: "bg-green-100 text-green-700 border-green-200",
    Completed: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

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

export default function Dashboard() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);
  const catScrollRef = useRef(null);

  const tabs = ["All", "Pending", "Confirmed"];

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const scrollCategories = (direction) => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => {
          if (activeTab === "Pending") return b.status === "Pending Request";
          if (activeTab === "Confirmed") return b.status === "Confirmed";
          return true;
        });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header showNav />

      {/* 2. Reminder Banner */}
      {bannerVisible && (
        <div className="relative bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-2xl">⚠️</span>
            <p className="flex-1 text-sm font-medium text-gray-800">
              Recurring Maintenance Reminder: It&apos;s been 6 months since your
              last AC Cleaning - Tap to schedule with Perez Cruz
            </p>
            <button className="shrink-0 rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-gray-800">
              Book Now
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="shrink-0 rounded p-1 text-gray-700 transition hover:bg-gray-900/10"
              aria-label="Close reminder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        {/* Left / Center Main Area */}
        <div className="flex-1 space-y-8 lg:min-w-0">
          {/* 3. Hero Search & Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-slate-700 to-slate-800 px-6 py-10 sm:px-10 sm:py-12">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute right-1/4 top-1/4 h-16 w-16 rounded-full bg-white/5" />

            {/* Panda mascot peeking out */}
            <div className="pointer-events-none absolute -bottom-4 -right-2 hidden h-48 w-40 overflow-hidden sm:block md:right-8">
              <img
                src="/assets/Panda Cropped.png"
                alt="TaskPanda mascot"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="relative z-10 max-w-lg">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Find trusted local pros for your home
              </h1>
              <p className="mt-4 text-base leading-relaxed text-teal-100/80 sm:text-lg">
                TaskPanda connects with certified tradespeople and trusted
                independent local specialists.
              </p>

              {/* Search Bar */}
              <div className="mt-8 flex items-center overflow-hidden rounded-xl bg-white shadow-lg">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for carpentry, plumbing, cleaning, or electrical services..."
                  className="flex-1 px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none"
                  ref={scrollRef}
                />
                <button className="shrink-0 bg-gray-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-900">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* 4. Explore Categories */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Explore Categories</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCategories("left")}
                  className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                  aria-label="Scroll left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M10 4L4 12l6 8V4z" />
                    <rect x="10" y="11" width="12" height="2" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollCategories("right")}
                  className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                  aria-label="Scroll right"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M14 4l6 8-6 8V4z" />
                    <rect x="2" y="11" width="12" height="2" />
                  </svg>
                </button>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  View All
                </a>
              </div>
            </div>
            <div
              ref={catScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex shrink-0 cursor-pointer flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition hover:shadow-md w-[120px]"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="whitespace-nowrap text-xs font-medium text-gray-700">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Your Favourites */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Your Favourites</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                  aria-label="Scroll left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M10 4L4 12l6 8V4z" />
                    <rect x="10" y="11" width="12" height="2" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                  aria-label="Scroll right"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M14 4l6 8-6 8V4z" />
                    <rect x="2" y="11" width="12" height="2" />
                  </svg>
                </button>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  View All
                </a>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {favourites.map((fav) => (
                <div
                  key={fav.name}
                  className="flex min-w-[260px] flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {fav.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {fav.name}
                        </p>
                        <p className="text-xs text-gray-500">{fav.cred}</p>
                      </div>
                    </div>
                    <StatusBadge status="Confirmed" />
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <StarIcon filled />
                    <span className="text-sm font-medium text-gray-800">
                      {fav.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({fav.reviews} reviews)
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{fav.lastHired}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {fav.price}
                    </span>
                    <button className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-700">
                      Rebook
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 6. Active Bookings Sidebar */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-bold text-gray-900">
                Active Bookings
              </h2>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                See All &gt;
              </a>
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-1 border-b border-gray-100 px-5 py-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Booking List */}
            <div className="max-h-[480px] overflow-y-auto p-4">
              {filteredBookings.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  No {activeTab.toLowerCase()} bookings
                </p>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="mb-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={booking.status} />
                      <span className="text-sm font-semibold text-gray-900">
                        {booking.price}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                        {booking.worker.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.worker}
                        </p>
                        <p className="text-xs text-gray-500">{booking.cred}</p>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-gray-200 pt-2">
                      <p className="text-sm font-medium text-gray-800">
                        {booking.task}
                      </p>
                      <p className="text-xs text-gray-500">{booking.date}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                        Contact
                      </button>
                      <button className="flex-1 rounded-lg bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                        Cancel Request
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
