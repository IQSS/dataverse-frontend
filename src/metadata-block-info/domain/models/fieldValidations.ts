import { DateFormats } from './MetadataBlockInfo'

export function isValidEmail(email: string): boolean {
  const EMAIL_REGEX =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
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

/**
 *  Check if the URL is valid
 * @param url The URL to validate
 * @param specificProtocols The specific protocols that the URL could have - optional, could be 'http' | 'https' | 'ftp' or a combination of them
 * @returns boolean
 * @example
 * isValidURL('https://www.google.com') // true
 * isValidURL('http://www.google.com', ['https']) // false
 */
type AcceptedProtocols = 'http' | 'https' | 'ftp'
export function isValidURL(url: string, specificProtocols?: AcceptedProtocols[]): boolean {
  try {
    const urlObj = new URL(url)

    const acceptedProtocols: AcceptedProtocols[] = ['http', 'https', 'ftp']

    // First check if the protocol is one of the accepted
    if (!acceptedProtocols.includes(urlObj.protocol.slice(0, -1) as AcceptedProtocols)) {
      return false // Protocol not accepted
    }

    // Check if specific protocols are passed and if the URL has one of them
    if (
      specificProtocols &&
      !specificProtocols.includes(urlObj.protocol.slice(0, -1) as AcceptedProtocols)
    ) {
      return false // Protocol not accepted
    }

    // Check for valid hostname
    if (!isValidHostname(urlObj.hostname)) {
      return false
    }

    return true
  } catch (_error) {
    return false
  }
}

function isValidHostname(hostname: string): boolean {
  // Use regex to check for valid hostname format
  const hostnameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return hostnameRegex.test(hostname)
}

/**
 * Validates that string is specific format passed as argument otherwise that matches any of 'YYYY-MM-DD' | 'YYYY-MM' | 'YYYY'
 * @param dateString The date string to validate
 * @param acceptedFormat  The accepted format for the date string ('YYYY-MM-DD' | 'YYYY-MM' | 'YYYY') - optional
 * @returns boolean
 * @example
 * isValidDateFormat('2021-01-01') // true
 * isValidDateFormat('2021-01-01', 'YYYY-MM-DD') // true
 * isValidDateFormat('2021-01') // true
 * isValidDateFormat('2021-01', 'YYYY-MM') // true
 * isValidDateFormat('2021') // true
 * isValidDateFormat('2021', 'YYYY') // true
 * isValidDateFormat('2021-01-01', 'YYYY-MM') // false
 * isValidDateFormat('2021-01-01', 'YYYY') // false
 * isValidDateFormat('2021-01', 'YYYY-MM-DD') // false
 */
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
