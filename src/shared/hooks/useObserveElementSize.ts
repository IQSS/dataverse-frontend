import { useEffect, useState } from 'react'

export const useObserveElementSize = (elementRef: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    let resizeObserverEntries: ResizeObserverEntry[] = []

    const observer = new ResizeObserver((entries) => {
      const target = entries[0].target
      const width = target.clientWidth
      const height = target.clientHeight

      setSize({ width, height })

      resizeObserverEntries = entries
    })

    if (elementRef.current) observer.observe(elementRef.current)

    return () => {
      resizeObserverEntries.forEach((entry) => entry.target.remove())
      observer.disconnect()
    }
  }, [elementRef])

  return size
}
