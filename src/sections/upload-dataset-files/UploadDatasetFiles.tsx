import { useEffect } from 'react'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { FileUploadState, FileUploader } from './FileUploader'
import { FileSize, FileSizeUnit } from '../../files/domain/models/FileMetadata'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({
  fileRepository: _fileRepository
}: UploadDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()

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
            <FileUploader
              upload={function (files: File[]): Map<string, FileUploadState> {
                const res = new Map<string, FileUploadState>()
                files.forEach((f) => {
                  const key = f.webkitRelativePath + f.name
                  const value: FileUploadState = {
                    progress: Math.random() * 100,
                    fileSizeString: new FileSize(f.size, FileSizeUnit.BYTES).toString(),
                    failed: Math.random() > 0.9,
                    done: false,
                    removed: Math.random() > 0.95
                  }
                  res.set(key, value)
                })
                return res
              }}
              cancelTitle={'Cancel upload'}
              info={'Drag and drop files here.'}
              selectText={'Select Files to Add'}
            />
          </article>
        </>
      )}
    </>
  )
}
