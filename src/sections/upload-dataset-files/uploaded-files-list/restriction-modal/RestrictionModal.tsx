import { Button, Col, Form, Modal } from '@iqss/dataverse-design-system'
import styles from './RestrictionModal.module.scss'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('uploadDatasetFiles')
  const [terms, setTerms] = useState(defaultTerms)
  const [requestAccess, setRequestAccess] = useState(defaultRequestAccess)
  const handleClose = (saved: boolean) =>
    update({ saved: saved, terms: terms, requestAccess: requestAccess })

  return (
    <Modal show={show} onHide={() => handleClose(false)} size="lg">
      <Modal.Header>
        <Modal.Title>{t('restriction.restrictAccess')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.restriction_form}>
          <div className={styles.restriction_info}>
            <p>{t('restriction.restrictionInfoP1')}</p>
            <p>{t('restriction.restrictionInfoP2')}</p>
          </div>
          <Form>
            <Form.Group>
              <Form.Group.Label column sm={3}>
                {t('restriction.restrictAccess')}
              </Form.Group.Label>
              <Col sm={9}>
                <Form.Group.Checkbox
                  label={t('restriction.enableAccessRequest')}
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
                {t('restriction.termsOfAccess')}
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
          {t('restriction.saveChanges')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleClose(false)}
          title={t('restriction.cancelChanges')}>
          {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
