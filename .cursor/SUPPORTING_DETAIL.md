


# Supporting Detail for Theme Train

This document captures all supporting details not included in `prd.md` or `schema.md`. It provides reference for implementation, scaffolding, and operations.

---

## Domain Models

### Theme
```ts
type Theme = {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or icon name
  createdAt: string;
  updatedAt: string;
  published: boolean;
}
```

### Train
```ts
type Train = {
  id: string;
  themeId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Stop
```ts
type Stop = {
  id: string;
  trainId: string;
  title: string;
  content: string; // markdown or rich text
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### User Progress
```ts
type UserProgress = {
  userId: string;
  stopId: string;
  completedAt: string;
}
```

---

## Next.js Scaffolding

### Pages
- `/` — Home, theme explorer
- `/theme/[themeId]` — Theme detail page
- `/theme/[themeId]/train/[trainId]` — Train detail page
- `/admin` — Admin dashboard (gated)
- `/admin/theme/[themeId]` — Theme editing
- `/admin/train/[trainId]` — Train editing
- `/admin/stop/[stopId]` — Stop editing

### Components
- `ThemeCard`
- `TrainList`
- `StopList`
- `StopContent`
- `ProgressBar`
- `AdminSidebar`
- `Editor` (for markdown/rich text)

### Data Fetching
- Use Next.js API routes for CRUD (see below)
- Use SWR or React Query for client-side fetching, with optimistic updates for admin

---

## API Route Handlers

### `/api/themes`
- `GET`: List all themes
- `POST`: Create new theme

### `/api/themes/[id]`
- `GET`: Get theme by ID
- `PUT`: Update theme
- `DELETE`: Delete theme

### `/api/trains`
- `GET`: List all trains (optionally filtered by themeId)
- `POST`: Create new train

### `/api/trains/[id]`
- `GET`: Get train by ID
- `PUT`: Update train
- `DELETE`: Delete train

### `/api/stops`
- `GET`: List all stops (optionally filtered by trainId)
- `POST`: Create new stop

### `/api/stops/[id]`
- `GET`: Get stop by ID
- `PUT`: Update stop
- `DELETE`: Delete stop

### `/api/progress`
- `GET`: Get user progress (filtered by userId)
- `POST`: Mark stop as completed

---

## Content Authoring Format

- Stops are authored in Markdown, with support for code blocks, images, and callouts.
- Example Stop Content:
  ```markdown
  ## What is a Theme Train?

  A **Theme Train** is a curated learning journey on a single topic.

  > 🚂 Each "stop" is a focused lesson or resource.
  ```

- Trains and Themes use simple text fields for title/description.
- Ordering is managed via `order` fields (integer, unique within parent).

---

## Admin / Content Ops

- Admin routes are protected by authentication (e.g., NextAuth or Clerk)
- Admin UI allows:
  - Creating, editing, deleting themes, trains, stops
  - Drag-and-drop reordering of trains and stops within a theme/train
  - Previewing content as it will appear to users
  - Publishing/unpublishing themes
- Rich text/Markdown editor for stops (e.g., TipTap, SimpleMDE)
- Audit log (basic: show last updated by whom and when)

---

## Test Plan

### Unit Tests
- Model validation (schema, required fields, ordering)
- API route handler logic (CRUD, error cases)

### Integration Tests
- End-to-end creation and consumption of a theme train (admin + user flow)
- Auth-protected routes (admin access)
- Progress tracking for users

### Manual QA
- Author new theme/train/stop, preview, publish, and test user flow
- Reorder trains/stops and verify order persists and displays
- Edge cases: empty states, deleting parents with children, etc.

---

## Open Items

- Decide on authentication provider (Clerk, NextAuth, custom)
- Choose Markdown editor for admin
- Finalize visual design/theme
- Accessibility audit
- Analytics integration (track user progress and engagement)
- Bulk import/export for content
- Versioning for content (optional)
