# Role
You are a **Senior Frontend Architect & UI Engineer** specializing in **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Your task is to generate a production‑ready, accessible, and responsive chat interface based on the specification below, with clean code, modular components, and clear state management. Prioritize developer experience and future integration with a real-time backend (SignalR/WebSocket compatible).

---

## Objective
Build an internal company chat UI inspired by the provided screenshot of a web messenger app, but with the following updates:
- **Three‑pane layout**:  
  - **Left**: Conversation list of the currently logged‑in user.  
  - **Center**: Chat panel – initially shows an **empty state** until a conversation is selected; then renders the message thread and composer exactly like the screenshot.  
  - **Right**: **Company members directory** with **online/offline presence** indicators.
- **Authentication**: A minimal **Login page** with a single **username** input and a **Verify** button. No password. Store the username locally for the session.

All code must compile and run with `pnpm`/`npm` without additional configuration.

---

## Tech Constraints
- **Next.js 14+ App Router** with **TypeScript**.
- **Tailwind CSS** + **shadcn/ui** (use: `Button`, `Input`, `Badge`, `Separator`, `Avatar`, `ScrollArea`, `Tooltip`, `Toggle`, `Switch`, `Skeleton`, etc.).
- **State management**: **Zustand** store for auth, conversations, members, and UI selection.
- **Icons**: `lucide-react`.
- **No backend required**: create **typed mock services** and **interfaces** that can be swapped for a real API (REST/SignalR/WebSocket) later.
- Use **Client Components** where interactive state is needed. Server Components OK for static shells.

---

## Pages & Routing
- `/login` – minimal page:
  - Centered card with:
    - `Input` labeled “Username”
    - `Button` labeled “Verify”
  - On submit:
    - Save username (e.g., `localStorage` via auth store).
    - Redirect to `/chat`.
- `/chat` – protected route (redirect to `/login` if no username in store):
  - 3‑pane responsive layout.

---

## Layout Spec (Desktop)
- Grid layout: `grid-cols-[320px_1fr_300px]` on **lg+**.  
  On **md** collapse the right pane with a toggle.  
  On **sm** show **left OR center**, with a header toggle (like mobile messenger).
- **Left Pane – Conversations**
  - Header: current user avatar & name, a Search field.
  - Scrollable list of conversations with:
    - Avatar, name/title, last message snippet, timestamp, unread badge.
    - Selected row highlighted; clicking selects conversation and loads messages.
- **Center Pane – Chat**
  - When **no conversation selected**: show empty state with an illustration/icon + tip “Select a conversation to start”.
  - When **selected**:
    - Top bar: chat avatar/name, presence (“last seen 5 mins ago”), action icons (Search in chat, Info).
    - Message thread (resembling screenshot):
      - Date badges (e.g., “Today”).
      - Message bubbles (incoming/outgoing) with timestamps, optional read ticks, mini reactions (e.g., ❤️).
      - Support system messages (e.g., “Chatgram Web was updated.”) as muted/info chips.
    - Composer (sticky at bottom):
      - `Input` (or `Textarea` autosize), `Button` “Send”.
      - Optional emoji / attachment icon placeholders (no upload logic required).
- **Right Pane – Members Directory**
  - Header: “All Members”
  - Scrollable list of all users in the company:
    - Avatar, display name, role (optional), and **presence dot**:
      - **Green** = online, **gray** = offline.
    - Selecting a member may:
      - Start a new DM conversation **or** just show their profile in a side sheet (implement “Start chat” action in UI, backed by mock service).

---

## Data Models (TypeScript)
Create shared types under `@/types`:
```ts
export type ID = string;

export interface User {
  id: ID;
  username: string;
  displayName: string;
  avatarUrl?: string;
  presence: "online" | "offline";
  lastSeen?: string; // ISO
}

export interface Message {
  id: ID;
  conversationId: ID;
  senderId: ID;
  text: string;
  createdAt: string; // ISO
  reactions?: { emoji: string; userIds: ID[] }[];
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: ID;
  title?: string;
  memberIds: ID[];     // includes current user
  lastMessage?: Message;
  unreadCount?: number;
  isGroup?: boolean;
}
```

---

## State Store (Zustand)
Create stores with selectors & actions:
- **Auth Store**
  - `currentUser?: User`
  - `login(username: string)`: creates/loads user, persists to `localStorage`.
  - `logout()`
- **Chat Store**
  - `conversations: Conversation[]`
  - `messagesByConv: Record<ID, Message[]>`
  - `selectedConvId?: ID`
  - Actions: `selectConversation`, `sendMessage(text)`, `addReaction(convId, msgId, emoji)`, `markAsRead(convId)`, `ensureDMWith(userId)`.
- **Directory Store**
  - `members: User[]`
  - `setPresence(userId, presence)`
- Hydrate from mock services on `/chat` mount.

---

