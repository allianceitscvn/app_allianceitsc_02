# ✅ Prompt — BACKEND Checklist (ASP.NET Core + EF Core + SignalR + PostgreSQL)

> Architecture: **REST API for fetch/CRUD** + **SignalR for realtime**.  
> Idempotent 1–1 endpoint: **`POST /api/conversations/exist`** (returns `conversationId`, `existed`, `peer`).  
> SignalR **group by `conversationId`**; **personal group**: `User::{userId}`.

---

## A. Architecture & security
- [ ] Clear separation between **API** (HTTP) and **Hub** (SignalR).
- [ ] Web uses user JWT; integrations use **Client Credentials** (machine-to-machine) — no hub access.
- [ ] Every API/Hub action validates:
  - [ ] User **IsActive**.
  - [ ] User is an **active member** of `conversationId` before join/send.

## B. API contracts (Direct 1–1)
- [ ] **`POST /api/conversations/exist`** *(idempotent get-or-create)*  
  **Request**:
  ```json
  { "peerUserId": "UUID" }
  ```
  **Response 200**:
  ```json
  {
    "conversationId": "UUID",
    "existed": true,
    "peer": { "userId": "UUID", "displayName": "string", "avatarUrl": "string?" }
  }
  ```
  - [ ] Use SQL function `chat.GetOrCreateDirectConversation(userA, userB, createdBy)` with **`pg_advisory_xact_lock`** to avoid duplicates under concurrency.
  - [ ] Reject `peerUserId == me` (400), verify peer exists & active.
- [ ] **`GET /api/conversations/{id}`**: header + members, permissions.
- [ ] **`GET /api/conversations/{id}/messages?limit=&before=&after=`**: **keyset** pagination on `("CreatedAt","Id")`.
- [ ] **`POST /api/conversations/{id}/messages`**: create message (sender from JWT).
- [ ] **`POST /api/conversations/{id}/read`**: upsert read-state **monotonically**.
- [ ] **`GET /api/me/conversations`**: based on view `VMyConversations`, support `ETag/If-None-Match` or `since`.

## C. SignalR Hub
- [ ] `OnConnectedAsync`: `Groups.AddToGroupAsync(conn, $"User::{userId}")`.
- [ ] `JoinConversation(Guid conversationId)`: verify membership → add to group `{conversationId}`.
- [ ] `LeaveConversation(Guid conversationId)`: remove from group.
- [ ] `SendMessage(Guid conversationId, string content)` (if you allow via Hub):
  - [ ] Verify membership.
  - [ ] Persist to DB (MediatR handler).
  - [ ] Auto mark-read for the sender (UPSERT `ConversationReadState`).
  - [ ] Broadcast:
    - [ ] `MessageCreated` → group `{conversationId}`.
    - [ ] `ConversationBump` → each `User::{memberId}` (even if not joined).
- [ ] `TypingStarted/TypingStopped(conversationId)` → broadcast **OthersInGroup**.
- [ ] (Optional) `MarkRead` via Hub for realtime read-receipts (in addition to API).

## D. Data & indexes (PostgreSQL + EF Core)
- [ ] Single schema **`chat`**; tables: `Users`, `Conversations`, `ConversationMembers`, `Messages`, `ConversationReadState`, …
- [ ] View **`VMyConversations`** returns:
  - [ ] `TitleByMember`, `LastMessage*`, `UnreadCount` (optionally exclude self-sent messages).
- [ ] Function **`chat.GetOrCreateDirectConversation(userA, userB, createdBy)`**:
  - [ ] Lock: `pg_advisory_xact_lock(hashtextextended(LEAST||'|'||GREATEST))`.
  - [ ] Returns **one** `conversationId` under heavy concurrency.
- [ ] Indexes:
  - [ ] `Messages("ConversationId","CreatedAt" DESC)` + partial where `IsDeleted=false`.
  - [ ] `ConversationMembers("UserId")`, and `"ConversationId" WHERE "IsActive"`.
- [ ] Read-state UPSERT (no backward moves):
  ```sql
  INSERT INTO "chat"."ConversationReadState"
  ("ConversationId","UserId","LastReadMessageId","LastReadAt")
  SELECT @convId, @userId, @lastMsgId, m."CreatedAt"
  FROM "chat"."Messages" m
  WHERE m."Id"=@lastMsgId AND m."ConversationId"=@convId
  ON CONFLICT ("ConversationId","UserId") DO UPDATE
  SET "LastReadMessageId" = CASE
        WHEN EXCLUDED."LastReadAt" >= "chat"."ConversationReadState"."LastReadAt"
        THEN EXCLUDED."LastReadMessageId"
        ELSE "chat"."ConversationReadState"."LastReadMessageId"
      END,
      "LastReadAt" = GREATEST("chat"."ConversationReadState"."LastReadAt",
                              EXCLUDED."LastReadAt");
  ```

## E. Concurrency & authorization
- [ ] Concurrency test: two parallel `/exist` requests return the same `conversationId` (no duplicates).
- [ ] Every `JoinConversation`/`SendMessage` **verifies membership** against DB.
- [ ] `UnreadCount` increases/decreases correctly on message + read.
- [ ] Offline → online: B’s sidebar shows the new room with correct `UnreadCount`.

## F. Logging, limits & protection
- [ ] Log `conversationId`, `senderId`; **do not** log sensitive `content`.
- [ ] Rate-limit `POST /messages`, `Typing*`.
- [ ] Handle hub errors via `HubException`; keep messages concise.
- [ ] Proper CORS/CSRF for both API & Hub.

## G. Room title policy (DIRECT)
- [ ] `/exist` returns `peer.displayName` so FE can render the title immediately.
- [ ] When FE has `VMyConversations`, sync `TitleByMember` (system-consistent title).

---

## 🔎 Definition of Done — Backend
- [ ] `/api/conversations/exist` is idempotent and concurrency-safe (advisory lock) → **one** `conversationId`.
- [ ] Sending via API/Hub → persisted + broadcast to the correct group; no `receiverId`.
- [ ] `ConversationBump` is sent to every `User::{memberId}` (even if not joined).
- [ ] `VMyConversations` powers the sidebar (latest-first sort, accurate unread).
- [ ] Read-state is monotonic; `UnreadCount` is accurate; soft-delete does not push the pointer back.
- [ ] All join/send paths **verify membership**.

---

## 📑 Sample APIs

```http
POST /api/conversations/exist
Content-Type: application/json
{
  "peerUserId": "UUID"
}
---
200 OK
{
  "conversationId": "UUID",
  "existed": true,
  "peer": { "userId": "UUID", "displayName": "Alice", "avatarUrl": null }
}
```

```http
GET /api/conversations/{conversationId}/messages?limit=50&before=...&after=...
GET /api/me/conversations?limit=30&cursorTs=...&cursorId=...
POST /api/conversations/{conversationId}/messages
{
  "content": "hello"
}
POST /api/conversations/{conversationId}/read
{
  "lastReadMessageId": "UUID"
}
```

## 📡 SignalR events (server emits)
- Group `{conversationId}`:
  - `MessageCreated`, `TypingStarted`, `TypingStopped`, `ReadReceiptUpdated`
- Group `User::{userId}`:
  - `ConversationBump`, `UserOnline`, `UserOffline`
