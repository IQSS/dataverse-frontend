import { useMemo } from 'react'
import { FolderNode } from './useFileTree'
import { FileTreeItem, isFileTreeFile, isFileTreeFolder } from '@/files/domain/models/FileTreeItem'

export type VisibleRow =
  | { kind: 'item'; depth: number; node: FileTreeItem }
  | { kind: 'loading'; depth: number; path: string }
  | { kind: 'error'; depth: number; path: string; error: string }
  | { kind: 'load-more'; depth: number; path: string }

const ROOT = ''

export interface UseFileTreeFlattenArgs {
  nodes: ReadonlyMap<string, FolderNode>
  expanded: ReadonlySet<string>
  query?: string
}

export function useFileTreeFlatten({
  nodes,
  expanded,
  query
}: UseFileTreeFlattenArgs): VisibleRow[] {
  return useMemo(() => buildVisibleRows(nodes, expanded, query), [nodes, expanded, query])
}

export function buildVisibleRows(
  nodes: ReadonlyMap<string, FolderNode>,
  expanded: ReadonlySet<string>,
  query?: string
): VisibleRow[] {
  const rows: VisibleRow[] = []
  const root = nodes.get(ROOT)
  if (!root) {
    return rows
  }
  walk(root, 0)
  return rows

  function walk(folder: FolderNode, depth: number): void {
    if (folder.loading && folder.items.length === 0) {
      rows.push({ kind: 'loading', depth, path: folder.path })
      return
    }
    if (folder.error && folder.items.length === 0) {
      rows.push({ kind: 'error', depth, path: folder.path, error: folder.error })
      return
    }
    for (const item of folder.items) {
      if (query && !matches(item, query, nodes)) {
        continue
      }
      rows.push({ kind: 'item', depth, node: item })
      if (isFileTreeFolder(item)) {
        const isOpen = expanded.has(item.path) || Boolean(query)
        if (isOpen) {
          const sub = nodes.get(item.path)
          if (sub) {
            walk(sub, depth + 1)
          } else {
            rows.push({ kind: 'loading', depth: depth + 1, path: item.path })
          }
        }
      }
    }
    if (folder.nextCursor) {
      rows.push({ kind: 'load-more', depth, path: folder.path })
    }
    if (folder.error && folder.items.length > 0) {
      rows.push({ kind: 'error', depth, path: folder.path, error: folder.error })
    }
  }
}

function matches(
  item: FileTreeItem,
  query: string,
  nodes: ReadonlyMap<string, FolderNode>
): boolean {
  const lowered = query.trim().toLowerCase()
  if (!lowered) {
    return true
  }
  if (isFileTreeFile(item)) {
    return item.name.toLowerCase().includes(lowered)
  }
  if (item.name.toLowerCase().includes(lowered)) {
    return true
  }
  const sub = nodes.get(item.path)
  if (!sub) {
    return false
  }
  return sub.items.some((child) => matches(child, query, nodes))
}
