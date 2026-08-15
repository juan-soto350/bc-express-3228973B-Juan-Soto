import { Router } from 'express';
import * as store from '../store.js';
import type { CreateMachineDto, UpdateMachineDto } from '../types.js';

export const machineRouter: Router = Router();

machineRouter.get('/', async (_req, res) => {
	const machines = store.getAll();
	res.status(200).json(machines);
});

machineRouter.get('/:id', async (_req, res) => {
	const id = Number(_req.params.id);
	const machine = store.getById(id);
	if (!machine) {
		res.status(404).json({ message: `Maquina con id: ${id} no encontrada` });
		return;
	}
	res.status(200).json(machine);
});

machineRouter.post('/', async (req, res) => {
	const data: CreateMachineDto = req.body
	const newMachine = store.create(data);
	res.status(201).json(newMachine);
});

machineRouter.put('/:id', async (req, res) => {
	const id = Number(req.params.id);
	const data: UpdateMachineDto = req.body;
	const updated = store.update(id, data);
	if(!updated) {
		res.status(404).json({ message: `Maquina con id ${id} no encontrada`});
		return;
	}
	res.status(200).json(updated);
});

machineRouter.delete('/:id', async (req, res) => {
	const id = Number(req.params.id);
	const deleted = store.remove(id);
	if(!deleted) {
		res.status(404).json({ message: `Maquina con id ${id} no encontrada`});
		return;
	}
	res.status(204).send();	
});
