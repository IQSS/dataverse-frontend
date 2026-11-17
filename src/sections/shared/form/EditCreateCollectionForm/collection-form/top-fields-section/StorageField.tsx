import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Col, Form } from '@iqss/dataverse-design-system'
import { AllowedStorageDrivers } from '@/collection/domain/models/AllowedStorageDrivers'

interface StorageFieldProps {
  allowedStorageDrivers: AllowedStorageDrivers
  inheritedOrDefaultStorageDriverName?: string
}

export const StorageField = ({
  allowedStorageDrivers,
  inheritedOrDefaultStorageDriverName
}: StorageFieldProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm' })
  const { control } = useFormContext()
  const storageDriverOptions = Object.entries(allowedStorageDrivers)

  if (storageDriverOptions.length === 0) {
    return null
  }

  return (
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
              <option value="">
                {t('fields.storage.inheritedOrDefaultOption', {
                  storageDriver: inheritedOrDefaultStorageDriverName ?? t('unknown')
                })}
              </option>
              {storageDriverOptions.map(([driverLabel, displayName]) => (
                <option value={driverLabel} key={driverLabel}>
                  {displayName}
                </option>
              ))}
            </Form.Group.Select>
            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Col>
        )}
      />
    </Form.Group>
  )
}
