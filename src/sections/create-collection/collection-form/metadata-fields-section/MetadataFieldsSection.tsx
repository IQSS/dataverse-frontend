import { useTranslation } from 'react-i18next'
import { Col, Form, Row, Stack } from '@iqss/dataverse-design-system'
import { ReducedMetadataBlockInfo } from '../../useGetAllMetadataBlocksInfoByName'
import { MetadataInputLevelFieldsBlock } from './metadata-input-level-fields-block/MetadataInputLevelFieldsBlock'
import { FieldsFromRootCheckbox } from './fields-from-root-checkbox/FieldsFromRootCheckbox'
import { MetadataBlockName } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormHelper } from '../CollectionFormHelper'

interface MetadataFieldsSectionProps {
  allMetadataBlocksInfo: ReducedMetadataBlockInfo[]
}

export const MetadataFieldsSection = ({ allMetadataBlocksInfo }: MetadataFieldsSectionProps) => {
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
            <FieldsFromRootCheckbox />

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
