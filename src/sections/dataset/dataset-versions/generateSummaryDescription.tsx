import {
  DatasetVersionSummaryStringValues,
  DatasetVersionSummary,
  FilesSummaryUpdates,
  SummaryUpdates
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'

export const generateDatasetVersionSummaryDescription = function (
  summary?: DatasetVersionSummary | DatasetVersionSummaryStringValues
): Record<string, string> {
  if (!summary) {
    return {}
  }

  if (typeof summary === 'string') {
    switch (summary) {
      case DatasetVersionSummaryStringValues.firstPublished:
        return { firstPublished: 'This is the First Published Version' }
      case DatasetVersionSummaryStringValues.firstDraft:
        return { firstDraft: 'Initial Draft Version' }
      case DatasetVersionSummaryStringValues.versionDeaccessioned:
        return {
          versionDeaccessioned: 'Deaccessioned Reason: The research article has been retracted.'
        }
      case DatasetVersionSummaryStringValues.previousVersionDeaccessioned:
        return {
          previousVersionDeaccessioned:
            'Due to the previous version being deaccessioned, there are no difference notes available for this published version.'
        }
    }
  }

  const descriptionObject: Record<string, string> = {}

  Object.entries(summary).forEach(([key, value]) => {
    switch (key) {
      case 'Citation Metadata': {
        const metadataDescriptions: string[] = []
        Object.entries(value as Record<string, SummaryUpdates>).forEach(([field, change]) => {
          if (change.changed > 0 || change.added > 0) {
            const changes = []
            if (change.changed > 0) changes.push('Changed')
            if (change.added > 0) changes.push(`${change.added} Added`)

            metadataDescriptions.push(`${field} (${changes.join('; ')})`)
          }
        })
        if (metadataDescriptions.length > 0) {
          descriptionObject[key] = metadataDescriptions.join('; ')
        }
        break
      }

      case 'Additional Citation Metadata': {
        const additionMetadataChanges: string[] = []
        const AdditionalCitationMetadata = value as SummaryUpdates

        if (AdditionalCitationMetadata.added > 0)
          additionMetadataChanges.push(`${AdditionalCitationMetadata.added} Added`)
        if (AdditionalCitationMetadata.deleted > 0)
          additionMetadataChanges.push(`${AdditionalCitationMetadata.deleted} Removed`)
        if (AdditionalCitationMetadata.changed > 0)
          additionMetadataChanges.push(`${AdditionalCitationMetadata.changed} Changed`)
        if (additionMetadataChanges.length > 0) {
          descriptionObject[key] = additionMetadataChanges.join('; ')
        }
        break
      }

      case 'files': {
        const filesChanges: string[] = []
        const fileSummary = value as FilesSummaryUpdates

        if (fileSummary.added > 0) filesChanges.push(`Added: ${fileSummary.added}`)
        if (fileSummary.removed > 0) filesChanges.push(`Removed: ${fileSummary.removed}`)
        if (fileSummary.replaced > 0) filesChanges.push(`Replaced: ${fileSummary.replaced}`)
        if (fileSummary.changedFileMetaData > 0)
          filesChanges.push(`File Metadata Changed: ${fileSummary.changedFileMetaData}`)
        if (fileSummary.changedVariableMetadata > 0)
          filesChanges.push(`Variable Metadata Changed: ${fileSummary.changedVariableMetadata}`)

        if (filesChanges.length > 0) {
          descriptionObject['Files'] = filesChanges.join('; ')
        }
        break
      }

      case 'termsAccessChanged':
        if (value) descriptionObject[key] = 'Terms Access: Changed'
        break
    }
  })

  return descriptionObject
}
