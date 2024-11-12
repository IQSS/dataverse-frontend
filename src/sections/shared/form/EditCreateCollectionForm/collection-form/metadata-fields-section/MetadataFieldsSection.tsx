import { useTranslation } from 'react-i18next'
import { Col, Form, Row, Stack } from '@iqss/dataverse-design-system'

import { MetadataInputLevelFieldsBlock } from './metadata-input-level-fields-block/MetadataInputLevelFieldsBlock'
import { FieldsFromParentCheckbox } from './fields-from-parent-checkbox/FieldsFromParentCheckbox'
import {
  MetadataBlockInfo,
  MetadataBlockName
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormData } from '../../types'

interface MetadataFieldsSectionProps {
  allMetadataBlocksInfo: MetadataBlockInfo[]
  defaultValues: CollectionFormData
  isEditingRootCollection: boolean
}

export const MetadataFieldsSection = ({
  allMetadataBlocksInfo,
  defaultValues,
  isEditingRootCollection
}: MetadataFieldsSectionProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm.fields.metadataFields' })

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('sectionLabel')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('helperText')}</Form.Group.Text>
        <Col className="mt-3">
          <Stack gap={3}>
            {!isEditingRootCollection && <FieldsFromParentCheckbox defaultValues={defaultValues} />}

            <Stack gap={1}>
              {allMetadataBlocksInfo.map((block) => {
                return (
                  <MetadataInputLevelFieldsBlock
                    key={block.name}
                    blockName={block.name as MetadataBlockName}
                    blockDisplayName={block.displayName}
                    metadataBlockInfo={block}
                    isEditingRootCollection={isEditingRootCollection}
                    defaultValues={defaultValues}
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
