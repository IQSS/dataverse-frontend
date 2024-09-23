import { useEffect } from 'react'

/**
 * Hook that listens to the popstate event and calls the onPopStateEvent function.
 * This is to load collection items when the user navigates back and forward in the browser history within the collection page.
 * @param loadCollectionItems - Function to be called when the popstate event is triggered
 */

export const useLoadMoreOnPopStateEvent = (onPopStateEvent: () => Promise<void>) => {
  useEffect(() => {
    const handlePopState = (_e: PopStateEvent) => {
      void onPopStateEvent()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
