import { DatasetMetadataField as DatasetMetadataFieldModel } from '../../../../dataset/domain/models/Dataset'
import { Row } from 'dataverse-design-system'

function camelCaseToTitleCase(camelCase: string) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
}

interface DatasetMetadataFieldProps {
  metadataField: DatasetMetadataFieldModel
}

export function DatasetMetadataField({ metadataField }: DatasetMetadataFieldProps) {
  return (
    <>
      {Object.entries(metadataField).map(([key, value]) => (
        <Row key={`${key}`}>
          <strong>{camelCaseToTitleCase(key)}</strong>
          {typeof value === 'string' ? value : <DatasetMetadataField metadataField={value} />}
        </Row>
      ))}
    </>
  )
}
