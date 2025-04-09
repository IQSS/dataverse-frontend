import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import {
  Button,
  Modal,
  Spinner,
  Stack,
  Col,
  Form,
  QuestionMarkTooltip
} from '@iqss/dataverse-design-system'
import styles from './ConfirmRestrictFileModal.module.scss'

interface ConfirmRestrictFileModalProps {
  show: boolean
  handleClose: () => void
  handleRestrict: (enableAccessRequest: boolean, terms: string | undefined) => void
  datasetReleasedVersionExists: boolean
  requestAccess: boolean
  isRestrictingFile: boolean
  errorRestrictingFile: string | null
  termsOfAccessForRestrictedFiles?: string
  isRestricted: boolean
}

export const ConfirmRestrictFileModal = ({
  show,
  handleClose,
  handleRestrict,
  requestAccess,
  termsOfAccessForRestrictedFiles,
  datasetReleasedVersionExists,
  isRestrictingFile,
  errorRestrictingFile,
  isRestricted
}: ConfirmRestrictFileModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('file')

  const [enableAccessRequest, setEnableAccessRequest] = useState(requestAccess)
  const [terms, setTerms] = useState(termsOfAccessForRestrictedFiles)

  useEffect(() => {
    if (!show) {
      setEnableAccessRequest(requestAccess)
      setTerms(termsOfAccessForRestrictedFiles)
    }
  }, [show, requestAccess, termsOfAccessForRestrictedFiles])

  return (
    <Modal show={show} onHide={isRestrictingFile ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('restriction.restrictAccess')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {' '}
        {!isRestricted && (
          <div className={styles.restriction_form}>
            {' '}
            <div className={styles.restriction_info}>
              <p>
                {t('restriction.restrictionInfoP1')} <b>{t('restriction.restrictionInfoP2')}</b>
              </p>
              <p className={styles.helper_text}>
                <Trans
                  t={t}
                  i18nKey="restriction.restrictionInfoP3"
                  components={{
                    a: (
                      <a
                        href="https://guides.dataverse.org/en/latest/user/dataset-management.html#restricted-files-terms-of-access"
                        target="_blank"
                        rel="noreferrer"
                      />
                    )
                  }}
                />
              </p>
            </div>
            <Form>
              <Form.Group>
                <Form.Group.Label column sm={3}>
                  {t('restriction.restrictAccess')}{' '}
                  <QuestionMarkTooltip
                    message={t('restriction.restrictAccessTooltipText')}
                    placement={'auto'}
                  />
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.Checkbox
                    label={t('restriction.enableAccessRequest')}
                    data-testid="enable-access-request-checkbox"
                    id={'requestAccessCheckbox'}
                    defaultChecked={enableAccessRequest}
                    onChange={(e) => setEnableAccessRequest(e.target.checked)}
                  />
                </Col>
              </Form.Group>
              <Form.Group>
                <Form.Group.Label column sm={3}>
                  {t('restriction.termsOfAccess')}{' '}
                  <QuestionMarkTooltip
                    message={t('restriction.termsOfAccessTooltipText')}
                    placement={'auto'}
                  />
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.TextArea
                    data-testid="terms-of-access-textarea"
                    defaultValue={terms}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setTerms(e.target.value)
                    }
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
          onClick={() => handleRestrict(enableAccessRequest, terms)}
          type="button"
          disabled={isRestrictingFile || (!enableAccessRequest && !terms)}>
          <Stack direction="horizontal" gap={1}>
            {t('restriction.saveChanges')}
            {isRestrictingFile && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
