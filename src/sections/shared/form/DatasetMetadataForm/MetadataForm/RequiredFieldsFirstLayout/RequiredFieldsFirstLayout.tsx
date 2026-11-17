import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Accordion } from '@iqss/dataverse-design-system'
import { type MetadataBlockInfo } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { type DatasetTemplateInstruction } from '@/templates/domain/models/Template'
import { type User } from '@/users/domain/models/User'
import { type DatasetMetadataFormValues } from '../../MetadataFieldsHelper'
import { MetadataBlocksAccordion } from '../MetadataBlocksAccordion'
import { type UserDataPrefillValue } from '../userDataPrefill'
import { AccountSourceNote } from './AccountSourceNote'
import { RequiredFieldsHelper, type RequiredFieldEntry } from './RequiredFieldsHelper'
import { RequiredFieldsSection } from './RequiredFieldsSection'
import { SectionHeading } from './SectionHeading'
import { useRequiredFieldsStatus } from './useRequiredFieldsStatus'
import styles from './RequiredFieldsFirstLayout.module.scss'

interface RequiredFieldsFirstLayoutProps {
  metadataBlocksInfo: MetadataBlockInfo[]
  requiredFields: RequiredFieldEntry[]
  initialValues: DatasetMetadataFormValues
  accountPrefillValues: UserDataPrefillValue[]
  user: User | null
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
}

const STILL_NEEDED_KEY = 'still-needed'
const COMPLETED_KEY = 'completed'
const OPTIONAL_KEY = 'optional'
const OPTIONAL_PREVIEW_MAX_TITLES = 6

/**
 * The Create Dataset layout: the required fields that are still empty come first, from whichever
 * block they belong to; then the required fields that are already filled in (from the depositor's
 * account or a template); and last the optional fields, folded away and still grouped by block.
 *
 * Which section a field belongs to is decided once, from the values the form starts with, so that
 * fields do not jump around while the depositor is typing. The counts update live.
 */
export const RequiredFieldsFirstLayout = ({
  metadataBlocksInfo,
  requiredFields,
  initialValues,
  accountPrefillValues,
  user,
  datasetTemplateInstructions
}: RequiredFieldsFirstLayoutProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'datasetMetadataForm.requiredFieldsFirst' })

  const { stillNeeded, completed } = useMemo(
    () => RequiredFieldsHelper.splitByValues(requiredFields, initialValues),
    [requiredFields, initialValues]
  )

  const optionalBlocks = useMemo(
    () => RequiredFieldsHelper.getOptionalFieldsBlocks(metadataBlocksInfo),
    [metadataBlocksInfo]
  )

  const optionalFieldTitles = useMemo(
    () => RequiredFieldsHelper.getFieldTitles(optionalBlocks),
    [optionalBlocks]
  )

  const renderAccountSourceNote = (entry: RequiredFieldEntry) => {
    if (!user) return null

    const formName = RequiredFieldsHelper.getFormName(entry)
    const fieldPrefillValues = accountPrefillValues.filter(
      ({ fieldName }) => fieldName === formName || fieldName.startsWith(`${formName}.`)
    )

    return fieldPrefillValues.length > 0 ? (
      <AccountSourceNote user={user} prefillValues={fieldPrefillValues} />
    ) : null
  }

  return (
    <Accordion
      alwaysOpen
      defaultActiveKey={[STILL_NEEDED_KEY, COMPLETED_KEY]}
      className={styles.layout}
      data-testid="required-fields-first-layout">
      {stillNeeded.length > 0 && (
        <Accordion.Item
          eventKey={STILL_NEEDED_KEY}
          id="still-needed-fields"
          data-testid="still-needed-section">
          <Accordion.Header>
            <SectionHeading
              title={t('stillNeeded.title')}
              summary={<StillNeededSummary requiredFields={requiredFields} />}
            />
          </Accordion.Header>
          <Accordion.Body>
            <RequiredFieldsSection
              entries={stillNeeded}
              datasetTemplateInstructions={datasetTemplateInstructions}
            />
          </Accordion.Body>
        </Accordion.Item>
      )}

      {completed.length > 0 && (
        <Accordion.Item
          eventKey={COMPLETED_KEY}
          id="completed-fields"
          data-testid="completed-section">
          <Accordion.Header>
            <SectionHeading title={t('completed.title')} summary={t('completed.summary')} />
          </Accordion.Header>
          <Accordion.Body>
            <RequiredFieldsSection
              entries={completed}
              datasetTemplateInstructions={datasetTemplateInstructions}
              renderFieldFooter={renderAccountSourceNote}
            />
          </Accordion.Body>
        </Accordion.Item>
      )}

      {optionalBlocks.length > 0 && (
        <Accordion.Item
          eventKey={OPTIONAL_KEY}
          id="optional-fields"
          data-testid="optional-fields-section">
          <Accordion.Header>
            <SectionHeading
              title={t('optional.title')}
              summary={t('optional.summary', { count: optionalFieldTitles.length })}
              preview={<OptionalFieldsPreview titles={optionalFieldTitles} />}
            />
          </Accordion.Header>
          <Accordion.Body>
            <MetadataBlocksAccordion
              metadataBlocksInfo={optionalBlocks}
              datasetTemplateInstructions={datasetTemplateInstructions}
            />
          </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
  )
}

const StillNeededSummary = ({ requiredFields }: { requiredFields: RequiredFieldEntry[] }) => {
  const { t } = useTranslation('shared', {
    keyPrefix: 'datasetMetadataForm.requiredFieldsFirst.stillNeeded'
  })
  const { emptyCount, allFilled } = useRequiredFieldsStatus(requiredFields)

  return <>{allFilled ? t('allFilled') : t('summary', { count: emptyCount })}</>
}

const OptionalFieldsPreview = ({ titles }: { titles: string[] }) => {
  const { t } = useTranslation('shared', {
    keyPrefix: 'datasetMetadataForm.requiredFieldsFirst.optional'
  })
  const shownTitles = titles.slice(0, OPTIONAL_PREVIEW_MAX_TITLES)
  const hiddenCount = titles.length - shownTitles.length

  return (
    <>
      {shownTitles.join(' · ')}
      {hiddenCount > 0 && ` · ${t('more', { count: hiddenCount })}`}
    </>
  )
}
