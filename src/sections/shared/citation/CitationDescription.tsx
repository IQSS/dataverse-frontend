import parse from 'html-react-parser'
import styles from './Citation.module.scss'
import { ReactNode } from 'react'

interface CitationDescriptionProps {
  citation: string
  tooltip?: ReactNode
}

export function CitationDescription({ citation, tooltip }: CitationDescriptionProps) {
  const citationAsReactElement = parse(citation)

  return (
    <div className={styles.description}>
      <span>
        {citationAsReactElement} {tooltip}
      </span>
    </div>
  )
}
