import { Trans, useTranslation } from 'react-i18next'
import styles from './ItemsList.module.scss'

export const NoSearchMatchesMessage = () => {
  const { t } = useTranslation('collection')

  return (
    <div className={styles['custom-message-container']}>
      <Trans
        t={t}
        i18nKey="noSearchMatches"
        components={{
          anchor: (
            <a
              href="https://guides.dataverse.org/en/latest/user/find-use-data.html"
              target="_blank"
              rel="noreferrer"
            />
          )
        }}
      />
    </div>
  )
}
