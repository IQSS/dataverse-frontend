import { Col, Form } from '@iqss/dataverse-design-system'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const CollectionsFields = () => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'collections' })
  const { control } = useFormContext()

  const nameRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 255,
      message: t('name.invalid.maxLength', { maxLength: 255 })
    }
  }

  const aliasRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 60,
      message: t('alias.invalid.maxLength', { maxLength: 60 })
    }
  }

  const affiliationRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 255,
      message: t('affiliation.invalid.maxLength', { maxLength: 255 })
    }
  }

  const descriptionRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 255,
      message: t('affiliation.invalid.maxLength', { maxLength: 255 })
    }
  }

  return (
    <div>
      <Form.Group controlId="name">
        <Form.Group.Label message={t('name.description')} column sm={4} className="text-sm-end">
          {t('name.label')}
        </Form.Group.Label>
        <Controller
          name="name"
          control={control}
          rules={nameRules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col sm={6}>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                autoFocus
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Form.Group>

      <Form.Group controlId="alias">
        <Form.Group.Label message={t('alias.description')} column sm={4} className="text-sm-end">
          {t('alias.label')}
        </Form.Group.Label>

        <Controller
          name="alias"
          control={control}
          rules={aliasRules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col sm={6}>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Form.Group>

      <Form.Group controlId="affiliation">
        <Form.Group.Label
          message={t('affiliation.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('affiliation.label')}
        </Form.Group.Label>
        <Controller
          name="affiliation"
          control={control}
          rules={affiliationRules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col sm={6}>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Group.Label
          message={t('description.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('description.label')}
        </Form.Group.Label>
        <Controller
          name="description"
          control={control}
          rules={descriptionRules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col sm={6}>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Form.Group>

      {/* Subject, git citation block subject controlled vocabularies */}
    </div>
  )
}
