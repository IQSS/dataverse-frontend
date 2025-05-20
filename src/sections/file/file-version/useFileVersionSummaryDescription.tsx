import { useTranslation } from 'react-i18next'
import {
  FileDifferenceSummary,
  FileChangeType,
  FileMetadataChange
} from '@/files/domain/models/FileVersionSummaryInfo'

export const useFileVersionSummaryDescription = (
  summary?: FileDifferenceSummary
): Record<string, string> | string => {
  const { t } = useTranslation('file')

  if (!summary || !Object.entries(summary).length) return t('fileVersion.noChange')

  const description: Record<string, string> = {}

  Object.entries(summary).forEach(([key, value]) => {
    switch (key) {
      case 'file': {
        if (typeof value === 'string') {
          description[t('fileVersion.file')] = t('fileVersion.fileChanged', { name: value })
        }
        break
      }

      case 'fileAccess': {
        if (typeof value === 'string') {
          description[t('fileVersion.access')] = t(`fileVersion.accessChanged`, { access: value })
        }
        break
      }

      case 'fileMetadata': {
        const changes = value as FileMetadataChange[]
        const formatted = changes
          .map((change) =>
            t(`fileVersion.metadataChange`, {
              field: change.name,
              action: t(`fileVersion.actions.${change.action}`)
            })
          )
          .join(', ')
        if (formatted) {
          description[t('fileVersion.metadata')] = formatted
        }
        break
      }

      case 'fileTags': {
        const tagChanges: string[] = []
        if (typeof value === 'object' && value !== null) {
          Object.entries(value as Record<FileChangeType, number>).forEach(([changeType, count]) => {
            if (count > 0) {
              tagChanges.push(
                t(`fileVersion.tagsChange`, {
                  count,
                  action: t(`fileVersion.actions.${changeType}`)
                })
              )
            }
          })
        }
        if (tagChanges.length > 0) {
          description[t('fileVersion.tags')] = tagChanges.join(', ')
        }
        break
      }

      case 'deaccessionedReason': {
        description[t('fileVersion.deaccessionedReason')] = typeof value === 'string' ? value : ''
        break
      }
    }
  })

  return description
}
