/**
 * Standalone File Uploader Panel
 *
 * A thin wrapper around FileUploaderPanelCore for standalone mode (DVWebloader V2).
 * Handles standalone-specific concerns: beforeunload warning, redirect to JSF pages.
 */

import { useEffect, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { UploaderFileRepository } from '@/sections/shared/file-uploader/types'
import { useFileUploaderContext } from '@/sections/shared/file-uploader/context/FileUploaderContext'
import { FileUploaderPanelCore } from '@/sections/shared/file-uploader/FileUploaderPanelCore'
import styles from './StandaloneFileUploaderPanel.module.scss'

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
  const { t } = useTranslation('shared')
  const {
    fileUploaderState: { files, isSaving, uploadingToCancelMap, addFilesToDatasetOperationInfo }
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

  const handleCancel = useCallback(() => {
    window.location.href = getDatasetUrl()
  }, [getDatasetUrl])

  // Redirect after successful add. Small delay so the success toast is
  // visible before the page navigates. Registered after the beforeunload
  // listener effect so the listener has already picked up the now-clean
  // state by the time we leave.
  useEffect(() => {
    if (!addFilesToDatasetOperationInfo.success) return
    const timer = setTimeout(() => {
      window.location.href = getDatasetUrl()
    }, 1500)
    return () => clearTimeout(timer)
  }, [addFilesToDatasetOperationInfo.success, getDatasetUrl])

  return (
    <>
      <p className={styles.helper_text}>
        <Trans
          t={t}
          i18nKey="fileUploader.supportedFiles"
          components={{
            anchor: (
              <a
                href="https://guides.dataverse.org/en/latest/user/dataset-management.html#tabular-data-files"
                target="_blank"
                rel="noreferrer"
              />
            )
          }}
        />
      </p>
      <FileUploaderPanelCore
        fileRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        onCancel={handleCancel}
      />
    </>
  )
}
