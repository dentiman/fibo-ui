---
name: commit
description: Analyze changed files, generate a commit message, stage relevant changes, and create a git commit.
argument-hint: "[extra context for the commit message]"
---

# Commit

Create a git commit for the current worktree changes.

The user invoking `/commit` is explicit permission to create a commit unless they request `confirm` mode.

## Argument Handling

Parse `$ARGUMENTS` as optional extra context for the commit message.

- If `$ARGUMENTS` is empty, infer the message only from git changes.
- If `$ARGUMENTS` contains `confirm`, switch to preview mode.
- In preview mode, analyze the changes and propose the commit message first, then ask the user for confirmation before staging or committing.
- If `$ARGUMENTS` also contains additional text besides `confirm`, use that text as extra context for the message.

## Workflow

### 1. Inspect the current git state

Run these commands:

- `git status --short`
- `git diff --cached`
- `git diff`
- `git log --oneline -10`

Use them to understand:

- which files changed
- whether there are staged and unstaged changes
- the repo's commit message style

### 2. Decide what to commit

Commit the current user-facing work in the tree.

- Stage modified tracked files that belong to the current change.
- Stage relevant untracked files.
- Do not commit files that likely contain secrets, credentials, or local-only configuration such as `.env`, `*.pem`, `credentials.json`, or similar sensitive files.
- If such files are present, exclude them and warn the user in the final response.

If there are no relevant changes to commit, stop and report that there is nothing to commit.

### 3. Draft the commit message

Write a concise message based on the actual change set.

Rules:

- Follow the existing repo style from recent commits.
- Prefer short imperative messages like `add tooltip overlay arrow support`.
- Focus on the purpose of the change, not a file-by-file list.
- Use `$ARGUMENTS` only to refine the message, never to contradict the actual diff.

### 4. Create the commit

If running in preview mode, stop before `git add` and present:

- the proposed commit message
- a short summary of what will be committed
- any files that would be excluded

Then ask the user for confirmation.

Only after the user confirms should you run the needed `git add ...` commands and create the commit.

Run the needed `git add ...` commands for relevant files, then create the commit with the drafted message.

After committing, run `git status --short` to verify the result.

### 5. Handle failures safely

If `git commit` fails because of hooks or formatting changes:

- inspect the resulting changes
- stage the hook-produced fixes if they are part of the same change
- create a new normal commit with the intended message
- do not use `--amend` unless the user explicitly asked for amend

Do not use destructive git commands.

## Final Response

Report:

- the commit message used
- the resulting commit SHA if created
- whether any files were intentionally excluded

If preview mode was used and the user has not confirmed yet, do not create a commit and clearly say that the command stopped at the confirmation step.
