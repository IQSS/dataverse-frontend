import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { PublishCollectionModal } from './PublishCollectionModal'
import { Button } from '@iqss/dataverse-design-system'
import { GlobeAmericas } from 'react-bootstrap-icons'
import styles from '../../shared/add-data-actions/AddDataActionsButton.module.scss'

interface PublishCollectionButtonProps {
  repository: CollectionRepository
  collectionId: string
  refetchCollection: () => void
}
export function PublishCollectionButton({
  repository,
  collectionId,
  refetchCollection
}: PublishCollectionButtonProps) {
  const { t } = useTranslation('collection')
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <PublishCollectionModal
        show={showModal}
        repository={repository}
        collectionId={collectionId}
        handleClose={() => setShowModal(false)}
        refetchCollection={refetchCollection}
      />
      <Button
        icon={<GlobeAmericas className={styles.icon} />}
        variant="secondary"
        onClick={() => setShowModal(true)}
        type="button">
        {t('publish.button')}
      </Button>
    </>
  )
}
