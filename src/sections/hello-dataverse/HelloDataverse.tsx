import logo from '../ui/logo.svg'
import styles from './HelloDataverse.module.scss'
import { Trans, useTranslation } from 'react-i18next'
import { getDataverseVersion } from 'js-dataverse/dist/info'
import { Button } from 'react-bootstrap'

export function HelloDataverse() {
  const { t } = useTranslation('helloDataverse')

  const getVersion = async () => {
    await getDataverseVersion.execute().then((result) => {
      window.prompt(result.number)
    })
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{t('title')}</h2>
      <img src={logo} className={styles.logo} alt={t('altImage')} />
      <p>
        <Trans t={t} i18nKey="description" components={{ 1: <code /> }} />
      </p>
      <Button onClick={() => void getVersion()}>Get version</Button>
      <a
        className={styles.link}
        href="https://dataverse.org"
        target="_blank"
        rel="noopener noreferrer">
        {t('linkText')}
      </a>
    </section>
  )
}
