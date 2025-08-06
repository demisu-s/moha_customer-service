export class CustomError extends Error {
  constructor(
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "CustomError";
  }
}
