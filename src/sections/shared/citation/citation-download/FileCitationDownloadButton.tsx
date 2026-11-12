import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileCitationFormat } from '@/files/domain/models/FileCitation'
import { useDownloadFileCitation } from './useDownloadFileCitation'

interface FileCitationDownloadButtonProps {
  fileRepository: FileRepository
  fileId: string | number
}

export function FileCitationDownloadButton({
  fileRepository,
  fileId
}: FileCitationDownloadButtonProps) {
  const { t } = useTranslation('shared', { keyPrefix: 'downloadCitation' })

  const { error, handleDownloadCitation } = useDownloadFileCitation({
    fileRepository,
    fileId
  })

  useEffect(() => {
    if (error) {
      toast.error(t('downloadError'))
    }
  }, [error, t])

  const handleDownload = (format: FileCitationFormat, filename: string) => {
    void handleDownloadCitation(format, filename).then((downloaded) => {
      if (downloaded) {
        toast.success(t('downloadSuccess'))
      }
    })
  }

  return (
    <DropdownButton title={t('citeDataFile')} id="file-citation-actions" variant="link">
      <DropdownButtonItem
        style={{ textDecoration: 'underline' }}
        onClick={() => handleDownload(FileCitationFormat.EndNote, `${fileId}.xml`)}>
        {t('downloadEndNoteXML')}
      </DropdownButtonItem>
      <DropdownButtonItem
        style={{ textDecoration: 'underline' }}
        onClick={() => handleDownload(FileCitationFormat.RIS, `${fileId}.ris`)}>
        {t('downloadRIS')}
      </DropdownButtonItem>
      <DropdownButtonItem
        style={{ textDecoration: 'underline' }}
        onClick={() => handleDownload(FileCitationFormat.BibTeX, `${fileId}.bib`)}>
        {t('downloadBibTeX')}
      </DropdownButtonItem>
    </DropdownButton>
  )
}
