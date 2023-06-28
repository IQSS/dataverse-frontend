export function FileDirectory({ directory }: { directory: string | undefined }) {
  if (!directory) {
    return <></>
  }
  return (
    <div className="directory-container">
      <span>{directory}</span>
    </div>
  )
}
