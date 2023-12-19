export class DateHelper {
  static toDisplayFormat(date: Date): string {
    return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}
