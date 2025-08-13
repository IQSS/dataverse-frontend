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

export function areArraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length === 0 && arr2.length === 0) {
    return true
  }

  if (arr1.length !== arr2.length) {
    return false
  }

  const sortedArr1 = arr1.slice().sort()
  const sortedArr2 = arr2.slice().sort()

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false
    }
  }

  return true
}
