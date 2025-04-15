import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { dvObjectTypesValueLabels, labelToValue, valueToLabel } from './DvObjectFormItem'

interface DvObjectTypeSelectProps {
  itemIndex: number
}

export const DvObjectTypeSelect = ({ itemIndex }: DvObjectTypeSelectProps) => {
  const { control, setFocus } = useFormContext()

  const dvObjectTypesLabels = dvObjectTypesValueLabels.map(({ value: _value, label }) => label)

  const rules: UseControllerProps['rules'] = {
    validate: (value) => {
      if (value === '') {
        return 'Please select a Dataverse object type.'
      }
      return true
    }
  }

  return (
    <Form.Group>
      <Form.Group.Label
        message="The type of Dataverse object you want to feature."
        required
        htmlFor={`dv-object-type-${itemIndex}`}
        sm={3}>
        Dataverse Object Type
      </Form.Group.Label>

      <Col md={9}>
        <Controller
          name={`featuredItems.${itemIndex}.type`}
          control={control}
          rules={rules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
            const valueToLabelOption = valueToLabel(value as FeaturedItemType)

            return (
              <>
                <Form.Group.SelectAdvanced
                  options={dvObjectTypesLabels}
                  defaultValue={valueToLabelOption}
                  onChange={(value) => {
                    const labelOptionToValue = labelToValue(value)

                    onChange(labelOptionToValue)

                    setTimeout(() => {
                      setFocus(`featuredItems.${itemIndex}.dvObjectId`, { shouldSelect: false })
                    }, 300)
                  }}
                  inputButtonId={`dv-object-type-${itemIndex}`}
                  isSearchable={false}
                  isInvalid={invalid}
                  ref={ref}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </>
            )
          }}
        />
      </Col>
    </Form.Group>
  )
}
