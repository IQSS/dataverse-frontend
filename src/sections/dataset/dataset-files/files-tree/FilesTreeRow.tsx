import { CSSProperties, MouseEvent } from 'react'
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
  datasetVersionNumber
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
      role="row"
      aria-selected={selectionState !== 'none'}
      className={cn(styles.row, {
        [styles['row-selected']]: selectionState !== 'none'
      })}
      style={rowStyle}
      onClick={handleRowClick}>
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
            <Link
              to={`${Route.FILES}?${QueryParamKey.FILE_ID}=${item.id}&${
                QueryParamKey.DATASET_VERSION
              }=${datasetVersionNumber.toSearchParam()}`}
              data-testid={`files-tree-file-link-${item.path}`}>
              {item.name}
            </Link>
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
