# User Admin Chat Design

## Goal

Build a real user-to-admin chat feature for the booking stadium app.
This is separate from the current AI chatbot. The AI chatbot answers stadium questions with AI, while this feature lets a logged-in user message the admin team that manages all stadiums.

## Decisions

- Admin is the stadium owner role in this system.
- Admins work as one shared admin group. Any admin can view and reply to any conversation.
- User chat UI should look and behave like the existing floating AI chatbot box.
- Admin chat UI should be an inbox inside the admin panel because admins need to handle many conversations.
- Messages must be persisted in the backend database.
- Socket.IO should be used for realtime delivery because the project already uses Socket.IO for booking slot updates.

## Frontend Scope

### User Chat Box

Add a user-admin chat box on the stadium detail page.

Entry point:
- On `/stadiums/[slug]`, show a clear action such as `Nhắn chủ sân`.
- The action opens a floating chat box similar to `components/client/chat/chatbot.tsx`.

Box behavior:
- Header shows `Chat với chủ sân` and can include the stadium name.
- Body shows messages grouped by sender.
- User messages align to the right.
- Admin messages align to the left.
- Composer stays at the bottom.
- Empty state explains that the user can ask the admin about the selected stadium.
- If the user is not logged in, show a login prompt instead of sending.

Responsive rules:
- Desktop: fixed floating box at the bottom-right, similar to the AI chatbot.
- Mobile: use almost full viewport width and safe height, without overlapping the page content.
- Text must wrap inside bubbles.
- The box must not collide with the existing AI chatbot trigger. If both triggers exist, place them with fixed spacing or merge them into a small support menu.

### Admin Inbox

Add a new admin route:

- `/admin/messages`

Add a sidebar item:

- Label: `Tin nhắn`
- Icon: use a Lucide message icon.

Desktop layout:
- Left panel: conversation list.
- Right panel: selected conversation messages.
- Conversation item should show user name, stadium name, last message, and last message time.
- Selected conversation should be visually clear.

Mobile layout:
- First view shows the conversation list.
- Tapping a conversation opens the chat thread view.
- Thread view has a back button to return to the list.
- Avoid two-column layouts on narrow screens.

### API Calls

Frontend should call backend through the existing Next API proxy pattern when available:

- `POST /api/conversations`
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`
- `PATCH /api/conversations/:id/read`
- `PATCH /api/conversations/:id/close`

### Socket Events

Frontend Socket.IO client joins rooms after the conversation is known.

Client emits:
- `chat:join-conversation` with `conversationId`
- `chat:join-admin` when the logged-in account is admin
- `chat:send-message` only if the implementation chooses socket-first sending

Client listens:
- `chat:message-created`
- `chat:conversation-updated`
- `chat:message-read`

Recommended MVP data flow:
- Send messages through REST first so the backend can validate auth and persist data in one place.
- Backend emits Socket.IO events after a successful insert.

## State Model

User chat box state:
- `isOpen`
- `conversation`
- `messages`
- `input`
- `isLoading`
- `isSending`
- `error`

Admin inbox state:
- `conversations`
- `selectedConversation`
- `messages`
- `input`
- `isLoadingConversations`
- `isLoadingMessages`
- `isSending`
- `error`

## Error Handling

- If not logged in: show login/register action.
- If conversation creation fails: show a short retryable error.
- If message sending fails: keep the typed message and show an error.
- If socket disconnects: keep REST fallback working.
- If admin closes a conversation: disable composer for user and show closed status.

## Out Of Scope For MVP

- File/image attachments.
- Typing indicators.
- Per-admin assignment.
- Per-stadium owner mapping.
- Push notifications or email notifications.
- Message search.
- Deleting messages.

## Tests

Add structure tests for:
- Stadium detail includes the user-admin chat entry point.
- User chat uses a floating box pattern and does not reuse the AI `/api/chat` endpoint.
- Admin sidebar includes `/admin/messages`.
- Admin messages page uses responsive list/thread behavior.
- Socket event names are separate from booking slot events.

Manual visual checks:
- Desktop stadium detail with chat closed/open.
- Mobile stadium detail with chat closed/open.
- Desktop admin inbox.
- Mobile admin inbox list and thread views.
