import {
  CSSProperties,
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
import { useAccessRepository } from '@/sections/access/AccessRepositoryContext'
import {
  EMPTY_GUESTBOOK_RESPONSE,
  downloadFromSignedUrl,
  requestSignedDownloadUrlFromAccessApi
} from '@/shared/helpers/DownloadHelper'
import { FileDownloadMode } from '@/files/domain/models/FileMetadata'
import { useFileTree } from './useFileTree'
import { useFileTreeSelection } from './useFileTreeSelection'
import { useFileTreeFlatten } from './useFileTreeFlatten'
import { useFileTreeDownload } from './useFileTreeDownload'
import { FilesTreeRow } from './FilesTreeRow'
import { FilesTreeHeader } from './FilesTreeHeader'
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
  onCurrentPathChange
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
  const accessRepository = useAccessRepository()

  const onDownloadFileIds = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) {
        return
      }
      const url = await requestSignedDownloadUrlFromAccessApi({
        accessRepository,
        fileIds: ids,
        guestbookResponse: EMPTY_GUESTBOOK_RESPONSE,
        format: FileDownloadMode.ORIGINAL
      })
      await downloadFromSignedUrl(url)
      toast.success(t('actions.optionsMenu.guestbookCollectModal.downloadStarted'))
    },
    [accessRepository, t]
  )

  const download = useFileTreeDownload({
    treeRepository,
    datasetPersistentId,
    datasetVersion,
    selection,
    onDownloadFileIds,
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
    if (typeof window === 'undefined') {
      return
    }
    const el = containerRef.current
    if (!el) {
      return
    }
    const update = () => {
      const measured = el.clientHeight
      if (measured > 0) {
        setViewportH(measured)
      }
    }
    update()
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

  const isInitialLoad = !tree.rootNode.loaded && tree.rootNode.loading

  if (isInitialLoad) {
    return (
      <div className={styles['tree-wrap']} data-testid="files-tree-loading">
        <FilesTreeHeader />
        <div className={styles['tree-viewport']} style={{ height: fallbackHeight }}>
          <div className={styles['tree-state']}>
            <div className={styles['tree-state-glyph']}>
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
        <div className={styles['tree-viewport']} style={{ height: fallbackHeight }}>
          <div className={styles['tree-state']}>
            <div
              className={styles['tree-state-glyph']}
              style={{ borderColor: 'var(--bs-danger)', color: 'var(--bs-danger)' }}>
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
        <div className={styles['tree-viewport']} style={{ height: fallbackHeight }}>
          <div className={styles['tree-state']}>
            <div className={styles['tree-state-glyph']}>
              <EmptyIcon />
            </div>
            <div>{query ? t('tree.state.noMatches', { query }) : t('tree.state.empty')}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['tree-wrap']} data-testid="files-tree">
      <FilesTreeToolbar selection={selection} download={download} />
      <FilesTreeHeader />
      <div
        ref={containerRef}
        className={styles['tree-viewport']}
        onScroll={onScroll}
        role="grid"
        aria-rowcount={totalRows}
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
                  key={`loading-${row.path}-${absoluteIndex}`}
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
                  key={`error-${row.path}-${absoluteIndex}`}
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
                  key={`load-more-${row.path}-${absoluteIndex}`}
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
                key={`${row.kind}-${item.path}-${absoluteIndex}`}
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
                onDownload={() => handleDownloadOne(item)}
                datasetVersionNumber={datasetVersion.number}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface FilesTreeToolbarProps {
  selection: ReturnType<typeof useFileTreeSelection>
  download: ReturnType<typeof useFileTreeDownload>
  disableDownload?: boolean
}

function FilesTreeToolbar({ selection, download, disableDownload }: FilesTreeToolbarProps) {
  const { t } = useTranslation('files')
  const { count, bytes, hasLogicalFolders } = selection.totals
  const downloadable = !disableDownload && (count > 0 || hasLogicalFolders)
  const enumerating = download.progress.status === 'enumerating'
  const requesting = download.progress.status === 'requesting'

  return (
    <div className={styles.toolbar}>
      <div className={styles['toolbar-left']}>
        <span className={styles['selection-summary']} data-testid="files-tree-selection-summary">
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
          disabled={!downloadable || enumerating || requesting}
          onClick={() => void download.downloadSelection()}
          data-testid="files-tree-download-button">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <DownloadIcon />
            {enumerating
              ? t('tree.download.enumerating')
              : requesting
              ? t('tree.download.preparing')
              : t('tree.download.button')}
          </span>
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
  const indent: CSSProperties = {
    paddingLeft: 14 + depth * 18 + 30,
    top,
    height
  }
  return (
    <div className={className} style={indent}>
      {children}
    </div>
  )
}
