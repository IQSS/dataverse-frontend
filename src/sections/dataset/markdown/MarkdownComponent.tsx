import ReactMarkdown from 'react-markdown'
import { useRef } from 'react'
interface Props {
  markdown: string
}
export function MarkdownComponent({ markdown }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}
