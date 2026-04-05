---
name: commit
description: Stage all changes and create a git commit. Delegates to an isolated haiku agent — no session context leaks into the commit message.
argument-hint: "[extra context | confirm]"
---

# Commit

Delegate the entire commit to a fresh haiku agent so the commit message is derived from the diff only, not from the conversation.

## Step 1 — gather git state in one shot

Run this single command:

```
git status --short && echo "==DIFF==" && git diff && echo "==CACHED==" && git diff --cached && echo "==LOG==" && git log --oneline -5
```

## Step 2 — spawn isolated haiku agent

Use the **Agent** tool with:
- `model: haiku`
- `subagent_type: general-purpose`
- include in the prompt:
  - the raw output from Step 1
  - the value of `$ARGUMENTS`
  - the full task below

---

### Task for the haiku agent

You are creating a git commit. You have no conversation context — derive everything from the git output provided.

**Arguments:** `$ARGUMENTS`

**Rules:**

- If arguments contain `confirm`: propose the commit message and file list, then STOP and ask the user to confirm. Do not run git commands yet.
- Stage ALL modified, deleted, and untracked files using `git add -A`, EXCEPT files that likely contain secrets (`.env`, `*.pem`, `credentials.json`, etc.). Warn if any are skipped.
- If nothing to commit, report and stop.
- Draft a concise imperative commit message (one line, ≤72 chars) based purely on the diff. Use extra text from arguments to refine it if provided.
- Follow the style of recent commits shown in the log.
- Run `git add -A` then commit with the message using a HEREDOC.
- Append `Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>` as a trailer.
- After committing, run `git status --short` and report the SHA and message.
