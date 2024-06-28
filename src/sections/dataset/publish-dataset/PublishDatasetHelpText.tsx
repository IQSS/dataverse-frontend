import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
}

export function PublishDatasetHelpText({ releasedVersionExists }: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('publishDataset')
  const cc0Link = 'https://creativecommons.org/publicdomain/zero/1.0/'
  return (
    <>
      {!releasedVersionExists && <p>{t('draftQuestion')}</p>}
      {releasedVersionExists && <p>{t('previouslyReleasedQuestion')}</p>}
      <div
        style={{
          border: '1px solid black',
          padding: '10px',
          margin: '10px',
          backgroundColor: 'rgb(220, 220, 220)'
        }}>
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
