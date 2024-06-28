import { useTranslation } from 'react-i18next'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
}

export function PublishDatasetHelpText({ releasedVersionExists }: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('publishDataset')

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
        <p>{t('termsText1')}</p>
        <p>{t('termsText2')}</p>
      </div>
    </>
  )
}
