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
 * - `deselectedFolderPaths` — folders unchecked within a selected branch.
 *   Recorded by path so a folder can be excluded without expanding it; the
 *   tree usually has no idea what is inside.
 *
 * Selection is resolved by the closest ancestor: for any path, the deepest
 * folder in either folder set decides, and an entry in one of the file sets
 * beats both. That keeps "select the parent, drop one subfolder, keep one
 * file inside it" expressible without enumerating anything.
 *
 * The component never enumerates an unvisited subtree; the download flow
 * walks the tree API to expand selected folders into concrete file IDs.
 */
export interface FileTreeSelection {
  selectedFilePaths: ReadonlySet<string>
  selectedFolderPaths: ReadonlySet<string>
  deselectedFilePaths: ReadonlySet<string>
  deselectedFolderPaths: ReadonlySet<string>
  totals: FileTreeSelectionTotals
  fileState: (file: FileTreeFile) => SelectionState
  folderState: (folder: FileTreeFolder, knownChildren: FileTreeItem[]) => SelectionState
  toggleFile: (file: FileTreeFile) => void
  toggleFolder: (folder: FileTreeFolder, knownChildren: FileTreeItem[]) => void
  clear: () => void
  /**
   * Header "select-all" action: if anything is currently selected,
   * clears the selection; otherwise marks every supplied top-level
   * item as selected (files go into selectedFilePaths, folders into
   * selectedFolderPaths). Tree depth below the supplied items is
   * implicitly covered by ancestor-selected logic, matching the
   * row-checkbox semantics.
   */
  toggleAll: (topLevelItems: FileTreeItem[]) => void
  /**
   * Registry of every file the tree has rendered, keyed by path — the
   * key every consumer actually looks up by (selection sets store
   * paths). Registered by the host as rows become visible.
   */
  filesByPath: Map<string, FileTreeFile>
  registerFile: (file: FileTreeFile) => void
}

const isStrictlyUnder = (path: string, ancestor: string): boolean => path.startsWith(`${ancestor}/`)

/**
 * Verdict of the closest enclosing folder: `true` when the deepest ancestor
 * is selected, `false` when it is excluded, `undefined` when no ancestor in
 * either set covers the path. Depth beats order, so a subfolder exclusion
 * inside a selected parent wins for everything beneath it.
 */
const closestFolderVerdict = (
  path: string,
  selectedFolders: ReadonlySet<string>,
  deselectedFolders: ReadonlySet<string>
): boolean | undefined => {
  let deepest = -1
  let verdict: boolean | undefined
  for (const folder of selectedFolders) {
    if (isStrictlyUnder(path, folder) && folder.length > deepest) {
      deepest = folder.length
      verdict = true
    }
  }
  for (const folder of deselectedFolders) {
    if (isStrictlyUnder(path, folder) && folder.length > deepest) {
      deepest = folder.length
      verdict = false
    }
  }
  return verdict
}

const removeUnder = (paths: Set<string>, ancestor: string): void => {
  for (const path of Array.from(paths)) {
    if (isStrictlyUnder(path, ancestor)) {
      paths.delete(path)
    }
  }
}

