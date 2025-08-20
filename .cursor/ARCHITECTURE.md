# Series 65 Training App/Game - Architecture Documentation

## 1. High-Level Overview

The Series 65 Training App/Game is designed to provide users with an interactive and engaging way to prepare for the Series 65 exam. The application combines quiz-based learning with gamification elements to enhance knowledge retention and motivation.

**Goals:**
- Deliver a responsive, user-friendly quiz interface accessible on web and mobile.
- Support real-time scoring, progress tracking, and leaderboard features.
- Ensure data consistency and security for user data and quiz content.
- Facilitate easy content updates and scalability.
- Leverage modern cloud services for hosting, deployment, and data management.

---

## 2. System Diagram

```mermaid
graph TD
    User[User Interface]
    Frontend[Frontend (Next.js)]
    Backend[Backend (Supabase Functions)]
    Database[(Supabase Database - Postgres)]
    Auth[Authentication (Supabase Auth)]
    Storage[Media Storage (Supabase Storage)]
    CDN[CDN (Vercel)]
    Analytics[Analytics & Logging]

    User -->|Interacts with| Frontend
    Frontend -->|API Requests| Backend
    Backend -->|Reads/Writes| Database
    Backend -->|Auth Validation| Auth
    Frontend -->|Auth| Auth
    Frontend -->|Fetch Media| Storage
    Frontend -->|Served via| CDN
    Backend --> Analytics
```

---

## 3. Data Flow Example: Quiz Session Lifecycle

1. **User Authentication:** User logs in or signs up via Supabase Auth.
2. **Start Quiz:** Frontend requests a new quiz session from backend.
3. **Fetch Questions:** Backend queries database for randomized questions and returns them.
4. **Answer Submission:** User submits answers; frontend sends responses to backend.
5. **Score Calculation:** Backend validates answers, calculates score, updates user progress.
6. **Progress Update:** Backend writes progress and scores to database.
7. **Leaderboard Update:** If applicable, leaderboard data is updated.
8. **Session End:** Frontend displays results and feedback.

---

## 4. Hosting & Deployment

- **Frontend:** Hosted on Vercel for optimized CDN delivery, automatic SSL, and seamless deployment via Git integration.
- **Backend & Database:** Supabase provides managed Postgres database, authentication, storage, and serverless functions.
- **CI/CD:** GitHub Actions (or Vercel's built-in) automate testing and deployment pipelines.

---

## 5. Security Model

- **Row Level Security (RLS):** Enforced on Supabase Postgres tables to restrict data access per user.
- **Service Role Usage:** Backend functions use service-role keys with elevated privileges; keys stored securely in environment variables.
- **Secrets Handling:** All sensitive keys and tokens managed via Vercel and Supabase environment variables, never exposed to client.
- **Authentication:** Supabase Auth handles user sessions with JWT tokens.
- **Data Validation:** Backend validates all inputs and enforces business logic to prevent injection or unauthorized actions.

---

## 6. Technology Stack

| Layer           | Technology          | Rationale                                                    |
|-----------------|---------------------|--------------------------------------------------------------|
| Frontend        | Next.js             | React-based, server-side rendering, great developer experience, and Vercel integration |
| Backend         | Supabase Functions  | Serverless, easy integration with Supabase DB and Auth      |
| Database        | PostgreSQL (Supabase)| Robust relational DB with RLS and real-time capabilities    |
| Authentication  | Supabase Auth       | Secure, easy to integrate, supports OAuth and email/password|
| Hosting         | Vercel              | Optimized for Next.js, fast global CDN, automatic scaling   |
| Storage         | Supabase Storage    | For media assets, integrated with Supabase permissions      |

---

## 7. Open Architectural Decisions (ADRs)

- **ADR-001: Use Supabase as Backend and Database**  
  Chosen for its tight integration of Postgres, Auth, Storage, and serverless functions, reducing complexity and speeding up development.

- **ADR-002: Frontend Framework - Next.js**  
  Selected for its hybrid static & server rendering, excellent Vercel support, and React ecosystem.

- **ADR-003: Enforce RLS for Security**  
  Implemented to ensure per-user data isolation and minimize backend complexity.

- **ADR-004: Hosting on Vercel**  
  Selected due to seamless Next.js integration, global CDN, and built-in CI/CD.

- **ADR-005: Serverless Backend Functions**  
  Used to handle business logic securely with service-role keys and minimize the need for a dedicated backend server.

---

This document will evolve as the application grows and requirements change.
