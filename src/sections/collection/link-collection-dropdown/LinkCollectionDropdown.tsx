import { useState } from 'react'
import { toast } from 'react-toastify'
import { Trans, useTranslation } from 'react-i18next'
import { Link45deg } from 'react-bootstrap-icons'
import {
  Button,
  DropdownButton,
  DropdownButtonItem,
  Modal,
  Spinner,
  Stack
} from '@iqss/dataverse-design-system'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { linkCollection } from '@/collection/domain/useCases/linkCollection'
import { CollectionLinkSelect } from './collection-link-select/CollectionLinkSelect'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { RouteWithParams } from '@/sections/Route.enum'
import { useCollectionRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

interface LinkCollectionDropdownProps {
  collectionId: string
  collectionName: string
}

export const LinkCollectionDropdown = ({
  collectionId,
  collectionName
}: LinkCollectionDropdownProps) => {
  const { collectionRepository } = useCollectionRepositories()
  const { t } = useTranslation('collection')
  const { t: tShared } = useTranslation('shared')
  const [showModal, setShowModal] = useState(false)
  const [collectionSelected, setCollectionSelected] = useState<CollectionSummary | null>(null)
  const [isLinkingCollection, setIsLinkingCollection] = useState(false)
  const [errorLinkingCollection, setErrorLinkingCollection] = useState<string | null>(null)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleSaveLink = async () => {
    if (!collectionSelected) return

    setIsLinkingCollection(true)
    setErrorLinkingCollection(null)

    try {
      await linkCollection(collectionRepository, collectionId, collectionSelected.id)

      toast.success(
        <Trans
          t={t}
          i18nKey={'linkCollection.success'}
          values={{
            linkedCollectionName: collectionName,
            linkingCollectionName: collectionSelected?.displayName
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
      handleClose()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorLinkingCollection(formattedError)
      } else {
        setErrorLinkingCollection('An unexpected error occurred while linking the collection.')
      }
    } finally {
      setIsLinkingCollection(false)
    }
  }

  const handleCollectionSelected = (collection: CollectionSummary | null) => {
    setCollectionSelected(collection)
  }

  return (
    <>
      <DropdownButton
        id="link-dropdown"
        title={tShared('link')}
        asButtonGroup
        variant="secondary"
        align="end"
        icon={<Link45deg className="me-1 mb-1" />}>
        <DropdownButtonItem as="button" type="button" onClick={handleShow}>
          {t('linkCollection.title')}
        </DropdownButtonItem>
      </DropdownButton>

      <Modal
        show={showModal}
        ariaLabel={'Link Collection Modal'}
        onHide={isLinkingCollection ? () => {} : handleClose}
        centered
        size="lg">
        <Modal.Header>
          <Modal.Title>{t('linkCollection.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CollectionLinkSelect
            mode="link"
            linkingObjectType="collection"
            collectionIdOrAlias={collectionId}
            collectionRepository={collectionRepository}
            onCollectionSelected={handleCollectionSelected}
            helpText={t('linkCollection.helper')}
          />

          {errorLinkingCollection && (
            <small className="text-danger">{errorLinkingCollection}</small>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            type="button"
            disabled={isLinkingCollection}>
            {tShared('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveLink}
            type="button"
            disabled={isLinkingCollection || !collectionSelected}>
            <Stack direction="horizontal" gap={1}>
              {t('linkCollection.save')}
              {isLinkingCollection && <Spinner variant="light" animation="border" size="sm" />}
            </Stack>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
