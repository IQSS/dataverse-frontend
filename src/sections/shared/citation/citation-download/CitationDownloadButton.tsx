import { useTranslation } from 'react-i18next'
import { DropdownButton, DropdownButtonItem, Stack } from '@iqss/dataverse-design-system'
import { ViewStyledCitationModal } from './ViewStyledCitationModal'
import { startTransition, useEffect, useState } from 'react'
import { CitationFormat } from '@/dataset/domain/models/DatasetCitation'
import { useDownloadCitation } from './useDownloadCitation'
import { FormattedCitation } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/FormattedCitation'
import { toast } from 'react-toastify'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { CopyToClipboardButton } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/copy-to-clipboard-button/CopyToClipboardButton'
import { useDefaultStyleCitation } from './csl/useDefaultStyleCitation'
import { DEFAULT_CSL_STYLE_SLUG } from './csl/cslStyleOptions'
import styles from '../Citation.module.scss'

interface CitationDownloadProps {
  datasetId: string
  version: string
}

export function CitationDownloadButton({ datasetId, version }: CitationDownloadProps) {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('shared', { keyPrefix: 'downloadCitation' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [styledCitation, setStyledCitation] = useState<FormattedCitation | null>(null)
  const [styledCitationFetchFailed, setStyledCitationFetchFailed] = useState(false)

  const { error, handleGetCitation, handleDownloadCitation } = useDownloadCitation({
    datasetRepository,
    datasetId,
    version
  })

  const {
    cslJsonCitation,
    defaultStyleCitationHtml,
    defaultStyleCitationText,
    isFetching: isFetchingDefaultStyleCitation
  } = useDefaultStyleCitation({ datasetRepository, datasetId, version })

  useEffect(() => {
    if (error) {
      toast.error(t('downloadError'))
    }
  }, [error, t])

  const handleCloseModal = () => setIsModalOpen(false)
  const handleOpenModal = async () => {
    startTransition(() => setIsModalOpen(true))
    setStyledCitationFetchFailed(false)
    const result = cslJsonCitation ?? (await handleGetCitation(CitationFormat.CSLJson))
    setStyledCitation(result)
    setStyledCitationFetchFailed(result === null)
  }

  const handleDownload = (format: CitationFormat, filename: string) => {
    void handleDownloadCitation(format, filename).then((downloaded) => {
      if (downloaded) {
        toast.success(t('downloadSuccess'))
      }
    })
  }

  return (
    <>
      <Stack direction="horizontal" gap={0} className={styles['citeDatasetGroup']}>
        <div className={styles['copyCitationButtonWrapper']}>
          <CopyToClipboardButton
            text={defaultStyleCitationText}
            showTruncateText={false}
            tooltipText={t('copyCitationToClipboard')}
            disabled={isFetchingDefaultStyleCitation || !defaultStyleCitationText}
          />
        </div>
        <DropdownButton title={t('citeDataset')} id="dataset-actions" variant="link">
          <DropdownButtonItem
            style={{ textDecoration: 'underline' }}
            onClick={() => handleDownload(CitationFormat.EndNote, `${datasetId}.xml`)}>
            {t('downloadEndNoteXML')}
          </DropdownButtonItem>
          <DropdownButtonItem
            style={{ textDecoration: 'underline' }}
            onClick={() => handleDownload(CitationFormat.RIS, `${datasetId}.ris`)}>
            {t('downloadRIS')}
          </DropdownButtonItem>
          <DropdownButtonItem
            style={{ textDecoration: 'underline' }}
            onClick={() => handleDownload(CitationFormat.BibTeX, `${datasetId}.bib`)}>
            {t('downloadBibTeX')}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={handleOpenModal} className={styles['styledCitationButton']}>
            {t('viewStyledCitation')}
          </DropdownButtonItem>
        </DropdownButton>
      </Stack>
      <ViewStyledCitationModal
        show={isModalOpen}
        handleClose={handleCloseModal}
        citation={styledCitation}
        citationFetchFailed={styledCitationFetchFailed}
        defaultStyleCitationSeed={
          defaultStyleCitationHtml
            ? { styleSlug: DEFAULT_CSL_STYLE_SLUG, html: defaultStyleCitationHtml }
            : null
        }
      />
    </>
  )
}
