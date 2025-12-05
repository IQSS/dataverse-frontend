/**
 * SPA File Uploader Panel
 *
 * This is the React Router-aware wrapper for FileUploaderPanelCore.
 * It handles SPA-specific concerns: route navigation, useBlocker for unsaved changes.
 */

import { useMemo, useCallback } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ReplaceFileReferrer } from '@/sections/replace-file/ReplaceFileReferrer'
import { useFileUploaderContext } from './context/FileUploaderContext'
import { FileUploaderPanelCore } from './FileUploaderPanelCore'
import { ConfirmLeaveModal } from './confirm-leave-modal/ConfirmLeaveModal'

interface FileUploaderPanelProps {
  fileRepository: FileRepository
  datasetPersistentId: string
  referrer?: ReplaceFileReferrer
}

const FileUploaderPanel = ({
  fileRepository,
  datasetPersistentId,
  referrer
}: FileUploaderPanelProps) => {
  const navigate = useNavigate()

  const {
    fileUploaderState: { files, isSaving, uploadingToCancelMap },
    removeAllFiles
  } = useFileUploaderContext()

  // Block navigation when there are unsaved changes
  const shouldBlockAwayNavigation = useMemo(() => {
    return Object.keys(files).length > 0 || isSaving || uploadingToCancelMap.size > 0
  }, [files, isSaving, uploadingToCancelMap.size])

  const navigationBlocker = useBlocker(shouldBlockAwayNavigation)

  const handleConfirmLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      removeAllFiles()
      if (uploadingToCancelMap.size > 0) {
        uploadingToCancelMap.forEach((cancel) => cancel())
      }
      navigationBlocker.proceed()
    }
  }

  const handleCancelLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      navigationBlocker.reset()
    }
  }

  // Navigation callbacks for the core component
  const handleCancel = useCallback(() => navigate(-1), [navigate])

  const datasetPageUrl = `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${datasetPersistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`

  const handleFilesAddedSuccess = useCallback(() => {
    navigate(datasetPageUrl)
  }, [navigate, datasetPageUrl])

  const handleFileReplacedSuccess = useCallback(
    (newFileId: number) => {
      if (referrer === ReplaceFileReferrer.DATASET) {
        navigate(datasetPageUrl)
      } else if (referrer === ReplaceFileReferrer.FILE) {
        navigate(
          `${Route.FILES}?id=${newFileId}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
        )
      }
    },
    [navigate, datasetPageUrl, referrer]
  )

  return (
    <>
      <FileUploaderPanelCore
        fileRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        onCancel={handleCancel}
        onFilesAddedSuccess={handleFilesAddedSuccess}
        onFileReplacedSuccess={handleFileReplacedSuccess}
      />

      <ConfirmLeaveModal
        show={navigationBlocker.state === 'blocked'}
        onStay={handleCancelLeavePage}
        onLeave={handleConfirmLeavePage}
      />
    </>
  )
}

export default FileUploaderPanel
