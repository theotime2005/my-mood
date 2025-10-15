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

## Version Management

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated version management. See [VERSIONING.md](./VERSIONING.md) for more information on how to create releases and the versioning strategy.
