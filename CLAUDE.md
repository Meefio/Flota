# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlotaApp — a fleet management application for managing vehicles, drivers, maintenance deadlines, and documents. Built with Next.js 16 App Router, TypeScript, and PostgreSQL. The UI is entirely in Polish.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (also catches type errors)
npm run lint         # ESLint
npm run db:push      # Push Drizzle schema changes to database
npm run db:studio    # Visual database explorer
npm run db:seed      # Seed database (npx tsx src/db/seed.ts)
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React 19)
- **Database**: PostgreSQL via Neon Serverless + Drizzle ORM
- **Auth**: NextAuth 5 beta (JWT strategy, Credentials provider, bcryptjs)
- **UI**: Tailwind CSS 4, shadcn/ui (New York style), Lucide icons
- **Forms**: React Hook Form + Zod 4 validation
- **Calendar**: FullCalendar 6
- **File storage**: Vercel Blob
- **Notifications**: Sonner (toasts)

## Architecture

### Routing & Auth

Two route groups under `src/app/`:
- `(auth)/login` — public login page
- `(dashboard)/admin/*` — admin-only routes (vehicles, drivers, services, calendar, logs)
- `(dashboard)/kierowca/*` — driver-only routes (assigned vehicles, personal documents)

Middleware (`src/middleware.ts`) protects routes and redirects based on role. Root `/` redirects to `/admin` or `/kierowca`.

### Data Layer

- **Schema**: `src/db/schema.ts` — all tables defined with Drizzle ORM
- **Queries**: `src/lib/queries/*.ts` — server-side read functions (direct DB access)
- **Actions**: `src/lib/actions/*.ts` — server actions (`"use server"`) for mutations with Zod validation, role checks, `revalidatePath()`, and audit logging
- **Auth helpers**: `src/lib/auth-utils.ts` — `requireAuth()`, `requireAdmin()`, `requireDriver()`, `requireDriverOwnership()`

### Component Patterns

- Pages/layouts are **server components** that fetch data and check auth
- Interactive elements (forms, dialogs) are **client components** (`"use client"`)
- Forms use `useActionState()` hook with server actions
- UI components live in `src/components/ui/` (shadcn/ui), domain components in `src/components/{domain}/`
- Utility: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)

### Key Conventions

- **Imports**: Use `@/` path alias (maps to `src/`)
- **Language**: All UI text, labels, route names are in Polish; constants in `src/lib/constants.ts`
- **Audit logging**: Every mutation calls `logAudit()` from `src/lib/audit.ts`
- **Validation schemas**: Defined in `src/lib/validators.ts`
- **Soft deletes**: Vehicles use active/inactive status, not hard deletes
- **Deadline utilities**: `src/lib/deadline-utils.ts` for expiration logic

### Database Tables

Core entities: `users` (admin/driver roles), `vehicles`, `vehicle_deadlines`, `deadline_operations`, `vehicle_services`, `vehicle_notes`, `vehicle_assignments`, `driver_documents`, `file_attachments`, `audit_logs`. Schema uses cascade deletes on vehicle removal.
