import { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button, Spinner, Stack, Table } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import styles from './EditFilesList.module.scss'
import { EditFileMetadataRow } from '@/sections/edit-file-metadata/EditFileMetadataRow'
import { SubmissionStatus, useSubmitFileMetadata } from './useSubmitFileMetadata'

export interface FileMetadataFormRow {
  id: number
  fileName: string
  fileType: string
  fileSizeString: string
  checksumValue?: string
  checksumAlgorithm?: string
  description?: string
  fileDir?: string
}
export interface EditFileMetadataFormData {
  files: FileMetadataFormRow[]
}

interface EditFilesListProps {
  fileRepository: FileRepository
  editFileMetadataFormData: EditFileMetadataFormData
}

export const EditFilesList = ({ fileRepository, editFileMetadataFormData }: EditFilesListProps) => {
  const { t } = useTranslation('shared')
  const navigate = useNavigate()
  const form = useForm<EditFileMetadataFormData>({ mode: 'onChange' })
  const onSubmitSucceed = () => {
    console.log('File metadata updated successfully')
    // Add any additional actions to be taken upon successful submission
  }
  const { submitForm, submissionStatus, submitError } = useSubmitFileMetadata(
    fileRepository,
    onSubmitSucceed
  )
  const isSaving = submissionStatus === SubmissionStatus.IsSubmitting
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
                    {`${editFileMetadataFormData.files.length} ${
                      editFileMetadataFormData.files.length > 1 ? t('files') : t('file')
                    }`}
                  </th>
                </tr>
              </thead>
              <tbody className={styles.table_body}>
                {editFileMetadataFormData.files.map((file, index) => (
                  <EditFileMetadataRow
                    isSaving={isSaving}
                    file={file}
                    itemIndex={index}
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
                      <Button type="submit" disabled={isSaving}>
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
