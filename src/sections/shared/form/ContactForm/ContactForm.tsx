import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import { Form, Row, Col } from '@iqss/dataverse-design-system'

interface ContactFormProps {
  isLoggedIn: boolean
  fromEmail?: string
  collectionName: string
  validateCaptcha: number[]
}

export function ContactForm({
  isLoggedIn,
  fromEmail,
  collectionName,
  validateCaptcha
}: ContactFormProps) {
  const { t } = useTranslation('contact')
  const { control } = useFormContext()

  return (
    <Form>
      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label>To</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Form.Group.Text>{collectionName} Contact</Form.Group.Text>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label required>From</Form.Group.Label>
        </Col>
        <Col lg={9}>
          {isLoggedIn ? (
            <Form.Group.Text>{fromEmail}</Form.Group.Text>
          ) : (
            <Controller
              name="fromEmail"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: 'Invalid email format'
                }
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Form.Group.Input
                    {...field}
                    type="email"
                    isInvalid={invalid}
                    placeholder="name@email.xyz"
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </>
              )}
            />
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label required>{t('subject')}</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Controller
            name="subject"
            control={control}
            rules={{ required: 'Subject is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <Form.Group.Input {...field} type="text" isInvalid={invalid} />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label required>{t('message')}</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Controller
            name="body"
            control={control}
            rules={{ required: 'Message text is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <Form.Group.TextArea {...field} isInvalid={invalid} />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg={3}>{''}</Col>
        <Col lg={9}>
          <Controller
            name="captcha"
            control={control}
            rules={{
              required: 'Value is required',
              validate: (value: string) =>
                parseInt(value) == validateCaptcha[2] || 'Incorrect answer'
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <Form.Group.Text>Please fill this out to prove you are not a robot</Form.Group.Text>

                <div className="d-flex align-items-center">
                  <Form.Group.Label className="me-2">
                    {validateCaptcha[0]} + {validateCaptcha[1]} =
                  </Form.Group.Label>
                  <Form.Group.Input
                    style={{ width: '70px' }}
                    {...field}
                    type="text"
                    isInvalid={invalid}
                  />
                </div>
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )}
          />
        </Col>
      </Row>
    </Form>
  )
}
