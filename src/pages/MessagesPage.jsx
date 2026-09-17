import { useState } from "react";
import Header from "../components/Header.jsx";

const conversations = [
  {
    id: 1,
    name: "Johhny Cruz",
    cred: "TESDA NC II Carpenter",
    task: "Desktop Table Repair",
    lastMessage: "Sure, I can come tomorrow. See you at 9am!",
    time: "10:32 AM",
    unread: true,
  },
  {
    id: 2,
    name: "Maria Santos",
    cred: "TESDA NC II Electrician",
    task: "Circuit Breaker Replacement",
    lastMessage: "The part is available. Ready to schedule.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    name: "Ricky Padilla",
    cred: "Licensed Landscaper",
    task: "Front Yard Landscaping",
    lastMessage: "Thank you! Leave a review after completion.",
    time: "Sep 10",
    unread: false,
  },
];

const messagesData = {
  1: [
    {
      id: 1,
      sender: "worker",
      text: "Hi! I received your request for the desktop table repair.",
      time: "Sep 8, 10:15 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Great! Can you come tomorrow morning?",
      time: "Sep 8, 10:22 AM",
    },
    {
      id: 3,
      sender: "worker",
      text: "Sure, I can come tomorrow. See you at 9am!",
      time: "Sep 8, 10:32 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "worker",
      text: "Hello, I checked your circuit breaker issue.",
      time: "Sep 7, 2:00 PM",
    },
    {
      id: 2,
      sender: "me",
      text: "What parts do you need?",
      time: "Sep 7, 3:15 PM",
    },
    {
      id: 3,
      sender: "worker",
      text: "The part is available. Ready to schedule.",
      time: "Sep 7, 3:45 PM",
    },
  ],
  3: [
    {
      id: 1,
      sender: "worker",
      text: "Landscaping is complete! Front yard looks great.",
      time: "Sep 5, 12:30 PM",
    },
    {
      id: 2,
      sender: "me",
      text: "Thank you! Looks amazing.",
      time: "Sep 5, 1:00 PM",
    },
    {
      id: 3,
      sender: "worker",
      text: "Thank you! Leave a review after completion.",
      time: "Sep 5, 1:15 PM",
    },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState("");

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const chatMessages = selectedConv ? messagesData[selectedId] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header showNav activeTab="Messages" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Conversation List */}
        <div
          className={`flex-1 h-full w-full shrink-0 border-r border-gray-200 bg-white ${
            selectedId ? "hidden md:block md:w-80 lg:w-96" : ""
          }`}
        >
          <div className="px-5 py-5">
            <h1 className="text-lg font-bold text-gray-900">
              Messages{" "}
              <span className="ml-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                {conversations.filter((c) => c.unread).length}
              </span>
            </h1>
          </div>
          <div className="flex flex-col">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`flex items-center gap-3.5 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50 ${
                  selectedId === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {conv.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-gray-900">
                      {conv.name}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {conv.time}
                    </span>
                  </div>
                  <p className="truncate pt-0.5 text-xs text-gray-500">{conv.task}</p>
                  <p className="truncate pt-0.5 text-xs text-gray-400">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread && (
                  <span className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div
          className={`flex h-full flex-1 flex-col bg-white ${
            selectedId ? "" : "hidden md:flex"
          }`}
        >
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
                <button
                  onClick={() => setSelectedId(null)}
                  className="mr-1 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
                  aria-label="Back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {selectedConv.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedConv.name}
                  </p>
                  <p className="text-xs text-gray-500">{selectedConv.cred}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                        msg.sender === "me"
                          ? "rounded-br-sm bg-primary-600 text-white"
                          : "rounded-bl-sm bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`mt-1.5 text-right text-[11px] ${
                          msg.sender === "me" ? "text-teal-200" : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-3 border-t border-gray-200 px-5 py-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-200 px-5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setInput("");
                  }}
                />
                <button
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700"
                  aria-label="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex h-full flex-1 flex-col items-center justify-center text-center px-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mb-4 h-14 w-14 text-gray-300">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774-.273 1.568-.403 2.37-.403h.03c.804 0 1.598.13 2.37.403A6.72 6.72 0 0018 21.75c.242 0 .482-.018.718-.054A6.714 6.714 0 0021 15v-3a6.72 6.72 0 00-1.5-4.264A6.668 6.668 0 0016.25 7.5h-1.875a5.25 5.25 0 00-5.25 5.25v.649A6.694 6.694 0 004.804 21.644z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Select a conversation</p>
              <p className="mt-1 text-xs text-gray-400">Choose from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
