# Solución: Error Vacío en Sign Up `{}`

## 🔴 Problema
Ves este error en la consola: `Sign up error: {}`

Esto significa que Better Auth está recibiendo un error del servidor pero sin mensajes de detalles.

---

## ✅ Solución (Paso a Paso)

### **PASO 1: Verifica la conexión a Supabase**

1. Abre en tu navegador: `http://localhost:3000/api/health`
2. Deberías ver algo como:
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "time": "2026-05-29T10:30:00.000Z"
  },
  "tables": ["user", "session", "account", "verification", "projects", ...],
  "userTableExists": true,
  "userTableError": null
}
```

**Si ves error o `connected: false`:**
- Verifica que `DATABASE_URL` en `.env.local` sea correcta
- Revisa que Supabase esté corriendo
- Prueba la conexión manualmente (ver sección Debugging)

---

### **PASO 2: Crea las tablas en Supabase**

Si en `/api/health` ves `"tables": []` (vacío), debes crear las tablas:

1. Ve a: **Supabase Dashboard > SQL Editor**
2. Haz clic en **"New Query"**
3. Copia TODO el contenido de este archivo:
   - [lib/db/schema.sql](../lib/db/schema.sql)
4. Pégalo en el SQL Editor
5. Haz clic en **"RUN"** (esquina superior derecha)

**Espera a que termine (puede tomar unos segundos)**

6. Ahora abre `/api/health` nuevamente
7. Deberías ver todas las tablas listadas

---

### **PASO 3: Limpia el caché del navegador**

1. Abre DevTools: **F12**
2. Vete a: **Application > Cookies**
3. Elimina todas las cookies de `localhost:3000`
4. Recarga la página: **F5**

---

### **PASO 4: Intenta registrar nuevamente**

1. Ve a: `http://localhost:3000/registro`
2. Abre DevTools: **F12 > Console**
3. Completa el formulario:
   - Email: `test@example.com`
   - Contraseña: `Password123!`
   - Nombre: `Test User`
4. Haz clic en **"Crear Cuenta"**

**Ahora deberías ver en la consola:**
- ✅ `📝 Intentando registrar usuario: { email: '...', name: '...' }`
- ✅ `🏥 Health check: { status: 'ok', ... }`
- ✅ `📥 Respuesta del servidor: { data: { user: {...} }, ... }`
- ✅ `✅ Usuario registrado: { ... }`
- ✅ `🚀 Redirigiendo a /dashboard...`

---

## 🔧 Debugging Avanzado

### Si aún ves error vacío `{}`

Abre la **Network tab** en DevTools:

1. **F12 > Network**
2. Intenta registrarte
3. Busca la request a `/api/auth/sign-up`
4. Haz clic en ella
5. Ve a **Response** y copia TODO el contenido
6. Comparte ese contenido conmigo

### Verifica manualmente la conexión a PostgreSQL

En tu terminal, ejecuta:

```bash
# Si tienes psql instalado:
psql "postgresql://postgres:Acadproject233@db.joqsatpszejyiucbvoiw.supabase.co:5432/postgres"

# Luego ejecuta:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deberías ver las tablas: `user`, `session`, `account`, etc.

---

## ⚡ Checklist Final

- [ ] Verificaste `/api/health` y dice `connected: true`
- [ ] Ejecutaste el SQL en Supabase y viste las tablas creadas
- [ ] Limpiaste las cookies del navegador
- [ ] Cerraste y reabriste DevTools
- [ ] Intentaste registrarte de nuevo
- [ ] Ves logs detallados en la consola (sin error vacío `{}`)

Si completaste todo esto y aún ves el error, **abre DevTools > Network > /api/auth/sign-up > Response** y comparte el contenido exacto.

---

## 📞 Mensajes de Error Comunes

| Error | Solución |
|-------|----------|
| `database connection failed` | Verifica DATABASE_URL en .env.local |
| `relation "user" does not exist` | Ejecuta el SQL en Supabase |
| `permission denied` | Asegúrate de tener acceso a la BD |
| `timeout` | La BD está muy lenta, intenta de nuevo |

