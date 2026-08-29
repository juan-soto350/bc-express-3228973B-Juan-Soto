# 🕹️ Semana 08 — API de Sala de Arcade con Autorización y Seguridad

## Descripción

API REST para la gestión de **máquinas arcade** con sistema de autenticación JWT + **RBAC** (Role-Based Access Control) + capas de seguridad HTTP: **Helmet**, **CORS** con whitelist, **rate limiting** y **sanitización de inputs**.

### Dominio: Sala de Videojuegos / Arcade

- **Máquinas arcade** — recurso principal CRUD
- Roles: `user` (jugador), `admin` (gestor de sala), `operador` (técnico)

---

## 🔐 Tabla de Roles y Permisos

| Rol | Ver catálogo | Crear máquina | Editar máquina | Eliminar máquina |
|-----|:---:|:---:|:---:|:---:|
| Sin autenticación | ✅ | ❌ | ❌ | ❌ |
| `user` | ✅ | ✅ | Solo las suyas | ❌ |
| `admin` | ✅ | ✅ | Todas | ✅ |

---

## 📡 Endpoints

### Autenticación

| Método | Ruta | Acceso | Rate Limit |
|--------|------|--------|------------|
| POST | `/api/v1/auth/register` | Público | 5 req/15min |
| POST | `/api/v1/auth/login` | Público | 5 req/15min |
| POST | `/api/v1/auth/refresh` | Cookie | — |
| POST | `/api/v1/auth/logout` | Autenticado | — |
| GET | `/api/v1/auth/me` | Autenticado | — |

### Usuarios

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/v1/users/dashboard` | Autenticado |

### Máquinas Arcade (CRUD)

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/v1/machines` | Público |
| GET | `/api/v1/machines/:id` | Público |
| POST | `/api/v1/machines` | Autenticado |
| PATCH | `/api/v1/machines/:id` | Autenticado (dueño o admin) |
| DELETE | `/api/v1/machines/:id` | Solo admin |

---

## 🛡️ Capas de Seguridad Implementadas

| Capa | Herramienta | Configuración |
|------|-------------|---------------|
| Cabeceras HTTP | Helmet | CSP, HSTS, X-Content-Type-Options, X-Frame-Options |
| CORS | express cors | Whitelist: localhost:5173, localhost:3001 |
| Rate Limit Global | express-rate-limit | 100 req / 15 min |
| Rate Limit Auth | express-rate-limit | 5 req / 15 min |
| Sanitización NoSQL | express-mongo-sanitize | Rechaza `{ "$gt": "" }` en inputs |
| Validación XSS | Zod | Regex `^[^<>]*$` en campos de texto |
| RBAC | requireRole() | Middleware reutilizable para proteger por rol |
| Error Handler | AppError | Sin stack traces expuestos en errores 500 |

---

## 🏗️ Stack Tecnológico

- **Runtime:** Node.js >= 22
- **Framework:** Express 5 + TypeScript
- **Base de datos:** MongoDB 7 (Mongoose 9)
- **Autenticación:** bcrypt + JWT (access 15min / refresh 7d)
- **Seguridad:** Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Validación:** Zod 4

---

## 🚀 Configuración y Ejecución

```bash
cd starter
pnpm install
cp .env.example .env
# Editar .env con secretos generados:
#   openssl rand -base64 64  (generar uno para JWT_ACCESS_SECRET)
#   openssl rand -base64 64  (generar otro para JWT_REFRESH_SECRET)

docker compose up -d
pnpm dev
```

### Usuarios de prueba (seed automático)

| Email | Password | Rol |
|-------|----------|-----|
| user@test.com | User1234! | user |
| admin@test.com | Admin1234! | admin |

---

## 📋 Flujo de Uso

1. **Login** → `POST /api/v1/auth/login` → obtener `accessToken`
2. **Usar token** → Header `Authorization: Bearer <token>`
3. **Ver catálogo** → `GET /api/v1/machines` (público)
4. **Crear máquina** → `POST /api/v1/machines` (autenticado)
5. **Editar máquina** → `PATCH /api/v1/machines/:id` (dueño o admin)
6. **Eliminar máquina** → `DELETE /api/v1/machines/:id` (solo admin)
7. **Verificar 401** → Request sin token → `"Authorization header missing"`
8. **Verificar 403** → Token de `user` en ruta admin → `"Access denied"`

---

## 🔒 Criterios de OWASP Top 10 Mitigados

| OWASP | Vulnerabilidad | Mitigación |
|-------|---------------|------------|
| A01 | Broken Access Control | RBAC con `requireRole()` + verificación de ownership |
| A02 | Cryptographic Failures | bcrypt (salt 12) + JWT con secretos en `.env` |
| A03 | Injection | `express-mongo-sanitize` + validación Zod |
| A04 | Insecure Design | Roles diferenciados, least privilege |
| A05 | Security Misconfiguration | Helmet, CORS whitelist, rate limiting |
| A07 | XSS | Zod regex `^[^<>]*$` + Helmet CSP |
