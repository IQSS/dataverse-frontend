import { Accordion } from '@iqss/dataverse-design-system'
import { type MetadataBlockInfo } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { type DatasetTemplateInstruction } from '@/templates/domain/models/Template'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'

interface MetadataBlocksAccordionProps {
  metadataBlocksInfo: MetadataBlockInfo[]
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
  defaultActiveKey?: string
}

/**
 * One accordion section per metadata block, each holding all the fields of that block.
 * This is the layout of the Edit Metadata page, and of the optional fields on the Create Dataset page.
 */
export const MetadataBlocksAccordion = ({
  metadataBlocksInfo,
  datasetTemplateInstructions,
  defaultActiveKey = '0'
}: MetadataBlocksAccordionProps) => {
  return (
    <Accordion defaultActiveKey={defaultActiveKey}>
      {metadataBlocksInfo.map((metadataBlock, index) => (
        <Accordion.Item
          eventKey={index.toString()}
          id={`metadata-block-item-${metadataBlock.name}`}
          key={metadataBlock.id}>
          <Accordion.Header>{metadataBlock.displayName}</Accordion.Header>
          <Accordion.Body>
            <MetadataBlockFormFields
              metadataBlock={metadataBlock}
              datasetTemplateInstructions={datasetTemplateInstructions}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
