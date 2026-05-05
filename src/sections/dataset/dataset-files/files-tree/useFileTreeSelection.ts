import { useCallback, useMemo, useState } from 'react'
import {
  FileTreeFile,
  FileTreeFolder,
  FileTreeItem,
  isFileTreeFile
} from '@/files/domain/models/FileTreeItem'

export type SelectionState = 'all' | 'partial' | 'none'

export interface FileTreeSelectionTotals {
  count: number
  bytes: number
  hasLogicalFolders: boolean
}

/**
 * Selection state for the lazy file tree.
 *
 * Three sets cooperate:
 *
 * - `selectedFolderPaths` — folders the user explicitly checked. Implies
 *   "all descendants are logically selected" without enumerating them.
 * - `selectedFilePaths` — individual files checked when no ancestor folder
 *   is selected.
 * - `deselectedFilePaths` — individual files unchecked within a folder that
 *   is in `selectedFolderPaths` (or under a selected ancestor).
 *
 * The component never enumerates an unvisited subtree; the download flow
 * walks the tree API to expand selected folders into concrete file IDs.
 */
export interface FileTreeSelection {
  selectedFilePaths: ReadonlySet<string>
  selectedFolderPaths: ReadonlySet<string>
  deselectedFilePaths: ReadonlySet<string>
  totals: FileTreeSelectionTotals
  fileState: (file: FileTreeFile) => SelectionState
  folderState: (folder: FileTreeFolder, knownChildren: FileTreeItem[]) => SelectionState
  toggleFile: (file: FileTreeFile) => void
  toggleFolder: (folder: FileTreeFolder, knownChildren: FileTreeItem[]) => void
  clear: () => void
  filesById: Map<number, FileTreeFile>
  registerFile: (file: FileTreeFile) => void
}

const isStrictlyUnder = (path: string, ancestor: string): boolean => path.startsWith(`${ancestor}/`)

const hasSelectedAncestor = (path: string, selectedFolders: ReadonlySet<string>): boolean => {
  for (const folder of selectedFolders) {
    if (isStrictlyUnder(path, folder)) {
      return true
    }
  }
  return false
}

