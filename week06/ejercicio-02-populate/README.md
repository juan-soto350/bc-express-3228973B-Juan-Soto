# Ejercicio 02 — Populate: Tokens con Players

## 🎯 Objetivo

Agregar una entidad `Token` al proyecto del ejercicio anterior. Los tokens referenciarán jugadores usando `Schema.Types.ObjectId`. Usarás `.populate()` para que los endpoints devuelvan el objeto de jugador completo en vez del ObjectId crudo.

## 📋 Requisitos previos

- Ejercicio 01 completado y funcionando
- Docker con MongoDB corriendo

## 🗂️ Estructura del ejercicio

```
ejercicio-02-populate/
└── starter/
    ├── docker-compose.yml   (igual al ej-01)
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── lib/mongoose.ts                     (dado)
        ├── models/
        │   ├── player.model.ts                 (dado — schema de Player)
        │   └── token.model.ts                  ← PASO 1: añadir campo player
        ├── errors/AppError.ts                  (dado)
        ├── middlewares/                        (dado)
        ├── schemas/
        │   ├── player.schema.ts                (dado)
        │   └── token.schema.ts                 ← PASO 2: añadir campo player
        ├── repositories/
        │   ├── players.repository.ts           (dado)
        │   └── tokens.repository.ts            ← PASO 4: añadir .populate()
        ├── services/
        │   ├── players.service.ts              (dado)
        │   └── tokens.service.ts               (dado)
        ├── controllers/
        │   ├── players.controller.ts           (dado)
        │   └── tokens.controller.ts            (dado)
        ├── routes/
        │   ├── players.routes.ts               (dado)
        │   └── tokens.routes.ts                (dado)
        ├── app.ts                              ← PASO 5: registrar router de tokens
        ├── server.ts                           (dado — connectDB ya activo)
        └── seed.ts                             ← PASO 3: insertar players primero
```

---

## Paso 1 — Añadir el campo `player` al schema de Token

### ¿Qué es `Schema.Types.ObjectId`?

Es el tipo de Mongoose para almacenar referencias. En la colección se guarda solo el ID (24 caracteres hex), pero `populate()` lo reemplaza con el documento completo al leer.

```ts
// Estructura de referencia en el schema
player: {
  type: Schema.Types.ObjectId,  // tipo: ObjectId de MongoDB
  ref: 'Player',                // nombre del Model al que apunta
  required: true,
}
```

**Abre `starter/src/models/token.model.ts`** y descomenta la sección marcada como **PASO 1** (campo `player` en la interfaz y en el schema).

---

## Paso 2 — Validar el ObjectId en Zod

El campo `player` que llega en el body del request es un string. Zod debe verificar que tenga el formato correcto (24 caracteres hexadecimales) antes de pasarlo al repositorio.

```ts
// Validación de ObjectId en Zod
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
player: z.string().regex(objectIdRegex, 'ID de jugador inválido')
```

**Abre `starter/src/schemas/token.schema.ts`** y descomenta el campo `player` en el schema Zod marcado como **PASO 2**.

---

## Paso 3 — Actualizar el seed: insertar players primero

### ¿Por qué el orden importa?

Los tokens referencian jugadores por ObjectId. Si insertas tokens sin jugadores existentes, el ObjectId apuntará a documentos inexistentes. El seed debe:

1. Limpiar ambas colecciones
2. Insertar jugadores y capturar sus `_id`
3. Usar esos `_id` al insertar los tokens

```ts
// Patrón correcto en el seed
await Token.deleteMany({});
await Player.deleteMany({});

// Insertar jugadores y obtener sus IDs
const [carlos, maria] = await Player.insertMany([
  { alias: 'carlosr', nombre: 'Carlos Ramirez', edad: 22, nivel: 'intermedio' },
  { alias: 'mariag', nombre: 'Maria Garcia', edad: 19, nivel: 'principiante' },
]);

// Usar los IDs al crear tokens
await Token.insertMany([
  { codigo: 'TKN-0001', cantidad: 10, player: carlos._id },
  { codigo: 'TKN-0002', cantidad: 5, player: maria._id },
]);
```

**Abre `starter/src/seed.ts`** y descomenta la sección marcada como **PASO 3**.

Ejecuta el seed:
```bash
pnpm seed
```

---

## Paso 4 — Agregar `.populate('player')` en el repositorio

Sin populate, el endpoint devuelve:
```json
{ "_id": "...", "codigo": "TKN-0001", "player": "664abc..." }
```

Con populate, devuelve:
```json
{ "_id": "...", "codigo": "TKN-0001", "player": { "_id": "664abc...", "alias": "carlosr", ... } }
```

```ts
// Agregar .populate() a las queries de lectura
const tokens = await Token.find().populate('player').lean();
const token  = await Token.findById(id).populate('player').lean();
```

**Abre `starter/src/repositories/tokens.repository.ts`** y descomenta los `.populate('player')` marcados como **PASO 4** en `findAll` y `findById`.

Prueba el resultado:
```
GET http://localhost:3000/api/v1/tokens
```
El campo `player` ahora debe ser un objeto, no un string.

---

## Paso 5 — Registrar el router de tokens en `app.ts`

Para que los endpoints de tokens funcionen, el router debe montarse en Express.

```ts
// Montar el router de tokens
app.use('/api/v1/tokens', tokensRouter);
```

**Abre `starter/src/app.ts`** y descomenta la línea marcada como **PASO 5**.

Prueba los endpoints de tokens:
```
GET  http://localhost:3000/api/v1/tokens
POST http://localhost:3000/api/v1/tokens
     Body: { "codigo": "TKN-0006", "cantidad": 15, "player": "<id-player>" }
```

---

## 📊 Diagrama de Relación

```
players                   tokens
┌─────────────────────┐   ┌──────────────────────────────────┐
│ _id: ObjectId       │◄──│ player: Schema.Types.ObjectId    │
│ alias: string       │   │ codigo: string (unique)          │
│ nombre: string      │   │ cantidad: number                 │
│ nivel: string       │   │ estado: string                   │
│ createdAt: Date     │   │ createdAt: Date                  │
└─────────────────────┘   └──────────────────────────────────┘
```

---

## ✅ Criterios de Verificación

- [ ] `GET /tokens` devuelve el campo `player` como objeto (no como string ObjectId)
- [ ] `GET /tokens/:id` también populea el jugador
- [ ] `POST /tokens` con `player` inválido (no ObjectId) retorna `400`
- [ ] El seed inserta jugadores primero y luego tokens con sus IDs reales
- [ ] `GET /players` lista los jugadores correctamente
- [ ] `POST /players` crea un jugador y retorna `201`
- [ ] El diagrama en este README muestra la relación entre las colecciones
