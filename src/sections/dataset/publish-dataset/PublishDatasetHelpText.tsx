import { useTranslation, Trans } from 'react-i18next'
import styles from './PublishDatasetHelpText.module.scss'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
}

export function PublishDatasetHelpText({ releasedVersionExists }: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('dataset')
  const cc0Link = 'https://creativecommons.org/publicdomain/zero/1.0/'
  return (
    <>
      {!releasedVersionExists && <p className={styles.warningText}>{t('publish.draftQuestion')}</p>}
      {releasedVersionExists && (
        <p className={styles.warningText}>{t('publish.previouslyReleasedQuestion')}</p>
      )}
      <div className={styles.container}>
        <Trans
          t={t}
          i18nKey="publish.termsText1"
          values={{ cc0Link }}
          components={{ a: <a href={cc0Link} /> }}
        />
        <p>{t('publish.termsText2')}</p>
      </div>
    </>
  )
}
