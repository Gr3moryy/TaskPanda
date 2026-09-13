import { useState } from "react";
import Header from "../components/Header.jsx";

const bookings = [
  {
    id: 1,
    status: "Pending Request",
    worker: "Johhny Cruz",
    cred: "TESDA NC II Carpenter",
    task: "Desktop Table Repair",
    description:
      "The desktop table has a broken leg and needs reinforcement. Wood glue and screw repair requested.",
    date: "Sep 9, 2026",
    time: "09:00 AM",
    price: "P500",
    address: "12 Rizal St, Dagupan City",
  },
  {
    id: 2,
    status: "Confirmed",
    worker: "Maria Santos",
    cred: "TESDA NC II Electrician",
    task: "Circuit Breaker Replacement",
    description:
      "Main circuit breaker needs replacement due to frequent tripping. Will inspect entire panel.",
    date: "Sep 10, 2026",
    time: "02:00 PM",
    price: "P800",
    address: "5 Burgos Ave, Dagupan City",
  },
  {
    id: 3,
    status: "Completed",
    worker: "Ricky Padilla",
    cred: "Licensed Landscaper",
    task: "Front Yard Landscaping",
    description:
      "Lawn mowing, hedge trimming, and flower bed redesign for front yard.",
    date: "Sep 5, 2026",
    time: "08:00 AM",
    price: "P1,200",
    address: "8 Aquino Drive, Dagupan City",
  },
];

const tabs = ["All", "Pending Request", "Confirmed", "Completed"];

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

function StatusDot({ status }) {
  const colors = {
    "Pending Request": "bg-amber-500",
    Confirmed: "bg-green-500",
    Completed: "bg-blue-500",
  };
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${colors[status] || "bg-gray-400"}`} />
  );
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header showNav activeTab="Bookings" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your service bookings
          </p>
        </div>

        <div className="mb-6 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
              <p className="text-gray-400">No bookings found</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                        {booking.worker.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {booking.worker}
                        </h3>
                        <p className="text-sm text-gray-500">{booking.cred}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDot status={booking.status} />
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-800">
                      {booking.task}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      {booking.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-400">
                        <path fillRule="evenodd" d="M19.5 6.75a3 3 0 00-6 0v7.5a3 3 0 006 0V6.75zM3.75 9.75a3 3 0 016 0v7.5a3 3 0 01-6 0V9.75zM15.75 2.25a3 3 0 016 0v7.5a3 3 0 01-6 0V2.25z" clipRule="evenodd" />
                      </svg>
                      <span>{booking.date}</span>
                      <span className="text-gray-300">|</span>
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-400">
                        <path fillRule="evenodd" d="M11.54 22.35l.07.04.03.02.04.01-.04-.01-.03-.02-.07-.04zm-.91-.65A7.5 7.5 0 0019.5 12c0-3.04-1.96-5.64-4.63-6.86a.75.75 0 00-.74 0A7.49 7.49 0 004.5 12c0 3.95 3.23 7.14 6.91 7.64l.07.04.03.02a1.25 1.25 0 00.42.08l.04-.01-.04.01a1.25 1.25 0 00.42-.08l.03-.02.07-.04z" clipRule="evenodd" />
                      </svg>
                      <span>{booking.address}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xl font-bold text-gray-900">{booking.price}</span>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
                        Contact
                      </button>
                      <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
