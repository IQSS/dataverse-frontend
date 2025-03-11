import { Button, Modal } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetVersionsDifferenceTable } from '../DatasetVersionsDifferenceTable'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'

interface VersionDetailModalProps {
  show: boolean
  handleClose: () => void
  isLoading: boolean
  errorLoading: string | null
  datasetVersionDifferences: DatasetVersionDiff | undefined
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
  console.log('VersionDetailModal', datasetVersionDifferences)
  const versionRows = [
    { key: 'Version', value: '3.0' },
    { key: 'Last Updated', value: 'Jan 6, 2025, 8:37:06 PM UTC' }
  ]

  const fileRows = [
    { col1: 'File ID 26381', col2: 'Name: pums_1000.tab', col3: 'Type: Tab-Delimited' },
    { col1: 'MD5', col2: '874aef476ffb8a1e98d68fcf5780990', col3: 'Access: Restricted' }
  ]

  return (
    <Modal show={show} onHide={isLoading ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>Version Differences Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Dataset created using the createDataset use case</p>
        <DatasetVersionsDifferenceTable
          title="Version Differences Details"
          versionRows={versionRows}
          fileRows={fileRows}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button" disabled={isLoading}>
          {tShared('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
