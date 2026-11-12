import { Check, ClipboardPlusFill } from 'react-bootstrap-icons'
import { Tooltip } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import styles from './CopyToClipboard.module.scss'
import { useTranslation } from 'react-i18next'

export function CopyToClipboardButton({
  text,
  html,
  showTruncateText = true,
  tooltipText,
  iconSize,
  disabled = false
}: {
  text: string
  html?: string
  showTruncateText?: boolean
  tooltipText?: string
  iconSize?: string | number
  disabled?: boolean
}) {
  const { t } = useTranslation('files')
  const [copied, setCopied] = useState(false)
  const copyToClipboard = () => {
    if (disabled) return
    const copy =
      html && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write
        ? navigator.clipboard
            .write([
              new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
              })
            ])
            .catch(() => navigator.clipboard.writeText(text))
        : navigator.clipboard.writeText(text)

    copy
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        console.log('Text copied to clipboard!')
      })
      .catch((error) => {
        console.error('Failed to copy text:', error)
      })
  }

  const tooltipOverlay = disabled
    ? ''
    : tooltipText ?? `${t('table.copyToClipboard.clickToCopy')} ${text}`

  return (
    <Tooltip placement="top" overlay={tooltipOverlay}>
      <button
        type="button"
        onClick={copyToClipboard}
        aria-disabled={disabled}
        className={styles.container}>
        {showTruncateText && truncateText(text)}
        {copied ? (
          <Check
            size={iconSize}
            className={styles.check}
            role="img"
            title={t('table.copyToClipboard.correctlyCopiedIcon')}
          />
        ) : (
          <ClipboardPlusFill
            size={iconSize}
            role="img"
            title={t('table.copyToClipboard.copyToClipboardIcon')}
            className={styles.clipboard}
          />
        )}
      </button>
    </Tooltip>
  )
}

function truncateText(text: string): string {
  if (text.length <= 25) {
    return text
  }
  let prefix = text.slice(0, 3)
  let suffix = text.slice(-3)

  const secondColonIndex = text.indexOf(':', text.indexOf(':') + 1)
  if (secondColonIndex !== -1) {
    prefix = text.slice(0, secondColonIndex + 5)
  }

  if (text.endsWith('==')) {
    suffix = text.slice(-5)
  }

  return `${prefix}...${suffix}`
}
