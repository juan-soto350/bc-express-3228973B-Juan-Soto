# 🕹️ Semana 09 — Proyecto: Testing de API REST (dominio Arcade)

Suite completa de tests para la API de **Sala de Videojuegos / Arcade** (máquinas arcade), con:

- **Unit tests** con Jest + `jest.mock()` (servicios aislados de la DB)
- **Integration tests** con Supertest + MongoDB Memory Server (ciclo HTTP completo)
- **Cobertura ≥ 80%** en statements, functions y lines (umbrales en `jest.config.ts`)

## 📦 Dominio

Recurso principal: **máquinas arcade** (`machines`), con los campos de la semana 08:
`nombre, fabricante, anio, tipoJuego, estado, ubicacion, tarifaPorHora, disponible, createdBy`.

**Reglas de negocio testeadas:**
- Nombre de máquina único → `409`
- Máquina `en_reparacion`/`retirada` no puede estar `disponible: true` → `400`
- Solo el creador o un `admin` actualiza → `403`
- Solo un `admin` elimina (`authorize('admin')`) → `403`

## 🚀 Cómo ejecutar

```bash
cd starter
pnpm install
pnpm test              # todos los tests
pnpm test:watch        # modo watch
pnpm test:coverage     # reporte de cobertura → coverage/index.html
```

No se necesita Docker ni MongoDB instalado: los integration tests usan `mongodb-memory-server` (MongoDB en RAM) y los unit tests mockean el repositorio.

## 🗂️ Suites de tests

| Archivo | Tipo | Qué testea |
|---------|------|------------|
| `src/__tests__/machines.service.test.ts` | Unit | `machines.service.ts` con repositorio mockeado: happy paths + 404 + 409 + 403 + reglas de negocio |
| `src/__tests__/machines.routes.test.ts` | Integration | `/api/v1/machines` con Supertest + MongoMemoryServer: 200, 201, 401, 403, 404, 409, 422, 204 |
| `src/__tests__/auth.service.test.ts` | Unit | `auth.service.ts` (register/login/getMe) con repositorio mockeado: 401, 404, 409 |

## ✅ Resultados

```
Test Suites: 3 passed, 3 total
Tests:       39 passed, 39 total

Cobertura global:
  Statements : 92.94%  (umbral 80)
  Branches   : 86.27%  (umbral 70)
  Functions  : 96.96%  (umbral 80)
  Lines      : 95.53%  (umbral 80)
```

## 🔧 Detalles de implementación

- **Limpieza de estado:** `clearMocks: true` global en `jest.config.ts`; en integration tests, `afterEach` limpia la colección `machines` y `afterAll` desconecta mongoose y detiene el memory server.
- **Aislamiento unit tests:** `jest.mock('../repositories/machines.repository')` reemplaza el módulo completo; nunca se toca una DB real.
- **`app.ts` vs `server.ts`:** los tests importan `{ app }` (sin `listen()`); Supertest crea su propio servidor temporal.
- **Arreglo técnico:** los imports del starter usan extensión `.js` (NodeNext), por eso el tsconfig usa `module: NodeNext` y jest.config agrega `moduleNameMapper` para resolverlos hacia los `.ts`. Se añadió `ts-node` (requerido por `jest.config.ts`) y `pnpm.onlyBuiltDependencies: ["bcrypt"]` (bcrypt nativo).
- **Fix de mascarillado:** los repositorios devuelven objetos planos con `.toObject()` para que el spread del servicio elimine la contraseña en las respuestas.
