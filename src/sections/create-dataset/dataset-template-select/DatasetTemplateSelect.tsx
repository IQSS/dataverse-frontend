import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form } from '@iqss/dataverse-design-system'
import { DatasetTemplate } from '@/dataset/domain/models/DatasetTemplate'

interface DatasetTemplateSelectProps {
  datasetTemplates: DatasetTemplate[]
  onChange: (selectedTemplateId: string) => void
}

export const DatasetTemplateSelect = ({
  datasetTemplates,
  onChange
}: DatasetTemplateSelectProps) => {
  const { t } = useTranslation('createDataset')

  const options = useMemo(
    () =>
      datasetTemplates.map((template) => ({
        label: template.name,
        value: template.id.toString()
      })),
    [datasetTemplates]
  )

  // Find the default template if any and use it as the default value if no template is selected
  const defaultTemplate: DatasetTemplate | null = useMemo(
    () => datasetTemplates.find((template) => template.isDefault) || null,
    [datasetTemplates]
  )

  return (
    <Form.Group>
      <Form.Group.Label
        message={t('template.description')}
        column
        sm={3}
        htmlFor="dataset-template">
        {t('template.label')}
      </Form.Group.Label>
      <Col sm={9}>
        <Form.Group.Text>{t('template.helpText')}</Form.Group.Text>
        <Form.Group.SelectAdvanced
          defaultValue={defaultTemplate?.id.toString() ?? undefined}
          options={options}
          onChange={onChange}
          isMultiple={false}
          isSearchable={false}
          inputButtonId="dataset-template"
          locales={{ select: 'None' }}
        />
      </Col>
    </Form.Group>
  )
}
