import { useState } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, Table } from '@iqss/dataverse-design-system'
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
}

export const UploadedFilesList = ({
  uploadedFilesInfo,
  onSaveChanges,
  removeFileFromFileUploaderState
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
    form.setValue('files', [...currentFormFilesValues, ...filteredNewFiles], {
      shouldValidate: true
    })
  }, [form, uploadedFilesInfo])

  // const { submitForm, submitError, submissionStatus } = useSubmitCollection(
  //   mode,
  //   collectionIdOrParentCollectionId,
  //   collectionRepository,
  //   onSubmittedCollectionError
  // )

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
                  key={file.id}
                />
              ))}
            </tbody>
          </Table>
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </FormProvider>
  )
}
