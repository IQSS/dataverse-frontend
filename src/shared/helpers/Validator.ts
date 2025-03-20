export class Validator {
  static isValidEmail(email: string): boolean {
    const EMAIL_REGEX =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/
    return EMAIL_REGEX.test(email)
  }

  static isValidIdentifier(input: string): boolean {
    const IDENTIFIER_REGEX = /^[a-zA-Z0-9_-]+$/
    return IDENTIFIER_REGEX.test(input)
  }

  static isValidNumber(input: string): boolean {
    const NUMBER_REGEX = /^\d+$/
    return NUMBER_REGEX.test(input)
  }
}
