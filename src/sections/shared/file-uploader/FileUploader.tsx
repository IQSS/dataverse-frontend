import {
  ChangeEventHandler,
  DragEventHandler,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { Trans, useTranslation } from 'react-i18next'
import { ExclamationTriangle, Plus, XLg } from 'react-bootstrap-icons'
import { Semaphore } from 'async-mutex'
import { toast } from 'react-toastify'
import { md5 } from 'js-md5'
import cn from 'classnames'
import { Accordion, Button, Card, ProgressBar } from '@iqss/dataverse-design-system'
import { uploadFile } from '@/files/domain/useCases/uploadFile'
import { useGetFixityAlgorithm } from './useGetFixityAlgorithm'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import { FileUploadState, mockFileUploadState, useFileUploader } from './fileUploaderReducer'
import { FileUploaderHelper } from './FileUploaderHelper'
import { SwalModal } from '../swal-modal/SwalModal'
import { LoadingConfigSpinner } from './loading-config-spinner/LoadingConfigSpinner'
import styles from './FileUploader.module.scss'

type FileUploaderProps =
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: boolean
      onUploadedFiles: (files: FileUploadState[]) => void
      replaceFile?: false
      originalFileType?: never
    }
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: false
      onUploadedFiles: (files: FileUploadState[]) => void
      replaceFile: true
      originalFileType: string
    }

type FileStorageConfiguration = 'S3'

const limit = 6
const semaphore = new Semaphore(limit)

export type FileUploaderRef = {
  removeUploadedFile: (fileKey: string) => void
}

const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  (
    {
      fileRepository,
      datasetPersistentId,
      storageConfiguration,
      multiple,
      onUploadedFiles,
      replaceFile,
      originalFileType
    },
    ref
  ) => {
    const { t } = useTranslation('shared')
    const inputRef = useRef<HTMLInputElement>(null)
    const { fixityAlgorithm, isLoadingFixityAlgorithm } = useGetFixityAlgorithm(fileRepository)

    const [isDragging, setIsDragging] = useState(false)

    const [uploadingToCancelMap, setUploadingToCancelMap] = useState(new Map<string, () => void>())

    const { state, addFile, removeFile, updateFile, getFileByKey } = useFileUploader()

    const totalFiles = Object.keys(state).length
    const uploadingFilesInProgress = Object.values(state).filter((file) => !file.done)

    const uploadedDoneAndHashedFiles = Object.values(state).filter(
      (file) => file.done && file.checksumValue
    )
    const canKeepUploading = multiple ? true : totalFiles === 0

    const onFileUploadFailed = (file: File) => {
      setUploadingToCancelMap((x) => {
        x.delete(FileUploaderHelper.getFileKey(file))
        return x
      })
      semaphore.release(1)
    }

    const onFileUploadFinished = (file: File) => {
      // TODO:ME - Here we should create the hash with the fixityAlgorithm
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
          setUploadingToCancelMap((x) => {
            x.delete(FileUploaderHelper.getFileKey(file))
            return x
          })
          semaphore.release(1)
        })
    }

    const uploadOneFile = async (file: File) => {
      if (FileUploaderHelper.isDS_StoreFile(file)) {
        toast.info(t('fileUploader.fileUploadSkipped.dsStore'))
        return
      }

      if (replaceFile && originalFileType !== file.type) {
        const shouldContinue = await requestFileTypeDifferentConfirmation(
          originalFileType,
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

      updateFile(fileKey, { uploading: true })

      const cancelFunction = uploadFile(
        fileRepository,
        datasetPersistentId,
        file,
        () => {
          updateFile(fileKey, { done: true, uploading: false })
          onFileUploadFinished(file)
        },
        () => {
          updateFile(fileKey, { failed: true, uploading: false })
          onFileUploadFailed(file)
        },
        (now) => updateFile(fileKey, { progress: now }),
        (storageId) => updateFile(fileKey, { storageId })
      )

      setUploadingToCancelMap((x) => x.set(fileKey, cancelFunction))
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
      setIsDragging(false)

      if (!canKeepUploading) return

      const droppedItems = event.dataTransfer.items

      if (droppedItems.length > 0) {
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
      setUploadingToCancelMap((x) => {
        x.delete(fileKey)
        return x
      })
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

    useImperativeHandle(ref, () => ({
      removeUploadedFile: (fileKey: string) => {
        removeFile(fileKey)
      }
    }))

    useDeepCompareEffect(() => {
      onUploadedFiles(uploadedDoneAndHashedFiles)
    }, [uploadedDoneAndHashedFiles, onUploadedFiles])

    if (isLoadingFixityAlgorithm) return <LoadingConfigSpinner />

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
                    disabled={!canKeepUploading}
                    size="sm">
                    <Plus size={22} />{' '}
                    {multiple
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
                      multiple={multiple}
                      hidden
                      disabled={!canKeepUploading}
                    />

                    {uploadingFilesInProgress.length > 0 ? (
                      <ul className={styles.uploading_files_list}>
                        {uploadingFilesInProgress.map((file) => {
                          return (
                            <li
                              className={cn(styles.uploading_file, {
                                [styles.failed]: file.failed
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

                                {file.uploading && !file.failed && (
                                  <div className={styles.upload_progress}>
                                    <ProgressBar now={file.progress} />
                                  </div>
                                )}

                                {file.failed && (
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
                        {multiple
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
)

FileUploader.displayName = 'FileUploader'

export default memo(FileUploader)
