import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link45deg } from 'react-bootstrap-icons'
import {
  Button,
  DropdownButton,
  DropdownButtonItem,
  Modal,
  Spinner,
  Stack
} from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionLinkSelect } from './collection-link-select/CollectionLinkSelect'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'

/*
    3 different options for the modal.
    1. More than one collection for linking.
    2. Only one collection for linking.
    3. No collections for linking.
*/

interface LinkCollectionDropdownProps {
  collectionId: string
  collectionRepository: CollectionRepository
}

export const LinkCollectionDropdown = ({
  collectionId,
  collectionRepository
}: LinkCollectionDropdownProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('collection')
  const [showModal, setShowModal] = useState(false)
  const [collectionSelected, setCollectionSelected] = useState<CollectionSummary | null>(null)
  const [isLinkingCollection, setIsLinkingCollection] = useState(false)
  const [errorLinkingCollection, setErrorLinkingCollection] = useState<string | null>(null)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleLink = () => {
    // Link collection logic here
  }

  const handleCollectionSelected = (collection: CollectionSummary | null) => {
    setCollectionSelected(collection)
  }

  return (
    <>
      <DropdownButton
        id="link-dropdown"
        title={t('link.title')}
        asButtonGroup
        variant="secondary"
        align="end"
        icon={<Link45deg className="me-1 mb-1" />}>
        <DropdownButtonItem as="button" type="button" onClick={handleShow}>
          {t('link.linkCollection')}
        </DropdownButtonItem>
      </DropdownButton>

      <Modal
        show={showModal}
        onHide={isLinkingCollection ? () => {} : handleClose}
        centered
        size="lg">
        <Modal.Header>
          <Modal.Title>{t('link.linkCollection')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CollectionLinkSelect
            collectionIdOrAlias={collectionId}
            collectionRepository={collectionRepository}
            onCollectionSelected={handleCollectionSelected}
            helpText={t('link.linkCollectionHelperText')}
          />
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
            onClick={handleLink}
            type="button"
            disabled={isLinkingCollection}>
            <Stack direction="horizontal" gap={1}>
              {t('link.saveLinkedCollection')}
              {isLinkingCollection && <Spinner variant="light" animation="border" size="sm" />}
            </Stack>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
