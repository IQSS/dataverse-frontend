import { WriteError } from '@iqss/dataverse-client-javascript'

export class JSDataverseWriteErrorHandler {
  private error: WriteError

  constructor(error: WriteError) {
    this.error = error
  }

  public getErrorMessage(): string {
    return this.error.message
  }

  public getReason(): string | null {
    // Reason comes after "Reason was: "
    const reasonMatch = this.error.message.match(/Reason was: (.*)/)
    console.log({ reasonMatch })
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
}
