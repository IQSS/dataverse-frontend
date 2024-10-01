import { useCallback, useEffect } from 'react'

const loggedErrors = new Set<string>()

export function useErrorLogger(error: Error | unknown): (error: Error) => void {
  const logErrorOnce = useCallback((err: Error): void => {
    const errorString = String(err)
    if (!loggedErrors.has(errorString)) {
      loggedErrors.add(errorString)
      console.error('Error:', err.message)
    }
  }, [])

  useEffect(() => {
    if (error) {
      logErrorOnce(error as Error)
    }
  }, [error, logErrorOnce])

  return logErrorOnce
}
