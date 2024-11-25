import { ReadError } from '@iqss/dataverse-client-javascript'
import { BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE } from '@/sections/session/SessionProvider'

export class JSDataverseReadErrorHandler {
  private error: ReadError

  constructor(error: ReadError) {
    this.error = error
  }

  public getErrorMessage(): string {
    return this.error.message
  }

  public getReason(): string | null {
    // Reason comes after "Reason was: "
    const reasonMatch = this.error.message.match(/Reason was: (.*)/)
    return reasonMatch ? reasonMatch[1] : null
  }

  public getStatusCode(): number | null {
    // Status code comes inside [] brackets
    const statusCodeMatch = this.error.message.match(/\[(\d+)\]/)
    return statusCodeMatch ? parseInt(statusCodeMatch[1]) : null
  }

  public getReasonWithoutStatusCode(): string | null {
    const reason = this.getReason()
    if (!reason) return null

    const statusCode = this.getStatusCode()
    if (statusCode === null) return reason

    // Remove status code from reason
    return reason.replace(`[${statusCode}]`, '').trim()
  }

  public static isBearerTokenValidatedButNoLinkedUserAccountError(err: unknown): boolean {
    if (err instanceof ReadError) {
      const errorHandler = new JSDataverseReadErrorHandler(err)

      const formattedError: string =
        errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()

      const statusCode: number | null = errorHandler.getStatusCode()

      if (statusCode === 403 && formattedError === BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE) {
        return true // Return true if the specific error is detected
      }
    }

    return false // Return false if no match
  }
}
