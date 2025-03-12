import { Button, Modal } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetVersionsDifferenceTable } from './DatasetVersionsDifferenceTable'

interface VersionDetailModalProps {
  show: boolean
  handleClose: () => void
  isLoading: boolean
  errorLoading: string | null
  datasetVersionDifferences: DatasetVersionDiff
}

export const VersionDetailModal = ({
  show,
  handleClose,
  isLoading,
  datasetVersionDifferences
}: VersionDetailModalProps) => {
  //   if (!dataset) return null
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')

  return (
    <Modal show={show} onHide={isLoading ? () => {} : handleClose} centered size="xl">
      <Modal.Header>
        <Modal.Title>Version Differences Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DatasetVersionsDifferenceTable differences={datasetVersionDifferences} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button" disabled={isLoading}>
          {tShared('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
