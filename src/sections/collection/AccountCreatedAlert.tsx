import { useEffect } from 'react'
import Confetti from 'react-confetti'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { useWindowSize } from '@/shared/hooks/useWindowSize'

export const ACCOUNT_CREATED_SESSION_STORAGE_KEY = 'accountCreated'

export const AccountCreatedAlert = () => {
  const { t } = useTranslation('collection')
  const { width, height } = useWindowSize()

  useEffect(() => {
    // Remove the session storage key after the component is mounted to avoid showing the alert again
    sessionStorage.removeItem(ACCOUNT_CREATED_SESSION_STORAGE_KEY)
  }, [])

  return (
    <>
      <Confetti width={width} height={height} numberOfPieces={1000} recycle={false} />
      <Alert variant="success">{t('accountJustCreated')}</Alert>
    </>
  )
}
