type ProcessShim = {
  env: Record<string, string | undefined>
  nextTick: (callback: (...args: unknown[]) => void, ...args: unknown[]) => void
  binding: () => Record<string, never>
}

const globalWithProcess = globalThis as unknown as {
  process?: Partial<ProcessShim>
}

if (!globalWithProcess.process) {
  globalWithProcess.process = {}
}

if (!globalWithProcess.process.env) {
  globalWithProcess.process.env = {}
}

if (!globalWithProcess.process.nextTick) {
  globalWithProcess.process.nextTick = (callback, ...args) => {
    queueMicrotask(() => {
      callback(...args)
    })
  }
}

if (!globalWithProcess.process.binding) {
  globalWithProcess.process.binding = () => ({})
}
