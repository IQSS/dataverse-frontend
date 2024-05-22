import { Button, Col } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useNotImplementedModal } from '../../not-implemented/NotImplementedModalContext'
import styles from './HostCollectionForm.module.scss'

interface HostCollectionFormProps {
  collectionId: string
}

export function HostCollectionForm({ collectionId }: HostCollectionFormProps) {
  const { t } = useTranslation('createDataset')
  const { showModal } = useNotImplementedModal()

  return (
    <>
      <Form.Group controlId="host-collection">
        <Form.Group.Label message={t('hostCollection.description')} column sm={3} required>
          {t('hostCollection.label')}
        </Form.Group.Label>
        <Col sm={9} className={styles['input-button-wrapper']}>
          <Col md={9}>
            <Form.Group.Text>{t('hostCollection.helpText')}</Form.Group.Text>
            <Form.Group.Input type="text" disabled defaultValue={collectionId} />
          </Col>
          <Col className={styles['edit-button-wrapper']} md={3}>
            <Button type={'button'} onClick={showModal} variant="secondary">
              {t('hostCollection.buttonLabel')}
            </Button>
          </Col>
        </Col>
      </Form.Group>
    </>
  )
}
