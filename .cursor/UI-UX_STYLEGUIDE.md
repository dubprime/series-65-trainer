

# Series 65 Training App/Game UI/UX Style Guide

---

## 1. Purpose

A UI/UX style guide ensures a unified, intuitive, and accessible experience across the Series 65 Training App/Game. It serves as a reference for designers and developers, promoting consistency, clarity, and usability to maximize learning effectiveness and engagement.

---

## 2. Design Principles

- **Clarity**: Interfaces must be easy to understand, with clear labeling and visual hierarchy.
- **Consistency**: Reuse patterns, components, and visual elements throughout the app.
- **Accessibility**: All users, including those with disabilities, must be able to use the app efficiently.
- **Responsiveness**: The UI adapts smoothly to different devices and screen sizes.
- **Gamification without Distraction**: Game elements should motivate and reward learning, not detract from core content.

---

## 3. Core Components

- **QuestionCard**: Displays a single question with its prompt and optional media.
- **ChoiceList**: List of answer options (radio buttons for single-choice, checkboxes for multiple-choice).
- **Timer**: Visual countdown for timed questions or sections.
- **Flashcard**: Double-sided card for quick concept review (flip for answer/explanation).
- **ProgressBar**: Shows user progress through a quiz, section, or overall course.
- **ResultBreakdown**: Summarizes performance: correct/incorrect, explanations, and topic analytics.
- **XPToast**: Small popup showing XP gain, streaks, or bonus rewards.
- **Leaderboard**: Ranks users by XP, streaks, or achievements.

---

## 4. Interaction Patterns

- **Answering Questions**: Select choice(s), confirm with a prominent button. Immediate feedback or proceed to next question.
- **Reviewing Flashcards**: Tap/click or use keyboard to flip. Option to mark as "Known" or "Review Again".
- **Streak Tracking**: Visual indicator of current streak; losing a streak prompts a gentle nudge.
- **Keyboard Shortcuts**:
  - `1-4` or `A-D`: Select answer choices.
  - `Enter`: Submit answer or flip flashcard.
  - `←`/`→`: Navigate between questions/flashcards.

---

## 5. Visual Design

### Typography
- **Headings**: `Inter Bold`, 1.5–2rem, strong hierarchy.
- **Body**: `Inter Regular`, 1rem, high legibility.
- **Monospace**: For code/definitions, use `JetBrains Mono`.

### Colors
- **Primary**: #2563EB (Blue 600)
- **Secondary**: #F59E42 (Orange 400)
- **Success**: #22C55E (Green 500)
- **Error**: #EF4444 (Red 500)
- **Background**: #F9FAFB (Light Gray)
- **Surface**: #FFFFFF (White)
- **Text**: #111827 (Gray 900)
- **Disabled**: #D1D5DB (Gray 300)

> Ensure color contrast meets WCAG AA standards (see Accessibility).

### Spacing
- **Base unit**: 8px grid.
- **Component padding**: 16–24px.
- **Element gaps**: 8–16px.

### Iconography
- Use outline icons (e.g., [Heroicons](https://heroicons.dev/)).
- Icons must be meaningful, not decorative only.
- Minimum size: 24x24px.

---

## 6. Accessibility Standards

- **ARIA Roles**: Use semantic roles for custom components (e.g., `role="listbox"` for ChoiceList).
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text.
- **Focus States**: All interactive elements must have a visible focus indicator (e.g., 2px solid outline).
- **Keyboard Navigation**: All features operable via keyboard (Tab, arrows, Enter, Space).
- **Screen Reader Support**: Use `aria-label`, `aria-live`, and descriptive alt text for icons/images.

---

## 7. Gamification Elements

- **Badges**: Earned for milestones (e.g., "10-day streak", "100 questions mastered").
- **Streaks**: Consecutive correct answers or daily activity, visualized with flame or chain icons.
- **Boss Battles**: Special quiz rounds with unique visuals and music; higher stakes, bigger rewards.
- **Progress Rings**: Circular progress bars for daily/weekly goals.

---

## 8. Example Layouts

### Quiz Flow
```
┌─────────────────────────────┐
│        ProgressBar          │
├─────────────────────────────┤
│        QuestionCard         │
│ ┌───────────────┐           │
│ │   Timer       │           │
│ └───────────────┘           │
│        ChoiceList           │
│                             │
│   [Submit Button]           │
└─────────────────────────────┘
│    XPToast (overlay)        │
```

### Flashcard Review Flow
```
┌─────────────────────────────┐
│        Progress Ring        │
├─────────────────────────────┤
│         Flashcard           │
│   [Flip Button / Enter]     │
│ [Known]    [Review Again]   │
└─────────────────────────────┘
│   Streak indicator, XPToast │
```

---

For questions or updates, contact the design lead or submit a pull request with proposed changes.