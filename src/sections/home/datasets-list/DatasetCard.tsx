import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { LinkToPage } from '../../shared/link-to-page/LinkToPage'
import { Route } from '../../Route.enum'

interface DatasetCardProps {
  dataset: DatasetPreview
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <article key={dataset.persistentId}>
      <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
        {dataset.title}
      </LinkToPage>
    </article>
  )
}
