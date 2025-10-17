import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form } from '@iqss/dataverse-design-system'
import { DatasetType } from '@/dataset/domain/models/DatasetType'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'

interface DatasetTypeSelectProps {
  datasetTypes: DatasetType[]
  onChange: (selectedTypeName: string) => void
}

export const DatasetTypeSelect = ({ datasetTypes, onChange }: DatasetTypeSelectProps) => {
  const { t } = useTranslation('createDataset')

  const options = useMemo(
    () =>
      datasetTypes.map((dt) => ({
        label: dt.name.charAt(0).toUpperCase() + dt.name.slice(1),
        value: dt.id.toString()
      })),
    [datasetTypes]
  )

  const defaultType: DatasetType | null = useMemo(
    () => datasetTypes.find((dt) => dt.name === DvObjectType.DATASET) || null,
    [datasetTypes]
  )

  return (
    <Form.Group data-testid="dataset-type-select">
      <Form.Group.Label message={t('datasetType.description')} column sm={3} htmlFor="dataset-type">
        {t('datasetType.label')}
      </Form.Group.Label>
      <Col sm={9}>
        <Form.Group.Text>{t('datasetType.helpText')}</Form.Group.Text>
        <Form.Group.SelectAdvanced
          defaultValue={defaultType?.id.toString() ?? undefined}
          options={options}
          onChange={onChange}
          isMultiple={false}
          isSearchable={false}
          inputButtonId="dataset-type"
          showPlaceholderOptionInMenu={false}
          locales={{ select: t('datasetType.placeholder') }}
        />
      </Col>
    </Form.Group>
  )
}
