import { ChangeEvent } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import { CollectionFormFacet, FACET_IDS_FIELD, USE_FACETS_FROM_PARENT } from '../CollectionForm'

interface FacetsFromParentCheckboxProps {
  defaultCollectionFacets: CollectionFormFacet[]
}

export const FacetsFromParentCheckbox = ({
  defaultCollectionFacets
}: FacetsFromParentCheckboxProps) => {
  const { t } = useTranslation('createCollection')
  const { control, setValue } = useFormContext()
  const hostCollectionFieldValue = useWatch({ name: 'hostCollection' }) as string

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    if (e.target.checked) {
      setValue(FACET_IDS_FIELD, defaultCollectionFacets)
    }
    formOnChange(e)
  }

  return (
    <Controller
      name={USE_FACETS_FROM_PARENT}
      control={control}
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
        return (
          <Form.Group.Checkbox
            id="useBrowseSearchFacetsFrom"
            onChange={(e) => handleCheckboxChange(e, onChange)}
            name={USE_FACETS_FROM_PARENT}
            label={`${t(
              'fields.browseSearchFacets.useBrowseSearchFacetsFrom'
            )} ${hostCollectionFieldValue}`}
            checked={value as boolean}
            isInvalid={invalid}
            invalidFeedback={error?.message}
            data-testid="use-browse-search-facets-from-parent-checkbox"
            ref={ref}
          />
        )
      }}
    />
  )
}
