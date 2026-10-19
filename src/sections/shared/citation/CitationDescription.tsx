import { ReactNode, useRef } from 'react'
import parse from 'html-react-parser'
import styles from './Citation.module.scss'

interface CitationDescriptionProps {
  citation: string
  tooltip?: ReactNode
}

export function CitationDescription({ citation, tooltip }: CitationDescriptionProps) {
  const citationRef = useRef<HTMLSpanElement>(null)
  const citationAsReactElement = parse(citation)

  const handleSelectCitation = (event: React.MouseEvent<HTMLSpanElement>) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('a')) {
      return
    }

    if (!citationRef.current) return

    const doc = citationRef.current.ownerDocument
    const win = doc.defaultView ?? window
    const selection = win.getSelection()
    if (!selection) return

    const range = doc.createRange()
    range.selectNodeContents(citationRef.current)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  return (
    <div className={styles.description}>
      <span ref={citationRef} onClick={handleSelectCitation} onMouseUp={handleSelectCitation}>
        {citationAsReactElement}
      </span>
      {tooltip && <> {tooltip}</>}
    </div>
  )
}
