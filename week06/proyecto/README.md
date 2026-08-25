# Proyecto Semana 06 — API REST con MongoDB + Mongoose

## 🎯 Objetivo

Construir una API REST completa usando Express 5, TypeScript, Mongoose y MongoDB. La API debe incluir al menos **dos entidades relacionadas** con `populate()`, paginación, manejo de errores 11000 y CastError, y un seed con datos de prueba.

---

## 📋 Dominio Asignado: Sala de Videojuegos / Arcade

> **Entidades**: `players` (jugadores) y `tokens` (fichas)

| Modelo | Descripción | Relaciones |
|---|---|---|
| **Player** (entidad secundaria) | Jugador con `alias` único | 1:N → Token |
| **Token** (entidad principal) | Ficha comprada/consumida | N:1 → Player |

---

## 📊 Diagrama de Relación

```
players                   tokens
┌─────────────────────┐   ┌──────────────────────────────────┐
│ _id: ObjectId       │◄──│ player: Schema.Types.ObjectId    │
│ alias: string       │   │ codigo: string (unique)          │
│ nombre: string      │   │ cantidad: number                 │
│ edad: number        │   │ estado: string                   │
│ nivel: string       │   │ createdAt: Date                  │
│ activo: boolean     │   └──────────────────────────────────┘
│ createdAt: Date     │
└─────────────────────┘
```

- Un **jugador** puede tener muchas **fichas**.
- Una **ficha** pertenece a un **jugador**.
- `Player.alias` y `Token.codigo` son **unique** (demuestran error 11000 → 409).

---

## ✅ Requisitos Funcionales

### Entidad Secundaria: Player (sin referencias)
- `GET    /api/v1/players?page&limit`   — listar con paginación
- `GET    /api/v1/players/:id`          — obtener por ID
- `POST   /api/v1/players`              — crear (validación Zod)
- `PUT    /api/v1/players/:id`          — actualizar
- `DELETE /api/v1/players/:id`          — eliminar

### Entidad Principal: Token (referencia a Player)
- `GET    /api/v1/tokens?page&limit`    — listar con paginación + populate()
- `GET    /api/v1/tokens/:id`           — obtener con populate()
- `POST   /api/v1/tokens`               — crear (validar ObjectId de player)
- `PUT    /api/v1/tokens/:id`           — actualizar
- `DELETE /api/v1/tokens/:id`           — eliminar

---

## 🛠️ Stack Técnico

```
Node.js 22   |   Express 5.1.0   |   TypeScript 5.8.3
Mongoose 9.4.1   |   MongoDB 7 (Docker)   |   Zod 4.3.6
```

---

## 🚀 Cómo ejecutar

### 1. Levantar MongoDB

```bash
cd starter
docker compose up -d
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Instalar dependencias

```bash
pnpm install
```

### 4. Ejecutar seed

```bash
pnpm seed
```

Salida esperada:
```
🌱 Iniciando seed...
Collections cleared
Seed completed: 5 players, 8 tokens inserted
```

### 5. Iniciar servidor

```bash
pnpm dev
```

Deberías ver en consola:
```
MongoDB connected
Server running on port 3000
```

---

## 🔌 Endpoints

| Método | Ruta | Status | Descripción |
|---|---|---|---|
| GET | `/api/v1/players?page&limit` | 200 | Listado paginado |
| GET | `/api/v1/players/:id` | 200 / 404 | Detalle |
| POST | `/api/v1/players` | 201 / 400 / 409 | Crear (validación Zod + 11000) |
| PUT | `/api/v1/players/:id` | 200 / 404 | Actualizar |
| DELETE | `/api/v1/players/:id` | 204 / 404 | Eliminar |
| GET | `/api/v1/tokens?page&limit` | 200 | Listado con populate() |
| GET | `/api/v1/tokens/:id` | 200 / 404 | Detalle con populate() |
| POST | `/api/v1/tokens` | 201 / 400 / 409 | Crear (validar ObjectId) |
| PUT | `/api/v1/tokens/:id` | 200 / 404 | Actualizar |
| DELETE | `/api/v1/tokens/:id` | 204 / 404 | Eliminar |

---

## 📜 Ejemplos request/response

### GET /api/v1/players?page=1&limit=2 → 200

```json
{
  "data": [
    {
      "_id": "...",
      "alias": "juans",
      "nombre": "Juan Soto",
      "edad": 28,
      "nivel": "avanzado",
      "activo": true,
      "createdAt": "2026-08-25T...",
      "updatedAt": "2026-08-25T..."
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 3
}
```

### GET /api/v1/tokens/1 → 200 (con populate)

```json
{
  "data": {
    "_id": "...",
    "codigo": "TKN-0001",
    "cantidad": 10,
    "estado": "activo",
    "player": {
      "_id": "...",
      "alias": "carlosr",
      "nombre": "Carlos Ramirez",
      "edad": 22,
      "nivel": "intermedio"
    },
    "createdAt": "2026-08-25T...",
    "updatedAt": "2026-08-25T..."
  }
}
```

### POST /api/v1/tokens → 201

```bash
curl -X POST http://localhost:3000/api/v1/tokens \
  -H "Content-Type: application/json" \
  -d '{"codigo":"TKN-0009","cantidad":5,"player":"<id-player>"}'
```

### POST token con `codigo` duplicado → 409

```json
{ "error": "Application Error", "message": "El codigo ya está registrado" }
```

### POST token con `player` inválido → 400

```json
{ "error": "Validation Error", "message": "player: ID de jugador inválido" }
```

### GET /api/v1/players/999 → 404

```json
{ "error": "Application Error", "message": "Player no encontrado" }
```

---

## 📁 Estructura del Proyecto

```
starter/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── lib/
    │   └── mongoose.ts          ← connectDB / disconnectDB
    ├── models/
    │   ├── player.model.ts      ← Schema de Player
    │   └── token.model.ts       ← Schema de Token con ref a Player
    ├── errors/
    │   └── AppError.ts
    ├── middlewares/
    │   ├── errorHandler.ts
    │   └── notFound.ts
    ├── schemas/
    │   ├── player.schema.ts     ← Validación Zod para Player
    │   └── token.schema.ts      ← Validación Zod con ObjectId
    ├── repositories/
    │   ├── players.repository.ts ← CRUD completo
    │   └── tokens.repository.ts  ← CRUD + populate()
    ├── services/
    │   ├── players.service.ts
    │   └── tokens.service.ts
    ├── controllers/
    │   ├── players.controller.ts
    │   └── tokens.controller.ts
    ├── routes/
    │   ├── players.routes.ts
    │   └── tokens.routes.ts
    ├── app.ts                    ← Monta ambos routers
    ├── server.ts                 ← connectDB antes de listen
    └── seed.ts                   ← Inserta players primero, luego tokens
```

---

## 📌 Entregables

1. ✅ **API funcional** — todos los endpoints responden correctamente
2. ✅ **Código adaptado** — entidades con nombres del dominio Arcade
3. ✅ **Populate funcionando** — `GET /tokens` devuelve el jugador como objeto
4. ✅ **Errores manejados** — 400 (CastError), 404 (not found), 409 (duplicate)
5. ✅ **Seed ejecutable** — `pnpm seed` inserta datos sin errores
6. ✅ **README actualizado** — describe el dominio, entidades, campos y endpoints

### Evidencia

Incluye capturas de:
- `GET /tokens` mostrando el campo populado
- `POST /tokens` con éxito (201)
- `POST /tokens` con ID de jugador inválido (400)
- `POST /tokens` con código duplicado (409)

---

## 🔗 Recursos

- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- Teoría semana 06: `1-teoria/`
