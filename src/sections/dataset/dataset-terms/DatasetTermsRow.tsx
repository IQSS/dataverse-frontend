import { Col, Row } from '@iqss/dataverse-design-system'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import { MarkdownComponent } from '@/sections/dataset/markdown/MarkdownComponent'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface DatasetTermsRowProps {
  title: string
  tooltipMessage: string
  value?: string
}

export function DatasetTermsRow({ title, tooltipMessage, value }: DatasetTermsRowProps) {
  if (value === undefined) {
    return null
  }

  return (
    <Row className={styles['dataset-terms-row']}>
      <Col sm={3}>
        <strong>{title} </strong>
        <QuestionMarkTooltip placement="right" message={tooltipMessage} />
      </Col>
      <Col>{value && <div>{<MarkdownComponent markdown={value} />}</div>}</Col>
    </Row>
  )
}
