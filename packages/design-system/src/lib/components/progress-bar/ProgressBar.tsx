interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  now?: number
}

export function ProgressBar({
  now,
  'aria-label': ariaLabel = 'progress bar',
  ...rest
}: ProgressBarProps) {
  return (
    <div className="progress">
      <div
        role="progressbar"
        className="progress-bar"
        style={{ width: now ? now.toString() + '%' : undefined }}
        aria-valuenow={now}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        {...rest}
      />
    </div>
  )
}
