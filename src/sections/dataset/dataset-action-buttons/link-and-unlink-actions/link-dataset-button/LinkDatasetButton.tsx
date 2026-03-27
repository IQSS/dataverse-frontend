import { useEffect, useState } from 'react'
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
import { linkDataset } from '@/dataset/domain/useCases/linkDataset'
import { RouteWithParams } from '@/sections/Route.enum'
import { useGetDatasetLinkedCollections } from '@/dataset/domain/hooks/useGetDatasetLinkedCollections'
import { useCollectionRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

interface LinkDatasetButtonProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  updateParent: () => void
}

export function LinkDatasetButton({
  dataset,
  datasetRepository,
  updateParent
}: LinkDatasetButtonProps) {
  const { collectionRepository } = useCollectionRepositories()
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { user } = useSession()
  const { datasetLinkedCollections, fetchDatasetLinkedCollections } =
    useGetDatasetLinkedCollections({
      datasetRepository,
      datasetId: dataset.id,
      autoFetch: false
    })

  const [showModal, setShowModal] = useState(false)
  const [collectionSelected, setCollectionSelected] = useState<CollectionSummary | null>(null)
  const [isLinkingDataset, setIsLinkingDataset] = useState(false)
  const [errorLinkingDataset, setErrorLinkingDataset] = useState<string | null>(null)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleSaveLink = async () => {
    if (!collectionSelected) return

    setIsLinkingDataset(true)
    setErrorLinkingDataset(null)

    try {
      await linkDataset(datasetRepository, dataset.persistentId, collectionSelected.id)

      toast.success(
        <Trans
          t={t}
          i18nKey={'datasetActionButtons.linkDataset.success'}
          values={{
            parentCollection: dataset.parentCollectionNode.name,
            linkingCollectionName: collectionSelected.displayName
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

        setErrorLinkingDataset(formattedError)
      } else {
        setErrorLinkingDataset('An unexpected error occurred while linking the dataset.')
      }
    } finally {
      setIsLinkingDataset(false)
    }
  }

  const handleCollectionSelected = (collection: CollectionSummary | null) => {
    setCollectionSelected(collection)
  }

  useEffect(() => {
    if (showModal) {
      void fetchDatasetLinkedCollections()
    }
  }, [showModal, fetchDatasetLinkedCollections])

  if (!user || dataset.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
    return <></>
  }

  return (
    <>
      <Button onClick={handleShow} variant="secondary" size="sm">
        {t('datasetActionButtons.linkDataset.title')}
      </Button>

      <Modal
        ariaLabel={'Link Dataset Button'}
        show={showModal}
        onHide={isLinkingDataset ? () => {} : handleClose}
        centered
        size="lg">
        <Modal.Header>
          <Modal.Title>{t('datasetActionButtons.linkDataset.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CollectionLinkSelect
            mode="link"
            linkingObjectType="dataset"
            datasetPersistentId={dataset.persistentId}
            onCollectionSelected={handleCollectionSelected}
            helpText={t('datasetActionButtons.linkDataset.helper')}
          />

          {datasetLinkedCollections.length > 0 && (
            <p className="small">
              <strong>{t('datasetActionButtons.linkDataset.linkedCollections')}</strong>{' '}
              {datasetLinkedCollections.map((collection, index) => {
                const isLast = index === datasetLinkedCollections.length - 1
                const isPenultimate = index === datasetLinkedCollections.length - 2
                return (
                  <span key={collection.id}>
                    {collection.displayName}
                    {isLast ? '.' : isPenultimate ? ' and ' : ', '}
                  </span>
                )
              })}
            </p>
          )}

          {errorLinkingDataset && <small className="text-danger">{errorLinkingDataset}</small>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            type="button"
            disabled={isLinkingDataset}>
            {tShared('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveLink}
            type="button"
            disabled={isLinkingDataset || !collectionSelected}
            data-testid="confirm-link-dataset-button">
            <Stack direction="horizontal" gap={1}>
              {t('datasetActionButtons.linkDataset.save')}
              {isLinkingDataset && <Spinner variant="light" animation="border" size="sm" />}
            </Stack>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
