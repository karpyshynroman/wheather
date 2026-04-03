# Wheather Monorepo

Weather app monorepo with a React frontend, a NestJS backend, and PostgreSQL.

## Stack

- Frontend: React, TypeScript, Vite, Zustand, TanStack Query
- Backend: NestJS, TypeORM, class-validator, class-transformer
- Database: PostgreSQL
- Local runtime: Docker Compose

## Project Structure

```text
.
├── back/    # NestJS API
├── front/   # Vite React app
├── docker-compose.yml
└── README.md
```

## What the app does

- Lets a user log in or register with email and password
- Fetches weather from two providers:
  - Open-Meteo
  - WTTR
- Saves weather search history only for authenticated users
- Shows search history only for authenticated users
- Supports English, German, and Ukrainian UI translations
- Switches UI tone based on the selected weather provider

## Environment File

An example backend environment file is available at [back/example.env](back/example.env).

If you want to run the backend manually outside Docker, copy `back/example.env` to `back/.env`.

## Manual Start

Use this flow if you want to run services without Docker.

### 1. Frontend

The frontend can run on its own. Weather search works, but authentication and search history do not until the backend is running.

```bash
cd front
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:4000`.

### 2. Backend

Backend startup is optional. Run it only if you want login, registration, and search history.

Before starting the backend manually:

```bash
cp back/example.env back/.env
```

Make sure PostgreSQL is available locally on `5432`, then start the backend:

```bash
cd back
npm install
npm run start:dev
```

The backend reads `back/.env`. If you already have a local Postgres instance on `5432`, reuse it; otherwise start one separately.

## Notes

- The app currently uses direct provider requests from the frontend.
- Search history is persisted only after a successful weather fetch and only for logged-in users.
- The repo is configured as a monorepo, so root-level `.gitignore` applies to both `front/` and `back/`.
- Docker is an optional full-stack runner; manual backend startup is optional.

## Optional: Docker Start

If you want to run everything with one command in a root:

```bash
docker compose up
```

Docker maps PostgreSQL to `5433` so it does not conflict with a local Postgres on `5432`.

After startup:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- PostgreSQL: localhost:5433

If you change frontend or backend code, run `docker compose up --build` to rebuild the images.
