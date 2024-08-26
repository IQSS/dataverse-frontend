import { Trans, useTranslation } from 'react-i18next'
import styles from './UserPanel.module.scss'

export const ApiTokenSection = () => {
  const { t } = useTranslation('userPanel', { keyPrefix: 'apiToken' })

  return (
    <div>
      <p className={styles['helper-text']}>
        <Trans
          t={t}
          i18nKey="helperText"
          components={{
            anchor: (
              <a
                href="http://guides.dataverse.org/en/latest/api"
                target="_blank"
                rel="noreferrer"
              />
            )
          }}
        />
      </p>
    </div>
  )
}
