import { useState } from 'react'
import { Form, Table } from '@iqss/dataverse-design-system'
import { FileUploadState } from '@/sections/shared/file-uploader/fileUploaderReducer'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import styles from './UploadedFilesList.module.scss'

interface UploadedFilesListProps {
  uploadedFiles: FileUploadState[]
}

export const UploadedFilesList = ({ uploadedFiles }: UploadedFilesListProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileUploadState[]>([])
  const allFilesSelected = selectedFiles.length === uploadedFiles.length
  const someFilesSelected = selectedFiles.length > 0 && selectedFiles.length < uploadedFiles.length

  const handleSelectFile = (file: FileUploadState) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(file)) {
        return prevSelectedFiles.filter((selectedFile) => selectedFile !== file)
      }
      return [...prevSelectedFiles, file]
    })
  }

  const handleToogleAllFiles = () => {
    if (selectedFiles.length === uploadedFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(uploadedFiles)
    }
  }

  return (
    <div className={styles.table_wrapper}>
      <Table>
        <thead>
          <tr>
            <th scope="col" colSpan={1}>
              <div>
                <RowSelectionCheckbox
                  checked={allFilesSelected}
                  indeterminate={someFilesSelected}
                  onChange={handleToogleAllFiles}
                />
              </div>
            </th>
            <th scope="col" colSpan={1}>
              12 files uploaded
            </th>
            <th scope="col" colSpan={1}>
              Edit
            </th>
          </tr>
        </thead>
        <tbody className={styles.table_body}>
          {uploadedFiles.map((file, index) => (
            <tr key={index}>
              <th colSpan={1}>
                <RowSelectionCheckbox
                  checked={selectedFiles.some((selectedFile) => selectedFile.key === file.key)}
                  onChange={() => handleSelectFile(file)}
                />
              </th>
              <td colSpan={2}>
                <div>{file.fileName}</div>
                <div>{file.fileDir ?? 'empty file path'}</div>
                <div>Description here</div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
