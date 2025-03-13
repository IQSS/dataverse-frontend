import { ChangeEventHandler, DragEventHandler, memo, useRef, useState } from 'react'
import { Accordion, Button, Card, ProgressBar } from '@iqss/dataverse-design-system'
import { ExclamationTriangle, Plus, XLg } from 'react-bootstrap-icons'
import { Trans, useTranslation } from 'react-i18next'
import { Semaphore } from 'async-mutex'
import { toast } from 'react-toastify'
import { md5 } from 'js-md5'
import cn from 'classnames'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import { uploadFile } from '@/files/domain/useCases/uploadFile'
import { useFileUploaderContext } from '../context/FileUploaderContext'
import { FileUploadState, FileUploadStatus } from '../context/fileUploaderReducer'
import { OperationType } from '../FileUploader'
import { FileUploaderHelper } from '../FileUploaderHelper'
import { SwalModal } from '../../swal-modal/SwalModal'
import styles from './FileUploadInput.module.scss'

type FileUploadInputProps = {
  fileRepository: FileRepository
  datasetPersistentId: string
}

const limit = 6
const semaphore = new Semaphore(limit)

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
    config: { operationType, originalFile },
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

  const onFileUploadFailed = (file: File) => {
    removeUploadingToCancel(FileUploaderHelper.getFileKey(file))
    semaphore.release(1)
  }

  const onFileUploadFinished = (file: File) => {
    const hash = md5.create()
    const reader = file.stream().getReader()
    reader
      .read()
      .then(async function updateHash({ done, value }) {
        if (done) {
          updateFile(FileUploaderHelper.getFileKey(file), { checksumValue: hash.hex() })
        } else {
          hash.update(value)
          await updateHash(await reader.read())
        }
      })
      .finally(() => {
        removeUploadingToCancel(FileUploaderHelper.getFileKey(file))
        semaphore.release(1)
      })
  }

  const uploadOneFile = async (file: File) => {
    if (FileUploaderHelper.isDS_StoreFile(file)) {
      toast.info(t('fileUploader.fileUploadSkipped.dsStore'))
      return
    }

    if (
      operationType === OperationType.REPLACE_FILE &&
      originalFile.metadata.type.value !== file.type
    ) {
      const shouldContinue = await requestFileTypeDifferentConfirmation(
        originalFile.metadata.type.value,
        file.type
      )

      if (!shouldContinue) {
        // Reset the file input, otherwise in case user cancels but then tries to upload the same file again, the input will not trigger the change event
        if (inputRef.current) {
          inputRef.current.value = ''
        }
        // Stop the upload process for this file
        return
      }
    }
    // File already uploaded
    if (getFileByKey(FileUploaderHelper.getFileKey(file))) {
      const fileInfo = getFileByKey(FileUploaderHelper.getFileKey(file)) as FileUploadState
      toast.info(
        t('fileUploader.fileUploadSkipped.alreadyUploaded', { fileName: fileInfo.fileName })
      )

      return
    }

    await semaphore.acquire(1)

    const fileKey = FileUploaderHelper.getFileKey(file)

    addFile(file)

    const cancelFunction = uploadFile(
      fileRepository,
      datasetPersistentId,
      file,
      () => {
        updateFile(fileKey, { status: FileUploadStatus.DONE })
        onFileUploadFinished(file)
      },
      () => {
        updateFile(fileKey, { status: FileUploadStatus.FAILED })
        onFileUploadFailed(file)
      },
      (now) => updateFile(fileKey, { progress: now }),
      (storageId) => updateFile(fileKey, { storageId })
    )

    addUploadingToCancel(fileKey, cancelFunction)
  }

  const handleInputFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const filesArray = Array.from(event.target.files || [])

    if (filesArray && filesArray.length > 0) {
      for (const file of filesArray) {
        void uploadOneFile(file)
      }
    }
  }

  // waiting on the possibility to test folder drop: https://github.com/cypress-io/cypress/issues/19696
  const addFromDir = (dir: FileSystemDirectoryEntry) => {
    /* istanbul ignore next */
    const reader = dir.createReader()

    reader.readEntries((entries) => {
      entries.forEach((entry) => {
        if (entry.isFile) {
          const fse = entry as FileSystemFileEntry
          fse.file((file) => {
            const fileWithPath = new File([file], file.name, {
              type: file.type,
              lastModified: file.lastModified
            })

            Object.defineProperty(fileWithPath, 'webkitRelativePath', {
              value: entry.fullPath,
              writable: true
            })

            void uploadOneFile(fileWithPath)
          })
        } else if (entry.isDirectory) {
          addFromDir(entry as FileSystemDirectoryEntry)
        }
      })
    })
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
      if (operationType !== OperationType.REPLACE_FILE && droppedItems.length > 1) {
        toast.error(t('fileUploader.replaceFileMultipleError'))
        return
      }

      Array.from(droppedItems).forEach((droppedFile) => {
        if (droppedFile.webkitGetAsEntry()?.isDirectory) {
          addFromDir(droppedFile.webkitGetAsEntry() as FileSystemDirectoryEntry)
        } else if (droppedFile.webkitGetAsEntry()?.isFile) {
          const fse = droppedFile.webkitGetAsEntry() as FileSystemFileEntry
          fse.file((file) => {
            void uploadOneFile(file)
          })
        }
      })
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
              originalFileType: MimeTypeDisplay[originalFileType],
              replacementFileType: MimeTypeDisplay[replacementFileType]
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
                              <XLg />
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
