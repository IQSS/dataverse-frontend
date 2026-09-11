import {
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Button } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeInclude, FileTreeOrder } from '@/files/domain/models/FileTreePage'
import {
  FileTreeFile,
  FileTreeFolder,
  isFileTreeFile,
  isFileTreeFolder
} from '@/files/domain/models/FileTreeItem'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { useFileTree } from './useFileTree'
import { SelectionState, useFileTreeSelection } from './useFileTreeSelection'
import { useFileTreeFlatten } from './useFileTreeFlatten'
import { useFileTreeDownload } from './useFileTreeDownload'
import { useStreamingZipDownload } from './useStreamingZipDownload'
import { FilesTreeRow } from './FilesTreeRow'
import { FilesTreeHeader } from './FilesTreeHeader'
import { FilesTreeDownloadTray } from './FilesTreeDownloadTray'
import { DownloadIcon, EmptyIcon, SpinnerIcon, WarnIcon } from './icons/FilesTreeIcons'
import { formatBytes } from './format'
import styles from './FilesTree.module.scss'

interface FilesTreeProps {
  treeRepository: FileTreeRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  pageSize?: number
  query?: string
  order?: FileTreeOrder
  rowHeight?: number
  fallbackHeight?: number
  /**
   * Folder path to expand on mount (e.g. read from a `?path=` URL query
   * param). All ancestors along the path are expanded.
   */
  initialPath?: string
  /**
   * Called with the deepest currently-expanded folder path whenever the
   * expansion changes. The host can sync this to the URL for deep
   * linking. Empty string means only the root is expanded.
   */
  onCurrentPathChange?: (path: string) => void
  /** Filename link builder; a plain anchor when set (JSF embeds), the SPA `<Link>` when omitted. */
  buildFileMetadataUrl?: (file: FileTreeFile) => string
  /**
   * Disables every download action. The SPA sets it when a guestbook or
   * terms acknowledgement is required, since that modal is not wired into
   * the tree yet; JSF mounts gate on their own side.
   */
  downloadsDisabled?: boolean
  /**
   * Fetch options for the zip engine's direct `downloadUrl` requests, which
   * bypass the SDK's auth. Bearer-token embeds must supply their header
   * here. A getter so it is re-read per request, not once per run.
   */
  downloadFetchInit?: () => RequestInit | undefined
}

const DEFAULT_ROW_HEIGHT = 32
const DEFAULT_FALLBACK_HEIGHT = 540
const OVERSCAN = 6

