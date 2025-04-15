import { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, Button, Spinner, Stack, Table } from '@iqss/dataverse-design-system'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { EditFileMetadataRow } from '@/sections/edit-file-metadata/EditFileMetadataRow'
import { SubmissionStatus, useSubmitFileMetadata } from './useSubmitFileMetadata'
import { EditFileMetadataReferrer } from '@/sections/edit-file-metadata/EditFileMetadata'
import styles from './EditFilesList.module.scss'

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

type EditFilesListProps = {
  fileRepository: FileRepository
  editFileMetadataFormData: EditFileMetadataFormData
  referrer: EditFileMetadataReferrer
  datasetPersistentId?: string
}

export const EditFilesList = ({
  fileRepository,
  editFileMetadataFormData,
  referrer,
  datasetPersistentId
}: EditFilesListProps) => {
  const { t } = useTranslation('shared')
  const navigate = useNavigate()
  const form = useForm<EditFileMetadataFormData>({ mode: 'onChange' })
  const onSubmitSucceed = () => {
    toast.success('File metadata updated successfully')
    if (datasetPersistentId && referrer === EditFileMetadataReferrer.DATASET) {
      navigate(
        `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${datasetPersistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
      )
    } else {
      navigate(
        `${Route.FILES}?id=${editFileMetadataFormData.files[0].id}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
      )
    }
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
        data-testid="edit-file-metadata-form">
        <Stack>
          {submitError && (
            <Alert variant="danger" data-testid="submit-error">
              {submitError}
            </Alert>
          )}
          <div className={styles.table_wrapper}>
            <Table>
              <thead>
                <tr>
                  <th scope="col" colSpan={1} className={styles.align_left}>
                    {`${editFileMetadataFormData.files.length} ${
                      editFileMetadataFormData.files.length > 1 ? t('files') : t('file')
                    }`}
                  </th>
                </tr>
              </thead>
              <tbody className={styles.table_body}>
                {editFileMetadataFormData.files.map((file, index) => (
                  <EditFileMetadataRow file={file} itemIndex={index} key={file.id} />
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
