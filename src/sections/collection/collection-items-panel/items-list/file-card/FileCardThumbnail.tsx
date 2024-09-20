import { FileItemTypePreview } from '../../../../../collection/domain/models/FileItemTypePreview'
import { PublicationStatus } from '../../../../../shared/core/domain/models/PublicationStatus'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Route } from '../../../../Route.enum'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import { FileCardHelper } from './FileCardHelper'
import styles from './FileCard.module.scss'

interface FileCardThumbnailProps {
  filePreview: FileItemTypePreview
  thumbnail?: string
}

export function FileCardThumbnail({ filePreview }: FileCardThumbnailProps) {
  console.log({ filePreview })

  return (
    <div className={styles.thumbnail}>
      <LinkToPage
        page={Route.FILES}
        type={DvObjectType.FILE}
        searchParams={FileCardHelper.getFileSearchParams(
          filePreview.id,
          filePreview.publicationStatuses.includes(PublicationStatus.Draft)
        )}>
        asd
        {/* <FileThumbnail file={filePreview} /> */}
      </LinkToPage>
    </div>
  )
}
