# Wysa Sleep Onboarding API

A backend service for Wysa's sleep onboarding flow with user authentication, progress tracking, and analytics.

## Features

- User signup/login with JWT authentication
- 4-step sleep onboarding flow
- Real-time progress tracking
- Drop-off analytics and user insights
- MongoDB with Prisma ORM
- API documentation with Swagger

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

The API will be running at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/user/details` - Get user progress

### Onboarding Flow
- `POST /api/onboarding/screen1` - Sleep struggle duration
- `POST /api/onboarding/screen2` - Bedtime
- `POST /api/onboarding/screen3` - Wake up time  
- `POST /api/onboarding/screen4` - Sleep hours
- `POST /api/onboarding/complete` - Desired changes

### Analytics
- `GET /api/stats/analytics` - User analytics and drop-offs

## Environment Variables

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```

## Documentation

Visit `/docs` for interactive API documentation when the server is running.

## Deployment

### AWS EC2
```bash
# Upload code to EC2 instance
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### Docker
```bash
docker build -t wysa-backend .
docker run -p 3000:3000 --env-file .env wysa-backend
```

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Prisma
- JWT Authentication
- Swagger Documentation
- Winston Logging

## License

ISC 