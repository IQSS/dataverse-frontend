import {
  DatasetVersionSummaryStringValues,
  DatasetVersionSummary,
  FilesSummaryUpdates,
  SummaryUpdates
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'

export function generateDatasetVersionSummaryDescription(
  summary?: DatasetVersionSummary | DatasetVersionSummaryStringValues
): Record<string, string> {
  if (!summary) {
    console.error('No summary provided.')
    return {}
  }

  //TODO Make a .json to save all the translations
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
      default:
        return { default: summary }
    }
  }

  const descriptionObject: Record<string, string> = {}

  Object.entries(summary).forEach(([key, value]) => {
    switch (key) {
      case 'Citation Metadata': {
        const metadataDescriptions: string[] = []
        Object.entries(value as Record<string, SummaryUpdates>).forEach(([field, change]) => {
          if (change.changed > 0 || change.added > 0 || change.deleted > 0) {
            const changes = []
            if (change.changed > 0) changes.push('Changed')
            if (change.added > 0) changes.push(`${change.added} Added`)
            if (change.deleted > 0) changes.push(`${change.deleted} Deleted`)

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
        const fileSummary = value as FilesSummaryUpdates

        if (fileSummary.added > 0) additionMetadataChanges.push(`${fileSummary.added} Added`)
        if (fileSummary.removed > 0) additionMetadataChanges.push(`${fileSummary.removed} Removed`)
        if (fileSummary.replaced > 0)
          additionMetadataChanges.push(`${fileSummary.replaced} Replaced`)
        if (fileSummary.changedFileMetaData > 0)
          additionMetadataChanges.push(`${fileSummary.changedFileMetaData} Changed`)
        if (fileSummary.changedVariableMetadata > 0)
          additionMetadataChanges.push(
            `Variable Metadata Changed: ${fileSummary.changedVariableMetadata}`
          )

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

      default:
        console.warn(`Unhandled summary key: ${key}`)
        descriptionObject[key] = `Unhandled summary key: ${key}`
        break
    }
  })

  return descriptionObject
}
