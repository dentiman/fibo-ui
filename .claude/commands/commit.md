---
description: Analyze current changes, generate a commit message, and create a git commit.
argument-hint: "[confirm] [extra context for the commit message]"
---

Use the `commit` skill from `.claude/skills/commit`.

Analyze the current git changes, draft a concise commit message that matches repository style, stage all relevant files for the current change, and create the commit.

Treat `$ARGUMENTS` as optional extra context for the message.

If `$ARGUMENTS` contains `confirm`, work in preview mode:

- analyze the changes
- propose the commit message
- summarize what will be committed
- ask for confirmation
- do not stage or commit until the user confirms

Important rules:

- run `git status --short`, `git diff --cached`, `git diff`, and `git log --oneline -10`
- do not commit secret-looking files such as `.env`, `*.pem`, or `credentials.json`
- if there is nothing to commit, say so and stop
- `/commit confirm` should stop before the commit and ask for approval
- after commit, run `git status --short` and report the commit SHA and message
