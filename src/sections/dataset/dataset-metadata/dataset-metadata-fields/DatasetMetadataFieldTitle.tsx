import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'

interface DatasetMetadataFieldTitleProps {
  title: string
  description: string
}

export function DatasetMetadataFieldTitle({ title, description }: DatasetMetadataFieldTitleProps) {
  return (
    <>
      <strong>{title} </strong>
      <QuestionMarkTooltip placement="right" message={description}></QuestionMarkTooltip>
    </>
  )
}
