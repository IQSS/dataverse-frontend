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

type DateLikeKind = 'Y' | 'YM' | 'YMD' | 'AD' | 'BC' | 'BRACKET' | 'TIMESTAMP'

/** Stable error codes for i18n mapping */
export const dateKeyMessageErrorMap = {
  E_EMPTY: 'field.invalid.date.empty',
  E_AD_DIGITS: 'field.invalid.date.adDigits',
  E_AD_RANGE: 'field.invalid.date.adRange',
  E_BC_NOT_NUMERIC: 'field.invalid.date.bcNotNumeric',
  E_BRACKET_NEGATIVE: 'field.invalid.date.bracketNegative',
  E_BRACKET_NOT_NUM: 'field.invalid.date.bracketNotNumeric',
  E_BRACKET_RANGE: 'field.invalid.date.bracketRange',
  E_INVALID_MONTH: 'field.invalid.date.invalidMonth',
  E_INVALID_DAY: 'field.invalid.date.invalidDay',
  E_INVALID_TIME: 'field.invalid.date.invalidTime',
  E_UNRECOGNIZED: 'field.invalid.date.unrecognized'
} as const

type DateErrorCode = keyof typeof dateKeyMessageErrorMap

type Validation = { valid: true; kind: DateLikeKind } | { valid: false; errorCode: DateErrorCode }

export function isValidDateFormat(input: string): Validation {
  if (!input) return err('E_EMPTY')

  const s = input.trim()

  // 1) yyyy-MM-dd, yyyy-MM, yyyy
  if (isValidDateAgainstPattern(s, 'yyyy-MM-dd')) return ok('YMD')
  if (isValidDateAgainstPattern(s, 'yyyy-MM')) return ok('YM')
  if (isValidDateAgainstPattern(s, 'yyyy')) return ok('Y')

  // 2) Bracketed: starts "[" ends "?]" and not "[-"
  // 2) Bracketed: starts "[" ends "?]" and not "[-"
  if (s.startsWith('[') && s.endsWith('?]')) {
    if (s.startsWith('[-')) return err('E_BRACKET_NEGATIVE')

    const core = s
      .replace(/\[|\?\]|-|(?:AD|BC)/g, ' ')
      .trim()
      .replace(/\s+/g, ' ')

    if (s.includes('BC')) {
      if (!/^\d+$/.test(core)) return err('E_BRACKET_NOT_NUM')
      return ok('BRACKET')
    } else {
      if (!/^\d+$/.test(core)) return err('E_BRACKET_NOT_NUM')
      // AD/unspecified branch: valid 1–4 digit year between 0 and 9999
      if (!/^\d{1,4}$/.test(core)) return err('E_BRACKET_RANGE')
      if (!isValidDateAgainstPattern(core, 'yyyy')) return err('E_BRACKET_RANGE')
      return ok('BRACKET')
    }
  }

  /// 3) AD: strip AD (with or without space)
  if (s.includes('AD')) {
    const before = s.substring(0, s.indexOf('AD')).trim()

    // must be numeric
    if (!/^\d+$/.test(before)) return err('E_AD_DIGITS')

    // >4 digits or >9999 → range violation (choose one code; using E_AD_RANGE as you expect)
    if (before.length > 4 || Number(before) > 9999) return err('E_AD_RANGE')

    // final strict check mirroring Java's SimpleDateFormat("yyyy") + lenient(false)
    if (!isValidDateAgainstPattern(before, 'yyyy')) return err('E_AD_RANGE')

    return ok('AD')
  }

  // 4) BC: strip BC, numeric only (no explicit max in JSF)
  if (s.includes('BC')) {
    const before = s.substring(0, s.indexOf('BC')).trim()

    if (!/^\d+$/.test(before)) return err('E_BC_NOT_NUMERIC')

    return ok('BC')
  }

  // 5) Timestamp fallbacks (temporary)
  if (isValidDateAgainstPattern(s, "yyyy-MM-dd'T'HH:mm:ss")) return ok('TIMESTAMP')
  if (isValidDateAgainstPattern(s, "yyyy-MM-dd'T'HH:mm:ss.SSS")) return ok('TIMESTAMP')
  if (isValidDateAgainstPattern(s, 'yyyy-MM-dd HH:mm:ss')) return ok('TIMESTAMP')

  // Targeted error codes for common shapes
  if (/^\d+$/.test(s) && s.length > 4) return err('E_AD_RANGE')
  if (/^\d{4}-(\d{2})$/.test(s)) return err('E_INVALID_MONTH')
  if (/^\d{4}-(\d{2})-(\d{2})$/.test(s)) return err('E_INVALID_DAY')
  if (/^\d{4}-\d{2}-\d{2}T/.test(s) || /^\d{4}-\d{2}-\d{2} /.test(s)) return err('E_INVALID_TIME')

  return err('E_UNRECOGNIZED')
}

