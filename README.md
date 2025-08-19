# Digital Architecture Test API

A NestJS API with hexagonal architecture for product management, featuring Contentful integration, JWT authentication, and comprehensive reporting.

## 🚀 Features

- **Hexagonal Architecture**: Clean architecture with clear separation of concerns
- **Product Management**: CRUD operations for products with Contentful sync
- **Authentication**: JWT-based authentication system
- **Automated Sync**: Hourly synchronization with Contentful API
- **Reporting System**: Comprehensive analytics and reporting
- **MongoDB Integration**: Database operations with TypeORM
- **Swagger Documentation**: Auto-generated API documentation
- **Docker Support**: Containerized application with Docker Compose
- **Test Coverage**: 30%+ test coverage with unit and e2e tests

## 🛠 Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS
- **Database**: MongoDB with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 20 or higher
- Docker & Docker Compose
- MongoDB (if running locally)

## 🔧 Installation & Setup

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd digital-arch-test
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env` if needed.

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (if running locally):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

3. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Docker Setup

1. Start with Docker Compose:
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

## 📚 API Documentation

Once running, access Swagger documentation at:
- **Local**: http://localhost:3000/api/docs
- **Docker**: http://localhost:3000/api/docs

## 🔑 Authentication

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Default credentials:
- Username: `admin`
- Password: `admin123`

### Using JWT Token
```bash
curl -X GET http://localhost:3000/api/reports/deleted-products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛣 API Endpoints

### Public Endpoints
- `GET /api/products` - Get paginated products with filters
- `GET /api/products/:id` - Get product by ID
- `POST /api/auth/login` - Login to get JWT token

### Private Endpoints (Require JWT)
- `DELETE /api/products/:id` - Soft delete product
- `POST /api/products/sync` - Manually sync from Contentful
- `GET /api/reports/deleted-products` - Deleted products report
- `GET /api/reports/price-analysis` - Price analysis report
- `GET /api/reports/date-range` - Date range report
- `GET /api/reports/custom` - Custom activity report

## 🔄 Product Synchronization

Products are automatically synced from Contentful:
- **Schedule**: Every hour (configurable via `SYNC_INTERVAL_CRON`)
- **Source**: Contentful Space ID: `SPACE_ID`
- **Manual Sync**: Available via `/api/products/sync` endpoint

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🏗 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── application/        # Auth services
│   ├── infrastructure/     # JWT strategy, guards
│   └── presentation/       # Auth controller, DTOs
├── products/               # Products module
│   ├── domain/             # Product interfaces
│   ├── application/        # Product services
│   ├── infrastructure/     # Repository, Contentful service
│   └── presentation/       # Product controller, DTOs
├── reports/                # Reports module
│   ├── application/        # Report services
│   └── presentation/       # Report controller, DTOs
├── shared/                 # Shared utilities
│   └── config/            # Database configuration
├── app.module.ts           # Root application module
└── main.ts                # Application entry point
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t digital-arch-test .

# Development with hot reload
docker-compose -f docker-compose.dev.yml up

# Production deployment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📊 Reports Available

1. **Deleted Products**: Percentage of deleted vs non-deleted products
2. **Price Analysis**: Products with/without price breakdown
3. **Date Range**: Products created within custom date range
4. **Custom Report**: Product activity analysis (last 30 days)

## 🔍 Query Examples

### Get Products with Filters
```bash
curl "http://localhost:3000/api/products?page=1&limit=5&category=electronics&minPrice=10&maxPrice=100"
```

### Date Range Report
```bash
curl "http://localhost:3000/api/reports/date-range?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment

1. **Environment Variables**: Update production environment variables
2. **Database**: Ensure MongoDB is accessible
3. **Docker**: Use `docker-compose.yml` for production
4. **CI/CD**: GitHub Actions pipeline included

## 🤝 Contributing

1. Follow conventional commits
2. Use GitFlow branching strategy
3. Ensure tests pass and coverage ≥ 30%
4. Update documentation as needed
