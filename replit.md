# HabitFlow - Habit Tracker Application

## Overview

HabitFlow is a full-stack habit tracking web application designed to help users build better habits through daily progress tracking, streak visualization, and goal achievement. The application provides an intuitive interface for managing habits, viewing statistics, and maintaining user profiles.

**Core Purpose**: Enable users to create, track, and analyze their daily habits with visual feedback and motivational elements.

**Key Features**:
- Habit creation and management with categories
- Daily completion tracking with visual feedback
- Statistics and analytics dashboard
- User profile management
- Drag-and-drop habit reordering
- Dark/light theme support
- Full Russian language localization

## User Preferences

Preferred communication style: Simple, everyday language.

**Localization**: Complete Russian language interface (October 2025)
- All pages, components, dialogs, and UI elements translated to Russian
- Natural, user-friendly translations throughout the application
- Mock data and examples also localized to Russian
- Landing page includes screenshots section showcasing app features

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite for fast development and optimized builds.

**Routing**: Wouter for lightweight client-side routing with the following main routes:
- `/` - Dashboard (habit cards and daily tracking)
- `/statistics` - Analytics and progress visualization
- `/profile` - User profile settings
- `/categories` - Category management

**UI Component System**: shadcn/ui design system built on Radix UI primitives with Tailwind CSS for styling. This provides:
- Consistent, accessible components
- Dark mode support with CSS variables
- Responsive, mobile-first layouts
- Pre-built form controls, dialogs, and navigation elements

**State Management**:
- React Context API for global state (categories)
- React Query (@tanstack/react-query) for server state management
- Local component state for UI interactions

**Styling Approach**:
- Tailwind CSS for utility-first styling
- Custom design tokens via CSS variables (in `client/src/index.css`)
- Dark mode as default with light mode support
- Custom fonts: Inter for UI, JetBrains Mono for statistics
- Motivational design with celebration animations (canvas-confetti)

**Key Design Decisions**:
- Mobile-first responsive design
- Utility-focused productivity patterns
- Information-dense layouts optimized for quick daily check-ins
- Visual feedback for all user actions (confetti on habit completion)

### Backend Architecture

**Runtime**: Node.js with Express.js for the API server.

**API Structure**: RESTful API with `/api` prefix for all application routes. Currently scaffolded with routing infrastructure in `server/routes.ts`.

**Storage Layer**: Abstract storage interface (`IStorage`) defined in `server/storage.ts` with:
- In-memory implementation (`MemStorage`) for development
- Designed for future database integration via the storage interface
- CRUD operations for users and habits

**Development Server**: Vite middleware integration for hot module replacement during development (`server/vite.ts`).

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL (via `@neondatabase/serverless`).

**Database Provider**: Neon serverless PostgreSQL with WebSocket support for connection pooling.

**Schema Design** (in `shared/schema.ts`):
- `users` table with fields: id (varchar UUID), email, name, profileImageUrl from Replit Auth
- `sessions` table for session-based authentication via connect-pg-simple
- Schema uses Drizzle Zod for runtime validation
- UUID primary keys generated via PostgreSQL

**Migration Strategy**: Drizzle Kit for schema management with migrations stored in `/migrations` directory.

### Authentication & Authorization

**Implementation**: Complete Replit Auth integration (October 2025)

**Authentication Provider**: Replit Auth using OpenID Connect (OIDC) standard
- Supports multiple login methods: Google, GitHub, X (Twitter), Apple, email/password
- OIDC configuration in `server/replitAuth.ts`
- Session-based authentication with PostgreSQL session storage (connect-pg-simple)

**Session Management**:
- Express session middleware with PostgreSQL-backed session store
- Sessions table stores encrypted session data
- Secure session cookies with httpOnly and secure flags
- Auto-upserts users on login via `upsertUser` storage method

**Route Protection**:
- All protected pages (Dashboard, Statistics, Profile, CategorySettings) wrapped in `ProtectedRoute` component
- ProtectedRoute provides loading state, unauthorized fallback UI, and auto-redirect to login
- Backend routes protected with `requireAuth` middleware that verifies session
- Landing page shown to unauthenticated users with login CTA

**Client-Side Auth**:
- `useAuth` hook (`client/src/hooks/useAuth.ts`) provides auth state and user data
- Fetches current user from `/api/auth/user` endpoint
- Handles loading states and authentication status across app
- Navigation component displays user profile with avatar, name, and logout option

**Authentication Flow**:
1. User clicks login → redirects to `/api/login`
2. Replit Auth OIDC flow completes → redirects to `/api/callback`
3. User data extracted from OIDC claims, upserted to database
4. Session created and user redirected to dashboard
5. Protected pages verify session and render content or redirect to login

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible components (@radix-ui/*)
- shadcn/ui component patterns
- Lucide React for icons
- Recharts for data visualization

**Drag and Drop**: @hello-pangea/dnd for reorderable habit cards

**Form Management**: 
- react-hook-form for form state
- @hookform/resolvers for validation
- Zod for schema validation

**Animation**: 
- canvas-confetti for celebration effects
- CSS transitions and Tailwind animations

**Development Tools**:
- TypeScript for type safety
- ESBuild for production builds
- Vite for development with HMR
- Replit plugins for enhanced development experience

**Database & Backend**:
- @neondatabase/serverless for PostgreSQL connectivity
- Drizzle ORM for type-safe database queries
- ws (WebSocket) library for Neon database connections

**Query Management**: TanStack React Query for server state synchronization, caching, and data fetching patterns.