/* ---------------- Helpers (port of Java isValidDate with setLenient(false)) ---------------- */

function isValidDateAgainstPattern(dateString: string, pattern: string): boolean {
  if (!dateString) return false
  const s = dateString.trim()
  if (s.length > pattern.length) return false

  switch (pattern) {
    case 'yyyy': {
      if (!/^\d{1,4}$/.test(s)) return false
      const year = Number(s)
      return year >= 0 && year <= 9999
    }
    case 'yyyy-MM': {
      const m = /^(\d{1,4})-(\d{2})$/.exec(s)
      if (!m) return false
      const year = Number(m[1])
      const month = Number(m[2])
      if (!(year >= 0 && year <= 9999)) return false
      return month >= 1 && month <= 12
    }
    case 'yyyy-MM-dd': {
      const m = /^(\d{1,4})-(\d{2})-(\d{2})$/.exec(s)
      if (!m) return false
      const year = Number(m[1])
      const month = Number(m[2])
      const day = Number(m[3])
      if (!(year >= 0 && year <= 9999)) return false
      if (!(month >= 1 && month <= 12)) return false
      const dim = daysInMonth(year, month)
      return day >= 1 && day <= dim
    }
    case "yyyy-MM-dd'T'HH:mm:ss": {
      const m = /^(\d{1,4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(s)

      if (!m) return false

      const [, y, mo, d, hh, mm, ss] = m

      if (!isValidDateAgainstPattern(`${y}-${mo}-${d}`, 'yyyy-MM-dd')) return false

      return isValidHMS(hh, mm, ss)
    }
    case "yyyy-MM-dd'T'HH:mm:ss.SSS": {
      const m = /^(\d{1,4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/.exec(s)

      if (!m) return false

      const [, y, mo, d, hh, mm, ss, ms] = m

      if (!isValidDateAgainstPattern(`${y}-${mo}-${d}`, 'yyyy-MM-dd')) return false

      return isValidHMS(hh, mm, ss) && /^\d{3}$/.test(ms)
    }
    case 'yyyy-MM-dd HH:mm:ss': {
      const m = /^(\d{1,4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(s)

      if (!m) return false

      const [, y, mo, d, hh, mm, ss] = m

      if (!isValidDateAgainstPattern(`${y}-${mo}-${d}`, 'yyyy-MM-dd')) return false

      return isValidHMS(hh, mm, ss)
    }
    default:
      return false
  }
}

function isValidHMS(hh: string, mm: string, ss: string): boolean {
  const H = Number(hh),
    M = Number(mm),
    S = Number(ss)
  return H >= 0 && H <= 23 && M >= 0 && M <= 59 && S >= 0 && S <= 59
}

// prettier-ignore
function daysInMonth(y: number, m: number): number {
  switch (m) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12: return 31
    case 4: case 6: case 9: case 11: return 30
    case 2: return isLeapYear(y) ? 29 : 28
    default: return 0
  }
}

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function ok(kind: DateLikeKind): Validation {
  return { valid: true, kind }
}
function err(code: DateErrorCode): Validation {
  return { valid: false, errorCode: code }
}
