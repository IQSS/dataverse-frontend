import { ProgressBar as CProgressBarBS } from 'react-bootstrap'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  now?: number
}

export function ProgressBar({ now }: ProgressBarProps) {
  return <CProgressBarBS now={now} />
}
