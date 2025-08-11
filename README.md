# NEST-BACKEND — Setup & Assignment Guide

This README was generated for the uploaded archive **`NEST-BACKEND.zip`**.  
It documents local setup, database, Docker, and the end‑to‑end flow of auth → documents → ingestion.

---

## 1) Tech Stack
- **Runtime:** Node.js 20
- **Framework:** NestJS (DDD/Clean Architecture style)
- **DB:** PostgreSQL via Prisma
- **Auth:** JWT (roles: `admin`, `editor`, `viewer`)
- **Logging/Security:** pino, helmet
- **API Versioning:** `/v1`

---

## 2) Quick Start (TL;DR)
```bash
# Clone and enter
git clone <YOUR_REPO_URL> nest-backend
cd nest-backend

# Setup env
cp .env.example .env   # create and fill values (see below)

# Install & generate Prisma
npm ci
npm run prisma:generate

# Create schema
npm run prisma:migrate

# Run dev
npm run start:dev      # API on http://localhost:3000/v1
```

---

## 3) Clone & Install
If this project is already on Git:
```bash
git clone <YOUR_REPO_URL> nest-backend
cd nest-backend
npm ci
```

> If you don’t have a repo yet, initialize one:
```bash
mkdir nest-backend && cd nest-backend
# copy the contents of NEST-BACKEND/ here, then:
git init
git add .
git commit -m "init"
```

---

## 4) Environment Variables
Create a file named `.env` in the project root. Example:
```ini
NODE_ENV=development
PORT=3000
JWT_SECRET=replace-with-long-random-string

# Prisma DATABASE_URL is used at build time (prisma generate) and can be left pointing to your local DB:
DATABASE_URL=postgresql://postgres:admin@localhost:5432/postgres?schema=public

# Runtime DB settings (PrismaService builds the URL from these)
DB_HOST=localhost              # use host.docker.internal if API runs in Docker and DB is on host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=postgres
DB_SCHEMA=public
DB_SSL=false
```

**Important:** When running the API in Docker but PostgreSQL on your host, set `DB_HOST=host.docker.internal` (Windows/macOS; works on Linux with the `extra_hosts` already present in docker-compose).

---

## 5) Database Setup (PostgreSQL + Prisma)
Ensure PostgreSQL is running and credentials match your `.env`.

```bash
# Generate Prisma client (uses DATABASE_URL)
npm run prisma:generate

# Create DB schema and apply migrations
npm run prisma:migrate

# Optional: open Prisma Studio
npm run db:studio
```

The Prisma schema is in `prisma/schema.prisma`. Migrations live under `prisma/migrations/`.

---

## 6) Run Locally (without Docker)
```bash
npm run start:dev
# API: http://localhost:3000/v1
```

Default scripts available:
```bash
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "lint": "eslint .",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev --name init",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "start:debug": "nest start --debug --watch"
}
```

---

## 7) Docker
There is a multi‑stage Dockerfile and a compose file:

- **Dockerfile:** `docker/Dockerfile.api`
- **Compose:** `docker/docker-compose.yml`

### 7.1 Build & Run
```bash
# from the docker/ folder
cd docker
docker compose up --build
# API exposed on http://localhost:3000/v1
```

Compose loads `../.env`. Ensure it contains valid DB settings.  
**Note:** The compose file includes only the API container. Run PostgreSQL separately (local install or your own DB container).

If you prefer adding Postgres via compose, you can extend `docker-compose.yml` like this:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build:
      context: ..
      dockerfile: ./docker/Dockerfile.api
    env_file:
      - ../.env
    depends_on:
      - db
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

Then update `.env` for container networking (for example `DB_HOST=db`).

### 7.2 Prisma in Docker
During the image build, Prisma Client is generated with a `DATABASE_URL` ARG. At runtime, the app uses the credential‑based envs (`DB_HOST`, `DB_PORT`, etc.) to compute the connection string.

---

## 8) API Surface & Flow

Base URL: `http://localhost:3000/v1`

### 8.1 Auth Flow
1. **Register** → `POST /v1/auth/register` — body `{ name, email, password }`  
2. **Login** → `POST /v1/auth/login` — body `{ email, password }`  
   - Response includes `access_token`. Use as `Authorization: Bearer <token>`.
