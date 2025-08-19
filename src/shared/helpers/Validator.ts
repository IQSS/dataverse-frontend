export class Validator {
  static isValidEmail(email: string): boolean {
    const EMAIL_REGEX =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/
    return EMAIL_REGEX.test(email)
  }

  static isValidIdentifier(input: string): boolean {
    const IDENTIFIER_REGEX = /^[a-zA-Z0-9_-]+$/
    // Valid characters are a-Z, 0-9, '_', and '-'
    if (!IDENTIFIER_REGEX.test(input)) return false

    // Reject numeric-only identifiers (e.g., "3838")
    if (this.isNumberOnly(input)) return false

    return true
  }

  static isNumberOnly(input: string): boolean {
    const REGEX = /^\d+$/
    return REGEX.test(input)
  }

  static isValidUsername(input: string): boolean {
    const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{2,60}$/

    return USERNAME_REGEX.test(input)
  }

  static isValidNumber(input: string): boolean {
    const NUMBER_REGEX = /^\d+$/
    return NUMBER_REGEX.test(input)
  }
}
