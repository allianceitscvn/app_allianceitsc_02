# ChatApp - Internal Company Chat UI

A modern, responsive chat application built with React, TanStack Router, TypeScript, and Tailwind CSS. Features include real-time presence indicators, message reactions, and a clean three-pane layout.

## Features

- ✅ **Three-pane responsive layout** (Conversations | Chat | Members)
- ✅ **Simple username-based authentication**
- ✅ **Real-time presence indicators** (online/offline)
- ✅ **Message reactions** with emoji support
- ✅ **Read receipts** (sent, delivered, read)
- ✅ **Direct messaging** - start chats with any team member
- ✅ **Group conversations** support
- ✅ **Fully responsive** - mobile, tablet, and desktop
- ✅ **Accessible** - ARIA labels, keyboard navigation
- ✅ **Dark mode** support
- ✅ **Mock services** ready for backend integration

## Quick Start

```bash
# Install dependencies (from workspace root)
pnpm install

# Start development server
pnpm dev

# Or from this directory
cd apps/web
pnpm dev
```

Open `http://localhost:5173` and login with any username (e.g., "john.doe")

## Project Structure

```
src/
├── components/chat/      # All chat UI components
├── lib/mock/            # Mock services (auth, chat, directory, presence)
├── routes/              # Page routes (login, chat)
├── stores/              # Zustand state management
└── types/               # TypeScript definitions
```

## Tech Stack

- React 19 + TypeScript
- TanStack Router (type-safe routing)
- Zustand (state management)
- Tailwind CSS + shadcn/ui components
- Vite (build tool)

## Mock Data

The app includes pre-seeded data:
- 8 team members with roles and presence
- 8 conversations (DMs and groups)
- Sample messages with reactions
- Simulated presence updates every 15 seconds

## Backend Integration

All mock services in `lib/mock/` are designed to be easily replaced with real API calls. Simply swap the imports:

```typescript
// Mock
import { mockChatService } from '../lib/mock/chat';

// Real API
import { chatService } from '../lib/api/chat';
```

## Key Features

### Message Bubbles
- Different styles for sent/received messages
- Timestamps with relative time
- Read receipts (✓ sent, ✓✓ delivered, blue ✓✓ read)
- Emoji reactions

### Responsive Layout
- **Desktop**: All 3 panes visible
- **Tablet**: Toggleable members pane
- **Mobile**: Single pane with navigation

### Accessibility
- Semantic HTML
- ARIA labels throughout
- Keyboard navigation
- Screen reader support

## Available Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm serve        # Preview production build
```

For more details, see the comprehensive documentation in this README.
