import { CSSProperties, KeyboardEvent, MouseEvent, RefObject } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FileTreeFile, FileTreeFolder, isFileTreeFile } from '@/files/domain/models/FileTreeItem'
import { DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { FilesTreeCheckbox } from './FilesTreeCheckbox'
import {
  ChevronIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon
} from './icons/FilesTreeIcons'
import styles from './FilesTree.module.scss'
import { SelectionState } from './useFileTreeSelection'
import { formatBytes, formatCount } from './format'

interface FilesTreeRowProps {
  depth: number
  top: number
  height: number
  item: FileTreeFile | FileTreeFolder
  selectionState: SelectionState
  expanded?: boolean
  onToggleSelection: () => void
  onToggleExpansion?: () => void
  onDownload: () => void
  datasetVersionNumber: DatasetVersionNumber
  /**
   * Optional URL builder for the filename → file metadata link. When
   * provided, the row renders a plain `<a href>` (works in JSF
   * standalone embeds where there is no React Router). When omitted,
   * the row falls back to a SPA `<Link>` pointing at the SPA file
   * page.
   */
  buildFileMetadataUrl?: (file: FileTreeFile) => string
  /**
   * Whether this row is the focused row in the roving-tabindex
   * keyboard model. Only one row at a time has tabIndex=0; the rest
   * are tabIndex=-1.
   */
  focused?: boolean
  /** Called when this row receives focus (e.g. via Tab into the tree). */
  onFocus?: () => void
  /** Forwarded to the row's underlying div so the parent can scroll it into view. */
  rowRef?: RefObject<HTMLDivElement>
  /** Keyboard handler shared by all rows; lives on the parent for navigation logic. */
  onRowKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
}

const INDENT_BASE = 14
const INDENT_PER_LEVEL = 18

export function FilesTreeRow({
  depth,
  top,
  height,
  item,
  selectionState,
  expanded,
  onToggleSelection,
  onToggleExpansion,
  onDownload,
  datasetVersionNumber,
  buildFileMetadataUrl,
  focused,
  onFocus,
  rowRef,
  onRowKeyDown
}: FilesTreeRowProps) {
  const { t } = useTranslation('files')
  const isFile = isFileTreeFile(item)
  const indent: CSSProperties = {
    paddingLeft: INDENT_BASE + depth * INDENT_PER_LEVEL
  }
  const rowStyle: CSSProperties = { top, height }
  const Icon = isFile ? FileIcon : expanded ? FolderOpenIcon : FolderIcon

  const handleRowClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('a, button, [role="checkbox"]')) {
      return
    }
    onToggleSelection()
  }

  const handleTwistyClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggleExpansion?.()
  }

  return (
    <div
      data-testid={`files-tree-row-${item.path}`}
      role="treeitem"
      aria-selected={selectionState === 'all'}
      aria-level={depth + 1}
      aria-expanded={!isFile ? Boolean(expanded) : undefined}
      tabIndex={focused ? 0 : -1}
      ref={rowRef}
      className={cn(styles.row, {
        [styles['row-selected']]: selectionState !== 'none'
      })}
      style={rowStyle}
      onClick={handleRowClick}
      onFocus={onFocus}
      onKeyDown={onRowKeyDown}>
      <div className={styles['row-name']} style={indent}>
        {isFile ? (
          <span className={cn(styles['row-twisty'], styles['row-twisty-empty'])} aria-hidden />
        ) : (
          <button
            type="button"
            className={cn(styles['row-twisty'], { [styles['row-twisty-open']]: expanded })}
            aria-expanded={Boolean(expanded)}
            aria-label={
              expanded
                ? t('tree.row.collapseFolder', { name: item.name })
                : t('tree.row.expandFolder', { name: item.name })
            }
            onClick={handleTwistyClick}>
            <ChevronIcon />
          </button>
        )}
        <FilesTreeCheckbox
          state={selectionState}
          onToggle={onToggleSelection}
          label={
            isFile
              ? t('tree.row.selectFile', { name: item.name })
              : t('tree.row.selectFolder', { name: item.name })
          }
          testId={`files-tree-checkbox-${item.path}`}
        />
        <span
          className={cn(styles['row-icon'], {
            [styles['row-icon-folder']]: !isFile
          })}>
          <Icon />
        </span>
        <span
          className={cn(styles['row-label'], {
            [styles['row-label-folder']]: !isFile
          })}
          title={item.path}>
          {isFile ? (
            buildFileMetadataUrl ? (
              <a
                href={buildFileMetadataUrl(item)}
                data-testid={`files-tree-file-link-${item.path}`}>
                {item.name}
              </a>
            ) : (
              <Link
                to={`${Route.FILES}?${QueryParamKey.FILE_ID}=${item.id}&${
                  QueryParamKey.DATASET_VERSION
                }=${datasetVersionNumber.toSearchParam()}`}
                data-testid={`files-tree-file-link-${item.path}`}>
                {item.name}
              </Link>
            )
          ) : (
            <span>{item.name}</span>
          )}
        </span>
      </div>
      <div className={styles['row-size']}>{isFile ? formatBytes(item.size) : ''}</div>
      <div className={styles['row-count']}>
        {!isFile && item.counts ? formatCount(item.counts.files) : ''}
      </div>
      <div className={styles['row-actions']}>
        <button
          type="button"
          className={styles['icon-btn']}
          aria-label={
            isFile
              ? t('tree.row.downloadFile', { name: item.name })
              : t('tree.row.downloadFolder', { name: item.name })
          }
          onClick={(event) => {
            event.stopPropagation()
            onDownload()
          }}>
          <DownloadIcon />
        </button>
      </div>
    </div>
  )
}
