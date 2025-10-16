# Semantic Release Type Configuration Test

This document explains how to verify that semantic-release correctly recognizes custom commit types.

## Configuration

The custom commit types are configured in `.releaserc.json` in two places:

1. **Commit Analyzer** (`@semantic-release/commit-analyzer`): Determines which commits trigger releases
2. **Release Notes Generator** (`@semantic-release/release-notes-generator`): Determines how commits appear in the changelog

## Verifying the Configuration

### Option 1: Check Configuration Syntax

Run the validation script:

```bash
npm run release -- --dry-run
```

This will verify that:
- The configuration file is valid JSON
- All plugins load correctly
- The custom types are recognized

### Option 2: Test with Sample Commits

1. Create commits with different types:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: fix bug"
   git commit -m "tech: update technical implementation"
   git commit -m "docs: update documentation"
   ```

2. Run semantic-release in dry-run mode:
   ```bash
   npm run release -- --dry-run
   ```

3. Check the generated CHANGELOG.md to see if all types appear correctly

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

1. Verify that `conventional-changelog-conventionalcommits` is installed:
   ```bash
   npm list conventional-changelog-conventionalcommits
   ```

2. Check that the `.releaserc.json` file is valid JSON:
   ```bash
   cat .releaserc.json | python3 -m json.tool
   ```

3. Review the semantic-release logs for any error messages
