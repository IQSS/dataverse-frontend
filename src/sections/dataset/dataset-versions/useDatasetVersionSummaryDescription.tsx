import { useTranslation } from 'react-i18next'
import {
  DatasetVersionSummaryStringValues,
  DatasetVersionSummary,
  FilesSummaryUpdates,
  SummaryUpdates,
  Deaccessioned
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'

export const useDatasetVersionSummaryDescription = (
  summary?: DatasetVersionSummary | DatasetVersionSummaryStringValues
): Record<string, string> => {
  const { t } = useTranslation('dataset')

  if (!summary) return {}

  if (typeof summary === 'string') {
    const stringSummaryMap: Record<DatasetVersionSummaryStringValues, string> = {
      [DatasetVersionSummaryStringValues.firstPublished]: t('datasetVersionSummary.firstPublished'),
      [DatasetVersionSummaryStringValues.firstDraft]: t('datasetVersionSummary.firstDraft'),
      [DatasetVersionSummaryStringValues.versionDeaccessioned]: t(
        'datasetVersionSummary.versionDeaccessioned'
      ),
      [DatasetVersionSummaryStringValues.previousVersionDeaccessioned]: t(
        'datasetVersionSummary.previousVersionDeaccessioned'
      )
    }
    return { [summary]: stringSummaryMap[summary] }
  }

  const description: Record<string, string> = {}

  Object.entries(summary).forEach(([key, value]) => {
    switch (key) {
      case 'Citation Metadata': {
        const metadataChanges: string[] = []

        Object.entries(value as Record<string, SummaryUpdates>).forEach(([field, change]) => {
          const fieldChanges: string[] = []
          change.changed && fieldChanges.push(t('datasetVersionSummary.citationMetadata.changed'))
          change.added &&
            fieldChanges.push(
              t('datasetVersionSummary.citationMetadata.added', { count: change.added })
            )

          if (fieldChanges.length) metadataChanges.push(`${field} (${fieldChanges.join('; ')})`)
        })

        if (metadataChanges.length) description[key] = metadataChanges.join('; ')
        break
      }

      case 'Additional Citation Metadata': {
        const additionalChanges: string[] = []
        const additionalMetadata = value as SummaryUpdates

        additionalMetadata.added &&
          additionalChanges.push(
            t('datasetVersionSummary.additionalCitationMetadata.added', {
              count: additionalMetadata.added
            })
          )
        additionalMetadata.deleted &&
          additionalChanges.push(
            t('datasetVersionSummary.additionalCitationMetadata.removed', {
              count: additionalMetadata.deleted
            })
          )
        additionalMetadata.changed &&
          additionalChanges.push(
            t('datasetVersionSummary.additionalCitationMetadata.changed', {
              count: additionalMetadata.changed
            })
          )

        if (additionalChanges.length) description[key] = additionalChanges.join('; ')
        break
      }

      case 'files': {
        const fileSummary = value as FilesSummaryUpdates
        const fileChanges: string[] = []

        fileSummary.added &&
          fileChanges.push(t('datasetVersionSummary.files.added', { count: fileSummary.added }))
        fileSummary.removed &&
          fileChanges.push(t('datasetVersionSummary.files.removed', { count: fileSummary.removed }))
        fileSummary.replaced &&
          fileChanges.push(
            t('datasetVersionSummary.files.replaced', { count: fileSummary.replaced })
          )
        fileSummary.changedFileMetaData &&
          fileChanges.push(
            t('datasetVersionSummary.files.fileMetadataChanged', {
              count: fileSummary.changedFileMetaData
            })
          )
        fileSummary.changedVariableMetadata &&
          fileChanges.push(
            t('datasetVersionSummary.files.variableMetadataChanged', {
              count: fileSummary.changedVariableMetadata
            })
          )

        if (fileChanges.length) description[t('versions.files')] = fileChanges.join('; ')
        break
      }

      case 'termsAccessChanged':
        if (value)
          description[t('versions.termsOfUseandAccess')] = t(
            'datasetVersionSummary.termsAccessChanged'
          )
        break

      case 'deaccessioned':
        if (value) {
          const deaccessioned = value as Deaccessioned
          description[t('versions.deaccessionedReason')] = deaccessioned.reason
        }
        break
    }
  })

  return description
}
