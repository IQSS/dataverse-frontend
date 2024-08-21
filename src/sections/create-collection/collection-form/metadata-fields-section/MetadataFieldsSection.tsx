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
  const { t } = useTranslation('createCollection', { keyPrefix: 'fields.metadataFields' })

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
        <Form.Group.Label>{t('sectionLabel')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('helperText')}</Form.Group.Text>
        <Col className="mt-3">
          <Stack gap={2}>
            <FieldsFromParentCheckbox defaultValues={defaultValues} />

            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.CITATION}
              blockDisplayName={t('citationMetadata')}
              reducedMetadataBlockInfo={citationBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.GEOSPATIAL}
              blockDisplayName={t('geospatialMetadata')}
              reducedMetadataBlockInfo={geospatialBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.SOCIAL_SCIENCE}
              blockDisplayName={t('socialScienceMetadata')}
              reducedMetadataBlockInfo={socialScienceBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.ASTROPHYSICS}
              blockDisplayName={t('astrophysicsMetadata')}
              reducedMetadataBlockInfo={astrophysicsBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.BIOMEDICAL}
              blockDisplayName={t('biomedicalMetadata')}
              reducedMetadataBlockInfo={biomedicalBlock}
            />
            <MetadataInputLevelFieldsBlock
              blockName={MetadataBlockName.JOURNAL}
              blockDisplayName={t('journalMetadata')}
              reducedMetadataBlockInfo={journalBlock}
            />
          </Stack>
        </Col>
      </Col>
    </Row>
  )
}
