import { Button, Modal } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetVersionsDifferenceTable } from './DatasetVersionsDifferenceTable'
import { ExclamationCircleFill } from 'react-bootstrap-icons'
import { Spinner } from '@iqss/dataverse-design-system'
import styles from './DatasetVersionsDetailModal.module.scss'

interface VersionDetailModalProps {
  show: boolean
  handleClose: () => void
  isLoading: boolean
  errorHandling: string | null
  datasetVersionDifferences: DatasetVersionDiff | undefined
}
export const VersionDetailModal = ({
  show,
  handleClose,
  isLoading,
  errorHandling,
  datasetVersionDifferences
}: VersionDetailModalProps) => {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const modalTitle = t('versions.viewDifferencesDetail')

  return (
    <Modal show={show} onHide={handleClose} centered size="xl" ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {datasetVersionDifferences && !isLoading && !errorHandling && (
          <DatasetVersionsDifferenceTable differences={datasetVersionDifferences} />
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles.error}`}>
            <Spinner data-testid="loading-spinner" variant="info" />
          </div>
        )}
        {errorHandling && (
          <div className={`${styles.message} ${styles.error}`}>
            <ExclamationCircleFill />
            <span>{errorHandling}</span>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button" disabled={isLoading}>
          {tShared('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
