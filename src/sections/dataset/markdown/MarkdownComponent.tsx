import ReactMarkdown from 'react-markdown'
interface Props {
  markdown: string
}
export function MarkdownComponent({ markdown }: Props) {
  return <ReactMarkdown>{markdown}</ReactMarkdown>
}
