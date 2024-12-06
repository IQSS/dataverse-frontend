export class DateHelper {
  static toDisplayFormat(date: Date | undefined | string): string {
    if (!date) {
      return ''
    }

    if (typeof date === 'string') {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      const [year, month, day] = date.split('-')
      const monthIndex = monthNames[parseInt(month) - 1]
      const formattedDate = `${monthIndex} ${day}, ${year}`
      return formattedDate
    } else {
      return date.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
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
