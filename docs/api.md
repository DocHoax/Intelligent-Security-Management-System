# API Documentation

## Base URL

- Local development: `http://localhost:4000/api/v1`

## Authentication

- `POST /auth/register` - create a new account with role selection.
- `POST /auth/login` - sign in and receive tokens.
- `POST /auth/forgot-password` - request OTP reset flow.
- `POST /auth/verify-otp` - verify an OTP and continue reset.
- `GET /auth/me` - return the current authenticated user.
- `POST /auth/logout` - end the current session.

## Incidents

- `GET /incidents` - list incidents with search and filter support.
- `POST /incidents` - create a new incident report.
- `PATCH /incidents/:incidentId/status` - update incident status.

## Visitors

- `GET /visitors` - list visitors.
- `POST /visitors/check-in` - check a visitor in.
- `POST /visitors/check-out` - check a visitor out.

## Notifications

- `GET /notifications` - list notifications.
- `POST /notifications/broadcast` - queue a broadcast alert.
- `PATCH /notifications/:notificationId/read` - mark a notification as read.

## Analytics and Reports

- `GET /analytics/summary` - retrieve overview metrics.
- `GET /reports/summary` - list saved reports.
- `POST /reports/generate` - generate a report.
- `GET /reports/export/:format` - export as PDF or Excel.

## Staff

- `GET /staff` - list security staff.
- `POST /staff` - add a staff member.
- `PATCH /staff/:staffId/shift` - update a duty shift.
