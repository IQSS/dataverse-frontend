import { DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { useState } from 'react'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { getFileCitationByFormat } from '@/files/domain/useCases/getFileCitationByFormat'
import { FileCitationFormat, FormattedFileCitation } from '@/files/domain/models/FileCitation'
import { downloadFile } from './useDownloadCitation'

export function useDownloadFileCitation({
  fileRepository,
  fileId,
  versionNumber
}: {
  fileRepository: FileRepository
  fileId: string | number
  versionNumber?: DatasetVersionNumber
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetCitation = async (
    format: FileCitationFormat
  ): Promise<FormattedFileCitation | null> => {
    setIsLoading(true)
    setError(null)
    try {
      return await getFileCitationByFormat(fileRepository, fileId, format, versionNumber)
    } catch (err) {
      setError('Failed to fetch citation.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCitation = async (
    format: FileCitationFormat,
    filename: string
  ): Promise<boolean> => {
    const citation = await handleGetCitation(format)
    if (citation) {
      downloadFile(citation.content, filename, citation.contentType)
      return true
    }
    return false
  }

  return { isLoading, error, handleGetCitation, handleDownloadCitation }
}
