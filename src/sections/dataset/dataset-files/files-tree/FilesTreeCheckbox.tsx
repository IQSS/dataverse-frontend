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
  return (
    <span
      role="checkbox"
      data-testid={testId}
      aria-checked={state === 'all' ? 'true' : state === 'partial' ? 'mixed' : 'false'}
      aria-label={label}
      tabIndex={0}
      className={cn(styles.checkbox, {
        [styles['checkbox-checked']]: state === 'all',
        [styles['checkbox-indeterminate']]: state === 'partial'
      })}
      onClick={handleClick}
      onKeyDown={handleKey}
    />
  )
}
