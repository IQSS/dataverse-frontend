interface FileTitleProps {
  link: string
  name: string
}

export function FileTitle({ link, name }: FileTitleProps) {
  return <a href={link}>{name}</a>
}
