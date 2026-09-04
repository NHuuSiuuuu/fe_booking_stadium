"use client";

import type { FormEvent, UIEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, Send } from "lucide-react";
import { io } from "socket.io-client";
import envConfig from "@/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function getConversationInitial(conversation: Conversation) {
  return getConversationTitle(conversation).trim().charAt(0).toUpperCase();
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

function MessageThreadSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-start">
        <div className="h-10 w-44 rounded-2xl bg-white shadow-sm" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-36 rounded-2xl bg-slate-200" />
      </div>
      <div className="flex justify-start">
        <div className="h-16 w-56 rounded-2xl bg-white shadow-sm" />
      </div>
    </div>
  );
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesByConversationId, setMessagesByConversationId] = useState<
    Record<number, ChatMessage[]>
  >({});
  const [input, setInput] = useState("");
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [typingConversationId, setTypingConversationId] = useState<number | null>(
    null,
  );
  const [typingSenderRole, setTypingSenderRole] = useState<SenderRole | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const messagesBottomRef = useRef<HTMLDivElement | null>(null);
  const shouldStickToBottomRef = useRef(true);

  function mergeConversation(
    conversation: Conversation,
    options: { promote?: boolean } = {},
  ) {
    setConversations((prev) => {
      const currentIndex = prev.findIndex((item) => item.id === conversation.id);
      const currentConversation =
        currentIndex >= 0 ? prev[currentIndex] : undefined;
      const mergedConversation = currentConversation
        ? { ...currentConversation, ...conversation }
        : conversation;
      const hasNewLastMessage =
        currentConversation?.last_message !== conversation.last_message ||
        currentConversation?.last_message_at !== conversation.last_message_at;
      const shouldPromote =
        currentIndex === -1 ||
        (options.promote === true && hasNewLastMessage);

      if (shouldPromote) {
        const next = prev.filter((item) => item.id !== conversation.id);
        return [mergedConversation, ...next];
      }

      return prev.map((item) =>
        item.id === conversation.id ? mergedConversation : item,
      );
    });
    setSelectedConversation((current) =>
      current?.id === conversation.id ? { ...current, ...conversation } : current,
    );
  }

  function appendMessageToThread(message: ChatMessage) {
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

  function isNearThreadBottom() {
    const scrollElement = messagesScrollRef.current;

    if (!scrollElement) return true;

    return (
      scrollElement.scrollHeight -
        scrollElement.scrollTop -
        scrollElement.clientHeight <
      96
    );
  }

  function scrollToLatestMessage(behavior: ScrollBehavior = "smooth") {
    messagesBottomRef.current?.scrollIntoView({ block: "end", behavior });
    shouldStickToBottomRef.current = true;
    setShowScrollToBottom(false);
  }

  function handleMessagesScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 96;

    shouldStickToBottomRef.current = isNearBottom;
    setShowScrollToBottom(!isNearBottom);
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
          mergeConversation(conversation, { promote: true });
        });

        socket.on("chat:message-created", (message: ChatMessage) => {
          appendMessageToThread(message);

          if (selectedConversation?.id !== message.conversation_id) return;

          shouldStickToBottomRef.current = isNearThreadBottom();
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

  useEffect(() => {
    if (!selectedConversation || isLoadingMessages) return;
    if (!shouldStickToBottomRef.current) return;

    requestAnimationFrame(() => scrollToLatestMessage("auto"));
  }, [
    isLoadingMessages,
    messages.length,
    selectedConversation,
    typingConversationId,
  ]);

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

  async function markConversationRead(conversation: Conversation) {
    try {
      const readRes = await fetch(`/api/conversations/${conversation.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      const readData = await readRes.json();

      if (readRes.ok && readData.result) {
        mergeConversation(readData.result, { promote: false });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không cập nhật trạng thái đọc");
    }
  }

  async function openConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setIsThreadOpen(true);
    setError("");
    setShowScrollToBottom(false);
    shouldStickToBottomRef.current = true;

    const cachedMessages = messagesByConversationId[conversation.id];

    if (cachedMessages) {
      setMessages(cachedMessages);
      setIsLoadingMessages(false);
      markConversationRead(conversation);
      return;
    }

    setIsLoadingMessages(true);

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
      setMessagesByConversationId((prev) => ({
        ...prev,
        [conversation.id]: data.result ?? [],
      }));
      await markConversationRead(conversation);
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
    shouldStickToBottomRef.current = true;

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
      appendMessageToThread(data.result);
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
    <main className="min-h-[calc(100vh-52px)] bg-slate-100">
      <div className="grid h-[calc(100vh-52px)] overflow-hidden bg-white md:grid-cols-[320px_1fr]">
        <aside
          className={`${isThreadOpen ? "hidden md:block" : "block"} min-w-0 border-r border-slate-200 bg-white`}
        >
          <div className="flex h-14 items-center border-b border-slate-100 px-4">
            <h1 className="text-base font-semibold text-slate-950">Messages</h1>
          </div>

          <div className="h-[calc(100%-56px)] overflow-y-auto">
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
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-slate-100"
                      : "bg-white"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                    {getConversationInitial(conversation)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {getConversationTitle(conversation)}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {conversation.last_message || "Chưa có tin nhắn"}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[11px] text-slate-400">
                          {formatTime(conversation.last_message_at)}
                        </span>
                        {conversation.admin_unread_count > 0 && (
                          <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                            {conversation.admin_unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {conversation.stadium_name || "Tất cả sân"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section
          className={`${isThreadOpen ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col bg-slate-100`}
        >
          <header className="flex h-14 items-center gap-3 bg-slate-950 px-4 text-white shadow-sm">
            <button
              type="button"
              className="rounded-full p-1 text-white hover:bg-white/10 md:hidden"
              onClick={() => setIsThreadOpen(false)}
              aria-label="Quay lại"
            >
              <ArrowLeft size={18} />
            </button>
            {selectedConversation && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                {getConversationInitial(selectedConversation)}
              </div>
            )}
            <div className="min-w-0">
              {selectedConversation ? (
                <button
                  type="button"
                  onClick={() => setIsUserDialogOpen(true)}
                  className="block max-w-full truncate text-left text-sm font-semibold text-white hover:text-slate-200"
                >
                  {getConversationTitle(selectedConversation)}
                </button>
              ) : (
                <p className="truncate text-sm font-semibold text-white">
                  Chọn cuộc trò chuyện
                </p>
              )}
              <p className="truncate text-xs text-slate-300">
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

          <div className="relative min-h-0 flex-1">
            <div
              ref={messagesScrollRef}
              onScroll={handleMessagesScroll}
              className="min-h-0 flex-1 overflow-y-auto h-full space-y-3 bg-slate-100 p-4 md:p-6"
            >
              {selectedConversation?.stadium_id && (
                <div className="max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {selectedConversation.stadium_name || "Sân bóng"}
                      </p>
                      <p className="text-xs text-slate-500">
                        User đang hỏi về sân này
                      </p>
                    </div>
                    {selectedConversation.stadium_slug && (
                      <Link
                        href={`/stadiums/detail/${selectedConversation.stadium_slug}`}
                        className="shrink-0 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        Xem sân
                      </Link>
                    )}
                  </div>
                </div>
              )}
              {isLoadingMessages ? (
                <MessageThreadSkeleton />
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
                      message.sender_role === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[78%] flex-col ${
                        message.sender_role === "admin"
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`w-fit max-w-full break-words rounded-2xl px-3 py-2 text-sm ${
                          message.sender_role === "admin"
                            ? "bg-blue-600 text-white"
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
                      <div className="flex w-fit items-center gap-1 rounded-2xl bg-white px-3 py-2 shadow-sm">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                )}
              <div ref={messagesBottomRef} />
            </div>
            {showScrollToBottom && (
              <button
                type="button"
                onClick={() => scrollToLatestMessage()}
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition-colors hover:bg-slate-800"
                aria-label="Cuộn xuống tin mới nhất"
              >
                <ArrowDown size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3 bg-slate-100 p-4">
            <input
              value={input}
              onChange={(event) => handleInputChange(event.target.value)}
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-900"
              placeholder="Chat message"
              disabled={!selectedConversation || isSending}
            />
            <button
              type="submit"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm transition-opacity disabled:opacity-50"
              disabled={!selectedConversation || isSending || !input.trim()}
              aria-label="Gửi tin nhắn"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </div>
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
            <DialogDescription>
              Thông tin tài khoản đang nhắn trong hội thoại này.
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Họ tên</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {selectedConversation.user_fullname || "Chưa cập nhật"}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  <p className="mt-1 break-words font-semibold text-slate-950">
                    {selectedConversation.user_email || "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Số điện thoại</p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {selectedConversation.user_phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Sân đang hỏi</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {selectedConversation.stadium_name || "Không có thông tin sân"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
