import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Badge, Col, Form } from '@iqss/dataverse-design-system'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
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
  isExistingItem: boolean
}

export const DvObjectFormItem = ({
  itemIndex,
  featuredItemType,
  editEnabled,
  isExistingItem
}: DvObjectFormItemProps) => {
  const { control, setValue } = useFormContext()
  const dvObjectIdentifierValue = useWatch({
    name: `featuredItems.${itemIndex}.dvObjectIdentifier`
  }) as string
  const { t } = useTranslation('editCollectionFeaturedItems')
  /*
  - Detect the featured item type based on the url identifiers.
  - After getting the identifier and type of it we can search for the object and see if it exists.
  - If it doesn't exist we show an error message to the user.
  - If it exists but it is outside the collection we show a warning message to the user like:
    - "This object is not part of this collection."
  - Then to the API we will just show the identifier and type of it.
  - A collection alias could be confused with a file identifier.
  - The url type and indentifier detector should handle both JSF and SPA urls for every object type.
  */

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
    <div>
      <Form.Group controlId={`dv-object-id-${itemIndex}`}>
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
          <div className="d-flex flex-wrap gap-2">
            <Badge variant="primary">
              Type:
              <span> {featuredItemType}</span>
            </Badge>

            <Badge variant="primary">
              Identifier:
              <span> {dvObjectIdentifierValue}</span>
            </Badge>
          </div>
        )}
      </Form.Group>
    </div>
  )
}
