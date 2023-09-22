import { Check, ClipboardPlusFill } from 'react-bootstrap-icons'
import { Tooltip } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import styles from './CopyToClipboard.module.scss'
import { useTranslation } from 'react-i18next'

export function CopyToClipboardButton({ text }: { text: string }) {
  const { t } = useTranslation('files')
  const [copied, setCopied] = useState(false)
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        console.log('Text copied to clipboard!')
      })
      .catch((error) => {
        console.error('Failed to copy text:', error)
      })
  }

  return (
    <Tooltip placement="top" overlay={`${t('table.copyToClipboard.clickToCopy')} ${text}`}>
      <span onClick={copyToClipboard} className={styles.container} role="button">
        {text}
        {copied ? (
          <Check
            className={styles.check}
            role="img"
            title={t('table.copyToClipboard.correctlyCopiedIcon')}
          />
        ) : (
          <ClipboardPlusFill
            role="img"
            title={t('table.copyToClipboard.copyToClipboardIcon')}
            className={styles.clipboard}
          />
        )}
      </span>
    </Tooltip>
  )
}
