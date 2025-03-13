import { useState } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, DropdownButton, DropdownButtonItem, Table } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { UploadedFileRow } from './uploaded-file-row/UploadedFileRow'
import { UploadedFileInfo } from './UploadedFileInfo'
import { useFileUploaderContext } from '../context/FileUploaderContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import styles from './UploadedFilesList.module.scss'

export interface FilesListFormData {
  files: UploadedFileInfo[]
}

interface UploadedFilesListProps {
  fileRepository: FileRepository
  datasetPersistentId: string
}

export const UploadedFilesList = ({
  fileRepository,
  datasetPersistentId
}: UploadedFilesListProps) => {
  const {
    fileUploaderState,
    addFile,
    removeFile,
    updateFile,
    addUploadingToCancel,
    removeUploadingToCancel,
    getFileByKey
  } = useFileUploaderContext()

  // const {
  //   config: { operationType, originalFile },
  //   uploadingToCancelMap,
  //   isSaving
  // } = fileUploaderState

  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const allFilesSelected = selectedFiles.length === uploadedFilesInfo.length
  const someFilesSelected =
    selectedFiles.length > 0 && selectedFiles.length < uploadedFilesInfo.length

  const handleSelectFile = (fileKey: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(fileKey)) {
        return prev.filter((key) => key !== fileKey)
      }
      return [...prev, fileKey]
    })
  }

  const handleToogleAllFiles = () => {
    if (selectedFiles.length === uploadedFilesInfo.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(uploadedFilesInfo.map((file) => file.key))
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

  const handleRemoveSelectedFilesFromList = () => {
    const newFiles = uploadedFilesFieldsFormArray.filter(
      (file) => !selectedFiles.includes(file.key)
    )

    form.setValue('files', newFiles)
    setSelectedFiles([])

    selectedFiles.forEach((fileKey) => {
      removeFileFromFileUploaderState(fileKey)
    })
  }

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
                  {`${uploadedFilesInfo.length} ${
                    uploadedFilesInfo.length > 1 ? 'Files' : 'File'
                  } uploaded`}
                </th>
                <th scope="col" colSpan={1}>
                  <div className={styles.edit_dropdown}>
                    <DropdownButton
                      id="edit-selected-files-menu"
                      icon={<PencilFill className={styles.edit_dropdown_icon} />}
                      title="Edit"
                      ariaLabel="Edit selected files"
                      variant="secondary"
                      disabled={selectedFiles.length === 0 || isSaving}>
                      <DropdownButtonItem onClick={handleRemoveSelectedFilesFromList}>
                        Delete selected files
                      </DropdownButtonItem>
                    </DropdownButton>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {uploadedFilesFieldsFormArray.map((file, index) => (
                <UploadedFileRow
                  file={file}
                  isSelected={selectedFiles.includes(file.key)}
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
