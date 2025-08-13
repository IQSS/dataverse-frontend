import ReactMarkdown from 'react-markdown'
import styles from './MarkdownComponent.module.scss'

interface Props {
  markdown: string
}

export function MarkdownComponent({ markdown }: Props) {
  return (
    <ReactMarkdown
      components={{
        img: (props) => <img {...props} className={styles['metadata-logo']} />
      }}>
      {markdown}
    </ReactMarkdown>
  )
}
