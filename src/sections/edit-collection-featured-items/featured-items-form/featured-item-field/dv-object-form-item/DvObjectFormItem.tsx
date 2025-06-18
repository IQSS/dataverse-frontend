import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Badge, Col, Form } from '@iqss/dataverse-design-system'
import { FeaturedItemType } from '@/collection/domain/models/FeaturedItem'
import { FeaturedItemsFormHelper } from '../../FeaturedItemsFormHelper'
import styles from './DvObjectFormItem.module.scss'

// This is only to avoid difference snapshots in Chromatic builds, the real display origin will be the current window location
const locationOrigin =
  import.meta.env.STORYBOOK_CHROMATIC_BUILD === 'true' ? 'https://foo.com' : window.location.origin

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

const placeholder = `${locationOrigin}${BASENAME_URL}/datasets?persistentId=doi:10.5072/FK2/8YOKQI`

interface DvObjectFormItemProps {
  itemIndex: number
  featuredItemType:
    | FeaturedItemType.COLLECTION
    | FeaturedItemType.DATASET
    | FeaturedItemType.FILE
    | ''
  editEnabled: boolean
}

export const DvObjectFormItem = ({
  itemIndex,
  featuredItemType,
  editEnabled
}: DvObjectFormItemProps) => {
  const { control, setValue } = useFormContext()
  const dvObjectIdentifierValue = useWatch({
    name: `featuredItems.${itemIndex}.dvObjectIdentifier`
  }) as string

  const { t } = useTranslation('editCollectionFeaturedItems')

  const rules: UseControllerProps['rules'] = {
    required: t('form.dvObjectUrl.required'),
    validate: (value: string) => {
      const input = value.trim()

      // If is not a valid DOI URL or a valid Dataverse object URL, show an error.
      if (
        !FeaturedItemsFormHelper.isValidDOI(input) &&
        !FeaturedItemsFormHelper.isValidDvObjectUrl(input)
      ) {
        return t('form.dvObjectUrl.invalid')
      }

      return true
    }
  }

  const onChangeDvObjectUrl = (value: string, formOnChange: (...event: unknown[]) => void) => {
    formOnChange(value)
    // If the value is empty, reset the type and identifier
    if (value.trim() === '') {
      setValue(`featuredItems.${itemIndex}.dvObjectIdentifier`, '')
      setValue(`featuredItems.${itemIndex}.type`, '')
      return
    }

    // Extract type and identifier from the URL
    const { type, identifier } =
      FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(value)

    // Set the type and identifier in the form data
    setValue(`featuredItems.${itemIndex}.dvObjectIdentifier`, identifier ?? '')
    setValue(`featuredItems.${itemIndex}.type`, type ?? '')
  }

  return (
    <div data-testid={`dvobject-form-item-${itemIndex}`}>
      <Form.Group controlId={`featuredItems.${itemIndex}.dvObjectUrl`}>
        <Form.Group.Label required sm={3}>
          {t('form.dvObjectUrl.label')}
        </Form.Group.Label>

        <Controller
          name={`featuredItems.${itemIndex}.dvObjectUrl`}
          control={control}
          rules={rules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
            return (
              <Col md={9}>
                <Form.Group.Input
                  type="text"
                  ref={ref}
                  onChange={(e) => {
                    onChangeDvObjectUrl(e.target.value, onChange)
                  }}
                  aria-required={true}
                  value={value as string}
                  isInvalid={invalid}
                  disabled={!editEnabled}
                  placeholder={placeholder}
                  className={styles.input}
                />

                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                <Form.Group.Text>{t('form.dvObjectUrl.helperText')}</Form.Group.Text>
              </Col>
            )
          }}
        />
        {featuredItemType && dvObjectIdentifierValue && (
          <div className="d-flex flex-wrap gap-2 mt-1" data-testid="dv-object-info">
            <Badge variant="primary">
              {t('type')}: <span>{featuredItemType}</span>
            </Badge>

            <Badge variant="primary">
              {t('identifier')}: <span>{dvObjectIdentifierValue}</span>
            </Badge>
          </div>
        )}
      </Form.Group>
    </div>
  )
}
