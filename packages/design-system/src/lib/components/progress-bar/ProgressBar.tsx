import { ProgressBar as ProgressBarBS } from 'react-bootstrap'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  now?: number
}

export function ProgressBar({ now }: ProgressBarProps) {
  return <ProgressBarBS now={now} />
}
