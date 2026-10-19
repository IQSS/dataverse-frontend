import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Stack } from '@iqss/dataverse-design-system'
import { SignUpResult } from '@/users/domain/models/SignUpResult'
import { Route } from '@/sections/Route.enum'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'

interface SignUpSuccessProps {
  result: SignUpResult
}

export const SignUpSuccess = ({ result }: SignUpSuccessProps) => {
  const { t } = useTranslation('signUp')
  const { logIn: oidcLogin } = useContext(AuthContext)

  if (result.status === 'pending') {
    return (
      <Alert variant="info" customHeading={t('builtinSignUp.pending.heading')} dismissible={false}>
        <span data-testid="sign-up-pending-text">{t('builtinSignUp.pending.text')}</span>
      </Alert>
    )
  }

  return (
    <Stack direction="vertical" gap={3}>
      <Alert
        variant="success"
        customHeading={t('builtinSignUp.created.heading')}
        dismissible={false}>
        <span data-testid="sign-up-created-text">
          {t('builtinSignUp.created.text', { identifier: result.identifier })}
        </span>
      </Alert>
      <div>
        <Button
          onClick={() => oidcLogin(encodeReturnToPathInStateQueryParam(Route.HOME))}
          data-testid="sign-up-log-in-button">
          {t('builtinSignUp.created.logIn')}
        </Button>
      </div>
    </Stack>
  )
}
