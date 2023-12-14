import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import parse from 'html-react-parser'
import styles from '../../dataset/dataset-citation/DatasetCitation.module.scss'
import { useTranslation } from 'react-i18next'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'

interface CitationDescriptionProps {
  citation: string
  version: DatasetVersion
}

export function CitationDescription({ citation, version }: CitationDescriptionProps) {
  const citationAsReactElement = parse(citation)

  return (
    <span className={styles.citation}>
      {citationAsReactElement}
      <CitationTooltip status={version.publishingStatus} />
    </span>
  )
}

interface CitationTooltipProps {
  status: DatasetPublishingStatus
}

function CitationTooltip({ status }: CitationTooltipProps) {
  const { t } = useTranslation('dataset')

  if (status !== DatasetPublishingStatus.RELEASED) {
    return (
      <>
        {' '}
        <QuestionMarkTooltip
          placement={'top'}
          message={t(`citation.status.${status}.description`)}
        />
      </>
    )
  }
  return <></>
}
