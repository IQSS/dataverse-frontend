import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Alert, Button, Modal, Spinner, Table } from '@iqss/dataverse-design-system'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { useGetDatasetCurationStatusHistory } from './useGetDatasetCurationStatusHistory'

interface DatasetCurationStatusHistoryModalProps {
  show: boolean
  datasetId: string | number
  handleClose: () => void
}

const formatCreateTime = (createTime?: string): string => {
  if (!createTime) return ''
  const timestamp = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})/.exec(createTime)
  if (timestamp) return `${timestamp[1]} ${timestamp[2]}`
  const date = moment.utc(
    createTime,
    ['ddd MMM DD HH:mm:ss [UTC] YYYY', 'ddd MMM D HH:mm:ss [UTC] YYYY'],
    'en',
    true
  )
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : createTime
}

export function DatasetCurationStatusHistoryModal({
  show,
  datasetId,
  handleClose
}: DatasetCurationStatusHistoryModalProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { datasetRepository } = useDatasetRepositories()
  const { history, isLoading, error } = useGetDatasetCurationStatusHistory({
    datasetRepository,
    datasetId,
    enabled: show
  })

  return (
    <Modal
      ariaLabel={t('curationStatus.history.title')}
      show={show}
      onHide={handleClose}
      size="lg"
      centered>
      <Modal.Header>
        <Modal.Title>{t('curationStatus.history.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-label={t('curationStatus.history.loading')}
          />
        ) : error ? (
          <Alert variant="danger" dismissible={false}>
            {error}
          </Alert>
        ) : history.length === 0 ? (
          <p>{t('curationStatus.history.empty')}</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>{t('curationStatus.history.status')}</th>
                <th>{t('curationStatus.history.date')}</th>
                <th>{t('curationStatus.history.assigner')}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((status, index) => (
                <tr key={`${status.createTime ?? ''}-${index}`}>
                  <td>{status.label ?? <em>{t('curationStatus.history.removed')}</em>}</td>
                  <td>{formatCreateTime(status.createTime)}</td>
                  <td>{status.assignerDisplayName ?? status.assigner ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          {tShared('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
