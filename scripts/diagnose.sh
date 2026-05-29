#!/bin/bash

# Script de diagnóstico para AcadProject
# Uso: bash scripts/diagnose.sh

echo "🔍 Iniciando diagnóstico de AcadProject..."
echo ""

# 1. Verificar variables de entorno
echo "📋 Verificando variables de entorno..."
if [ -f .env.local ]; then
  echo "✅ .env.local existe"
  
  # Verificar variables críticas
  if grep -q "DATABASE_URL" .env.local; then
    echo "  ✅ DATABASE_URL configurada"
  else
    echo "  ❌ DATABASE_URL no encontrada"
  fi
  
  if grep -q "BETTER_AUTH_SECRET" .env.local; then
    echo "  ✅ BETTER_AUTH_SECRET configurada"
  else
    echo "  ❌ BETTER_AUTH_SECRET no encontrada"
  fi
  
  if grep -q "BETTER_AUTH_URL" .env.local; then
    echo "  ✅ BETTER_AUTH_URL configurada"
  else
    echo "  ❌ BETTER_AUTH_URL no encontrada"
  fi
else
  echo "❌ .env.local no existe"
fi

echo ""

# 2. Verificar dependencias
echo "📦 Verificando dependencias..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules existe"
else
  echo "❌ node_modules no existe - ejecuta: pnpm install"
fi

echo ""

# 3. Verificar archivos críticos
echo "📁 Verificando archivos críticos..."
for file in lib/auth.ts lib/auth-client.ts components/auth/auth-form.tsx app/api/auth/\[...all\]/route.ts; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file no encontrado"
  fi
done

echo ""
echo "✅ Diagnóstico completado"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   pnpm dev"
echo ""
echo "Luego abre: http://localhost:3000/api/health"
