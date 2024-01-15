export class DateHelper {
  static toDisplayFormat(date: Date): string {
    return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  static toDisplayFormatYYYYMMDD(date: Date): string {
    return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}
