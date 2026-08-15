
import type {Machine, CreateMachineDto, UpdateMachineDto} from './types.js';

const machines : Machine[] = [
	{ id: 1, nombre: 'Street Fighter II', tipo: 'Pelea', precioPorFicha: 500, estado: 'activa', ultimoMantenimiento: '2025-01-10' },
  { id: 2, nombre: 'Pac-Man', tipo: 'Clasico', precioPorFicha: 300, estado: 'activa', ultimoMantenimiento: '2025-02-01' },
  { id: 3, nombre: 'Tekken 7', tipo: 'Pelea', precioPorFicha: 600, estado: 'activa', ultimoMantenimiento: '2025-04-05' },
  { id: 4, nombre: 'Dance Dance Revolution', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-28' },
  { id: 5, nombre: 'Initial D', tipo: 'Carreras', precioPorFicha: 800, estado: 'inactiva', ultimoMantenimiento: '2025-04-10' },
];

let nextId = 6;

export function getAll(): Machine[] {
	return machines;
}

export function getById(id: number): Machine | undefined {
	return machines.find(m => m.id === id);
}

export function create(data : CreateMachineDto): Machine {
	const newMachine: Machine = {id: nextId++, ...data};
	machines.push(newMachine)
	return newMachine;
}

export function update(id: number, data : UpdateMachineDto): Machine | undefined {
	const index = machines.findIndex(m => m.id === id);
	if (index === -1) return undefined;
	machines[index] = { ...machines[index], ...data } as Machine;
	return machines[index];
}

export function remove(id: number): boolean {
	const index = machines.findIndex(m => m.id === id);
	if (index === -1) return false;
        machines.splice(index, 1);
        return true;
}

