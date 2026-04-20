import { Alert } from '@iqss/dataverse-design-system'
import type { I18n } from '../i18n'
import styles from './SignInNotice.module.scss'

const DATAVERSE_BASE_URL =
  (import.meta.env.VITE_DATAVERSE_BASE_URL as string) ?? 'https://dataverse.harvard.edu'
const HARVARD_SIGN_UP_URL = `${DATAVERSE_BASE_URL}/dataverseuser.xhtml?editMode=CREATE&redirectPage=%2Fdataverse_homepage.xhtml`

interface SignInNoticeProps {
  i18n: I18n
}

export function SignInNotice({ i18n }: SignInNoticeProps) {
  const { msg, msgStr } = i18n

  return (
    <div className={styles['top-notice']}>
      <Alert variant="warning" customHeading={msgStr('signInNoticeTitle')} dismissible={false}>
        <>
          {msg('signInNoticeBodyPrefix')}
          <a href={HARVARD_SIGN_UP_URL}>{msg('signInNoticeSignUpLinkText')}</a>
        </>
      </Alert>
    </div>
  )
}
