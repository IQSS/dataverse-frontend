import { ChangeEventHandler, DragEventHandler, useRef, useState } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { Trans, useTranslation } from 'react-i18next'
import { Plus, XLg } from 'react-bootstrap-icons'
import { Semaphore } from 'async-mutex'
import { toast } from 'react-toastify'
import { md5 } from 'js-md5'
import cn from 'classnames'
import { Accordion, Button, Card, ProgressBar } from '@iqss/dataverse-design-system'
import { uploadFile } from '@/files/domain/useCases/uploadFile'
import { FileUploadState, mockFileUploadState, useFileUploader } from './fileUploaderReducer'
import { FileUploaderHelper } from './FileUploaderHelper'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileTypeDifferentModal } from './file-type-different-modal/FileTypeDifferentModal'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import styles from './FileUploader.module.scss'

type FileUploaderProps =
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: boolean
      onUploadedFiles: (files: FileUploadState[]) => void
      isToReplaceFile?: false
      originalFileType?: never
    }
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: false
      onUploadedFiles: (files: FileUploadState[]) => void
      isToReplaceFile: true
      originalFileType: string
    }

type FileStorageConfiguration = 'S3'

const limit = 6
const semaphore = new Semaphore(limit)

// TODO:ME - Check semaphore working ok and not missing somewhere
// TODO:ME - Check the fix validity endpoint to know the hashing algorithm to use

export const FileUploader = ({
  fileRepository,
  datasetPersistentId,
  storageConfiguration,
  multiple,
  onUploadedFiles,
  isToReplaceFile,
  originalFileType
}: FileUploaderProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'fileUploader' })
  const inputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const [uploadingToCancelMap, setUploadingToCancelMap] = useState(new Map<string, () => void>())

  const { state, addFiles, addFile, removeFile, updateFile, getFileByKey } = useFileUploader()

  const totalFiles = Object.keys(state).length
  const uploadingFilesInProgress = Object.values(state).filter((file) => !file.done)
  // const uploadingFilesInProgress = Object.values(mockFileUploadState).filter(
  //   (file) => file.uploading
  // )

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
      toast.info('We avoid uploading a .DS_Store file.')
      return
    }

    if (
      originalFileType &&
      FileUploaderHelper.originalFileAndReplacementFileHaveDifferentTypes(
        file.type,
        originalFileType
      )
    ) {
      // TODO:ME - We need dialog promise types for this

      return
    }

    await semaphore.acquire(1)

    // TODO:ME - There was a sanity check here, needed? or leave it?

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
            if (FileUploaderHelper.isDS_StoreFile(file)) {
              toast.info(`We did not upload the file ${file.name} as it is a .DS_Store file`)
              return
            }
            void uploadOneFile(file)
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
            if (FileUploaderHelper.isDS_StoreFile(file)) {
              toast.info(`We did not upload the file ${file.name} as it is a .DS_Store file`)
              return
            }
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
    }
    setUploadingToCancelMap((x) => {
      x.delete(fileKey)
      return x
    })
    removeFile(fileKey)

    toast.info(`Upload canceled - ${fileName}`)
  }

  useDeepCompareEffect(() => {
    onUploadedFiles(uploadedDoneAndHashedFiles)
  }, [uploadedDoneAndHashedFiles, onUploadedFiles])

  return (
    <div>
      <p className={styles.helper_text}>
        <Trans
          t={t}
          i18nKey="supportedFiles"
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
          <Accordion.Header>{t('accordionTitle')}</Accordion.Header>
          <Accordion.Body>
            <Card>
              <Card.Header>
                <Button
                  onClick={() => inputRef.current?.click()}
                  disabled={!canKeepUploading}
                  size="sm">
                  <Plus size={22} /> {`Select File${multiple ? 's' : ''} to Add`}
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
                          <li className={styles.uploading_file} key={file.key}>
                            <div className={styles.info_progress_wrapper}>
                              <div className={styles.info_wrapper}>
                                <span
                                  className={cn({
                                    [styles.failed]: file.failed
                                  })}>
                                  {file.fileDir ? file.fileDir : file.fileName}
                                </span>
                                <small>{file.fileSizeString}</small>
                              </div>

                              {file.uploading && (
                                <div className={styles.upload_progress}>
                                  <ProgressBar now={file.progress} />
                                </div>
                              )}
                            </div>

                            {/* TODO:ME - Check controlling when to show cancel */}
                            <div className={styles.cancel_upload}>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => cancelUpload(file.key, file.fileName)}>
                                <XLg />
                              </Button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className={styles.drag_drop_msg}>
                      {multiple
                        ? 'Drag and drop files and/or directories here.'
                        : 'Drag and drop file here.'}
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* File Type Different Modal */}
      {originalFileType && (
        <p>holo</p>
        // <FileTypeDifferentModal
        //   show={fileTypeDifferentModalInfo.show}
        //   handleContinue={() =>
        //     setFileTypeDifferentModalInfo((current) => ({ ...current, show: false }))
        //   }
        //   handleDeleteFile={() => {}}
        //   isDeletingFile={false}
        //   errorDeletingFile={null}
        //   originalFileType={MimeTypeDisplay[originalFileType]}
        //   replacementFileType={MimeTypeDisplay[fileTypeDifferentModalInfo.uploadedFileType]}
        // />
      )}
    </div>
  )
}
