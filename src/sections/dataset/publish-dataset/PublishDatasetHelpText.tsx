import { useTranslation, Trans } from 'react-i18next'
import styles from './PublishDatasetHelpText.module.scss'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
}

export function PublishDatasetHelpText({ releasedVersionExists }: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('publishDataset')
  const cc0Link = 'https://creativecommons.org/publicdomain/zero/1.0/'
  return (
    <>
      {!releasedVersionExists && <p className={styles.warningText}>{t('draftQuestion')}</p>}
      {releasedVersionExists && (
        <p className={styles.warningText}>{t('previouslyReleasedQuestion')}</p>
      )}
      <div className={styles.container}>
        <Trans
          t={t}
          i18nKey="termsText1"
          values={{ cc0Link }}
          components={{ a: <a href={cc0Link} /> }}
        />
        <p>{t('termsText2')}</p>
      </div>
    </>
  )
}
