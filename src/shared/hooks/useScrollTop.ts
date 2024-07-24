import { useEffect } from 'react'

export const useScrollTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
}
