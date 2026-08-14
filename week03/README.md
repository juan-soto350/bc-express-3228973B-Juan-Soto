# Arcade API — Semana 03

API REST con arquitectura en capas (`routes → controllers → services → repositories`) y contratos de respuesta tipados en TypeScript.

## Dominio

**Sala de Videojuegos / Arcade** — Entidades: `machines`, `tokens`, `players`, `maintenance`

### Machine (Máquina arcade)

| Campo                | Tipo   | Descripción                                          |
|----------------------|--------|------------------------------------------------------|
| `id`                 | number | Identificador único, generado por el servidor        |
| `nombre`             | string | Nombre de la máquina (ej. Pac-Man)                   |
| `tipo`               | string | Tipo de juego (Pelea, Clasico, Ritmo, Carreras...)   |
| `precioPorFicha`     | number | Precio en pesos por cada ficha para jugar            |
| `estado`             | string | `activa` \| `inactiva` \| `mantenimiento`            |
| `ultimoMantenimiento`| string | Fecha del último mantenimiento (YYYY-MM-DD)          |
| `createdAt`          | string | Fecha de creación en formato ISO 8601                |

### Token (Ficha)

| Campo       | Tipo   | Descripción                                       |
|-------------|--------|---------------------------------------------------|
| `id`        | number | Identificador único, generado por el servidor     |
| `codigo`    | string | Código único de la ficha (ej. TKN-0001)           |
| `cantidad`  | number | Cantidad de fichas del lote                       |
| `machineId` | number | Máquina a la que se asocia la ficha              |
| `playerId`  | number | Jugador propietario de la ficha                  |
| `estado`    | string | `activo` \| `usado` \| `expirado`                 |
| `createdAt` | string | Fecha de creación en formato ISO 8601             |

### Player (Jugador)

| Campo       | Tipo   | Descripción                                     |
|-------------|--------|-------------------------------------------------|
| `id`        | number | Identificador único, generado por el servidor   |
| `nombre`    | string | Nombre del jugador                             |
| `alias`     | string | Apodo / nombre de usuario                      |
| `edad`      | number | Edad del jugador (0-120)                       |
| `nivel`     | string | `principiante` \| `intermedio` \| `experto`    |
| `createdAt` | string | Fecha de creación en formato ISO 8601          |

### Maintenance (Mantenimiento)

| Campo        | Tipo   | Descripción                                        |
|--------------|--------|----------------------------------------------------|
| `id`         | number | Identificador único, generado por el servidor      |
| `machineId`  | number | Máquina que recibe el mantenimiento               |
| `tecnico`    | string | Nombre del técnico que lo realiza                 |
| `descripcion`| string | Descripción del trabajo realizado                 |
| `fecha`      | string | Fecha del mantenimiento (YYYY-MM-DD)              |
| `costo`      | number | Costo del mantenimiento en pesos                  |
| `createdAt`  | string | Fecha de creación en formato ISO 8601             |

## Estructura

```
week03/
├── package.json
├── tsconfig.json
├── .env
├── pnpm-workspace.yaml
└── src/
    ├── app.ts                       # Configuración de Express
    ├── server.ts                    # Arranque del servidor
    ├── types.ts                     # Tipos del dominio
    ├── routes/
    │   ├── machines.routes.ts       # Mapeo URL -> controller
    │   ├── tokens.routes.ts
    │   ├── players.routes.ts
    │   └── maintenance.routes.ts
    ├── controllers/
    │   ├── machines.controller.ts   # Thin controller (3 pasos)
    │   ├── tokens.controller.ts
    │   ├── players.controller.ts
    │   └── maintenance.controller.ts
    ├── services/
    │   ├── machines.service.ts      # Lógica de negocio + paginación
    │   ├── tokens.service.ts
    │   ├── players.service.ts
    │   └── maintenance.service.ts
    └── repositories/
        ├── machines.repository.ts   # Acceso al store + copias defensivas
        ├── tokens.repository.ts
        ├── players.repository.ts
        └── maintenance.repository.ts
```

## Instalación

```bash
pnpm install
```

## Scripts

| Script             | Descripción                                            |
|--------------------|--------------------------------------------------------|
| `pnpm dev`         | Arranca el servidor en modo watch (`tsx`)              |
| `pnpm build`       | Compila TypeScript a `dist/`                           |
| `pnpm start`       | Ejecuta el código compilado                            |
| `pnpm typecheck`   | Verifica tipos sin generar archivos                    |

## Endpoints

