/**
 * ## Description
 * The progress bar component is a bar that visually shows the progress of a process.
 * For example, a progress bar can show progress of a file upload (bytes uploaded vs. bytes remaining).
 * Progress bar takes as a parameter the current progress as percentage (now is between 0 and 100).
 */
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
