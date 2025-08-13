import { ChangeEvent, useState, KeyboardEvent, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Button, Col, Form } from '@iqss/dataverse-design-system'
import { Plus, X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../../../files/domain/models/FileUploadState'
import styles from './FileForm.module.scss'

interface FileFormProps {
  file: FileUploadState
  availableTags: string[]
  updateFiles: (file: FileUploadState[]) => void
  setTagOptions: (tags: string[]) => void
}

export function FileForm({ file, availableTags, updateFiles, setTagOptions }: FileFormProps) {
  const { t } = useTranslation('uploadDatasetFiles')
  const [tag, setTag] = useState('')
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
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTagOption()
      event.preventDefault()
    }
  }
  const addTagOption = () => {
    if (tag && !availableTags.includes(tag)) {
      setTagOptions([...availableTags, tag])
      file.tags.push(tag)
      setTag('')
      updateFiles([file])
    }
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
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
              <div className={styles.tags} onKeyDown={handleEnter}>
                <Form.Group.Input
                  type="text"
                  placeholder={t('tags.addCustomTag')}
                  title={t('tags.creatingNewTag')}
                  value={tag}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setTag(event.currentTarget.value)
                  }
                />
                <Button
                  data-testid="add-custom-tag"
                  className={styles.edit_tags_btn}
                  variant="secondary"
                  type="button"
                  title={t('tags.creatingNewTag')}
                  onClick={addTagOption}>
                  <Plus size={20} />
                </Button>
              </div>
            </div>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}
