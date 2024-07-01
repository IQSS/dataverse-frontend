import { Badge, Button, Col, Form } from '@iqss/dataverse-design-system'
import { FileUploadState } from '../../../../files/domain/models/FileUploadState'
import styles from './FileForm.module.scss'
import { FormEvent, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'react-bootstrap-icons'

interface FileFormProps {
  file: FileUploadState
  availableTags: string[]
  updateFiles: (file: FileUploadState[]) => void
  addTagTo: (file: FileUploadState) => void
}

export function FileForm({ file, availableTags, updateFiles, addTagTo }: FileFormProps) {
  const { t } = useTranslation('uploadDatasetFiles')
  const tagsSelectId = useId()
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
  const toggleTag = (file: FileUploadState, tag: string) => {
    if (file.tags.includes(tag)) {
      delete file.tags[file.tags.indexOf(tag)]
    } else {
      file.tags.push(tag)
    }
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
          <Form.Group.Label column sm={3} htmlFor={tagsSelectId}>
            {t('fileForm.tags')}
          </Form.Group.Label>
          <Col sm={9} className={styles.tags}>
            <div className={styles.tags_select} title={t('fileForm.selectTags')}>
              <div>
                {availableTags.map((o) => (
                  <span key={o} onClick={() => toggleTag(file, o)}>
                    <Badge variant={file.tags.includes(o) ? 'primary' : 'secondary'}>
                      {o}
                      {file.tags.includes(o) ? <X /> : <Plus />}
                    </Badge>
                  </span>
                ))}
              </div>
            </div>
            <Button
              className={styles.edit_tags_btn}
              variant="secondary"
              type="button"
              title={t('fileForm.editTagOptions')}
              onClick={() => addTagTo(file)}>
              <Plus title={t('fileForm.plus')} size={20} />
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}