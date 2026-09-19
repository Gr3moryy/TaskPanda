import { useState, useRef, useEffect, useCallback } from "react";
import Header from "./Header.jsx";

const AVATAR_GRADIENTS = [
  "from-primary-400 to-primary-600",
  "from-accent-400 to-accent-600",
  "from-emerald-400 to-emerald-600",
  "from-rose-400 to-rose-600",
  "from-amber-400 to-amber-600",
  "from-violet-400 to-violet-600",
  "from-cyan-400 to-cyan-600",
  "from-fuchsia-400 to-fuchsia-600",
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function formatDate(dateStr) {
  return dateStr.split(",")[0];
}

function groupByDate(messages) {
  const groups = [];
  let currentDate = null;
  let currentGroup = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.time);
    if (date !== currentDate) {
      if (currentGroup.length > 0) groups.push({ date: currentDate, messages: currentGroup });
      currentDate = date;
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  });
  if (currentGroup.length > 0) groups.push({ date: currentDate, messages: currentGroup });
  return groups;
}

export default function ChatLayout({
  conversations: rawConversations,
  messagesData,
  headerSubtitle = "Client",
  avatarTheme = "primary",
  senderMe = "me",
  senderOther = "worker",
  otherRoleLabel = "Worker",
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(() => ({}));
  const [unreadMap, setUnreadMap] = useState(() => {
    const m = {};
    rawConversations.forEach((c) => { if (c.unread) m[c.id] = true; });
    return m;
  });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const wasAtBottomRef = useRef(true);

  const conversations = rawConversations.map((c) => ({
    ...c,
    unread: unreadMap[c.id] || false,
  }));

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const chatMessages = selectedId ? messages[selectedId] || messagesData[selectedId] || [] : [];

  useEffect(() => {
    if (selectedId && messages[selectedId] === undefined) {
      setMessages((prev) => ({ ...prev, [selectedId]: messagesData[selectedId] || [] }));
    }
  }, [selectedId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 60;
      wasAtBottomRef.current = isNearBottom;
      setShowScrollButton(!isNearBottom && chatMessages.length > 6);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [chatMessages.length]);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setUnreadMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setMessages((prev) => {
      if (!prev[id]) return prev;
      return prev;
    });
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || !selectedId) return;
    const newMsg = {
      id: Date.now(),
      sender: senderMe,
      text: input.trim(),
      time: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
      }),
      status: "sent",
    };
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || messagesData[selectedId] || []), newMsg],
    }));
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => {
        const list = prev[selectedId] || [];
        const updated = list.map((m) =>
          m.status === "sent" ? { ...m, status: "delivered" } : m
        );
        const last = updated[updated.length - 1];
        if (last && last.sender === senderMe) {
          return [...updated.slice(0, -1), { ...last, status: "read" }];
        }
        return updated;
      });
    }, 2000);
  }, [input, selectedId, senderMe, messagesData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (selectedId) {
        const newMsg = {
          id: Date.now(),
          sender: senderMe,
          text: `📎 ${file.name}`,
          time: new Date().toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
          }),
          status: "sent",
        };
        setMessages((prev) => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || messagesData[selectedId] || []), newMsg],
        }));
      }
      e.target.value = "";
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.task.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = Object.keys(unreadMap).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const avatarClass = avatarTheme === "accent" ? "bg-accent-100 text-accent-700" : "bg-primary-100 text-primary-700";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-16">
      <Header showNav activeTab="Messages" />

      <div className="mx-auto flex flex-1 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Conversation List */}
        <div
          className={`flex-1 w-full shrink-0 flex-col border-r border-gray-200 bg-white ${
            selectedId ? "hidden md:flex md:w-80 lg:w-96" : ""
          }`}
        >
          <div className="px-5 pt-5 pb-4">
            <h1 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              Messages
              {unreadCount > 0 && (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <div className="mt-3 relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-primary-300 focus:bg-white focus:ring-1 focus:ring-primary-300"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto min-h-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
                <p className="text-sm font-medium text-gray-500">No conversations found</p>
                <p className="mt-1 text-xs text-gray-400">Try a different search term</p>
              </div>
            ) : (
              filteredConversations.map((conv, idx) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`flex items-center gap-3.5 border-b border-gray-100 px-5 py-4 text-left transition-all duration-150 hover:bg-gray-50 focus:bg-gray-50 ${
                    selectedId === conv.id ? "bg-primary-50/60 border-l-[3px] border-l-primary-500" : ""
                  } ${idx === 0 && selectedId === null ? "bg-gray-50/50" : ""}`}
                >
                  <div className="relative shrink-0">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(conv.name)} text-sm font-bold text-white`}>
                      {conv.name.charAt(0)}
                    </div>
                    {conv.unread && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-500 ring-2 ring-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-green-500 ring-2 ring-white" title="Online" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-900">{conv.name}</span>
                      <span className="shrink-0 text-[11px] text-gray-400">{conv.time}</span>
                    </div>
                    <p className="truncate pt-0.5 text-xs text-gray-500">{conv.task}</p>
                    <p className="truncate pt-0.5 text-xs text-gray-400">
                      {conv.unread ? (
                        <span className="font-medium text-gray-600">{conv.lastMessage}</span>
                      ) : (
                        conv.lastMessage
                      )}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Thread */}
        <div className={`relative flex flex-1 flex-col bg-white ${selectedId ? "" : "hidden md:flex"}`}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                <button
                  onClick={() => setSelectedId(null)}
                  className="mr-1 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 md:hidden"
                  aria-label="Back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(selectedConv.name)} text-sm font-bold text-white`}>
                    {selectedConv.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{selectedConv.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {typeof headerSubtitle === "function" ? headerSubtitle(selectedConv) : headerSubtitle}
                    <span className="ml-1 text-green-500">• Online</span>
                  </p>
                </div>
                <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" aria-label="Call">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.104-.164.283-.067.431.372.553.815 1.072 1.32 1.563.507.5 1.026.944 1.564 1.328.149.097.328.068.43-.068l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-.285c-6.605 0-12-5.395-12-12V4.5z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" aria-label="More options">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0">
                {groupByDate(chatMessages).map((group) => (
                  <div key={group.date}>
                    <div className="flex items-center justify-center py-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500">
                        {group.date}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {group.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === senderMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                        >
                          <div
                            className={`group relative max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                              msg.sender === senderMe
                                ? "rounded-br-sm bg-primary-600 text-white"
                                : "rounded-bl-sm bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="pr-12">{msg.text}</p>
                            <div className="absolute bottom-1.5 right-3 flex items-center gap-1">
                              <span className={`text-[10px] ${msg.sender === senderMe ? "text-teal-200" : "text-gray-400"}`}>
                                {msg.time.split(",")[1]?.trim() || msg.time}
                              </span>
                              {msg.sender === senderMe && msg.status && (
                                <span className={`text-[10px] ${msg.status === "read" ? "text-teal-200" : "text-teal-300/70"}`}>
                                  {msg.status === "sent" ? "✓" : msg.status === "delivered" ? "✓✓" : "✓✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Scroll to bottom button */}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-24 right-8 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-200 text-gray-600 transition hover:bg-gray-50 md:right-[calc(50%-20rem)]"
                  aria-label="Scroll to bottom"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M11.47 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.19l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {/* Input */}
              <div className="flex items-end gap-2 border-t border-gray-100 px-4 py-3 bg-white">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Attach file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M18.75 2.25a3.75 3.75 0 013.75 3.75v12.75a3.75 3.75 0 01-3.75 3.75H5.25a3.75 3.75 0 01-3.75-3.75V6a3.75 3.75 0 013.75-3.75h13.5zM6.75 9a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9zm3.75 0a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9zm3.75 0a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selectedConv.name}...`}
                  className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-primary-300 focus:bg-white focus:ring-1 focus:ring-primary-300"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-all duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary-600 active:scale-95"
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
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-primary-500">
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774-.273 1.568-.403 2.37-.403h.03c.804 0 1.598.13 2.37.403A6.72 6.72 0 0018 21.75c.242 0 .482-.018.718-.054A6.714 6.714 0 0021 15v-3a6.72 6.72 0 00-1.5-4.264A6.668 6.668 0 0016.25 7.5h-1.875a5.25 5.25 0 00-5.25 5.25v.649A6.694 6.694 0 004.804 21.644z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 01.825 1.248l-5.75 7.5a.75.75 0 01-1.154-.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 5.197-6.866a.75.75 0 011.245.823z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-gray-900">Select a conversation</h3>
              <p className="mt-1 text-sm text-gray-500">Choose from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