export function useFileTreeSelection(): FileTreeSelection {
  const [selectedFilePaths, setSelectedFilePaths] = useState<Set<string>>(() => new Set())
  const [selectedFolderPaths, setSelectedFolderPaths] = useState<Set<string>>(() => new Set())
  const [deselectedFilePaths, setDeselectedFilePaths] = useState<Set<string>>(() => new Set())
  const [filesById] = useState<Map<number, FileTreeFile>>(() => new Map())

  const registerFile = useCallback(
    (file: FileTreeFile) => {
      filesById.set(file.id, file)
    },
    [filesById]
  )

  const isFileLogicallySelected = useCallback(
    (path: string): boolean => {
      if (deselectedFilePaths.has(path)) {
        return false
      }
      if (selectedFilePaths.has(path)) {
        return true
      }
      return hasSelectedAncestor(path, selectedFolderPaths)
    },
    [deselectedFilePaths, selectedFilePaths, selectedFolderPaths]
  )

  const fileState = useCallback(
    (file: FileTreeFile): SelectionState => (isFileLogicallySelected(file.path) ? 'all' : 'none'),
    [isFileLogicallySelected]
  )

  const folderState = useCallback(
    (folder: FileTreeFolder, knownChildren: FileTreeItem[]): SelectionState => {
      const explicitlySelected = selectedFolderPaths.has(folder.path)
      const ancestorSelected = hasSelectedAncestor(folder.path, selectedFolderPaths)
      const logicallySelected = explicitlySelected || ancestorSelected

      const knownFilesUnder = knownChildren.filter(
        (child): child is FileTreeFile =>
          isFileTreeFile(child) &&
          (child.path === `${folder.path}/${child.name}` ||
            isStrictlyUnder(child.path, folder.path))
      )

      if (logicallySelected) {
        const someDeselected = knownFilesUnder.some((file) => deselectedFilePaths.has(file.path))
        return someDeselected ? 'partial' : 'all'
      }

      if (knownChildren.length === 0) {
        return 'none'
      }

      const nestedFolderSelected = Array.from(selectedFolderPaths).some((other) =>
        isStrictlyUnder(other, folder.path)
      )
      const someFileSelected = knownFilesUnder.some((file) => isFileLogicallySelected(file.path))

      if (!nestedFolderSelected && !someFileSelected) {
        return 'none'
      }

      const allFilesSelected =
        knownFilesUnder.length > 0 &&
        knownFilesUnder.every((file) => isFileLogicallySelected(file.path))

      // If we know about subfolders but none are logically selected and
      // not every visited file is selected, the folder is partial.
      if (allFilesSelected && !nestedFolderSelected) {
        return 'all'
      }
      if (allFilesSelected && nestedFolderSelected) {
        // descendant folder selection covers some unvisited paths;
        // we cannot honestly call this 'all' so partial is correct.
        return 'partial'
      }
      return 'partial'
    },
    [deselectedFilePaths, isFileLogicallySelected, selectedFolderPaths]
  )

  const toggleFile = useCallback(
    (file: FileTreeFile) => {
      filesById.set(file.id, file)
      const ancestorSelected = hasSelectedAncestor(file.path, selectedFolderPaths)
      if (ancestorSelected) {
        const next = new Set(deselectedFilePaths)
        if (next.has(file.path)) {
          next.delete(file.path)
        } else {
          next.add(file.path)
        }
        setDeselectedFilePaths(next)
        return
      }
      const next = new Set(selectedFilePaths)
      if (next.has(file.path)) {
        next.delete(file.path)
      } else {
        next.add(file.path)
      }
      setSelectedFilePaths(next)
    },
    [deselectedFilePaths, filesById, selectedFilePaths, selectedFolderPaths]
  )

  const toggleFolder = useCallback(
    (folder: FileTreeFolder, knownChildren: FileTreeItem[]) => {
      const explicitlySelected = selectedFolderPaths.has(folder.path)
      const ancestorSelected = hasSelectedAncestor(folder.path, selectedFolderPaths)
      const state = folderState(folder, knownChildren)

      if (state === 'all' && explicitlySelected) {
        // Deselect this folder and any nested artifacts under it.
        const nextFolders = new Set(selectedFolderPaths)
        const nextFiles = new Set(selectedFilePaths)
        const nextDeselected = new Set(deselectedFilePaths)
        nextFolders.delete(folder.path)
        for (const other of Array.from(nextFolders)) {
          if (isStrictlyUnder(other, folder.path)) {
            nextFolders.delete(other)
          }
        }
        for (const path of Array.from(nextFiles)) {
          if (path === folder.path || isStrictlyUnder(path, folder.path)) {
            nextFiles.delete(path)
          }
        }
        for (const path of Array.from(nextDeselected)) {
          if (isStrictlyUnder(path, folder.path)) {
            nextDeselected.delete(path)
          }
        }
        setSelectedFolderPaths(nextFolders)
        setSelectedFilePaths(nextFiles)
        setDeselectedFilePaths(nextDeselected)
        return
      }

      if (ancestorSelected) {
        // We're inside an already-logically-selected branch; flip the
        // deselect overrides for every known descendant file under this
        // folder.
        const nextDeselected = new Set(deselectedFilePaths)
        const knownFiles = collectKnownFilesUnder(folder, knownChildren)
        const allDeselected =
          knownFiles.length > 0 && knownFiles.every((f) => nextDeselected.has(f.path))
        for (const file of knownFiles) {
          if (allDeselected) {
            nextDeselected.delete(file.path)
          } else {
            nextDeselected.add(file.path)
          }
        }
        setDeselectedFilePaths(nextDeselected)
        return
      }

      // 'partial' or 'none' on a folder without selected ancestors -> select-all logically.
      const nextFolders = new Set(selectedFolderPaths)
      nextFolders.add(folder.path)
      // Folding nested explicitly-selected folders into the parent.
      for (const other of Array.from(nextFolders)) {
        if (other !== folder.path && isStrictlyUnder(other, folder.path)) {
          nextFolders.delete(other)
        }
      }
      const nextFiles = new Set(selectedFilePaths)
      const nextDeselected = new Set(deselectedFilePaths)
      for (const path of Array.from(nextFiles)) {
        if (path === folder.path || isStrictlyUnder(path, folder.path)) {
          nextFiles.delete(path)
        }
      }
      for (const path of Array.from(nextDeselected)) {
        if (isStrictlyUnder(path, folder.path)) {
          nextDeselected.delete(path)
        }
      }
      setSelectedFolderPaths(nextFolders)
      setSelectedFilePaths(nextFiles)
      setDeselectedFilePaths(nextDeselected)
    },
    [deselectedFilePaths, folderState, selectedFilePaths, selectedFolderPaths]
  )

  const clear = useCallback(() => {
    setSelectedFilePaths(new Set())
    setSelectedFolderPaths(new Set())
    setDeselectedFilePaths(new Set())
  }, [])

  const totals = useMemo<FileTreeSelectionTotals>(() => {
    let count = 0
    let bytes = 0
    for (const path of selectedFilePaths) {
      const file = findFileByPath(filesById, path)
      count += 1
      if (file) {
        bytes += file.size
      }
    }
    return {
      count,
      bytes,
      hasLogicalFolders: selectedFolderPaths.size > 0
    }
  }, [filesById, selectedFilePaths, selectedFolderPaths.size])

  return {
    selectedFilePaths,
    selectedFolderPaths,
    deselectedFilePaths,
    totals,
    fileState,
    folderState,
    toggleFile,
    toggleFolder,
    clear,
    filesById,
    registerFile
  }
}

function collectKnownFilesUnder(
  folder: FileTreeFolder,
  knownChildren: FileTreeItem[]
): FileTreeFile[] {
  const out: FileTreeFile[] = []
  for (const child of knownChildren) {
    if (isFileTreeFile(child) && isStrictlyUnder(child.path, folder.path)) {
      out.push(child)
    }
  }
  return out
}

function findFileByPath(
  filesById: Map<number, FileTreeFile>,
  path: string
): FileTreeFile | undefined {
  for (const file of filesById.values()) {
    if (file.path === path) {
      return file
    }
  }
  return undefined
}
