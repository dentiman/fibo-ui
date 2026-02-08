---
name: commit
description: Commit all changes with an auto-generated descriptive message. Use /commit push to also push to origin.
disable-model-invocation: true
argument-hint: "[push]"
---

Commit all current changes with a well-crafted commit message. If the argument is `push`, also push to `origin` after committing.

## Steps

1. **Analyze changes** — run these commands in parallel:
   - `git status` (never use `-uall`)
   - `git diff` and `git diff --cached` to see all staged and unstaged changes
   - `git log --oneline -5` to match the repo's commit message style

2. **Stage all changes** — run `git add -A` to stage everything (untracked files included).

3. **Draft the commit message** following these rules:
   - First line: short imperative summary (max ~72 chars), lowercase start, no period. Focus on **what changed and why**, not file names.
   - If the changeset is non-trivial, add a blank line then a bullet-point body that groups changes by area/purpose. Keep each bullet concise.
   - End with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`.
   - Match the style of recent commits in the repo.
   - Do NOT commit files that look like secrets (`.env`, credentials, tokens). Warn the user if any are present.

4. **Create the commit** using a HEREDOC for the message:
   ```
   git commit -m "$(cat <<'EOF'
   <message>

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```

5. **Verify** — run `git status` to confirm the commit succeeded.

6. **Push (only if `$ARGUMENTS` contains `push`)** — run `git push origin HEAD` and show the result. If `$ARGUMENTS` does not contain `push`, skip this step entirely.

## Important
- Never amend previous commits — always create a new one.
- Never force-push.
- Never skip hooks (`--no-verify`).
- If a pre-commit hook fails, fix the issue, re-stage, and create a NEW commit.
- Always use `git add -A` to include all changes.
