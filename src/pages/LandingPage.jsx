import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { categories } from "../components/ClientDashboard.jsx";

const howItWorksClient = [
  {
    step: "01",
    title: "Browse Services",
    description:
      "Explore trusted local professionals across carpentry, plumbing, electrical, cleaning, and more.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Book a Pro",
    description:
      "Choose your provider, pick a date and time, and confirm your booking in minutes.",
    icon: "📅",
  },
  {
    step: "03",
    title: "Get It Done",
    description:
      "Your verified expert arrives on time and delivers quality work you can trust.",
    icon: "✅",
  },
];

const howItWorksProvider = [
  {
    step: "01",
    title: "Set Up Profile",
    description:
      "Create your profile, list your skills, certifications, and services you offer.",
    icon: "👤",
  },
  {
    step: "02",
    title: "Receive Requests",
    description:
      "Get matched with local job requests that fit your skills and location.",
    icon: "📬",
  },
  {
    step: "03",
    title: "Complete Jobs",
    description:
      "Accept bookings, do the work, and get paid — leave reviews from clients.",
    icon: "🎉",
  },
];

const stats = [
  { value: "500+", label: "Bookings Completed" },
  { value: "4.9", label: "Average Rating" },
  { value: "150+", label: "Verified Pros" },
  { value: "24/7", label: "Service Available" },
];

const providers = [
  {
    name: "Johhny Cruz",
    trade: "Carpentry",
    cred: "TESDA NC II Carpenter",
    rating: 4.8,
    reviews: 24,
    price: "P500",
    color: "bg-primary-100 text-primary-700",
    banner: "from-primary-500 to-teal-700",
  },
  {
    name: "Maria Santos",
    trade: "Electrical",
    cred: "TESDA NC II Electrician",
    rating: 4.6,
    reviews: 18,
    price: "P450",
    color: "bg-accent-100 text-accent-700",
    banner: "from-accent-500 to-blue-700",
  },
  {
    name: "Pedro Cruz",
    trade: "Plumbing",
    cred: "TESDA NC II Plumbing",
    rating: 4.7,
    reviews: 31,
    price: "P400",
    color: "bg-emerald-100 text-emerald-700",
    banner: "from-emerald-500 to-teal-700",
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

export default function LandingPage() {
  const navigate = useNavigate();
  const [howTab, setHowTab] = useState("client");
  const catScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showNav={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Find trusted local
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  pros for your home
                </span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                TaskPanda connects you with certified tradespeople and trusted
                independent local specialists. Quick, reliable, and hassle-free.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 ring-2 ring-white">
                    J
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-700 ring-2 ring-white">
                    M
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 ring-2 ring-white">
                    A
                  </div>
                </div>
                <span>
                  Trusted by <strong className="text-gray-900">2,000+</strong>{" "}
                  homeowners
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-slate-700 to-slate-800 px-6 py-10 sm:px-10 sm:py-12">
                <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/5" />

                <div className="relative z-10 max-w-lg">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Why TaskPanda?
                  </h2>
                  <div className="mt-6 space-y-3">
                    {[
                      { icon: "✅", text: "Verified & TESDA-certified pros" },
                      { icon: "⚡", text: "Instant booking in minutes" },
                      { icon: "🏡", text: "Trusted by 2,000+ homeowners" },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2.5"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-sm text-teal-50">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-5 text-center"
              >
                <span className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  {s.value}
                </span>
                <span className="mt-1 text-xs text-gray-500 sm:text-sm">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Explore Services
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Browse services from certified local professionals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCategories("left")}
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
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
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
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
            </div>
          </div>

          <div
            ref={catScrollRef}
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate("/explore")}
                className="flex shrink-0 cursor-pointer flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition hover:shadow-md hover:border-gray-200"
                style={{ width: "120px" }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="whitespace-nowrap text-xs font-medium text-gray-700">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How TaskPanda Works
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
              Simple steps for both clients and providers
            </p>
            <div className="mt-4 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setHowTab("client")}
                className={`rounded-md px-5 py-2 text-sm font-medium transition ${
                  howTab === "client"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                For Clients
              </button>
              <button
                onClick={() => setHowTab("provider")}
                className={`rounded-md px-5 py-2 text-sm font-medium transition ${
                  howTab === "provider"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                For Providers
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {(howTab === "client" ? howItWorksClient : howItWorksProvider).map(
              (item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition hover:shadow-md hover:border-gray-200"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <span className="mt-4 inline-block rounded-lg bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Top-Rated Professionals
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Hand-picked experts trusted by the community
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <div
                key={p.name}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className={`relative h-28 bg-gradient-to-r ${p.banner}`}>
                  <div className="absolute -bottom-6 left-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-lg font-bold ${p.color}`}
                    >
                      {p.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-5 pt-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500">{p.trade}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                      {p.cred}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <StarIcon filled />
                      <span className="text-sm font-semibold text-gray-800">
                        {p.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({p.reviews} reviews)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {p.price}/hr
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate("/explore")}
                      className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate("/explore")}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-12 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
                  Ready to start your project?
                </h2>
                <p className="mt-3 text-base text-gray-400 sm:text-lg">
                  Join thousands of homeowners who trust TaskPanda to find
                  reliable local professionals. Get started in minutes — no
                  commitments needed.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-none">
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-gray-600 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <a href="/" className="text-2xl font-extrabold tracking-tight">
                <span className="text-gray-900">Task</span>
                <span className="text-primary-700">Panda</span>
              </a>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Connecting homeowners with trusted local tradespeople since
                2024.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Services</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.name}>
                    <a
                      href="/explore"
                      className="transition hover:text-gray-900"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>
                  <a href="/explore" className="transition hover:text-gray-900">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/explore" className="transition hover:text-gray-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/explore" className="transition hover:text-gray-900">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>
                  <a href="/explore" className="transition hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/explore" className="transition hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/explore" className="transition hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} TaskPanda. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
