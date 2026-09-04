"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MessageSquareMore, Bell, User } from "lucide-react";
import { io } from "socket.io-client";
import envConfig from "@/config";
import type { Conversation } from "@/types/conversation";
import type { AdminUser } from "@/types/user";

type HeaderProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  user?: AdminUser;
};

export default function Header({ collapsed, setCollapsed, user }: HeaderProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Conversation[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadTotal = useMemo(
    () =>
      notifications.reduce(
        (total, conversation) => total + conversation.admin_unread_count,
        0,
      ),
    [notifications],
  );

  function upsertConversation(conversation: Conversation) {
    setNotifications((prev) => {
      const next = prev.filter((item) => item.id !== conversation.id);
      return [conversation, ...next];
    });
  }

  useEffect(() => {
    let ignore = false;

    async function loadNotifications() {
      try {
        const res = await fetch("/api/conversations", {
          credentials: "include",
        });
        const data = await res.json();

        if (!ignore && res.ok) {
          setNotifications(data.result ?? []);
        }
      } catch (err) {
        if (!ignore) {
          setNotifications([]);
        }
      }
    }

    loadNotifications();

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

        if (!res.ok || ignore) return;

        socket = io(envConfig.NEXT_PUBLIC_SOCKET_URL, {
          auth: { token: data.result.token },
          withCredentials: true,
        });

        socket.on("connect", () => {
          socket?.emit("chat:join-admin");
        });

        socket.on("chat:conversation-updated", (conversation: Conversation) => {
          upsertConversation(conversation);
        });

        socket.on("chat:message-created", () => {
          loadNotifications();
        });
      } catch (err) {
        // Header notifications are non-blocking for the admin layout.
      }
    }

    async function loadNotifications() {
      try {
        const res = await fetch("/api/conversations", {
          credentials: "include",
        });
        const data = await res.json();

        if (!ignore && res.ok) {
          setNotifications(data.result ?? []);
        }
      } catch (err) {
        // Keep the current notification state if refresh fails.
      }
    }

    connectSocket();

    return () => {
      ignore = true;
      socket?.disconnect();
    };
  }, []);

  function openMessages() {
    setIsNotificationsOpen(false);
    router.push("/admin/messages");
  }

  return (
    <header className="bg-white border-b border-gray-200 flex items-center h-[52px] px-5 sticky top-0 z-10">
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 text-gray-500 hover:text-gray-800 transition-colors mr-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Right */}
      <div className="flex items-center gap-1 ml-auto">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((value) => !value)}
            className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Thông báo tin nhắn"
          >
            <MessageSquareMore className="w-5 h-5" />
            {unreadTotal > 0 && (
              <span className="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-medium min-w-[16px] h-4 rounded-full flex items-center justify-center px-[3px]">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-950">
                  Tin nhắn mới
                </p>
                <p className="text-xs text-slate-500">
                  {unreadTotal > 0
                    ? `${unreadTotal} tin chưa đọc`
                    : "Không có tin chưa đọc"}
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-500">
                    Chưa có hội thoại.
                  </p>
                ) : (
                  notifications.slice(0, 6).map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={openMessages}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {conversation.user_fullname ||
                              conversation.user_email ||
                              conversation.user_phone ||
                              "Người dùng"}
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
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {conversation.last_message || "Chưa có tin nhắn"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <button className="flex items-center gap-2 px-2 h-10 rounded-md hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {user?.fullname || user?.name || "Admin"}
          </span>
        </button>
      </div>
    </header>
  );
}
