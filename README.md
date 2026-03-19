# Información que Nutre

Plataforma web para Ayuda a Dar Esperanza enfocada en orientación alimentaria, recetas con canasta básica mexicana, difusión de talleres y fortalecimiento institucional mediante contacto, registros y donaciones.

## Objetivo

Construir una solución digital que ayude a:
- Difundir recetas accesibles y nutritivas.
- Reducir desperdicio de alimentos.
- Organizar talleres y actividades de la asociación.
- Facilitar donaciones y vinculación con la comunidad.
- Centralizar información operativa de usuarios registrados, voluntarios y personas interesadas.

## Stack propuesto

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy
- Pydantic

### Base de datos
- PostgreSQL

### Infraestructura
- Docker / Docker Compose
- Almacenamiento de archivos compatible con S3
- Despliegue separado para frontend y API

## Estructura del monorepo

```bash
informacion-que-nutre/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   └── types/
├── docs/
│   ├── srs/
│   ├── architecture/
│   └── ux/
├── infra/
│   ├── docker/
│   └── scripts/
├── .github/workflows/
├── .env.example
├── package.json
├── turbo.json
└── README.md

## Roles del sistema

1. **Público**: Usuarios no autenticados.
   - Consultar recetas.
   - Ver talleres y eventos.
   - Navegar contenido institucional.
   - Enviar formularios de contacto.

2. **Usuario registrado**: Usuarios con cuenta básica.
   - Completar perfil personal y datos de contacto.
   - Registrarse a talleres.
   - Postularse a voluntariado.
   - Consultar historial básico de registros.
   - Recibir comunicaciones futuras de la organización.

3. **Editor OSF**: Usuarios internos de la asociación.
   - Crear, editar y publicar recetas.
   - Gestionar talleres y eventos.
   - Revisar solicitudes y mensajes.
   - Administrar contenido institucional.

4. **Admin**: Usuarios con control total.
   - Gestionar usuarios y permisos.
   - Configurar parámetros del sistema.
   - Consultar métricas y registros.
   - Supervisar auditoría y operación general.

## Modelo de cuenta

Para los usuarios, la tabla `users` debería almacenar al menos:
- `nombre`
- `apellidos`
- `email`
- `teléfono`
- `municipio` o `zona`
- `rol`
- `estado_de_cuenta`
- `consentimiento_privacidad`
- `fecha_registro`

Y se separaría en tablas distintas lo operativo:
- `volunteer_applications`
- `workshop_registrations`
- `donations`
- `contact_requests`

> **Nota:** Así una persona puede ser Usuario registrado y, al mismo tiempo, haber donado, aplicado a voluntariado y asistido a talleres sin cambiar de rol.

## Módulos principales

- Sitio institucional
- Recetario con canasta básica
- Talleres y registros
- Contacto y formularios
- Voluntariado
- Donaciones
- Panel administrativo
- Métricas y auditoría

## Entorno local

### Requisitos
- Node.js 22+
- pnpm
- Python 3.12+
- Docker

### Pasos iniciales

1. Clonar el repositorio.
2. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Levantar servicios base:
   ```bash
   docker compose -f infra/docker/docker-compose.dev.yml up -d
   ```
4. Instalar dependencias del frontend:
   ```bash
   pnpm install
   ```
5. Instalar dependencias del backend.
6. Ejecutar migraciones.
7. Levantar frontend y API en modo desarrollo.

## Convenciones

- Commits con **Conventional Commits**.
- Desarrollo por ramas: `main`, `develop`, `feature/*`, `fix/*`.
- **Pull requests** obligatorios para integrar cambios.
- Linters y pruebas automáticas en **CI**.

## Documentación

La documentación funcional y técnica vive en:
- `docs/srs/`
- `docs/architecture/`
- `docs/ux/`

## Estado del proyecto

**Fase actual:**
- Definición de arquitectura
- Definición de requerimientos
- Planeación del MVP
