import { KeyboardEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDeepCompareEffect } from 'use-deep-compare'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import {
  Button,
  DropdownButton,
  DropdownButtonItem,
  Spinner,
  Stack,
  Table
} from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { useReplaceFile } from '../useReplaceFile'
import { useAddUploadedFilesToDataset } from '../useAddUploadedFilesToDataset'
import { UploadedFileRow } from './uploaded-file-row/UploadedFileRow'
import { useFileUploaderContext } from '../context/FileUploaderContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileUploadStatus, UploadedFile } from '../context/fileUploaderReducer'
import { OperationType } from '../FileUploader'
import styles from './UploadedFilesList.module.scss'

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
  const { t } = useTranslation('shared')
  const navigate = useNavigate()

  const {
    fileUploaderState: {
      files,
      isSaving,
      config: { operationType, originalFile }
    },
    uploadedFiles,
    removeFile
  } = useFileUploaderContext()

  const anyFileUploading = useMemo(() => {
    return Object.values(files).some((file) => file.status === FileUploadStatus.UPLOADING)
  }, [files])

  const { submitReplaceFile } = useReplaceFile(fileRepository)
  const { submitUploadedFilesToDataset } = useAddUploadedFilesToDataset(
    fileRepository,
    datasetPersistentId
  )

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

  const handleToggleAllFiles = () => {
    if (selectedFiles.length === uploadedFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(uploadedFiles.map((file) => file.key))
    }
  }

  const form = useForm<FilesListFormData>({ mode: 'onChange' })

  const { fields: uploadedFilesFieldsFormArray, remove: removeFormField } = useFieldArray({
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

    if (OperationType.ADD_FILES_TO_DATASET === operationType) {
      void submitUploadedFilesToDataset(data.files)
    }
  }

  const handleRemoveFileFromList = (fileIndex: number, fileKey: string) => {
    // TODO - Remove the file from the S3 bucket we need an API endpoint for this.
    removeFormField(fileIndex)
    removeFile(fileKey)
  }

  const handleRemoveSelectedFilesFromList = () => {
    // TODO - Remove the files from the S3 bucket we need an API endpoint for this.
    const newFiles = uploadedFilesFieldsFormArray.filter(
      (file) => !selectedFiles.includes(file.key)
    )

    form.setValue('files', newFiles)
    setSelectedFiles([])

    selectedFiles.forEach((fileKey) => {
      removeFile(fileKey)
    })
  }

  const handleCancel = () => navigate(-1)

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false
    const isTextarea = e.target instanceof HTMLTextAreaElement

    if (isButtonTypeSubmit || isTextarea) {
      return
    }

    e.preventDefault()
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        onKeyDown={handleKeyDown}
        noValidate={true}
        data-testid="uploaded-files-list-form">
        <Stack>
          <div className={styles.table_wrapper}>
            <Table>
              <thead>
                <tr>
                  <th scope="col" colSpan={1}>
                    <div>
                      <RowSelectionCheckbox
                        checked={allFilesSelected}
                        indeterminate={someFilesSelected}
                        onChange={handleToggleAllFiles}
                        disabled={isSaving}
                        aria-label={
                          allFilesSelected
                            ? t('fileUploader.uploadedFilesList.deselectAllFiles')
                            : t('fileUploader.uploadedFilesList.selectAllFiles')
                        }
                      />
                    </div>
                  </th>
                  <th scope="col" colSpan={1}>
                    {`${uploadedFiles.length} ${
                      uploadedFiles.length > 1
                        ? t('fileUploader.uploadedFilesList.uploadedFiles')
                        : t('fileUploader.uploadedFilesList.uploadedFile')
                    }`}
                  </th>
                  <th scope="col" colSpan={1}>
                    <div className={styles.edit_dropdown}>
                      <DropdownButton
                        id="edit-selected-files-menu"
                        icon={<PencilFill className={styles.edit_dropdown_icon} />}
                        title="Edit"
                        ariaLabel={t('fileUploader.uploadedFilesList.editSelectedFiles')}
                        variant="secondary"
                        disabled={selectedFiles.length === 0 || isSaving}>
                        <DropdownButtonItem onClick={handleRemoveSelectedFilesFromList}>
                          {t('fileUploader.uploadedFilesList.removeSelectedFiles')}
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
              <tfoot>
                <tr>
                  <td colSpan={3}>
                    <div className={styles.btns_container}>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        variant="secondary">
                        {t('cancel')}
                      </Button>
                      <Button type="submit" disabled={isSaving || anyFileUploading}>
                        <Stack direction="horizontal" gap={1}>
                          {t('saveChanges')}
                          {isSaving && <Spinner variant="light" animation="border" size="sm" />}
                        </Stack>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
