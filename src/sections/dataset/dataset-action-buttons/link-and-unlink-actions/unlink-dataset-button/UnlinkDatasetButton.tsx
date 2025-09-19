import { useState } from 'react'
import { toast } from 'react-toastify'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { Dataset, DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { useSession } from '@/sections/session/SessionContext'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { CollectionLinkSelect } from '@/sections/collection/link-collection-dropdown/collection-link-select/CollectionLinkSelect'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { unlinkDataset } from '@/dataset/domain/useCases/unlinkDataset'
import { RouteWithParams } from '@/sections/Route.enum'
import { useGetDatasetLinkedCollections } from '@/dataset/domain/hooks/useGetDatasetLinkedCollections'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

interface UnlinkDatasetButtonProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  collectionRepository: CollectionRepository
  updateParent: () => void
}

export function UnlinkDatasetButton({
  dataset,
  datasetRepository,
  collectionRepository,
  updateParent
}: UnlinkDatasetButtonProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { user } = useSession()
  const { datasetLinkedCollections } = useGetDatasetLinkedCollections({
    datasetRepository,
    datasetId: dataset.id,
    autoFetch: true
  })

  const [showModal, setShowModal] = useState(false)
  const [collectionSelected, setCollectionSelected] = useState<CollectionSummary | null>(null)
  const [isUnlinkingDataset, setIsUnlinkingDataset] = useState(false)
  const [errorUnlinkingDataset, setErrorUnlinkingDataset] = useState<string | null>(null)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleRemoveLink = async () => {
    if (!collectionSelected) return

    setIsUnlinkingDataset(true)
    setErrorUnlinkingDataset(null)

    try {
      await unlinkDataset(datasetRepository, dataset.persistentId, collectionSelected.id)

      toast.success(
        <Trans
          t={t}
          i18nKey={'datasetActionButtons.unlinkDataset.success'}
          values={{
            unlinkingCollectionName: collectionSelected.displayName
          }}
          components={{
            wrapper: <div className="d-flex flex-wrap" />,
            a: (
              <a
                className="ms-1"
                href={`${BASENAME_URL}${RouteWithParams.COLLECTIONS(collectionSelected?.alias)}`}
              />
            )
          }}
        />
      )
      updateParent()
      handleClose()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorUnlinkingDataset(formattedError)
      } else {
        setErrorUnlinkingDataset('An unexpected error occurred while unlinking the dataset.')
      }
    } finally {
      setIsUnlinkingDataset(false)
    }
  }

  const handleCollectionSelected = (collection: CollectionSummary | null) => {
    setCollectionSelected(collection)
  }

  if (
    !user ||
    dataset.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED ||
    datasetLinkedCollections.length === 0
  ) {
    return <></>
  }

  return (
    <>
      <Button onClick={handleShow} variant="secondary" size="sm">
        {t('datasetActionButtons.unlinkDataset.title')}
      </Button>

      <Modal
        show={showModal}
        onHide={isUnlinkingDataset ? () => {} : handleClose}
        centered
        size="lg">
        <Modal.Header>
          <Modal.Title>{t('datasetActionButtons.unlinkDataset.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CollectionLinkSelect
            mode="unlink"
            linkingObjectType="dataset"
            datasetPersistentId={dataset.persistentId}
            collectionRepository={collectionRepository}
            onCollectionSelected={handleCollectionSelected}
            helpText={t('datasetActionButtons.unlinkDataset.helper')}
          />

          {errorUnlinkingDataset && <small className="text-danger">{errorUnlinkingDataset}</small>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            type="button"
            disabled={isUnlinkingDataset}>
            {tShared('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleRemoveLink}
            type="button"
            disabled={isUnlinkingDataset || !collectionSelected}>
            <Stack direction="horizontal" gap={1}>
              {t('datasetActionButtons.unlinkDataset.save')}
              {isUnlinkingDataset && <Spinner variant="light" animation="border" size="sm" />}
            </Stack>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
