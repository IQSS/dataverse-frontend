import { LinkToPage } from '../../../../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../../../../Route.enum'
import { DatasetVersionNumber } from '../../../../../../../dataset/domain/models/Dataset'

interface FileTitleProps {
  id: number
  name: string
  datasetVersionNumber: DatasetVersionNumber
}

export function FileTitle({ id, name, datasetVersionNumber }: FileTitleProps) {
  return (
    <LinkToPage
      page={Route.FILES}
      searchParams={{ id: id.toString(), datasetVersion: datasetVersionNumber.toSearchParam() }}>
      {name}
    </LinkToPage>
  )
}
