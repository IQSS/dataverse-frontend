import {
  FileDifferenceSummary,
  FileChangeType,
  FileMetadataChange
} from '@/files/domain/models/FileVersionSummaryInfo'
import { useTranslation } from 'react-i18next'

export const useFileVersionSummaryDescription = (
  summary?: FileDifferenceSummary
): Record<string, string> | string => {
  const { t } = useTranslation('file')

  if (!summary || !Object.entries(summary).length) return t('fileNotChange')

  const description: Record<string, string> = {}

  Object.entries(summary).forEach(([key, value]) => {
    switch (key) {
      case 'file': {
        if (value as FileChangeType) {
          if (typeof value === 'string') {
            description['file'] = `[File ${value}]`
          }
        }
        break
      }

      case 'fileAccess': {
        if (typeof value === 'string') {
          description['File Access'] = `${value}`
        }
        break
      }

      case 'fileMetadata': {
        const changes = value as FileMetadataChange[]
        const formatted = changes.map((change) => `${change.name} ${change.action}`).join(', ')
        if (formatted) {
          description['File Metadata'] = `${formatted}`
        }
        break
      }
      case 'fileTags': {
        const tagChanges: string[] = []
        if (typeof value === 'object' && value !== null) {
          Object.entries(value as Record<FileChangeType, number>).forEach(([changeType, count]) => {
            if (count > 0) {
              tagChanges.push(`${count} ${changeType}`)
            }
          })
        }
        if (tagChanges.length > 0) {
          description['File Tags'] = tagChanges.join(', ')
        }
        break
      }

      case 'deaccessionedReason': {
        description['Deaccessioned Reason'] = typeof value === 'string' ? value : ''
        break
      }
    }
  })
  return description
}
