# My Mood - Deployment Guide

This guide provides instructions for deploying My Mood platform using Docker on various cloud providers.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Deployment](#docker-deployment)
3. [Google Cloud Platform Deployment](#google-cloud-platform-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [SSL/TLS Configuration](#ssltls-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Docker Engine 20.10+ and Docker Compose 2.0+
- Git
- Node.js 20+ (for local development)

### Required Accounts
- Google Cloud Platform account (for GCP deployment)
- AWS account (for AWS deployment)
- Domain name (optional, but recommended for production)

---

## Docker Deployment

### Local Deployment

The simplest way to deploy the entire stack locally:

```bash
# Clone the repository
git clone https://github.com/theotime2005/my-mood.git
cd my-mood

# Create environment files
cp api/sample.env api/.env
cp admin/sample.env admin/.env

# Edit environment files as needed
# Update DATABASE_URL, VITE_API_URL, etc.

# Build and start all services
docker compose up -d

# Run database migrations
docker compose exec api npm run first-deploy

# Check service status
docker compose ps
```

Services will be available at:
- **API**: http://localhost:3000
- **Admin Interface**: http://localhost:80
- **Database**: localhost:5432

### Production Docker Deployment

For production deployment on any server with Docker:

```bash
# Clone and configure as above

# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=postgres://postgres:@postgres:5432/mymood
export VITE_API_URL=https://api.yourdomain.com

# Build with production configuration
docker compose -f compose.yml up -d --build

# Initialize database for first time
docker compose exec api npm run first-deploy

# For subsequent deployments (migrations only)
docker compose exec api npm run post-deploy
```

### Docker Compose Configuration

The `compose.yml` includes:
- **postgres**: PostgreSQL 16.9 database
- **api**: Node.js Express API server
- **admin**: Nginx serving Vue.js admin interface

All services are networked together and can communicate using service names.

---

## Google Cloud Platform Deployment

### Option 1: Google Cloud Run (Recommended for Simplicity)

Cloud Run is a fully managed platform for containerized applications.

#### Setup

```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Deploy Database

```bash
# Create Cloud SQL instance
gcloud sql instances create mymood-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1

# Set root password
gcloud sql users set-password postgres \
  --instance=mymood-db \
  --password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create mymood --instance=mymood-db
```

#### Deploy API

```bash
# Build and push container
cd api
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mymood-api

# Deploy to Cloud Run
gcloud run deploy mymood-api \
  --image gcr.io/YOUR_PROJECT_ID/mymood-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-env-vars DATABASE_URL=postgresql://postgres:PASSWORD@/mymood?host=/cloudsql/YOUR_PROJECT_ID:us-central1:mymood-db \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:mymood-db

# Get API URL
gcloud run services describe mymood-api --region us-central1 --format 'value(status.url)'
```

#### Deploy Admin Interface

```bash
cd admin

# Update VITE_API_URL in .env with API URL from previous step
echo "VITE_API_URL=YOUR_API_URL" > .env

# Build and push container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mymood-admin

# Deploy to Cloud Run
gcloud run deploy mymood-admin \
  --image gcr.io/YOUR_PROJECT_ID/mymood-admin \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Initialize Database

```bash
# Connect to Cloud SQL and run migrations
gcloud sql connect mymood-db --user=postgres

# Or use Cloud Run Job for migrations
gcloud run jobs create mymood-migrate \
  --image gcr.io/YOUR_PROJECT_ID/mymood-api \
  --region us-central1 \
  --set-env-vars DATABASE_URL=... \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:mymood-db \
  --command npm,run,first-deploy
  
gcloud run jobs execute mymood-migrate --region us-central1
```

### Option 2: Google Kubernetes Engine (GKE)

For more control and scalability:

```bash
# Create GKE cluster
gcloud container clusters create mymood-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --region=us-central1

# Get credentials
gcloud container clusters get-credentials mymood-cluster --region=us-central1

# Deploy using kubectl
kubectl apply -f kubernetes/
```

Create Kubernetes manifests in `kubernetes/` directory:
- `postgres-deployment.yaml`
- `api-deployment.yaml`
- `admin-deployment.yaml`
- `ingress.yaml`

### Cost Optimization (GCP)

- Use **Cloud Run** with minimum instances set to 0 for cost savings
- Use **Cloud SQL** with automatic storage increases disabled
- Enable **Cloud CDN** for admin interface static assets
- Use **Preemptible VMs** for GKE if using that option

---

## AWS Deployment

### Option 1: AWS ECS Fargate (Recommended)

Fully managed container orchestration service.

#### Setup

```bash
# Install AWS CLI
# https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure

# Install ECS CLI
# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_installation.html
```

#### Create ECR Repositories

```bash
# Create repositories for container images
aws ecr create-repository --repository-name mymood-api
aws ecr create-repository --repository-name mymood-admin

# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### Deploy Database

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier mymood-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.9 \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-XXXXXXXX \
  --db-name mymood

# Wait for database to be available
aws rds wait db-instance-available --db-instance-identifier mymood-db
```

#### Build and Push Images

```bash
# Build and tag API
cd api
docker build -t YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mymood-api:latest .
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mymood-api:latest

# Build and tag Admin
cd ../admin
docker build -t YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mymood-admin:latest .
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mymood-admin:latest
```

#### Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name mymood-cluster

# Create task definitions (see JSON examples below)
aws ecs register-task-definition --cli-input-json file://api-task-definition.json
aws ecs register-task-definition --cli-input-json file://admin-task-definition.json
```

#### Task Definition Example (api-task-definition.json)

```json
{
  "family": "mymood-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mymood-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/mymood"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/mymood-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Create Services

```bash
# Create API service
aws ecs create-service \
  --cluster mymood-cluster \
  --service-name mymood-api-service \
  --task-definition mymood-api \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-XXXXX],securityGroups=[sg-XXXXX],assignPublicIp=ENABLED}"

# Create Admin service
aws ecs create-service \
  --cluster mymood-cluster \
  --service-name mymood-admin-service \
  --task-definition mymood-admin \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-XXXXX],securityGroups=[sg-XXXXX],assignPublicIp=ENABLED}"
```

#### Setup Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name mymood-alb \
  --subnets subnet-XXXXX subnet-YYYYY \
  --security-groups sg-XXXXX

# Create target groups for API and Admin
aws elbv2 create-target-group \
  --name mymood-api-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-XXXXX \
  --target-type ip

# Create listeners and rules
# Configure routing to appropriate target groups
```

### Option 2: AWS Elastic Beanstalk

Simpler platform-as-a-service option:

```bash
# Initialize Elastic Beanstalk application
eb init -p docker mymood

# Create environment
eb create mymood-prod

# Deploy
eb deploy
```

Create a `Dockerrun.aws.json` for multi-container deployment.

### Cost Optimization (AWS)

- Use **Fargate Spot** for non-critical workloads
- Enable **RDS Auto Scaling** for storage
- Use **CloudFront** as CDN for admin interface
- Set up **Auto Scaling** based on CPU/Memory metrics
- Use **Reserved Instances** for predictable workloads

---

## Environment Configuration

### API Environment Variables (.env)

```bash
# Database
DATABASE_URL=postgres://user:password@host:5432/mymood
TEST_DATABASE_URL=postgres://user:password@host:5432/mymood_test

# Environment
NODE_ENV=production

# Security
PASSWORD_HASH=12
TOKEN_SECRET=your-secret-key-min-32-chars
TOKEN_EXPIRATION=1h

# Logging
LOG_ENABLED=true
LOG_LEVEL=info
LOG_FOR_HUMANS_FORMAT=false
DEBUG_ENABLED=false

# Email (optional)
MAILING_ENABLED=true
MAIL_TEST_ACCOUNT_ENABLED=false
MAILING_SERVICE=gmail
MAILING_SECURE=true
MAILING_PORT=465
MAILING_USER=your-email@gmail.com
MAILING_PASSWORD=your-app-password

# Base URL for redirects
BASE_URL=https://yourdomain.com/#/
```

### Admin Environment Variables (.env)

```bash
# API endpoint
VITE_API_URL=https://api.yourdomain.com
```

### Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong passwords** (min 32 characters for TOKEN_SECRET)
3. **Rotate secrets** regularly
4. **Use managed secret services**:
   - GCP: Secret Manager
   - AWS: Secrets Manager or Parameter Store
5. **Enable HTTPS/TLS** in production

---

## Database Setup

### Initial Migration

```bash
# First deployment
docker compose exec api npm run first-deploy

# Or directly on the server
npm run first-deploy
```

### Subsequent Migrations

```bash
# After deploying code changes
docker compose exec api npm run post-deploy
```

### Backup Strategy

#### Local/Docker Backup

```bash
# Backup
docker compose exec postgres pg_dump -U postgres mymood > backup.sql

# Restore
docker compose exec -T postgres psql -U postgres mymood < backup.sql
```

#### GCP Cloud SQL Backup

```bash
# Enable automated backups
gcloud sql instances patch mymood-db --backup-start-time=03:00

# Manual backup
gcloud sql backups create --instance=mymood-db

# Restore
gcloud sql backups restore BACKUP_ID --backup-instance=mymood-db --restore-instance=mymood-db
```

#### AWS RDS Backup

```bash
# Enable automated backups (via console or CLI)
aws rds modify-db-instance \
  --db-instance-identifier mymood-db \
  --backup-retention-period 7

# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier mymood-db \
  --db-snapshot-identifier mymood-snapshot-$(date +%Y%m%d)
```

---

## SSL/TLS Configuration

### Using Let's Encrypt with Docker

Add Nginx reverse proxy with Certbot:

```yaml
# Add to compose.yml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - api
      - admin

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

### GCP Cloud Run (Automatic HTTPS)

Cloud Run automatically provisions SSL certificates for custom domains:

```bash
# Map custom domain
gcloud run domain-mappings create --service mymood-admin --domain yourdomain.com --region us-central1
```

### AWS Certificate Manager

```bash
# Request certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --subject-alternative-names *.yourdomain.com

# Associate with Load Balancer
aws elbv2 add-listener-certificates \
  --listener-arn LISTENER_ARN \
  --certificates CertificateArn=CERTIFICATE_ARN
```

---

## Monitoring & Maintenance

### Health Checks

#### API Health Endpoint

Add health check route in API:

```javascript
// In your Express app
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

#### Docker Health Checks

Already configured in compose.yml for PostgreSQL. Add to other services:

```yaml
api:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

### Logging

#### Docker Logs

```bash
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f api

# View last 100 lines
docker compose logs --tail=100 api
```

#### GCP Cloud Logging

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=mymood-api" --limit 50
```

#### AWS CloudWatch

```bash
# View logs
aws logs tail /ecs/mymood-api --follow
```

### Monitoring Services

- **GCP**: Cloud Monitoring (Stackdriver)
- **AWS**: CloudWatch
- **Third-party**: Datadog, New Relic, Prometheus + Grafana

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check database is running
docker compose ps postgres

# Check connection string
docker compose exec api env | grep DATABASE_URL

# Test connection
docker compose exec postgres psql -U postgres -d mymood -c "SELECT 1"
```

#### API Not Responding

```bash
# Check API logs
docker compose logs api

# Check if port is accessible
curl http://localhost:3000/health

# Restart API service
docker compose restart api
```

#### Admin Interface Not Loading

```bash
# Check if API URL is correct
docker compose exec admin env

# Check Nginx logs
docker compose logs admin

# Rebuild admin with correct API URL
docker compose up -d --build admin
```

#### Migrations Failed

```bash
# Check database migrations table
docker compose exec postgres psql -U postgres -d mymood -c "SELECT * FROM knex_migrations"

# Rollback last migration
docker compose exec api npm run db:rollback:latest

# Re-run migrations
docker compose exec api npm run db:migrate
```

### Performance Issues

- **Scale services**: Increase replicas in compose.yml or cloud provider
- **Database optimization**: Add indexes, optimize queries
- **Caching**: Implement Redis for session/data caching
- **CDN**: Use CloudFront (AWS) or Cloud CDN (GCP) for static assets

### Getting Help

- Check logs first: `docker compose logs`
- Review environment configuration
- Consult cloud provider documentation
- Open an issue on GitHub: https://github.com/theotime2005/my-mood/issues

---

## Maintenance Checklist

### Daily
- [ ] Check service health status
- [ ] Review error logs

### Weekly
- [ ] Review performance metrics
- [ ] Check disk usage
- [ ] Review security alerts

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Database backup verification
- [ ] Security audit

### Quarterly
- [ ] Update Docker base images
- [ ] Review and optimize costs
- [ ] Capacity planning review
- [ ] Disaster recovery test

---

*Last Updated: October 2025*
*Version: 1.2*
