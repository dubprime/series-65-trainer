# Series 65 Training App/Game API Contract

## 1. Overview

This document defines the API contract for the Series 65 Training App/Game backend services. It outlines the authentication mechanism, available endpoints grouped by domain, request and response schemas, error handling conventions, and example usage. The API enables quiz sessions, spaced repetition system (SRS) flashcard reviews, progress tracking, analytics, and admin content management.

---

## 2. Authentication

- The API uses **Supabase Auth** with JWT-based authentication.
- All endpoints (except potentially health checks or public info) require a valid JWT token in the `Authorization` header:
  
  ```
  Authorization: Bearer <jwt_token>
  ```

- Tokens are issued by Supabase Auth and must be verified on each request.

---

## 3. Endpoints

### Quiz Sessions

- **Start Quiz Session**  
  `POST /api/quiz/start`  
  Starts a new quiz session for the authenticated user.

- **Submit Answer**  
  `POST /api/quiz/answer`  
  Submits an answer for a quiz question in the current session.

- **Complete Quiz Session**  
  `POST /api/quiz/complete`  
  Completes the current quiz session and records results.

---

### Flashcards & SRS

- **Review Flashcards**  
  `GET /api/srs/review`  
  Retrieves flashcards due for review in the spaced repetition system.

- **Get Due Flashcards Count**  
  `GET /api/srs/due`  
  Retrieves the count of flashcards currently due for review.

---

### Progress & Analytics

- **Get User Progress**  
  `GET /api/progress`  
  Returns progress data for the authenticated user.

- **Get Analytics Stats**  
  `GET /api/stats`  
  Returns aggregated analytics and statistics.

---

### Admin Content Management

- **Manage Questions**  
  `POST /api/admin/question`  
  Create or update quiz questions.

- **Manage Flashcards**  
  `POST /api/admin/flashcard`  
  Create or update flashcards.

---

## 4. Request/Response Schemas

```typescript
// Authentication header
type AuthHeader = {
  Authorization: `Bearer ${string}`;
};

// Quiz Sessions
type QuizStartRequest = {};
type QuizStartResponse = {
  sessionId: string;
  questions: Question[];
};

type QuizAnswerRequest = {
  sessionId: string;
  questionId: string;
  answer: string;
};
type QuizAnswerResponse = {
  correct: boolean;
  explanation?: string;
};

type QuizCompleteRequest = {
  sessionId: string;
};
type QuizCompleteResponse = {
  score: number;
  totalQuestions: number;
  details: {
    questionId: string;
    correct: boolean;
  }[];
};

// Flashcards & SRS
type Flashcard = {
  id: string;
  front: string;
  back: string;
  intervalDays: number;
  dueDate: string; // ISO date string
};

type SRSReviewResponse = {
  flashcards: Flashcard[];
};

type SRSDueResponse = {
  dueCount: number;
};

// Progress & Analytics
type ProgressResponse = {
  completedQuizzes: number;
  correctAnswers: number;
  flashcardsReviewed: number;
  lastActive: string; // ISO date string
};

type StatsResponse = {
  totalUsers: number;
  averageScore: number;
  quizzesTaken: number;
  flashcardsCreated: number;
};

// Admin Content Management
type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
};

type AdminQuestionRequest = Question & {
  // If id is present, update; else create new
  id?: string;
};

type AdminQuestionResponse = {
  success: boolean;
  questionId: string;
};

type FlashcardRequest = Flashcard & {
  id?: string;
};

type FlashcardResponse = {
  success: boolean;
  flashcardId: string;
};
```

---

## 5. Error Handling

All endpoints return errors in a standardized format with appropriate HTTP status codes.

```typescript
type ApiError = {
  error: {
    code: string;       // machine-readable error code
    message: string;    // human-readable error message
    details?: any;      // optional additional info
  };
};
```

Example HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

---

## 6. Examples

### Example: Start Quiz Session

**Request**

```
POST /api/quiz/start
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{}
```

**Response**

```json
{
  "sessionId": "session_12345",
  "questions": [
    {
      "id": "q1",
      "questionText": "What is the primary purpose of the Series 65 exam?",
      "options": [
        "To license investment advisors",
        "To license stockbrokers",
        "To license insurance agents",
        "To license real estate agents"
      ],
      "correctOptionIndex": 0,
      "explanation": "The Series 65 exam licenses investment advisor representatives."
    },
    {
      "id": "q2",
      "questionText": "Which of the following is a fiduciary duty?",
      "options": [
        "Suitability",
        "Loyalty",
        "Disclosure",
        "Confidentiality"
      ],
      "correctOptionIndex": 1
    }
  ]
}
```

---

This concludes the API contract for the Series 65 Training App/Game.
