import { useTranslation, Trans } from 'react-i18next'
import { RouteWithParams } from '@/sections/Route.enum'
import { Link } from 'react-router-dom'
import { Stack } from '@iqss/dataverse-design-system'
import styles from './PublishDatasetHelpText.module.scss'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
  parentCollectionIsReleased: boolean | undefined
  parentCollectionName: string
  parentCollectionId: string
}

function getWarningTextKey(
  releasedVersionExists: boolean,
  parentCollectionIsReleased: boolean | undefined
): string {
  if (!releasedVersionExists) {
    if (!parentCollectionIsReleased) {
      return 'publish.releaseCollectionQuestion'
    } else return 'publish.draftQuestion'
  }
  return 'publish.previouslyReleasedQuestion'
}

export function PublishDatasetHelpText({
  releasedVersionExists,
  parentCollectionIsReleased,
  parentCollectionName,
  parentCollectionId
}: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('dataset')
  const warningText = getWarningTextKey(releasedVersionExists, parentCollectionIsReleased)

  return (
    <Stack direction="vertical">
      <div className={styles.warningText}>
        {!parentCollectionIsReleased ? (
          <Trans
            t={t}
            i18nKey={warningText}
            values={{ parentCollectionName }}
            components={{ a: <Link to={RouteWithParams.COLLECTIONS(parentCollectionId)} /> }}
          />
        ) : (
          <p>{t(warningText)}</p>
        )}
      </div>
      <p>{t('publish.termsText')}</p>
    </Stack>
  )
}
