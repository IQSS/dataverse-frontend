export class SignUpError extends Error {
  readonly fieldErrors: Record<string, string>

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'SignUpError'
    this.fieldErrors = fieldErrors
  }
}
