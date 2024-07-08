import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import {
  collectionTypeOptions,
  collectionStorageOptions
} from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { ContactsField } from './ContactsField'
import styles from './CollectionForm.module.scss'

const CoreFieldsSection = () => {
  const { t } = useTranslation('createCollection')
  const { control } = useFormContext()

  return (
    <section data-testid="core-fields-section">
      {/* Host Collection */}
      <Row>
        <Form.Group controlId="collection-host" as={Col} md={6}>
          <Form.Group.Label message={t('fields.hostCollection.description')} required={true}>
            {t('fields.hostCollection.label')}
          </Form.Group.Label>
          <Controller
            name="parentCollectionName"
            control={control}
            rules={{ required: t('fields.hostCollection.required') }}
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
            rules={{ required: t('fields.name.required') }}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.Input
                  type="text"
                  value={value as string}
                  onChange={onChange}
                  isInvalid={invalid}
                  aria-required={true}
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
        <Form.Group
          controlId="identifier"
          as={Col}
          md={6}
          className={styles['identifier-field-group']}>
          <Form.Group.Label message={t('fields.alias.description')} required={true}>
            {t('fields.alias.label')}
          </Form.Group.Label>
          <Controller
            name="alias"
            control={control}
            rules={{ required: t('fields.alias.required') }}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.InputGroup hasValidation>
                  <Form.InputGroup.Text>
                    {window.location.origin}/spa/collections/
                  </Form.InputGroup.Text>
                  <Form.Group.Input
                    type="text"
                    placeholder={t('fields.alias.label')}
                    aria-label="identifier"
                    value={value as string}
                    onChange={onChange}
                    isInvalid={invalid}
                    aria-required={true}
                    ref={ref}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Form.InputGroup>
              </Col>
            )}
          />
        </Form.Group>
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
                  ref={ref}>
                  {/* TODO:ME What are this options? do they come from a configuration? */}
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

      {/* Category (type) & Description */}
      <Row>
        <Form.Group controlId="type" as={Col} md={6}>
          <Form.Group.Label message={t('fields.type.description')}>
            {t('fields.type.label')}
          </Form.Group.Label>
          <Controller
            name="type"
            control={control}
            rules={{ required: t('fields.type.required') }}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col>
                <Form.Group.Select
                  onChange={onChange}
                  value={value as string}
                  isInvalid={invalid}
                  ref={ref}>
                  <option value="">Select...</option>
                  {Object.values(collectionTypeOptions).map((type) => (
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

        <Form.Group controlId="description" as={Col} md={6}>
          <Form.Group.Label message={t('fields.description.description')} required={true}>
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
                  aria-required={true}
                  ref={ref}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>
      </Row>

      {/* Email (contacts) */}
      <Row>
        <ContactsField />
      </Row>
    </section>
  )
}

export default CoreFieldsSection
