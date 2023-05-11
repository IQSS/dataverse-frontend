import { Alert as AlertBS } from 'react-bootstrap'

interface AlertLinkProps {
  link: string
  href: string
}

export function AlertLink({ link, href }: AlertLinkProps) {
  return <AlertBS.Link href={href}>{link}</AlertBS.Link>
}
