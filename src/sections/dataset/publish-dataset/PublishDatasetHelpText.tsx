import { useTranslation, Trans } from 'react-i18next'
import styles from './PublishDatasetHelpText.module.scss'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
  parentCollectionIsReleased: boolean | undefined
  parentCollectionName: string
}
function getWarningText(
  releasedVersionExists: boolean,
  parentCollectionIsReleased: boolean | undefined,
  parentCollectionName: string
): { key: string; parentCollectionName?: string } {
  if (!releasedVersionExists) {
    if (!parentCollectionIsReleased) {
      return {
        key: 'publish.releaseCollectionQuestion',
        parentCollectionName: parentCollectionName
      }
    } else {
      return { key: 'publish.draftQuestion' }
    }
  }
  return { key: 'publish.previouslyReleasedQuestion' }
}
export function PublishDatasetHelpText({
  releasedVersionExists,
  parentCollectionIsReleased,
  parentCollectionName
}: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('dataset')
  const cc0Link = 'https://creativecommons.org/publicdomain/zero/1.0/'
  const warningText = getWarningText(
    releasedVersionExists,
    parentCollectionIsReleased,
    parentCollectionName
  )

  return (
    <>
      {t(warningText.key, { parentCollectionName: warningText.parentCollectionName })}
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
