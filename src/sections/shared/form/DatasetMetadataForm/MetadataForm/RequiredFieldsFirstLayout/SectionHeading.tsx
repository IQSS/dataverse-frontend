import { type ReactNode } from 'react'
import styles from './RequiredFieldsFirstLayout.module.scss'

interface SectionHeadingProps {
  title: string
  summary?: ReactNode
  preview?: ReactNode
}

/**
 * The text inside a section's accordion header: the section title, a short summary beside it and,
 * optionally, a preview line underneath.
 */
export const SectionHeading = ({ title, summary, preview }: SectionHeadingProps) => (
  <span className={styles['section-heading']}>
    <span>
      <span className={styles['section-title']}>{title}</span>
      {/* The spaces keep the pieces apart when the heading is read aloud */}
      {summary && (
        <>
          {' '}
          <span className={styles['section-summary']}>{summary}</span>
        </>
      )}
    </span>
    {preview && (
      <>
        {' '}
        <span className={styles['section-preview']}>{preview}</span>
      </>
    )}
  </span>
)
