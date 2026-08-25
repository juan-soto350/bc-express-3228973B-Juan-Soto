# Ejercicio 01 — Mongoose Setup: CRUD de Players

## 🎯 Objetivo

Conectar Express con MongoDB usando Mongoose, definir un schema con validadores, e implementar el repositorio CRUD completo — incluyendo paginación, manejo de errores 11000 y CastError.

## 📋 Requisitos previos

- Docker Desktop corriendo
- Semanas 01–05 completadas
- Variables de entorno configuradas (`.env`)

## 🗂️ Estructura del ejercicio

```
ejercicio-01-mongoose-setup/
└── starter/
    ├── docker-compose.yml
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── lib/
        │   └── mongoose.ts        ← connectDB / disconnectDB
        ├── models/
        │   └── player.model.ts    ← PASO 1: Schema y Model
        ├── errors/
        │   └── AppError.ts
        ├── middlewares/
        │   ├── errorHandler.ts
        │   └── notFound.ts
        ├── schemas/
        │   └── player.schema.ts   ← Validación Zod
        ├── repositories/
        │   └── players.repository.ts  ← PASO 3 + 4
        ├── services/
        │   └── players.service.ts
        ├── controllers/
        │   └── players.controller.ts
        ├── routes/
        │   └── players.routes.ts
        ├── app.ts
        ├── server.ts              ← PASO 2: connectDB
        └── seed.ts                ← PASO 5: insertar datos
```

---

## Paso 1 — Definir el Schema y el Model

### ¿Qué es un Schema en Mongoose?

Un Schema define la estructura del documento (equivale a la tabla en SQL). Le decimos a Mongoose qué campos acepta, qué tipo tienen y qué validaciones aplican.

```ts
// Ejemplo de definición mínima
import { Schema, model } from 'mongoose';

interface IPlayer {
  alias: string;
  nombre: string;
}

const playerSchema = new Schema<IPlayer>({
  alias:  { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
}, { timestamps: true });

export const Player = model<IPlayer>('Player', playerSchema);
```

**Abre `starter/src/models/player.model.ts`** y descomenta la sección marcada como **PASO 1**.

---

## Paso 2 — Conectar a MongoDB antes de iniciar el servidor

### ¿Por qué conectar antes de `app.listen()`?

Mongoose mantiene un estado de conexión global. Si ejecutamos queries antes de conectar, fallarán silenciosamente. Por eso debemos `await connectDB()` **antes** de `app.listen()`.

```ts
// Patrón correcto en server.ts
await connectDB();          // ← primero la conexión
app.listen(PORT, ...);      // ← luego el servidor
```

**Abre `starter/src/server.ts`** y descomenta la sección marcada como **PASO 2**.

Luego levanta MongoDB con Docker:

```bash
cd starter
docker compose up -d
```

Verifica que el servidor inicia sin errores:

```bash
pnpm dev
```

Deberías ver en consola:
```
MongoDB connected
Server running on port 3000
```

---

## Paso 3 — Implementar `findAll` con paginación

### `find()` vs `findOne()`

- `find(filter)` → devuelve **array** (nunca null, puede ser vacío `[]`)
- `findOne(filter)` → devuelve **un documento** o `null`
- `.lean()` → convierte el resultado a objeto JS plano (sin métodos Mongoose) — siempre usarlo en queries de lectura

```ts
// Ejemplo de findAll con paginación
const skip = (page - 1) * limit;
const [data, total] = await Promise.all([
  Player.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  Player.countDocuments(),
]);
```

**Abre `starter/src/repositories/players.repository.ts`** y descomenta la sección marcada como **PASO 3**.

Prueba con Thunder Client / Postman:
```
GET http://localhost:3000/api/v1/players?page=1&limit=5
```

---

## Paso 4 — Implementar `findById`, `create`, `update` y `remove`

### Errores específicos de MongoDB que debes manejar

| Error | Causa | Cómo detectarlo |
|-------|-------|-----------------|
| `MongoServerError` code `11000` | Campo único duplicado (ej. alias) | `err.code === 11000` |
| `mongoose.Error.CastError` | ObjectId inválido en `findById` | `err instanceof mongoose.Error.CastError` |
| `null` devuelto | Documento no existe | Verificar `if (!player)` |

```ts
// Ejemplo de manejo en create
import { MongoServerError } from 'mongodb';

try {
  const player = await Player.create(dto);
  return player.toJSON();
} catch (err) {
  if (err instanceof MongoServerError && err.code === 11000) {
    throw new AppError(409, 'El alias ya está registrado');
  }
  throw err;
}
```

**Abre `starter/src/repositories/players.repository.ts`** y descomenta la sección marcada como **PASO 4**.

Prueba con Thunder Client / Postman:
```bash
# Crear player
POST http://localhost:3000/api/v1/players
Content-Type: application/json
{ "alias": "nuevojugador", "nombre": "Nuevo Jugador", "edad": 20, "nivel": "principiante" }

# Duplicar alias (debe retornar 409)
POST http://localhost:3000/api/v1/players
{ "alias": "nuevojugador", "nombre": "Otro", "edad": 25, "nivel": "intermedio" }

# ID inválido (debe retornar 400)
GET http://localhost:3000/api/v1/players/id-invalido
```

---

## Paso 5 — Insertar datos de prueba con el seed

Para que el endpoint GET devuelva resultados interesantes, necesitas datos. El seed inserta varios jugadores de ejemplo en MongoDB.

```ts
// Ejemplo de seed básico
await connectDB();
await Player.deleteMany({});  // limpia colección
await Player.insertMany([
  { alias: 'carlosr', nombre: 'Carlos Ramirez', edad: 22, nivel: 'intermedio' },
  { alias: 'mariag', nombre: 'Maria Garcia', edad: 19, nivel: 'principiante' },
]);
await disconnectDB();
```

**Abre `starter/src/seed.ts`** y descomenta la sección marcada como **PASO 5**.

Ejecuta el seed:
```bash
pnpm seed
```

Verifica con:
```
GET http://localhost:3000/api/v1/players
```

---

## ✅ Criterios de Verificación

- [ ] `GET /players` devuelve `{ data, total, page, totalPages }` con `.lean()`
- [ ] `GET /players/:id` con ID inválido retorna `400 "ID inválido"`
- [ ] `GET /players/:id` con ID inexistente retorna `404`
- [ ] `POST /players` con alias duplicado retorna `409`
- [ ] `PUT /players/:id` actualiza con `{ new: true, runValidators: true }`
- [ ] `DELETE /players/:id` elimina y retorna `204`
- [ ] `connectDB()` se llama en `server.ts`, antes de `app.listen()`
- [ ] Ningún `mongoose.connect()` aparece dentro de rutas o controladores
