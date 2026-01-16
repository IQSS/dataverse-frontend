// store/updateFlagStore.ts
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

export const needsUpdateStore = new NeedsUpdateStore()
