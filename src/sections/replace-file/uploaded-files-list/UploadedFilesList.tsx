import { useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, Table } from '@iqss/dataverse-design-system'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { UploadedFileRow } from './uploaded-file-row/UploadedFileRow'
import styles from './UploadedFilesList.module.scss'
import { UploadedFileInfo } from './UploadedFileInfo'

interface FilesListFormData {
  files: UploadedFileInfo[]
}

interface UploadedFilesListProps {
  uploadedFilesInfo: UploadedFileInfo[]
  removeFileFromFileUploaderState: (fileKey: string) => void
}

// TODO:ME - FilePath+FileName should not be repeated in the list, maybe on submit only this?
export const UploadedFilesList = ({
  uploadedFilesInfo,
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
    mode: 'onChange',
    values: {
      files: uploadedFilesInfo
    }
  })

  const { fields: uploadedFilesFieldsFormArray } = useFieldArray({
    control: form.control,
    name: 'files'
  })

  // const { submitForm, submitError, submissionStatus } = useSubmitCollection(
  //   mode,
  //   collectionIdOrParentCollectionId,
  //   collectionRepository,
  //   onSubmittedCollectionError
  // )

  const submitForm = (data: FilesListFormData) => {
    console.log({ data })
  }

  const filesLength = uploadedFilesInfo.length

  console.log({ uploadedFilesInfo, uploadedFilesFieldsFormArray })

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
                  key={index}
                  file={file}
                  isSelected={selectedFiles.includes(file)}
                  handleSelectFile={handleSelectFile}
                  handleRemoveFile={removeFileFromFileUploaderState}
                  itemIndex={index}
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
