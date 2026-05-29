# 🎭 Modo Mock - AcadProject

## ¿Qué es el Modo Mock?

El modo mock permite ver toda la aplicación funcionando **SIN conectar a la base de datos**. Usa datos de prueba para simular:

✅ Login/Registro de usuarios
✅ Dashboard con proyectos y tareas
✅ Kanban de tareas
✅ Notificaciones
✅ Perfil de usuario
✅ Miembros del proyecto

## Activarlo/Desactivarlo

### 🟢 ACTIVADO (Ahora mismo)
En `.env.local`:
```env
NEXT_PUBLIC_MOCK_AUTH=true
```

### 🔴 DESACTIVADO (Para conectar a BD real)
En `.env.local`:
```env
NEXT_PUBLIC_MOCK_AUTH=false
```

Después de cambiar, **reinicia el servidor**: Ctrl+C → `pnpm dev`

---

## 📝 Cómo Usar

### 1️⃣ **Ir a Registro o Login**
```
http://localhost:3000/registro
http://localhost:3000/login
```

### 2️⃣ **Cualquier email/contraseña funciona**
En modo mock, puedes usar:
- Email: `cualquier@email.com`
- Contraseña: `cualquier123`
- Nombre: `Tu Nombre` (solo en registro)

### 3️⃣ **Verás el Dashboard**
Automáticamente accederás a:
- ✅ Dashboard con estadísticas
- ✅ Proyectos (3 de ejemplo)
- ✅ Tareas en Kanban
- ✅ Notificaciones
- ✅ Perfil

### 4️⃣ **Ver datos de prueba**
En el navegador puedes inspeccionar:
- **DevTools > Application > Local Storage**: Guarda `mock_session` y `mock_user`
- Todas las páginas muestran: `🎭 Modo de prueba`

---

## 🚀 Características del Mock

### Mock User
```javascript
{
  id: "user_1",
  name: "Jefferson Mejia",
  email: "jefferson@example.com",
  emailVerified: true,
}
```

### Mock Projects (3)
- Desarrollo Web Full Stack
- Mobile App Flutter
- Machine Learning Predictivo

### Mock Tasks (5)
- 1 completada
- 2 en progreso
- 2 pendientes

### Mock Members (4)
- Jefferson Mejia (líder)
- Carlos García (colaborador)
- María López (colaborador)
- Juan Rodriguez (revisor)

### Mock Notifications (3)
- Notificaciones de tareas
- Actualizaciones de proyectos
- Nuevos miembros

---

## 🔄 Cambiar a Modo Real (BD)

Una vez que la BD funcione:

1. Abre `.env.local`
2. Cambia:
   ```env
   NEXT_PUBLIC_MOCK_AUTH=false
   ```
3. Reinicia el servidor: `Ctrl+C` → `pnpm dev`
4. Intenta registrarte de verdad
5. Los datos se guardarán en Supabase

---

## 🐛 Debugging

### Si algo no funciona en modo mock:
```bash
# Abre DevTools (F12)
# Ve a: Console
# Busca logs con 🎭 o 📝
```

### Si quieres limpiar sesión mock:
```javascript
// En DevTools > Console:
localStorage.removeItem('mock_session')
localStorage.removeItem('mock_user')
// Recarga la página
```

---

## ✅ Archivos Mock

- `lib/mock-data.ts` - Datos de prueba
- `lib/mock-auth-client.ts` - Cliente de autenticación fake
- `components/auth/auth-form.tsx` - Detecta modo mock y activa

---

## 📌 Notas Importantes

- Los datos mock **NO se guardan** entre recargas (se usan del localStorage)
- El modo mock es **SOLO para desarrollo**
- Los datos mock se verán marcados con `🎭` en la interfaz
- Cuando cambies a modo real, todo volverá a funcionarnormal
- **NO rompe NADA** - es completamente seguro cambiar de modo

---

## 🎯 Próximos Pasos

1. ✅ Explorar la app con datos mock
2. ✅ Ver todas las páginas funcionar
3. ✅ Probar el Kanban y arrastra-suelta
4. ✅ Revisar notificaciones y perfil
5. 🔧 Luego: Conectar a BD real (cambiar `NEXT_PUBLIC_MOCK_AUTH=false`)

**¡Disfruta explorando la app!** 🚀
