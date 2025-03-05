import { ChangeEventHandler, DragEventHandler, useRef, useState } from 'react'
import { Semaphore } from 'async-mutex'
import { md5 } from 'js-md5'
import cn from 'classnames'
import { Button, Card, ProgressBar } from '@iqss/dataverse-design-system'
import { uploadFile } from '@/files/domain/useCases/uploadFile'
import { Plus, X } from 'react-bootstrap-icons'
import { useFileUploader } from './fileUploaderReducer'
import { FileUploaderHelper } from './FileUploaderHelper'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import styles from './FileUploader.module.scss'
import { toast } from 'react-toastify'

interface FileUploaderProps {
  fileRepository: FileRepository
  datasetPersistentId: string
  storageConfiguration: FileStorageConfiguration
  multiple: boolean
  onUploadedFiles: (files: File[]) => void
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
  onUploadedFiles
}: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { state, addFiles, addFile, removeFile, updateFile, getFileByKey } = useFileUploader()
  const [uploadingToCancelMap, setUploadingToCancelMap] = useState(new Map<string, () => void>())

  const totalFiles = Object.keys(state).length
  const uploadingFilesInProgress = Object.values(state).filter((file) => file)
  // const uploadingFilesInProgress = Object.values(state).filter((file) => file.uploading)
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
    await semaphore.acquire(1)

    // TODO:ME - There was a sanity check here, needed? or leave it?

    const fileKey = FileUploaderHelper.getFileKey(file)
    console.log(state)
    console.log({ fileKey })

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

  // waiting on the possibility to test folder drop: https://github.com/cypress-io/cypress/issues/19696
  const addFromDir = (dir: FileSystemDirectoryEntry) => {
    /* istanbul ignore next */
    const reader = dir.createReader()

    reader.readEntries((entries) => {
      entries.forEach((entry) => {
        if (entry.isFile) {
          const fse = entry as FileSystemFileEntry
          fse.file((file) => {
            void uploadOneFile(file)
          })
        } else if (entry.isDirectory) {
          addFromDir(entry as FileSystemDirectoryEntry)
        }
      })
    })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const filesArray = Array.from(event.target.files || [])

    if (filesArray && filesArray.length > 0) {
      for (const file of filesArray) {
        void uploadOneFile(file)
      }
    }
  }

  // Avoid dropping if can't keep uploading
  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()

    console.log({ canKeepUploading })

    if (!canKeepUploading) {
      return
    }

    const droppedItems = event.dataTransfer.items

    if (droppedItems.length > 0) {
      Array.from(droppedItems).forEach((droppedFile) => {
        if (droppedFile.webkitGetAsEntry()?.isDirectory) {
          addFromDir(droppedFile.webkitGetAsEntry() as FileSystemDirectoryEntry)
        } else if (droppedFile.webkitGetAsEntry()?.isFile) {
          const fse = droppedFile.webkitGetAsEntry() as FileSystemFileEntry
          fse.file((file) => void uploadOneFile(file))
        }
      })
    }
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
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

  console.log(state)

  return (
    <Card>
      <Card.Header>
        <Button
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={!canKeepUploading}>
          <Plus></Plus> {`Select file${multiple ? 's' : ''} to add`}
          {/* {selectText} */}
        </Button>
      </Card.Header>
      <Card.Body>
        <div
          className={styles.file_uploader}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          //   onDragEnter={handleDragEnter}
          //   onDragLeave={handleDragLeave}
          data-testid="file-uploader-drop-zone"
          //   style={{ backgroundColor: bgColor }}
          style={{ minHeight: '300px', border: 'solid 1px red' }}>
          <div>
            <input
              ref={inputRef}
              type="file"
              onChange={handleChange}
              multiple={multiple}
              hidden
              disabled={!canKeepUploading}
            />
          </div>
          {uploadingFilesInProgress.length > 0 ? (
            <div className="uploading-files-list">
              {uploadingFilesInProgress.map((file) => {
                return (
                  <div className={styles.file} key={file.key}>
                    <div
                      className={cn(styles.file_name, {
                        [styles.failed]: file.failed
                      })}>
                      {file.fileDir ? file.fileDir : file.fileName}
                    </div>
                    <div className={styles.file_size}>{file.fileSizeString}</div>
                    {file.uploading && (
                      <div className={styles.upload_progress}>
                        <ProgressBar now={file.progress} />
                      </div>
                    )}

                    <div className={styles.cancel_upload}>
                      <Button
                        variant="secondary"
                        size="sm"
                        withSpacing
                        onClick={() => cancelUpload(file.key, file.fileName)}>
                        <X
                          className={styles.icon}
                          // title={cancelTitle}
                        />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={styles.info}>Drag and drop files and/or directories here</div>
          )}
          {/* {files.filter((x) => !FileUploaderHelper.get(x, fileUploaderState).done).length > 0 ? (
            <div className={styles.files}>
              {files
                .filter((x) => !FileUploaderHelper.get(x, fileUploaderState).done)
                .map((file) => (
                  <div className={styles.file} key={FileUploaderHelper.key(file)}>
                    <div
                      className={cn(styles.file_name, {
                        [styles.failed]: FileUploaderHelper.get(file, fileUploaderState).failed
                      })}>
                      {file.webkitRelativePath ? file.webkitRelativePath : file.name}
                    </div>
                    <div className={styles.file_size}>
                      {FileUploaderHelper.get(file, fileUploaderState).fileSizeString}
                    </div>
                    <div className={styles.upload_progress}>
                      {FileUploaderHelper.get(file, fileUploaderState).progressHidden ? null : (
                        <ProgressBar
                          now={FileUploaderHelper.get(file, fileUploaderState).progress}
                        />
                      )}
                    </div>
                    <div className={styles.cancel_upload}>
                      <Button
                        variant="secondary"
                        {...{ size: 'sm' }}
                        withSpacing
                        onClick={() => cancelUpload(file)}>
                        <X className={styles.icon} title={cancelTitle} />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className={styles.info}>{info}</div>
          )} */}
        </div>
      </Card.Body>
    </Card>
  )
}
