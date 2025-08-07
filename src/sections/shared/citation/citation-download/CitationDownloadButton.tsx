import { useTranslation } from 'react-i18next'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { ViewStyledCitationModal } from './ViewStyledCitationModal'
import { useState } from 'react'
import { CitationFormat } from '@/dataset/domain/models/DatasetCitation'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useDownloadCitation } from './useDownloadCitation'
import { FormattedCitation } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/FormattedCitation'
import { toast } from 'react-toastify'

interface CitationDownloadProps {
  datasetRepository: DatasetRepository
  datasetId: string
  version: string
}

export function CitationDownloadButton({
  datasetRepository,
  datasetId,
  version
}: CitationDownloadProps) {
  const { t } = useTranslation('shared', { keyPrefix: 'downloadCitation' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [styledCitation, setStyledCitation] = useState<FormattedCitation | null>(null)

  const { error, handleGetCitation, handleDownloadCitation } = useDownloadCitation({
    datasetRepository,
    datasetId,
    version
  })

  if (error) {
    toast.error(t('downloadError'))
  }

  const handleCloseModal = () => setIsModalOpen(false)
  const handleOpenModal = async () => {
    setIsModalOpen(true)
    const result = await handleGetCitation(CitationFormat.Internal)
    setStyledCitation(result)
  }
  return (
    <>
      <DropdownButton title="Cite Dataset" id="dataset-actions" variant="link">
        <DropdownButtonItem
          style={{ textDecoration: 'underline' }}
          onClick={() => handleDownloadCitation(CitationFormat.EndNote, `${datasetId}.xml`)}>
          {t('downloadEndNoteXML')}
        </DropdownButtonItem>
        <DropdownButtonItem
          style={{ textDecoration: 'underline' }}
          onClick={() => handleDownloadCitation(CitationFormat.RIS, `${datasetId}.ris`)}>
          {t('downloadRIS')}
        </DropdownButtonItem>
        <DropdownButtonItem
          style={{ textDecoration: 'underline' }}
          onClick={() => handleDownloadCitation(CitationFormat.BibTeX, `${datasetId}.bib`)}>
          {t('downloadBibTeX')}
        </DropdownButtonItem>
        <DropdownButtonItem onClick={handleOpenModal}>{t('viewStyledCitation')}</DropdownButtonItem>
      </DropdownButton>
      <ViewStyledCitationModal
        show={isModalOpen}
        handleClose={handleCloseModal}
        citation={styledCitation}
      />
    </>
  )
}
