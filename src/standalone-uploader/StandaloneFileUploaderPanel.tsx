/**
 * Standalone File Uploader Panel
 *
 * A thin wrapper around FileUploaderPanelCore for standalone mode (DVWebloader V2).
 * Handles standalone-specific concerns: beforeunload warning, redirect to JSF pages.
 */

import { useEffect, useCallback } from 'react'
import { UploaderFileRepository } from '@/sections/shared/file-uploader/types'
import { useFileUploaderContext } from '@/sections/shared/file-uploader/context/FileUploaderContext'
import { FileUploaderPanelCore } from '@/sections/shared/file-uploader/FileUploaderPanelCore'

interface StandaloneFileUploaderPanelProps {
  fileRepository: UploaderFileRepository
  datasetPersistentId: string
  siteUrl: string
}

export const StandaloneFileUploaderPanel = ({
  fileRepository,
  datasetPersistentId,
  siteUrl
}: StandaloneFileUploaderPanelProps) => {
  const {
    fileUploaderState: { files, isSaving, uploadingToCancelMap }
  } = useFileUploaderContext()

  // Warn before leaving page if there are unsaved changes
  useEffect(() => {
    const hasUnsavedChanges =
      Object.keys(files).length > 0 || isSaving || uploadingToCancelMap.size > 0

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [files, isSaving, uploadingToCancelMap.size])

  // Build the dataset page URL (JSF page)
  const getDatasetUrl = useCallback(() => {
    return `${siteUrl}/dataset.xhtml?persistentId=${encodeURIComponent(
      datasetPersistentId
    )}&version=DRAFT`
  }, [siteUrl, datasetPersistentId])

  // Navigation callbacks
  const handleCancel = useCallback(() => {
    window.location.href = getDatasetUrl()
  }, [getDatasetUrl])

  const handleFilesAddedSuccess = useCallback(() => {
    // Small delay to let toast show before redirect
    setTimeout(() => {
      window.location.href = getDatasetUrl()
    }, 1500)
  }, [getDatasetUrl])

  return (
    <FileUploaderPanelCore
      fileRepository={fileRepository}
      datasetPersistentId={datasetPersistentId}
      onCancel={handleCancel}
      onFilesAddedSuccess={handleFilesAddedSuccess}
    />
  )
}
