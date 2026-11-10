import { FileTreeItem } from '@/files/domain/models/FileTreeItem'

export const knownChildrenAggregation = {
  concat(path: string, arrays: FileTreeItem[][]): FileTreeItem[] {
    const out: FileTreeItem[] = []
    for (const items of arrays) {
      out.push(...items)
    }
    return out
  }
}

interface CacheEntry {
  deps: FileTreeItem[][]
  value: FileTreeItem[]
}

export function createKnownChildrenCache() {
  const cache = new Map<string, CacheEntry>()
  return (path: string, deps: FileTreeItem[][]): FileTreeItem[] => {
    const cached = cache.get(path)
    if (cached && sameArrays(cached.deps, deps)) {
      return cached.value
    }
    const value = knownChildrenAggregation.concat(path, deps)
    cache.set(path, { deps, value })
    return value
  }
}

function sameArrays(a: FileTreeItem[][], b: FileTreeItem[][]): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