export function FilesTree({
  treeRepository,
  datasetPersistentId,
  datasetVersion,
  pageSize = 200,
  query,
  order = FileTreeOrder.NAME_AZ,
  rowHeight = DEFAULT_ROW_HEIGHT,
  fallbackHeight = DEFAULT_FALLBACK_HEIGHT,
  initialPath = '',
  onCurrentPathChange,
  buildFileMetadataUrl,
  downloadsDisabled = false,
  downloadFetchInit
}: FilesTreeProps) {
  const { t } = useTranslation('files')
  const tree = useFileTree({
    repository: treeRepository,
    datasetPersistentId,
    datasetVersion,
    pageSize,
    order,
    include: FileTreeInclude.ALL,
    initialPath
  })

  const lastPathRef = useRef<string>(initialPath)
  useEffect(() => {
    if (!onCurrentPathChange) return
    if (tree.currentPath !== lastPathRef.current) {
      lastPathRef.current = tree.currentPath
      onCurrentPathChange(tree.currentPath)
    }
  }, [tree.currentPath, onCurrentPathChange])
  const selection = useFileTreeSelection()
  const streamingZip = useStreamingZipDownload()
  const [trayOpen, setTrayOpen] = useState(false)

  // Auto-close the tray when the engine returns to idle (after the user
  // dismisses a finished/cancelled run via the close button).
  useEffect(() => {
    if (streamingZip.state.status === 'idle') {
      setTrayOpen(false)
    }
  }, [streamingZip.state.status])

  const onDownloadFiles = useCallback(
    (files: FileTreeFile[]) => {
      /* istanbul ignore if */
      if (files.length === 0) {
        return
      }
      // Every download, even a single file, goes through the zip engine so it
      // gets the same Range/retry resilience and progress UX.
      const zipName = `${datasetPersistentId.replace(/[^a-zA-Z0-9._-]+/g, '_')}-files.zip`
      // Hand over the factory, not its result: the engine re-reads it per
      // request so a token that expires mid-zip is picked up on the next part.
      streamingZip.start({ files, zipName, fetchInit: downloadFetchInit })
      setTrayOpen(true)
    },
    [datasetPersistentId, streamingZip, downloadFetchInit]
  )

  const download = useFileTreeDownload({
    treeRepository,
    datasetPersistentId,
    datasetVersion,
    selection,
    onDownloadFiles,
    onError: () => toast.error(t('actions.optionsMenu.guestbookCollectModal.downloadError'))
  })

  const visibleRows = useFileTreeFlatten({
    nodes: tree.nodes,
    expanded: tree.expanded,
    query
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportH, setViewportH] = useState<number>(fallbackHeight)

  useLayoutEffect(() => {
    /* istanbul ignore if */
    if (typeof window === 'undefined') {
      return
    }
    const el = containerRef.current
    /* istanbul ignore if */
    if (!el) {
      return
    }
    const update = () => {
      const measured = el.clientHeight
      /* istanbul ignore else */
      if (measured > 0) {
        setViewportH(measured)
      }
    }
    update()
    /* istanbul ignore if */
    if (typeof ResizeObserver === 'undefined') {
      return
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    for (const row of visibleRows) {
      if (row.kind === 'item' && isFileTreeFile(row.node)) {
        selection.registerFile(row.node)
      }
    }
  }, [selection, visibleRows])

  const totalRows = visibleRows.length
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
  const endIdx = Math.min(totalRows, Math.ceil((scrollTop + viewportH) / rowHeight) + OVERSCAN)
  const slice = useMemo(() => visibleRows.slice(startIdx, endIdx), [endIdx, startIdx, visibleRows])

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }

  // Infinite scroll: a visible "load-more" row triggers loadMore. Folders in
  // the error state are skipped or the error write would re-trigger this
  // effect and loop; retrying is the button's job. A "loading" row with no
  // node entry is a folder the filter force-opened, which nothing else
  // fetches, so it is serviced here too.
  useEffect(() => {
    for (const row of slice) {
      if (row.kind === 'load-more') {
        const node = tree.nodes.get(row.path)
        if (node?.nextCursor && !node.loading && !node.error) {
          void tree.loadMore(row.path)
        }
      } else if (row.kind === 'loading' && !tree.nodes.get(row.path)) {
        void tree.ensureLoaded(row.path)
      }
    }
    // Depending on `slice` alone is deliberate: tree.nodes/loadMore get new
    // identities on every page write, and re-running on those would fire
    // duplicate loadMore calls for rows the guard has already dispatched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slice])

  const handleDownloadOne = useCallback(
    (item: FileTreeFile | FileTreeFolder) => {
      void download.downloadNode(item)
    },
    [download]
  )

  const handleToggleExpansion = useCallback(
    async (folder: FileTreeFolder) => {
      await tree.toggleExpanded(folder.path)
    },
    [tree]
  )

  const handleToggleSelectionFolder = useCallback(
    (folder: FileTreeFolder) => {
      const known = tree.visibleKnownChildren(folder.path)
      selection.toggleFolder(folder, known)
    },
    [selection, tree]
  )

  const handleToggleSelectionFile = useCallback(
    (file: FileTreeFile) => {
      selection.toggleFile(file)
    },
    [selection]
  )

  // ---------- Keyboard navigation (WAI-ARIA tree pattern) ----------
  const itemRowIndices = useMemo(() => {
    const out: number[] = []
    for (let i = 0; i < visibleRows.length; i++) {
      if (visibleRows[i].kind === 'item') out.push(i)
    }
    return out
  }, [visibleRows])

  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1)

  // Reset / clamp focus when the visible rows change so we never point at a
  // removed row. Default focus is the first item row.
  useEffect(() => {
    if (itemRowIndices.length === 0) {
      setFocusedRowIndex(-1)
      return
    }
    if (focusedRowIndex === -1 || !itemRowIndices.includes(focusedRowIndex)) {
      setFocusedRowIndex(itemRowIndices[0])
    }
  }, [itemRowIndices, focusedRowIndex])

  // Auto-scroll the focused row into view after focus changes.
  useEffect(() => {
    if (focusedRowIndex < 0) return
    const el = containerRef.current
    /* istanbul ignore if */
    if (!el) return
    const top = focusedRowIndex * rowHeight
    const bottom = top + rowHeight
    /* istanbul ignore next */
    if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (bottom > el.scrollTop + el.clientHeight) {
      el.scrollTop = bottom - el.clientHeight
    }
  }, [focusedRowIndex, rowHeight])

  // Move DOM focus with the roving tabindex, but only when the tree already
  // owns focus, so mounting never steals it. The active element is read via
  // `getRootNode()` because inside a Shadow DOM mount `document.activeElement`
  // is the shadow host, which would make the tree look unfocused forever.
  useEffect(() => {
    if (focusedRowIndex < 0) return
    const el = containerRef.current
    /* istanbul ignore if */
    if (!el) return
    const root = el.getRootNode() as Document | ShadowRoot
    if (!el.contains(root.activeElement)) return
    const target = el.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]')
    target?.focus()
  }, [focusedRowIndex])

  const moveFocus = useCallback(
    (delta: number | 'first' | 'last') => {
      /* istanbul ignore if */
      if (itemRowIndices.length === 0) return
      if (delta === 'first') {
        setFocusedRowIndex(itemRowIndices[0])
        return
      }
      if (delta === 'last') {
        setFocusedRowIndex(itemRowIndices[itemRowIndices.length - 1])
        return
      }
      const currentRank = itemRowIndices.indexOf(focusedRowIndex)
      const nextRank = Math.max(
        0,
        Math.min(itemRowIndices.length - 1, (currentRank === -1 ? 0 : currentRank) + delta)
      )
      setFocusedRowIndex(itemRowIndices[nextRank])
    },
    [focusedRowIndex, itemRowIndices]
  )

  const moveToParent = useCallback(() => {
    /* istanbul ignore if */
    if (focusedRowIndex < 0) return
    const focusedRow = visibleRows[focusedRowIndex]
    /* istanbul ignore if */
    if (focusedRow.kind !== 'item') return
    const parentDepth = focusedRow.depth - 1
    if (parentDepth < 0) return
    for (let i = focusedRowIndex - 1; i >= 0; i--) {
      const r = visibleRows[i]
      if (r.kind === 'item' && r.depth === parentDepth) {
        setFocusedRowIndex(i)
        return
      }
    }
  }, [focusedRowIndex, visibleRows])

  const onRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      /* istanbul ignore if */
      if (focusedRowIndex < 0) return
      const focusedRow = visibleRows[focusedRowIndex]
      /* istanbul ignore if */
      if (focusedRow.kind !== 'item') return
      const item = focusedRow.node
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          moveFocus(1)
          return
        case 'ArrowUp':
          event.preventDefault()
          moveFocus(-1)
          return
        case 'Home':
          event.preventDefault()
          moveFocus('first')
          return
        case 'End':
          event.preventDefault()
          moveFocus('last')
          return
        case 'ArrowRight':
          if (isFileTreeFolder(item)) {
            event.preventDefault()
            if (!tree.expanded.has(item.path)) {
              void handleToggleExpansion(item)
            } else {
              moveFocus(1)
            }
          }
          return
        case 'ArrowLeft':
          event.preventDefault()
          if (isFileTreeFolder(item) && tree.expanded.has(item.path)) {
            tree.collapse(item.path)
          } else {
            moveToParent()
          }
          return
        case ' ':
        case 'Spacebar':
          event.preventDefault()
          if (isFileTreeFile(item)) {
            handleToggleSelectionFile(item)
          } else {
            handleToggleSelectionFolder(item)
          }
          return
        case 'Enter':
          if (isFileTreeFolder(item)) {
            event.preventDefault()
            void handleToggleExpansion(item)
          }
          // For files, let the default Enter behavior activate the
          // filename anchor inside the row (browser handles it).
          return
        default:
          return
      }
    },
    [
      focusedRowIndex,
      handleToggleExpansion,
      handleToggleSelectionFile,
      handleToggleSelectionFolder,
      moveFocus,
      moveToParent,
      tree,
      visibleRows
    ]
  )

  // Header select-all state: a plain per-render computation (cheap, no
  // hook), so it is safe above the early returns without affecting the
  // hook count when the component swaps between loading / error /
  // empty / loaded states.
  const headerSelectAllState: SelectionState = (() => {
    const totalCount = selection.totals.count
    const hasFolders = selection.totals.hasLogicalFolders
    const topLevel = tree.rootNode.items
    if (totalCount === 0 && !hasFolders) {
      return 'none'
    }
    if (topLevel.length === 0) {
      return 'partial'
    }
    const everyTopSelected = topLevel.every((item) =>
      isFileTreeFile(item)
        ? selection.fileState(item) === 'all'
        : selection.folderState(item, tree.visibleKnownChildren(item.path)) === 'all'
    )
    return everyTopSelected ? 'all' : 'partial'
  })()
  const onToggleSelectAll = useCallback(() => {
    selection.toggleAll(tree.rootNode.items)
  }, [selection, tree.rootNode.items])

  const isInitialLoad = !tree.rootNode.loaded && tree.rootNode.loading

  if (isInitialLoad) {
    return (
      <div className={styles['tree-wrap']} data-testid="files-tree-loading">
        <FilesTreeHeader />
        <div
          className={styles['tree-viewport']}
          style={{ height: fallbackHeight }}
          role="status"
          aria-busy="true"
          aria-live="polite">
          <div className={styles['tree-state']}>
            <div className={styles['tree-state-glyph']} aria-hidden>
              <SpinnerIcon />
            </div>
            <div>{t('tree.state.loading')}</div>
          </div>
        </div>
      </div>
    )
  }

  if (tree.rootNode.error && tree.rootNode.items.length === 0) {
    return (
      <div className={styles['tree-wrap']} data-testid="files-tree-error">
        <FilesTreeHeader />
        <div
          className={styles['tree-viewport']}
          style={{ height: fallbackHeight }}
          role="alert"
          aria-live="assertive">
          <div className={styles['tree-state']}>
            <div
              className={styles['tree-state-glyph']}
              style={{ borderColor: 'var(--bs-danger)', color: 'var(--bs-danger)' }}
              aria-hidden>
              <WarnIcon />
            </div>
            <div>{t('tree.state.error')}</div>
            <div className={styles['tree-state-detail']}>{tree.rootNode.error}</div>
            <Button variant="secondary" size="sm" onClick={() => void tree.refresh()}>
              {t('tree.state.retry')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (totalRows === 0) {
    return (
      <div className={styles['tree-wrap']} data-testid="files-tree-empty">
        <FilesTreeToolbar selection={selection} download={download} disableDownload />
        <FilesTreeHeader />
        <div
          className={styles['tree-viewport']}
          style={{ height: fallbackHeight }}
          role="status"
          aria-live="polite">
          <div className={styles['tree-state']}>
            <div className={styles['tree-state-glyph']} aria-hidden>
              <EmptyIcon />
            </div>
            <div>{query ? t('tree.state.noMatches', { query }) : t('tree.state.empty')}</div>
          </div>
        </div>
      </div>
    )
  }

  const streamingZipActive = !['idle', 'done', 'error', 'cancelled'].includes(
    streamingZip.state.status
  )

  return (
    <div className={styles['tree-wrap']} data-testid="files-tree">
      <FilesTreeToolbar
        selection={selection}
        download={download}
        streamingZipActive={streamingZipActive}
        disableDownload={downloadsDisabled}
      />
      <FilesTreeHeader
        selectAllState={headerSelectAllState}
        onToggleSelectAll={onToggleSelectAll}
      />
      <div
        ref={containerRef}
        className={styles['tree-viewport']}
        onScroll={onScroll}
        role="tree"
        aria-multiselectable="true"
        aria-label={t('tree.label', 'Dataset files')}
        style={{ height: fallbackHeight }}>
        <div
          className={styles['tree-spacer']}
          style={{ height: totalRows * rowHeight, position: 'relative' }}>
          {slice.map((row, sliceIndex) => {
            const absoluteIndex = startIdx + sliceIndex
            const top = absoluteIndex * rowHeight
            if (row.kind === 'loading') {
              return (
                <RowMessage
                  key={`loading-${row.path}`}
                  top={top}
                  height={rowHeight}
                  depth={row.depth}
                  className={styles['row-loading']}>
                  <SpinnerIcon /> {t('tree.state.loadingFolder')}
                </RowMessage>
              )
            }
            if (row.kind === 'error') {
              return (
                <RowMessage
                  key={`error-${row.path}`}
                  top={top}
                  height={rowHeight}
                  depth={row.depth}
                  className={styles['row-error']}>
                  <WarnIcon /> {row.error}{' '}
                  <button
                    type="button"
                    className={styles['btn-link-inline']}
                    onClick={() => void tree.refresh(row.path)}>
                    {t('tree.state.retry')}
                  </button>
                </RowMessage>
              )
            }
            if (row.kind === 'load-more') {
              const node = tree.nodes.get(row.path)
              return (
                <RowMessage
                  key={`load-more-${row.path}`}
                  top={top}
                  height={rowHeight}
                  depth={row.depth + 1}
                  className={styles['row-load-more']}>
                  <button
                    type="button"
                    className={styles['btn-link-inline']}
                    disabled={Boolean(node?.loading)}
                    onClick={() => void tree.loadMore(row.path)}>
                    {node?.loading ? t('tree.state.loadingMore') : t('tree.state.loadMore')}
                  </button>
                </RowMessage>
              )
            }
            const item = row.node
            const knownChildren = isFileTreeFolder(item) ? tree.visibleKnownChildren(item.path) : []
            const selectionState = isFileTreeFile(item)
              ? selection.fileState(item)
              : selection.folderState(item, knownChildren)
            const expanded = isFileTreeFolder(item) ? tree.expanded.has(item.path) : undefined
            return (
              <FilesTreeRow
                key={`${row.kind}-${item.path}`}
                top={top}
                height={rowHeight}
                depth={row.depth}
                item={item}
                selectionState={selectionState}
                expanded={expanded}
                onToggleExpansion={
                  isFileTreeFolder(item) ? () => void handleToggleExpansion(item) : undefined
                }
                onToggleSelection={() => {
                  if (isFileTreeFile(item)) {
                    handleToggleSelectionFile(item)
                  } else {
                    handleToggleSelectionFolder(item)
                  }
                }}
                onDownload={
                  // Also gated on an active zip run: the engine is a
                  // single instance, and a second start() would race
                  // the first (shared cancelledRef/decisionRef, two
                  // anchor clicks) — same condition the toolbar uses.
                  downloadsDisabled ||
                  streamingZipActive ||
                  download.progress.status === 'enumerating' ||
                  download.progress.status === 'requesting'
                    ? undefined
                    : () => handleDownloadOne(item)
                }
                datasetVersionNumber={datasetVersion.number}
                buildFileMetadataUrl={buildFileMetadataUrl}
                focused={absoluteIndex === focusedRowIndex}
                onFocus={() => setFocusedRowIndex(absoluteIndex)}
                onRowKeyDown={onRowKeyDown}
              />
            )
          })}
        </div>
      </div>
      <FilesTreeDownloadTray
        api={streamingZip}
        open={trayOpen}
        onClose={() => {
          setTrayOpen(false)
          streamingZip.close()
        }}
      />
    </div>
  )
}

interface FilesTreeToolbarProps {
  selection: ReturnType<typeof useFileTreeSelection>
  download: ReturnType<typeof useFileTreeDownload>
  disableDownload?: boolean
  streamingZipActive?: boolean
}

function FilesTreeToolbar({
  selection,
  download,
  disableDownload,
  streamingZipActive
}: FilesTreeToolbarProps) {
  const { t } = useTranslation('files')
  const { count, bytes, hasLogicalFolders } = selection.totals
  const downloadable = !disableDownload && (count > 0 || hasLogicalFolders)
  const enumerating = download.progress.status === 'enumerating'
  const requesting = download.progress.status === 'requesting'

  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label={t('tree.toolbar.label', 'Selection actions')}>
      <div className={styles['toolbar-left']}>
        <span
          className={styles['selection-summary']}
          data-testid="files-tree-selection-summary"
          role="status"
          aria-live="polite">
          {count === 0 && !hasLogicalFolders ? (
            <span>{t('tree.selection.none')}</span>
          ) : (
            <>
              <span className={styles['selection-summary-strong']}>{count.toLocaleString()}</span>{' '}
              {t('tree.selection.fileCount', { count })}
              {hasLogicalFolders && (
                <>
                  <span className={styles['selection-summary-sep']}>·</span>
                  {t('tree.selection.includesFolders')}
                </>
              )}
              {bytes > 0 && (
                <>
                  <span className={styles['selection-summary-sep']}>·</span>
                  <span className={styles['selection-summary-strong']}>{formatBytes(bytes)}</span>
                </>
              )}
            </>
          )}
        </span>
      </div>
      <div className={styles['toolbar-right']}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => selection.clear()}
          disabled={count === 0 && !hasLogicalFolders}>
          {t('tree.selection.clear')}
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={
            <span className={styles['download-btn-icon']}>
              <DownloadIcon />
            </span>
          }
          disabled={!downloadable || enumerating || requesting || streamingZipActive}
          onClick={() => void download.downloadSelection()}
          data-testid="files-tree-download-button">
          {streamingZipActive
            ? t('tree.download.streaming', 'Streaming…')
            : enumerating
            ? t('tree.download.enumerating')
            : requesting
            ? t('tree.download.preparing')
            : t('tree.download.button')}
        </Button>
      </div>
    </div>
  )
}

interface RowMessageProps {
  top: number
  height: number
  depth: number
  className: string
  children: React.ReactNode
}

function RowMessage({ top, height, depth, className, children }: RowMessageProps) {
  // 14 row padding + 28 select column + 8 column gap + depth indent +
  // 22 (twisty 18 + 4 gap) so the message text aligns with where a
  // row's label would start.
  const indent: CSSProperties = {
    paddingLeft: 14 + 28 + 8 + depth * 18 + 22,
    top,
    height
  }
  return (
    <div className={className} style={indent}>
      {children}
    </div>
  )
}
