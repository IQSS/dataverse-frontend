import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { Col, Form, Stack, Tooltip } from '@iqss/dataverse-design-system'
import styles from './TopFieldsSection.module.scss'

export const DescriptionField = () => {
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm' })
  const { control } = useFormContext()

  const HtmlWordTooltip = ({ children }: { children: ReactNode }) => (
    <Tooltip
      placement="bottom"
      overlay={
        <code className={styles['description-field-tooltip-content']}>
          {t('fields.description.htmlAllowedTags')}
        </code>
      }
      maxWidth={300}>
      <span className={styles['description-field-html-allowed-tag']}>{children}</span>
    </Tooltip>
  )

  return (
    <Form.Group controlId="description" as={Col} md={6}>
      <Stack gap={0} className="mb-2">
        <Form.Group.Label message={t('fields.description.description')} className="m-0">
          {t('fields.description.label')}
        </Form.Group.Label>
        <Form.Group.Text>
          <Trans
            t={t}
            i18nKey="fields.description.subLabel"
            components={{
              htmlTooltip: <HtmlWordTooltip>HTML tags</HtmlWordTooltip>
            }}
          />
        </Form.Group.Text>
      </Stack>

      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
          <Col>
            <Form.Group.TextArea
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
  )
}
