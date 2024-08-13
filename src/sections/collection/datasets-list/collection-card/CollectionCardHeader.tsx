import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FileType } from '../../../../files/domain/models/FileMetadata'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'
import styles from './CollectionCard.module.scss'
import { Icon, IconName } from '@iqss/dataverse-design-system'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { CollectionCardHelper } from './CollectionCardHelper'

interface CollectionCardHeaderProps {
  collectionPreview: CollectionPreview
}

export function CollectionCardHeader({ collectionPreview }: CollectionCardHeaderProps) {
  const iconFileType = new FileType('text/tab-separated-values', 'Comma Separated Values')
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <LinkToPage
            page={Route.COLLECTIONS}
            searchParams={{ id: collectionPreview.id.toString() }}>
            {collectionPreview.name}
          </LinkToPage>
          {collectionPreview.affiliation && (
            <span className={styles.affiliation}> ({collectionPreview.affiliation})</span>
          )}
          <DatasetLabels labels={CollectionCardHelper.getLabel(collectionPreview.isReleased)} />
        </div>
        <div className={styles.icon}>
          <Icon name={IconName.COLLECTION} />
        </div>
      </div>
    </>
  )
}
