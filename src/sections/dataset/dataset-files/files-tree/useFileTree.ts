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
}

export interface UseFileTreeApi {
  rootNode: FolderNode
  nodes: ReadonlyMap<string, FolderNode>
  expanded: ReadonlySet<string>
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

export function useFileTree({
  repository,
  datasetPersistentId,
  datasetVersion,
  pageSize = 200,
  order = FileTreeOrder.NAME_AZ,
  include = FileTreeInclude.ALL
}: UseFileTreeArgs): UseFileTreeApi {
  const [nodes, setNodes] = useState<Map<string, FolderNode>>(() => new Map())
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([ROOT]))
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
      setExpanded(new Set([ROOT]))
      knownFilesRef.current = new Map()
      inFlight.current.clear()
    }
    void ensureLoaded(ROOT)
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
