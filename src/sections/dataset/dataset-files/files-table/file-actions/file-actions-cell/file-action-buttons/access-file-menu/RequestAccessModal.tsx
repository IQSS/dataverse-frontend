import { Button, DropdownButtonItem, Modal } from '@iqss/dataverse-design-system'
import { useSession } from '../../../../../../../session/SessionContext'
import { FormEvent, useState } from 'react'
import { Form } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { Route } from '../../../../../../../Route.enum'
import styles from './AccessFileMenu.module.scss'

interface RequestAccessButtonProps {
  fileId: string
}
export function RequestAccessModal({ fileId }: RequestAccessButtonProps) {
  const { user } = useSession()
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => setShow(true)

  return (
    <>
      <DropdownButtonItem onClick={handleShow}>Request Access</DropdownButtonItem>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>Request Access</Modal.Title>
        </Modal.Header>
        {user ? (
          <RequestAccessForm fileId={fileId} handleClose={handleClose} />
        ) : (
          <RequestAccessLoginMessage handleClose={handleClose} />
        )}
      </Modal>
    </>
  )
}

const RequestAccessForm = ({
  fileId,
  handleClose
}: {
  fileId: string
  handleClose: () => void
}) => {
  /* istanbul ignore next */
  const requestAccessToFile = (event: FormEvent<HTMLFormElement>) => {
    /* istanbul ignore next */ event.preventDefault()
    event.stopPropagation()

    // TODO - Implement request access to file functionality
    console.log('requesting access to file', fileId)
  }

  return (
    <Form onSubmit={requestAccessToFile}>
      <Modal.Body>
        <Form.Group controlId="basic-form-username">
          <p>
            Please confirm and/or complete the information needed below in order to request access
            to files in this dataset.
          </p>
          <Form.Group.Label>Terms of Access for Restricted Files</Form.Group.Label>
          <Form.Group.Input type="text" readOnly defaultValue="Some terms" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit">
          Accept
        </Button>
        <Button variant="secondary" type="button" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Form>
  )
}

const RequestAccessLoginMessage = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <>
      <Modal.Body>
        <p className={styles['request-access-login-message']}>
          <ExclamationTriangle /> You need to <a href={Route.SIGN_UP}>Sign Up</a> or{' '}
          <a href={Route.LOG_IN}>Log In</a> to request access.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </>
  )
}