## Mock Services
Implement in `@/lib/mock`:
- `mockAuthService.login(username)`
- `mockChatService.listConversations(userId)`
- `mockChatService.listMessages(conversationId)`
- `mockChatService.sendMessage(conversationId, text, senderId)`
- `mockDirectoryService.listMembers()`
- `mockPresenceService.subscribe((events)=>{ ... })`  
  - Simulate presence flips every ~10–30s and new incoming messages to the selected conversation for demo.

All services must return **typed promises** and be easily replaceable later.

---

## Components (shadcn/ui + Tailwind)
Place under `@/components/chat/*`:
- `AppShell` – responsive 3‑pane layout with resizable panes (optional).
- `ConversationList` – search, list items, loading skeletons.
- `ConversationItem` – avatar, title, last message, time, unread badge.
- `ChatHeader` – avatar, name, presence/last seen, actions.
- `MessageList` – virtualized scroll (optional), date dividers, message bubbles:
  - Incoming vs outgoing styles (rounded, different background).
  - Metadata row: time, read ticks, reactions (tap to add ❤️).
- `Composer` – input + Send button. Press **Enter** to send (Shift+Enter for newline).
- `EmptyState` – centered illustration + text.
- `MembersPanel` – list of users with presence dots and “Start chat” CTA.
- `PresenceDot` – small colored indicator with `aria-label`.
- `HeaderBar` (global) – on mobile for toggling panes.
- `ProtectedRoute` (or guard hook) – redirect to `/login` if unauthenticated.

Each component must be **accessible** (labels, roles, focus states) and **keyboard navigable**.

---

## Styling & UX Notes (from screenshot)
- Background of chat thread uses a **patterned wallpaper**; replicate with a subtle CSS background (no external image required) or Tailwind pattern using a gradient/emoji grid placeholder.
- Date chip e.g., **“Today”** centered above messages.
- Message bubble examples:
  - Incoming (light) vs outgoing (green/brand).
  - Reactions (❤️) appear beneath/right of a bubble.
  - Time & single/double tick for status (✓, ✓✓).
- Conversation row shows **snippet** and **time** (e.g., “18:16”), with **unread** badge/dot.
- Show **“last seen X mins ago”** under the chat title in header.

---

## Accessibility
- Proper `aria-live="polite"` for new messages.
- Focus rings and tab order for inputs and buttons.
- Semantic headings and lists where appropriate.
- Respect reduced motion (`prefers-reduced-motion`).

---

## Testing & Quality
- ESLint + TypeScript strict.
- Minimal unit tests for stores (e.g., sending a message updates state).
- Avoid any runtime errors in strict mode.
- Include sample `README.md` with setup steps (`pnpm i && pnpm dev`).

---

## Deliverables
1. Fully working Next.js app with the following structure (suggestion):
```
app/
  login/page.tsx
  chat/page.tsx
  layout.tsx
components/
  chat/
    AppShell.tsx
    ConversationList.tsx
    ConversationItem.tsx
    ChatHeader.tsx
    MessageList.tsx
    Composer.tsx
    MembersPanel.tsx
    PresenceDot.tsx
lib/
  mock/
    auth.ts
    chat.ts
    directory.ts
    presence.ts
stores/
  useAuthStore.ts
  useChatStore.ts
  useDirectoryStore.ts
types/
  index.ts
```
2. Mock data files under `lib/mock/data.ts` (seed a few users + conversations + messages).
3. All imports for shadcn/ui components from `@/components/ui/*`.
4. Responsive behavior verified for **sm / md / lg** breakpoints.
5. Empty state for center pane when nothing is selected.

---

## Interaction Details
- Selecting a conversation in the **left pane**:
  - Sets `selectedConvId`, fetches messages if missing, scrolls to bottom.
  - Marks as read (unread badge cleared).
- Sending a message:
  - Immediately renders a **“sent”** message with timestamp.
  - Mock service updates to **delivered/read** after a short timeout; show ✓✓.
- Presence:
  - Right pane updates **online/offline** dots in real time (mocked).
- Starting a new DM from **MembersPanel**:
  - If no existing conversation with that user, **create** one in store and select it.

---

## Acceptance Criteria
- Build compiles and runs with mock data.
- `/login` → enter username → `/chat` renders 3‑pane layout.
- Center pane shows empty state until a conversation is clicked.
- Message bubbles and composer match the look & feel of the screenshot closely.
- Right pane lists all members with accurate presence (mocked) and is responsive.
- Code is clean, typed, and organized exactly as above, ready to swap mocks for a real API.

---

## Optional Enhancements (if time allows)
- Resizable panes (e.g., `react-resizable-panels`).
- Virtualized message list for long threads (e.g., `@tanstack/react-virtual`).
- Theme toggle (light/dark) respecting system preference.
- Command palette (⌘K) to jump between conversations.
- “Typing…” indicator in header (mocked).

---

## Output Format
Generate the full project code with the structure above. Include all components, stores, mock services, and sample seed data. Provide instructions to run locally. Keep comments concise and professional.
