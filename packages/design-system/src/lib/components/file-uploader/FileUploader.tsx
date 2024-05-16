/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeEventHandler, DragEventHandler, useEffect, useState } from 'react'
import { ProgressBar, Card } from 'react-bootstrap'
import { Button } from '../button/Button'
import { Plus, X } from 'react-bootstrap-icons'
import styles from './FileUploader.module.scss'
import React from 'react'

export interface FileUploaderProps {
  upload: (files: File[]) => Map<string, FileUploadState>
  cancelTitle: string
  info: string
  selectText: string
}

export interface FileUploadState {
  progress: number
  fileSizeString: string
  failed: boolean
  done: boolean
  removed: boolean
}

export function FileUploader({ upload, cancelTitle, info, selectText }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(new Map<string, FileUploadState>())

  const addFiles = (selectedFiles: FileList | null) => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((alreadyAdded) => {
        const selectedFilesArray = Array.from(selectedFiles)
        const selectedFilesSet = new Set(
          selectedFilesArray.map((x) => x.webkitRelativePath + x.name)
        )
        const allreadyAddedFiltered = alreadyAdded.filter(
          (x) => !selectedFilesSet.has(x.webkitRelativePath + x.name)
        )
        return [...allreadyAddedFiltered, ...selectedFilesArray]
      })
    }
  }

  const addFile = (f: File) => {
    setFiles((alreadyAdded) => {
      const allreadyAddedFiltered = alreadyAdded.filter(
        (x) => x.webkitRelativePath + x.name !== f.webkitRelativePath + f.name
      )
      return [...allreadyAddedFiltered, f]
    })
  }

  const addFromDir = (dir: FileSystemDirectoryEntry) => {
    const reader = dir.createReader()
    reader.readEntries((entries) => {
      entries.forEach((entry) => {
        if (entry.isFile) {
          const fse = entry as FileSystemFileEntry
          fse.file((f) => addFile(f))
        } else if (entry.isDirectory) {
          addFromDir(entry as FileSystemDirectoryEntry)
        }
      })
    })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    addFiles(event.target.files)
  }

  const handleDrag: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const droppedItems = event.dataTransfer.items
    let ok = false
    if (droppedItems.length > 0) {
      Array.from(droppedItems).forEach((i) => {
        if (i.webkitGetAsEntry()?.isDirectory) {
          ok = true
          addFromDir(i.webkitGetAsEntry() as FileSystemDirectoryEntry)
        } else if (i.webkitGetAsEntry()?.isFile) {
          ok = true
          const fse = i.webkitGetAsEntry() as FileSystemFileEntry
          fse.file((f) => addFile(f))
        }
      })
    }
    const selectedFiles = event.dataTransfer.files
    if (!ok && selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
  }

  const handleRemoveFile = (f: File) => {
    setFiles((alreadyAdded) => [...alreadyAdded].filter((x) => x !== f))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(upload(files))
      setFiles([...files].filter((x) => !progress.get(x.webkitRelativePath + x.name)?.removed))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [files, upload])

  const inputRef = React.useRef(null)

  return (
    <Card>
      <Card.Header>
        <Button variant="secondary" onClick={() => (inputRef.current! as HTMLInputElement).click()}>
          <Plus></Plus> {selectText}
        </Button>
      </Card.Header>
      <Card.Body>
        <div
          className={styles.fileuploader}
          onDrop={handleDrag}
          onDragOver={(event) => event.preventDefault()}>
          <div>
            <input
              ref={inputRef}
              type="file"
              id="filepicker"
              onChange={handleChange}
              multiple
              hidden
            />
          </div>
          {files.length > 0 ? (
            <div className={styles.files}>
              <div className={styles.group}>
                {files
                  .filter((x) => !progress.get(x.webkitRelativePath + x.name)?.done)
                  .map((file) => (
                    <>
                      <div className={styles.file} key={file.webkitRelativePath + file.name}>
                        <div className={styles.cell}></div>
                        <div
                          className={
                            progress.get(file.webkitRelativePath + file.name)?.failed
                              ? styles.failed
                              : styles.cell
                          }>
                          {file.webkitRelativePath}
                          {file.name}
                        </div>
                        <div className={styles.cell}>
                          {progress.get(file.webkitRelativePath + file.name)?.fileSizeString}
                        </div>
                        <div className={styles.cell}>
                          <ProgressBar
                            className={styles.progress}
                            now={progress.get(file.webkitRelativePath + file.name)?.progress}
                          />
                        </div>
                        <div className={styles.cell}>
                          <Button
                            variant="secondary"
                            {...{ size: 'sm' }}
                            withSpacing
                            onClick={() => handleRemoveFile(file)}>
                            <X className={styles.icon} title={cancelTitle} />
                          </Button>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          ) : (
            <div className={styles.info}>{info}</div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
