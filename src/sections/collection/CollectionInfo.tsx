import { useTranslation } from 'react-i18next'
import TurndownService from 'turndown'
import { Badge, Tooltip } from '@iqss/dataverse-design-system'
import { Collection } from '../../collection/domain/models/Collection'
import { DatasetLabelSemanticMeaning } from '../../dataset/domain/models/Dataset'
import { MarkdownComponent } from '../dataset/markdown/MarkdownComponent'
import { ExpandableContent } from '../shared/expandable-content/ExpandableContent'
import styles from './Collection.module.scss'

interface CollectionInfoProps {
  collection: Collection
}
const turndownService = new TurndownService()

export function CollectionInfo({ collection }: CollectionInfoProps) {
  const { t } = useTranslation('collection')
  const { t: tShared } = useTranslation('shared')

  return (
    <>
      <header className={styles.header}>
        <h1>{collection.name}</h1>
        <div className={styles.infoContainer}>
          {collection.affiliation && (
            <span className={styles.subtext}>({collection.affiliation})</span>
          )}
          {!collection.isReleased && (
            <div>
              <Tooltip
                placement="top"
                overlay={tShared('statusLabels.collection.unpublished')}
                maxWidth={300}>
                <Badge variant={DatasetLabelSemanticMeaning.WARNING}>{t('unpublished')}</Badge>
              </Tooltip>
            </div>
          )}
        </div>
      </header>
      {collection.description && (
        <ExpandableContent contentName={t('description')}>
          <MarkdownComponent markdown={turndownService.turndown(collection.description)} />
        </ExpandableContent>
      )}
    </>
  )
}
