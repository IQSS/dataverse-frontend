import { Button, Col, Form, Modal } from '@iqss/dataverse-design-system'
import styles from './TagOptionsModal.module.scss'
import { FormEvent, useState, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface TagOptionsModalProps {
  tags: string[]
  setTagOptions: (newTags: string[]) => void
  show: boolean
  hide: () => void
}

export function TagOptionsModal({ tags, setTagOptions, show, hide }: TagOptionsModalProps) {
  const { t } = useTranslation('uploadDatasetFiles')
  const [tag, setTag] = useState('')
  const addTagOption = () => {
    if (tag && !tags.includes(tag)) {
      setTagOptions([...tags, tag])
      setTag('')
    }
  }
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTagOption()
      event.preventDefault()
    }
  }

  return (
    <Modal show={show} onHide={hide} size="lg">
      <Modal.Header>
        <Modal.Title>{t('tags.editTagOptions')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.tag_options} onKeyDown={handleEnter}>
          <Form onSubmit={addTagOption}>
            <Form.Group>
              <Form.Group.Label column sm={3}>
                {t('tags.customFileTag')}
              </Form.Group.Label>
              <Col sm={9}>
                <div className={styles.tag_info}>{t('tags.creatingNewTag')}</div>
                <div className="input-group mb-3">
                  <Form.Group.Input
                    type="text"
                    placeholder={t('tags.addNewTag')}
                    value={tag}
                    onChange={(event: FormEvent<HTMLInputElement>) =>
                      setTag(event.currentTarget.value)
                    }
                  />
                  <Button
                    className={styles.apply_button}
                    variant="secondary"
                    type="button"
                    {...{ size: 'sm' }}
                    withSpacing
                    onClick={addTagOption}>
                    {t('tags.apply')}
                  </Button>
                </div>
                <div className={styles.tag_info}>
                  {t('tags.availableTagOptions')}
                  {tags.join(', ')}
                </div>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          {t('tags.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
