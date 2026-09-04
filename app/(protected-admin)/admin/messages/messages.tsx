"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { io } from "socket.io-client";
import envConfig from "@/config";
import type { ChatMessage, Conversation, SenderRole } from "@/types/conversation";

type TypingPayload = {
  conversationId: number;
  senderRole: SenderRole;
};

function getConversationTitle(conversation: Conversation) {
  return (
    conversation.user_fullname ||
    conversation.user_email ||
    conversation.user_phone ||
    "Người dùng"
  );
}

function formatTime(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [typingConversationId, setTypingConversationId] = useState<number | null>(
    null,
  );
  const [typingSenderRole, setTypingSenderRole] = useState<SenderRole | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function upsertConversation(conversation: Conversation) {
    setConversations((prev) => {
      const next = prev.filter((item) => item.id !== conversation.id);
      return [conversation, ...next];
    });
    setSelectedConversation((current) =>
      current?.id === conversation.id ? { ...current, ...conversation } : current,
    );
  }

  useEffect(() => {
    let ignore = false;

    async function loadConversations() {
      setIsLoadingConversations(true);
      setError("");

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
          setError(err instanceof Error ? err.message : "Thao tác thất bại");
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
  }, []);

  useEffect(() => {
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
          socket?.emit("chat:join-admin");
        });

        socket.on("chat:conversation-updated", (conversation: Conversation) => {
          upsertConversation(conversation);
        });

        socket.on("chat:message-created", (message: ChatMessage) => {
          if (selectedConversation?.id !== message.conversation_id) return;

          setMessages((prev) =>
            prev.some((item) => item.id === message.id) ? prev : [...prev, message],
          );
        });

        socket.on("chat:typing", (payload: TypingPayload) => {
          if (payload.senderRole !== "user") return;

          setTypingConversationId(payload.conversationId);
          setTypingSenderRole(payload.senderRole);
        });

        socket.on("chat:stop-typing", (payload: TypingPayload) => {
          if (payload.senderRole !== "user") return;

          setTypingConversationId((current) =>
            current === payload.conversationId ? null : current,
          );
          setTypingSenderRole((current) =>
            current === payload.senderRole ? null : current,
          );
        });
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Thao tác thất bại");
        }
      }
    }

    connectSocket();

    return () => {
      ignore = true;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket?.disconnect();
      socketRef.current = null;
      setTypingConversationId(null);
      setTypingSenderRole(null);
    };
  }, [selectedConversation?.id]);

  function stopTyping() {
    if (!selectedConversation?.id) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socketRef.current?.emit("chat:stop-typing", selectedConversation.id);
  }

  function handleInputChange(value: string) {
    setInput(value);

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
    setIsThreadOpen(true);
    setIsLoadingMessages(true);
    setError("");

    try {
      const res = await fetch(
        `/api/conversations/${conversation.id}/messages`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Không tải được nội dung chat");
      }

      setMessages(data.result ?? []);

      const readRes = await fetch(`/api/conversations/${conversation.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      const readData = await readRes.json();

      if (readRes.ok && readData.result) {
        upsertConversation(readData.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tác thất bại");
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedConversation || !input.trim()) return;

    const content = input.trim();
    setIsSending(true);
    setError("");
    stopTyping();

    try {
      const res = await fetch(
        `/api/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Không gửi được tin nhắn");
      }

      setMessages((prev) =>
        prev.some((message) => message.id === data.result.id)
          ? prev
          : [...prev, data.result],
      );
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === selectedConversation.id
            ? {
                ...conversation,
                last_message: data.result.content,
                last_message_at: data.result.created_at,
              }
            : conversation,
        ),
      );
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-52px)] bg-slate-50 p-4 md:p-6">
      <div className="grid h-[calc(100vh-100px)] overflow-hidden rounded-lg border border-slate-200 bg-white md:grid-cols-[320px_1fr]">
        <aside
          className={`${isThreadOpen ? "hidden md:block" : "block"} min-w-0 border-r border-slate-200`}
        >
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-lg font-bold text-slate-950">Tin nhắn</h1>
            <p className="text-xs text-slate-500">
              Hội thoại giữa user và nhóm admin
            </p>
          </div>

          <div className="h-[calc(100%-73px)] divide-y divide-slate-100 overflow-y-auto">
            {isLoadingConversations ? (
              <p className="p-4 text-sm text-slate-500">Đang tải hội thoại...</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Chưa có tin nhắn.</p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation)}
                  className={`block w-full p-4 text-left transition-colors hover:bg-slate-50 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-slate-100"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {getConversationTitle(conversation)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {conversation.stadium_name || "Tất cả sân"}
                      </p>
                    </div>
                    {conversation.admin_unread_count > 0 && (
                      <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {conversation.admin_unread_count}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 truncate text-sm text-slate-600">
                    {conversation.last_message || "Chưa có tin nhắn"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatTime(conversation.last_message_at)}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section
          className={`${isThreadOpen ? "flex" : "hidden md:flex"} min-w-0 flex-col`}
        >
          <header className="flex items-center gap-3 border-b border-slate-200 p-4">
            <button
              type="button"
              className="rounded-full p-1 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setIsThreadOpen(false)}
              aria-label="Quay lại"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">
                {selectedConversation
                  ? getConversationTitle(selectedConversation)
                  : "Chọn cuộc trò chuyện"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {selectedConversation?.stadium_name ||
                  "Chọn một hội thoại để bắt đầu trả lời"}
              </p>
            </div>
          </header>

          {error && (
            <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {isLoadingMessages ? (
              <p className="text-sm text-slate-500">Đang tải tin nhắn...</p>
            ) : selectedConversation && messages.length === 0 ? (
              <p className="rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm">
                Hội thoại này chưa có tin nhắn.
              </p>
            ) : !selectedConversation ? (
              <p className="rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm">
                Chọn một hội thoại ở danh sách bên trái.
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_role === "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[78%] flex-col ${
                      message.sender_role === "admin" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`w-fit max-w-full break-words rounded-2xl px-3 py-2 text-sm ${
                        message.sender_role === "admin"
                          ? "bg-slate-900 text-white"
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
            {selectedConversation &&
              typingConversationId === selectedConversation.id &&
              typingSenderRole === "user" && (
                <div className="flex justify-start">
                  <div className="flex max-w-[78%] flex-col items-start">
                    <div className="flex w-fit items-center gap-1 rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                      <span>Đang nhập</span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(event) => handleInputChange(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Trả lời tin nhắn..."
              disabled={!selectedConversation || isSending}
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-3 text-white transition-opacity disabled:opacity-50"
              disabled={!selectedConversation || isSending || !input.trim()}
              aria-label="Gửi tin nhắn"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
