# 🕹️ Semana 07 — API de Sala de Arcade con Autenticación JWT

## Descripción

API REST para la gestión de **máquinas arcade** de una sala de videojuegos, con sistema de autenticación completo usando **bcrypt**, **JWT** (access + refresh tokens) y **cookies HttpOnly**.

### Dominio: Sala de Videojuegos / Arcade

- **Máquinas arcade** — recurso principal CRUD
- **Jugadores** (players) — usuarios que usan las máquinas
- **Fichas** (tokens) — moneda virtual para jugar
- **Mantenimiento** — seguimiento de reparaciones

## Endpoints de Autenticación

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/v1/auth/register` | Registrar usuario | No |
| POST | `/api/v1/auth/login` | Iniciar sesión (emite cookies) | No |
| GET | `/api/v1/auth/me` | Obtener perfil del usuario | Sí |
| POST | `/api/v1/auth/refresh` | Renovar access token | No (usa cookie refresh) |
| POST | `/api/v1/auth/logout` | Cerrar sesión (invalida tokens) | Sí |

## Endpoints de Máquinas (CRUD)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/machines` | Listar todas las máquinas |
| GET | `/api/v1/machines/:id` | Obtener una máquina por ID |
| POST | `/api/v1/machines` | Crear una nueva máquina |
| PATCH | `/api/v1/machines/:id` | Actualizar una máquina |
| DELETE | `/api/v1/machines/:id` | Eliminar una máquina |

> Todas las rutas de máquinas requieren autenticación (cookie `accessToken`).

## Modelo de Máquina

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre de la máquina arcade |
| fabricante | String | Fabricante (ej: Sega, Namco, Capcom) |
| anio | Number | Año de fabricación |
| tipoJuego | Enum | lucha, carreras, puzzle, shooter, plataformas, retro, otro |
| estado | Enum | operativa, en_reparacion, retirada |
| ubicacion | String | Ubicación en la sala |
| tarifaPorHora | Number | Costo por hora de juego |
| disponible | Boolean | Si está disponible para uso |
| agregadoPor | ObjectId | Referencia al usuario que la agregó |

## Stack Tecnológico

- **Runtime:** Node.js >= 22
- **Framework:** Express 5 + TypeScript
- **Base de datos:** MongoDB 7 (Mongoose 9)
- **Autenticación:** bcrypt + JWT (access 15min / refresh 7d)
- **Validación:** Zod 4
- **Cookies:** cookie-parser (HttpOnly, secure, sameSite)

## Configuración y Ejecución

```bash
# 1. Instalar dependencias
cd starter
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con secretos generados:
#   openssl rand -base64 64  (generar uno para JWT_ACCESS_SECRET)
#   openssl rand -base64 64  (generar otro para JWT_REFRESH_SECRET)

# 3. Levantar MongoDB
docker compose up -d

# 4. Ejecutar en modo desarrollo
pnpm dev
```

## Flujo de Uso

1. **Registrar** → `POST /api/v1/auth/register` con email, password y name
2. **Login** → `POST /api/v1/auth/login` → recibe cookies HttpOnly con tokens
3. **Crear máquina** → `POST /api/v1/machines` con datos de la máquina
4. **Listar** → `GET /api/v1/machines`
5. **Actualizar** → `PATCH /api/v1/machines/:id`
6. **Eliminar** → `DELETE /api/v1/machines/:id`
7. **Renovar token** → `POST /api/v1/auth/refresh` (usa cookie refreshToken)
8. **Cerrar sesión** → `POST /api/v1/auth/logout` (invalida tokens)

## Criterios de Seguridad Implementados

- ✅ Contraseñas hasheadas con bcrypt (salt rounds = 10)
- ✅ Secretos JWT distintos para access y refresh (en `.env`)
- ✅ Tokens en cookies HttpOnly (no en localStorage)
- ✅ Refresh token hasheado en DB (nunca el token en claro)
- ✅ Rotación de refresh token en cada `/refresh`
- ✅ Mismo mensaje de error para email no encontrado vs contraseña incorrecta
- ✅ Middleware verifica expiración del token
