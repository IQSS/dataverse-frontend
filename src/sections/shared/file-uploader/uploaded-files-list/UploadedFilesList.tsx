import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDeepCompareEffect } from 'use-deep-compare'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, DropdownButton, DropdownButtonItem, Table } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { useReplaceFile } from '../useReplaceFile'
import { UploadedFileRow } from './uploaded-file-row/UploadedFileRow'
import { useFileUploaderContext } from '../context/FileUploaderContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { UploadedFile } from '../context/fileUploaderReducer'
import { OperationType } from '../FileUploader'
import styles from './UploadedFilesList.module.scss'

// import { addUploadedFiles } from '@/files/domain/useCases/addUploadedFiles'

export interface FilesListFormData {
  files: UploadedFile[]
}

interface UploadedFilesListProps {
  fileRepository: FileRepository
  datasetPersistentId: string
}

export const UploadedFilesList = ({
  fileRepository,
  datasetPersistentId
}: UploadedFilesListProps) => {
  const { t } = useTranslation('replaceFile')
  const navigate = useNavigate()

  const {
    fileUploaderState: {
      isSaving,
      config: { operationType, originalFile }
    },
    uploadedFiles,
    removeFile
  } = useFileUploaderContext()

  const { submitReplaceFile } = useReplaceFile(fileRepository)

  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const allFilesSelected = selectedFiles.length === uploadedFiles.length
  const someFilesSelected = selectedFiles.length > 0 && selectedFiles.length < uploadedFiles.length

  const handleSelectFile = (fileKey: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(fileKey)) {
        return prev.filter((key) => key !== fileKey)
      }
      return [...prev, fileKey]
    })
  }

  const handleToogleAllFiles = () => {
    if (selectedFiles.length === uploadedFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(uploadedFiles.map((file) => file.key))
    }
  }

  const form = useForm<FilesListFormData>({ mode: 'onChange' })

  const { fields: uploadedFilesFieldsFormArray, remove } = useFieldArray({
    control: form.control,
    name: 'files'
  })

  useDeepCompareEffect(() => {
    // Update the form fields with the new files but keep the existing ones with the modified fields values
    const currentFormFilesValues = form.getValues('files')

    const filteredNewFiles = uploadedFiles.filter(
      (uploadedFile) =>
        !currentFormFilesValues.some((currentFile) => currentFile.key === uploadedFile.key)
    )

    form.setValue('files', [...currentFormFilesValues, ...filteredNewFiles], {
      shouldValidate: true
    })
  }, [form, uploadedFiles])

  const submitForm = (data: FilesListFormData) => {
    if (OperationType.REPLACE_FILE === operationType) {
      void submitReplaceFile(originalFile.id, data.files[0])
    }

    // if (OperationType.ADD_FILES_TO_DATASET === operationType) {
    //   // void submitAddFilesToDataset(data)

    //   void addUploadedFiles
    // }
  }

  const handleRemoveFileFromList = (fileIndex: number, fileKey: string) => {
    // TODO - Apart from removing from the form list and the state, we should call an api to remove the file from the S3 bucket
    remove(fileIndex)
    removeFile(fileKey)
  }

  const handleRemoveSelectedFilesFromList = () => {
    const newFiles = uploadedFilesFieldsFormArray.filter(
      (file) => !selectedFiles.includes(file.key)
    )

    newFiles.forEach((file, index) => {
      handleRemoveFileFromList(index, file.key)
    })

    // form.setValue('files', newFiles)
    setSelectedFiles([])

    // selectedFiles.forEach((fileKey) => {
    //   removeFileFromFileUploaderState(fileKey)
    // })
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
                  {`${uploadedFiles.length} ${
                    uploadedFiles.length > 1 ? 'Files' : 'File'
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
