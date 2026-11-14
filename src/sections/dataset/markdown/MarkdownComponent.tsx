import ReactMarkdown from 'react-markdown'
import styles from './MarkdownComponent.module.scss'

interface Props {
  markdown: string
}

export function autolinkUrls(text: string): string {
  if (!text) return text
  const pattern =
    /(```[\s\S]*?```|`[^`]+`|!?\[[^\]]*\]\([^)]+\)|<[^>]+>)|((?:https?|ftp):\/\/[^\s<>]+)/g

  return text.replace(pattern, (_match, preserved?: string, url?: string) => {
    if (preserved || !url) return preserved ?? ''

    let cleanUrl = url
    let trailing = ''

    while (cleanUrl.length > 0) {
      const lastChar = cleanUrl.slice(-1)

      if (
        lastChar === ')' &&
        (cleanUrl.match(/\(/g) || []).length < (cleanUrl.match(/\)/g) || []).length
      ) {
        trailing = lastChar + trailing
        cleanUrl = cleanUrl.slice(0, -1)
      } else if (/[.,;:!?"'«»“”‘’]/.test(lastChar)) {
        trailing = lastChar + trailing
        cleanUrl = cleanUrl.slice(0, -1)
      } else {
        break
      }
    }

    return `[${cleanUrl}](${cleanUrl})${trailing}`
  })
}

export function MarkdownComponent({ markdown }: Props) {
  const processedMarkdown = autolinkUrls(markdown)

  return (
    <ReactMarkdown
      components={{
        a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
        img: (props) => <img {...props} className={styles['metadata-logo']} />
      }}>
      {processedMarkdown}
    </ReactMarkdown>
  )
}
