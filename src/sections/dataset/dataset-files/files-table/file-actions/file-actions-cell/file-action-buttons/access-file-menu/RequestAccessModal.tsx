import { Button, DropdownButtonItem, Modal } from '@iqss/dataverse-design-system'
import { useSession } from '../../../../../../../session/SessionContext'
import { FormEvent, useState } from 'react'
import { Form } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { Route } from '../../../../../../../Route.enum'
import styles from './AccessFileMenu.module.scss'
import { useTranslation } from 'react-i18next'

interface RequestAccessButtonProps {
  fileId: number
}
export function RequestAccessModal({ fileId }: RequestAccessButtonProps) {
  const { t } = useTranslation('files')
  const { user } = useSession()
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => setShow(true)

  return (
    <>
      <DropdownButtonItem onClick={handleShow}>{t('requestAccess.title')}</DropdownButtonItem>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{t('requestAccess.title')}</Modal.Title>
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
  fileId: number
  handleClose: () => void
}) => {
  const { t } = useTranslation('files')
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
          <p>{t('requestAccess.askToAcceptTerms')}.</p>
          <Form.Group.Label>{t('requestAccess.terms')}</Form.Group.Label>
          <Form.Group.Input type="text" readOnly defaultValue="Some terms" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit">
          {t('requestAccess.confirmation')}
        </Button>
        <Button variant="secondary" type="button" onClick={handleClose}>
          {t('requestAccess.cancel')}
        </Button>
      </Modal.Footer>
    </Form>
  )
}

const RequestAccessLoginMessage = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation('files')
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
          {t('requestAccess.close')}
        </Button>
      </Modal.Footer>
    </>
  )
}