Base URL: `http://localhost:3000/api/v1`

Cada entidad expone el mismo CRUD:

| Método | Ruta                        | Status | Descripción                                |
|--------|-----------------------------|--------|--------------------------------------------|
| GET    | `/machines?page&limit`      | 200    | Lista con paginación                       |
| GET    | `/machines/:id`             | 200    | Obtiene una máquina por ID                 |
| POST   | `/machines`                 | 201    | Crea una máquina                           |
| PUT    | `/machines/:id`             | 200    | Actualiza una máquina (parcial)            |
| DELETE | `/machines/:id`             | 204    | Elimina una máquina                        |

Reemplaza `machines` por `tokens`, `players` o `maintenance` para operar sobre las demás entidades.

Adicional:
- `GET /health` — health check (`{ "status": "ok" }`)

## Contratos de respuesta

### Listado paginado
```json
GET /api/v1/machines?page=1&limit=5 → 200
{
  "data": [
    { "id": 1, "nombre": "Street Fighter II", "tipo": "Pelea", "precioPorFicha": 500, "estado": "activa", "ultimoMantenimiento": "2025-01-10", "createdAt": "2026-08-11T18:27:00.000Z" }
  ],
  "total": 12,
  "page": 1,
  "limit": 5
}
```

### Recurso individual
```json
GET /api/v1/machines/1 → 200
{ "data": { "id": 1, "nombre": "Street Fighter II", "tipo": "Pelea", "precioPorFicha": 500, "estado": "activa", "ultimoMantenimiento": "2025-01-10", "createdAt": "2026-08-11T18:27:00.000Z" } }
```

### Creación
```json
POST /api/v1/machines → 201
{ "data": { "id": 13, "nombre": "Time Crisis", "tipo": "Disparos", "precioPorFicha": 600, "estado": "activa", "ultimoMantenimiento": "2026-08-11", "createdAt": "2026-08-11T18:27:00.000Z" } }
```

### Error
```json
GET /api/v1/machines/999 → 404
{ "error": "Not Found", "message": "Machine 999 not found" }
```

## Ejemplos con curl

```bash
# Listar máquinas
curl http://localhost:3000/api/v1/machines?page=1&limit=3

# Obtener una máquina
curl http://localhost:3000/api/v1/machines/1

# Crear una máquina
curl -X POST http://localhost:3000/api/v1/machines \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Time Crisis","tipo":"Disparos","precioPorFicha":600}'

# Crear un jugador
curl -X POST http://localhost:3000/api/v1/players \
  -H "Content-Type: application/json" \
  -d '{"nombre":"María López","alias":"marialpz","edad":25,"nivel":"intermedio"}'

# Registrar un mantenimiento
curl -X POST http://localhost:3000/api/v1/maintenance \
  -H "Content-Type: application/json" \
  -d '{"machineId":1,"tecnico":"Jorge Peña","descripcion":"Cambio de joystick","fecha":"2026-08-11","costo":120000}'

# Actualizar (parcial)
curl -X PUT http://localhost:3000/api/v1/machines/1 \
  -H "Content-Type: application/json" \
  -d '{"estado":"mantenimiento"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/machines/1
```

## Reglas de Arquitectura

1. **Repository** — única capa que toca el store. Todos los métodos `async Promise<T>`. Devuelve copias defensivas para evitar mutaciones externas.
2. **Service** — sin imports de Express. Contiene la paginación y validaciones de dominio. Lanza `DomainError` con status HTTP para errores esperados.
3. **Controller** — exactamente 3 pasos: extraer datos → llamar al service → responder. Mapea `DomainError` a status HTTP.
4. **Routes** — solo mapeo URL → controller function.

## Validaciones

- `page` debe ser entero >= 1 (default 1).
- `limit` debe ser entero entre 1 y 100 (default 10).
- En `POST`, los campos obligatorios de cada entidad deben ser strings no vacíos o enteros válidos.
- `estado` de máquina: `activa`, `inactiva`, `mantenimiento`.
- `estado` de token: `activo`, `usado`, `expirado`.
- `nivel` de jugador: `principiante`, `intermedio`, `experto`.
- `fecha` de mantenimiento debe tener formato `YYYY-MM-DD`.
- `id` en la URL debe ser entero positivo.

## Datos de ejemplo

Al arrancar, los repositorios siembran datos de ejemplo: 12 máquinas arcade, 3 jugadores, 3 fichas y 6 registros de mantenimiento para que puedas probar los endpoints inmediatamente.
