"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { io } from "socket.io-client";
import envConfig from "@/config";
import type { ChatMessage, Conversation, SenderRole } from "@/types/conversation";

type TypingPayload = {
  conversationId: number;
  senderRole: SenderRole;
};

type Props = {
  stadium: {
    id: number;
    name: string;
  };
};

function formatTime(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserAdminChat({ stadium }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [typingSenderRole, setTypingSenderRole] = useState<SenderRole | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingSenderRole]);

  useEffect(() => {
    if (!conversation?.id) return;

    const conversationId = conversation.id;
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

        socket.on("chat:message-created", (message: ChatMessage) => {
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
      socket?.emit("chat:leave-conversation", conversationId);
      socket?.disconnect();
      socketRef.current = null;
      setTypingSenderRole(null);
    };
  }, [conversation?.id]);

  function stopTyping() {
    if (!conversation?.id) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socketRef.current?.emit("chat:stop-typing", conversation.id);
  }

  function handleInputChange(value: string) {
    setInput(value);

    if (!conversation?.id) return;

    socketRef.current?.emit("chat:typing", conversation.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("chat:stop-typing", conversation.id);
      typingTimeoutRef.current = null;
    }, 1200);
  }

  async function openChat() {
    setIsOpen(true);
    if (conversation) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stadium_id: stadium.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Vui lòng đăng nhập để nhắn tin với chủ sân",
        );
      }

      setConversation(data.result);

      const messagesRes = await fetch(
        `/api/conversations/${data.result.id}/messages`,
        {
          credentials: "include",
        },
      );
      const messagesData = await messagesRes.json();

      if (!messagesRes.ok) {
        throw new Error(messagesData?.message || "Không tải được tin nhắn");
      }

      setMessages(messagesData.result ?? []);
      await fetch(`/api/conversations/${data.result.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!conversation || !input.trim()) return;

    const content = input.trim();
    setIsSending(true);
    setError("");
    stopTyping();

    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
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
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thao tác thất bại");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openChat}
        className={`fixed bottom-24 right-6 z-[999999998] flex items-center gap-2 rounded-full bg-[#042b47] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isOpen ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Nhắn chủ sân"
      >
        <MessageCircle size={18} />
        <span>Nhắn chủ sân</span>
        <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
      </button>

      <section
        className={`fixed bottom-4 right-4 z-[1000000000] h-[70vh] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 sm:h-[480px] ${
          isOpen
            ? "flex scale-100 opacity-100"
            : "pointer-events-none hidden scale-95 opacity-0"
        }`}
      >
        <header className="flex items-center justify-between bg-[#042b47] px-4 py-3 text-white">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Chat với chủ sân</p>
            <p className="truncate text-xs text-white/75">{stadium.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-white transition-colors hover:bg-white/15"
            aria-label="Đóng chat"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
          {isLoading && (
            <p className="text-sm text-slate-500">Đang tải tin nhắn...</p>
          )}

          {!isLoading && messages.length === 0 && (
            <p className="rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm">
              Gửi tin nhắn cho admin để hỏi thêm về sân này.
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[82%] flex-col ${
                  message.sender_role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`w-fit max-w-full break-words rounded-2xl px-3 py-2 text-sm ${
                    message.sender_role === "user"
                      ? "bg-[#042b47] text-white"
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
          ))}
          {typingSenderRole === "admin" && (
            <div className="flex justify-start">
              <div className="flex max-w-[82%] flex-col items-start">
                <div className="flex w-fit items-center gap-1 rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                  <span>Đang nhập</span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="border-t px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-white p-3">
          <input
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#042b47]"
            placeholder="Nhập tin nhắn..."
            disabled={!conversation || isSending}
          />
          <button
            type="submit"
            disabled={!conversation || isSending || !input.trim()}
            className="rounded-lg bg-[#042b47] px-3 text-white transition-opacity disabled:opacity-50"
            aria-label="Gửi tin nhắn"
          >
            <Send size={16} />
          </button>
        </form>
      </section>
    </>
  );
}
