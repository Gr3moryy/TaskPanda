import { useState } from "react";
import Header from "../components/Header.jsx";

const incomingRequests = [
  {
    id: 1,
    client: "Ana Reyes",
    task: "Leaking Pipe Fix",
    description: "Kitchen sink pipe is leaking, needs immediate repair.",
    address: "32 Bonifacio St, Dagupan City",
    date: "Sep 14, 2026",
    time: "10:00 AM",
    price: "P1,200",
  },
  {
    id: 2,
    client: "Carlos Magsaysay",
    task: "Bookshelf Assembly",
    description: "Need help assembling a 5-tier bookshelf. All parts included.",
    address: "17 Magsaysay Rd, Dagupan City",
    date: "Sep 15, 2026",
    time: "02:00 PM",
    price: "P800",
  },
];

const myBookings = [
  {
    id: 1,
    client: "Miguel Torres",
    task: "Desktop Table Repair",
    description: "Broken leg needs reinforcement. Wood glue and screw repair.",
    address: "12 Rizal St, Dagupan City",
    date: "Sep 9, 2026",
    time: "09:00 AM",
    price: "P500",
    status: "Pending Request",
  },
  {
    id: 2,
    client: "Liza Cristobal",
    task: "Front Yard Landscaping",
    description: "Lawn mowing, hedge trimming, and flower bed redesign.",
    address: "8 Aquino Drive, Dagupan City",
    date: "Sep 5, 2026",
    time: "08:00 AM",
    price: "P1,200",
    status: "Completed",
  },
];

const tabs = ["All", "Incoming Requests", "My Bookings"];

function StatusBadge({ status }) {
  const colors = {
    "Pending Request": "bg-amber-100 text-amber-700 border-amber-200",
    Confirmed: "bg-green-100 text-green-700 border-green-200",
    Completed: "bg-blue-100 text-blue-700 border-blue-200",
    "In Progress": "bg-accent-100 text-accent-700 border-accent-200",
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
    "In Progress": "bg-accent-500",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        colors[status] || "bg-gray-400"
      }`}
    />
  );
}

export default function ProviderBookingsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [requests, setRequests] = useState(incomingRequests);
  const [bookings, setBookings] = useState(myBookings);

  function acceptRequest(id) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setBookings((prev) => [
      ...prev,
      { ...req, status: "Pending Request" },
    ]);
  }

  function rejectRequest(id) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  const filteredIncoming =
    activeTab === "All" || activeTab === "Incoming Requests"
      ? requests
      : [];
  const filteredBookings =
    activeTab === "All" || activeTab === "My Bookings"
      ? bookings
      : [];

  const showIncoming =
    activeTab === "All" || activeTab === "Incoming Requests";
  const showBookings =
    activeTab === "All" || activeTab === "My Bookings";

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header showNav activeTab="Bookings" role="provider" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            View incoming requests and manage your jobs
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

        {showIncoming && requests.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Incoming Requests
              {requests.length > 0 && (
                <span className="ml-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-medium text-amber-700">
                  {requests.length}
                </span>
              )}
            </h2>
            <div className="space-y-4">
              {filteredIncoming.map((req) => (
                <div
                  key={req.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-100 text-lg font-bold text-accent-700">
                          {req.client.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {req.client}
                          </h3>
                          <p className="text-sm text-gray-500">
                            New booking request
                          </p>
                        </div>
                      </div>
                      <StatusBadge status="Pending Request" />
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {req.task}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        {req.description}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-400">
                          <path fillRule="evenodd" d="M19.5 6.75a3 3 0 00-6 0v7.5a3 3 0 006 0V6.75zM3.75 9.75a3 3 0 016 0v7.5a3 3 0 01-6 0V9.75zM15.75 2.25a3 3 0 016 0v7.5a3 3 0 01-6 0V2.25z" clipRule="evenodd" />
                        </svg>
                        <span>{req.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-400">
                          <path fillRule="evenodd" d="M19.5 6.75a3 3 0 00-6 0v7.5a3 3 0 006 0V6.75zM3.75 9.75a3 3 0 016 0v7.5a3 3 0 01-6 0V9.75zM15.75 2.25a3 3 0 016 0v7.5a3 3 0 01-6 0V2.25z" clipRule="evenodd" />
                        </svg>
                        <span>{req.date}</span>
                        <span className="text-gray-300">|</span>
                        <span>{req.time}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xl font-bold text-gray-900">{req.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => rejectRequest(req.id)}
                          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => acceptRequest(req.id)}
                          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showBookings && bookings.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              My Bookings
            </h2>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                          {booking.client.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {booking.client}
                          </h3>
                          <p className="text-sm text-gray-500">Job</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusDot status={booking.status} />
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
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
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-400">
                          <path fillRule="evenodd" d="M19.5 6.75a3 3 0 00-6 0v7.5a3 3 0 006 0V6.75zM3.75 9.75a3 3 0 016 0v7.5a3 3 0 01-6 0V9.75zM15.75 2.25a3 3 0 016 0v7.5a3 3 0 01-6 0V2.25z" clipRule="evenodd" />
                        </svg>
                        <span>{booking.date}</span>
                        <span className="text-gray-300">|</span>
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xl font-bold text-gray-900">{booking.price}</span>
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showIncoming && requests.length === 0 && showBookings && bookings.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
            <p className="text-gray-400">No bookings found</p>
          </div>
        )}

        {showIncoming && requests.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-sm text-gray-400">No incoming requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
