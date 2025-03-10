import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { Button, Modal, Spinner, Stack, Col, Form, Alert } from '@iqss/dataverse-design-system'
import styles from './ConfirmRestrictFileModal.module.scss'

interface ConfirmRestrictFileModalProps {
  show: boolean
  handleClose: () => void
  handleRestrict: () => void
  datasetReleasedVersionExists: boolean
  isRestrictingFile: boolean
  errorRestrictingFile: string | null
  termsOfAccessForRestrictedFiles?: string
  isRestricted: boolean
}

export const ConfirmRestrictFileModal = ({
  show,
  handleClose,
  handleRestrict,
  datasetReleasedVersionExists,
  termsOfAccessForRestrictedFiles,
  isRestrictingFile,
  errorRestrictingFile,
  isRestricted
}: ConfirmRestrictFileModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('file')
  const requestAccess = true // TODO need connect to API
  const terms = termsOfAccessForRestrictedFiles // TODO need connect to API

  return (
    <Modal show={show} onHide={isRestrictingFile ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('restriction.restrictAccess')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {' '}
        <Alert variant={'info'} dismissible={false}>
          {'Request Access and Terms of Access are not editable now, waiting for API connection.'}
        </Alert>
        {!isRestricted && (
          <div className={styles.restriction_form}>
            {' '}
            <div className={styles.restriction_info}>
              <p>
                {t('restriction.restrictionInfoP1')} <b>{t('restriction.restrictionInfoP2')}</b>
              </p>
              <p>
                {t('restriction.restrictionInfoP3')}
                <Link to="https://guides.dataverse.org/en/6.5/user/dataset-management.html#restricted-files-terms-of-access">
                  {t('restriction.userGuide')}
                </Link>
              </p>
            </div>
            <Form>
              <Form.Group>
                <Form.Group.Label column sm={3}>
                  {t('restriction.restrictAccess')}
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.Checkbox
                    disabled
                    label={t('restriction.enableAccessRequest')}
                    data-testid="enable-access-request-checkbox"
                    id={'requestAccessCheckbox'}
                    checked={requestAccess}
                  />
                </Col>
              </Form.Group>
              <Form.Group>
                <Form.Group.Label column sm={3}>
                  {t('restriction.termsOfAccess')}
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.TextArea
                    data-testid="terms-of-access-textarea"
                    defaultValue={terms}
                    disabled
                  />
                </Col>
              </Form.Group>
            </Form>
          </div>
        )}
        {isRestricted && (
          <Stack gap={2}>
            <Stack direction="horizontal" gap={2} className={styles.message}>
              <ExclamationTriangle /> <span>{t('restriction.message')}</span>
            </Stack>
          </Stack>
        )}
        {datasetReleasedVersionExists && (
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle /> <span>{t('restriction.messagePublishedDataset')}</span>
          </Stack>
        )}
        {errorRestrictingFile && (
          <Stack direction="horizontal" gap={2} className={`${styles.message} ${styles.error}`}>
            <ExclamationTriangle /> <span>{errorRestrictingFile}</span>
          </Stack>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          type="button"
          disabled={isRestrictingFile}>
          {tShared('cancel')}
        </Button>
        <Button
          onClick={handleRestrict}
          type="button"
          disabled={isRestrictingFile || (!requestAccess && !terms)}>
          <Stack direction="horizontal" gap={1}>
            {t('restriction.saveChanges')}
            {isRestrictingFile && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
