import { useLocation } from 'react-router-dom'
import { useEffect, useState, createContext, useContext } from 'react'

const HistoryContext = createContext<{ history: string[]; previousPath: string | null }>({
  history: [],
  previousPath: null
})

export const useHistoryTracker = () => useContext(HistoryContext)

export const HistoryTrackerProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [history, setHistory] = useState<string[]>([location.pathname])

  const previousPath = history.length >= 2 ? history[history.length - 2] : null

  useEffect(() => {
    setHistory((prev) => {
      const last = prev[prev.length - 1]
      if (last !== location.pathname) {
        return [...prev, location.pathname]
      }
      return prev
    })
  }, [location.pathname])

  return (
    <HistoryContext.Provider value={{ history, previousPath }}>{children}</HistoryContext.Provider>
  )
}
