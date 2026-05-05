export function formatBytes(input: number | undefined): string {
  if (input === undefined || input === null || Number.isNaN(input)) {
    return ''
  }
  if (input < 1024) {
    return `${input} B`
  }
  if (input < 1024 * 1024) {
    return `${(input / 1024).toFixed(1)} KB`
  }
  if (input < 1024 * 1024 * 1024) {
    return `${(input / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(input / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function formatCount(input: number | undefined): string {
  if (input === undefined || input === null || Number.isNaN(input)) {
    return ''
  }
  if (input < 1000) {
    return input.toString()
  }
  return `${(input / 1000).toFixed(1)}k`
}
