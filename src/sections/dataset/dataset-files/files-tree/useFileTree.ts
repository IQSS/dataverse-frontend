import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FileTreeRepository,
  GetFileTreeNodeParams
} from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeFile, FileTreeItem, isFileTreeFile } from '@/files/domain/models/FileTreeItem'
import { FileTreeInclude, FileTreeOrder } from '@/files/domain/models/FileTreePage'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'

export interface FolderNode {
  path: string
  items: FileTreeItem[]
  nextCursor: string | null
  loading: boolean
  error?: string
  loaded: boolean
}

export interface UseFileTreeArgs {
  repository: FileTreeRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  pageSize?: number
  order?: FileTreeOrder
  include?: FileTreeInclude
  /**
   * Path to expand on mount — typically read from a `?path=` URL query
   * param so a deep link opens the tree at the bookmarked folder. The
   * hook expands every ancestor along the way (e.g. `data/raw/2024`
   * causes `data`, `data/raw`, and `data/raw/2024` all to be expanded).
   */
  initialPath?: string
}

export interface UseFileTreeApi {
  rootNode: FolderNode
  nodes: ReadonlyMap<string, FolderNode>
  expanded: ReadonlySet<string>
  /**
   * The deepest folder currently in the expanded set. Empty string means
   * only the root is expanded. Useful for surfacing a single canonical
   * path to a URL bookmark.
   */
  currentPath: string
  toggleExpanded: (path: string) => Promise<void>
  expand: (path: string) => Promise<void>
  collapse: (path: string) => void
  loadMore: (path: string) => Promise<void>
  refresh: (path?: string) => Promise<void>
  registerKnownFile: (file: FileTreeFile) => void
  knownFiles: ReadonlyMap<string, FileTreeFile>
  visibleKnownChildren: (path: string) => FileTreeItem[]
}

const ROOT = ''

/**
 * Returns the chain of ancestor paths for a folder, including the folder
 * itself but excluding the empty root. For `data/raw/2024` →
 * `['data', 'data/raw', 'data/raw/2024']`.
 */
function ancestorChain(path: string): string[] {
  if (!path) {
    return []
  }
  const parts = path.split('/').filter((p) => p.length > 0)
  const out: string[] = []
  let acc = ''
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part
    out.push(acc)
  }
  return out
}

/**
 * Picks the deepest folder from a set of expanded paths — used to derive
 * `currentPath` for URL bookmarking. Returns `''` if no non-root folder
 * is expanded.
 */
function deepestExpanded(set: ReadonlySet<string>): string {
  let deepest = ''
  let depth = 0
  for (const path of set) {
    if (!path) continue
    const d = path.split('/').length
    if (d > depth) {
      deepest = path
      depth = d
    }
  }
  return deepest
}

