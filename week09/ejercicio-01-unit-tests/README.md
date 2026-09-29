# Ejercicio 01 — Unit Tests con Jest y Mocks

Test de `auth.service.ts` en **aislamiento total**: el repositorio se mockea con `jest.mock()` y las funciones se controlan con `mockResolvedValue`. La DB nunca se toca.

## Cómo ejecutar

```bash
cd starter
pnpm install
pnpm test
pnpm test:coverage
```

## Qué se implementó

Se completó el flujo guiado del starter (`PASO 1` a `PASO 5`):

- Mock del módulo completo `users.repository` con cast a `jest.MockedFunction`
- `register()` happy path: crea usuario y **nunca** devuelve la contraseña
- `register()` email duplicado → `AppError 409` y `createUser` no se llama
- `login()` usuario no encontrado → `AppError 401`
- `login()` contraseña incorrecta → `AppError 401` (hash real con bcrypt rounds=1 para velocidad)
- `login()` credenciales válidas → `accessToken`
- Verificación de argumentos con `toHaveBeenCalledWith` / `toHaveBeenCalledTimes`
- Extra: test de roundtrip de `utils/jwt.ts` (`src/__tests__/jwt.test.ts`)

## ✅ Resultados

```
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Cobertura:   100% statements / branches / functions / lines
             (el repositorio stub se excluye: es el módulo que se mockea)
```

## Detalles técnicos

- `ts-node` agregado a devDependencies (requerido para leer `jest.config.ts`)
- tsconfig con `module: NodeNext` + `moduleNameMapper` en jest.config para los imports con extensión `.js`
- `pnpm.onlyBuiltDependencies: ["bcrypt"]` para que pnpm 10 compile el módulo nativo
