import { Button, Modal } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetVersionsDifferenceTable } from './DatasetVersionsDifferenceTable'
import { ExclamationCircleFill, ExclamationTriangle } from 'react-bootstrap-icons'
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

  if (isLoading || errorHandling) {
    return (
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header>
          <Modal.Title>{t('versions.viewDifferencesDetail')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`${styles.message} ${styles.error}`}>
            {isLoading && <Spinner data-testid={`loading-spinner`} variant="info" />}
            {errorHandling && (
              <>
                <ExclamationCircleFill />
                <span>{errorHandling}</span>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} type="button" disabled={isLoading}>
            {tShared('cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <Modal show={show} onHide={isLoading ? () => {} : handleClose} centered size="xl">
      <Modal.Header>
        <Modal.Title>{t('versions.viewDifferencesDetail')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {datasetVersionDifferences ? (
          <DatasetVersionsDifferenceTable differences={datasetVersionDifferences} />
        ) : (
          <div className={`${styles.message} ${styles.error}`}>
            <ExclamationTriangle />
            <span>{t('versions.needTwoVersions')}</span>
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
