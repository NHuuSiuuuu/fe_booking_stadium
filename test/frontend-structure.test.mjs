import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirs = ["app", "components", "hooks", "lib"];

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

function listSourceFiles(dir) {
  const absoluteDir = path.join(rootDir, dir);
  if (!fs.existsSync(absoluteDir)) return [];

  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return listSourceFiles(relativePath);
    }

    return /\.(tsx?|jsx?)$/.test(entry.name) ? [relativePath] : [];
  });
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

test("client layout waits for authenticated header state instead of flashing logged-out fallback", () => {
  const source = readProjectFile("app/(client)/layout.tsx");

  assert.match(source, /<HeaderServer \/>/);
  assert.doesNotMatch(source, /fallback=\{<Header initialUser=\{null\} \/>/);
  assert.doesNotMatch(source, /import \{ Suspense \} from "react"/);
});

test("auth forms call root api routes from nested auth pages", () => {
  const loginSource = readProjectFile("app/(auth)/login/login-form.tsx");
  const registerSource = readProjectFile("app/(auth)/register/register-form.tsx");

  assert.match(loginSource, /fetch\(`\/api\/login`/);
  assert.doesNotMatch(loginSource, /fetch\(`api\/login`/);
  assert.match(registerSource, /fetch\(`\/api\/user\/create`/);
  assert.doesNotMatch(registerSource, /fetch\(`api\/user\/create`/);
});

test("client fetch calls use root api paths instead of page-relative api paths", () => {
  const offenders = sourceDirs
    .flatMap(listSourceFiles)
    .filter((filePath) => /fetch\(\s*["'`]api\//.test(readProjectFile(filePath)));

  assert.deepEqual(offenders, []);
});

test("favorite stadium links use the public stadium detail route", () => {
  const source = readProjectFile("app/(client)/favorite/favorite-page.tsx");

  assert.match(source, /href=\{`\/stadiums\/\$\{s\.slug\}`\}/);
  assert.doesNotMatch(source, /href=\{`\/stadium\/\$\{s\.slug\}`\}/);
});

test("favorite stadium cards use optimized images with alt text", () => {
  const source = readProjectFile("app/(client)/favorite/favorite-page.tsx");

  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /<Image/);
  assert.match(source, /alt=\{s\.name\}/);
  assert.doesNotMatch(source, /<img/);
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

  assert.match(messages, /User đang hỏi về sân này/);
  assert.match(messages, /selectedConversation\.stadium_slug/);
  assert.match(messages, /href=\{`\/stadiums\/detail\/\$\{selectedConversation\.stadium_slug\}`\}/);
  assert.doesNotMatch(messages, /href=\{`\/admin\/stadiums\/detail\/\$\{selectedConversation\.stadium_id\}`\}/);
  assert.doesNotMatch(messages, /Thông tin sân/);
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

test("admin message loading uses a circular spinner instead of skeleton or loading text", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /LoaderCircle/);
  assert.match(messages, /MessageThreadLoading/);
  assert.match(messages, /animate-spin/);
  assert.doesNotMatch(messages, /MessageThreadSkeleton/);
  assert.doesNotMatch(messages, /Đang tải tin nhắn/);
});

test("admin messages cache loaded threads by conversation id", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /messagesByConversationId/);
  assert.match(messages, /setMessagesByConversationId/);
  assert.match(
    messages,
    /const cachedMessages = messagesByConversationId\[conversation\.id\]/,
  );
  assert.match(messages, /if \(cachedMessages\)/);
  assert.match(messages, /setMessages\(cachedMessages\)/);
  assert.match(messages, /setIsLoadingMessages\(false\)/);
  assert.match(
    messages,
    /setMessagesByConversationId\(\(prev\) => \(\{\s*\.\.\.prev,\s*\[conversation\.id\]: data\.result \?\? \[\],\s*\}\)\)/s,
  );
});

test("admin messages keep conversation order when a thread is read", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /function\s+mergeConversation\(/);
  assert.match(messages, /options:\s*\{\s*promote\?: boolean\s*\}\s*=\s*\{\}/);
  assert.match(messages, /options\.promote === true/);
  assert.match(
    messages,
    /mergeConversation\(readData\.result,\s*\{\s*promote:\s*false\s*\}\)/,
  );
  assert.doesNotMatch(messages, /function\s+upsertConversation/);
});

test("admin messages use a messenger style layout with a dark chat header", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /getConversationInitial/);
  assert.match(messages, /rounded-full bg-slate-200/);
  assert.match(messages, /bg-slate-100/);
  assert.match(messages, /bg-slate-950 text-white/);
  assert.match(messages, /bg-blue-600 text-white/);
  assert.match(messages, /rounded-full border border-slate-200 bg-white/);
  assert.doesNotMatch(messages, /bg-blue-500/);
});

test("admin messages keep the thread scrollable and provide a scroll-to-bottom button", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /messagesScrollRef/);
  assert.match(messages, /messagesBottomRef/);
  assert.match(messages, /showScrollToBottom/);
  assert.match(messages, /function\s+scrollToLatestMessage/);
  assert.match(messages, /function\s+handleMessagesScroll/);
  assert.match(messages, /onScroll=\{handleMessagesScroll\}/);
  assert.match(messages, /min-h-0 flex-1 overflow-y-auto/);
  assert.match(messages, /aria-label="Cuộn xuống tin mới nhất"/);
  assert.match(messages, /ArrowDown/);
});

