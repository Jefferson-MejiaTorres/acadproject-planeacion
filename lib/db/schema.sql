-- ===========================
-- ACADPROJECT - SCHEMA SQL
-- ===========================
-- Ejecuta este script en: Supabase Dashboard > SQL Editor
-- Copy & Paste todo, y ejecuta

-- ===========================
-- BETTER AUTH TABLES
-- ===========================

-- Tabla: user
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  image TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: session
CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabla: account
CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  scope TEXT,
  password TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: verification
CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- ACADPROJECT TABLES
-- ===========================

-- Tabla: projects
CREATE TABLE IF NOT EXISTS "projects" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'activo',
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: project_members
CREATE TABLE IF NOT EXISTS "project_members" (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  role TEXT DEFAULT 'colaborador',
  "joinedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("projectId", "userId")
);

-- Tabla: tasks
CREATE TABLE IF NOT EXISTS "tasks" (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pendiente',
  "assignedTo" TEXT,
  "dueDate" DATE,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: notifications
CREATE TABLE IF NOT EXISTS "notifications" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- ÍNDICES (para mejor performance)
-- ===========================

CREATE INDEX IF NOT EXISTS idx_session_userId ON "session"("userId");
CREATE INDEX IF NOT EXISTS idx_account_userId ON "account"("userId");
CREATE INDEX IF NOT EXISTS idx_project_members_projectId ON "project_members"("projectId");
CREATE INDEX IF NOT EXISTS idx_project_members_userId ON "project_members"("userId");
CREATE INDEX IF NOT EXISTS idx_tasks_projectId ON "tasks"("projectId");
CREATE INDEX IF NOT EXISTS idx_tasks_assignedTo ON "tasks"("assignedTo");
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON "notifications"("userId");

-- ===========================
-- FIN DEL SCHEMA
-- ===========================
-- ✅ Todas las tablas creadas
-- ✅ Índices para mejor performance
-- ✅ Relaciones con ON DELETE CASCADE
