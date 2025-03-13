import { useDeepCompareEffect } from 'use-deep-compare'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { useFileUploaderContext } from './context/FileUploaderContext'
import FileUploadInput from './file-upload-input/FileUploadInput'
import { UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import { ConfirmLeaveModal } from './confirm-leave-modal/ConfirmLeaveModal'

interface FileUploaderPanelProps {
  fileRepository: FileRepository
  datasetPersistentId: string
}

const FileUploaderPanel = ({ fileRepository, datasetPersistentId }: FileUploaderPanelProps) => {
  const { t: tReplaceFile } = useTranslation('replaceFile')
  const navigate = useNavigate()

  const {
    fileUploaderState: { replaceOperationInfo, addFilesToDatasetOperationInfo, files, config },
    uploadedFiles
  } = useFileUploaderContext()

  useDeepCompareEffect(() => {
    if (replaceOperationInfo.success && replaceOperationInfo.newFileIdentifier) {
      toast.success(tReplaceFile('fileReplacedSuccessfully'))
      navigate(
        `${Route.FILES}?id=${replaceOperationInfo.newFileIdentifier}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
      )
    }

    if (addFilesToDatasetOperationInfo.success) {
      // Success! – One or more files have been updated.
      toast.success('One or more files have been updated.')
      navigate(
        `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${datasetPersistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
      )
    }
  }, [
    replaceOperationInfo,
    addFilesToDatasetOperationInfo,
    datasetPersistentId,
    tReplaceFile,
    navigate
  ])

  console.log({ files, originalFile: config.originalFile })

  return (
    <div>
      <FileUploadInput fileRepository={fileRepository} datasetPersistentId={datasetPersistentId} />

      {uploadedFiles.length > 0 && (
        <UploadedFilesList
          fileRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
        />
      )}

      <ConfirmLeaveModal />
    </div>
  )
}

export default FileUploaderPanel
