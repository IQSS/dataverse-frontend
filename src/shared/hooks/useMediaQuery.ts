import { useCallback, useSyncExternalStore } from 'react'
/**
 *
 * @param query The media query to listen changes
 * @returns a boolean value indicating whether the media query matches the current state of the device.
 * @doc https://usehooks.com/usemediaquery
 */

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (callback: EventListenerOrEventListenerObject) => {
      const matchMedia = window.matchMedia(query)

      matchMedia.addEventListener('change', callback)
      return () => {
        matchMedia.removeEventListener('change', callback)
      }
    },
    [query]
  )

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  const getServerSnapshot = () => {
    throw Error('useMediaQuery is a client-only hook')
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
