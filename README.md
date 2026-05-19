# Intelligent Security Management System

Intelligent Security Management System is a full-stack safety and security management platform built for LASUSTECH final-year project delivery. It is designed to help organizations manage incidents, visitors, staff access, alerts, reports, and operational dashboards from a single system.

## What The Project Does

The platform provides a centralized workflow for security operations. It supports authentication, role-based dashboards, incident reporting, visitor check-in and check-out, notifications, analytics, and report generation. The system also includes realtime updates through Socket.IO so operational alerts can be surfaced quickly.

## Key Features

- Landing page with public project information.
- Authentication flows for register, login, forgot password, and OTP verification.
- Role-based dashboards for different user groups.
- Incident reporting with evidence uploads and status tracking.
- Visitor management for check-in and check-out.
- Notifications and broadcast alerts.
- Analytics summaries and report generation/export.
- Staff and user administration.
- Audit-friendly backend structure with Prisma and PostgreSQL.

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS.
- Backend: Express 5, TypeScript, Socket.IO.
- Database: PostgreSQL with Prisma ORM.
- Authentication and security: JWT, bcryptjs, Helmet, CORS, rate limiting.
- Validation and utilities: Zod, Multer, dotenv, Morgan.

## Repository Structure

- `apps/web` - Next.js web app with landing page, auth pages, profile page, and role dashboards.
- `apps/api` - Express API with auth, incidents, visitors, notifications, analytics, reports, staff, and user routes.
- `packages/shared` - shared constants, permissions, schemas, and reusable types.
- `prisma` - PostgreSQL schema and seed data.
- `docs` - architecture, API, deployment, installation, testing, ERD, flowchart, use cases, and user manual.

## Architecture Overview

The system is organized as a monorepo with a Next.js frontend, an Express API, PostgreSQL storage, and realtime notification support through WebSockets. The main user groups are admins, security personnel, staff, and visitors.

## Prerequisites

- Node.js 20 or later.
- npm 10 or later.
- PostgreSQL 15 or later.

## Local Setup

1. Copy the environment file and set your values.
2. Install dependencies.
3. Generate the Prisma client and apply the database schema.
4. Seed demo data if you want the sample admin account.
5. Start the web and API services.

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Available Scripts

From the repository root:

- `npm run dev:web` - start the Next.js app.
- `npm run dev:api` - start the Express API.
- `npm run dev` - run web and API together.
- `npm run build` - build all workspace packages.
- `npm run lint` - lint all workspace packages.
- `npm run test` - run the API test suite.
- `npm run db:generate` - generate the Prisma client.
- `npm run db:push` - push the Prisma schema to the database.
- `npm run db:seed` - seed demo data.

## Environment Variables

The project expects the following variables in production or local development:

- `NEXT_PUBLIC_API_URL`
- `API_PORT`
- `API_BASE_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `APP_ORIGIN`

## API Summary

The local API base URL is `http://localhost:4000/api/v1`.

Main endpoints include:

- Authentication: register, login, forgot password, verify OTP, profile, logout.
- Incidents: list, create, update status, upload evidence.
- Visitors: list, check in, check out.
- Notifications: list, broadcast, mark as read.
- Analytics and reports: summary metrics, report generation, export.
- Users and staff: management endpoints for administration.

See [docs/api.md](docs/api.md) for the full endpoint list.

## Deployment

Recommended deployment targets are:

- Frontend: Vercel or Netlify.
- API: Render or Railway.
- Database: Managed PostgreSQL on Railway, Render, Supabase, or Neon.

Production guidance:

- Use HTTPS and strong secrets.
- Restrict CORS to the deployed frontend origin.
- Use pooled or managed PostgreSQL connections.
- Store uploads in a trusted object storage service.
- Treat cPanel as a fallback only when a Node process manager is available.

See [docs/deployment.md](docs/deployment.md) for deployment notes.

## Demo Account

- Admin login: `admin@isms.local`
- Password: `Admin@1234`

## Documentation

- [Installation guide](docs/installation.md)
- [Architecture overview](docs/architecture.md)
- [API documentation](docs/api.md)
- [Deployment guide](docs/deployment.md)
- [Testing guide](docs/testing.md)
- [ERD](docs/erd.md)
- [Flowchart](docs/flowchart.md)
- [Use cases](docs/use-cases.md)
- [User manual](docs/user-manual.md)

## Current Status

The web application shell, landing page, authentication entry points, and dashboard routing are in place. The backend API, Prisma schema, and documentation scaffolding are also present and ready for continued development.
