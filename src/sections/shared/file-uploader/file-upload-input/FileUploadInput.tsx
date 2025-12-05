import { ChangeEventHandler, DragEventHandler, memo, useCallback, useRef, useState } from 'react'
import { Accordion, Button, Card, ProgressBar } from '@iqss/dataverse-design-system'
import { ExclamationTriangle, Plus, XLg } from 'react-bootstrap-icons'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import cn from 'classnames'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import { useFileUploaderContext } from '../context/FileUploaderContext'
import { FileUploadStatus } from '../context/fileUploaderReducer'
import { OperationType } from '../FileUploader'
import { FileUploaderHelper } from '../FileUploaderHelper'
import { useFileUploadOperations } from '../useFileUploadOperations'
import { SwalModal } from '../../swal-modal/SwalModal'
import { UploaderFileRepository } from '../types'
import styles from './FileUploadInput.module.scss'

type FileUploadInputProps = {
  fileRepository: UploaderFileRepository
  datasetPersistentId: string
}

const FileUploadInput = ({ fileRepository, datasetPersistentId }: FileUploadInputProps) => {
  const {
    fileUploaderState,
    addFile,
    removeFile,
    updateFile,
    addUploadingToCancel,
    removeUploadingToCancel,
    getFileByKey
  } = useFileUploaderContext()

  const {
    config: { operationType, originalFile, checksumAlgorithm },
    uploadingToCancelMap,
    isSaving
  } = fileUploaderState

  const { t } = useTranslation('shared')
  const inputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const totalFiles = Object.keys(fileUploaderState.files).length

  const uploadingFilesInProgress = Object.values(fileUploaderState.files).filter(
    (file) => file.status !== FileUploadStatus.DONE
  )

  const canKeepUploading =
    operationType === OperationType.ADD_FILES_TO_DATASET ? true : totalFiles === 0

  // File type validation for replace operation
  const validateBeforeUpload = useCallback(
    async (file: File): Promise<boolean> => {
      if (
        operationType === OperationType.REPLACE_FILE &&
        originalFile.metadata.type.value !== file.type
      ) {
        const shouldContinue = await requestFileTypeDifferentConfirmation(
          originalFile.metadata.type.value,
          file.type
        )

        if (!shouldContinue) {
          // Reset the file input
          if (inputRef.current) {
            inputRef.current.value = ''
          }
          return false
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestFileTypeDifferentConfirmation is stable within the component
    [operationType, originalFile]
  )

  // Use the shared upload operations hook
  const { uploadOneFile, handleDroppedItems } = useFileUploadOperations({
    fileRepository,
    datasetPersistentId,
    checksumAlgorithm,
    addFile,
    updateFile,
    getFileByKey,
    addUploadingToCancel,
    removeUploadingToCancel,
    validateBeforeUpload,
    onFileSkipped: (reason, file) => {
      if (reason === 'ds_store') {
        toast.info(t('fileUploader.fileUploadSkipped.dsStore'))
      } else if (reason === 'already_uploaded') {
        const fileInfo = getFileByKey(FileUploaderHelper.getFileKey(file))
        if (fileInfo) {
          toast.info(
            t('fileUploader.fileUploadSkipped.alreadyUploaded', { fileName: fileInfo.fileName })
          )
        }
      }
    }
  })

  const handleInputFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const filesArray = Array.from(event.target.files || [])

    if (filesArray && filesArray.length > 0) {
      for (const file of filesArray) {
        void uploadOneFile(file)
      }
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDropFiles: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    if (isSaving) return

    if (operationType === OperationType.REPLACE_FILE && totalFiles > 0) {
      toast.error(t('fileUploader.replaceFileAlreadyOneFileError'))
      return
    }

    const droppedItems = event.dataTransfer.items

    if (droppedItems.length > 0) {
      if (operationType === OperationType.REPLACE_FILE && droppedItems.length > 1) {
        toast.error(t('fileUploader.replaceFileMultipleError'))
        return
      }

      handleDroppedItems(droppedItems)
    }
  }

  const cancelUpload = (fileKey: string, fileName: string) => {
    const cancelFunction = uploadingToCancelMap.get(fileKey)
    if (cancelFunction) {
      cancelFunction()
      toast.info(`Upload canceled - ${fileName}`)
    }
    removeUploadingToCancel(fileKey)

    removeFile(fileKey)
  }

  const requestFileTypeDifferentConfirmation = async (
    originalFileType: string,
    replacementFileType: string
  ): Promise<boolean> => {
    const result = await SwalModal.fire({
      titleText: t('fileUploader.fileTypeDifferentModal.title'),
      showDenyButton: true,
      denyButtonText: t('cancel'),
      confirmButtonText: t('continue'),
      html: (
        <div className={styles.file_type_different_msg}>
          <ExclamationTriangle size={24} />
          <span>
            {t('fileUploader.fileTypeDifferentModal.message', {
              originalFileType:
                MimeTypeDisplay[originalFileType] ?? /* istanbul ignore next */ t('unknown'),
              replacementFileType: MimeTypeDisplay[replacementFileType] ?? t('unknown')
            })}
          </span>
        </div>
      ),
      allowOutsideClick: false,
      allowEscapeKey: false
    })

    return result.isConfirmed
  }

  return (
    <div>
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

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t('fileUploader.accordionTitle')}</Accordion.Header>
          <Accordion.Body>
            <Card>
              <Card.Header>
                <Button
                  onClick={() => inputRef.current?.click()}
                  disabled={!canKeepUploading || isSaving}
                  size="sm">
                  <Plus size={22} />{' '}
                  {operationType === OperationType.ADD_FILES_TO_DATASET
                    ? t('fileUploader.selectFileMultiple')
                    : t('fileUploader.selectFileSingle')}
                </Button>
              </Card.Header>
              <Card.Body>
                <div
                  className={cn(styles.file_uploader_drop_zone, {
                    [styles.is_dragging]: isDragging
                  })}
                  onDrop={handleDropFiles}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  data-testid="file-uploader-drop-zone">
                  <input
                    ref={inputRef}
                    type="file"
                    onChange={handleInputFileChange}
                    multiple={operationType === OperationType.ADD_FILES_TO_DATASET}
                    hidden
                    disabled={!canKeepUploading || isSaving}
                  />

                  {uploadingFilesInProgress.length > 0 ? (
                    <ul className={styles.uploading_files_list}>
                      {uploadingFilesInProgress.map((file) => {
                        return (
                          <li
                            className={cn(styles.uploading_file, {
                              [styles.failed]: file.status === FileUploadStatus.FAILED
                            })}
                            key={file.key}>
                            <div className={styles.info_progress_wrapper}>
                              <p className={styles.info}>
                                <span>
                                  {file.fileDir
                                    ? `${file.fileDir}/${file.fileName}`
                                    : file.fileName}
                                </span>
                                <small>{file.fileSizeString}</small>
                              </p>

                              {file.status === FileUploadStatus.UPLOADING && (
                                <div className={styles.upload_progress}>
                                  <ProgressBar now={file.progress} />
                                </div>
                              )}

                              {file.status === FileUploadStatus.FAILED && (
                                <p className={styles.failed_message}>
                                  {t('fileUploader.uploadFailed')}
                                </p>
                              )}
                            </div>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => cancelUpload(file.key, file.fileName)}>
                              <XLg title={t('fileUploader.cancelUpload')} />
                            </Button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className={styles.drag_drop_msg}>
                      {operationType === OperationType.ADD_FILES_TO_DATASET
                        ? t('fileUploader.dragDropMultiple')
                        : t('fileUploader.dragDropSingle')}
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default memo(FileUploadInput)
