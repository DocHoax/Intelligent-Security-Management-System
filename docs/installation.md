# Installation Guide

## Prerequisites

- Node.js 20 or later
- PostgreSQL 15 or later
- npm 10 or later

## Setup

1. Copy `.env.example` to `.env` and fill in the database and auth secrets.
2. Install dependencies for the workspace.
3. Generate the Prisma client and push the schema to PostgreSQL.
4. Start the web and API services.

## Suggested Commands

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

## Notes

- The landing page and auth screens are ready for UI review even before the database is populated.
- The API currently returns realistic scaffold responses so the project can be demonstrated early in development.
