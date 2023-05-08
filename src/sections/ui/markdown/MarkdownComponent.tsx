import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'

interface Props {
  markdown: string
}

const MarkdownComponent: React.FC<Props> = ({ markdown }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (containerRef.current) {
      ReactDOM.render(<ReactMarkdown>{markdown}</ReactMarkdown>, containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        ReactDOM.unmountComponentAtNode(containerRef.current)
      }
    }
  }, [markdown])

  return <div ref={containerRef} />
}

export default MarkdownComponent
