import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface Machine {
  id: number;
  nombre: string;
  tipo: string;
  precioPorFicha: number;
  estado: string;
  ultimoMantenimiento: string;
}

async function main() {
  // Leer argumento --tipo
  const args = process.argv.slice(2);
  const tipoIndex = args.indexOf('--tipo');
  const tipoFiltro = tipoIndex !== -1 ? args[tipoIndex + 1] : null;

  // Leer archivo de datos
  const dataPath = path.resolve('data/machines.json');
  if (!existsSync(dataPath)) {
    console.error('Error: no se encontro el archivo data/machines.json');
    process.exit(1);
  }

  const raw = await readFile(dataPath, 'utf-8');
  const machines: Machine[] = JSON.parse(raw);

  // Resumen general
  const activas = machines.filter(m => m.estado === 'activa');
  const inactivas = machines.filter(m => m.estado === 'inactiva');
  const enMantenimiento = machines.filter(m => m.estado === 'mantenimiento');
  const promedio = machines.reduce((sum, m) => sum + m.precioPorFicha, 0) / machines.length;
  const masCara = machines.reduce((a, b) => a.precioPorFicha > b.precioPorFicha ? a : b);
  const masBarata = machines.reduce((a, b) => a.precioPorFicha < b.precioPorFicha ? a : b);

  console.log('\n=== SALA DE VIDEOJUEGOS / ARCADE ===');
  console.log(`Total de maquinas     : ${machines.length}`);
  console.log(`Activas               : ${activas.length}`);
  console.log(`Inactivas             : ${inactivas.length}`);
  console.log(`En mantenimiento      : ${enMantenimiento.length}`);
  console.log(`Precio promedio/ficha : $${promedio.toFixed(0)}`);
  console.log(`Maquina mas cara      : ${masCara.nombre} ($${masCara.precioPorFicha})`);
  console.log(`Maquina mas barata    : ${masBarata.nombre} ($${masBarata.precioPorFicha})`);

  // Filtro por tipo
  let resultado = machines;
  if (tipoFiltro) {
    const tipos = [...new Set(machines.map(m => m.tipo))];
    resultado = machines.filter(m => m.tipo.toLowerCase() === tipoFiltro.toLowerCase());
    if (resultado.length === 0) {
      console.warn(`\nAviso: el tipo "${tipoFiltro}" no existe.`);
      console.warn(`Tipos disponibles: ${tipos.join(', ')}`);
      process.exit(1);
    }
    console.log(`\nFiltro aplicado: ${tipoFiltro} (${resultado.length} maquinas)`);
  }

  // Generar reporte
  const reporte = {
    fecha: new Date().toISOString(),
    resumen: {
      total: machines.length,
      activas: activas.length,
      inactivas: inactivas.length,
      enMantenimiento: enMantenimiento.length,
      promedioPrecioPorFicha: parseFloat(promedio.toFixed(0)),
      maquinaMasCara: masCara.nombre,
      maquinaMasBarata: masBarata.nombre,
    },
    filtroAplicado: tipoFiltro ?? 'ninguno',
    maquinas: resultado,
  };

  if (!existsSync('output')) await mkdir('output');
  await writeFile('output/report.json', JSON.stringify(reporte, null, 2), 'utf-8');
  console.log('\nReporte guardado en output/report.json');
}

main();
