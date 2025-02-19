import { Form, Col, Row } from '@iqss/dataverse-design-system'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function Captcha() {
  const { t } = useTranslation('collection')
  const { control } = useFormContext()

  const [num1, setNum1] = useState(Math.floor(Math.random() * 10))
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10))

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10))
    setNum2(Math.floor(Math.random() * 10))
  }, [])

  const captchaAnswer = num1 + num2

  const captchaRules = {
    required: t('contact.validation.captchaInput.required'),
    validate: (value: string) =>
      parseInt(value, 10) === captchaAnswer || t('contact.validation.captchaInput.invalid')
  }

  return (
    <Row className="mb-3">
      <Col lg={3}>{''}</Col>
      <Col lg={9}>
        <Form.Group.Label required>{t('contact.verificationText')}</Form.Group.Label>

        <div className="d-flex align-items-center">
          <Form.Group.Label style={{ margin: '5px' }}>
            {num1} + {num2} =
          </Form.Group.Label>

          <Controller
            name="captchaInput"
            control={control}
            rules={captchaRules}
            render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
              <>
                <Form.Group.Input
                  value={value as string}
                  onChange={onChange}
                  ref={ref}
                  style={{ width: '20%' }}
                  type="text"
                  isInvalid={!!error}
                />

                <Form.Group.Feedback type="invalid" className="ms-2" style={{ width: '50%' }}>
                  {error?.message}
                </Form.Group.Feedback>
              </>
            )}
          />
        </div>
      </Col>
    </Row>
  )
}
