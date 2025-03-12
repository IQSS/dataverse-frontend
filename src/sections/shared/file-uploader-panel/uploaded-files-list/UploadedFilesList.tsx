import { useState } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, Table } from '@iqss/dataverse-design-system'
import { File } from '@/files/domain/models/File'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { UploadedFileRow } from './uploaded-file-row/UploadedFileRow'
import { UploadedFileInfo } from './UploadedFileInfo'
import styles from './UploadedFilesList.module.scss'

export interface FilesListFormData {
  files: UploadedFileInfo[]
}

interface UploadedFilesListProps {
  uploadedFilesInfo: UploadedFileInfo[]
  onSaveChanges: (data: FilesListFormData) => Promise<void>
  removeFileFromFileUploaderState: (fileKey: string) => void
  replaceFile?: boolean
  originalFile?: File
  isSaving: boolean
}

export const UploadedFilesList = ({
  uploadedFilesInfo,
  onSaveChanges,
  removeFileFromFileUploaderState,
  replaceFile,
  originalFile,
  isSaving
}: UploadedFilesListProps) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFileInfo[]>([])
  const allFilesSelected = selectedFiles.length === uploadedFilesInfo.length
  const someFilesSelected =
    selectedFiles.length > 0 && selectedFiles.length < uploadedFilesInfo.length

  const handleSelectFile = (file: UploadedFileInfo) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(file)) {
        return prevSelectedFiles.filter((selectedFile) => selectedFile !== file)
      }
      return [...prevSelectedFiles, file]
    })
  }

  const handleToogleAllFiles = () => {
    if (selectedFiles.length === uploadedFilesInfo.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(uploadedFilesInfo)
    }
  }

  const form = useForm<FilesListFormData>({
    mode: 'onChange'
  })

  const { fields: uploadedFilesFieldsFormArray, remove } = useFieldArray({
    control: form.control,
    name: 'files'
  })

  useDeepCompareEffect(() => {
    // Update the form fields with the new files but keep the existing ones with the modified fields values
    const currentFormFilesValues = form.getValues('files')

    const filteredNewFiles = uploadedFilesInfo.filter(
      (uploadedFile) =>
        !currentFormFilesValues.some((currentFile) => currentFile.key === uploadedFile.key)
    )

    // If replacing file, add the original file description to the new file
    if (replaceFile && originalFile && filteredNewFiles.length > 0) {
      if (originalFile.metadata.description) {
        filteredNewFiles[0].description = originalFile.metadata.description
      }
    }

    form.setValue('files', [...currentFormFilesValues, ...filteredNewFiles], {
      shouldValidate: true
    })
  }, [form, uploadedFilesInfo, originalFile, replaceFile])

  const submitForm = (data: FilesListFormData) => {
    void onSaveChanges(data)
  }

  const handleRemoveFileFromList = (fileIndex: number, fileKey: string) => {
    remove(fileIndex)
    removeFileFromFileUploaderState(fileKey)
  }

  const filesLength = uploadedFilesInfo.length

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        noValidate={true}
        data-testid="files-uploaded-form">
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
                      disabled={isSaving}
                    />
                  </div>
                </th>
                <th scope="col" colSpan={1}>
                  {`${filesLength} ${filesLength > 1 ? 'Files' : 'File'} uploaded`}
                </th>
                <th scope="col" colSpan={1}>
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {uploadedFilesFieldsFormArray.map((file, index) => (
                <UploadedFileRow
                  file={file}
                  isSelected={selectedFiles.includes(file)}
                  handleSelectFile={handleSelectFile}
                  handleRemoveFile={handleRemoveFileFromList}
                  itemIndex={index}
                  isSaving={isSaving}
                  key={file.id}
                />
              ))}
            </tbody>
          </Table>
        </div>
        <Button type="submit" disabled={isSaving}>
          Save Changes
        </Button>
      </form>
    </FormProvider>
  )
}
