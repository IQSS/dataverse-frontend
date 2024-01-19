import { LinkToPage } from '../../../../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../../../../Route.enum'

interface FileTitleProps {
  id: number
  name: string
}

export function FileTitle({ id, name }: FileTitleProps) {
  return (
    <LinkToPage page={Route.FILES} searchParams={{ id: id.toString() }}>
      {name}
    </LinkToPage>
  )
}
