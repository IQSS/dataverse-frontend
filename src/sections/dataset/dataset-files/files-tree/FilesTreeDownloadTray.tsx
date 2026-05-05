import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { StreamingZipApi } from './useStreamingZipDownload'
import { WarnIcon } from './icons/FilesTreeIcons'
import { formatBytes } from './format'
import styles from './FilesTreeDownloadTray.module.scss'

interface FilesTreeDownloadTrayProps {
  api: StreamingZipApi
  open: boolean
  onClose: () => void
}

/**
 * Bottom-sheet status panel for the streaming-zip download. Shows
 * overall progress, the file currently being added, and surfaces the
 * pause-on-fail / two-pass decisions as inline buttons. Stays out of
 * the user's way while they continue browsing.
 */
export function FilesTreeDownloadTray({ api, open, onClose }: FilesTreeDownloadTrayProps) {
  const { t } = useTranslation('files')
  const { state } = api

  const isPaused = state.status === 'paused'
  const isAwaitingRetry = state.status === 'awaiting-retry'
  const isDone = state.status === 'done'
  const isCancelled = state.status === 'cancelled'
  const isError = state.status === 'error'
  const lastRecoverableFailure = [...state.failedSoFar].reverse().find((f) => f.recoverable)

  const pct = state.totalBytes > 0 ? Math.min(100, (state.bytesDone / state.totalBytes) * 100) : 0

  let title: string = t('tree.download.tray.preparing', 'Preparing zip…')
  if (isPaused) title = t('tree.download.tray.paused', 'Download paused — file failed')
  else if (isAwaitingRetry)
    title = t('tree.download.tray.firstPass', {
      defaultValue: 'First pass complete — {{count}} file(s) failed',
      count: state.failedSoFar.length
    })
  else if (isDone && state.failedSoFar.length === 0)
    title = t('tree.download.tray.complete', 'Download complete')
  else if (isDone && state.failedSoFar.length > 0)
    title = t('tree.download.tray.completeWithSkipped', {
      defaultValue: 'Download complete — {{count}} skipped',
      count: state.failedSoFar.length
    })
  else if (isError) title = t('tree.download.tray.error', 'Download failed')
  else if (isCancelled) title = t('tree.download.tray.cancelled', 'Download cancelled')
  else if (state.filesDone > 0 || state.bytesDone > 0)
    title = t('tree.download.tray.streaming', 'Streaming files into zip…')

  const nowText = isPaused
    ? t('tree.download.tray.now.paused', 'Paused')
    : isAwaitingRetry
    ? t('tree.download.tray.now.awaiting', 'Awaiting retry decision')
    : isDone
    ? t('tree.download.tray.now.done', 'Done')
    : isCancelled
    ? t('tree.download.tray.now.cancelled', 'Cancelled')
    : state.current
    ? `▸ ${state.current.path}`
    : '…'

  return (
    <>
      <div
        className={cn(styles.overlay, { [styles['overlay-open']]: open })}
        onClick={() => {
          if (isDone || isCancelled || isError) onClose()
        }}
        aria-hidden
      />
      <div
        className={cn(styles.tray, { [styles['tray-open']]: open })}
        role="region"
        aria-live="polite"
        aria-label={t('tree.download.tray.label', 'Zip download progress')}
        data-testid="files-tree-download-tray">
        <div className={styles['tray-head']}>
          <div>
            <div className={styles['tray-title']}>{title}</div>
            <div className={styles['tray-meta']} data-testid="files-tree-download-tray-meta">
              {state.filesDone} / {state.totalFiles} {t('tree.download.tray.files', 'files')} ·{' '}
              {formatBytes(state.bytesDone)} / {formatBytes(state.totalBytes)}
              {state.pass === 2 && <> · {t('tree.download.tray.pass2', 'pass 2 of 2')}</>}
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={onClose}
            aria-label={t('tree.download.tray.close', 'Close')}>
            ×
          </Button>
        </div>

        <div className={styles['tray-body']}>
          <div
            className={cn(styles.progress, {
              [styles['progress-error']]: isPaused || isError,
              [styles['progress-done']]: isDone && state.failedSoFar.length === 0
            })}>
            <div
              className={styles['progress-bar']}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            />
          </div>
          <div className={styles['tray-status']}>
            <div className={styles['tray-status-now']}>{nowText}</div>
            <div className={styles['tray-status-pct']}>{pct.toFixed(1)}%</div>
          </div>

          {isPaused && lastRecoverableFailure && (
            <div className={styles['tray-fail']} data-testid="files-tree-download-tray-failure">
              <div className={styles['tray-fail-heading']}>
                <WarnIcon /> {t('tree.download.tray.failed', 'Failed to fetch file')}
              </div>
              <div className={styles['tray-fail-file']}>{lastRecoverableFailure.path}</div>
              <div className={styles['tray-fail-err']}>{lastRecoverableFailure.error}</div>
              <div className={styles['tray-fail-actions']}>
                <Button variant="primary" size="sm" onClick={api.retryCurrent}>
                  {t('tree.download.tray.retry', 'Retry this file')}
                </Button>
                <Button variant="secondary" size="sm" onClick={api.skipCurrent}>
                  {t('tree.download.tray.skip', 'Skip')}
                </Button>
                <Button variant="secondary" size="sm" onClick={api.deferCurrentToEnd}>
                  {t('tree.download.tray.deferToEnd', 'Skip & retry at end')}
                </Button>
                <Button variant="link" size="sm" onClick={api.skipAllFailures}>
                  {t('tree.download.tray.skipAll', 'Skip all remaining failures')}
                </Button>
              </div>
            </div>
          )}

          {isAwaitingRetry && (
            <div className={styles['tray-fail']} data-testid="files-tree-download-tray-twopass">
              <div className={styles['tray-fail-heading']}>
                <WarnIcon />{' '}
                {t('tree.download.tray.notIncluded', {
                  defaultValue: '{{count}} file(s) were not included in the zip',
                  count: state.failedSoFar.length
                })}
              </div>
              <div className={styles['tray-fail-err']}>
                {t(
                  'tree.download.tray.twopassHint',
                  'First pass finished. The zip will be finalised after a second-pass retry of the failures.'
                )}
              </div>
              <div className={styles['tray-fail-actions']}>
                <Button variant="primary" size="sm" onClick={api.retryFailed}>
                  {t('tree.download.tray.retryFailed', {
                    defaultValue: 'Download {{count}} missing file(s)',
                    count: state.failedSoFar.length
                  })}
                </Button>
                <Button variant="link" size="sm" onClick={onClose}>
                  {t('tree.download.tray.done', 'Done')}
                </Button>
              </div>
            </div>
          )}

          {isDone && state.failedSoFar.length > 0 && !isAwaitingRetry && (
            <div className={styles['tray-fail']}>
              <div className={styles['tray-fail-heading']}>
                <WarnIcon />{' '}
                {t('tree.download.tray.skipped', {
                  defaultValue: '{{count}} file(s) skipped',
                  count: state.failedSoFar.length
                })}
              </div>
              <div className={styles['tray-fail-err']}>
                {t(
                  'tree.download.tray.skippedManifest',
                  'A manifest.txt listing skipped files has been added to the root of the zip.'
                )}
              </div>
            </div>
          )}

          {isError && state.message && (
            <div className={styles['tray-fail']}>
              <div className={styles['tray-fail-heading']}>
                <WarnIcon /> {t('tree.download.tray.error', 'Download failed')}
              </div>
              <div className={styles['tray-fail-err']}>{state.message}</div>
            </div>
          )}
        </div>

        <div className={styles['tray-foot']}>
          <div className={styles['tray-hint']}>
            {t('tree.download.tray.hint', 'Streamed locally into one zip — no server-side ZIP.')}
          </div>
          {!isDone && !isAwaitingRetry && !isError && !isCancelled && (
            <Button variant="danger" size="sm" onClick={api.cancel}>
              {t('tree.download.tray.cancel', 'Cancel')}
            </Button>
          )}
          {(isDone || isCancelled || isError) && (
            <Button variant="primary" size="sm" onClick={onClose}>
              {t('tree.download.tray.close', 'Close')}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
