# My Mood 🌈

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20.10-blue)](https://www.docker.com/)

A comprehensive mental wellness platform designed for enterprises to monitor and improve employee well-being. Built with privacy-first principles, My Mood allows employees to anonymously record their mental state while enabling managers to visualize aggregated mood trends.

## ✨ Key Features

- **🔒 Privacy-First**: Complete anonymity for employee mood entries
- **📊 Analytics Dashboard**: Real-time mood trends and insights for managers
- **📱 Multi-Platform**: Mobile app (React Native) and web interface (Vue.js)
- **🚀 Easy Deployment**: Docker-based deployment with support for GCP and AWS
- **🔐 Secure**: Built-in authentication, encryption, and security best practices
- **📈 Scalable**: Designed to grow with your organization

## 🎯 Use Cases

- Monitor team morale and well-being
- Identify workplace stress factors early
- Track the impact of organizational changes
- Support mental health initiatives
- Improve employee engagement

---

This project was created in 2025 as an educational project to help companies build a healthier workplace culture. The resources are free and open source - fork and adapt for your personal or enterprise use.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Installation Methods](#-installation-methods)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Version Management](#-version-management)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Using Docker (Recommended)

The fastest way to get started using our automated script:

```bash
# Clone the repository
git clone https://github.com/theotime2005/my-mood.git
cd my-mood

# Run the deployment script
./scripts/docker-deploy.sh
```

Or manually with Docker Compose:

```bash
# Copy environment files
cp api/sample.env api/.env
cp admin/sample.env admin/.env

# Start all services with Docker Compose
docker compose up -d

# Initialize the database
docker compose exec api npm run first-deploy
```

**Services will be available at:**
- 🌐 Admin Interface: http://localhost:80
- 🔌 API: http://localhost:3000
- 🗄️ Database: localhost:5432

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment on GCP or AWS.

### Manual Setup

For development or if you prefer not to use Docker:

```bash
# Clone the repository
git clone https://github.com/theotime2005/my-mood.git
cd my-mood

# Run the configuration script
npm run configure
```

This script will:
- Install all dependencies
- Set up environment files
- Start Docker container for PostgreSQL
- Initialize the database with sample data

---

## 📁 Project Structure

```
my-mood/
├── api/                    # Backend API (Node.js/Express)
│   ├── src/               # Source code
│   │   ├── auth/         # Authentication & authorization
│   │   ├── users/        # User management
│   │   ├── moods/        # Mood tracking logic
│   │   └── shared/       # Shared utilities
│   ├── db/               # Database migrations & seeds
│   ├── tests/            # API tests
│   ├── server.js         # Express server entry point
│   └── Dockerfile        # Docker configuration
│
├── admin/                  # Admin Web Interface (Vue.js)
│   ├── src/              # Vue components & logic
│   │   ├── components/   # Reusable UI components
│   │   ├── views/        # Page components
│   │   ├── router/       # Vue Router configuration
│   │   └── stores/       # Pinia state management
│   ├── public/           # Static assets
│   ├── tests/            # Frontend tests
│   └── Dockerfile        # Docker configuration
│
├── my-mood/               # Mobile App (React Native/Expo)
│   ├── src/              # App source code
│   │   ├── screens/      # Screen components
│   │   ├── components/   # Reusable components
│   │   └── adapters/     # API adapters
│   ├── assets/           # Images, icons, fonts
│   └── tests/            # Mobile app tests
│
├── scripts/               # Setup & utility scripts
├── compose.yml            # Docker Compose configuration
├── USER_GUIDE.md          # Comprehensive user guide
├── DEPLOYMENT.md          # Cloud deployment guide
└── README.md              # This file
```

---

## 🛠️ Installation Methods

### Method 1: Docker Compose (Production-Ready)

Best for: Production deployments, testing the full stack

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Method 2: Automated Script (Development)

Best for: Local development, quick setup

```bash
npm run configure
```

### Method 3: Manual Setup (Advanced)

Best for: Custom configurations, debugging

1. **Install Dependencies**
   ```bash
   npm ci
   npm run ci-all
   ```

2. **Setup API**
   ```bash
   cd api
   cp sample.env .env
   # Edit .env with your configuration
   npm run db:reset
   ```

3. **Setup Admin**
   ```bash
   cd admin
   cp sample.env .env
   # Edit .env to point to your API
   ```

4. **Setup Mobile App**
   ```bash
   cd my-mood
   npm install
   ```

---

## 💻 Development

### Starting Development Servers

Run all services in development mode:

```bash
# Start all services (API, Admin, Mobile)
npm run dev-all
```

Or start individually:

```bash
# API server (with hot reload)
npm run dev:api

# Admin web interface
npm run dev:admin

# Mobile app
npm run dev:my-mood
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific module tests
npm run test:api
npm run test:admin
npm run test:my-mood
```

### Code Linting

```bash
# Lint all projects
cd api && npm run lint
cd admin && npm run lint
cd my-mood && npm run lint

# Auto-fix issues
npm run lint:fix  # In each directory
```

### Database Management

```bash
cd api

# Create new migration
npm run db:new-migration

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback:latest

# Reset database (drop, create, migrate, seed)
npm run db:reset

# Seed database with sample data
npm run db:seed
```

---

## 🚀 Deployment

### Docker Deployment

Deploy the complete stack using Docker:

```bash
# Production build
docker compose up -d --build

# Run database migrations
docker compose exec api npm run first-deploy
```

### Cloud Deployment

Detailed guides for cloud platforms:

- **[Google Cloud Platform (GCP)](./DEPLOYMENT.md#google-cloud-platform-deployment)**
  - Cloud Run (Serverless)
  - Google Kubernetes Engine (GKE)
  - Cloud SQL for PostgreSQL

- **[Amazon Web Services (AWS)](./DEPLOYMENT.md#aws-deployment)**
  - ECS Fargate (Serverless containers)
  - Elastic Beanstalk
  - RDS for PostgreSQL

- **Other Platforms**
  - Any server with Docker support
  - Heroku, DigitalOcean, Azure (similar patterns)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Environment Variables

#### API Configuration

Key variables in `api/.env`:

```bash
DATABASE_URL=postgres://user:pass@host:5432/mymood
NODE_ENV=production
TOKEN_SECRET=your-secret-key-min-32-chars
TOKEN_EXPIRATION=1h
MAILING_ENABLED=true
BASE_URL=https://yourdomain.com
```

#### Admin Configuration

In `admin/.env`:

```bash
VITE_API_URL=https://api.yourdomain.com
```

See `sample.env` files for all available options.

---

## 📚 Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete guide for end users, managers, and administrators
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment on GCP, AWS, and Docker
- **[VERSIONING.md](./VERSIONING.md)** - Semantic versioning and release process
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes

### API Documentation

The API follows RESTful conventions:

- **Authentication**: JWT-based authentication
- **Endpoints**: 
  - `/auth/*` - Authentication endpoints
  - `/users/*` - User management
  - `/moods/*` - Mood tracking
  - `/analytics/*` - Aggregated statistics

Documentation can be extended with tools like Swagger/OpenAPI.

---

## 🔄 Version Management

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated version management and release creation.

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Breaking Changes:**
Add `BREAKING CHANGE:` in the footer or `!` after type to trigger major version bump.

See [VERSIONING.md](./VERSIONING.md) for detailed information.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** using conventional commits
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Write tests for new features
- Follow existing code style and conventions
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🔐 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email [security@example.com](mailto:security@example.com) instead of using the issue tracker.

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection
- CORS configuration
- Environment-based secrets management

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by workplace wellness initiatives
- Community-driven development

---

## 📞 Support

- **Documentation**: Check the docs in this repository
- **Issues**: [GitHub Issues](https://github.com/theotime2005/my-mood/issues)
- **Discussions**: [GitHub Discussions](https://github.com/theotime2005/my-mood/discussions)

---

## 🗺️ Roadmap

- [ ] Mobile app deployment to App Store and Google Play
- [ ] Advanced analytics and reporting
- [ ] Integration with HR systems
- [ ] Multi-language support
- [ ] Slack/Teams integration for notifications
- [ ] AI-powered mood trend insights

---

**Made with ❤️ by the My Mood team**
