# 📜 Prompt History & Evolution

> **Usage:** Append every significant AI interaction to the **top** of this file.

## 🪵 Session Log

---

### [2026-02-05] | Task: Generate general_task.md template

**Status:** ✅ Completed
**Agent Used:** Gemini 3

**The Prompt:**

> "Could you make a standard general task issue template for my github repository?"

**The Result/Outcome:**

- Added `general_task.md`

---

### [2026-02-05] | Task: Generate feature_request.md template

**Status:** ✅ Completed
**Agent Used:** Gemini 3

**The Prompt:**

> "Could you make a standard feature request issue template for my github repository?"

**The Result/Outcome:**

- Added `feature_request.md`

---

### [2026-02-05] | Task: Generates bug_report.md template

**Status:** ✅ Completed
**Agent Used:** Gemini 3

**The Prompt:**

> "Could you make a standard bug report issue template for my github repository?"

**The Result/Outcome:**

- Added `bug_report.md`

---

### [2026-02-04] | Task: Generate AGENTS.md for controlled coding agents use

**Status:** ✅ Completed
**Agent Used:** GEMINI

**The Prompt:**

> "Create a AGENTS.md documentation for my gatekeeper ai project
> The core tech stack:
>
> - Runtime: Node
> - Frameworks: cloudflare agents, github apps
>
> Package management & tooling:
> Package manager: pnpm
> Linter: Eslint
> Formater: Prettier
>
> Architecture & File conventions:
> Pattern: monorepo
> Directory structure:
> project/
> ├── .github/
> │   └── ISSUE_TEMPLATE.md      <-- The "Target": What the agent must fill out
> ├── docs/
> │   ├── architecture.md        <-- Project context for the agent
> │   └── setup-guide.md         <-- More project context
> ├── src/
> │   ├── index.ts               <-- The "Brain": Worker entry & Agent definition
> │   └── github.ts              <-- The "Hands": GitHub API logic
> ├── AGENTS.md                  <-- The "Rules": Coding standards & Agent instructions
> ├── wrangler.toml              <-- The "Skeleton": Cloudflare config (Bindings/> Secrets)
> ├── package.json               <-- The "Tools": agents-sdk, wrangler, etc.
> ├── tsconfig.json              <-- The "Language": TypeScript config
> └── README.md                  <-- The "Face": How to use your cool new tool
>
> Naming:
> | Type | Convention | Example |
> |------|------------|---------|
> | Interfaces/Types | PascalCase | `Employee`, `SkillFilter` |
> | Functions/Variables | camelCase | `fetchEmployee`, `isLoading` |
> | Constants | UPPER_SNAKE_CASE | `BASE_API_URL` |
> | React Components | PascalCase.tsx | `TopBanner.tsx` |
> | Reducers | camelCaseReducer.ts | `employeeReducer.ts` |
>
> Integration & Environment:
> Deployment: wrangler
>
> Constraints:
> TypeScript strict mode; never use any
> 2 spaces indentation, single quotes, semicolons required
> Max line length: 100 characters
> Explicit return types on functions
> Prefer interface over type for objects
> Use const assertions for literal types"

**The Result/Outcome:**

- Added `AGENTS.md`

---

### [2026-02-04] | Task: Generates PROMPTS.md template

**Status:** ✅ Completed
**Agent Used:** GPT-5 mini

**The Prompt:**

> "I want to make a prompts.md file where I can document all the prompts I use throughout the development process of my project, could you make me a template?"

**The Result/Outcome:**

- Added `PROMPTS.md`

---

## 📋 History Template (Copy this for new entries)

### [YYYY-MM-DD] | Task: [Short Title]

**Status:** [🏗 In Progress / ✅ Completed / ❌ Failed]
**Agent Used:** [e.g., Cursor, Claude Code, etc.]

**The Prompt:**

> "[Paste the exact prompt you sent here]"

**The Result/Outcome:**

- [List specific files changed]
- [List any bugs or 'hallucinations' that occurred]
- [Link to commit hash if applicable]
