import { InfoMessageBox } from './FileInfoMessages'
import { useTranslation } from 'react-i18next'

export function AccessRequestedInfoMessage({ accessRequested }: { accessRequested: boolean }) {
  const { t } = useTranslation('files')

  if (!accessRequested) return <></>

  return <InfoMessageBox>{t('requestAccess.accessRequested')}</InfoMessageBox>
}
