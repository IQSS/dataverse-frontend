import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './MarkdownComponent.module.scss'

interface Props {
  markdown: string
}

export function MarkdownComponent({ markdown }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
        img: ({ node: _node, ...props }) => <img {...props} className={styles['metadata-logo']} />
      }}>
      {markdown}
    </ReactMarkdown>
  )
}