test("me sidebar contains messages and uses the logout icon for logout", () => {
  const source = readProjectFile("app/(client)/me/me-setting.tsx");

  assert.match(source, /MessageSquare/);
  assert.match(source, /label:\s*"Tin nhắn"/);
  assert.match(source, /page:\s*"messages"/);
  assert.match(source, /<LogOut className=/);
  assert.doesNotMatch(source, /<Settings className=\{`h-4 w-4 `\} \/>/);
});

test("me page adapts account and message layout for mobile and tablet screens", () => {
  const source = readProjectFile("app/(client)/me/me-setting.tsx");

  assert.match(source, /p-4 sm:p-6/);
  assert.match(source, /flex-col lg:flex-row/);
  assert.match(source, /w-full lg:w-64/);
  assert.match(source, /min-w-0 flex-1/);
  assert.match(source, /grid-rows-\[minmax\(0,220px\)_minmax\(0,1fr\)\]/);
  assert.match(source, /lg:grid-cols-\[280px_1fr\]/);
  assert.match(source, /lg:grid-rows-1/);
});

test("me messages are rendered inside the account page without a new route", () => {
  const source = readProjectFile("app/(client)/me/me-setting.tsx");

  assert.match(source, /activePage == "messages"/);
  assert.match(source, /fetch\("\/api\/conversations"/);
  assert.match(
    source,
    /fetch\(`\/api\/conversations\/\$\{conversation\.id\}\/messages`/,
  );
  assert.match(
    source,
    /fetch\(`\/api\/conversations\/\$\{selectedConversation\.id\}\/messages`/,
  );
  assert.match(source, /chat:join-conversation/);
  assert.match(source, /Chat với chủ sân/);
  assert.doesNotMatch(source, /href=\{['"]\/me\/messages['"]\}/);
});

test("mobile header menu includes the account page link for signed-in users", () => {
  const source = readProjectFile("components/client/layout/header/header.tsx");

  assert.match(source, /href="\/me"/);
  assert.match(source, /Tài khoản của tôi/);
  assert.match(source, /onClick=\{\(\) => setIsMenuOpen\(false\)\}/);
});

test("me messages scroll inside the chat panel without moving the account page", () => {
  const source = readProjectFile("app/(client)/me/me-setting.tsx");

  assert.match(source, /messageScrollRef/);
  assert.match(source, /ref=\{messageScrollRef\}/);
  assert.match(source, /scrollElement\.scrollTop = scrollElement\.scrollHeight/);
  assert.doesNotMatch(
    source,
    /messageBottomRef\.current\?\.scrollIntoView/,
  );
});

test("admin messages can hide a conversation from the admin inbox", () => {
  const messages = readProjectFile("app/(protected-admin)/admin/messages/messages.tsx");

  assert.match(messages, /Trash2/);
  assert.match(messages, /async function\s+deleteConversation/);
  assert.match(
    messages,
    /fetch\(`\/api\/conversations\/\$\{conversation\.id\}`,\s*\{/,
  );
  assert.match(messages, /method:\s*"DELETE"/);
  assert.match(messages, /window\.confirm/);
  assert.match(messages, /chat:conversation-deleted/);
  assert.match(messages, /Ẩn hội thoại với/);
  assert.match(messages, /aria-label=\{`Ẩn hội thoại/);
});

test("booking success page reflects actual payment status and keeps stadium image in color", () => {
  const source = readProjectFile("app/booking/success/[id]/booking-success.tsx");

  assert.match(source, /paymentStatusLabels/);
  assert.match(source, /paid:\s*"Thanh toán thành công"/);
  assert.match(source, /unpaid:\s*"Chờ thanh toán"/);
  assert.match(source, /failed:\s*"Thanh toán đã hủy"/);
  assert.match(source, /data\?\.result\?\.payment_status/);
  assert.doesNotMatch(source, /grayscale/);
  assert.doesNotMatch(source, /Đã thanh toán/);
});

test("booking detail only allows reviews after the booking is completed", () => {
  const detailSource = readProjectFile("app/booking/detail/[id]/booking-detail.tsx");
  const typesSource = readProjectFile("app/booking/detail/[id]/types.ts");

  assert.match(typesSource, /"completed"/);
  assert.match(detailSource, /const isReviewAllowed = booking\?\.status === "completed"/);
  assert.match(detailSource, /isReviewAllowed \?/);
  assert.match(detailSource, /Đánh giá ngay/);
  assert.match(detailSource, /Chỉ có thể đánh giá sau khi sân hoàn thành/);
});
