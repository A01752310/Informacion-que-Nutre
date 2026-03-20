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
  ```


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
   - Enviar recetas para revisión editorial.
   - Proponer enlaces de videos de YouTube relacionados con sus recetas.
   - Consultar historial básico de registros y envíos.
   - Recibir comunicaciones futuras de la organización.
   
   > **Moderación de contenido:** Las recetas y enlaces de video enviados por usuarios registrados no se publican automáticamente. Todo contenido pasa por revisión de un Editor OSF antes de su publicación.


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

## Modelo de Datos Principal

Para el manejo de cuentas, la tabla `users` almacena:
- `nombre`, `apellidos`, `email`, `teléfono`, `municipio`, `rol`, `estado_de_cuenta`, `consentimiento_privacidad`, `fecha_registro`

Para el control operativo y la moderación, el esquema incluye:

- **Catálogo Principal (`recipes`)**: Resguarda las recetas canónicas publicables (incluyendo `servings`, `estimated_cost`, `prep_time_minutes`, `difficulty`, `source_type`, `published_at`, `status`).
- **Moderación de Recetas (`recipe_submissions`)**: Almacena propuestas enviadas por usuarios registrados, conservando el contenido original hasta revisión (`pending_review`, `approved`, `rejected`).
- **Videos Relacionados (`recipe_videos`)**: Entidad separada para manejar enlaces de YouTube, ligados a una receta, sujetos a revisión editorial.
- **Registros operativos**: `volunteer_applications`, `workshop_registrations`, `donations`, `contact_requests`.

> **Nota:** Así una persona puede ser Usuario registrado y tener un historial de recetas propuestas, haber donado, y asistido a talleres sin cambiar de rol.

## Módulos principales

- Sitio institucional
- Recetario con canasta básica
- Talleres y registros
- Contacto y formularios
- Voluntariado
- Donaciones
- Panel administrativo
- Métricas y auditoría

## Entorno local y Preparación de Demo

Hemos preparado scripts automatizados para levantar el proyecto con un solo comando y probar la plataforma con datos interactivos reales.

### Requisitos
- Node.js 22+
- pnpm 9.0+
- Python 3.12+
- Docker y Docker Compose

### Levantar el Entorno Automáticamente (Recomendado para Demo)

1. **Configurar el entorno inicial** (Solo se necesita correr la primera vez y configurará BD, API, Frontend y sembrará datos de prueba):
   ```bash
   ./infra/scripts/setup_demo.sh
   ```
2. **Arrancar todo el sistema** (Base de datos, API en el puerto 8000, Web en el puerto 3000):
   ```bash
   ./infra/scripts/start_demo.sh
   ```
   > **Nota:** Para detener todos los servicios, simplemente presiona `Ctrl+C` en la misma terminal.

### Credenciales de Demo

Para probar los diferentes roles y flujos, el script de inicialización crea los siguientes usuarios en la base de datos local:

| Rol | Correo | Contraseña | Uso y permisos esperados en la demo |
| --- | --- | --- | --- |
| **Normal** | `usuario@ejemplo.com` | `demo123` | Registros, enviar propuestas de recetas y videos vinculados a recetas públicas. |
| **Editor OSF** | `editor@nutre.org` | `demo123` | Revisar propuestas pendientes, aprobar/rechazar recetas y gestionar contenido. |
| **Admin** | `admin@nutre.org` | `demo123` | Control total del sistema. |

### Pasos Manuales de Instalación y Ejecución (Alternativa)

Si prefieres levantar los servicios manualmente, sigue estos pasos:

1. Clonar el repositorio.
2. Copiar variables de entorno globales:
   ```bash
   cp .env.example .env
   ```
3. Levantar la base de datos PostgreSQL:
   ```bash
   docker compose -f infra/docker/docker-compose.dev.yml up -d
   ```
4. Instalar dependencias del workspace (Frontend y scripts turbo):
   ```bash
   pnpm install
   ```
5. Inicializar entorno virtual de la API e instalar requerimientos:
   ```bash
   cd apps/api
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
6. Ejecutar migraciones iniciales y poblar base de datos con roles y datos de prueba:
   ```bash
   alembic upgrade head
   python -m src.db.seed
   python -m src.db.seed_demo
   cd ../..
   ```
7. Levantar el proyecto en desarrollo con Turborepo:
   ```bash
   pnpm run dev
   ```

## Estado y Funciones del Proyecto

**Fase actual: MVP Funcional Local (Fase 3 Completada)**

### ✅ Listo y Funcional (Demo Local)
**Frontend (Next.js/React):**
- Exploración de catálogo público de recetas.
- Sistema de autenticación JWT (Login/Registro).
- Perfil de usuario (Mis Recetas, Mis Videos).
- Formularios para proponer recetas y videos (conectados al Backend).
- Panel de Moderación para el rol `Editor OSF` (aprobar/rechazar envíos).

**Backend (FastAPI):**
- Autenticación y gestión de usuarios (roles: Público, Registrado, Editor, Admin).
- Endpoints operativos para Recetas, Envío de Propuestas de Recetas y Videos de YouTube (`/api/v1/recipes`, `/api/v1/auth`, etc).

**Infraestructura Local:**
- PostgreSQL contenerizado (`docker-compose.dev.yml`).
- Migraciones con Alembic automatizadas.
- Autopoblado (Seeding) de base de datos con roles, usuarios y recetas de prueba listos para demo (`setup_demo.sh` y `start_demo.sh`).

### 🚧 Backlog y Trabajo Pendiente (Lo que falta)
- **Despliegue a Producción (Deploy):** 
  - Configurar entorno Cloud (VPS, Railway, Render o AWS).
  - Proveer un `docker-compose.prod.yml` para el backend.
  - Pipelines CI/CD oficiales para el despliegue automático.
- **Poblado Definitivo de Base de Datos:**
  - Migrar las recetas reales verídicas desde formatos Excel/PDF proporcionados por la fundación a la base de datos productiva.
- **Nuevos Módulos de Producto:**
  - Gestión integral de **Talleres** e inscripciones de usuarios.
  - Recepción de **Solicitudes de Voluntariado**.
  - Pasarela para el Módulo de **Donaciones**.
  - Panel nativo de **Métricas y Auditoría** para el Super Admin.

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
