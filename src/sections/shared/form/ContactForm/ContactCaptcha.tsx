import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import { Validator } from '@/shared/helpers/Validator'

export function Captcha() {
  const { t } = useTranslation('shared')
  const { control } = useFormContext()

  const num1 = Math.floor(Math.random() * 10)
  const num2 = Math.floor(Math.random() * 10)

  const captchaAnswer = num1 + num2

  const captchaRules = {
    required: t('contact.validation.captchaInput.required'),
    validate: (value: string) => {
      if (!Validator.isValidNumber(value)) {
        return t('contact.validation.captchaInput.onlyNumber')
      }
      return parseInt(value, 10) === captchaAnswer || t('contact.validation.captchaInput.invalid')
    },
    maxLength: {
      value: 10,
      message: t('contact.validation.captchaInput.maxLength', { maxLength: 10 })
    }
  }

  return (
    <>
      <Form.Group.Label required>{t('contact.verificationText')}</Form.Group.Label>
      <div className="d-flex align-items-center">
        <Form.Group.Label style={{ margin: 0 }} data-testid="captchaNumbers">
          {num1} + {num2} =
        </Form.Group.Label>
        <Controller
          name="captchaInput"
          control={control}
          rules={captchaRules}
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <>
              <Form.Group.Input
                data-testid="captchaInput"
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
    </>
  )
}
