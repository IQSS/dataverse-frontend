import { Form, Col, Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface CaptchaProps {
  userInput: string
  onChange: (value: string) => void
  num1: number
  num2: number
}

export function Captcha({ userInput, onChange, num1, num2 }: CaptchaProps) {
  const { t } = useTranslation('collection')

  return (
    <>
      <Row className="mb-3">
        <Col lg={3}>{''}</Col>
        <Col lg={9}>
          <Form.Group.Label required>{t('contact.verificationText')}</Form.Group.Label>

          <div className="d-flex align-items-center">
            <Form.Group.Label className="me-2">
              {num1} + {num2} =
            </Form.Group.Label>
            <Form.Group.Input
              style={{ width: '70px' }}
              type="text"
              value={userInput}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </Col>{' '}
      </Row>
    </>
  )
}
