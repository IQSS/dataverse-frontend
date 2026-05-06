import { KeyboardEvent, MouseEvent } from 'react'
import cn from 'classnames'
import styles from './FilesTree.module.scss'
import { SelectionState } from './useFileTreeSelection'

interface FilesTreeCheckboxProps {
  state: SelectionState
  onToggle: () => void
  label: string
  testId?: string
}

export function FilesTreeCheckbox({ state, onToggle, label, testId }: FilesTreeCheckboxProps) {
  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    onToggle()
  }
  const handleKey = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      onToggle()
    }
  }
  // Inside a tree row we follow the WAI-ARIA tree pattern: only the
  // focused row participates in the page tab order (roving tabindex on
  // the row itself), and Space on that row toggles selection. The
  // checkbox handles mouse / keyboard activation when focused but is
  // skipped on Tab so the user doesn't have to tab through every row.
  return (
    <span
      role="checkbox"
      data-testid={testId}
      aria-checked={state === 'all' ? 'true' : state === 'partial' ? 'mixed' : 'false'}
      aria-label={label}
      tabIndex={-1}
      className={cn(styles.checkbox, {
        [styles['checkbox-checked']]: state === 'all',
        [styles['checkbox-indeterminate']]: state === 'partial'
      })}
      onClick={handleClick}
      onKeyDown={handleKey}
    />
  )
}
