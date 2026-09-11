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
  selection,
  onError,
  onDownloadFiles
}: UseFileTreeDownloadArgs): UseFileTreeDownloadApi {
  const [progress, setProgress] = useState<DownloadProgress>({
    status: 'idle',
    enumeratedCount: 0
  })

  const reset = useCallback(() => {
    setProgress({ status: 'idle', enumeratedCount: 0 })
  }, [])

  const dispatchFiles = useCallback(
    async (files: FileTreeFile[]) => {
      if (files.length === 0) {
        setProgress({ status: 'idle', enumeratedCount: 0 })
        return
      }
      setProgress({ status: 'requesting', enumeratedCount: files.length })
      try {
        await onDownloadFiles(files)
        setProgress({ status: 'success', enumeratedCount: files.length })
      } catch (error) {
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

    const merged = mergeFiles(
      explicit,
      enumerated,
      selection.deselectedFilePaths,
      selection.deselectedFolderPaths,
      selection.selectedFilePaths
    )
    await dispatchFiles(merged)
  }, [
    collectExplicitFiles,
    datasetPersistentId,
    datasetVersion,
    dispatchFiles,
    onError,
    selection.deselectedFilePaths,
    selection.deselectedFolderPaths,
    selection.selectedFilePaths,
    selection.selectedFolderPaths,
    treeRepository
  ])

  const downloadNode = useCallback(
    async (node: FileTreeFile | FileTreeFolder) => {
      if (isFileTreeFile(node)) {
        await dispatchFiles([node])
        return
      }
      setProgress({ status: 'enumerating', enumeratedCount: 0 })
      try {
        const files = await enumerateFileTreeFiles(treeRepository, {
          datasetPersistentId,
          datasetVersion,
          paths: [node.path]
        })
        await dispatchFiles(files)
      } catch (error) {
        setProgress({
          status: 'error',
          enumeratedCount: 0,
          message: error instanceof Error ? error.message : String(error)
        })
        onError?.(error)
      }
    },
    [datasetPersistentId, datasetVersion, dispatchFiles, onError, treeRepository]
  )

  return { progress, downloadSelection, downloadNode, reset }
}

function mergeFiles(
  explicit: FileTreeFile[],
  enumerated: FileTreeFile[],
  deselected: ReadonlySet<string>,
  deselectedFolders: ReadonlySet<string>,
  selected: ReadonlySet<string>
): FileTreeFile[] {
  const isExcluded = (path: string): boolean => {
    if (deselected.has(path)) {
      return true
    }
    if (selected.has(path)) {
      return false
    }
    for (const folder of deselectedFolders) {
      if (path.startsWith(`${folder}/`)) {
        return true
      }
    }
    return false
  }
  const seen = new Set<number>()
  const out: FileTreeFile[] = []
  for (const file of [...explicit, ...enumerated]) {
    if (isExcluded(file.path)) {
      continue
    }
    if (!seen.has(file.id)) {
      seen.add(file.id)
      out.push(file)
    }
  }
  return out
}
