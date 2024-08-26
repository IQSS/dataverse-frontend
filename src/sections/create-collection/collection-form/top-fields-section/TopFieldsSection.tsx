import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import {
  collectionTypeOptions,
  collectionStorageOptions
} from '../../../../collection/domain/useCases/DTOs/CollectionDTO'
import { Validator } from '../../../../shared/helpers/Validator'
import { ContactsField } from './ContactsField'
import { IdentifierField } from './IdentifierField'

export const TopFieldsSection = () => {
  const { t } = useTranslation('createCollection')
  const { control } = useFormContext()

  const hostCollectionRules: UseControllerProps['rules'] = {
    required: t('fields.hostCollection.required')
  }

  const nameRules: UseControllerProps['rules'] = {
    required: t('fields.name.required')
  }

  const aliasRules: UseControllerProps['rules'] = {
    required: t('fields.alias.required'),
    maxLength: {
      value: 60,
      message: t('fields.alias.invalid.maxLength', { maxLength: 60 })
    },
    validate: (value: string) => {
      if (!Validator.isValidIdentifier(value)) {
        return t('fields.alias.invalid.format')
      }
      return true
    }
  }

  const typeRules: UseControllerProps['rules'] = { required: t('fields.type.required') }

  const contactsRules: UseControllerProps['rules'] = {
    required: t('fields.contacts.required'),
    validate: (value: string) => {
      if (!Validator.isValidEmail(value)) {
        return t('fields.contacts.invalid')
      }
      return true
    }
  }

  return (
    <section data-testid="core-fields-section">
      {/* Host Collection */}
      <Row>
        <Form.Group controlId="host-collection" as={Col} md={6}>
          <Form.Group.Label message={t('fields.hostCollection.description')} required={true}>
            {t('fields.hostCollection.label')}
          </Form.Group.Label>
          <Controller
            name="hostCollection"
            control={control}
            rules={hostCollectionRules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.Input
                  type="text"
                  value={value as string}
                  onChange={onChange}
                  isInvalid={invalid}
                  aria-required={true}
                  ref={ref}
                  disabled
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>
      </Row>

      {/* Name & Affiliation */}
      <Row>
        <Form.Group controlId="name" as={Col} md={6}>
          <Form.Group.Label message={t('fields.name.description')} required={true}>
            {t('fields.name.label')}
          </Form.Group.Label>
          <Controller
            name="name"
            control={control}
            rules={nameRules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.Input
                  type="text"
                  value={value as string}
                  onChange={onChange}
                  isInvalid={invalid}
                  aria-required={true}
                  autoFocus
                  ref={ref}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>

        <Form.Group controlId="affiliation" as={Col} md={6}>
          <Form.Group.Label message={t('fields.affiliation.description')}>
            {t('fields.affiliation.label')}
          </Form.Group.Label>
          <Controller
            name="affiliation"
            control={control}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
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
      </Row>

      {/* Identifier(alias) & Storage */}
      <Row>
        <IdentifierField rules={aliasRules} />

        <Form.Group controlId="storage" as={Col} md={6}>
          <Form.Group.Label message={t('fields.storage.description')}>
            {t('fields.storage.label')}
          </Form.Group.Label>
          <Controller
            name="storage"
            control={control}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.Select
                  onChange={onChange}
                  value={value as string}
                  isInvalid={invalid}
                  ref={ref}
                  disabled>
                  <option value="">Select...</option>
                  {Object.values(collectionStorageOptions).map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </Form.Group.Select>
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>
      </Row>

      {/* Category (type) & Email (contacts) & Description */}
      <Row>
        <Col>
          <Form.Group controlId="type" as={Col}>
            <Form.Group.Label message={t('fields.type.description')} required>
              {t('fields.type.label')}
            </Form.Group.Label>
            <Controller
              name="type"
              control={control}
              rules={typeRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col>
                  <Form.Group.Select
                    onChange={onChange}
                    value={value as string}
                    aria-required={true}
                    isInvalid={invalid}
                    ref={ref}>
                    <option value="">Select...</option>
                    {Object.values(collectionTypeOptions).map(({ label, value }) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Group.Select>
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
              )}
            />
          </Form.Group>

          <ContactsField rules={contactsRules} />
        </Col>

        <Form.Group controlId="description" as={Col} md={6}>
          <Form.Group.Label message={t('fields.description.description')}>
            {t('fields.description.label')}
          </Form.Group.Label>
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
      </Row>
    </section>
  )
}
