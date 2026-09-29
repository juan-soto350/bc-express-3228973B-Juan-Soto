// ============================================================
// INTEGRATION TESTS — machines routes (dominio: Arcade)
// ============================================================
// Ciclo completo HTTP → middleware → controller → service →
// MongoDB Memory Server. Sin mocks de la capa de servicio.
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';

const BASE = '/api/v1/machines';

const validMachine = {
  nombre: 'Pac-Man',
  fabricante: 'Namco',
  anio: 1980,
  tipoJuego: 'retro',
  estado: 'operativa',
  ubicacion: 'Zona A',
  tarifaPorHora: 3000,
  disponible: true,
};

let mongod: MongoMemoryServer;
let userToken: string;
let adminToken: string;

beforeAll(async () => {
  // Crear una instancia de MongoDB en RAM
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // Registrar usuarios (normal y admin) y obtener sus tokens
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'User', email: 'user@arcade.com', password: 'Password1!' });
  const userLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'user@arcade.com', password: 'Password1!' });
  userToken = userLogin.body.accessToken;

  const registerAdmin = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Admin', email: 'admin@arcade.com', password: 'Password1!' });
  expect(registerAdmin.status).toBe(201);
  const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@arcade.com', password: 'Password1!' });
  adminToken = adminLogin.body.accessToken;

  // Promover al segundo usuario a admin directamente en la DB
  await mongoose.connection
    .collection('users')
    .updateOne({ email: 'admin@arcade.com' }, { $set: { role: 'admin' } });
  const adminLogin2 = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@arcade.com', password: 'Password1!' });
  adminToken = adminLogin2.body.accessToken;
});

afterEach(async () => {
  // Limpiar las máquinas entre tests; los usuarios se conservan
  // (los tokens de beforeAll siguen válidos para el siguiente test)
  await mongoose.connection.collection('machines').deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// ============================================================
// GET /api/v1/machines
// ============================================================
describe('GET /api/v1/machines', () => {
  it('should return 200 and empty array initially', async () => {
    const res = await request(app).get(BASE);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });
});

// ============================================================
// POST /api/v1/machines
// ============================================================
describe('POST /api/v1/machines', () => {
  it('should return 201 with valid data and token', async () => {
    const res = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      nombre: 'Pac-Man',
      fabricante: 'Namco',
      tipoJuego: 'retro',
    });
  });

  it('should return 401 without token', async () => {
    const res = await request(app).post(BASE).send(validMachine);

    expect(res.status).toBe(401);
  });

  it('should return 422 with invalid data (Zod)', async () => {
    const res = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'X' }); // faltan campos obligatorios

    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Validation error');
  });

  it('should return 409 when machine name is duplicated', async () => {
    await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    const res = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...validMachine, fabricante: 'Otra' });

    expect(res.status).toBe(409);
  });
});

// ============================================================
// GET /api/v1/machines/:id
// ============================================================
describe('GET /api/v1/machines/:id', () => {
  it('should return 200 with existing machine', async () => {
    const created = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    const res = await request(app).get(`${BASE}/${created.body.data._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe('Pac-Man');
  });

  it('should return 404 with non-existent ID', async () => {
    // Un ObjectID de 24 hex válido pero inexistente
    const res = await request(app).get(`${BASE}/aaaaaaaaaaaaaaaaaaaaaaaa`);

    expect(res.status).toBe(404);
  });
});

// ============================================================
// PUT /api/v1/machines/:id
// ============================================================
describe('PUT /api/v1/machines/:id', () => {
  it('should return 200 when owner updates', async () => {
    const created = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    const res = await request(app)
      .put(`${BASE}/${created.body.data._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ tarifaPorHora: 5000 });

    expect(res.status).toBe(200);
    expect(res.body.data.tarifaPorHora).toBe(5000);
  });

  it('should return 403 when non-owner (non-admin) tries to update', async () => {
    // El admin crea su propia máquina; el user normal intenta editarla
    const created = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validMachine);

    const res = await request(app)
      .put(`${BASE}/${created.body.data._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ tarifaPorHora: 1 });

    expect(res.status).toBe(403);
  });
});

// ============================================================
// DELETE /api/v1/machines/:id — solo admin (authorize('admin'))
// ============================================================
describe('DELETE /api/v1/machines/:id', () => {
  it('should return 204 when admin deletes', async () => {
    const created = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    const res = await request(app)
      .delete(`${BASE}/${created.body.data._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(204);

    const check = await request(app).get(`${BASE}/${created.body.data._id}`);
    expect(check.status).toBe(404);
  });

  it('should return 403 when a non-admin tries to delete', async () => {
    const created = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    const res = await request(app)
      .delete(`${BASE}/${created.body.data._id}`)
      .set('Authorization', `Bearer ${userToken}`); // dueño pero NO admin

    expect(res.status).toBe(403);
  });

  it('should return 401 without token', async () => {
    const created = await request(app)
      .post(BASE)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validMachine);

    const res = await request(app).delete(`${BASE}/${created.body.data._id}`);

    expect(res.status).toBe(401);
  });
});

// ============================================================
// Auth routes — verificación rápida del flujo de autenticación
// ============================================================
describe('GET /api/v1/auth/me', () => {
  it('should return 200 with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('user@arcade.com');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
  });
});

export {};
