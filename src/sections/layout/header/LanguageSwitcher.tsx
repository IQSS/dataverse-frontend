import { useTranslation } from 'react-i18next'
import { Navbar } from '@iqss/dataverse-design-system'
import { Translate as TranslateIcon } from 'react-bootstrap-icons'
import { LANGUAGE_LOCAL_STORAGE_KEY } from '@/i18n'
import { requireAppConfig } from '@/config'

// TODO:ME - Show screenshots of variants of dropdown title (with icon, only icon, only text, both) and get feedback from team

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation('shared')

  const appConfig = requireAppConfig()

  // We dont render the language switcher if there is only one language configured
  if (appConfig.languages.length < 2) return null

  const handleSelectLanguage = (lang: string) => {
    localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, lang)

    void i18n.changeLanguage(lang)
  }

  const currentSelectedLanguage = i18n.languages[0]

  return (
    <Navbar.Dropdown
      title={
        <div className="d-inline-flex align-items-center gap-1">
          <TranslateIcon />
          <span>{t('language')}</span>
        </div>
      }
      id="language-switcher-dropdown">
      {appConfig.languages.map(({ code, name }) => (
        <Navbar.Dropdown.Item
          key={code}
          onClick={() => handleSelectLanguage(code)}
          className={`${currentSelectedLanguage === code ? 'active' : ''}`}>
          {name}
        </Navbar.Dropdown.Item>
      ))}
    </Navbar.Dropdown>
  )
}
