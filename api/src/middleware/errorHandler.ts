import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  // Unique constraint violation from better-sqlite3
  if (err.message?.includes('UNIQUE constraint failed')) {
    res.status(409).json({ error: { message: 'This relationship already exists' } });
    return;
  }

  res.status(500).json({ error: { message: 'Internal server error' } });
}
