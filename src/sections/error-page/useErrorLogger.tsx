import { useCallback, useEffect } from 'react'

const loggedErrors = new Set<string>()

export function useErrorLogger(error: Error | unknown): (error: Error) => void {
  const logErrorOnce = useCallback((err: Error & { data?: unknown }): void => {
    const errorString = String(err.data)
    if (!loggedErrors.has(errorString)) {
      loggedErrors.add(errorString)
      console.error('Error:', err)
    }
  }, [])

  useEffect(() => {
    if (error) {
      logErrorOnce(error as Error)
    }
  }, [error, logErrorOnce])

  return logErrorOnce
}
