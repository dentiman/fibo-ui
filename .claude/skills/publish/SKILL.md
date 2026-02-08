---
name: publish
description: Bump versions, build, and publish @fibo-ui/cdk and/or @fibo-ui/components to npm.
argument-hint: "[cdk | components]"
---

Publish libraries to npm. Assumes the user is already logged in to npm.

**Argument handling:**
- `cdk` — publish only `@fibo-ui/cdk`
- `components` — publish only `@fibo-ui/components`
- no argument — publish both (CDK first, then Components)

## Paths

- CDK package.json: `projects/fibo-ui/cdk/package.json`
- Components package.json: `projects/fibo-ui/components/package.json`
- CDK dist: `dist/fibo-ui/cdk`
- Components dist: `dist/fibo-ui/components`

## Steps

### 1. Determine scope

Parse `$ARGUMENTS`:
- If it contains `cdk` (but not `components`) → scope = **cdk only**
- If it contains `components` (but not `cdk`) → scope = **components only**
- Otherwise (empty or both) → scope = **both**

### 2. Ask version bump type

Ask the user which version bump to apply. Offer these choices:
- **patch** (0.0.x) — bug fixes, small changes (Recommended)
- **minor** (0.x.0) — new features, non-breaking
- **major** (x.0.0) — breaking changes

Apply the same bump type to all libraries in scope.

### 3. Bump versions

Read current versions from the source `package.json` files (paths above).

Compute new versions according to the chosen bump type using semver rules:
- patch: increment the third number
- minor: increment the second number, reset third to 0
- major: increment the first number, reset second and third to 0

Update the `"version"` field in each in-scope source `package.json`.

**Important:** If **both** libraries are in scope, after bumping `@fibo-ui/cdk`, also update the `peerDependencies["@fibo-ui/cdk"]` version range in `projects/fibo-ui/components/package.json` to `^<new-cdk-version>`.

If **only components** is in scope, do NOT touch the CDK peer dependency version.

### 4. Commit changes (if any)

Run `git status` to check for uncommitted changes (including the version bumps just made).

If there are changes, invoke the `/commit` skill to commit them. The commit message should follow the repo style, e.g.: `bump @fibo-ui/cdk to 0.0.10 and @fibo-ui/components to 0.1.12`.

If the working tree is clean (no changes at all, which is unlikely after version bumps), skip this step.

### 5. Build

Build the libraries using `ng build` (production config is the default):
- If scope includes **cdk**: `npx ng build @fibo-ui/cdk`
- If scope includes **components**: `npx ng build @fibo-ui/components` (this automatically builds CDK first via `dependsOn`)

If building both, it's enough to run `npx ng build @fibo-ui/components` since it depends on CDK and will build it automatically.

Wait for the build to succeed. If it fails, stop and report the error — do NOT publish.

### 6. Publish

Publish from the **dist** directories:

- CDK: `cd dist/fibo-ui/cdk && npm publish --access public`
- Components: `cd dist/fibo-ui/components && npm publish --access public`

Publish in order: CDK first, then Components (Components depends on CDK).

Only publish the libraries that are in scope.

### 7. Report

Show a summary:
- Which packages were published and their new versions
- npm links: `https://www.npmjs.com/package/@fibo-ui/cdk` and/or `https://www.npmjs.com/package/@fibo-ui/components`

## Important

- Never publish without building first.
- Never publish if the build fails.
- Always publish from the `dist/` directory, not from `projects/`.
- If npm publish fails, report the error and stop.
- The user is assumed to be logged in to npm — do NOT run `npm login`.