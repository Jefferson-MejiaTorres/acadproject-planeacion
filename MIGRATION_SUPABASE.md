# 🚀 Migración a Supabase - Guía Paso a Paso

## Información del Proyecto Supabase
- **Nombre:** acadproject-planeacion
- **Project ID:** joqsatpszejyiucbvoiw
- **URL:** https://joqsatpszejyiucbvoiw.supabase.co

---

## ✅ PASO 1: Configurar .env.local

El archivo `.env.local` ya existe en tu proyecto con las credenciales.

**Necesitas hacer esto:**

1. Ve a https://supabase.com
2. Abre tu proyecto `acadproject-planeacion`
3. Ve a **Settings** > **Database** > **Connection Info**
4. Copia la **contraseña** de la base de datos
5. Reemplaza `[PASSWORD]` en `.env.local` con esa contraseña

**Ejemplo:**
```
DATABASE_URL=postgresql://postgres:tu_contraseña_aqui@db.joqsatpszejyiucbvoiw.supabase.co:5432/postgres
```

---

## 🔧 PASO 2: Crear las Tablas

Con **Drizzle ORM** se crean automáticamente. Usaremos:

```bash
# Crear tablas
pnpm dlx tsx lib/db/migrate.ts
```

Esto creará:
- ✅ Tablas de **Better Auth** (user, session, account, verification)
- ✅ Tablas de **AcadProject** (projects, project_members, tasks, notifications)

---

## 📦 PASO 3: Instalar Supabase Client (opcional)

Si quieres usar Realtime o Storage de Supabase:

```bash
pnpm add @supabase/supabase-js
```

---

## 🧪 PASO 4: Probar la Conexión

```bash
# Reinicia el servidor
pnpm dev
```

Abre http://localhost:3000 y intenta registrarte. Si funciona, ¡la conexión a Supabase está OK!

---

## 📊 Variables de Entorno

| Variable | Dónde Obtenerla | Uso |
|----------|-----------------|-----|
| `DATABASE_URL` | Supabase Settings > Database | Conexión PostgreSQL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Cliente Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API | Auth pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings > API | Operaciones admin |

---

## 🔍 Verificar que Funciona

1. **Revisa las tablas en Supabase:**
   - Ve a Supabase > SQL Editor
   - Ejecuta: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
   - Deberías ver 8 tablas creadas

2. **Prueba el registro:**
   - http://localhost:3000
   - Intenta registrarte con un email
   - Revisa en Supabase > users para confirmar

3. **Comprueba la autenticación:**
   - Intenta loguear con esas credenciales
   - Deberías ver el dashboard

---

## 🚨 Troubleshooting

**Error: DATABASE_URL not configured**
- Asegúrate de tener `.env.local` con `DATABASE_URL` completo

**Error: Connection refused**
- Verifica que la contraseña sea correcta
- Intenta resetearla en Supabase

**Tablas no se crean**
- Ejecuta el script de migración: `pnpm dlx tsx lib/db/migrate.ts`
- Revisa los logs en consola

---

## ✨ Siguiente Paso

Después de confirmar que funciona todo, podemos:
- ✅ Implementar Realtime para notificaciones en vivo
- ✅ Agregar Storage para archivos de proyectos
- ✅ Configurar RLS (Row Level Security) para datos seguros
