---
name: commit
description: Create a git commit for the Gaussia landing repo using Conventional Commits aligned with existing history.
allowed-tools: Bash, Grep, Read, Glob
---

# Conventional commit (Gaussia landing)

Create a git commit using [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

This repository does **not** include commitlint or Husky. There is no automated message checker—consistency comes from matching recent `git log` and the format below.

**Only commit when the user explicitly asks for a commit.** Do not commit proactively. See root `CLAUDE.md` for project conventions.

## Repo context

- **Next.js 16** landing (App Router) — main code: `app/`, `components/`, `scripts/`.
- **Static / papers**: `public/` (figures, `public/papers/…`).
- **Docs**: `docs/` (design copy, papers source, etc.).

Use these paths when choosing a **scope** (optional but helpful).

## Steps

1. Run `git status` (never use `-uall`) and `git diff --staged` to see what is staged.
2. If nothing is staged, run `git diff` for unstaged changes and ask the user which paths to stage.
3. Run `git log --oneline -8` and mirror the project’s style (`feat(landing):`, `task(landing):`, `chore:`, etc.).
4. Pick **type**, optional **scope**, and **description** from the change.
5. Stage only the agreed paths by name (`git add <path> …`). Never `git add -A` or `git add .`.
6. Create the commit with a HEREDOC message (see below).
7. Run `git status` to confirm a clean result (or expected residual untracked files).

## Commit message format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Omit `(scope)` when it does not add clarity: `chore: initialize project`.

### Rules

- **Description**: lowercase, imperative mood, concise, under 100 characters.
- **Body** (optional): explains *why*, not *what*. Blank line after the subject.
- **Footers** (optional): blank line after body; `token: value` or `token #value`.
- **Breaking changes**: `!` after type/scope (e.g. `feat(landing)!:`) and/or `BREAKING CHANGE:` footer.
- **Never** add a `Co-Authored-By` trailer.

### Types

| Type       | When to use |
|------------|-------------|
| `feat`     | New user-facing behavior or section on the landing |
| `fix`      | Bug fix |
| `task`     | Small landing tweaks, polish, or incremental work (used in this repo’s history) |
| `docs`     | Documentation only (`docs/`, README, comments that are the change) |
| `style`    | Formatting only; no logic change |
| `refactor` | Internal code change; same outward behavior |
| `perf`     | Performance improvement |
| `test`     | Tests |
| `ci`       | CI config/scripts (not applicable yet if absent) |
| `chore`    | Tooling, repo hygiene, deps, scripts without product behavior change |

### Scopes (optional)

Prefer a scope when it narrows the change:

| Scope      | Typical paths |
|------------|---------------|
| `landing`  | `app/`, `components/`, landing-specific `scripts/` |
| `public`   | Favicons, static assets, non-paper assets under `public/` |
| `papers` or `figures` | `public/papers/`, figure assets, `scripts/copy-figures.js` when tied to papers |
| `docs`     | `docs/` |

Examples aligned with this repo:

```
feat(landing): new landing design
task(landing): nav logo route
task(landing): minor tweaks
chore: initialize project
docs: add role-adherence paper sources
fix(landing): correct hero layout on small viewports
```

## Commit command

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

<optional body>

<optional footer(s)>
EOF
)"
```

## Safety

- Do **not** commit `.env`, credentials, API keys, or other secrets; warn if those appear in the diff.
- Do **not** amend unless the user explicitly requests it.
- Do **not** use `--no-verify` / skip hooks.
- Do **not** change git config or run destructive git operations unless the user explicitly asks.
- Do **not** push unless the user explicitly asks.
