# Contribution Guidelines

## 1. Purpose

These contribution guidelines exist to ensure a consistent and high-quality development process. They help contributors understand how to participate effectively, maintain code quality, and facilitate smooth collaboration.

## 2. How to Contribute

- **Filing Issues:** Use the issue tracker to report bugs, request features, or suggest improvements. Provide clear, detailed descriptions and steps to reproduce when applicable.
- **Submitting Features/Bugfixes:** Fork the repository, create a relevant branch, implement your changes, and submit a pull request.
- **Content Contributions:** For content such as questions or flashcards, follow the content standards outlined in the `CONTENT_GUIDE.md` file.

## 3. Branching Model

- **Feature Branches:** Create branches prefixed with `feature/` for new features.
- **Fix Branches:** Use branches prefixed with `fix/` for bug fixes.
- **Main Branch Protection:** The `main` branch is protected; direct commits are not allowed. Changes must go through pull requests and pass all checks.

## 4. Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for commit messages. Examples include:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `chore:` Maintenance tasks

This helps automate changelog generation and improves clarity.

## 5. Pull Request Process

Before submitting a pull request, ensure:

- All relevant tests pass.
- Database migrations are included if applicable.
- Documentation is updated to reflect changes.
- Code is linted and formatted according to project standards.

Include a clear description of the changes and link related issues.

## 6. Code Standards

- **TypeScript:** Use strict mode to enforce type safety.
- **Linting & Formatting:** Follow ESLint and Prettier configurations to maintain consistent style.
- **Validation:** Use Zod for runtime data validation.
- **Database:** Adhere to RLS (Row-Level Security) policies for all database interactions.

## 7. Content Standards

All content contributions must comply with the guidelines detailed in `CONTENT_GUIDE.md`. This includes standards for question and flashcard authoring to ensure quality and consistency.

## 8. Review Process

- Pull requests are reviewed by at least one maintainer or designated reviewer.
- Approvals are required before merging.
- Reviewers check for code quality, adherence to standards, and completeness.

## 9. Communication

For questions or proposals of larger changes:

- Use the project’s communication channels (e.g., Slack, Discord, mailing list).
- Open an issue to discuss significant changes before implementation.
- Engage respectfully and constructively with the community.
