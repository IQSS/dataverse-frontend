import { useEffect } from 'react'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'

interface EditDatasetFilesProps {
  fileRepository: FileRepository
}

export const EditDatasetFiles = ({ fileRepository: _fileRepository }: EditDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()

  console.log(dataset)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <p>Temporary Loading until having shape of skeleton</p>
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbsGenerator hierarchy={dataset.hierarchy} />
          <article>
            <p>Metadata Files uploading goes here</p>
          </article>
        </>
      )}
    </>
  )
}
