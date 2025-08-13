export class Utils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static debounce<T extends (...args: any[]) => unknown>(
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

  static getLocalStorageItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error)
      return null
    }
  }

  static sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
}
