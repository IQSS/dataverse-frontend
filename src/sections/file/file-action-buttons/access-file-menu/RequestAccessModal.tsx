import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useLocation } from 'react-router-dom'
import { Button, Col, DropdownButtonItem, Modal, Form } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../session/SessionContext'
import { Route } from '../../../Route.enum'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'
import styles from './AccessFileMenu.module.scss'

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
          <Form.Group.Label column sm={3}>
            {t('requestAccess.terms')}
          </Form.Group.Label>
          <Col sm={9}>
            <Form.Group.Input type="text" readOnly defaultValue="Some terms" />
          </Col>
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
  const { logIn: oidcLogin } = useContext(AuthContext)
  const { pathname, search } = useLocation()

  return (
    <>
      <Modal.Body>
        <p className={styles['request-access-login-message']}>
          <ExclamationTriangle /> You need to <a href={Route.SIGN_UP}>Sign Up</a> or{' '}
          <Button
            variant="link"
            onClick={() => oidcLogin(encodeReturnToPathInStateQueryParam(`${pathname}${search}`))}
            className="p-0 align-baseline">
            log in
          </Button>{' '}
          to request access.
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
