# System Architecture

## Overview

The platform is organized as a monorepo with a Next.js frontend, an Express API, a PostgreSQL database, and realtime notification support through WebSockets.

```mermaid
flowchart TD
  U[Users: Admin, Security Personnel, Staff, Visitor] --> W[Next.js Web App]
  W --> A[Express API]
  A --> P[(PostgreSQL)]
  A --> N[Email / OTP Service]
  A --> S[SMS Gateway Simulation]
  A --> R[Socket.IO Realtime Server]
  R --> W
  W --> D[Role Dashboards]
  W --> L[Landing Page and Auth]
```

## Core Layers

- Presentation layer: landing page, authentication pages, and dashboards.
- API layer: auth, incidents, visitor access, notifications, analytics, reports, and staff management.
- Data layer: PostgreSQL schema with users, roles, incidents, visitors, alerts, messages, reports, CCTV logs, and audit logs.
- Realtime layer: Socket.IO events for alerts, notifications, and operational updates.
