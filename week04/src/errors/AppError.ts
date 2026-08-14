// ============================================
// ERRORS — AppError (errores operacionales del dominio)
// ============================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// Type guard para diferenciar errores del dominio
export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
