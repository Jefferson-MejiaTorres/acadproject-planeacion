# Guía de Setup - AcadProject

## ✅ Checklist de Configuración

### 1. Variables de Entorno
Verifica que `.env.local` tenga:
```
DATABASE_URL=postgresql://...@...supabase.co:5432/postgres
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=acadproject_secret_key_2024_min_32_characters_long!
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 2. Base de Datos en Supabase
✅ Entra a [Supabase Dashboard](https://supabase.com/dashboard)
✅ Copia la URL PostgreSQL desde: Settings > Database > Connection Info
✅ Copia tu contraseña (si tiene # reemplázalo con %23)
✅ Ejecuta el SQL en: SQL Editor > Copiar todo el contenido de `lib/db/schema.sql` y ejecutar

### 3. Instalar Dependencias
```bash
pnpm install
```

### 4. Iniciar el Servidor
```bash
pnpm dev
```

Verifica que veas:
```
✓ Ready in XXXX ms
```

## 🧪 Probar la Autenticación

### Primero: Verifica que las tablas existan

1. Abre: `http://localhost:3000/api/health`
2. Deberías ver `"status": "ok"` y `"userTableExists": true`
3. Si dice `false`, sigue estos pasos:
   - Ve a **Supabase Dashboard > SQL Editor > New Query**
   - Copia TODO el contenido de [lib/db/schema.sql](lib/db/schema.sql)
   - Pégalo en el editor y haz clic en **RUN**
   - Espera a que termine
   - Recarga `/api/health` y verifica que ahora diga `true`

### En el Navegador (DevTools abierto)
1. Ve a `http://localhost:3000/registro`
2. Abre **F12 > Console** ANTES de registrarte
3. Crea una cuenta con:
   - Email: `test@example.com`
   - Password: `Password123!`
   - Nombre: `Test User`
4. En Console deberías ver:
   - ✅ `🏥 Health check: { status: 'ok', ... }`
   - ✅ `📝 Intentando registrar usuario: ...`
   - ✅ `📥 Respuesta del servidor: { data: { ... } }`
   - ✅ `✅ Usuario registrado: ...`
5. Si ves error vacío `{}`, lee [DEBUGGING.md](DEBUGGING.md)

## 🔍 Debugging

### Si los usuarios no se guardan:
```bash
# 1. Verifica la conexión a Supabase
# En el terminal de Node.js, intenta:
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? 'ERRO: ' + err.message : 'CONECTADO: ' + res.rows[0].now);
  process.exit();
});
"

# 2. Verifica que las tablas existan
# En Supabase Dashboard > SQL Editor:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# 3. Revisa los logs de Better Auth
# Busca en la consola del navegador (F12) cualquier error
```

### Si el dashboard no carga después de login:
1. Abre **DevTools (F12)** > **Console**
2. Busca errores rojos
3. Verifica que `/api/auth/session` responda con datos del usuario
4. Si no hay sesión, el login no guardó correctamente

## ⚡ Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Verificar errores de TypeScript
npx tsc --noEmit

# Ver logs de pnpm
pnpm dev --verbose
```

## 📝 Notas Importantes

- El `BETTER_AUTH_SECRET` debe ser único y seguro (mínimo 32 caracteres)
- En desarrollo, las cookies usan `secure: false`
- En producción, necesitarás SSL/HTTPS para las cookies seguras
- Los archivos `.env.local` no se deben subir a Git (ya está en .gitignore)

## 🆘 Problemas Comunes

**"Database connection failed"**
- Verifica DATABASE_URL está correcto
- Comprueba que Supabase esté disponible
- Prueba la conexión manualmente (ver sección Debugging)

**"Session not found after login"**
- Verifica BETTER_AUTH_SECRET está en .env.local
- Revisa que las tablas de Better Auth existan en Supabase
- Abre DevTools > Network y verifica respuestas de API

**"Redirect loop or blank page"**
- Limpia cookies del navegador (DevTools > Application > Cookies)
- Reinicia el servidor con `Ctrl+C` y `pnpm dev`
- Verifica que auth-client.ts tenga el baseURL correcto

## 📞 Próximos Pasos

Una vez que la autenticación funcione:
1. Prueba crear un proyecto
2. Prueba invitar miembros
3. Prueba crear tareas y usar el Kanban
4. Revisa las notificaciones
