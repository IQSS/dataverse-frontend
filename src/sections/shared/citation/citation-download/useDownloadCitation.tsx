import { useState } from 'react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetCitationInOtherFormats } from '@/dataset/domain/useCases/getDatasetCitationInOtherFormats'
import { CitationFormat, FormattedCitation } from '@/dataset/domain/models/DatasetCitation'

export function useDownloadCitation({
  datasetRepository,
  datasetId,
  version
}: {
  datasetRepository: DatasetRepository
  datasetId: string
  version: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetCitation = async (format: CitationFormat): Promise<FormattedCitation | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const citation = await getDatasetCitationInOtherFormats(
        datasetRepository,
        datasetId,
        version,
        format
      )
      return citation
    } catch (err) {
      setError('Failed to fetch citation.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Downloads a citation file after fetching it.
   */
  const handleDownloadCitation = async (format: CitationFormat, filename: string) => {
    const citation = await handleGetCitation(format)
    if (citation) {
      downloadFile(citation.content, filename, citation.contentType)
    }
  }

  return { isLoading, error, handleGetCitation, handleDownloadCitation }
}

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
