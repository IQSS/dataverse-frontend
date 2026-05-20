import DOMPurify from 'dompurify'
import { Outlet } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import styles from './Layout.module.scss'
import { FooterFactory } from './footer/FooterFactory'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { HeaderFactory } from './header/HeaderFactory'
import { HistoryTrackerProvider } from '@/router/HistoryTrackerProvider'
import { requireAppConfig } from '@/config'
import type { AppConfig } from '@/config'

export function Layout() {
  const { i18n } = useTranslation()
  const { bannerMessage, defaultLanguage } = requireAppConfig()
  const localizedBannerMessage = getLocalizedBannerMessage(
    bannerMessage,
    i18n.resolvedLanguage ?? i18n.language,
    defaultLanguage
  )
  const sanitizedBannerMessage = localizedBannerMessage
    ? DOMPurify.sanitize(localizedBannerMessage, { USE_PROFILES: { html: true } })
    : null

  return (
    <HistoryTrackerProvider>
      <TopBarProgressIndicator />
      {HeaderFactory.create()}
      {sanitizedBannerMessage ? (
        <div className={`alert alert-warning rounded-0 ${styles['banner-message']}`} role="alert">
          <div className="container" dangerouslySetInnerHTML={{ __html: sanitizedBannerMessage }} />
        </div>
      ) : null}

      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}
    </HistoryTrackerProvider>
  )
}

function getLocalizedBannerMessage(
  bannerMessage: AppConfig['bannerMessage'],
  selectedLanguage: string | undefined,
  defaultLanguage: string
): string | undefined {
  if (!bannerMessage || typeof bannerMessage === 'string') return bannerMessage

  const normalizedMessages = Object.fromEntries(
    Object.entries(bannerMessage).map(([language, message]) => [language.toLowerCase(), message])
  )
  const selectedLanguageCode = selectedLanguage?.toLowerCase()
  const defaultLanguageCode = defaultLanguage.toLowerCase()
  const candidateLanguages = [
    selectedLanguageCode,
    selectedLanguageCode?.split('-')[0],
    defaultLanguageCode,
    defaultLanguageCode.split('-')[0]
  ].filter((language): language is string => Boolean(language))

  for (const language of candidateLanguages) {
    if (normalizedMessages[language]) return normalizedMessages[language]
  }

  return Object.values(bannerMessage)[0]
}