export function useFileTreeSelection(): FileTreeSelection {
  const [selectedFilePaths, setSelectedFilePaths] = useState<Set<string>>(() => new Set())
  const [selectedFolderPaths, setSelectedFolderPaths] = useState<Set<string>>(() => new Set())
  const [deselectedFilePaths, setDeselectedFilePaths] = useState<Set<string>>(() => new Set())
  const [deselectedFolderPaths, setDeselectedFolderPaths] = useState<Set<string>>(() => new Set())
  const [filesByPath] = useState<Map<string, FileTreeFile>>(() => new Map())

  const registerFile = useCallback(
    (file: FileTreeFile) => {
      filesByPath.set(file.path, file)
    },
    [filesByPath]
  )

  const isFileLogicallySelected = useCallback(
    (path: string): boolean => {
      // The file's own entry is the most specific statement about it.
      if (deselectedFilePaths.has(path)) {
        return false
      }
      if (selectedFilePaths.has(path)) {
        return true
      }
      return closestFolderVerdict(path, selectedFolderPaths, deselectedFolderPaths) ?? false
    },
    [deselectedFilePaths, deselectedFolderPaths, selectedFilePaths, selectedFolderPaths]
  )

  /** Same resolution for a folder row, including the folder's own entries. */
  const isFolderLogicallySelected = useCallback(
    (path: string): boolean => {
      if (deselectedFolderPaths.has(path)) {
        return false
      }
      if (selectedFolderPaths.has(path)) {
        return true
      }
      return closestFolderVerdict(path, selectedFolderPaths, deselectedFolderPaths) ?? false
    },
    [deselectedFolderPaths, selectedFolderPaths]
  )

  const fileState = useCallback(
    (file: FileTreeFile): SelectionState => (isFileLogicallySelected(file.path) ? 'all' : 'none'),
    [isFileLogicallySelected]
  )

  const folderState = useCallback(
    (folder: FileTreeFolder, knownChildren: FileTreeItem[]): SelectionState => {
      const logicallySelected = isFolderLogicallySelected(folder.path)

      const knownFilesUnder = knownChildren.filter(
        (child): child is FileTreeFile =>
          isFileTreeFile(child) && isStrictlyUnder(child.path, folder.path)
      )

      if (logicallySelected) {
        const someDeselected = knownFilesUnder.some((file) => !isFileLogicallySelected(file.path))
        // An excluded subfolder makes the parent partial even when the tree
        // has never listed anything inside it.
        const someSubfolderExcluded = Array.from(deselectedFolderPaths).some((path) =>
          isStrictlyUnder(path, folder.path)
        )
        return someDeselected || someSubfolderExcluded ? 'partial' : 'all'
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

      // 'all' only when every visited file is selected AND no nested
      // folder selection covers unvisited paths we cannot vouch for.
      return allFilesSelected && !nestedFolderSelected ? 'all' : 'partial'
    },
    [deselectedFolderPaths, isFileLogicallySelected, isFolderLogicallySelected, selectedFolderPaths]
  )

  const toggleFile = useCallback(
    (file: FileTreeFile) => {
      filesByPath.set(file.path, file)
      // Flip whatever the file resolves to now, then record the flip in the
      // set that can express it: an override when a folder already covers the
      // file, an outright selection when nothing does.
      const coveredBySelectedFolder =
        closestFolderVerdict(file.path, selectedFolderPaths, deselectedFolderPaths) === true
      const nextSelected = new Set(selectedFilePaths)
      const nextDeselected = new Set(deselectedFilePaths)
      if (isFileLogicallySelected(file.path)) {
        nextSelected.delete(file.path)
        if (coveredBySelectedFolder) {
          nextDeselected.add(file.path)
        }
      } else {
        nextDeselected.delete(file.path)
        if (!coveredBySelectedFolder) {
          nextSelected.add(file.path)
        }
      }
      setSelectedFilePaths(nextSelected)
      setDeselectedFilePaths(nextDeselected)
    },
    [
      deselectedFilePaths,
      deselectedFolderPaths,
      filesByPath,
      isFileLogicallySelected,
      selectedFilePaths,
      selectedFolderPaths
    ]
  )

  const toggleFolder = useCallback(
    (folder: FileTreeFolder, knownChildren: FileTreeItem[]) => {
      const explicitlySelected = selectedFolderPaths.has(folder.path)
      const ancestorSelected =
        closestFolderVerdict(folder.path, selectedFolderPaths, deselectedFolderPaths) === true
      const state = folderState(folder, knownChildren)

      // Re-checking a folder that was excluded from a selected branch: drop
      // the exclusion and any stale overrides beneath it, and the ancestor's
      // selection covers the subtree again.
      if (deselectedFolderPaths.has(folder.path)) {
        const nextDeselectedFolders = new Set(deselectedFolderPaths)
        nextDeselectedFolders.delete(folder.path)
        removeUnder(nextDeselectedFolders, folder.path)
        const nextDeselectedFiles = new Set(deselectedFilePaths)
        nextDeselectedFiles.delete(folder.path)
        removeUnder(nextDeselectedFiles, folder.path)
        setDeselectedFolderPaths(nextDeselectedFolders)
        setDeselectedFilePaths(nextDeselectedFiles)
        return
      }

      if (state === 'all' && explicitlySelected) {
        // Deselect this folder and any nested artifacts under it.
        const nextFolders = new Set(selectedFolderPaths)
        const nextFiles = new Set(selectedFilePaths)
        const nextDeselected = new Set(deselectedFilePaths)
        nextFolders.delete(folder.path)
        // Defensive sweeps: both mutation sites (the select-all fold below
        // and toggleAll's top-level-only writes) maintain the invariant
        // that the selected sets never contain an ancestor together with
        // its descendants, so these loops cannot fire through the public
        // API — they only guard future mutation paths.
        for (const other of Array.from(nextFolders)) {
          /* istanbul ignore if */
          if (isStrictlyUnder(other, folder.path)) {
            nextFolders.delete(other)
          }
        }
        for (const path of Array.from(nextFiles)) {
          /* istanbul ignore if */
          if (path === folder.path || isStrictlyUnder(path, folder.path)) {
            nextFiles.delete(path)
          }
        }
        for (const path of Array.from(nextDeselected)) {
          if (isStrictlyUnder(path, folder.path)) {
            nextDeselected.delete(path)
          }
        }
        const nextDeselectedFolders = new Set(deselectedFolderPaths)
        removeUnder(nextDeselectedFolders, folder.path)
        setSelectedFolderPaths(nextFolders)
        setSelectedFilePaths(nextFiles)
        setDeselectedFilePaths(nextDeselected)
        setDeselectedFolderPaths(nextDeselectedFolders)
        return
      }

      if (ancestorSelected) {
        // Inside an already-selected branch: exclude this folder by path.
        // Enumerating known children instead would silently do nothing for a
        // folder the user never expanded, which is the common case — the
        // checkbox would flip while the files stayed in the selection.
        const nextDeselectedFolders = new Set(deselectedFolderPaths)
        nextDeselectedFolders.add(folder.path)
        // Entries beneath it are now redundant: the prefix covers them.
        removeUnder(nextDeselectedFolders, folder.path)
        const nextDeselectedFiles = new Set(deselectedFilePaths)
        removeUnder(nextDeselectedFiles, folder.path)
        const nextSelectedFiles = new Set(selectedFilePaths)
        removeUnder(nextSelectedFiles, folder.path)
        setDeselectedFolderPaths(nextDeselectedFolders)
        setDeselectedFilePaths(nextDeselectedFiles)
        setSelectedFilePaths(nextSelectedFiles)
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
      const nextDeselectedFolders = new Set(deselectedFolderPaths)
      removeUnder(nextDeselectedFolders, folder.path)
      setSelectedFolderPaths(nextFolders)
      setSelectedFilePaths(nextFiles)
      setDeselectedFilePaths(nextDeselected)
      setDeselectedFolderPaths(nextDeselectedFolders)
    },
    [
      deselectedFilePaths,
      deselectedFolderPaths,
      folderState,
      selectedFilePaths,
      selectedFolderPaths
    ]
  )

  const clear = useCallback(() => {
    setSelectedFilePaths(new Set())
    setSelectedFolderPaths(new Set())
    setDeselectedFilePaths(new Set())
    setDeselectedFolderPaths(new Set())
  }, [])

  const toggleAll = useCallback(
    (topLevelItems: FileTreeItem[]) => {
      const anySelected = selectedFilePaths.size > 0 || selectedFolderPaths.size > 0
      if (anySelected) {
        setSelectedFilePaths(new Set())
        setSelectedFolderPaths(new Set())
        setDeselectedFilePaths(new Set())
        setDeselectedFolderPaths(new Set())
        return
      }
      const nextFiles = new Set<string>()
      const nextFolders = new Set<string>()
      for (const item of topLevelItems) {
        if (isFileTreeFile(item)) {
          filesByPath.set(item.path, item)
          nextFiles.add(item.path)
        } else {
          nextFolders.add(item.path)
        }
      }
      setSelectedFilePaths(nextFiles)
      setSelectedFolderPaths(nextFolders)
      setDeselectedFilePaths(new Set())
      setDeselectedFolderPaths(new Set())
    },
    [filesByPath, selectedFilePaths, selectedFolderPaths]
  )

  const totals = useMemo<FileTreeSelectionTotals>(() => {
    let count = 0
    let bytes = 0
    for (const path of selectedFilePaths) {
      const file = filesByPath.get(path)
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
  }, [filesByPath, selectedFilePaths, selectedFolderPaths.size])

  return {
    selectedFilePaths,
    selectedFolderPaths,
    deselectedFilePaths,
    deselectedFolderPaths,
    totals,
    fileState,
    folderState,
    toggleFile,
    toggleFolder,
    clear,
    toggleAll,
    filesByPath,
    registerFile
  }
}
