# Cursor Task Templates for Series 65 Training App/Game

---

## 1) Add Module

```markdown
# Task: Add a new module to the Series 65 Training App

## Description
Create a new module with the following attributes:
- Module title: [Insert title]
- Description: [Insert description]
- Order: [Insert order number]

Ensure the module is added to the module list and accessible from the main navigation.

## Acceptance Criteria
- New module appears in the module list.
- Module details page is scaffolded with placeholder content.
- Navigation to the module works without errors.
```

---

## 2) Add Lessons and Seed Questions

```markdown
# Task: Add lessons and seed questions for a module

## Description
For the module "[Insert module title]", add the following lessons and seed questions:

- Lesson 1: [Insert lesson title]
  - Seed questions:
    - Q1: [Insert question text]
    - Q2: [Insert question text]
- Lesson 2: [Insert lesson title]
  - Seed questions:
    - Q1: [Insert question text]

Ensure questions are linked to the correct lessons and are visible in the lesson view.

## Acceptance Criteria
- Lessons appear under the specified module.
- Seed questions are correctly associated and displayed.
- Questions have correct answer keys and metadata.
```

---

## 3) Add Boss Battle

```markdown
# Task: Add a boss battle for a module

## Description
Create a boss battle quiz for the module "[Insert module title]" that tests mastery of the module content.

- Include [Insert number] questions.
- Questions should be a mix of multiple choice and true/false.
- Provide feedback for correct and incorrect answers.

## Acceptance Criteria
- Boss battle is accessible from the module page.
- Questions load correctly and feedback appears after answering.
- Completion status is tracked.
```

---

## 4) Assemble Practice Exam

```markdown
# Task: Assemble a practice exam for Series 65

## Description
Create a practice exam consisting of [Insert number] questions drawn from multiple modules.

- Randomize question order.
- Include a timer for the exam.
- Provide summary results and explanations after completion.

## Acceptance Criteria
- Practice exam loads with randomized questions.
- Timer counts down correctly.
- Results screen shows detailed performance and explanations.
```

---

## 5) SRS Flashcard Deck

```markdown
# Task: Create an SRS flashcard deck for Series 65 concepts

## Description
Develop a spaced repetition system (SRS) flashcard deck with the following:

- Flashcards containing question on front and answer on back.
- Scheduling algorithm for review intervals.
- User progress tracking per flashcard.

## Acceptance Criteria
- Flashcards can be reviewed in SRS mode.
- Review intervals adjust based on user performance.
- Progress is saved and restored on login.
```

---

## 6) Exhibits Support

```markdown
# Task: Add exhibits support for questions

## Description
Enable attaching exhibit files (images, PDFs) to questions.

- Exhibits should be viewable inline with the question.
- Support zoom and pan for images.
- Ensure accessibility compliance for exhibits.

## Acceptance Criteria
- Exhibits display correctly in question view.
- Zoom and pan controls function.
- Screen readers can access exhibit descriptions.
```

---

## 7) Analytics Events Wiring

```markdown
# Task: Wire analytics events for key user actions

## Description
Implement analytics event tracking for the following actions:

- Module started
- Lesson completed
- Boss battle attempted
- Practice exam started and completed
- Flashcard reviewed

Use the analytics service [Insert service name].

## Acceptance Criteria
- Events fire with correct parameters.
- Events appear in analytics dashboard.
- No performance degradation observed.
```

---

## 8) Admin Bulk Import Tool

```markdown
# Task: Build an admin bulk import tool for questions and lessons

## Description
Create a tool to import questions and lessons in bulk via CSV or JSON.

- Validate data before import.
- Support rollback on failure.
- Provide import summary report.

## Acceptance Criteria
- Admin can upload file and start import.
- Errors are reported clearly.
- Imported data appears correctly in the app.
```

---

## 9) New DB Table with RLS

```markdown
# Task: Create a new database table with row-level security (RLS)

## Description
Add a new table "[Insert table name]" with appropriate columns.

- Implement RLS policies to restrict access based on user roles.
- Test RLS with multiple user scenarios.

## Acceptance Criteria
- Table created and accessible only to authorized users.
- RLS policies enforce correct data access.
- Queries fail when unauthorized access attempted.
```

---

## 10) Performance Hardening

```markdown
# Task: Optimize app performance for better user experience

## Description
Identify and fix performance bottlenecks in the Series 65 Training App.

- Optimize database queries.
- Improve frontend rendering speed.
- Reduce bundle size.

## Acceptance Criteria
- Page load times improve by at least 20%.
- No regressions in functionality.
- Performance metrics documented.
```

---

## 11) Accessibility Audit

```markdown
# Task: Conduct an accessibility audit of the app

## Description
Review the app for accessibility compliance (WCAG 2.1 AA).

- Use automated tools and manual testing.
- Identify issues with keyboard navigation, screen reader support, color contrast, etc.
- Provide a report with findings and recommendations.

## Acceptance Criteria
- Accessibility report delivered.
- Critical issues prioritized for fixing.
- Improvements planned for next sprint.
```

---

## 12) API Endpoint Scaffold

```markdown
# Task: Scaffold a new API endpoint

## Description
Create a new REST API endpoint at `[Insert endpoint path]`.

- Implement GET and POST handlers.
- Validate input data.
- Return JSON responses with appropriate status codes.

## Acceptance Criteria
- Endpoint responds correctly to requests.
- Input validation errors return 400 status.
- Successful requests return expected data.
```

---

## 13) Playwright E2E Scaffold

```markdown
# Task: Create a Playwright end-to-end test scaffold

## Description
Set up Playwright tests for the following user flows:

- User login
- Module navigation
- Lesson completion
- Boss battle attempt

## Acceptance Criteria
- Tests run successfully on CI.
- Tests cover happy path scenarios.
- Failures produce actionable logs.
```

---

## 14) CI Workflow Setup

```markdown
# Task: Set up Continuous Integration workflow

## Description
Configure CI pipeline to:

- Run tests on every pull request.
- Lint codebase.
- Build and deploy to staging environment on merge.

## Acceptance Criteria
- CI pipeline triggers correctly.
- Tests and linting pass on PRs.
- Deployment succeeds without manual intervention.
```

---

## 15) Production Readiness Review

```markdown
# Task: Conduct production readiness review

## Description
Review the app before production release for:

- Security vulnerabilities
- Performance benchmarks
- Error monitoring setup
- Backup and recovery plans

## Acceptance Criteria
- Checklist completed and approved.
- No critical blockers remain.
- Release notes prepared.
```