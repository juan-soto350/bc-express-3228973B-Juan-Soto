# Ejercicio 02 — Integration Tests con Supertest

Test de los endpoints HTTP de autenticación con el **ciclo completo**: HTTP → middleware → controller → service → MongoDB en memoria (sin mocks de servicio).

## Cómo ejecutar

```bash
cd starter
pnpm install
pnpm test
pnpm test:coverage
```

No requiere MongoDB instalado: `mongodb-memory-server` levanta una instancia en RAM.

## Qué se implementó

Se completó el flujo guiado del starter (`PASO 1` a `PASO 4`):

- **Setup:** `MongoMemoryServer.create()` + `mongoose.connect()` en `beforeAll`; `afterEach` limpia las colecciones; `afterAll` desconecta y detiene el servidor
- `POST /api/v1/auth/register` → **201** con datos y sin password
- `POST /api/v1/auth/register` → **422** con input inválido (Zod)
- `POST /api/v1/auth/register` → **409** con email duplicado
- `POST /api/v1/auth/login` → **200** con `accessToken` / **401** con contraseña incorrecta
- `GET /api/v1/auth/me` → **200** con `Authorization: Bearer <token>` / **401** sin token

## ✅ Resultados

```
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

## Detalles técnicos

- Los tests importan `{ app }` de `app.ts`, **nunca** `server.ts` (Supertest crea su propio servidor TCP temporal)
- Fix en `users.repository.ts`: `createUser` devuelve `saved.toObject()` para que el spread del servicio elimine la contraseña en la respuesta (con el Document de mongoose el spread no filtra `_doc`)
- `ts-node` + `module: NodeNext` + `moduleNameMapper` (imports `.js`) + `pnpm.onlyBuiltDependencies: ["bcrypt"]`
