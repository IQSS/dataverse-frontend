export class DateHelper {
  static toDisplayFormat(date: Date): string {
    if (!date) {
      return ''
    }
    return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  static toDisplayFormatYYYYMMDD(date: Date | undefined): string {
    if (!date) {
      return ''
    }
    return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  static toISO8601Format(date: Date): string {
    return date.toISOString().split('T')[0]
  }
}
