import { useTranslation } from 'react-i18next'

interface FileTypeLabelProps {
  mimeType: string
  fallback: string
}

export function FileTypeLabel({ mimeType, fallback }: FileTypeLabelProps) {
  const { t } = useTranslation('file')

  return (
    <>
      {mimeType === 'text/tab-separated-values'
        ? t('metadata.fileTypes.tabDelimited', { defaultValue: fallback })
        : fallback}
    </>
  )
}
