import { useCallback, useEffect, useRef, useState } from 'react'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeFile, FileTreeFolder, isFileTreeFile } from '@/files/domain/models/FileTreeItem'
import { enumerateFileTreeFiles } from '@/files/domain/useCases/enumerateFileTreeFiles'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { FileTreeSelection, isPathSelected } from './useFileTreeSelection'

export interface DownloadProgress {
  status: 'idle' | 'enumerating' | 'requesting' | 'success' | 'error'
  enumeratedCount: number
  message?: string
}

export interface UseFileTreeDownloadArgs {
  treeRepository: FileTreeRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  includeDeaccessioned?: boolean
  selection: FileTreeSelection
  onError?: (error: unknown) => void
  onDownloadFiles: (files: FileTreeFile[]) => Promise<void> | void
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
  includeDeaccessioned,
  selection,
  onError,
  onDownloadFiles
}: UseFileTreeDownloadArgs): UseFileTreeDownloadApi {
  const [progress, setProgress] = useState<DownloadProgress>({
    status: 'idle',
    enumeratedCount: 0
  })
  const abortRef = useRef<AbortController | null>(null)
  const versionKey = datasetVersion.number.toString()

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setProgress({ status: 'idle', enumeratedCount: 0 })
  }, [])

  useEffect(() => {
    reset()
    return () => abortRef.current?.abort()
  }, [datasetPersistentId, versionKey, includeDeaccessioned, reset])

  const beginRun = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    return controller.signal
  }, [])

  const dispatchFiles = useCallback(
    async (files: FileTreeFile[], signal: AbortSignal) => {
      if (signal.aborted) return
      if (files.length === 0) {
        setProgress({ status: 'idle', enumeratedCount: 0 })
        return
      }
      setProgress({ status: 'requesting', enumeratedCount: files.length })
      try {
        await onDownloadFiles(files)
        if (signal.aborted) return
        setProgress({ status: 'success', enumeratedCount: files.length })
      } catch (error) {
        if (signal.aborted) return
        setProgress({
          status: 'error',
          enumeratedCount: files.length,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
      }
    },
    [onDownloadFiles, onError]
  )

  const collectExplicitFiles = useCallback((): FileTreeFile[] => {
    const out: FileTreeFile[] = []
    for (const path of selection.selectedFilePaths) {
      const file = selection.filesByPath.get(path)
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

    const signal = beginRun()
    let enumerated: FileTreeFile[] = []
    if (folderPaths.length > 0) {
      setProgress({ status: 'enumerating', enumeratedCount: 0 })
      try {
        enumerated = await enumerateFileTreeFiles(treeRepository, {
          datasetPersistentId,
          datasetVersion,
          includeDeaccessioned,
          paths: folderPaths,
          signal
        })
      } catch (error) {
        if (signal.aborted) return
        setProgress({
          status: 'error',
          enumeratedCount: 0,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
        return
      }
    }

    const merged = mergeFiles(explicit, enumerated, selection)
    await dispatchFiles(merged, signal)
  }, [
    beginRun,
    collectExplicitFiles,
    datasetPersistentId,
    datasetVersion,
    dispatchFiles,
    includeDeaccessioned,
    onError,
    selection,
    treeRepository
  ])

  const downloadNode = useCallback(
    async (node: FileTreeFile | FileTreeFolder) => {
      const signal = beginRun()
      if (isFileTreeFile(node)) {
        await dispatchFiles([node], signal)
        return
      }
      setProgress({ status: 'enumerating', enumeratedCount: 0 })
      try {
        const files = await enumerateFileTreeFiles(treeRepository, {
          datasetPersistentId,
          datasetVersion,
          includeDeaccessioned,
          paths: [node.path],
          signal
        })
        await dispatchFiles(files, signal)
      } catch (error) {
        if (signal.aborted) return
        setProgress({
          status: 'error',
          enumeratedCount: 0,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
      }
    },
    [
      beginRun,
      datasetPersistentId,
      datasetVersion,
      dispatchFiles,
      includeDeaccessioned,
      onError,
      treeRepository
    ]
  )

  return { progress, downloadSelection, downloadNode, reset }
}

function mergeFiles(
  explicit: FileTreeFile[],
  enumerated: FileTreeFile[],
  selection: FileTreeSelection
): FileTreeFile[] {
  const seen = new Set<number>()
  const out: FileTreeFile[] = []
  for (const file of [...explicit, ...enumerated]) {
    const included = isPathSelected(
      file.path,
      selection.selectedFilePaths,
      selection.deselectedFilePaths,
      selection.selectedFolderPaths,
      selection.deselectedFolderPaths
    )
    if (!included || seen.has(file.id)) {
      continue
    }
    seen.add(file.id)
    out.push(file)
  }
  return out
}
