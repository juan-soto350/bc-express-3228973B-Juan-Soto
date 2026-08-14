// src/types.ts — Contratos de respuesta genéricos
// NOTA: los tipos de las entidades (Machine, Maintenance, Player, Token)
// se importan directamente de @prisma/client (no se duplican aquí).

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}
