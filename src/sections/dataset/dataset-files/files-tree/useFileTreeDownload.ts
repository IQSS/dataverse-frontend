import { useCallback, useState } from 'react'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeFile, FileTreeFolder, isFileTreeFile } from '@/files/domain/models/FileTreeItem'
import { enumerateFileTreeFiles } from '@/files/domain/useCases/enumerateFileTreeFiles'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { FileTreeSelection } from './useFileTreeSelection'

export interface DownloadProgress {
  status: 'idle' | 'enumerating' | 'requesting' | 'success' | 'error'
  enumeratedCount: number
  message?: string
}

export interface UseFileTreeDownloadArgs {
  treeRepository: FileTreeRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  selection: FileTreeSelection
  onError?: (error: unknown) => void
  /**
   * Caller decides how to actually trigger the download for an array of file
   * IDs (e.g. signed-URL flow with guestbook handling). The hook only owns the
   * enumeration step.
   */
  onDownloadFileIds: (ids: number[]) => Promise<void>
}

export interface UseFileTreeDownloadApi {
  progress: DownloadProgress
  downloadSelection: () => Promise<void>
  downloadNode: (node: FileTreeFile | FileTreeFolder) => Promise<void>
  reset: () => void
}

export function useFileTreeDownload({
  treeRepository,
  datasetPersistentId,
  datasetVersion,
  selection,
  onError,
  onDownloadFileIds
}: UseFileTreeDownloadArgs): UseFileTreeDownloadApi {
  const [progress, setProgress] = useState<DownloadProgress>({
    status: 'idle',
    enumeratedCount: 0
  })

  const reset = useCallback(() => {
    setProgress({ status: 'idle', enumeratedCount: 0 })
  }, [])

  const downloadFileIds = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) {
        return
      }
      setProgress({ status: 'requesting', enumeratedCount: ids.length })
      try {
        await onDownloadFileIds(ids)
        setProgress({ status: 'success', enumeratedCount: ids.length })
      } catch (error) {
        setProgress({
          status: 'error',
          enumeratedCount: ids.length,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
      }
    },
    [onDownloadFileIds, onError]
  )

  const collectExplicitFiles = useCallback((): FileTreeFile[] => {
    const out: FileTreeFile[] = []
    for (const path of selection.selectedFilePaths) {
      const file = lookupFile(selection.filesById, path)
      if (file) {
        out.push(file)
      }
    }
    return out
  }, [selection])

  const downloadSelection = useCallback(async () => {
    const explicit = collectExplicitFiles()
    const folderPaths = Array.from(selection.selectedFolderPaths)
    if (explicit.length === 0 && folderPaths.length === 0) {
      return
    }

    let enumerated: FileTreeFile[] = []
    if (folderPaths.length > 0) {
      setProgress({ status: 'enumerating', enumeratedCount: 0 })
      try {
        enumerated = await enumerateFileTreeFiles(treeRepository, {
          datasetPersistentId,
          datasetVersion,
          paths: folderPaths
        })
      } catch (error) {
        setProgress({
          status: 'error',
          enumeratedCount: 0,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
        return
      }
    }

    const merged = mergeFiles(explicit, enumerated, selection.deselectedFilePaths)
    await downloadFileIds(merged.map((f) => f.id))
  }, [
    collectExplicitFiles,
    datasetPersistentId,
    datasetVersion,
    downloadFileIds,
    onError,
    selection.deselectedFilePaths,
    selection.selectedFolderPaths,
    treeRepository
  ])

  const downloadNode = useCallback(
    async (node: FileTreeFile | FileTreeFolder) => {
      if (isFileTreeFile(node)) {
        await downloadFileIds([node.id])
        return
      }
      setProgress({ status: 'enumerating', enumeratedCount: 0 })
      try {
        const files = await enumerateFileTreeFiles(treeRepository, {
          datasetPersistentId,
          datasetVersion,
          paths: [node.path]
        })
        await downloadFileIds(files.map((f) => f.id))
      } catch (error) {
        setProgress({
          status: 'error',
          enumeratedCount: 0,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
      }
    },
    [datasetPersistentId, datasetVersion, downloadFileIds, onError, treeRepository]
  )

  return { progress, downloadSelection, downloadNode, reset }
}

function lookupFile(filesById: Map<number, FileTreeFile>, path: string): FileTreeFile | undefined {
  for (const file of filesById.values()) {
    if (file.path === path) {
      return file
    }
  }
  return undefined
}

function mergeFiles(
  explicit: FileTreeFile[],
  enumerated: FileTreeFile[],
  deselected: ReadonlySet<string>
): FileTreeFile[] {
  const seen = new Set<number>()
  const out: FileTreeFile[] = []
  for (const file of explicit) {
    if (deselected.has(file.path)) {
      continue
    }
    if (!seen.has(file.id)) {
      seen.add(file.id)
      out.push(file)
    }
  }
  for (const file of enumerated) {
    if (deselected.has(file.path)) {
      continue
    }
    if (!seen.has(file.id)) {
      seen.add(file.id)
      out.push(file)
    }
  }
  return out
}
