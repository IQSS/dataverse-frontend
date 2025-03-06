import { useEffect, useState } from 'react'

interface UseOpenFileTypeDifferentModalProps {
  uploadedFileType?: string
  originalFileType?: string
}

interface UseOpenFileTypeDifferentModalReturn {
  showFileTypeDifferentModal: boolean
  handleCloseFileTypeDifferentModal: () => void
}

/**
 * This hook will return a boolean to show the modal when the uploaded file type is different from the original file type.
 * It will also return a function to close the modal to use when the user wants to continue anyways.
 */

export const useOpenFileTypeDifferentModal = ({
  uploadedFileType,
  originalFileType
}: UseOpenFileTypeDifferentModalProps): UseOpenFileTypeDifferentModalReturn => {
  const [showFileTypeDifferentModal, setShowFileTypeDifferentModal] = useState(false)

  useEffect(() => {
    const shouldShow =
      uploadedFileType !== undefined &&
      originalFileType !== undefined &&
      uploadedFileType !== originalFileType

    setShowFileTypeDifferentModal((prev) => (prev !== shouldShow ? shouldShow : prev))
  }, [uploadedFileType, originalFileType])

  const handleCloseFileTypeDifferentModal = () => setShowFileTypeDifferentModal(false)

  return {
    showFileTypeDifferentModal,
    handleCloseFileTypeDifferentModal
  }
}
