import { useTranslation } from 'react-i18next'
import { useDataset } from '../dataset/DatasetContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useEffect } from 'react'
import { useLoading } from '../loading/LoadingContext'
import { PageNotFound } from '../page-not-found/PageNotFound'

interface EditDatasetMetadataProps {
  somethingElse?: string
}

export const EditDatasetMetadata = ({ somethingElse }: EditDatasetMetadataProps) => {
  const { t } = useTranslation('editDatasetMetadata')
  const { dataset, isLoading } = useDataset()
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <div>
          <BreadcrumbsGenerator
            hierarchy={dataset?.hierarchy}
            withActionItem
            actionItemText={t('breadcrumbActionItem')}
          />
          <p>Edit Dataset Metadata page</p>
          <p>
            Persistent Id is :<strong>{dataset.persistentId}</strong>
          </p>
        </div>
      )}
    </>
  )
}
