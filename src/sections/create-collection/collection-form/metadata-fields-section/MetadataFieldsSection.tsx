import { useTranslation } from 'react-i18next'
import { Col, Form, Row, Stack } from '@iqss/dataverse-design-system'
import { ReducedMetadataBlockInfo } from '../../useGetAllMetadataBlocksInfo'
import { MetadataInputLevelFieldsBlock } from './metadata-input-level-fields-block/MetadataInputLevelFieldsBlock'
import { FieldsFromParentCheckbox } from './fields-from-parent-checkbox/FieldsFromParentCheckbox'
import { MetadataBlockName } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormHelper } from '../CollectionFormHelper'
import { CollectionFormData } from '../CollectionForm'

interface MetadataFieldsSectionProps {
  allMetadataBlocksInfo: ReducedMetadataBlockInfo[]
  defaultValues: CollectionFormData
}

export const MetadataFieldsSection = ({
  allMetadataBlocksInfo,
  defaultValues
}: MetadataFieldsSectionProps) => {
  const { t } = useTranslation('createCollection')

  const {
    citationBlock,
    geospatialBlock,
    socialScienceBlock,
    astrophysicsBlock,
    biomedicalBlock,
    journalBlock
  } = CollectionFormHelper.separateMetadataBlocksInfoByNames(allMetadataBlocksInfo)

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('fields.metadataFields.label')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('fields.metadataFields.helperText')}</Form.Group.Text>
        <Col className="mt-3">
          <Stack gap={2}>
            <FieldsFromParentCheckbox defaultValues={defaultValues} />

            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.CITATION}
              blockDisplayName="Citation Metadata (Required)"
              reducedMetadataBlockInfo={citationBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.GEOSPATIAL}
              blockDisplayName="Geospatial Metadata"
              reducedMetadataBlockInfo={geospatialBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.SOCIAL_SCIENCE}
              blockDisplayName="Social Science and Humanities Metadata"
              reducedMetadataBlockInfo={socialScienceBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.ASTROPHYSICS}
              blockDisplayName="Astronomy and Astrophysics Metadata"
              reducedMetadataBlockInfo={astrophysicsBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.BIOMEDICAL}
              blockDisplayName="Life Sciences Metadata"
              reducedMetadataBlockInfo={biomedicalBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.JOURNAL}
              blockDisplayName="Journal Metadata"
              reducedMetadataBlockInfo={journalBlock}
            />
          </Stack>
        </Col>
      </Col>
    </Row>
  )
}
