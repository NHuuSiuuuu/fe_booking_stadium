import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

test("env example documents every required public environment variable", () => {
  const source = readProjectFile(".env.example");

  for (const key of [
    "NEXT_PUBLIC_API_ENDPOINT",
    "NEXT_PUBLIC_URL",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SOCKET_URL",
  ]) {
    assert.match(source, new RegExp(`^${key}=`, "m"));
  }
});

test("stadium-heavy components consume shared stadium API types", () => {
  const files = [
    "components/client/stadium/map-leaflet.tsx",
    "components/client/stadium/list-stadium.tsx",
    "app/(client)/stadiums/list-stadiums.tsx",
  ];

  for (const file of files) {
    const source = readProjectFile(file);
    assert.match(source, /@\/types\/stadium/);
    assert.doesNotMatch(source, /type StadiumsResponse\s*=/);
    assert.doesNotMatch(source, /total:\s*any/);
  }
});

test("stadium detail route exposes an immediate loading state", () => {
  const source = readProjectFile("app/(client)/stadiums/[slug]/loading.tsx");

  assert.match(source, /Đang tải sân/);
  assert.match(source, /animate-/);
});

test("stadium detail route resets scroll after delayed navigation", () => {
  const pageSource = readProjectFile("app/(client)/stadiums/[slug]/page.tsx");
  const scrollSource = readProjectFile(
    "app/(client)/stadiums/[slug]/scroll-to-top.tsx",
  );

  assert.match(pageSource, /ScrollToTop/);
  assert.match(scrollSource, /"use client"/);
  assert.match(scrollSource, /window\.scrollTo/);
  assert.match(scrollSource, /top:\s*0/);
});

test("map page exposes a radius slider for nearby stadium search", () => {
  const source = readProjectFile("components/client/stadium/map-leaflet.tsx");

  assert.match(source, /const \[radius,\s*setRadius\] = useState\(10\)/);
  assert.match(source, /type="range"/);
  assert.match(source, /min="1"/);
  assert.match(source, /max="30"/);
  assert.match(source, /onChange=\{\(e\) => setRadius\(Number\(e\.target\.value\)\)\}/);
  assert.match(source, /params\.set\("radius", String\(radius\)\)/);
  assert.match(source, /radius \* 1000/);
});

test("mobile map list toggle is centered away from the chat button", () => {
  const source = readProjectFile("components/client/stadium/map-leaflet.tsx");

  assert.match(source, /md:hidden fixed bottom-10 left-1\/2/);
  assert.match(source, /-translate-x-1\/2/);
  assert.doesNotMatch(source, /md:hidden fixed bottom-10 right-4/);
});

