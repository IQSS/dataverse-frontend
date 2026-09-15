import { useEffect } from 'react'

export function useBeforeUnloadGuard(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [active])
}
