# meroGuru - AI-Powered Education Platform

## Overview

meroGuru is an AI-driven personalized education platform designed for students and teachers in Nepal. The platform creates a closed learning loop where students receive personalized AI tutoring, automated homework generation and checking, and teachers get data-driven lesson plans based on student performance. The system aims to solve systemic issues in modern education including lack of personalization, weak feedback loops, and inconsistent assessment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monolithic Architecture
- **Single Port**: Both frontend and backend run on port 5000
- **Server Entry**: `server/index.ts` - Express server that serves both API and Vite dev server
- **Development**: Vite middleware serves React frontend, Express handles API routes
- **Production**: Express serves built static files from `dist/` folder

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Routing**: React Router DOM with protected routes based on user roles (student/teacher)
- **UI Components**: Radix UI primitives wrapped in shadcn/ui for consistent design system
- **Source Location**: `src/` directory

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with tsx for execution
- **API Structure**: RESTful endpoints organized by domain (auth, student, subjects, teacher)
- **Authentication**: JWT-based with bcrypt password hashing, tokens stored in localStorage
- **Source Location**: `server/` directory
- **Routes**: `server/routes.ts` - Central route registration
- **Controllers**: `server/api/controllers/` - Request handlers
- **Services**: `server/api/services/` - Business logic
- **Middleware**: `server/api/middleware/` - Auth verification

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `server/db/schema.ts`
- **DB Connection**: `server/db/index.ts`
- **Migrations**: Drizzle Kit for schema generation and migrations

### Application Structure
- Dual interface: Student dashboard and Teacher dashboard with separate layouts
- Role-based routing: Students access `/` routes, teachers access `/teacher/*` routes
- Subject-based learning modules with tabs for AI Tutor, Homework, Notes, Tests, Resources
- Mock data available for development/demo purposes in `src/lib/demoMockData.ts`

### Key Design Patterns
- Service layer pattern for API calls (`src/services/*.api.ts`)
- Custom hooks for data fetching and auth (`src/hooks/`)
- Component composition with layout wrappers (`AppLayout`, `TeacherLayout`)
- Centralized API client with axios interceptors for auth headers (`src/lib/api.ts`)

## Scripts

- `npm run dev` - Start development server (monolithic, port 5000)
- `npm run build` - Build frontend for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files

## External Dependencies

### Database
- PostgreSQL database connected via `DATABASE_URL` environment variable
- Drizzle ORM handles all database operations

### AI Integration
- n8n AI Agent Workflows (external integration via webhooks)
- AI Tutor sessions managed through subject-specific endpoints

### Third-Party Services
- JWT for authentication tokens (`jsonwebtoken`, `jwt-decode`)
- Axios for HTTP requests with interceptors

### UI Libraries
- shadcn/ui components (built on Radix UI primitives)
- Lucide React for icons
- React Markdown for rendering AI responses
- date-fns for date formatting
- Embla Carousel for carousel components
- Recharts for data visualization
