# My mood
This project was carried out in 2025 as part of an educational project whose purpose was to design a platform allowing a company's employers to record their mental state and managers to anonymously visualise the general mental state of the company.
The resources are free, and you can fork and adapt the project for your personal usage or your enterprise.

## Project Setup & Structure

### Installation

1. **Clone the repository**
   
   ```sh
   git clone https://github.com/theotime2005/my-mood.git
   cd my-mood
   ```

2. **Run the configuration script**
   
   This script will install dependencies, set up environment files, start Docker containers, and initialize the database:
   
   ```sh
   npm run configure
   ```
   
   > Make sure you have Docker and Node.js installed on your machine.

3. **Start the applications**
   
   - **API**: From the `api` folder, run `npm start`.
   - **Admin**: From the `admin` folder, run `npm run dev`.
   - **Mobile App**: From the `my-mood` folder, run `npm start` or use your preferred React Native workflow.

---

### Project Structure Overview

- **api/**: Backend API (Node.js/Express)
  - `src/`: Source code for authentication, user management, shared services, etc.
  - `db/`: Database setup, migrations, seeds, and utilities.
  - `tests/`: API tests (acceptance, integration, unit).
  - `server.js`: Main entry point for the API server.

- **admin/**: Admin web interface (Vue.js)
  - `src/`: Vue components, router, stores, etc.
  - `public/`: Static assets.
  - `tests/`: Frontend tests.
  - `vite.config.js`: Vite configuration for development/build.

- **my-mood/**: Mobile application (React Native)
  - `src/`: Screens, adapters, utilities.
  - `assets/`: App icons and images.
  - `tests/`: Mobile app tests.
  
- **scripts/**: Utility scripts for setup and configuration.

- **compose.yml**: Docker Compose configuration for local development (database, etc).

- **package.json**: Project-level dependencies and scripts.

---

## Versioning and Releases

This project uses [Semantic Versioning](https://semver.org/) (semver) and [Conventional Commits](https://www.conventionalcommits.org/) for version management.

### Local Version Bumping

You can bump versions locally using npm scripts:

```sh
# Automatically determine version bump based on commit messages
npm run release

# Explicitly bump patch version (0.0.x)
npm run release:patch

# Explicitly bump minor version (0.x.0)
npm run release:minor

# Explicitly bump major version (x.0.0)
npm run release:major
```

These commands will:
- Update version in all `package.json` files (root, api, admin, my-mood)
- Generate/update `CHANGELOG.md`
- Create a git commit and tag

### Creating a Release via GitHub Actions

To create and publish a release:

1. Go to the **Actions** tab in GitHub
2. Select the **release** workflow
3. Click **Run workflow**
4. Choose the release type (patch, minor, or major)
5. Click **Run workflow**

The workflow will automatically:
- Bump versions in all package.json files
- Generate/update the changelog
- Create a git tag
- Push changes to the main branch
- Create a GitHub Release

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `tech:` - Technical changes (appears in changelog)
- `docs:` - Documentation changes (appears in changelog)
- `refactor:` - Code refactoring (appears in changelog)
- `perf:` - Performance improvements (appears in changelog)
- `chore:` - Maintenance tasks (hidden from changelog)
- `style:` - Code style changes (hidden from changelog)
- `test:` - Test changes (hidden from changelog)
- `ci:` - CI/CD changes (hidden from changelog)

Breaking changes should include `BREAKING CHANGE:` in the commit body (triggers major version bump).
