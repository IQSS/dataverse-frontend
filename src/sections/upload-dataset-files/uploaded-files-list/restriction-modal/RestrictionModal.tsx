import { Button, Col, Form, Modal } from '@iqss/dataverse-design-system'
import styles from './RestrictionModal.module.scss'
import { FormEvent, useState } from 'react'

interface RestrictionModalProps {
  defaultRequestAccess: boolean
  defaultTerms: string
  show: boolean
  update: (res: RestrictionModalResult) => void
}

export interface RestrictionModalResult {
  saved: boolean
  terms: string
  requestAccess: boolean
}

export function RestrictionModal({
  defaultRequestAccess,
  defaultTerms,
  show,
  update
}: RestrictionModalProps) {
  const [terms, setTerms] = useState(defaultTerms)
  const [requestAccess, setRequestAccess] = useState(defaultRequestAccess)
  const handleClose = (saved: boolean) =>
    update({ saved: saved, terms: terms, requestAccess: requestAccess })

  return (
    <Modal show={show} onHide={() => handleClose(false)} size="lg">
      <Modal.Header>
        <Modal.Title>Restrict Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.restriction_form}>
          <div className={styles.restriction_info}>
            <p>
              Restricting limits access to published files. People who want to use the restricted
              files can request access by default. If you disable request access, you must add
              information about access to the Terms of Access field.
            </p>
            <p>Learn about restricting files and dataset access in the User Guide.</p>
          </div>
          <Form>
            <Form.Group>
              <Form.Group.Label column sm={3}>
                Request Access
              </Form.Group.Label>
              <Col sm={9}>
                <Form.Group.Checkbox
                  label="Enable access request"
                  id={'requestAccessCB'}
                  checked={requestAccess}
                  onChange={(event: FormEvent<HTMLInputElement>) =>
                    setRequestAccess(event.currentTarget.checked)
                  }
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Group.Label column sm={3}>
                Terms of Access for Restricted Files
              </Form.Group.Label>
              <Col sm={9}>
                <Form.Group.TextArea
                  defaultValue={defaultTerms}
                  onChange={(event: FormEvent<HTMLInputElement>) =>
                    setTerms(event.currentTarget.value)
                  }
                />
              </Col>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => handleClose(true)}
          disabled={!requestAccess && !terms}>
          Save Changes
        </Button>
        <Button variant="secondary" onClick={() => handleClose(false)} title="Cancel changes">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
