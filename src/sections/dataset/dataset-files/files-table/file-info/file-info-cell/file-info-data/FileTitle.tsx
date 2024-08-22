import { LinkToPage } from '../../../../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../../../../Route.enum'
import { DvObjectType } from '../../../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface FileTitleProps {
  id: number
  name: string
}

export function FileTitle({ id, name }: FileTitleProps) {
  return (
    <LinkToPage page={Route.FILES} type={DvObjectType.FILE} searchParams={{ id: id.toString() }}>
      {name}
    </LinkToPage>
  )
}
