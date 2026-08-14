// prisma/seed.ts — Datos iniciales del dominio Arcade
// Ejecutar con: pnpm db:seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // Idempotencia: limpiar en orden inverso a las dependencias
  await prisma.token.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.player.deleteMany();
  await prisma.machine.deleteMany();

  // --- Máquinas (recurso principal) ---
  const machines = await prisma.machine.createMany({
    data: [
      { codigo: 'MAC-001', nombre: 'Street Fighter II', tipo: 'Pelea', precioPorFicha: 500, estado: 'activa', ultimoMantenimiento: '2025-01-10' },
      { codigo: 'MAC-002', nombre: 'Pac-Man', tipo: 'Clasico', precioPorFicha: 300, estado: 'activa', ultimoMantenimiento: '2025-02-01' },
      { codigo: 'MAC-003', nombre: 'Mortal Kombat', tipo: 'Pelea', precioPorFicha: 500, estado: 'mantenimiento', ultimoMantenimiento: '2025-03-15' },
      { codigo: 'MAC-004', nombre: 'Space Invaders', tipo: 'Clasico', precioPorFicha: 300, estado: 'inactiva', ultimoMantenimiento: '2024-11-20' },
      { codigo: 'MAC-005', nombre: 'Tekken 7', tipo: 'Pelea', precioPorFicha: 600, estado: 'activa', ultimoMantenimiento: '2025-04-05' },
      { codigo: 'MAC-006', nombre: 'Dance Dance Revolution', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-28' },
      { codigo: 'MAC-007', nombre: 'Initial D', tipo: 'Carreras', precioPorFicha: 800, estado: 'activa', ultimoMantenimiento: '2025-04-10' },
      { codigo: 'MAC-008', nombre: 'Guitar Hero Arcade', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-20' },
    ],
  });
  console.log(`✅ ${machines.count} máquinas creadas`);

  // --- Jugadores ---
  const players = await prisma.player.createMany({
    data: [
      { alias: 'carlosr', nombre: 'Carlos Ramirez', edad: 22, nivel: 'intermedio' },
      { alias: 'anatorres', nombre: 'Ana Torres', edad: 19, nivel: 'principiante' },
      { alias: 'luism', nombre: 'Luis Mendoza', edad: 30, nivel: 'experto' },
    ],
  });
  console.log(`✅ ${players.count} jugadores creados`);

  // --- Mantenimientos (relación 1:N con Machine) ---
  const sf = await prisma.machine.findFirst({ where: { nombre: 'Street Fighter II' } });
  const mk = await prisma.machine.findFirst({ where: { nombre: 'Mortal Kombat' } });
  const ddr = await prisma.machine.findFirst({ where: { nombre: 'Dance Dance Revolution' } });
  const id = await prisma.machine.findFirst({ where: { nombre: 'Initial D' } });

  if (sf && mk && ddr && id) {
    const maintenance = await prisma.maintenance.createMany({
      data: [
        { machineId: sf.id, tecnico: 'Jorge Peña', descripcion: 'Cambio de palancas y botones del panel', fecha: '2025-03-14', costo: 150000 },
        { machineId: mk.id, tecnico: 'Lucía Ferrer', descripcion: 'Reparación de pantalla CRT y ajuste de sonido', fecha: '2025-02-12', costo: 220000 },
        { machineId: ddr.id, tecnico: 'Andrés Vidal', descripcion: 'Reposición de tapetes de baile y sensores', fecha: '2025-03-25', costo: 310000 },
        { machineId: id.id, tecnico: 'Lucía Ferrer', descripcion: 'Calibración de volante y pedales', fecha: '2025-04-08', costo: 130000 },
        { machineId: sf.id, tecnico: 'Andrés Vidal', descripcion: 'Lubricación de joysticks y limpieza interna', fecha: '2025-01-08', costo: 90000 },
      ],
    });
    console.log(`✅ ${maintenance.count} mantenimientos creados`);
  }

  // --- Fichas (relación N:1 con Machine y Player) ---
  const carlos = await prisma.player.findFirst({ where: { alias: 'carlosr' } });
  const ana = await prisma.player.findFirst({ where: { alias: 'anatorres' } });
  const luis = await prisma.player.findFirst({ where: { alias: 'luism' } });
  const pacman = await prisma.machine.findFirst({ where: { nombre: 'Pac-Man' } });
  const tekken = await prisma.machine.findFirst({ where: { nombre: 'Tekken 7' } });
  const gh = await prisma.machine.findFirst({ where: { nombre: 'Guitar Hero Arcade' } });

  if (carlos && ana && luis && pacman && tekken && gh) {
    const tokens = await prisma.token.createMany({
      data: [
        { codigo: 'TKN-0001', cantidad: 5, estado: 'activo', machineId: pacman.id, playerId: carlos.id },
        { codigo: 'TKN-0002', cantidad: 10, estado: 'activo', machineId: tekken.id, playerId: ana.id },
        { codigo: 'TKN-0003', cantidad: 15, estado: 'usado', machineId: gh.id, playerId: luis.id },
      ],
    });
    console.log(`✅ ${tokens.count} fichas creadas`);
  }

  console.log('🌱 Seed completado.');
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
