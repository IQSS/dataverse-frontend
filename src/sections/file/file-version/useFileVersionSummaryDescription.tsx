import {
  FileDifferenceSummary,
  FileChangeType,
  FileMetadataChange,
  FileTagChange
} from '@/files/domain/models/FileVersionSummaryInfo'
import { useTranslation } from 'react-i18next'

export const useFileVersionSummaryDescription = (
  summary?: FileDifferenceSummary
): Record<string, string> | string => {
  const { t } = useTranslation('file')

  if (!summary) return t('fileNotIncluded')

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

      case 'FileAccess': {
        if (typeof value === 'string') {
          description['File Access'] = `${value}`
        }
        break
      }

      case 'FileMetadata': {
        const changes = value as FileMetadataChange[]
        const formatted = changes.map((change) => `${change.name} ${change.action}`).join(', ')
        if (formatted) {
          description['File Metadata'] = `${formatted}`
        }
        break
      }

      case 'FileTags': {
        const tagChanges: string[] = []
        if (typeof value === 'object' && value !== null) {
          const { Added, Deleted } = value as FileTagChange
          if (Added) tagChanges.push(`${Added} Added`)
          if (Deleted) tagChanges.push(`${Deleted} Removed`)
        }
        if (tagChanges.length >= 0) {
          description['File Tags'] = `${tagChanges.join(', ')}`
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
