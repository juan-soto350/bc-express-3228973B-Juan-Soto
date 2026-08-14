# 🕹️ Arcade API — Semana 05: PostgreSQL + Prisma ORM

API REST del dominio **Sala de Videojuegos / Arcade** migrada de memoria a **PostgreSQL** usando **Prisma ORM**, con migraciones versionadas, seed idempotente y manejo de errores de base de datos.

## 🎯 Dominio asignado

**Sala de Videojuegos / Arcade** — Entidades: `machines`, `tokens`, `players`, `maintenance`

| Modelo | Descripción | Relaciones |
|---|---|---|
| **Machine** (recurso principal) | Máquina arcade con `codigo` único | 1:N → Maintenance, 1:N → Token |
| **Maintenance** | Mantenimiento de una máquina | N:1 → Machine |
| **Player** | Jugador con `alias` único | 1:N → Token |
| **Token** | Ficha comprada/consumida | N:1 → Machine, N:1 → Player |

## 📊 Diagrama de entidades

```
Machine (1) ────< (N) Maintenance
    │
    └─────── (1) ────< (N) Token >──── (N:1) Player (1)
```

- Una **máquina** puede tener muchos **mantenimientos** y muchas **fichas**.
- Una **ficha** pertenece a una **máquina** y a un **jugador**.
- `Machine.codigo`, `Player.alias` y `Token.codigo` son **@unique** (demuestran P2002 → 409).

## 🗄️ Schema (`prisma/schema.prisma`)

```prisma
model Machine {
  id                  Int          @id @default(autoincrement())
  codigo              String       @unique
  nombre              String
  tipo                String
  precioPorFicha      Int
  estado              MachineEstado @default(activa)
  ultimoMantenimiento String?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
  maintenance         Maintenance[]
  tokens              Token[]
}

model Maintenance {
  id          Int      @id @default(autoincrement())
  machineId   Int
  tecnico     String
  descripcion String
  fecha       String
  costo       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  machine     Machine  @relation(fields: [machineId], references: [id], onDelete: Cascade)
}

model Player {
  id        Int         @id @default(autoincrement())
  alias     String      @unique
  nombre    String
  edad      Int
  nivel     PlayerNivel @default(principiante)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  tokens    Token[]
}

model Token {
  id        Int         @id @default(autoincrement())
  codigo    String      @unique
  cantidad  Int
  estado    TokenEstado @default(activo)
  machineId Int
  playerId  Int
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  machine   Machine     @relation(fields: [machineId], references: [id])
  player    Player      @relation(fields: [playerId], references: [id])
}
```

## 🚀 Cómo ejecutar

### Opción A — Docker (recomendada)

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Copiar variables de entorno
cp .env.example .env    # ajusta DATABASE_URL

# 3. Instalar dependencias (genera Prisma Client)
pnpm install

# 4. Ejecutar migraciones y seed
pnpm db:migrate
pnpm db:seed

# 5. Iniciar servidor
pnpm dev
```

### Opción B — PostgreSQL local

Crea la base de datos y apunta `DATABASE_URL` en `.env`:
```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/arcade_dev"
```
Luego los pasos 3–5 anteriores.

## 🧪 Seed (logs)

```
🌱 Iniciando seed...
✅ 8 máquinas creadas
✅ 3 jugadores creados
✅ 5 mantenimientos creados
✅ 3 fichas creadas
🌱 Seed completado.
```

El seed es **idempotente**: elimina datos existentes antes de insertar, por lo que puede ejecutarse varias veces sin duplicar.

## 🔌 Endpoints

| Método | Ruta | Status | Descripción |
|---|---|---|---|
| GET | `/api/v1/machines?page&limit` | 200 | Listado paginado (con `maintenance`) |
| GET | `/api/v1/machines/:id` | 200 / 404 | Detalle con relación `maintenance` |
| POST | `/api/v1/machines` | 201 / 400 / 409 | Crear (validación Zod + P2002) |
| PUT | `/api/v1/machines/:id` | 200 / 404 | Actualizar |
| DELETE | `/api/v1/machines/:id` | 204 / 404 | Eliminar (P2025) |

Mismos endpoints para `tokens`, `players` y `maintenance`.

## 📜 Ejemplos request/response

### GET /api/v1/machines?page=1&limit=2 → 200

```json
{
  "data": [
    {
      "id": 9,
      "codigo": "MAC-001",
      "nombre": "Street Fighter II",
      "tipo": "Pelea",
      "precioPorFicha": 500,
      "estado": "activa",
      "ultimoMantenimiento": "2025-01-10",
      "createdAt": "2026-08-14T01:59:09.583Z",
      "updatedAt": "2026-08-14T01:59:09.583Z",
      "maintenance": [ { "id": 6, "machineId": 9, "tecnico": "Jorge Peña", "...": "..." } ]
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 2
}
```

### POST /api/v1/machines → 201

```bash
curl -X POST http://localhost:3000/api/v1/machines \
  -H "Content-Type: application/json" \
  -d '{"codigo":"MAC-099","nombre":"Time Crisis","tipo":"Disparos","precioPorFicha":600}'
```

### POST máquina con `codigo` duplicado → 409 (P2002)

```json
{ "error": "Application Error", "message": "Ya existe una máquina con ese código" }
```

### GET /api/v1/machines/999 → 404 (P2025)

```json
{ "error": "Application Error", "message": "Machine 999 not found" }
```

### POST mantenimiento con máquina inexistente → 400 (P2003)

```json
{ "error": "Application Error", "message": "La máquina con id 99999 no existe" }
```

### GET /api/v1/players/1 → 200 (relación `tokens` con `include`)

```json
{
  "data": {
    "id": 4,
    "alias": "carlosr",
    "nombre": "Carlos Ramirez",
    "edad": 22,
    "nivel": "intermedio",
    "tokens": [ { "id": 4, "codigo": "TKN-0001", "cantidad": 5, "estado": "activo" } ]
  }
}
```

## 🏗️ Arquitectura

- **`src/lib/prisma.ts`** — Singleton de PrismaClient (patrón `globalForPrisma`, log de queries en desarrollo).
- **Repositorios** — Única capa que usa Prisma Client: paginación con `skip`/`take` + `count()` en paralelo (`Promise.all`), `include` para cargar relaciones sin N+1.
- **Errores Prisma** — `P2025` → `AppError(404)`, `P2002` → `AppError(409)`, `P2003` → `AppError(400)`.
- **Servicios** — Lógica de negocio sin imports de Express.
- **Controladores** — Thin controllers con validación Zod (`safeParse`) y `next(err)`.
- **Tipos** — Derivados de Prisma Client (`Prisma.MachineGetPayload`, etc.), sin duplicar interfaces.
- **AppError + errorHandler** — Reutilizados de la semana 04 (ZodError → 400, AppError → status, genérico → 500).

## 🪵 Logging

Winston + Morgan: `logger.info()` al iniciar el servidor, nivel `http` en desarrollo y `warn` en producción.

## 📦 Entregables

1. ✅ `prisma/migrations/` versionada en el repo
2. ✅ README con dominio, diagrama y endpoints
3. ✅ Los 5 endpoints funcionando (probados con curl)
4. ✅ Logs del seed incluidos arriba
