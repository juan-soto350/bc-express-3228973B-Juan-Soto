# 🎮 Arcade API — Semana 04: Validación, Errores y Logging

API REST del dominio **Sala de Videojuegos / Arcade** con:
- ✅ **Validación con Zod** (schemas `create`/`update`, tipos inferidos con `z.infer<>`)
- ✅ **Errores estructurados con AppError** (statusCode + isOperational)
- ✅ **Logging profesional con Winston + Morgan**

## 🕹️ Dominio asignado

**Sala de Videojuegos / Arcade** — Entidades: `machines`, `tokens`, `players`, `maintenance`

| Entidad | Recurso | Endpoints |
|---|---|---|
| Máquinas arcade | `/api/v1/machines` | CRUD completo |
| Fichas | `/api/v1/tokens` | CRUD completo |
| Jugadores | `/api/v1/players` | CRUD completo |
| Mantenimientos | `/api/v1/maintenance` | CRUD completo |

## 🧱 Estructura

```
week04/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── app.ts                       # Config Express (orden de middlewares)
    ├── server.ts                    # Bootstrap + logger.info
    ├── types.ts                     # Entidades + contratos de respuesta
    ├── config/
    │   └── logger.ts                # Winston + stream para Morgan
    ├── errors/
    │   └── AppError.ts              # Clase AppError + isAppError
    ├── middlewares/
    │   ├── errorHandler.ts          # 4 params: ZodError→400, AppError→status, genérico→500
    │   └── notFound.ts              # 404 en formato ErrorResponse
    ├── schemas/
    │   ├── machine.schema.ts        # createMachineSchema + updateMachineSchema
    │   ├── token.schema.ts
    │   ├── player.schema.ts
    │   └── maintenance.schema.ts
    ├── repositories/                # Única capa que toca el store
    ├── services/                    # Lógica de negocio + AppError
    ├── controllers/                 # Thin controllers con safeParse
    └── routes/                      # Solo mapeo URL → controller
```

## 📋 Campos de los schemas y sus validaciones

### Machine (máquina arcade)
| Campo | Tipo | Validación |
|---|---|---|
| `nombre` | string | obligatorio, no vacío |
| `tipo` | string | obligatorio, no vacío |
| `precioPorFicha` | number | entero, ≥ 0 |
| `estado` | enum | `activa` \| `inactiva` \| `mantenimiento` (opcional) |
| `ultimoMantenimiento` | string | formato `YYYY-MM-DD` (opcional) |

### Token (ficha)
| Campo | Tipo | Validación |
|---|---|---|
| `codigo` | string | obligatorio, no vacío, **único** (409 si existe) |
| `cantidad` | number | entero, ≥ 0 |
| `machineId` | number | entero > 0 |
| `playerId` | number | entero > 0 |
| `estado` | enum | `activo` \| `usado` \| `expirado` (opcional) |

### Player (jugador)
| Campo | Tipo | Validación |
|---|---|---|
| `nombre` | string | obligatorio, no vacío |
| `alias` | string | obligatorio, no vacío, **único** (409 si existe) |
| `edad` | number | entero, 0–120 |
| `nivel` | enum | `principiante` \| `intermedio` \| `experto` (opcional) |

### Maintenance (mantenimiento)
| Campo | Tipo | Validación |
|---|---|---|
| `machineId` | number | entero > 0 |
| `tecnico` | string | obligatorio, no vacío |
| `descripcion` | string | obligatorio, no vacío |
| `fecha` | string | formato `YYYY-MM-DD` |
| `costo` | number | entero, ≥ 0 |

Los schemas de actualización reutilizan los de creación con `.partial()` y los tipos DTO se infieren con `z.infer<typeof schema>`.

## 🚀 Cómo ejecutar

```bash
pnpm install
cp .env.example .env   # PORT=3000, NODE_ENV=development
pnpm dev               # servidor en http://localhost:3000
pnpm build             # compilación TypeScript
```

## 🔌 Endpoints

| Método | Ruta | Status | Descripción |
|---|---|---|---|
| GET | `/api/v1/machines?page&limit` | 200 | Listar con paginación |
| GET | `/api/v1/machines/:id` | 200 | Obtener por ID |
| POST | `/api/v1/machines` | 201 | Crear (validado con Zod) |
| PUT | `/api/v1/machines/:id` | 200 | Actualizar (campos opcionales) |
| DELETE | `/api/v1/machines/:id` | 204 | Eliminar |
| GET | `/health` | 200 | Health check |
| * | cualquier otra ruta | 404 | `{ error, message }` |

Reemplaza `machines` por `tokens`, `players` o `maintenance` para las demás entidades.

## 🧪 Contratos de respuesta

```json
// POST con body inválido → 400
{
  "error": "Validation Error",
  "message": "Datos de entrada inválidos",
  "issues": [
    { "field": "nombre", "message": "nombre es obligatorio" },
    { "field": "precioPorFicha", "message": "precioPorFicha no puede ser negativo" }
  ]
}

// GET /api/v1/machines/999 → 404
{ "error": "Application Error", "message": "Machine 999 not found" }

// GET /api/v1/machines?page=1&limit=2 → 200
{ "data": [ ... ], "total": 12, "page": 1, "limit": 2 }
```

## 📜 Ejemplos con curl

```bash
# Listar máquinas paginado
curl "http://localhost:3000/api/v1/machines?page=1&limit=3"

# Crear máquina válida
curl -X POST http://localhost:3000/api/v1/machines \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Time Crisis","tipo":"Disparos","precioPorFicha":600,"estado":"activa"}'

# Crear máquina inválida → 400 con issues[]
curl -X POST http://localhost:3000/api/v1/machines \
  -H "Content-Type: application/json" \
  -d '{"nombre":"","precioPorFicha":-5}'

# ID no numérico → 400
curl http://localhost:3000/api/v1/machines/abc

# ID inexistente → 404
curl http://localhost:3000/api/v1/machines/999

# Código de ficha duplicado → 409
curl -X POST http://localhost:3000/api/v1/tokens \
  -H "Content-Type: application/json" \
  -d '{"codigo":"TKN-0001","cantidad":3,"machineId":1,"playerId":1}'

# Actualización parcial
curl -X PUT http://localhost:3000/api/v1/players/1 \
  -H "Content-Type: application/json" \
  -d '{"nivel":"experto"}'
```

## 🪵 Logging

- **Desarrollo**: nivel `http`, formato colorizado en consola.
- **Producción** (`NODE_ENV=production`): nivel `warn`, formato JSON y archivo `logs/error.log`.
- Morgan redirige los logs de peticiones HTTP a Winston (`logger.http`).
- `logger.info()` al iniciar el servidor y `logger.warn()` para errores AppError.
- Sin `console.log` en el código.

## 🧠 Manejo de errores

- **AppError**: extiende `Error` con `statusCode` e `isOperational`, para distinguir errores esperados del dominio (ej: 404, 409) de bugs del programador.
- **errorHandler** (4 parámetros, siempre el último middleware):
  - `ZodError` → **400** con `issues[]`
  - `AppError` → **statusCode** correspondiente
  - Error genérico → **500** (stack trace solo en desarrollo)
- **notFound** registrado después de todas las rutas → 404 en JSON (no HTML).
