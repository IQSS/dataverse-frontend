import { Button, Col, Form, SelectMultiple } from '@iqss/dataverse-design-system'
import { FileUploadState } from '../../../../files/domain/models/FileUploadState'
import styles from './FileForm.module.scss'
import { FormEvent } from 'react'
import { Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

interface FileFormProps {
  file: FileUploadState
  updateFiles: (file: FileUploadState[]) => void
  tags: string[]
  editTagOptions: () => void
}

export function FileForm({ file, updateFiles, tags, editTagOptions }: FileFormProps) {
  const { t } = useTranslation('uploadDatasetFiles')
  const updateFileName = (file: FileUploadState, updated: string) => {
    file.fileName = updated
    updateFiles([file])
  }
  const updateFileDir = (file: FileUploadState, updated: string) => {
    file.fileDir = updated
    updateFiles([file])
  }
  const updateFileDescription = (file: FileUploadState, updated: string) => {
    file.description = updated
    updateFiles([file])
  }
  const setTags = (file: FileUploadState, tags: string[]) => {
    file.tags = tags
    updateFiles([file])
  }

  return (
    <div className={styles.file_form}>
      <Form>
        <Form.Group>
          <Form.Group.Label column sm={3}>
            {t('fileForm.fileName')}
          </Form.Group.Label>
          <Col sm={9}>
            <Form.Group.Input
              type="text"
              placeholder={t('fileForm.fileName')}
              defaultValue={file.fileName}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                updateFileName(file, event.currentTarget.value)
              }
            />
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Group.Label column sm={3}>
            {t('fileForm.filePath')}
          </Form.Group.Label>
          <Col sm={9}>
            <Form.Group.Input
              type="text"
              placeholder={t('fileForm.filePath')}
              defaultValue={file.fileDir}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                updateFileDir(file, event.currentTarget.value)
              }
            />
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Group.Label column sm={3}>
            {t('fileForm.description')}
          </Form.Group.Label>
          <Col sm={9}>
            <Form.Group.TextArea
              defaultValue={file.description}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                updateFileDescription(file, event.currentTarget.value)
              }
            />
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Group.Label column sm={3}>
            {t('fileForm.tags')}
          </Form.Group.Label>
          <Col sm={9} className={styles.tags}>
            <div className={styles.tags_select} title={t('fileForm.selectTags')}>
              <SelectMultiple
                options={tags}
                onChange={(newTags) => setTags(file, newTags)}></SelectMultiple>
            </div>
            <Button
              className={styles.edit_tags_btn}
              variant="secondary"
              type="button"
              {...{ size: 'sm' }}
              withSpacing
              title={t('fileForm.editTagOptions')}
              onClick={editTagOptions}>
              <Plus className={styles.icon} title={t('fileForm.plus')} />
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}
