import { DateFormats } from './MetadataBlockInfo'

export function isValidEmail(email: string): boolean {
  const EMAIL_REGEX =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/
  return EMAIL_REGEX.test(email)
}

export function isValidInteger(value: string): boolean {
  const INTEGER_REGEX = /^\d+$/
  return INTEGER_REGEX.test(value)
}

export function isValidFloat(value: string): boolean {
  const FLOAT_REGEX = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/
  return FLOAT_REGEX.test(value)
}

type AcceptedProtocols = 'http' | 'https' | 'ftp'
export function isValidURL(url: string, specificProtocols?: AcceptedProtocols[]): boolean {
  try {
    const urlObj = new URL(url)

    const acceptedProtocols: AcceptedProtocols[] = ['http', 'https', 'ftp']

    if (!acceptedProtocols.includes(urlObj.protocol.slice(0, -1) as AcceptedProtocols)) {
      return false
    }

    if (
      specificProtocols &&
      !specificProtocols.includes(urlObj.protocol.slice(0, -1) as AcceptedProtocols)
    ) {
      return false
    }

    if (!isValidHostname(urlObj.hostname)) {
      return false
    }

    return true
  } catch (_error) {
    return false
  }
}

function isValidHostname(hostname: string): boolean {
  const hostnameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return hostnameRegex.test(hostname)
}

export function isValidDateFormat(dateString: string, acceptedFormat?: DateFormats): boolean {
  // Regular expression for YYYY-MM-DD format
  const dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  // Regular expression for YYYY-MM format
  const yearMonthFormatRegex = /^\d{4}-(0[1-9]|1[0-2])$/
  // Regular expression for YYYY format
  const yearFormatRegex = /^\d{4}$/

  if (acceptedFormat) {
    if (acceptedFormat === 'YYYY-MM-DD') {
      return dateFormatRegex.test(dateString)
    }

    if (acceptedFormat === 'YYYY-MM') {
      return yearMonthFormatRegex.test(dateString)
    }

    return yearFormatRegex.test(dateString)
  } else {
    // Check if it matches any of the formats
    return (
      dateFormatRegex.test(dateString) ||
      yearMonthFormatRegex.test(dateString) ||
      yearFormatRegex.test(dateString)
    )
  }
}

/**
 * Extracts the invalid value from the error message, removing 'Validation Failed:' and everything after '(Invalid value:'
 * @param errorMessage
 * @returns the invalid value or null if it can't be extracted
 * @example
 * getValidationFailedFieldError("Validation Failed: Point of Contact E-mail test@test.c  is not a valid email address. (Invalid value:edu.harvard.iq.dataverse.DatasetFieldValueValue[ id=null ]).java.util.stream.ReferencePipeline$3@561b5200")
 * // returns "Point of Contact E-mail test@test.c  is not a valid email address."
 */

export function getValidationFailedFieldError(errorMessage: string): string | null {
  const validationFailedKeyword = 'Validation Failed:'
  const invalidValueKeyword = '(Invalid value:'

  const validationFailedKeywordIndex = errorMessage.indexOf(validationFailedKeyword)
  const invalidValueKeywordIndex = errorMessage.indexOf(invalidValueKeyword)

  if (validationFailedKeywordIndex !== -1 && invalidValueKeywordIndex !== -1) {
    const start = validationFailedKeywordIndex + validationFailedKeyword.length
    const end = invalidValueKeywordIndex
    const extractedValue = errorMessage.slice(start, end).trim()

    return extractedValue
  }

  return null
}
