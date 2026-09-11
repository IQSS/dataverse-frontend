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
import {
  AccessVariant,
  fileAccessVariant,
  folderAccessParts,
  folderAccessVariant,
  formatBytes,
  formatCount
} from './format'

interface FilesTreeRowProps {
  depth: number
  top: number
  height: number
  item: FileTreeFile | FileTreeFolder
  selectionState: SelectionState
  expanded?: boolean
  onToggleSelection: () => void
  onToggleExpansion?: () => void
  onDownload?: () => void
  datasetVersionNumber: DatasetVersionNumber
  buildFileMetadataUrl?: (file: FileTreeFile) => string
  focused?: boolean
  onFocus?: () => void
  rowRef?: RefObject<HTMLDivElement>
  onRowKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
}

const INDENT_BASE = 14
const INDENT_PER_LEVEL = 18

const ACCESS_VARIANT_CLASS: Record<AccessVariant, string> = {
  restricted: 'row-access-restricted',
  embargoed: 'row-access-embargoed',
  retentionExpired: 'row-access-retention-expired'
}

const FILE_ACCESS_LABEL_DEFAULTS = {
  public: 'Public',
  restricted: 'Restricted',
  embargoed: 'Embargoed',
  retentionExpired: 'Retention expired'
} as const

const FOLDER_ACCESS_WORD_DEFAULTS: Record<AccessVariant, string> = {
  restricted: 'restricted',
  embargoed: 'embargoed',
  retentionExpired: 'retention expired'
}

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
  const accessVariant = isFile
    ? fileAccessVariant(item.accessStatus)
    : folderAccessVariant(item.counts)
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
      <div className={styles['row-select']}>
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
      </div>
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
      <div className={styles['row-size']}>
        {isFile ? formatBytes(item.size) : formatBytes(item.counts?.bytes)}
      </div>
      <div
        className={cn(
          styles['row-access'],
          accessVariant && styles[ACCESS_VARIANT_CLASS[accessVariant]]
        )}
        data-testid={`files-tree-row-access-${item.path}`}>
        {isFile
          ? item.accessStatus
            ? t(`tree.access.${item.accessStatus}`, FILE_ACCESS_LABEL_DEFAULTS[item.accessStatus])
            : ''
          : folderAccessParts(item.counts)
              .map((part) =>
                t(`tree.access.count.${part.key}`, {
                  count: part.count,
                  defaultValue: `{{count}} ${FOLDER_ACCESS_WORD_DEFAULTS[part.key]}`
                })
              )
              .join(' · ')}
      </div>
      <div className={styles['row-count']}>
        {!isFile && item.counts ? formatCount(item.counts.files) : ''}
      </div>
      <div className={styles['row-actions']}>
        {onDownload ? (
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
        ) : null}
      </div>
    </div>
  )
}
