import { Button, Col, Row } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useNotImplementedModal } from '../../not-implemented/NotImplementedModalContext'
import { NotImplementedModal } from '../../not-implemented/NotImplementedModal'

interface HostCollectionFormProps {
  collectionId: string
}

export function HostCollectionForm({ collectionId }: HostCollectionFormProps) {
  const { t } = useTranslation('createDataset')
  const { hideModal, isModalOpen, showModal } = useNotImplementedModal()
  const onClick = () => {
    showModal()
  }
  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      <Form.Group controlId="host-collection">
        <Form.Group.Label message={t('hostCollection.description')} column sm={3} required>
          {t('hostCollection.label')}
        </Form.Group.Label>
        <Col sm={9}>
          <Row>
            <Col sm={9}>
              {t('hostCollection.helpText')}
              <Form.Group.Input type="text" disabled defaultValue={collectionId} />
            </Col>
            <Col sm={3}>
              <Row>&nbsp;</Row> {/* Empty row to align the button */}
              <Row>
                <Col>
                  <Button type={'button'} onClick={onClick} variant="secondary">
                    {t('hostCollection.buttonLabel')}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Form.Group>
    </>
  )
}
