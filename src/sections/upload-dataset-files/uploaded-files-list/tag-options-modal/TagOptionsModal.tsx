import { Button, Col, Form, Modal } from '@iqss/dataverse-design-system'
import styles from './TagOptionsModal.module.scss'
import { FormEvent, useState } from 'react'

interface TagOptionsModalProps {
  tags: string[]
  setTagOptions: (newTags: string[]) => void
  show: boolean
  hide: () => void
}

export function TagOptionsModal({ tags, setTagOptions, show, hide }: TagOptionsModalProps) {
  const [tag, setTag] = useState('')
  const addTagOption = () => {
    console.log(tag)
    if (tag && !tags.includes(tag)) {
      setTagOptions([...tags, tag])
      setTag('')
    }
    console.log(tags)
  }

  return (
    <Modal show={show} onHide={hide} size="lg">
      <Modal.Header>
        <Modal.Title>Edit tag options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.tag_options}>
          <Form>
            <Form.Group>
              <Form.Group.Label column sm={3}>
                Custom file tag
              </Form.Group.Label>
              <Col sm={9}>
                <div className={styles.tag_info}>
                  Creating a new tag will add it as a tag option for all files in this dataset.
                </div>
                <div className="input-group mb-3">
                  <Form.Group.Input
                    type="text"
                    placeholder="Add new file tag..."
                    value={tag}
                    onChange={(event: FormEvent<HTMLInputElement>) => setTag(event.currentTarget.value)}
                  />
                  <Button
                    className={styles.apply_button}
                    variant="secondary"
                    type="button"
                    {...{ size: 'sm' }}
                    withSpacing
                    onClick={addTagOption}>
                    Apply
                  </Button>
                </div>
                <div className={styles.tag_info}>Available tag options: {tags.join(', ')}</div>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
