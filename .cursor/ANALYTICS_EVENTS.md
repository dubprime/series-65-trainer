# Analytics Events Specification for Series 65 Training App/Game

## 1. Purpose

Analytics events provide critical insights into user behavior, app performance, and learning progress within the Series 65 Training App/Game. They help the development and product teams understand how users interact with the app, identify areas for improvement, track engagement and retention, and measure the effectiveness of educational content and gamification features.

## 2. Event Logging Standards

- **Naming Convention**: Use lowercase snake_case for event names (e.g., `session_started`, `question_answered`).
- **Required Fields**:
  - `userId`: a unique, anonymized identifier for the user.
  - `timestamp`: ISO 8601 formatted UTC timestamp of when the event occurred.
- **Privacy Considerations**:
  - Do not log any Personally Identifiable Information (PII) such as real names, emails, or financial data.
  - Use anonymized user IDs.
  - Avoid logging sensitive question content; only log question IDs or categories.
  - If needed, aggregate or hash data to further anonymize.

## 3. Core Events

### `session_started`
Triggered when a user starts an app session.

### `question_answered`
Triggered when a user answers a question.

### `quiz_completed`
Triggered when a user completes a quiz.

### `flashcard_reviewed`
Triggered when a user reviews a flashcard.

### `srs_reviewed`
Triggered when a user completes an SRS (Spaced Repetition System) review session.

### `xp_awarded`
Triggered when a user is awarded experience points (XP).

### `streak_updated`
Triggered when a user's streak is updated.

### `boss_completed`
Triggered when a user completes a boss challenge or level.

## 4. Event Schemas

```typescript
type SessionStartedEvent = {
  event: 'session_started';
  userId: string;
  timestamp: string;
  deviceType?: string; // e.g., 'mobile', 'desktop'
  appVersion?: string;
};

type QuestionAnsweredEvent = {
  event: 'question_answered';
  userId: string;
  timestamp: string;
  questionId: string;
  correct: boolean;
  timeTakenSeconds: number;
  quizId?: string;
  questionCategory?: string;
};

type QuizCompletedEvent = {
  event: 'quiz_completed';
  userId: string;
  timestamp: string;
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
};

type FlashcardReviewedEvent = {
  event: 'flashcard_reviewed';
  userId: string;
  timestamp: string;
  flashcardId: string;
  result: 'known' | 'unknown';
};

type SrsReviewedEvent = {
  event: 'srs_reviewed';
  userId: string;
  timestamp: string;
  sessionId: string;
  totalFlashcards: number;
  correctAnswers: number;
};

type XpAwardedEvent = {
  event: 'xp_awarded';
  userId: string;
  timestamp: string;
  amount: number;
  reason: string; // e.g., 'quiz_completed', 'streak_bonus'
};

type StreakUpdatedEvent = {
  event: 'streak_updated';
  userId: string;
  timestamp: string;
  newStreakCount: number;
  longestStreak?: number;
};

type BossCompletedEvent = {
  event: 'boss_completed';
  userId: string;
  timestamp: string;
  bossId: string;
  success: boolean;
  timeTakenSeconds: number;
};
```

## 5. Data Pipeline

1. **Client**: The app logs events locally and sends them asynchronously to the backend API.
2. **API**: Validates and forwards events to the analytics service.
3. **Analytics Service**: Stores, processes, and visualizes event data. Examples include PostHog and Supabase.
4. **Data Access**: Product and analytics teams query the analytics service for reports and dashboards.

## 6. Privacy & PII Policy

- No real client data (names, emails, financial info) is stored in analytics.
- User IDs are anonymized and do not map directly to personal information.
- Sensitive content (e.g., question text) is never logged.
- Aggregated or hashed data is used when necessary to protect privacy.
- Compliance with GDPR and other relevant privacy regulations is maintained.

## 7. Usage Examples

### Example: `session_started`

```json
{
  "event": "session_started",
  "userId": "anon_12345",
  "timestamp": "2024-06-01T14:23:45Z",
  "deviceType": "mobile",
  "appVersion": "1.2.3"
}
```

### Example: `question_answered`

```json
{
  "event": "question_answered",
  "userId": "anon_12345",
  "timestamp": "2024-06-01T14:25:10Z",
  "questionId": "q789",
  "correct": true,
  "timeTakenSeconds": 12,
  "quizId": "quiz_456",
  "questionCategory": "ethics"
}
```

### Example: `quiz_completed`

```json
{
  "event": "quiz_completed",
  "userId": "anon_12345",
  "timestamp": "2024-06-01T14:35:00Z",
  "quizId": "quiz_456",
  "totalQuestions": 20,
  "correctAnswers": 18,
  "timeTakenSeconds": 600
}
```

### Example: `xp_awarded`

```json
{
  "event": "xp_awarded",
  "userId": "anon_12345",
  "timestamp": "2024-06-01T14:36:00Z",
  "amount": 50,
  "reason": "quiz_completed"
}
```
