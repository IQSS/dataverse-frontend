import { useTranslation } from 'react-i18next'
import { Controller, useFormContext, UseControllerProps } from 'react-hook-form'
import { Form, Row, Col } from '@iqss/dataverse-design-system'

interface ContactFormProps {
  isLoggedIn: boolean
  toContactName?: string
}

export function ContactForm({ isLoggedIn, toContactName }: ContactFormProps) {
  const { t } = useTranslation('shared')
  const { control } = useFormContext()

  const emailRules: UseControllerProps['rules'] = {
    required: t('contact.validation.email.required'),
    pattern: {
      value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
      message: 'Invalid email format'
    },
    maxLength: {
      value: 255,
      message: t('contact.validation.email.maxLength', { maxLength: 255 })
    }
  }

  const subjectRules: UseControllerProps['rules'] = {
    required: t('contact.validation.subject.required'),
    maxLength: {
      value: 255,
      message: t('contact.validation.subject.maxLength', { maxLength: 255 })
    }
  }

  const messageRules: UseControllerProps['rules'] = {
    required: t('contact.validation.message.required')
  }

  return (
    <>
      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label>To</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Form.Group.Text>{toContactName} Contact</Form.Group.Text>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label required>From</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Controller
            name="fromEmail"
            control={control}
            rules={emailRules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <>
                <Form.Group.Input
                  data-testid="fromEmail"
                  value={value as string}
                  onChange={onChange}
                  ref={ref}
                  type="email"
                  readOnly={isLoggedIn}
                  isInvalid={invalid}
                  placeholder="name@email.xyz"
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label required>{t('contact.subject')}</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Controller
            name="subject"
            control={control}
            rules={subjectRules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <>
                <Form.Group.Input
                  data-testid="subject"
                  value={value as string}
                  onChange={onChange}
                  ref={ref}
                  type="text"
                  isInvalid={invalid}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col lg={3}>
          <Form.Group.Label required>{t('contact.message')}</Form.Group.Label>
        </Col>
        <Col lg={9}>
          <Controller
            name="body"
            control={control}
            rules={messageRules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <>
                <Form.Group.TextArea
                  data-testid="body"
                  value={value as string}
                  onChange={onChange}
                  ref={ref}
                  isInvalid={invalid}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )}
          />
        </Col>
      </Row>
    </>
  )
}
