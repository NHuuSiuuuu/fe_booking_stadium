# User Admin Chat Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the frontend for users to chat with the shared admin group and for admins to manage conversations.

**Architecture:** Add a floating user chat box on stadium detail pages and a dedicated admin inbox page. REST calls load/create conversations and send messages; Socket.IO updates the UI in realtime after backend persistence.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, Socket.IO client, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-03-user-admin-chat-design.md`

## Global Constraints

- User chat UI uses a floating box pattern like `components/client/chat/chatbot.tsx`.
- Human chat must not call the AI chatbot endpoint `/api/chat`.
- Admin chat UI lives at `/admin/messages`.
- Admin sidebar must include `Tin nhắn`.
- Mobile user chat must not break layout or overlap core booking controls.
- Mobile admin inbox must not use a squeezed two-column layout.
- Socket events must use the `chat:*` prefix and must not reuse booking slot events.

---

## File Structure

- Create `types/conversation.ts`: shared frontend types for conversations and messages.
- Create `components/client/chat/user-admin-chat.tsx`: user floating chat box for one stadium.
- Modify `app/(client)/stadiums/[slug]/stadium-detail.tsx`: render the chat box with the current stadium.
- Create `app/(protected-admin)/admin/messages/page.tsx`: admin messages route.
- Create `app/(protected-admin)/admin/messages/messages.tsx`: admin inbox client UI.
- Modify `components/admin/layouts/sidebar.tsx`: add `Tin nhắn`.
- Modify `test/frontend-structure.test.mjs`: structure tests for endpoints, layout, and socket events.

---

### Task 1: Shared Chat Types

**Files:**
- Create: `types/conversation.ts`
- Test: `test/frontend-structure.test.mjs`

**Interfaces:**
- Produces:
  - `Conversation`
  - `ChatMessage`
  - `SenderRole`

- [ ] **Step 1: Write the failing test**

Add this test to `test/frontend-structure.test.mjs`:

```js
test("human chat frontend defines shared conversation types", () => {
  const source = readProjectFile("types/conversation.ts");

  assert.match(source, /export type SenderRole = "user" \| "admin"/);
  assert.match(source, /export type Conversation =/);
  assert.match(source, /stadium_id:\s*number \| null/);
  assert.match(source, /admin_unread_count:\s*number/);
  assert.match(source, /export type ChatMessage =/);
  assert.match(source, /sender_role:\s*SenderRole/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: FAIL because `types/conversation.ts` does not exist.

- [ ] **Step 3: Create types**

Create `types/conversation.ts`:

```ts
export type SenderRole = "user" | "admin";

export type Conversation = {
  id: number;
  user_id: number;
  stadium_id: number | null;
  status: "open" | "closed";
  last_message: string | null;
  last_message_at: string | null;
  user_unread_count: number;
  admin_unread_count: number;
  created_at: string;
  updated_at: string;
  user_fullname?: string | null;
  user_email?: string | null;
  user_phone?: string | null;
  stadium_name?: string | null;
  stadium_slug?: string | null;
};

export type ChatMessage = {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_role: SenderRole;
  content: string;
  read_at: string | null;
  created_at: string;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add types/conversation.ts test/frontend-structure.test.mjs
git commit -m "feat: add chat conversation types"
```

---

### Task 2: User Floating Chat Box

**Files:**
- Create: `components/client/chat/user-admin-chat.tsx`
- Modify: `app/(client)/stadiums/[slug]/stadium-detail.tsx`
- Test: `test/frontend-structure.test.mjs`

**Interfaces:**
- Consumes `Conversation` and `ChatMessage` from Task 1.
- Props:
  - `stadium: { id: number; name: string }`

- [ ] **Step 1: Write the failing test**

Add this test to `test/frontend-structure.test.mjs`:

```js
test("stadium detail renders user admin chat without using AI chat endpoint", () => {
  const detail = readProjectFile("app/(client)/stadiums/[slug]/stadium-detail.tsx");
  const chat = readProjectFile("components/client/chat/user-admin-chat.tsx");

  assert.match(detail, /UserAdminChat/);
  assert.match(detail, /stadium=\{stadium\}/);
  assert.match(chat, /Chat với chủ sân/);
  assert.match(chat, /fetch\("\/api\/conversations"/);
  assert.match(chat, /fetch\(`\/api\/conversations\/\$\{conversation\.id\}\/messages`/);
  assert.doesNotMatch(chat, /\/api\/chat/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: FAIL because `UserAdminChat` does not exist.

- [ ] **Step 3: Create floating chat component**

Create `components/client/chat/user-admin-chat.tsx`:

```tsx
"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import type { ChatMessage, Conversation } from "@/types/conversation";

type Props = {
  stadium: {
    id: number;
    name: string;
  };
};

export default function UserAdminChat({ stadium }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      if (!res.ok) throw new Error(data?.message || "Không mở được cuộc trò chuyện");
      setConversation(data.result);
      const messagesRes = await fetch(`/api/conversations/${data.result.id}/messages`, {
        credentials: "include",
      });
      const messagesData = await messagesRes.json();
      if (!messagesRes.ok) throw new Error(messagesData?.message || "Không tải được tin nhắn");
      setMessages(messagesData.result ?? []);
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

    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Không gửi được tin nhắn");
      setMessages((prev) => [...prev, data.result]);
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
        className="fixed bottom-24 right-6 z-40 rounded-full bg-[#042b47] p-4 text-white shadow-2xl transition-transform hover:scale-105"
        aria-label="Nhắn chủ sân"
      >
        <MessageCircle size={22} />
      </button>

      <section className={`${isOpen ? "flex" : "hidden"} fixed bottom-4 right-4 z-50 h-[70vh] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:h-[480px]`}>
        <header className="flex items-center justify-between bg-[#042b47] px-4 py-3 text-white">
          <div>
            <p className="text-sm font-semibold">Chat với chủ sân</p>
            <p className="text-xs text-white/75">{stadium.name}</p>
          </div>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Đóng chat">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
          {isLoading && <p className="text-sm text-slate-500">Đang tải tin nhắn...</p>}
          {!isLoading && messages.length === 0 && (
            <p className="rounded-lg bg-white p-3 text-sm text-slate-600 shadow-sm">
              Gửi tin nhắn cho admin để hỏi thêm về sân này.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
                message.sender_role === "user"
                  ? "ml-auto bg-[#042b47] text-white"
                  : "mr-auto bg-white text-slate-800 shadow-sm"
              }`}
            >
              {message.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {error && <p className="border-t px-4 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-white p-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#042b47]"
            placeholder="Nhập tin nhắn..."
            disabled={!conversation || isSending}
          />
          <button
            type="submit"
            disabled={!conversation || isSending || !input.trim()}
            className="rounded-lg bg-[#042b47] px-3 text-white disabled:opacity-50"
            aria-label="Gửi tin nhắn"
          >
            <Send size={16} />
          </button>
        </form>
      </section>
    </>
  );
}
```

Modify `app/(client)/stadiums/[slug]/stadium-detail.tsx`:

```tsx
import UserAdminChat from "@/components/client/chat/user-admin-chat";
```

Render near the end of the page:

```tsx
<UserAdminChat stadium={stadium} />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/client/chat/user-admin-chat.tsx app/'(client)'/stadiums/'[slug]'/stadium-detail.tsx test/frontend-structure.test.mjs
git commit -m "feat: add user admin chat box"
```

---

### Task 3: Admin Messages Route And Sidebar

**Files:**
- Create: `app/(protected-admin)/admin/messages/page.tsx`
- Create: `app/(protected-admin)/admin/messages/messages.tsx`
- Modify: `components/admin/layouts/sidebar.tsx`
- Test: `test/frontend-structure.test.mjs`

**Interfaces:**
- Consumes `Conversation` and `ChatMessage` from Task 1.
- Uses APIs from backend plan:
  - `GET /api/conversations`
  - `GET /api/conversations/:id/messages`
  - `POST /api/conversations/:id/messages`

- [ ] **Step 1: Write the failing test**

Add this test to `test/frontend-structure.test.mjs`:

```js
test("admin messages page provides inbox route and sidebar entry", () => {
  const sidebar = readProjectFile("components/admin/layouts/sidebar.tsx");
  const page = readProjectFile("app/(protected-admin)/admin/messages/page.tsx");
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(sidebar, /href:\s*"\/admin\/messages"/);
  assert.match(sidebar, /label:\s*"Tin nhắn"/);
  assert.match(page, /<Messages/);
  assert.match(messages, /fetch\("\/api\/conversations"/);
  assert.match(messages, /fetch\(`\/api\/conversations\/\$\{selectedConversation\.id\}\/messages`/);
  assert.match(messages, /md:grid-cols-\[320px_1fr\]/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: FAIL because `/admin/messages` does not exist.

- [ ] **Step 3: Add sidebar route and admin inbox**

Modify `components/admin/layouts/sidebar.tsx`:

```tsx
import { MessageSquare } from "lucide-react";
```

Add nav item:

```tsx
{ href: "/admin/messages", label: "Tin nhắn", icon: MessageSquare },
```

Create `app/(protected-admin)/admin/messages/page.tsx`:

```tsx
import Messages from "@/app/(protected-admin)/admin/messages/messages";

export default function AdminMessagesPage() {
  return <Messages />;
}
```

Create `app/(protected-admin)/admin/messages/messages.tsx` with:

```tsx
"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import type { ChatMessage, Conversation } from "@/types/conversation";

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  useEffect(() => {
    fetch("/api/conversations", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setConversations(data.result ?? []))
      .catch(() => setConversations([]));
  }, []);

  async function openConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setIsThreadOpen(true);
    const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
      credentials: "include",
    });
    const data = await res.json();
    setMessages(data.result ?? []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedConversation || !input.trim()) return;
    const res = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: input.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessages((prev) => [...prev, data.result]);
      setInput("");
    }
  }

  return (
    <main className="min-h-[calc(100vh-52px)] bg-slate-50 p-4 md:p-6">
      <div className="grid h-[calc(100vh-100px)] overflow-hidden rounded-lg border bg-white md:grid-cols-[320px_1fr]">
        <aside className={`${isThreadOpen ? "hidden md:block" : "block"} border-r`}>
          <div className="border-b p-4">
            <h1 className="text-lg font-bold text-slate-950">Tin nhắn</h1>
          </div>
          <div className="divide-y overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => openConversation(conversation)}
                className="block w-full p-4 text-left hover:bg-slate-50"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {conversation.user_fullname || conversation.user_email || "Người dùng"}
                </p>
                <p className="text-xs text-slate-500">{conversation.stadium_name || "Tất cả sân"}</p>
                <p className="mt-1 truncate text-sm text-slate-600">{conversation.last_message || "Chưa có tin nhắn"}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className={`${isThreadOpen ? "flex" : "hidden md:flex"} min-w-0 flex-col`}>
          <header className="flex items-center gap-2 border-b p-4">
            <button type="button" className="md:hidden" onClick={() => setIsThreadOpen(false)} aria-label="Quay lại">
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {selectedConversation?.user_fullname || "Chọn cuộc trò chuyện"}
              </p>
              <p className="text-xs text-slate-500">{selectedConversation?.stadium_name}</p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                  message.sender_role === "admin"
                    ? "ml-auto bg-slate-900 text-white"
                    : "mr-auto bg-white text-slate-800 shadow-sm"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
              placeholder="Trả lời tin nhắn..."
              disabled={!selectedConversation}
            />
            <button type="submit" className="rounded-lg bg-slate-900 px-3 text-white" aria-label="Gửi tin nhắn">
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/'(protected-admin)'/admin/messages/page.tsx app/'(protected-admin)'/admin/messages/messages.tsx components/admin/layouts/sidebar.tsx test/frontend-structure.test.mjs
git commit -m "feat: add admin messages inbox"
```

---

### Task 4: Socket.IO Client Updates

**Files:**
- Modify: `components/client/chat/user-admin-chat.tsx`
- Modify: `app/(protected-admin)/admin/messages/messages.tsx`
- Test: `test/frontend-structure.test.mjs`

**Interfaces:**
- Consumes backend socket events:
  - `chat:join-conversation`
  - `chat:leave-conversation`
  - `chat:join-admin`
  - `chat:message-created`
  - `chat:conversation-updated`

- [ ] **Step 1: Write the failing test**

Add this test to `test/frontend-structure.test.mjs`:

```js
test("human chat frontend uses dedicated socket events", () => {
  const userChat = readProjectFile("components/client/chat/user-admin-chat.tsx");
  const adminMessages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(userChat, /io\(envConfig\.NEXT_PUBLIC_SOCKET_URL/);
  assert.match(userChat, /chat:join-conversation/);
  assert.match(userChat, /chat:message-created/);
  assert.match(adminMessages, /chat:join-admin/);
  assert.match(adminMessages, /chat:conversation-updated/);
  assert.doesNotMatch(userChat, /join-stadium/);
  assert.doesNotMatch(adminMessages, /join-stadium/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: FAIL until socket client code exists.

- [ ] **Step 3: Add socket subscriptions**

In both components, import:

```tsx
import { io } from "socket.io-client";
import envConfig from "@/config";
```

In user chat after `conversation` exists:

```tsx
useEffect(() => {
  if (!conversation?.id || !envConfig.NEXT_PUBLIC_SOCKET_URL) return;

  const socket = io(envConfig.NEXT_PUBLIC_SOCKET_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    socket.emit("chat:join-conversation", conversation.id);
  });

  socket.on("chat:message-created", (message: ChatMessage) => {
    if (message.conversation_id === conversation.id) {
      setMessages((prev) =>
        prev.some((item) => item.id === message.id) ? prev : [...prev, message],
      );
    }
  });

  return () => {
    socket.emit("chat:leave-conversation", conversation.id);
    socket.disconnect();
  };
}, [conversation?.id]);
```

In admin messages:

```tsx
useEffect(() => {
  if (!envConfig.NEXT_PUBLIC_SOCKET_URL) return;

  const socket = io(envConfig.NEXT_PUBLIC_SOCKET_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    socket.emit("chat:join-admin");
  });

  socket.on("chat:conversation-updated", (conversation: Conversation) => {
    setConversations((prev) => {
      const next = prev.filter((item) => item.id !== conversation.id);
      return [conversation, ...next];
    });
  });

  socket.on("chat:message-created", (message: ChatMessage) => {
    setMessages((prev) =>
      selectedConversation?.id === message.conversation_id &&
      !prev.some((item) => item.id === message.id)
        ? [...prev, message]
        : prev,
    );
  });

  return () => {
    socket.disconnect();
  };
}, [selectedConversation?.id]);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- test/frontend-structure.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/client/chat/user-admin-chat.tsx app/'(protected-admin)'/admin/messages/messages.tsx test/frontend-structure.test.mjs
git commit -m "feat: add realtime chat socket updates"
```

---

### Task 5: Final Frontend Verification

**Files:**
- Verify all frontend files touched in prior tasks.

**Interfaces:**
- Produces frontend branch ready to pair with the backend branch.

- [ ] **Step 1: Run full tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code `0`. Existing warnings may remain if unrelated.

- [ ] **Step 3: Run build**

Run with backend or mock API configured:

```bash
NEXT_PUBLIC_API_ENDPOINT=http://127.0.0.1:3636/api \
NEXT_PUBLIC_URL=http://localhost:3000 \
NEXT_PUBLIC_APP_URL=http://localhost:3000 \
NEXT_PUBLIC_SOCKET_URL=http://127.0.0.1:3636 \
npm run build
```

Expected: build exits `0`.

- [ ] **Step 4: Run whitespace check**

Run: `git diff --check`

Expected: no output and exit code `0`.

- [ ] **Step 5: Manual visual checks**

Use Playwright screenshots or browser inspection for:

- Desktop stadium detail with user chat closed and open.
- Mobile stadium detail with user chat closed and open.
- Desktop `/admin/messages`.
- Mobile `/admin/messages` conversation list.
- Mobile `/admin/messages` selected thread.

- [ ] **Step 6: Push branch**

```bash
git push
```

Expected: `feature/admin-user-dialogs` updates on remote.
