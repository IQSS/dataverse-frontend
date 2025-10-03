import { InputOptions, Option } from './SelectAdvanced'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return function debouncedFunction(...args: Parameters<T>): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Normalize to Option[]
export function normalizeOptions(input: InputOptions): Option[] {
  if (!input) return []
  if (typeof input[0] === 'string' || input.length === 0) {
    return (input as string[]).map((s) => ({ value: s, label: s }))
  }
  return input as Option[]
}

// Checks equality by content (value+label) regardless of order
export function areOptionArraysEqual(a: Option[], b: Option[]): boolean {
  if (a.length !== b.length) return false
  const A = [...a].sort((x, y) => x.value.localeCompare(y.value))
  const B = [...b].sort((x, y) => x.value.localeCompare(y.value))
  for (let i = 0; i < A.length; i++) {
    if (A[i].value !== B[i].value || A[i].label !== B[i].label) return false
  }
  return true
}
