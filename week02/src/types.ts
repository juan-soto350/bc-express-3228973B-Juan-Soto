export interface Machine {
	id: number;
	nombre: string;
	tipo: string;
	precioPorFicha: number;
	estado: string; 
	ultimoMantenimiento: string;
}

export type CreateMachineDto = Omit<Machine, 'id'>;

export type UpdateMachineDto = Partial<CreateMachineDto>;

