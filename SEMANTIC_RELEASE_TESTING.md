# Semantic Release Type Configuration Test

This document explains how to verify that semantic-release correctly recognizes custom commit types.

## Configuration

The custom commit types are configured in `.releaserc.json` in two places:

1. **Commit Analyzer** (`@semantic-release/commit-analyzer`): Determines which commits trigger releases
2. **Release Notes Generator** (`@semantic-release/release-notes-generator`): Determines how commits appear in the changelog

## Verifying the Configuration

> Note: Releases are now executed by the official GitHub Action (`semantic-release/action`). The repository no longer needs `semantic-release` in its dependencies.

### Option 1: Workflow dry-run (recommended)

Use the GitHub Actions UI to trigger the `Release` workflow manually and set the `dry-run` input to `true`.

1. Go to the Actions tab → select the `Release` workflow → "Run workflow".
2. Set `dry-run` to `true` and run the workflow.
3. Inspect the workflow logs — the action will run semantic-release in dry-run mode and print the analysis and generated release notes. This verifies that:
   - The configuration file is valid JSON
   - Plugins load correctly
   - Custom commit types are recognized

### Option 2: Local validation (optional)

If you want to validate locally (requires `semantic-release` installed locally), run the validation script:

```bash
npm run release -- --dry-run
```

This will verify the same things listed above.

### Option 3: Test with Sample Commits

1. Create commits with different types:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: fix bug"
   git commit -m "tech: update technical implementation"
   git commit -m "docs: update documentation"
   ```

2. Trigger the `Release` workflow in the GitHub Actions UI with `dry-run=true`.

3. Check the generated `CHANGELOG.md` in the workflow log or after a non-dry run to see if all types appear correctly.

## Expected Behavior

### Types that Trigger Releases

- `feat` → Minor version bump (e.g., 1.0.0 → 1.1.0)
- `fix` → Patch version bump (e.g., 1.0.0 → 1.0.1)
- `perf` → Patch version bump
- `refactor` → Patch version bump
- `docs` → Patch version bump
- `tech` → Patch version bump

### Types that Don't Trigger Releases

- `chore` → Hidden from changelog
- `style` → Hidden from changelog
- `test` → Hidden from changelog

## Troubleshooting

If types are not recognized:

1. Verify that the `.releaserc.json` file is valid JSON:
   ```bash
   cat .releaserc.json | python3 -m json.tool
   ```

2. Review the GitHub Actions run logs for any error messages when using the `Release` workflow.

3. If you must run locally, ensure `conventional-changelog-conventionalcommits` is installed locally:
   ```bash
   npm list conventional-changelog-conventionalcommits || echo "install it in the package where you run semantic-release"
   ```

4. Review the semantic-release logs for any error messages
