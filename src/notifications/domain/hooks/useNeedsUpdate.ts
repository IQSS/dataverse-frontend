import { useSyncExternalStore } from 'react'
import { needsUpdateStore } from './needsUpdateStore'

export function useNeedsUpdate() {
  return useSyncExternalStore(needsUpdateStore.subscribe, needsUpdateStore.getSnapshot)
}
