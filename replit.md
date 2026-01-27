# meroGuru - AI-Powered Education Platform

## Overview

meroGuru is an AI-driven personalized education platform designed for students and teachers in Nepal. The platform creates a closed learning loop where students receive personalized AI tutoring, automated homework generation and checking, and teachers get data-driven lesson plans based on student performance. The system aims to solve systemic issues in modern education including lack of personalization, weak feedback loops, and inconsistent assessment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Routing**: React Router DOM with protected routes based on user roles (student/teacher)
- **UI Components**: Radix UI primitives wrapped in shadcn/ui for consistent design system

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with tsx for execution
- **API Structure**: RESTful endpoints organized by domain (auth, student, subjects, teacher)
- **Authentication**: JWT-based with bcrypt password hashing, tokens stored in localStorage

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `src/server/db/schema.ts`
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
- Centralized API client with axios interceptors for auth headers

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