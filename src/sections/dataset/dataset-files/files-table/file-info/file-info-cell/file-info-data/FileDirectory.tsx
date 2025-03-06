export function FileDirectory({ directory }: { directory: string | undefined }) {
  if (!directory) {
    return <></>
  }
  return (
    <div data-testid="directory-container">
      <span>{directory}</span>
    </div>
  )
}
