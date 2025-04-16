import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { Col, Form } from '@iqss/dataverse-design-system'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { valueToLabel } from './DvObjectFormItem'

interface DvObjectIdSelectProps {
  itemIndex: number
  featuredItemType: FeaturedItemType
  editEnabled: boolean
}

const COLLECTION_OPTIONS = [
  'Collection1',
  'Collection2',
  'Collection3',
  'Collection4',
  'Collection5',
  'Collection6',
  'Collection7',
  'Collection8',
  'Collection9'
]

const DATASET_OPTIONS = [
  'Dataset1',
  'Dataset2',
  'Dataset3',
  'Dataset4',
  'Dataset5',
  'Dataset6',
  'Dataset7',
  'Dataset8',
  'Dataset9'
]

const FILES_OPTIONS = [
  'File1',
  'File2',
  'File3',
  'File4',
  'File5',
  'File6',
  'File7',
  'File8',
  'File9'
]

export const DvObjectIdSelect = ({
  itemIndex,
  featuredItemType,
  editEnabled
}: DvObjectIdSelectProps) => {
  const { control, setFocus } = useFormContext()

  const rules: UseControllerProps['rules'] = {
    validate: (value) => {
      if (value === '') {
        return `Please select a ${valueToLabel(featuredItemType)}.`
      }
      return true
    }
  }

  const options =
    featuredItemType === FeaturedItemType.COLLECTION
      ? COLLECTION_OPTIONS
      : featuredItemType === FeaturedItemType.DATASET
      ? DATASET_OPTIONS
      : featuredItemType === FeaturedItemType.FILE
      ? FILES_OPTIONS
      : []

  return (
    <Form.Group>
      <Form.Group.Label required htmlFor={`dv-object-id-${itemIndex}`} sm={3}>
        Select a {valueToLabel(featuredItemType)}
      </Form.Group.Label>

      <Col md={9}>
        <Controller
          name={`featuredItems.${itemIndex}.dvObjectId`}
          control={control}
          rules={rules}
          render={({ field: { value, onChange, ref }, fieldState: { invalid, error } }) => {
            return (
              <>
                <Form.Group.SelectAdvanced
                  options={options}
                  defaultValue={value as string}
                  onChange={(newValue) => {
                    onChange(newValue)
                    setTimeout(() => {
                      setFocus(`featuredItems.${itemIndex}.description`)
                    }, 300)
                  }}
                  inputButtonId={`dv-object-id-${itemIndex}`}
                  isSearchable
                  isInvalid={invalid}
                  isDisabled={!editEnabled}
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

export default DvObjectIdSelect
