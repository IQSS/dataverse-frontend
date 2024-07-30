import { useTranslation } from 'react-i18next'
import { Col, Form, Row, Stack } from '@iqss/dataverse-design-system'
import { MetadataInputLevelFieldsBlock } from './metadata-input-level-fields-block/MetadataInputLevelFieldsBlock'
import { FieldsFromRootCheckbox } from './fields-from-root-checkbox/FieldsFromRootCheckbox'
import { MetadataBlockName } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface MetadataFieldsSectionProps {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export const MetadataFieldsSection = ({
  metadataBlockInfoRepository
}: MetadataFieldsSectionProps) => {
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
            <FieldsFromRootCheckbox />

            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.CITATION}
              blockDisplayName="Citation Metadata (Required)"
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.GEOSPATIAL}
              blockDisplayName="Geospatial Metadata"
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.SOCIAL_SCIENCE}
              blockDisplayName="Social Science and Humanities Metadata"
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.ASTROPHYSICS}
              blockDisplayName="Astronomy and Astrophysics Metadata"
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.BIOMEDICAL}
              blockDisplayName="Life Sciences Metadata"
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.JOURNAL}
              blockDisplayName="Journal Metadata"
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
          </Stack>
        </Col>
      </Col>
    </Row>
  )
}
