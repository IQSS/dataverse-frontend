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

  public isBearerTokenValidatedButNoLinkedUserAccountError(): boolean {
    const formattedError: string = this.getReasonWithoutStatusCode() ?? this.getErrorMessage()

    const statusCode: number | null = this.getStatusCode()

    if (statusCode === 403 && formattedError === BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE) {
      return true
    }

    return false
  }
}
