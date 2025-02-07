import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { ConfirmDeleteFileModal } from './ConfirmDeleteFileModal'

export const DeleteFileButton = () => {
  const { t } = useTranslation('file')
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const handleConfirmDelete = () => {
    console.log('Delete')
  }

  return (
    <>
      <DropdownButtonItem onClick={handleOpenModal}>
        {t('actionButtons.editFileMenu.options.delete')}
      </DropdownButtonItem>
      <ConfirmDeleteFileModal
        show={showModal}
        handleClose={handleCloseModal}
        handleDelete={handleConfirmDelete}
      />
    </>
  )
}
