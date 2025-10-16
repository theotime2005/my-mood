# Semantic Versioning Setup

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate version management and package publishing.

## How it works

The versioning is based on commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - triggers a minor version bump (0.1.0 -> 0.2.0)
- `fix:` - triggers a patch version bump (0.1.0 -> 0.1.1)
- `perf:` - triggers a patch version bump
- Breaking changes (commits with `BREAKING CHANGE:` in the footer) - triggers a major version bump (0.1.0 -> 1.0.0)

## Commit Types

The following commit types are configured in `.releaserc.json`:

- `feat`: New features (triggers minor version bump)
- `fix`: Bug fixes (triggers patch version bump)
- `docs`: Documentation changes (triggers patch version bump)
- `refactor`: Code refactoring (triggers patch version bump)
- `perf`: Performance improvements (triggers patch version bump)
- `tech`: Technical changes (triggers patch version bump)
- `chore`: Maintenance tasks (hidden in changelog, no version bump)
- `style`: Code style changes (hidden in changelog, no version bump)
- `test`: Test changes (hidden in changelog, no version bump)

## Creating a Release

### Manual Release (via GitHub Actions)

1. Go to the **Actions** tab in the GitHub repository
2. Select the **Release** workflow
3. Click **Run workflow**
4. Choose whether to run in dry-run mode (to preview the release without actually creating it)
5. Click **Run workflow**

The workflow will:
- Analyze commits since the last release
- Determine the next version number
- Update `package.json` files in root, api, admin, and my-mood directories
- Generate/update `CHANGELOG.md`
- Create a git tag
- Create a GitHub release

### Local Testing

You can test the release process locally with a dry-run:

```bash
npm run release -- --dry-run
```

## Configuration Files

- `.releaserc.json`: Main semantic-release configuration with custom commit type definitions
- `.versionrc.json`: Legacy configuration file (kept for reference, types are now configured in `.releaserc.json`)
- `.github/workflows/release.yml`: GitHub Actions workflow for manual releases

## Version Synchronization

The release process automatically updates version numbers in all sub-packages:
- `package.json` (root)
- `api/package.json`
- `admin/package.json`
- `my-mood/package.json`

This is handled by the `scripts/update-versions.js` script.