test("mobile map list toggle arrow reflects the list state", () => {
  const source = readProjectFile("components/client/stadium/map-leaflet.tsx");

  assert.match(source, /FaArrowDown/);
  assert.match(source, /aria-label=\{showList \? "Ẩn danh sách sân" : "Hiện danh sách sân"\}/);
  assert.match(source, /showList \? \(\s*<FaArrowDown className="size-4" \/>/);
  assert.match(source, /<FaArrowUp className="size-4" \/>/);
});

test("site typography uses the shared Open Sans font token", () => {
  const layoutSource = readProjectFile("app/layout.tsx");
  const globalSource = readProjectFile("app/globals.css");

  assert.match(layoutSource, /variable:\s*"--font-sans"/);
  assert.match(layoutSource, /<body className=\{openSans\.variable\}>/);
  assert.match(globalSource, /font-family:\s*var\(--font-sans\)/);
  assert.match(globalSource, /font-size:\s*15px/);
  assert.match(globalSource, /line-height:\s*1\.6/);
  assert.doesNotMatch(layoutSource, /--font-geist-sans/);
});

test("admin user actions open dialogs instead of stadium routes", () => {
  const source = readProjectFile("app/(protected-admin)/admin/user/users.tsx");

  assert.match(source, /Dialog/);
  assert.match(source, /DialogTrigger/);
  assert.match(source, /Chi tiết tài khoản/);
  assert.match(source, /Chỉnh sửa tài khoản/);
  assert.doesNotMatch(source, /href=\{`\/admin\/stadiums\/update\/`\}/);
  assert.doesNotMatch(source, /href=\{`\/admin\/stadiums\/detail\/`\}/);
});

test("admin user actions call user management APIs and refresh the table", () => {
  const source = readProjectFile("app/(protected-admin)/admin/user/users.tsx");

  assert.match(source, /fetch\(`\/api\/user\/detail\/\$\{user\.id\}`/);
  assert.match(source, /fetch\(`\/api\/user\/update\/\$\{editingUser\.id\}`/);
  assert.match(source, /method:\s*"PATCH"/);
  assert.match(source, /fetch\(`\/api\/user\/delete\/\$\{user\.id\}`/);
  assert.match(source, /method:\s*"DELETE"/);
  assert.match(source, /router\.refresh\(\)/);
});

test("admin user edit dialog can update role and active status", () => {
  const source = readProjectFile("app/(protected-admin)/admin/user/users.tsx");

  assert.match(source, /isadmin:\s*user\.isadmin\s*\?\s*"true"\s*:\s*"false"/);
  assert.match(source, /status:\s*user\.status !== false\s*\?\s*"true"\s*:\s*"false"/);
  assert.match(source, /JSON\.stringify\(\{\s*fullName:\s*formData\.fullName/);
  assert.match(source, /isadmin:\s*formData\.isadmin === "true"/);
  assert.match(source, /status:\s*formData\.status === "true"/);
  assert.match(source, /<option value="true">Admin<\/option>/);
  assert.match(source, /<option value="false">User<\/option>/);
  assert.match(source, /<option value="true">Hoạt động<\/option>/);
  assert.match(source, /<option value="false">Dừng hoạt động<\/option>/);
});

test("admin user detail dialog shows active status", () => {
  const source = readProjectFile("app/(protected-admin)/admin/user/users.tsx");

  assert.match(source, /<span className="text-gray-500">Trạng thái<\/span>/);
  assert.match(source, /detailUser\?\.status !== false\s*\?\s*"Hoạt động"\s*:\s*"Dừng hoạt động"/);
});

test("admin layout stacks sidebar above content on mobile", () => {
  const source = readProjectFile("components/admin/layouts/admin-layout-client.tsx");

  assert.match(source, /className="flex flex-col md:flex-row"/);
  assert.match(source, /className="min-w-0 flex-1"/);
});

test("admin sidebar uses readable light colors and mobile horizontal navigation", () => {
  const source = readProjectFile("components/admin/layouts/sidebar.tsx");

  assert.match(source, /bg-white/);
  assert.match(source, /border-slate-200/);
  assert.match(source, /text-slate-700/);
  assert.match(source, /overflow-x-auto/);
  assert.match(source, /md:flex-col/);
  assert.doesNotMatch(source, /text-\[#1b1b1b\]/);
  assert.doesNotMatch(source, /bg-\[#1B1B29\]/);
});

test("admin sidebar keeps logout clear of the floating chat button", () => {
  const source = readProjectFile("components/admin/layouts/sidebar.tsx");

  assert.match(source, /md:pb-16/);
});

test("human chat frontend defines shared conversation types", () => {
  const source = readProjectFile("types/conversation.ts");

  assert.match(source, /export type SenderRole = "user" \| "admin"/);
  assert.match(source, /export type Conversation =/);
  assert.match(source, /stadium_id:\s*number \| null/);
  assert.match(source, /admin_unread_count:\s*number/);
  assert.match(source, /export type ChatMessage =/);
  assert.match(source, /sender_role:\s*SenderRole/);
});

test("stadium detail renders user admin chat without using AI chat endpoint", () => {
  const detail = readProjectFile("app/(client)/stadiums/[slug]/stadium-detail.tsx");
  const chat = readProjectFile("components/client/chat/user-admin-chat.tsx");

  assert.match(detail, /UserAdminChat/);
  assert.match(detail, /stadium=\{stadium\}/);
  assert.match(chat, /Chat với chủ sân/);
  assert.match(chat, />\s*Nhắn chủ sân\s*</);
  assert.match(chat, /z-\[1000000000\]/);
  assert.match(chat, /fetch\("\/api\/conversations"/);
  assert.match(
    chat,
    /fetch\(`\/api\/conversations\/\$\{conversation\.id\}\/messages`/,
  );
  assert.match(
    chat,
    /fetch\(`\/api\/conversations\/\$\{data\.result\.id\}\/read`/,
  );
  assert.doesNotMatch(chat, /\/api\/chat/);
});

test("admin messages page provides inbox route and sidebar entry", () => {
  const sidebar = readProjectFile("components/admin/layouts/sidebar.tsx");
  const page = readProjectFile("app/(protected-admin)/admin/messages/page.tsx");
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(sidebar, /href:\s*"\/admin\/messages"/);
  assert.match(sidebar, /label:\s*"Tin nhắn"/);
  assert.match(page, /<Messages/);
  assert.match(messages, /fetch\("\/api\/conversations"/);
  assert.match(
    messages,
    /fetch\(\s*`\/api\/conversations\/\$\{conversation\.id\}\/messages`/,
  );
  assert.match(
    messages,
    /fetch\(`\/api\/conversations\/\$\{conversation\.id\}\/read`/,
  );
  assert.match(messages, /md:grid-cols-\[320px_1fr\]/);
});

test("admin messages surface stadium context and user detail dialog", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /Thông tin sân/);
  assert.match(messages, /href=\{`\/admin\/stadiums\/detail\/\$\{selectedConversation\.stadium_id\}`\}/);
  assert.match(messages, /Dialog/);
  assert.match(messages, /DialogTitle>Thông tin người dùng/);
  assert.match(messages, /setIsUserDialogOpen\(true\)/);
  assert.match(messages, /selectedConversation\.user_email/);
  assert.match(messages, /selectedConversation\.user_phone/);
});

test("admin header shows realtime message notifications", () => {
  const header = readProjectFile("components/admin/layouts/header.tsx");

  assert.match(header, /fetch\("\/api\/conversations"/);
  assert.match(header, /admin_unread_count/);
  assert.match(header, /reduce/);
  assert.match(header, /chat:conversation-updated/);
  assert.match(header, /chat:message-created/);
  assert.match(header, /\/admin\/messages/);
  assert.match(header, /Tin nhắn mới/);
  assert.doesNotMatch(header, />\s*2\s*<\/span>/);
});

test("human chat frontend uses dedicated socket events", () => {
  const userChat = readProjectFile("components/client/chat/user-admin-chat.tsx");
  const adminMessages = readProjectFile(
    "app/(protected-admin)/admin/messages/messages.tsx",
  );

  assert.match(userChat, /io\(envConfig\.NEXT_PUBLIC_SOCKET_URL/);
  assert.match(userChat, /chat:join-conversation/);
  assert.match(userChat, /chat:message-created/);
  assert.match(adminMessages, /chat:join-admin/);
  assert.match(adminMessages, /chat:conversation-updated/);
  assert.doesNotMatch(userChat, /join-stadium/);
  assert.doesNotMatch(adminMessages, /join-stadium/);
});

test("human chat frontend authenticates socket connections with REST-issued token", () => {
  const userChat = readProjectFile("components/client/chat/user-admin-chat.tsx");
  const adminMessages = readProjectFile(
    "app/(protected-admin)/admin/messages/messages.tsx",
  );

  for (const source of [userChat, adminMessages]) {
    assert.match(source, /fetch\("\/api\/conversations\/socket-token"/);
    assert.match(source, /auth:\s*\{\s*token:\s*data\.result\.token\s*\}/);
  }
});

test("human chat bubbles fit content and show message times", () => {
  const userChat = readProjectFile("components/client/chat/user-admin-chat.tsx");
  const adminMessages = readProjectFile(
    "app/(protected-admin)/admin/messages/messages.tsx",
  );

  for (const source of [userChat, adminMessages]) {
    assert.match(source, /function\s+formatTime\(value:\s*string \| null\)/);
    assert.match(source, /w-fit/);
    assert.match(source, /max-w-\[\d+%\]/);
    assert.match(source, /formatTime\(message\.created_at\)/);
  }
});

test("human chat frontend emits and displays typing indicators", () => {
  const userChat = readProjectFile("components/client/chat/user-admin-chat.tsx");
  const adminMessages = readProjectFile(
    "app/(protected-admin)/admin/messages/messages.tsx",
  );

  for (const source of [userChat, adminMessages]) {
    assert.match(source, /chat:typing/);
    assert.match(source, /chat:stop-typing/);
    assert.match(source, /typingTimeoutRef/);
    assert.match(source, /animate-bounce/);
    assert.doesNotMatch(source, /Đang nhập/);
  }
});

test("admin message loading uses skeleton animation instead of loading text", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /MessageThreadSkeleton/);
  assert.match(messages, /animate-pulse/);
  assert.doesNotMatch(messages, /Đang tải tin nhắn/);
});
