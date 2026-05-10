# Deployment Guide

## Recommended Targets

- Frontend: Vercel or Netlify
- API: Render or Railway
- Database: Managed PostgreSQL on Railway, Render, Supabase, or Neon

## Environment Variables

- `NEXT_PUBLIC_API_URL`
- `API_PORT`
- `API_BASE_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `APP_ORIGIN`

## Production Notes

- Enable HTTPS and strong secrets in production.
- Keep uploads validated and store files in a trusted object store.
- Configure CORS to only allow the deployed frontend origin.
- Use pooled or managed PostgreSQL connections for hosted environments.
- For cPanel hosting, use it as a fallback only when a Node process manager is available.
