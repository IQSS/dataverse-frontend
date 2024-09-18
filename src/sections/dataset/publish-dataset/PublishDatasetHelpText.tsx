import { useTranslation, Trans } from 'react-i18next'
import styles from './PublishDatasetHelpText.module.scss'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
  parentCollectionIsReleased: boolean | undefined
}
function getWarningText(
  releasedVersionExists: boolean,
  parentCollectionIsReleased: boolean | undefined,
  t: (key: string) => string
): string {
  if (!releasedVersionExists) {
    if (!parentCollectionIsReleased) {
      return t('publish.releaseCollectionQuestion')
    } else {
      return t('publish.draftQuestion')
    }
  }
  return t('publish.previouslyReleasedQuestion')
}
export function PublishDatasetHelpText({
  releasedVersionExists,
  parentCollectionIsReleased
}: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('dataset')
  const cc0Link = 'https://creativecommons.org/publicdomain/zero/1.0/'
  return (
    <>
      {getWarningText(releasedVersionExists, parentCollectionIsReleased, t)}
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