3. **(Admin) Assign Role** → `POST /v1/users/assign-role` — body `{ userId, role }`  
   - Roles: `admin`, `editor`, `viewer`

> Debugging JWT: The strategy prints token/payload to console when requests arrive (see `JwtStrategy`).

### 8.2 Documents Flow (JWT required)
- **Create** → `POST /v1/documents` — body `{ title, description?, url? }`  
- **List mine** → `GET /v1/documents`  
- **Update** → `PATCH /v1/documents/:id`  
- **Delete** → `DELETE /v1/documents/:id`

### 8.3 Ingestion Flow (JWT + Roles)
- **Trigger** → `POST /v1/ingestion/trigger` (roles: `editor` or `admin`)  
  - body: `{ documentId, metadata? }`
- **Get one** → `GET /v1/ingestion/:id`  
- **List all** → `GET /v1/ingestion` (role: `admin`)  
- **Update status** → `PATCH /v1/ingestion/:id/status` (role: `admin`)  
  - body: `{ status?, progress?, metadata? }` with status in `queued|running|completed|failed`

**Typical End‑to‑End**  
```
Register → Login → (Admin assigns roles) → Create Document → Trigger Ingestion →
Update Ingestion Status (from a worker or admin) → Get/List Ingestion to see progress
```

---

## 9) Postman Collection
A ready-to-use collection is included: `postman_collection.json`.

**How to use:**
1. Import the file into Postman.
2. Set collection variables:  
   - `baseUrl = http://localhost:3000`
   - `token = <your JWT here>`
3. Run these in order:
   1. **Register**
   2. **Login** (copy `access_token` to `token` variable)
   3. **List Users (admin)** / **Assign Role (admin)**
   4. **Create Document** / **My Documents**
   5. **Trigger Ingestion** / **Get Ingestion** / **List Ingestions (admin)** / **Update Ingestion Status (admin)**

Included endpoints in the collection:
```
[
  "Register",
  "Login",
  "List Users (admin)",
  "Assign Role (admin)",
  "Create Document",
  "My Documents",
  "Update Document",
  "Delete Document",
  "Trigger Ingestion",
  "Get Ingestion",
  "List Ingestions (admin)",
  "Update Ingestion Status (admin)"
]
```

---

## 10) Validation Notes & Tips
- DTO validators use `class-validator`. If sending data as `form-data` where booleans/numbers come as strings,
  consider using `@IsBooleanString()` / `@IsNumberString()` or enable transformation (e.g., `ValidationPipe({ transform: true })`).
- For JWT‑protected routes, ensure `Authorization: Bearer <token>` header is set.
- Roles guard checks `req.user.roles`; assign roles via the admin endpoint.

---

## 11) Project Structure (high level)
```
src/
  application/      # use-cases & application services
  domain/           # entities & repository interfaces
  infrastructure/   # prisma + repositories + config
  presentation/     # http controllers, guards, dtos, strategies
prisma/
  schema.prisma
  migrations/
docker/
  Dockerfile.api
  docker-compose.yml
```

---

## 12) Common Commands
```bash
# Dev server
npm run start:dev

# Lint, test
npm run lint
npm test

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run db:studio
```

---

## 13) Troubleshooting
- **JWT errors (`jwt malformed`/`expired`)**: confirm `Authorization` header; check `.env.JWT_SECRET` matches the one used to sign tokens.
- **Cannot connect to DB**: verify `.env` matches your Postgres, and when running in Docker use `DB_HOST=host.docker.internal` (or `db` if using a Postgres service).
- **Prisma client issues in Docker**: rebuild with `docker compose build --no-cache` so Prisma Client regenerates inside the image.
- **CORS**: not enabled by default. Add `app.enableCors()` in `main.ts` if calling from a browser.

---

## 14) Assignment Checklist
- [x] Register/Login with JWT
- [x] Role-based access (admin/editor/viewer)
- [x] Documents CRUD (per user)
- [x] Ingestion trigger + status/progress tracking
- [x] Postman collection for all flows
- [x] Dockerfile + compose for the API

Happy shipping! 🚀
