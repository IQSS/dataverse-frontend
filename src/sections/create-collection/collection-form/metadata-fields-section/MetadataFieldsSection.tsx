import { useTranslation } from 'react-i18next'
import { Col, Form, Row, Stack } from '@iqss/dataverse-design-system'

import { MetadataInputLevelFieldsBlock } from './metadata-input-level-fields-block/MetadataInputLevelFieldsBlock'
import { FieldsFromParentCheckbox } from './fields-from-parent-checkbox/FieldsFromParentCheckbox'
import {
  MetadataBlockInfo,
  MetadataBlockName
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormData } from '../CollectionForm'

interface MetadataFieldsSectionProps {
  allMetadataBlocksInfo: MetadataBlockInfo[]
  defaultValues: CollectionFormData
}

export const MetadataFieldsSection = ({
  allMetadataBlocksInfo,
  defaultValues
}: MetadataFieldsSectionProps) => {
  const { t } = useTranslation('createCollection', { keyPrefix: 'fields.metadataFields' })

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('sectionLabel')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('helperText')}</Form.Group.Text>
        <Col className="mt-3">
          <Stack gap={3}>
            <FieldsFromParentCheckbox defaultValues={defaultValues} />
            <Stack gap={1}>
              {allMetadataBlocksInfo.map((block) => {
                return (
                  <MetadataInputLevelFieldsBlock
                    key={block.name}
                    blockName={block.name as MetadataBlockName}
                    blockDisplayName={block.displayName}
                    metadataBlockInfo={block}
                  />
                )
              })}
            </Stack>
          </Stack>
        </Col>
      </Col>
    </Row>
  )
}
