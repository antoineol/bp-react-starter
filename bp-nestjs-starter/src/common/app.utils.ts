export class ErrorWithStatus extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export function errWithStatus(message: string, status: number): ErrorWithStatus {
  return new ErrorWithStatus(message, status);
}