export function useFileTree({
  repository,
  datasetPersistentId,
  datasetVersion,
  pageSize = 200,
  order = FileTreeOrder.NAME_AZ,
  include = FileTreeInclude.ALL,
  initialPath = ''
}: UseFileTreeArgs): UseFileTreeApi {
  const [nodes, setNodes] = useState<Map<string, FolderNode>>(() => new Map())
  const initialExpanded = (() => {
    const set = new Set<string>([ROOT])
    for (const ancestor of ancestorChain(initialPath)) {
      set.add(ancestor)
    }
    return set
  })()
  const [expanded, setExpanded] = useState<Set<string>>(() => initialExpanded)
  const knownFilesRef = useRef<Map<string, FileTreeFile>>(new Map())
  const inFlight = useRef<Map<string, Promise<void>>>(new Map())
  const versionKey = `${datasetPersistentId}::${datasetVersion.number.toString()}::${order}::${include}`
  const previousKey = useRef<string>(versionKey)

  const setNode = useCallback((path: string, updater: (prev: FolderNode) => FolderNode) => {
    setNodes((prev) => {
      const next = new Map(prev)
      const current = prev.get(path) ?? {
        path,
        items: [],
        nextCursor: null,
        loading: false,
        loaded: false
      }
      next.set(path, updater(current))
      return next
    })
  }, [])

  const fetchPage = useCallback(
    async (path: string, cursor?: string) => {
      const params: GetFileTreeNodeParams = {
        datasetPersistentId,
        datasetVersion,
        path,
        limit: pageSize,
        cursor,
        order,
        include
      }
      setNode(path, (prev) => ({ ...prev, loading: true, error: undefined }))
      try {
        const page = await repository.getNode(params)
        for (const item of page.items) {
          if (isFileTreeFile(item)) {
            knownFilesRef.current.set(item.path, item)
          }
        }
        setNode(path, (prev) => ({
          ...prev,
          items: cursor ? [...prev.items, ...page.items] : page.items,
          nextCursor: page.nextCursor,
          loading: false,
          loaded: true,
          error: undefined
        }))
      } catch (error) {
        setNode(path, (prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : String(error)
        }))
      }
    },
    [datasetPersistentId, datasetVersion, include, order, pageSize, repository, setNode]
  )

  const ensureLoaded = useCallback(
    (path: string): Promise<void> => {
      const existing = nodes.get(path)
      if (existing && existing.loaded && !existing.error) {
        return Promise.resolve()
      }
      const pending = inFlight.current.get(path)
      if (pending) {
        return pending
      }
      const promise = fetchPage(path).finally(() => {
        inFlight.current.delete(path)
      })
      inFlight.current.set(path, promise)
      return promise
    },
    [fetchPage, nodes]
  )

  useEffect(() => {
    if (previousKey.current !== versionKey) {
      previousKey.current = versionKey
      setNodes(new Map())
      const reset = new Set<string>([ROOT])
      for (const ancestor of ancestorChain(initialPath)) {
        reset.add(ancestor)
      }
      setExpanded(reset)
      knownFilesRef.current = new Map()
      inFlight.current.clear()
    }
    void ensureLoaded(ROOT)
    // Pre-fetch every initial-path ancestor so the tree opens to the
    // bookmarked depth on mount without the user clicking through.
    for (const ancestor of ancestorChain(initialPath)) {
      void ensureLoaded(ancestor)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionKey])

  const expand = useCallback(
    async (path: string) => {
      setExpanded((prev) => {
        if (prev.has(path)) {
          return prev
        }
        const next = new Set(prev)
        next.add(path)
        return next
      })
      await ensureLoaded(path)
    },
    [ensureLoaded]
  )

  const collapse = useCallback((path: string) => {
    setExpanded((prev) => {
      if (!prev.has(path)) {
        return prev
      }
      const next = new Set(prev)
      next.delete(path)
      return next
    })
  }, [])

  const toggleExpanded = useCallback(
    async (path: string) => {
      if (expanded.has(path)) {
        collapse(path)
      } else {
        await expand(path)
      }
    },
    [collapse, expand, expanded]
  )

  const loadMore = useCallback(
    async (path: string) => {
      const existing = nodes.get(path)
      if (!existing || !existing.nextCursor || existing.loading) {
        return
      }
      await fetchPage(path, existing.nextCursor)
    },
    [fetchPage, nodes]
  )

  const refresh = useCallback(
    async (path?: string) => {
      const target = path ?? ROOT
      setNodes((prev) => {
        const next = new Map(prev)
        next.delete(target)
        return next
      })
      await fetchPage(target)
    },
    [fetchPage]
  )

  const registerKnownFile = useCallback((file: FileTreeFile) => {
    knownFilesRef.current.set(file.path, file)
  }, [])

  const visibleKnownChildren = useCallback(
    (path: string): FileTreeItem[] => {
      const out: FileTreeItem[] = []
      for (const node of nodes.values()) {
        if (path === '' || node.path === path || node.path.startsWith(`${path}/`)) {
          out.push(...node.items)
        }
      }
      return out
    },
    [nodes]
  )

  const rootNode: FolderNode = nodes.get(ROOT) ?? {
    path: ROOT,
    items: [],
    nextCursor: null,
    loading: true,
    loaded: false
  }

  return {
    rootNode,
    nodes,
    expanded,
    currentPath: deepestExpanded(expanded),
    toggleExpanded,
    expand,
    collapse,
    loadMore,
    refresh,
    registerKnownFile,
    knownFiles: knownFilesRef.current,
    visibleKnownChildren
  }
}
