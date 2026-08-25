# 🕹️ Arcade API — Semana 06: MongoDB + Mongoose ORM

API REST del dominio **Sala de Videojuegos / Arcade** migrada de arrays en memoria a **MongoDB** usando **Mongoose ORM**, con schemas tipados, validadores, relaciones por `populate()`, paginación y manejo de errores específicos de MongoDB.

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

1. Comprender el modelo de datos NoSQL (documentos, colecciones, BSON)
2. Comparar cuándo usar MongoDB vs PostgreSQL según el caso de uso
3. Configurar MongoDB con Docker y conectar desde Node.js con Mongoose
4. Definir schemas con tipos, validadores, timestamps e índices en Mongoose
5. Implementar CRUD completo con manejo de errores específicos de MongoDB
6. Relacionar documentos usando referencias (`ObjectId`) y `populate()`

## 📋 Requisitos Previos

- Semanas 01–05 completadas
- Dominio de la arquitectura en capas (routes → controllers → services → repositories)
- Manejo de errores con AppError y middleware global (semana 04)
- Comprensión de bases de datos relacionales con Prisma (semana 05)
- Docker instalado (`docker --version`)

## 🗂️ Estructura de la Semana

```
week06/
├── README.md                          ← Este archivo
├── ejercicio-01-mongoose-setup/       ← CRUD básico de Players
│   ├── README.md
│   └── starter/                       ← Código starter con pasos a completar
├── ejercicio-02-populate/             ← Tokens con referencia a Players
│   ├── README.md
│   └── starter/                       ← Código starter con populate
└── proyecto/                          ← API completa Arcade con MongoDB
    ├── README.md
    └── starter/                       ← Código final del proyecto
```

## 📝 Contenidos

### Ejercicios Prácticos

| Ejercicio | Descripción | Duración |
|-----------|-------------|----------|
| [ejercicio-01-mongoose-setup](ejercicio-01-mongoose-setup/) | CRUD completo de Players con Mongoose, schema, validadores y error handling | 70 min |
| [ejercicio-02-populate](ejercicio-02-populate/) | Agregar entidad Token con referencia a Player y populate() | 50 min |

### Proyecto

| Entregable | Descripción |
|------------|-------------|
| [proyecto/](proyecto/) | API REST completa con Players y Tokens, populate(), paginación y seed |

## 🏗️ Dominio Asignado: Sala de Videojuegos / Arcade

### Entidades

| Modelo | Descripción | Relaciones |
|---|---|---|
| **Player** (entidad secundaria) | Jugador con `alias` único | 1:N → Token |
| **Token** (entidad principal) | Ficha comprada/consumida | N:1 → Player |

### Diagrama de Relación

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

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Ejercicio 01 | 1h 10min |
| Ejercicio 02 | 50min |
| Proyecto semanal | 2h 30min |
| Revisión y entrega | 1h 10min |

## 🚀 Cómo Ejecutar

### 1. Levantar MongoDB

```bash
cd ejercicio-01-mongoose-setup/starter
docker compose up -d
```

### 2. Ejecutar Ejercicio 01

```bash
cd ejercicio-01-mongoose-setup/starter
cp .env.example .env
pnpm install
pnpm seed
pnpm dev
```

### 3. Ejecutar Ejercicio 02

```bash
cd ejercicio-02-populate/starter
cp .env.example .env
pnpm install
pnpm seed
pnpm dev
```

### 4. Ejecutar Proyecto

```bash
cd proyecto/starter
cp .env.example .env
pnpm install
pnpm seed
pnpm dev
```

## 📌 Entregables

1. ✅ Ejercicio 01 funcionando: API CRUD de Players conectada a MongoDB con Mongoose
2. ✅ Ejercicio 02 funcionando: Entidad Token con `populate()` en respuesta
3. ✅ Proyecto adaptado al dominio Arcade con MongoDB
4. ✅ Screenshots de Thunder Client/Postman mostrando los endpoints CRUD

## 🔗 Comparativa: Semana 05 vs Semana 06

| Aspecto | Semana 05 (PostgreSQL + Prisma) | Semana 06 (MongoDB + Mongoose) |
|---|---|---|
| **Motor de BD** | PostgreSQL (relacional) | MongoDB (documental) |
| **ORM** | Prisma Client | Mongoose |
| **Schema** | `schema.prisma` | `new Schema()` en TypeScript |
| **Relaciones** | `@relation` + `include` | `Schema.Types.ObjectId` + `populate()` |
| **Migraciones** | `prisma migrate dev` | No aplica (schema-less) |
| **Errores** | P2002, P2025, P2003 | 11000, CastError, null |
| **Tipado** | Derivado de Prisma Client | Interfaces TypeScript manuales |

## 📜 Ejemplos de Endpoints

### GET /api/v1/players?page=1&limit=2 → 200

```json
{
  "data": [
    {
      "_id": "...",
      "alias": "carlosr",
      "nombre": "Carlos Ramirez",
      "edad": 22,
      "nivel": "intermedio",
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
    }
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

## 🔗 Navegación

← [Semana 05 — PostgreSQL y Prisma ORM](../week05/README.md)

→ [Semana 07 — Autenticación con JWT](../week07/README.md)
