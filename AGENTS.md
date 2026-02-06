# AGENTS.md — Project Governance & Intelligence

> **Role:** You are an expert Cloudflare Workers and GitHub App developer. You are helping maintain the **Gatekeeper AI** system.

## 🎯 System Mission

Issue Arcitect AI is a GitHub App powered by Cloudflare Agents. Its primary job is to automate repository management (like filling out `ISSUE_TEMPLATE.md` and triaging logs) using the Cloudflare `agents-sdk`.

---

## 🛠 Tech Stack & Commands

- **Runtime:** Node.js (via Cloudflare Workers)
- **Frameworks:** Cloudflare Agents (`agents-sdk`), GitHub Apps (`octokit`)
- **Package Manager:** `pnpm` (Never use `npm` or `yarn`)
- **Deployment:** `wrangler`

### Canonical Commands

- **Dev:** `pnpm run dev` (Wrangler local development)
- **Deploy:** `pnpm run deploy` (Deploy to Cloudflare)
- **Lint:** `pnpm run lint` / `pnpm run format`
- **Type Check:** `pnpm exec tsc --noEmit`

---

## 📜 Coding Standards (Non-Negotiable)

### TypeScript & Logic

- **Strictness:** `strict: true` is enabled. **Never use `any**`. Use `unknown` if a type is truly uncertain.
- **Return Types:** Every function **must** have an explicit return type.
- **Data Structures:** Prefer `interface` over `type` for object definitions.
- **Literals:** Use `as const` assertions for literal types to ensure type safety.
- **Asynchronous Flow:** Use `async/await`. Avoid `.then()` blocks.

### Style Guide

- **Indentation:** 2 spaces.
- **Quotes:** Single quotes `'` only.
- **Semicolons:** Always required.
- **Line Length:** Max 100 characters.

### Naming Conventions

| Entity                    | Convention         | Example           |
| ------------------------- | ------------------ | ----------------- |
| **Types / Interfaces**    | `PascalCase`       | `GitHubEvent`     |
| **Functions / Variables** | `camelCase`        | `processWebhook`  |
| **Constants**             | `UPPER_SNAKE_CASE` | `MAX_RETRIES`     |
| **Files**                 | `kebab-case.ts`    | `github-logic.ts` |

---

## 🏗 Repository Architecture

- `src/index.ts`: The **Brain**. Contains the `Agent` class and Worker fetch handler.
- `src/github.ts`: The **Hands**. Encapsulates all Octokit and GitHub API logic.
- `wrangler.toml`: The **Skeleton**. Consult this for environment variables and AI model bindings.
- `.github/ISSUE_TEMPLATE.md`: The **Target**. Your code often populates or validates this file.

---

## 🤖 Agent Instructions (Behavioral)

1. **Context Check:** Before modifying `src/index.ts`, always read `docs/architecture.md` to understand the current state-machine logic.
2. **State Management:** When using Cloudflare Agents, remember that state is persisted. Ensure you handle `this.state.storage` updates safely.
3. **GitHub Auth:** Use the authenticated `octokit` instance; never attempt to hardcode tokens.
4. **Step-by-Step:** For complex features, update `docs/architecture.md` first, then implement.

---

## 🚫 No-Go Zones

- Do not modify `tsconfig.json` without explicit permission.
- Do not change the `name` or `compatibility_date` in `wrangler.toml`.
- Do not add external dependencies unless they are compatible with Cloudflare Workers (Edge runtime).
