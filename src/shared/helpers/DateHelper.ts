import i18n from '@/i18n'

export class DateHelper {
  static toDisplayFormat(date: Date): string {
    if (!date) {
      return ''
    }
    return date.toLocaleDateString(DateHelper.getActiveLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  static toDisplayFormatWithTime(date: Date | undefined): string {
    if (!date) {
      return ''
    }
    return date.toLocaleString(DateHelper.getActiveLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    })
  }

  static toDisplayFormatYYYYMMDD(date: Date | undefined): string {
    if (!date) {
      return ''
    }
    return date.toLocaleDateString(DateHelper.getActiveLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  static toISO8601Format(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private static getActiveLocale(): string | undefined {
    return i18n.resolvedLanguage || i18n.languages[0]
  }
}
