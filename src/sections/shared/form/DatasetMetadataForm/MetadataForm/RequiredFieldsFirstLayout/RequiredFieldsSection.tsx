import { type ReactNode } from 'react'
import { type DatasetTemplateInstruction } from '@/templates/domain/models/Template'
import { MetadataFormField } from '../MetadataBlockFormFields/MetadataFormField'
import { RequiredFieldsHelper, type RequiredFieldEntry } from './RequiredFieldsHelper'
import styles from './RequiredFieldsFirstLayout.module.scss'

interface RequiredFieldsSectionProps {
  entries: RequiredFieldEntry[]
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
  renderFieldFooter?: (entry: RequiredFieldEntry) => ReactNode
}

/**
 * The required fields of one section ("Still needed" or "Completed"), grouped under the name of the
 * metadata block each one comes from.
 */
export const RequiredFieldsSection = ({
  entries,
  datasetTemplateInstructions,
  renderFieldFooter
}: RequiredFieldsSectionProps) => {
  const groups = RequiredFieldsHelper.groupByBlock(entries)

  return (
    <>
      {groups.map((group) => (
        <div
          key={group.blockName}
          className={styles['block-group']}
          data-testid={`required-fields-block-${group.blockName}`}>
          <h3 className={styles['block-heading']}>{group.blockDisplayName}</h3>

          {group.entries.map((entry) => {
            const formName = RequiredFieldsHelper.getFormName(entry)

            return (
              <div key={formName} className={styles['field-container']} data-field-name={formName}>
                <MetadataFormField
                  metadataFieldInfo={entry.field}
                  metadataBlockName={entry.blockName}
                  datasetTemplateInstructions={datasetTemplateInstructions}
                />
                {renderFieldFooter?.(entry)}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}
