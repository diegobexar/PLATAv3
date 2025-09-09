# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PLATAv3 is an AI-powered personal finance application designed for mobile-first expense tracking, intelligent budget management, and automated savings recommendations.

## Development Commands

```bash
# Development
npm run dev                    # Start both client and server in development
npm run client:dev            # Start React client only
npm run server:dev            # Start Node.js server only

# Building & Testing
npm run build                 # Build client for production
npm run test                  # Run all tests
npm run lint                  # Run ESLint across codebase
npm run typecheck             # Run TypeScript checks for client and server

# Database
npm run db:migrate            # Run Prisma migrations
npm run db:seed               # Seed database with test data
npm run db:studio             # Open Prisma Studio
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript, Progressive Web App (PWA)
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite + Prisma ORM
- **AI Integration**: OpenAI API for spending analysis
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Charts**: Chart.js for financial visualizations

### Project Structure
```
/client                    # React PWA frontend
  /src
    /components           # Reusable UI components
    /pages               # Main application pages
    /hooks               # Custom React hooks
    /services            # API calls and external services
    /types               # TypeScript type definitions
    /utils               # Helper functions and utilities
/server                   # Node.js API backend
  /src
    /routes              # Express API routes
    /services            # Business logic and AI integration
    /models              # Database models and schemas
    /middleware          # Express middleware
/shared                  # Shared types and utilities
```

### Core Data Models
- **Transaction**: Individual expense/income entries with AI categorization
- **Budget**: Monthly spending limits by category with real-time tracking
- **Goal**: Savings targets with progress tracking
- **User**: Profile and preferences for personalized AI recommendations

## Key Features & Implementation Notes

### Mobile-First Design
- PWA with offline capability and service worker caching
- Touch-optimized UI with large tap targets (44px minimum)
- Camera API integration for receipt scanning and OCR
- Geolocation for automatic merchant detection
- Push notifications for budget alerts

### AI-Powered Insights
- OpenAI API integration for spending pattern analysis
- Automated transaction categorization from descriptions
- Predictive budget recommendations based on historical data
- Natural language query processing for financial questions

### Budget Management
- Category-based monthly budgets with rollover options
- Real-time spending tracking with visual progress indicators
- Configurable alert thresholds (75%, 90%, 100% of budget)
- Budget vs. actual variance reporting

### Data Privacy & Security
- Local-first SQLite database for sensitive financial data
- Encrypted data transmission to AI services
- No persistent storage of raw financial data in external APIs
- User consent required for all AI analysis features

## Development Guidelines

### Component Architecture
- Use functional components with React hooks
- Implement custom hooks for complex state logic
- Follow compound component patterns for reusable UI elements
- Prioritize accessibility with ARIA labels and semantic HTML

### State Management
- React Context for global app state (user, theme, settings)
- Local component state for UI interactions
- React Query for server state management and caching
- Optimistic updates for immediate UI feedback

### Mobile Development Patterns
- Touch gesture handling with react-spring animations
- Infinite scroll for transaction lists with virtualization
- Offline-first data sync with conflict resolution
- Progressive image loading for receipt photos

### AI Integration Best Practices
- Batch AI requests to minimize API costs
- Implement retry logic with exponential backoff
- Cache AI responses for repeated queries
- Provide fallback categorization when AI is unavailable

### Testing Strategy
- Unit tests for utility functions and business logic
- Integration tests for API endpoints
- Component tests with React Testing Library
- E2E tests for critical user flows (expense entry, budget creation)
- Visual regression tests for mobile responsiveness

### Performance Optimization
- Code splitting by route and feature
- Lazy loading for non-critical components
- Image optimization and WebP format support
- Database indexing for transaction queries
- Memoization for expensive calculations

## Environment Setup

### Required Environment Variables
```bash
# Copy server/.env.example to server/.env and fill in your values:
# Server
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-key"  # Get from https://platform.openai.com/api-keys
JWT_SECRET="your-jwt-secret"      # Generate with: openssl rand -base64 32

# Client
REACT_APP_API_URL="http://localhost:3001"
```

### Development Dependencies
- Node.js 18+
- npm 9+
- SQLite 3
- OpenAI API access

## Security Guidelines

### Environment Variables & Secrets
- **NEVER commit `.env` files to version control**
- Always use `.env.example` as a template for required environment variables
- Rotate JWT secrets regularly in production environments
- Use strong, randomly generated secrets (minimum 32 characters)
- Monitor OpenAI API usage and set billing limits
- Use environment-specific secrets for different deployment stages

### Database Security
- SQLite files are excluded from version control
- Regular database backups should be encrypted
- Use read-only database connections where applicable
- Implement proper database access controls in production

### API Security
- All authentication endpoints use bcrypt for password hashing
- JWT tokens have expiration times (7 days default)
- CORS is configured for development - update for production domains
- Input validation using Zod schemas on all endpoints
- Rate limiting should be implemented in production