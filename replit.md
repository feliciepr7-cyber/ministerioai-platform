# Overview

This is a GPT subscription service platform built with a modern full-stack architecture. The application provides tiered subscription plans (Basic, Pro, Enterprise) that give users access to different GPT models with varying query limits. Users can register, authenticate, subscribe to plans via Stripe payments, and access GPT models through a dashboard interface.

**Latest Update**: Implemented an AI-powered support chatbot system that replaces traditional ticket-based support. The chatbot uses OpenAI's GPT-4o model to provide instant, intelligent responses to user queries about GPT access issues, with automatic severity and category analysis for better support triage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing with protected routes
- **State Management**: TanStack React Query for server state and React Context for authentication
- **Forms**: React Hook Form with Zod validation
- **Payment Integration**: Stripe React components for payment processing

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy using session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Password Security**: Node.js crypto module with scrypt for hashing
- **API Design**: RESTful endpoints with structured error handling
- **AI Support**: OpenAI GPT-4o integration for intelligent chatbot support system

## Database Architecture
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Schema**: Normalized tables for users, subscriptions, payments, GPT models, and access tracking
- **Migrations**: Drizzle Kit for schema migrations and database management

## Authentication & Authorization
- **Strategy**: Session-based authentication with secure cookie storage
- **Password Security**: Scrypt-based password hashing with salt
- **Session Management**: PostgreSQL session store with configurable expiration
- **Route Protection**: Client-side protected routes with server-side validation

## Payment Processing
- **Provider**: Stripe for subscription management and payment processing
- **Architecture**: Webhook-based event handling for subscription lifecycle
- **Plans**: Three-tier pricing model (Basic $9, Pro $29, Enterprise $99)
- **Features**: Recurring billing, plan upgrades, and usage tracking

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection via Neon
- **drizzle-orm**: TypeScript ORM for database operations
- **express**: Web application framework
- **passport**: Authentication middleware
- **stripe**: Payment processing SDK
- **openai**: AI integration for intelligent support chatbot

## Frontend Dependencies
- **@radix-ui/***: Headless UI component primitives
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers

## Development Tools
- **vite**: Frontend build tool and dev server
- **typescript**: Type system
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migration tool
- **tsx**: TypeScript execution for development

## Security & Utilities
- **bcrypt**: Alternative password hashing (imported but scrypt is used)
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store
- **zod**: Runtime type validation
- **clsx**: Utility for conditional CSS classes