#!/bin/bash

# Asegurar que estamos en la raíz del monorepo
cd "$(dirname "$0")/../.."

echo "========================================="
echo "  Starting Local Demo Environment"
echo "========================================="

# 1. Verificar si el puerto 8000 ya está en uso
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q '[:\.]8000 ' ; then
    echo "❌ ERROR: El puerto 8000 (API) ya está en uso."
    echo "Por favor detén cualquier proceso que lo ocupe antes de continuar."
    exit 1
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q '[:\.]3000 ' ; then
    echo "❌ ERROR: El puerto 3000 (Frontend) ya está en uso."
    echo "Por favor detén cualquier proceso que lo ocupe antes de continuar."
    exit 1
fi

# 2. Verificar que la base de datos esté corriendo
echo "➡️  Asegurando base de datos PostgreSQL local en Docker..."
docker compose -f infra/docker/docker-compose.dev.yml up -d

# 3. Arrancar todo el monorepo
echo "➡️  Iniciando API y Frontend concurrentemente con pnpm dev..."
echo "========================================="
echo "Para detener los servicios, presiona Ctrl+C"
echo "========================================="

pnpm run dev
