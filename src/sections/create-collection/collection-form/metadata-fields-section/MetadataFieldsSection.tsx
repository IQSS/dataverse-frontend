import { useTranslation } from 'react-i18next'
import { Col, Form, Row, Stack } from '@iqss/dataverse-design-system'
import { MetadataInputLevelFieldsBlock } from './metadata-input-level-fields-block/MetadataInputLevelFieldsBlock'
import { MetadataFieldsFromRootCheckbox } from './MetadataFieldsFromRootCheckbox'
import { MetadataBlockName } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

export const MetadataFieldsSection = () => {
  const { t } = useTranslation('createCollection')

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('fields.metadataFields.label')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('fields.metadataFields.helperText')}</Form.Group.Text>
        <Col className="mt-3">
          <Stack gap={2}>
            <MetadataFieldsFromRootCheckbox />

            <MetadataInputLevelFieldsBlock
              name={MetadataBlockName.CITATION}
              blockDisplayName="Citation Metadata (Required)"
            />
            <MetadataInputLevelFieldsBlock
              name={MetadataBlockName.GEOSPATIAL}
              blockDisplayName="Geospatial Metadata"
            />
            <MetadataInputLevelFieldsBlock
              name={MetadataBlockName.SOCIAL_SCIENCE}
              blockDisplayName="Social Science and Humanities Metadata"
            />
            <MetadataInputLevelFieldsBlock
              name={MetadataBlockName.ASTROPHYSICS}
              blockDisplayName="Astronomy and Astrophysics Metadata"
            />
            <MetadataInputLevelFieldsBlock
              name={MetadataBlockName.BIOMEDICAL}
              blockDisplayName="Life Sciences Metadata"
            />
            <MetadataInputLevelFieldsBlock
              name={MetadataBlockName.JOURNAL}
              blockDisplayName="Journal Metadata"
            />
          </Stack>
        </Col>
      </Col>
    </Row>
  )
}
