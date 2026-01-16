// hooks/useNeedsUpdate.ts
import { useSyncExternalStore } from 'react'
type Listener = () => void

class NeedsUpdateStore {
  private needsUpdate = false
  private listeners = new Set<Listener>()

  getSnapshot = () => this.needsUpdate

  subscribe = (callback: Listener) => {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  setNeedsUpdate(value: boolean) {
    if (this.needsUpdate !== value) {
      this.needsUpdate = value
      this.emit()
    }
  }

  private emit() {
    this.listeners.forEach((listener) => listener())
  }
}
const needsUpdateStore = new NeedsUpdateStore()

export function useNeedsUpdate() {
  return useSyncExternalStore(needsUpdateStore.subscribe, needsUpdateStore.getSnapshot)
}
