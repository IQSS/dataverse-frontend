import { useTranslation } from 'react-i18next'
import { Col, Row } from '@iqss/dataverse-design-system'
import { DatasetMetadataFieldValue as DatasetMetadataFieldValueModel } from '../../../../dataset/domain/models/Dataset'
import { DatasetMetadataFieldValue } from './DatasetMetadataFieldValue'
import { DatasetMetadataFieldTitle } from './DatasetMetadataFieldTitle'
import { MetadataBlockInfoDisplayFormat } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import styles from './DatasetMetadataField.module.scss'

interface DatasetMetadataFieldProps {
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
}

export function DatasetMetadataField({
  metadataFieldName,
  metadataFieldValue,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldProps) {
  const { t } = useTranslation('dataset')

  // To show custom titles and descriptions for specific fields
  const getFieldInfo = (fieldName: string) => {
    switch (fieldName) {
      case 'persistentId':
        return {
          title: t('persistentId.name'),
          description: t('persistentId.description')
        }
      case 'publicationDate':
        return {
          title: t('publicationDate.name'),
          description: t('publicationDate.description')
        }
      case 'alternativePersistentId':
        return {
          title: t('alternativePersistentId.name'),
          description: t('alternativePersistentId.description')
        }
      default:
        return {
          title: metadataBlockDisplayFormatInfo.fields[fieldName]?.title,
          description: metadataBlockDisplayFormatInfo.fields[fieldName]?.description
        }
    }
  }

  // To show custom tips for specific fields
  const getFieldTip = (fieldName: string) => {
    switch (fieldName) {
      case 'datasetContact':
        return t('contact.tip')
      default:
        return ''
    }
  }

  const { title, description } = getFieldInfo(metadataFieldName)
  const fieldTip = getFieldTip(metadataFieldName)

  return (
    <Row>
      <Col md={3}>
        <DatasetMetadataFieldTitle title={title} description={description} />
      </Col>
      <Col md={9} className="pt-1 pt-md-0 pb-1">
        {fieldTip && <span className={styles.tip}>{fieldTip}</span>}

        <DatasetMetadataFieldValue
          metadataFieldName={metadataFieldName}
          metadataFieldValue={metadataFieldValue}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
        />
      </Col>
    </Row>
  )
}
