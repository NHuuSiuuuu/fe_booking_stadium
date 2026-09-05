"use client";
import {
  FileText,
  LogOut,
  MessageSquare,
  Receipt,
  Send,
  Settings,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import envConfig from "@/config";
import type { ChatMessage, Conversation, SenderRole } from "@/types/conversation";

type TypingPayload = {
  conversationId: number;
  senderRole: SenderRole;
};

type AuthUser = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  isAdmin: boolean;
};

function formatTime(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function MePage({
  initialUser,
}: {
  initialUser: AuthUser | null;
}) {
  const [activePage, setActivePage] = useState("account");
  const [activeTab, setActiveTab] = useState("info");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesByConversationId, setMessagesByConversationId] = useState<
    Record<number, ChatMessage[]>
  >({});
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [typingSenderRole, setTypingSenderRole] = useState<SenderRole | null>(null);
  const messageScrollRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    router.push("/");
    router.refresh();
  }
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { icon: FileText, label: "Đặt chỗ của tôi", page: "bookings" },
    { icon: Receipt, label: "Danh sách giao dịch", page: "transactions" },
    { icon: Wallet, label: "Thanh toán & Hoàn tiền", page: "refunds" },
    { icon: MessageSquare, label: "Tin nhắn", page: "messages" },
    { icon: Settings, label: "Tài khoản", page: "account" },
  ];

  function mergeConversation(conversation: Conversation) {
    setConversations((prev) => {
      const currentIndex = prev.findIndex((item) => item.id === conversation.id);
      const next = prev.filter((item) => item.id !== conversation.id);
      const currentConversation =
        currentIndex >= 0 ? prev[currentIndex] : undefined;
      const mergedConversation = currentConversation
        ? { ...currentConversation, ...conversation }
        : conversation;

      return [mergedConversation, ...next];
    });
    setSelectedConversation((current) =>
      current?.id === conversation.id ? { ...current, ...conversation } : current,
    );
  }

  function appendMessage(message: ChatMessage) {
    setMessagesByConversationId((prev) => {
      const currentMessages = prev[message.conversation_id] ?? [];

      if (currentMessages.some((item) => item.id === message.id)) {
        return prev;
      }

      return {
        ...prev,
        [message.conversation_id]: [...currentMessages, message],
      };
    });
  }

  function stopTyping() {
    if (!selectedConversation?.id) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socketRef.current?.emit("chat:stop-typing", selectedConversation.id);
  }

  function handleMessageInputChange(value: string) {
    setMessageInput(value);

    if (!selectedConversation?.id) return;

    socketRef.current?.emit("chat:typing", selectedConversation.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("chat:stop-typing", selectedConversation.id);
      typingTimeoutRef.current = null;
    }, 1200);
  }

  async function openConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setMessageError("");
    setTypingSenderRole(null);

    const cachedMessages = messagesByConversationId[conversation.id];

    if (cachedMessages) {
      setMessages(cachedMessages);
      setIsLoadingMessages(false);
      return;
    }

    setIsLoadingMessages(true);

    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Không tải được nội dung chat");
      }

      setMessages(data.result ?? []);
      setMessagesByConversationId((prev) => ({
        ...prev,
        [conversation.id]: data.result ?? [],
      }));
      await fetch(`/api/conversations/${conversation.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch (err) {
      setMessageError(err instanceof Error ? err.message : "Thao tác thất bại");
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedConversation || !messageInput.trim()) return;

    const content = messageInput.trim();
    setIsSendingMessage(true);
    setMessageError("");
    stopTyping();

    try {
      const res = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Không gửi được tin nhắn");
      }

      setMessages((prev) =>
        prev.some((message) => message.id === data.result.id)
          ? prev
          : [...prev, data.result],
      );
      appendMessage(data.result);
      mergeConversation({
        ...selectedConversation,
        last_message: data.result.content,
        last_message_at: data.result.created_at,
      });
      setMessageInput("");
    } catch (err) {
      setMessageError(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setIsSendingMessage(false);
    }
  }

  useEffect(() => {
    if (activePage !== "messages") return;

    let ignore = false;

    async function loadConversations() {
      setIsLoadingConversations(true);
      setMessageError("");

      try {
        const res = await fetch("/api/conversations", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Không tải được tin nhắn");
        }

        if (!ignore) {
          setConversations(data.result ?? []);
        }
      } catch (err) {
        if (!ignore) {
          setMessageError(
            err instanceof Error ? err.message : "Thao tác thất bại",
          );
          setConversations([]);
        }
      } finally {
        if (!ignore) {
          setIsLoadingConversations(false);
        }
      }
    }

    loadConversations();

    return () => {
      ignore = true;
    };
  }, [activePage]);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const conversationId = selectedConversation.id;
    let ignore = false;
    let socket: ReturnType<typeof io> | null = null;

    async function connectSocket() {
      try {
        const res = await fetch("/api/conversations/socket-token", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Không kết nối được chat realtime");
        }

        if (ignore) return;

        socket = io(envConfig.NEXT_PUBLIC_SOCKET_URL, {
          auth: { token: data.result.token },
          withCredentials: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          socket?.emit("chat:join-conversation", conversationId);
        });

        socket.on("chat:conversation-updated", (conversation: Conversation) => {
          mergeConversation(conversation);
        });

        socket.on("chat:message-created", (message: ChatMessage) => {
          appendMessage(message);

          if (message.conversation_id !== conversationId) return;

          setMessages((prev) =>
            prev.some((item) => item.id === message.id) ? prev : [...prev, message],
          );
        });

        socket.on("chat:typing", (payload: TypingPayload) => {
          if (
            payload.conversationId === conversationId &&
            payload.senderRole === "admin"
          ) {
            setTypingSenderRole(payload.senderRole);
          }
        });

        socket.on("chat:stop-typing", (payload: TypingPayload) => {
          if (
            payload.conversationId === conversationId &&
            payload.senderRole === "admin"
          ) {
            setTypingSenderRole(null);
          }
        });
      } catch (err) {
        if (!ignore) {
          setMessageError(err instanceof Error ? err.message : "Thao tác thất bại");
        }
      }
    }

    connectSocket();

    return () => {
      ignore = true;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket?.emit("chat:leave-conversation", conversationId);
      socket?.disconnect();
      socketRef.current = null;
      setTypingSenderRole(null);
    };
  }, [selectedConversation?.id]);

  useEffect(() => {
    const scrollElement = messageScrollRef.current;

    if (!scrollElement) return;

    scrollElement.scrollTop = scrollElement.scrollHeight;
  }, [messages, typingSenderRole]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto flex flex-col lg:flex-row max-w-5xl gap-6">
        {/* Sidebar */}
        <aside className="h-fit w-full lg:w-64 shrink-0 overflow-hidden bg-white shadow-sm">
          {/* Profile */}
          <div className="flex items-center gap-3 border-b border-slate-100 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              {getInitials(initialUser?.fullname || "")}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {initialUser?.fullname || "Người dùng"}
              </p>
              <p className="text-xs text-slate-500">{initialUser?.email}</p>
            </div>
          </div>
          <div className="border-t border-slate-100" />

          {/* Nav */}
          <nav>
            {navItems.map(({ icon: Icon, label, page }) => {
              const isActive = activePage === page;
              return (
                <button
                  key={label}
                  onClick={() => page !== "logout" && setActivePage(page)}
                  className={`flex w-full items-center gap-3 px-5 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[#001A2D] text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-700"}`}
                  />
                  {label}
                </button>
              );
            })}
            <button
              className="flex w-full items-center gap-3 px-5 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {activePage == "account" && (
            <>
              <h1 className="mb-4 text-2xl font-bold text-slate-900">
                Cài đặt
              </h1>

              {/* Tabs */}
              <div className="mb-4 flex gap-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`relative pb-3 text-sm font-medium ${
                    activeTab === "info" ? "text-[#0F172B]" : "text-slate-400"
                  }`}
                >
                  Thông tin tài khoản
                  {activeTab === "info" && (
                    <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#001A2D]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`relative pb-3 text-sm font-medium ${
                    activeTab === "security"
                      ? "text-[#0F172B]"
                      : "text-slate-400"
                  }`}
                >
                  Mật khẩu & Bảo mật
                  {activeTab === "security" && (
                    <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#001A2D]" />
                  )}
                </button>
              </div>

              {/* Form card */}
              <div className=" bg-white p-6 shadow-sm">
                {activeTab === "info" ? (
                  <>
                    <h2 className="mb-5 text-base font-semibold text-slate-900">
                      Dữ liệu cá nhân
                    </h2>

                    {/* Full name */}
                    <div className="mb-5">
                      <label className="mb-1.5 block text-sm text-slate-600">
                        Tên đầy đủ
                      </label>
                      <input
                        type="text"
                        defaultValue={initialUser?.fullname || ""}
                        className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1.5 text-xs text-slate-400">
                        Tên trong hồ sơ được rút ngắn từ họ tên của bạn.
                      </p>
                    </div>

                    {/* City */}
                    <div className="mb-6">
                      <label className="mb-1.5 block text-sm text-slate-600">
                        Thành phố cư trú
                      </label>
                      <input
                        type="text"
                        placeholder="Thành phố cư trú"
                        className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-400 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                      <button className=" bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
                        Có lẽ để sau
                      </button>
                      <button className=" bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
                        Lưu
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-5 text-base font-semibold text-slate-900">
                      Đổi mật khẩu
                    </h2>

                    {/* Current password */}
                    <div className="mb-5">
                      <label className="mb-1.5 block text-sm text-slate-600">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* New password */}
                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-slate-600">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-slate-600">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          placeholder="Nhập lại mật khẩu mới"
                          className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="mb-6 border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Xác thực 2 lớp
                          </p>
                          <p className="text-xs text-slate-400">
                            Tăng bảo mật cho tài khoản bằng mã xác thực khi đăng
                            nhập.
                          </p>
                        </div>
                        <button className="relative h-6 w-11 rounded-full bg-slate-200 transition-colors">
                          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                      <button className=" bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
                        Hủy
                      </button>
                      <button className=" bg-[#001A2D] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {activePage == "messages" && (
            <section className="h-[calc(100vh-7rem)] min-h-[620px] overflow-hidden bg-white shadow-sm lg:h-[calc(100vh-9rem)] lg:min-h-[560px]">
              <div className="grid h-full min-h-0 grid-rows-[minmax(0,220px)_minmax(0,1fr)] lg:grid-cols-[280px_1fr] lg:grid-rows-1">
                <aside className="min-h-0 border-b border-slate-100 lg:border-b-0 lg:border-r">
                  <div className="flex h-14 items-center border-b border-slate-100 px-4">
                    <h1 className="text-base font-semibold text-slate-950">
                      Tin nhắn
                    </h1>
                  </div>

                  <div className="h-[calc(100%-56px)] overflow-y-auto">
                    {isLoadingConversations ? (
                      <p className="p-4 text-sm text-slate-500">
                        Đang tải hội thoại...
                      </p>
                    ) : conversations.length === 0 ? (
                      <p className="p-4 text-sm text-slate-500">
                        Chưa có tin nhắn.
                      </p>
                    ) : (
                      conversations.map((conversation) => {
                        const isActive =
                          selectedConversation?.id === conversation.id;

                        return (
                          <button
                            key={conversation.id}
                            type="button"
                            onClick={() => openConversation(conversation)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                              isActive
                                ? "bg-[#001A2D] text-white"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                isActive
                                  ? "bg-white/15 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {(conversation.stadium_name || "Sân")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-semibold">
                                  {conversation.stadium_name || "Chat với chủ sân"}
                                </p>
                                <span
                                  className={`shrink-0 text-[11px] ${
                                    isActive ? "text-white/65" : "text-slate-400"
                                  }`}
                                >
                                  {formatTime(conversation.last_message_at)}
                                </span>
                              </div>
                              <p
                                className={`mt-1 truncate text-xs ${
                                  isActive ? "text-white/70" : "text-slate-500"
                                }`}
                              >
                                {conversation.last_message || "Chưa có tin nhắn"}
                              </p>
                              {conversation.user_unread_count > 0 && (
                                <span className="mt-2 inline-flex rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                                  {conversation.user_unread_count}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </aside>

                <div className="flex min-h-0 flex-col bg-slate-50">
                  <header className="flex h-14 items-center border-b border-slate-100 bg-white px-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {selectedConversation?.stadium_name || "Chat với chủ sân"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {selectedConversation
                          ? "Nhắn tin với admin sân"
                          : "Chọn một hội thoại để xem tin nhắn"}
                      </p>
                    </div>
                  </header>

                  {messageError && (
                    <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
                      {messageError}
                    </p>
                  )}

                  <div
                    ref={messageScrollRef}
                    className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
                  >
                    {isLoadingMessages ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-10 w-48 rounded-2xl bg-white" />
                        <div className="ml-auto h-10 w-36 rounded-2xl bg-slate-200" />
                        <div className="h-16 w-56 rounded-2xl bg-white" />
                      </div>
                    ) : selectedConversation && messages.length === 0 ? (
                      <p className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                        Hội thoại này chưa có tin nhắn.
                      </p>
                    ) : !selectedConversation ? (
                      <p className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                        Chọn một hội thoại ở danh sách bên trái.
                      </p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[78%] flex-col ${
                              message.sender_role === "user"
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`w-fit max-w-full break-words rounded-2xl px-3 py-2 text-sm ${
                                message.sender_role === "user"
                                  ? "bg-[#001A2D] text-white"
                                  : "bg-white text-slate-800 shadow-sm"
                              }`}
                            >
                              {message.content}
                            </div>
                            <span className="mt-1 px-1 text-[11px] text-slate-400">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {typingSenderRole === "admin" && (
                      <div className="flex justify-start">
                        <div className="flex w-fit items-center gap-1 rounded-2xl bg-white px-3 py-2 shadow-sm">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleMessageSubmit}
                    className="flex gap-3 border-t border-slate-100 bg-white p-4"
                  >
                    <input
                      value={messageInput}
                      onChange={(event) =>
                        handleMessageInputChange(event.target.value)
                      }
                      className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#001A2D]"
                      placeholder="Nhập tin nhắn..."
                      disabled={!selectedConversation || isSendingMessage}
                    />
                    <button
                      type="submit"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001A2D] text-white transition-opacity disabled:opacity-50"
                      disabled={
                        !selectedConversation ||
                        isSendingMessage ||
                        !messageInput.trim()
                      }
                      aria-label="Gửi tin nhắn"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
